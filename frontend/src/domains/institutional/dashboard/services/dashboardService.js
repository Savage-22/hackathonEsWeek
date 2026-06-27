import { getOverviewRequest, getFarmersRequest, getPlotsRequest } from '../api/dashboardApi.js'

// Carga todo el panel en paralelo. Devuelve { status, overview, farmers, plots }
// para que la página no tenga que interpretar excepciones.
export async function loadDashboard() {
    try {
        const [overview, farmers, plots] = await Promise.all([
            getOverviewRequest(),
            getFarmersRequest(),
            getPlotsRequest(),
        ])
        return {
            status: 'ok',
            overview: overview.data.data,
            farmers: farmers.data.data,
            plots: plots.data.data,
        }
    } catch {
        // El 401 ya cierra sesión vía interceptor; aquí basta señalar el error.
        return { status: 'error' }
    }
}
