import PesticidesService from '../application/pesticides.Service.js'

class PesticidesController {
    // GET /api/pesticides — catálogo completo de productos activos.
    static async list(req, res, next) {
        try {
            const data = await PesticidesService.list()
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/pesticides/recommendations?crop=Papa — productos recomendados para el cultivo.
    static async recommendationsByCrop(req, res, next) {
        try {
            const data = await PesticidesService.recommendationsByCrop(req.query.crop)
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/pesticides/recommendations/:crop/:idPesticide — dosis/frecuencia/carencia de la combinación.
    static async getRecommendation(req, res, next) {
        try {
            const data = await PesticidesService.getRecommendation(
                req.params.crop,
                Number(req.params.idPesticide),
            )
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }
}

export default PesticidesController
