import PlotsModel from '../infrastructure/plots.Model.js'
import { NotFoundError } from '../../../shared/errors.js'

/**
 * Plots Service
 *
 * Reglas de negocio de parcelas. El id_farmer siempre sale del token (lo pasa
 * el controller), nunca del payload: un agricultor solo gestiona lo suyo. Por
 * eso una parcela ajena se trata como inexistente (404), sin filtrar su existencia.
 */
class PlotsService {
    static async listForFarmer(farmerId, { includeInactive } = {}) {
        return PlotsModel.findByFarmer(farmerId, { includeInactive })
    }

    static async getForFarmer(id, farmerId) {
        const plot = await PlotsModel.findByIdForFarmer(id, farmerId)
        if (!plot) throw new NotFoundError('Parcela no encontrada')
        return plot
    }

    static async create(farmerId, data) {
        return PlotsModel.create(farmerId, data)
    }

    static async update(id, farmerId, data) {
        // Verificar propiedad antes de actualizar: separa "no existe/ajena" de
        // "no hay campos que cambiar".
        await PlotsService.getForFarmer(id, farmerId)
        const updated = await PlotsModel.update(id, farmerId, data)
        return updated ?? (await PlotsModel.findByIdForFarmer(id, farmerId))
    }

    static async deactivate(id, farmerId) {
        const deactivated = await PlotsModel.deactivate(id, farmerId)
        if (!deactivated) throw new NotFoundError('Parcela no encontrada')
        return deactivated
    }
}

export default PlotsService
