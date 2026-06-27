/**
 * Stats Model
 *
 * Consultas de agregación para el panel institucional (#23). Solo lectura; todas
 * las agrupaciones se calculan en la BD. Sin entrada de usuario interpolada: los
 * pocos parámetros (límites) van como placeholders.
 *
 * Nota sobre los COUNT(DISTINCT ...): al unir parcelas, aplicaciones y lotes en
 * una misma fila se produce fan-out (producto cartesiano). DISTINCT evita inflar
 * los conteos por las filas duplicadas.
 */
import pool from '../../../../db.js'

class StatsModel {
    // KPIs globales en una sola consulta.
    static async kpis() {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM farmers WHERE is_active = TRUE)::int      AS farmers,
                (SELECT COUNT(*) FROM plots WHERE is_active = TRUE)::int        AS plots,
                (SELECT COUNT(*) FROM applications WHERE is_active = TRUE)::int  AS applications,
                (SELECT COUNT(DISTINCT p.id_farmer)
                   FROM batches b
                   JOIN plots p ON p.id_plot = b.id_plot
                  WHERE b.is_active = TRUE)::int                                AS certified_farmers
        `)
        return result.rows[0]
    }

    // Aplicaciones agrupadas por distrito del agricultor.
    static async applicationsByDistrict() {
        const result = await pool.query(`
            SELECT COALESCE(f.district, 'Sin distrito') AS district,
                   COUNT(a.id_application)::int          AS count
            FROM applications a
            JOIN plots p   ON p.id_plot   = a.id_plot
            JOIN farmers f ON f.id_farmer = p.id_farmer
            WHERE a.is_active = TRUE
            GROUP BY COALESCE(f.district, 'Sin distrito')
            ORDER BY count DESC
        `)
        return result.rows
    }

    // Pesticidas más usados (por número de aplicaciones).
    static async topPesticides(limit = 5) {
        const result = await pool.query(
            `
            SELECT ps.name,
                   ps.active_ingredient,
                   COUNT(a.id_application)::int AS count
            FROM applications a
            JOIN pesticides ps ON ps.id_pesticide = a.id_pesticide
            WHERE a.is_active = TRUE
            GROUP BY ps.name, ps.active_ingredient
            ORDER BY count DESC
            LIMIT $1
        `,
            [limit],
        )
        return result.rows
    }

    // Cumplimiento por distrito: agricultores totales vs. certificados (con lote).
    static async complianceByDistrict() {
        const result = await pool.query(`
            SELECT COALESCE(f.district, 'Sin distrito') AS district,
                   COUNT(DISTINCT f.id_farmer)::int      AS farmers,
                   COUNT(DISTINCT cert.id_farmer)::int   AS certified
            FROM farmers f
            LEFT JOIN (
                SELECT DISTINCT p.id_farmer
                FROM batches b
                JOIN plots p ON p.id_plot = b.id_plot
                WHERE b.is_active = TRUE
            ) cert ON cert.id_farmer = f.id_farmer
            WHERE f.is_active = TRUE
            GROUP BY COALESCE(f.district, 'Sin distrito')
            ORDER BY farmers DESC
        `)
        return result.rows
    }

    // Ranking/tabla de agricultores con sus parcelas, aplicaciones y certificación.
    static async farmerRanking() {
        const result = await pool.query(`
            SELECT f.id_farmer                       AS id,
                   f.name,
                   f.district,
                   f.community,
                   f.association,
                   COUNT(DISTINCT p.id_plot)::int        AS plots,
                   COUNT(DISTINCT a.id_application)::int  AS applications,
                   (COUNT(DISTINCT b.id_batch) > 0)      AS certified
            FROM farmers f
            LEFT JOIN plots p        ON p.id_farmer = f.id_farmer AND p.is_active = TRUE
            LEFT JOIN applications a  ON a.id_plot   = p.id_plot   AND a.is_active = TRUE
            LEFT JOIN batches b      ON b.id_plot    = p.id_plot   AND b.is_active = TRUE
            WHERE f.is_active = TRUE
            GROUP BY f.id_farmer
            ORDER BY applications DESC, plots DESC, f.name ASC
        `)
        return result.rows
    }

    // Parcelas georreferenciadas para el mapa.
    static async plotsForMap() {
        const result = await pool.query(`
            SELECT p.id_plot   AS id,
                   p.name,
                   p.crop,
                   p.latitude,
                   p.longitude,
                   f.name       AS farmer,
                   f.district
            FROM plots p
            JOIN farmers f ON f.id_farmer = p.id_farmer
            WHERE p.is_active = TRUE
              AND p.latitude IS NOT NULL
              AND p.longitude IS NOT NULL
            ORDER BY p.id_plot
        `)
        return result.rows
    }
}

export default StatsModel
