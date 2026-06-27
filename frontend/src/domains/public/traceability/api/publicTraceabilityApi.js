import httpClient from '../../../../infrastructure/httpClient.js'

// Ficha pública de trazabilidad (#20). Sin auth: la consulta el comprador al
// escanear el QR.
export function getPublicTraceabilityRequest(code) {
    return httpClient.get(`/api/traceability/${code}`)
}
