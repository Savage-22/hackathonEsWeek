import httpClient from '../../../../infrastructure/httpClient.js'

export function getHealth() {
    return httpClient.get('/health')
}
