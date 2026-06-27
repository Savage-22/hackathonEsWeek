import FarmersModel from '../infrastructure/farmers.Model.js'
import { ConflictError, NotFoundError } from '../../../shared/errors.js'

/**
 * Farmers Service
 *
 * Reglas de negocio del agricultor. La unicidad de DNI se valida aquí para
 * devolver 409 (ConflictError) en vez de dejar que el UNIQUE de la BD reviente
 * en 500.
 */
class FarmersService {
    static async list({ includeInactive } = {}) {
        return FarmersModel.findAll({ includeInactive })
    }

    static async getById(id) {
        const farmer = await FarmersModel.findById(id)
        if (!farmer) throw new NotFoundError('Agricultor no encontrado')
        return farmer
    }

    static async create(data) {
        const existing = await FarmersModel.findByDni(data.dni)
        if (existing) throw new ConflictError('Ya existe un agricultor con ese DNI')
        return FarmersModel.create(data)
    }

    static async update(id, data) {
        // Si cambia el DNI, no debe chocar con el de otro agricultor.
        if (data.dni !== undefined) {
            const existing = await FarmersModel.findByDni(data.dni)
            if (existing && existing.id_farmer !== id) {
                throw new ConflictError('Ya existe un agricultor con ese DNI')
            }
        }

        const updated = await FarmersModel.update(id, data)
        // Sin fila: no existe o está dado de baja (no se actualizan inactivos).
        if (!updated) throw new NotFoundError('Agricultor no encontrado')
        return updated
    }

    static async deactivate(id) {
        const deactivated = await FarmersModel.deactivate(id)
        if (!deactivated) throw new NotFoundError('Agricultor no encontrado')
        return deactivated
    }
}

export default FarmersService
