import PlotsService from '../application/plots.Service.js'

// El id del agricultor sale del token (req.user.id), nunca del cliente.
class PlotsController {
    // GET /api/plots — parcelas del agricultor autenticado.
    static async list(req, res, next) {
        try {
            const includeInactive = req.query.includeInactive === 'true'
            const data = await PlotsService.listForFarmer(req.user.id, { includeInactive })
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/plots/:id
    static async getById(req, res, next) {
        try {
            const data = await PlotsService.getForFarmer(Number(req.params.id), req.user.id)
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    // POST /api/plots
    static async create(req, res, next) {
        try {
            const data = await PlotsService.create(req.user.id, req.body)
            return res.status(201).json({ success: true, message: 'Parcela creada', data })
        } catch (error) {
            next(error)
        }
    }

    // PUT /api/plots/:id
    static async update(req, res, next) {
        try {
            const data = await PlotsService.update(Number(req.params.id), req.user.id, req.body)
            return res.status(200).json({ success: true, message: 'Parcela actualizada', data })
        } catch (error) {
            next(error)
        }
    }

    // DELETE /api/plots/:id — baja lógica (is_active = false).
    static async deactivate(req, res, next) {
        try {
            const data = await PlotsService.deactivate(Number(req.params.id), req.user.id)
            return res.status(200).json({ success: true, message: 'Parcela dada de baja', data })
        } catch (error) {
            next(error)
        }
    }
}

export default PlotsController
