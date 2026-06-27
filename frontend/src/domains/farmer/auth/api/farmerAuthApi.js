import httpClient from '../../../../infrastructure/httpClient.js'

export function loginFarmerRequest(dni, password) {
    return httpClient.post('/api/auth/login/farmer', { dni, password })
}

export function registerFarmerRequest(data) {
    return httpClient.post('/api/auth/register/farmer', data)
}
