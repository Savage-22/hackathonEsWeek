import httpClient from '../../../../infrastructure/httpClient.js'

export function loginInstitutionalRequest(email, password) {
    return httpClient.post('/api/auth/login', { email, password })
}
