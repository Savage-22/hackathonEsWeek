import httpClient from '../../../../infrastructure/httpClient.js'

export function loginFarmerRequest(dni, password) {
    return httpClient.post('/api/auth/login/farmer', { dni, password })
}
