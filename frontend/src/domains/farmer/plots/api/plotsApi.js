import { createLocal, listLocal } from '../../../../infrastructure/offline/localRepo.js'

// Acceso a datos de parcelas para la PWA: siempre local-first (IndexedDB).
// La escritura encola la operación; el syncManager la empuja a /api/sync (#10),
// donde el backend (#12) asocia la parcela al agricultor del token.
const ENTITY = 'plots'

export function createPlotLocal(data) {
    return createLocal(ENTITY, data)
}

export function listPlotsLocal() {
    return listLocal(ENTITY)
}
