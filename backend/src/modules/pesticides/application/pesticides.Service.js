import PesticidesModel from '../infrastructure/pesticides.Model.js'
import { ValidationError, NotFoundError } from '../../../shared/errors.js'

/**
 * Pesticides Service
 *
 * Lectura del catálogo. Sin escritura: el catálogo se administra por seed/migración.
 */
class PesticidesService {
    static async list() {
        return PesticidesModel.findAll()
    }

    static async recommendationsByCrop(crop) {
        if (!crop?.trim()) throw new ValidationError('Validación fallida', ['El cultivo es requerido'])
        return PesticidesModel.findRecommendationsByCrop(crop.trim())
    }

    static async getRecommendation(crop, idPesticide) {
        if (!crop?.trim()) throw new ValidationError('Validación fallida', ['El cultivo es requerido'])
        const recommendation = await PesticidesModel.findRecommendation(crop.trim(), idPesticide)
        if (!recommendation) {
            throw new NotFoundError('No hay recomendación para esa combinación cultivo–pesticida')
        }
        return recommendation
    }
}

export default PesticidesService
