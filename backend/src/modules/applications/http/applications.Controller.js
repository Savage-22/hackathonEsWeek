import ApplicationsService from '../application/applications.Service.js'
import { publicUrlFor } from '../../../shared/middleware/upload.js'

class ApplicationsController {
    // POST /api/applications (multipart) — registra una aplicación con foto opcional.
    static async create(req, res, next) {
        try {
            const photoUrl = req.file ? publicUrlFor(req.file.filename) : null
            const data = {
                id_plot: Number(req.body.id_plot),
                id_pesticide: Number(req.body.id_pesticide),
                applied_at: req.body.applied_at,
                dose: Number(req.body.dose),
                quantity: req.body.quantity ? Number(req.body.quantity) : null,
                observations: req.body.observations || null,
                photo_url: photoUrl,
            }
            const application = await ApplicationsService.create(req.user.id, data)
            return res.status(201).json({ success: true, message: 'Aplicación registrada', data: application })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/applications?plotId= — historial de la parcela del agricultor.
    static async listByPlot(req, res, next) {
        try {
            const data = await ApplicationsService.listByPlot(req.user.id, Number(req.query.plotId))
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }
}

export default ApplicationsController
