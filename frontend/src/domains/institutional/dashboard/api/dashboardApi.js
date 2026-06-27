import httpClient from '../../../../infrastructure/httpClient.js'

// Agregados del panel institucional (#23). El token (rol institucional) lo
// inyecta el httpClient; un agricultor recibe 403.
export function getOverviewRequest() {
    return httpClient.get('/api/stats/overview')
}

export function getFarmersRequest() {
    return httpClient.get('/api/stats/farmers')
}

export function getPlotsRequest() {
    return httpClient.get('/api/stats/plots')
}
