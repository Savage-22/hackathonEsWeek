/**
 * Farmers Model
 *
 * Acceso a datos de agricultores. Solo SQL parametrizado; las reglas de negocio
 * (conflicto de DNI, no encontrado) viven en el Service.
 */

import pool from '../../../../db.js'

// Columnas editables del agricultor. El cliente nunca decide nombres de columna.
const COLUMNS = ['name', 'dni', 'community', 'district', 'province', 'phone', 'association']

// Lo que se devuelve al exterior: nunca el password_hash.
const PUBLIC_FIELDS = `
    id_farmer, name, dni, community, district, province, phone, association,
    is_active, created_at, updated_at`

class FarmersModel {
    static async findByDni(dni) {
        const result = await pool.query(
            'SELECT id_farmer, dni, is_active FROM farmers WHERE dni = $1',
            [dni],
        )
        return result.rows[0]
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT ${PUBLIC_FIELDS} FROM farmers WHERE id_farmer = $1`,
            [id],
        )
        return result.rows[0]
    }

    static async findAll({ includeInactive = false } = {}) {
        const where = includeInactive ? '' : 'WHERE is_active = TRUE'
        const result = await pool.query(
            `SELECT ${PUBLIC_FIELDS} FROM farmers ${where} ORDER BY name`,
        )
        return result.rows
    }

    static async create(data) {
        const values = COLUMNS.map((c) => data[c] ?? null)
        const placeholders = COLUMNS.map((_, i) => `$${i + 1}`)
        const result = await pool.query(
            `INSERT INTO farmers (${COLUMNS.join(', ')})
             VALUES (${placeholders.join(', ')})
             RETURNING ${PUBLIC_FIELDS}`,
            values,
        )
        return result.rows[0]
    }

    /**
     * Actualización parcial: solo toca las columnas presentes en `data`. Si no
     * llega ninguna columna válida, devuelve undefined y el Service decide.
     */
    static async update(id, data) {
        const present = COLUMNS.filter((c) => data[c] !== undefined)
        if (present.length === 0) return undefined

        const sets = present.map((c, i) => `${c} = $${i + 2}`)
        const values = present.map((c) => data[c])
        const result = await pool.query(
            `UPDATE farmers SET ${sets.join(', ')}
             WHERE id_farmer = $1 AND is_active = TRUE
             RETURNING ${PUBLIC_FIELDS}`,
            [id, ...values],
        )
        return result.rows[0]
    }

    static async deactivate(id) {
        const result = await pool.query(
            `UPDATE farmers SET is_active = FALSE
             WHERE id_farmer = $1 AND is_active = TRUE
             RETURNING ${PUBLIC_FIELDS}`,
            [id],
        )
        return result.rows[0]
    }
}

export default FarmersModel
