/**
 * Plots Model
 *
 * Acceso a datos de parcelas. Toda consulta lleva el id_farmer como filtro: el
 * scoping por agricultor se garantiza en SQL, no se confía en filtros del lado
 * de aplicación. Las reglas (no encontrado) viven en el Service.
 */

import pool from '../../../../db.js'

// Columnas editables de la parcela. El id_farmer nunca llega del cliente.
const COLUMNS = [
    'name',
    'area_ha',
    'latitude',
    'longitude',
    'crop',
    'planting_date',
    'estimated_harvest_date',
]

const PUBLIC_FIELDS = `
    id_plot, id_farmer, name, area_ha, latitude, longitude, crop,
    planting_date, estimated_harvest_date, is_active, created_at, updated_at`

class PlotsModel {
    static async findByFarmer(farmerId, { includeInactive = false } = {}) {
        const activeFilter = includeInactive ? '' : 'AND is_active = TRUE'
        const result = await pool.query(
            `SELECT ${PUBLIC_FIELDS} FROM plots
             WHERE id_farmer = $1 ${activeFilter}
             ORDER BY name`,
            [farmerId],
        )
        return result.rows
    }

    // Scoping: una parcela de otro agricultor es indistinguible de inexistente.
    static async findByIdForFarmer(id, farmerId) {
        const result = await pool.query(
            `SELECT ${PUBLIC_FIELDS} FROM plots
             WHERE id_plot = $1 AND id_farmer = $2 AND is_active = TRUE`,
            [id, farmerId],
        )
        return result.rows[0]
    }

    static async create(farmerId, data) {
        const insertCols = ['id_farmer', ...COLUMNS]
        const values = [farmerId, ...COLUMNS.map((c) => data[c] ?? null)]
        const placeholders = values.map((_, i) => `$${i + 1}`)
        const result = await pool.query(
            `INSERT INTO plots (${insertCols.join(', ')})
             VALUES (${placeholders.join(', ')})
             RETURNING ${PUBLIC_FIELDS}`,
            values,
        )
        return result.rows[0]
    }

    static async update(id, farmerId, data) {
        const present = COLUMNS.filter((c) => data[c] !== undefined)
        if (present.length === 0) return undefined

        const sets = present.map((c, i) => `${c} = $${i + 3}`)
        const values = present.map((c) => data[c])
        const result = await pool.query(
            `UPDATE plots SET ${sets.join(', ')}
             WHERE id_plot = $1 AND id_farmer = $2 AND is_active = TRUE
             RETURNING ${PUBLIC_FIELDS}`,
            [id, farmerId, ...values],
        )
        return result.rows[0]
    }

    static async deactivate(id, farmerId) {
        const result = await pool.query(
            `UPDATE plots SET is_active = FALSE
             WHERE id_plot = $1 AND id_farmer = $2 AND is_active = TRUE
             RETURNING ${PUBLIC_FIELDS}`,
            [id, farmerId],
        )
        return result.rows[0]
    }
}

export default PlotsModel
