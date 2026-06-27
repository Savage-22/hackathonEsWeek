/**
 * Traceability Model
 *
 * Acceso a datos de los lotes (batches) y a la ficha pública de trazabilidad.
 * Solo SQL parametrizado; las reglas (propiedad de la parcela, enmascarado del
 * DNI) viven en el Service.
 */

import pool from '../../../../db.js'

class TraceabilityModel {
    static async findByLocalId(localId) {
        const result = await pool.query(
            `SELECT id_batch, id_plot, code, level, closed_at, local_id, created_at
             FROM batches WHERE local_id = $1`,
            [localId],
        )
        return result.rows[0]
    }

    /**
     * Inserta el lote de forma idempotente por `local_id`: reenviar la misma
     * operación offline no crea un lote nuevo (cae en ON CONFLICT y no devuelve
     * fila; el Service re-lee por local_id para obtener el código ya asignado).
     */
    static async insert(idPlot, code, localId) {
        const result = await pool.query(
            `INSERT INTO batches (id_plot, code, closed_at, local_id)
             VALUES ($1, $2, now(), $3)
             ON CONFLICT (local_id) DO NOTHING
             RETURNING id_batch, id_plot, code, level, closed_at, local_id, created_at`,
            [idPlot, code, localId],
        )
        return result.rows[0]
    }

    // Cabecera de la ficha pública: lote + parcela + agricultor.
    static async findSheetByCode(code) {
        const result = await pool.query(
            `SELECT
                 b.code, b.level, b.closed_at, b.created_at,
                 p.id_plot, p.name AS plot_name, p.crop, p.area_ha,
                 p.latitude, p.longitude, p.planting_date, p.estimated_harvest_date,
                 f.name AS farmer_name, f.dni AS farmer_dni,
                 f.community, f.district, f.province, f.association
             FROM batches b
             JOIN plots p   ON p.id_plot = b.id_plot
             JOIN farmers f ON f.id_farmer = p.id_farmer
             WHERE b.code = $1 AND b.is_active = TRUE`,
            [code],
        )
        return result.rows[0]
    }

    // Aplicaciones de la parcela para la ficha pública (con nombre del producto
    // y, si existe, la unidad/carencia recomendada).
    static async findApplicationsForSheet(idPlot, crop) {
        const result = await pool.query(
            `SELECT
                 a.applied_at, a.dose, a.quantity, a.photo_url, a.observations,
                 ps.name AS pesticide_name, ps.active_ingredient,
                 r.dose_unit, r.withdrawal_days
             FROM applications a
             JOIN pesticides ps ON ps.id_pesticide = a.id_pesticide
             LEFT JOIN crop_recommendations r
                 ON r.crop = $2 AND r.id_pesticide = a.id_pesticide AND r.is_active = TRUE
             WHERE a.id_plot = $1 AND a.is_active = TRUE
             ORDER BY a.applied_at`,
            [idPlot, crop],
        )
        return result.rows
    }
}

export default TraceabilityModel
