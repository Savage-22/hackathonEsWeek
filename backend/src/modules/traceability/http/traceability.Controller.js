import TraceabilityService from '../application/traceability.Service.js'

class TraceabilityController {
    // POST /api/traceability/batches — cierra producción y genera el lote.
    static async generateBatch(req, res, next) {
        try {
            const batch = await TraceabilityService.generateBatch(req.user.id, {
                id_plot: Number(req.body.id_plot),
                local_id: req.body.local_id,
            })
            return res.status(201).json({ success: true, message: 'Lote generado', data: batch })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/traceability/:code — ficha pública (sin auth) que abre el comprador.
    static async getPublic(req, res, next) {
        try {
            const data = await TraceabilityService.getPublicByCode(req.params.code)
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }
}

export default TraceabilityController
