/**
 * Pesticides Model
 *
 * Acceso de solo lectura al catálogo de pesticidas y sus recomendaciones por
 * cultivo (sembrado en el seed #2). Solo SQL parametrizado.
 */

import pool from '../../../../db.js'

// Campos de la recomendación que necesitan el formulario (#17) y el motor de alertas (#18).
const RECOMMENDATION_FIELDS = `
    r.id_recommendation, r.crop, r.id_pesticide,
    p.name AS pesticide_name, p.active_ingredient,
    r.recommended_dose, r.dose_unit, r.frequency_days, r.withdrawal_days`

class PesticidesModel {
    static async findAll() {
        const result = await pool.query(
            `SELECT id_pesticide, name, active_ingredient
             FROM pesticides WHERE is_active = TRUE ORDER BY name`,
        )
        return result.rows
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT id_pesticide, name, active_ingredient
             FROM pesticides WHERE id_pesticide = $1 AND is_active = TRUE`,
            [id],
        )
        return result.rows[0]
    }

    // Productos recomendados para un cultivo, con sus parámetros de uso.
    static async findRecommendationsByCrop(crop) {
        const result = await pool.query(
            `SELECT ${RECOMMENDATION_FIELDS}
             FROM crop_recommendations r
             JOIN pesticides p ON p.id_pesticide = r.id_pesticide
             WHERE r.crop = $1 AND r.is_active = TRUE AND p.is_active = TRUE
             ORDER BY p.name`,
            [crop],
        )
        return result.rows
    }

    // Recomendación puntual para la combinación cultivo–pesticida.
    static async findRecommendation(crop, idPesticide) {
        const result = await pool.query(
            `SELECT ${RECOMMENDATION_FIELDS}
             FROM crop_recommendations r
             JOIN pesticides p ON p.id_pesticide = r.id_pesticide
             WHERE r.crop = $1 AND r.id_pesticide = $2 AND r.is_active = TRUE`,
            [crop, idPesticide],
        )
        return result.rows[0]
    }
}

export default PesticidesModel
