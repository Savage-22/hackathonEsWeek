import { createLocal, listLocal, updateLocal } from '../../../../infrastructure/offline/localRepo.js'

// Acceso a datos de parcelas para la PWA: siempre local-first (IndexedDB).
// La escritura encola la operación; el syncManager la empuja a /api/sync (#10),
// donde el backend (#12) asocia la parcela al agricultor del token.
const ENTITY = 'plots'

export function createPlotLocal(data) {
    return createLocal(ENTITY, data)
}

// Edición offline-first: marca la parcela `pending` y encola un `update` que el
// backend resuelve por local_id (upsert con COALESCE: no borra campos ausentes).
export function updatePlotLocal(localId, changes) {
    return updateLocal(ENTITY, localId, changes)
}

export function listPlotsLocal() {
    return listLocal(ENTITY)
}
