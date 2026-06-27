import httpClient from '../../../../infrastructure/httpClient.js'

// Acceso al backend de aplicaciones (#16) y al catálogo de recomendaciones (#15).

// Crea una aplicación con foto (multipart). El httpClient ya quita el
// Content-Type cuando el body es FormData para que el navegador fije el boundary.
export function createApplicationRequest(formData) {
    return httpClient.post('/api/applications', formData)
}

export function listApplicationsRequest(plotId) {
    return httpClient.get('/api/applications', { params: { plotId } })
}

// Productos recomendados para el cultivo de la parcela (#15): el formulario solo
// ofrece estos, cada uno con dosis/frecuencia/carencia.
export function recommendationsByCropRequest(crop) {
    return httpClient.get('/api/pesticides/recommendations', { params: { crop } })
}
