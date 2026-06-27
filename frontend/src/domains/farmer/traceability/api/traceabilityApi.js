import httpClient from '../../../../infrastructure/httpClient.js'

// Cierra producción y genera el lote en el backend (#20). El código lo asigna el
// servidor; el cliente lo guarda para renderizar el QR.
export function createBatchRequest({ id_plot, local_id }) {
    return httpClient.post('/api/traceability/batches', { id_plot, local_id })
}
