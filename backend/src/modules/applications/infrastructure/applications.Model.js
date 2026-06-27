/**
 * Applications Model
 *
 * Acceso a datos de las aplicaciones de pesticida (núcleo de la trazabilidad).
 * Solo SQL parametrizado; la propiedad de la parcela y la validación de FKs
 * viven en el Service.
 */

import pool from '../../../../db.js'

// Lo que devuelve el historial: incluye el nombre del producto para mostrarlo
// sin que el cliente tenga que cruzar el catálogo.
const HISTORY_FIELDS = `
    a.id_application, a.id_plot, a.id_pesticide, p.name AS pesticide_name,
    a.applied_at, a.dose, a.quantity, a.photo_url, a.observations,
    a.created_at`

class ApplicationsModel {
    static async create(data) {
        const cols = ['id_plot', 'id_pesticide', 'applied_at', 'dose', 'quantity', 'photo_url', 'observations']
        const values = cols.map((c) => data[c] ?? null)
        const placeholders = cols.map((_, i) => `$${i + 1}`)
        const result = await pool.query(
            `INSERT INTO applications (${cols.join(', ')})
             VALUES (${placeholders.join(', ')})
             RETURNING id_application, id_plot, id_pesticide, applied_at, dose, quantity, photo_url, observations, created_at`,
            values,
        )
        return result.rows[0]
    }

    // Historial de una parcela, más reciente primero.
    static async findByPlot(plotId) {
        const result = await pool.query(
            `SELECT ${HISTORY_FIELDS}
             FROM applications a
             JOIN pesticides p ON p.id_pesticide = a.id_pesticide
             WHERE a.id_plot = $1 AND a.is_active = TRUE
             ORDER BY a.applied_at DESC`,
            [plotId],
        )
        return result.rows
    }
}

export default ApplicationsModel
