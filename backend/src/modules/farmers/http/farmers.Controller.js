import FarmersService from '../application/farmers.Service.js'

class FarmersController {
    // GET /api/farmers — por defecto solo activos (?includeInactive=true para todos).
    static async list(req, res, next) {
        try {
            const includeInactive = req.query.includeInactive === 'true'
            const data = await FarmersService.list({ includeInactive })
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/farmers/:id
    static async getById(req, res, next) {
        try {
            const data = await FarmersService.getById(Number(req.params.id))
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    // POST /api/farmers
    static async create(req, res, next) {
        try {
            const data = await FarmersService.create(req.body)
            return res.status(201).json({ success: true, message: 'Agricultor creado', data })
        } catch (error) {
            next(error)
        }
    }

    // PUT /api/farmers/:id
    static async update(req, res, next) {
        try {
            const data = await FarmersService.update(Number(req.params.id), req.body)
            return res.status(200).json({ success: true, message: 'Agricultor actualizado', data })
        } catch (error) {
            next(error)
        }
    }

    // DELETE /api/farmers/:id — baja lógica (is_active = false).
    static async deactivate(req, res, next) {
        try {
            const data = await FarmersService.deactivate(Number(req.params.id))
            return res.status(200).json({ success: true, message: 'Agricultor dado de baja', data })
        } catch (error) {
            next(error)
        }
    }
}

export default FarmersController
