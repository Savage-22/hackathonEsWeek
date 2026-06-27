import ApplicationsModel from '../infrastructure/applications.Model.js'
import PlotsModel from '../../plots/infrastructure/plots.Model.js'
import PesticidesModel from '../../pesticides/infrastructure/pesticides.Model.js'
import { evaluateApplication } from './alerts.Service.js'
import { NotFoundError, ValidationError } from '../../../shared/errors.js'

/**
 * Applications Service
 *
 * Registra cada fumigación contra una parcela del agricultor en sesión. La
 * propiedad de la parcela se valida reutilizando PlotsModel: una parcela ajena
 * o inexistente se trata como no encontrada, así nadie registra en lo de otro.
 */
class ApplicationsService {
    // Verifica que la parcela exista y pertenezca al agricultor (404 si no).
    static async assertOwnedPlot(plotId, farmerId) {
        const plot = await PlotsModel.findByIdForFarmer(plotId, farmerId)
        if (!plot) throw new NotFoundError('Parcela no encontrada')
        return plot
    }

    static async create(farmerId, data) {
        const plot = await ApplicationsService.assertOwnedPlot(data.id_plot, farmerId)

        const pesticide = await PesticidesModel.findById(data.id_pesticide)
        if (!pesticide) throw new ValidationError('Validación fallida', ['El pesticida indicado no existe'])

        const application = await ApplicationsModel.create(data)
        const alerts = await ApplicationsService.evaluateAlerts(application, plot)
        return { application, alerts }
    }

    // Reúne los datos que necesita el motor de alertas (#18) y lo ejecuta.
    static async evaluateAlerts(application, plot) {
        const [recommendation, previousApplication] = await Promise.all([
            PesticidesModel.findRecommendation(plot.crop, application.id_pesticide),
            ApplicationsModel.findLastByPlotPesticide(
                application.id_plot,
                application.id_pesticide,
                application.id_application,
            ),
        ])
        return evaluateApplication({ application, plot, recommendation, previousApplication })
    }

    static async listByPlot(farmerId, plotId) {
        await ApplicationsService.assertOwnedPlot(plotId, farmerId)
        return ApplicationsModel.findByPlot(plotId)
    }
}

export default ApplicationsService
