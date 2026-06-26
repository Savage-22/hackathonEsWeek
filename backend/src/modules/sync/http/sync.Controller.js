import SyncService from '../application/sync.Service.js'

class SyncController {
    // POST /api/sync — sube el batch offline y devuelve los serverId asignados.
    static async push(req, res, next) {
        try {
            const applied = await SyncService.push(req.user.id, req.body.operations)
            return res.status(200).json({
                success: true,
                message: 'Sincronización aplicada',
                data: { applied },
            })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/sync?since= — baja los cambios del agricultor para refrescar el dispositivo.
    static async pull(req, res, next) {
        try {
            const data = await SyncService.pull(req.user.id, req.query.since)
            return res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }
}

export default SyncController
