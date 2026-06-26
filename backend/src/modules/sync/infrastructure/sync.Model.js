/**
 * Sync Model
 *
 * Acceso a datos para la sincronización offline. Construye SQL parametrizado a
 * partir de la configuración estática de cada entidad (los nombres de columna
 * vienen del registro del Service, nunca del cliente: sin riesgo de inyección).
 */

import pool from '../../../../db.js'
import { ForbiddenError } from '../../../shared/errors.js'

class SyncModel {
    /**
     * Inserta o actualiza un registro de forma idempotente por `local_id`.
     * Reenviar la misma operación (mismo local_id) no duplica: cae en el
     * ON CONFLICT y devuelve el id ya asignado. El UPDATE solo procede si el
     * registro pertenece al agricultor, de modo que nadie sincroniza datos ajenos.
     */
    static async upsertByLocalId({ table, idColumn, columns }, farmerId, localUid, data) {
        const insertCols = ['id_farmer', ...columns, 'local_id']
        const values = [farmerId, ...columns.map((c) => data[c] ?? null), localUid]
        const placeholders = values.map((_, i) => `$${i + 1}`)
        // COALESCE: una actualización parcial no borra los campos que no llegaron.
        const updates = columns.map((c) => `${c} = COALESCE(EXCLUDED.${c}, ${table}.${c})`).join(', ')

        const sql = `
            INSERT INTO ${table} (${insertCols.join(', ')})
            VALUES (${placeholders.join(', ')})
            ON CONFLICT (local_id) DO UPDATE SET ${updates}
            WHERE ${table}.id_farmer = EXCLUDED.id_farmer
            RETURNING ${idColumn} AS server_id`

        const result = await pool.query(sql, values)
        // Sin fila devuelta: el local_id ya existe pero pertenece a otro agricultor.
        if (!result.rows[0]) {
            throw new ForbiddenError('No puedes sincronizar datos de otro agricultor')
        }
        return result.rows[0].server_id
    }

    /**
     * Cambios del agricultor posteriores a `since` (para el pull del dispositivo).
     */
    static async pullSince({ table, idColumn, columns }, farmerId, since) {
        const select = [idColumn, ...columns, 'local_id', 'updated_at'].join(', ')
        const result = await pool.query(
            `SELECT ${select} FROM ${table}
             WHERE id_farmer = $1 AND updated_at > $2 AND is_active = TRUE
             ORDER BY updated_at`,
            [farmerId, since],
        )
        return result.rows
    }
}

export default SyncModel
