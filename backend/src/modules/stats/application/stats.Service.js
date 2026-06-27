/**
 * Stats Service
 *
 * Orquesta las consultas de agregados (#23) y normaliza tipos para el panel:
 * Postgres devuelve NUMERIC (lat/lng) como string, así que se convierten a
 * número aquí para que el frontend no tenga que parsear.
 */
import StatsModel from '../infrastructure/stats.Model.js'

class StatsService {
    // Resumen para las tarjetas/gráficos del panel.
    static async getOverview() {
        const [kpis, applicationsByDistrict, topPesticides, complianceByDistrict] = await Promise.all([
            StatsModel.kpis(),
            StatsModel.applicationsByDistrict(),
            StatsModel.topPesticides(),
            StatsModel.complianceByDistrict(),
        ])

        return { kpis, applicationsByDistrict, topPesticides, complianceByDistrict }
    }

    // Tabla/ranking de agricultores.
    static async getFarmers() {
        return StatsModel.farmerRanking()
    }

    // Parcelas para el mapa, con coordenadas ya numéricas.
    static async getPlots() {
        const rows = await StatsModel.plotsForMap()
        return rows.map((row) => ({
            ...row,
            latitude: Number(row.latitude),
            longitude: Number(row.longitude),
        }))
    }
}

export default StatsService
