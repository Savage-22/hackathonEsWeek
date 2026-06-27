import { randomBytes } from 'node:crypto'

import TraceabilityModel from '../infrastructure/traceability.Model.js'
import PlotsModel from '../../plots/infrastructure/plots.Model.js'
import { NotFoundError } from '../../../shared/errors.js'

/**
 * Traceability Service
 *
 * Genera el lote de producción de una parcela (propiedad del agricultor) y arma
 * la ficha pública de trazabilidad. La identidad del agricultor sale del token;
 * la consulta pública por código no requiere sesión y nunca expone el DNI completo.
 */

// Código legible y único del lote: AG-<parcela>-<aleatorio>. La unicidad final
// la garantiza el UNIQUE de la BD; con 6 hex el choque es despreciable.
function generateCode(idPlot) {
    return `AG-${idPlot}-${randomBytes(3).toString('hex').toUpperCase()}`
}

// No exponer el DNI completo: solo los últimos 4 dígitos.
function maskDni(dni) {
    if (!dni) return null
    return `••••${String(dni).slice(-4)}`
}

class TraceabilityService {
    /**
     * Cierra la producción de una parcela creando su lote. Idempotente por
     * `local_id`: reenviar la operación offline devuelve el mismo lote/código.
     */
    static async generateBatch(farmerId, { id_plot, local_id }) {
        const plot = await PlotsModel.findByIdForFarmer(id_plot, farmerId)
        if (!plot) throw new NotFoundError('Parcela no encontrada')

        const existing = await TraceabilityModel.findByLocalId(local_id)
        if (existing) return existing

        // Reintenta ante el choque (rarísimo) de código duplicado.
        for (let attempt = 0; attempt < 5; attempt += 1) {
            try {
                const created = await TraceabilityModel.insert(id_plot, generateCode(id_plot), local_id)
                // Sin fila: otro request con el mismo local_id ganó la carrera.
                return created ?? (await TraceabilityModel.findByLocalId(local_id))
            } catch (error) {
                if (error.code === '23505' && attempt < 4) continue // unique_violation en code
                throw error
            }
        }
        throw new Error('No se pudo generar un código de lote único')
    }

    /**
     * Ficha pública del lote por código. 404 si no existe. Sanitiza el DNI y
     * solo devuelve datos aptos para el comprador.
     */
    static async getPublicByCode(code) {
        const sheet = await TraceabilityModel.findSheetByCode(code)
        if (!sheet) throw new NotFoundError('Lote no encontrado')

        const applications = await TraceabilityModel.findApplicationsForSheet(sheet.id_plot, sheet.crop)

        return {
            code: sheet.code,
            level: sheet.level,
            closedAt: sheet.closed_at,
            createdAt: sheet.created_at,
            farmer: {
                name: sheet.farmer_name,
                dniMasked: maskDni(sheet.farmer_dni),
                community: sheet.community,
                district: sheet.district,
                province: sheet.province,
                association: sheet.association,
            },
            plot: {
                name: sheet.plot_name,
                crop: sheet.crop,
                areaHa: sheet.area_ha,
                latitude: sheet.latitude,
                longitude: sheet.longitude,
                plantingDate: sheet.planting_date,
                estimatedHarvestDate: sheet.estimated_harvest_date,
            },
            applications: applications.map((a) => ({
                pesticide: a.pesticide_name,
                activeIngredient: a.active_ingredient,
                appliedAt: a.applied_at,
                dose: a.dose,
                doseUnit: a.dose_unit,
                quantity: a.quantity,
                withdrawalDays: a.withdrawal_days,
                photoUrl: a.photo_url,
                observations: a.observations,
            })),
        }
    }
}

export default TraceabilityService
