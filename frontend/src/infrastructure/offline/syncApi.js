import httpClient from '../httpClient.js'

// Empuja la cola de operaciones al endpoint batch de sincronización (#10).
//
// Contrato esperado del backend:
//   POST /api/sync  body: { operations: [{ entity, op, localId, payload }] }
//   200 { success, data: { applied: [{ entity, localId, serverId }] } }
//
// Devuelve el arreglo `applied` para que el manager marque los registros como
// `synced` y los retire de la cola. Si el backend aún no existe o no hay red,
// la promesa se rechaza y los registros quedan `pending` para reintentar.
export async function pushOperations(operations) {
    const response = await httpClient.post('/api/sync', { operations })
    return response.data.data.applied
}

// Baja los cambios del agricultor posteriores a `since` (ISO) para refrescar
// el dispositivo. Devuelve { since, changes: { plots, ... } }.
export async function pullChanges(since) {
    const response = await httpClient.get('/api/sync', {
        params: since ? { since } : undefined,
    })
    return response.data.data
}
