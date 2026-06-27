import StatsService from '../application/stats.Service.js'

class StatsController {
    // GET /api/stats/overview — KPIs y agregados para gráficos.
    static async getOverview(req, res, next) {
        try {
            const data = await StatsService.getOverview()
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/stats/farmers — ranking/tabla de agricultores.
    static async getFarmers(req, res, next) {
        try {
            const data = await StatsService.getFarmers()
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/stats/plots — parcelas georreferenciadas para el mapa.
    static async getPlots(req, res, next) {
        try {
            const data = await StatsService.getPlots()
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }
}

export default StatsController
