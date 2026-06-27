import httpClient from '../../../../infrastructure/httpClient.js'

// Perfil del agricultor contra el módulo REST de agricultores (#11).
// El agricultor en sesión gestiona su propio registro (id del token).
export function getProfileRequest(farmerId) {
    return httpClient.get(`/api/farmers/${farmerId}`)
}

export function updateProfileRequest(farmerId, data) {
    return httpClient.put(`/api/farmers/${farmerId}`, data)
}
