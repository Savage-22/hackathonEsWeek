import db from '../../../../infrastructure/offline/db.js'
import { isOnline, processQueue } from '../../../../infrastructure/offline/syncManager.js'
import { createBatchRequest } from '../api/traceabilityApi.js'

// El lote referencia una parcela (id_plot), así que —como las aplicaciones— se
// sincroniza por un flush dedicado que primero asegura que la parcela tenga
// serverId. El CÓDIGO definitivo lo asigna el servidor: offline el lote queda
// `pending` sin código y, al sincronizar, recibe su código y su QR.

// URL pública que codifica el QR: la página que abre el comprador.
export function publicUrlForCode(code) {
    return `${window.location.origin}/t/${code}`
}

// Cierra producción: crea el lote local `pending` e intenta sincronizar.
export async function generateBatch(plot) {
    const record = {
        plotLocalId: plot.localId,
        local_id: crypto.randomUUID(),
        code: null,
        serverId: null,
        syncStatus: 'pending',
        closedAt: new Date().toISOString(),
        createdAt: Date.now(),
    }
    const localId = await db.batches.add(record)
    await flushBatches()
    return db.batches.get(localId)
}

/**
 * Empuja los lotes pendientes al backend. Antes corre la cola genérica para que
 * las parcelas pendientes obtengan serverId; un lote cuya parcela aún no
 * sincroniza se reintenta en el próximo disparo.
 */
export async function flushBatches() {
    if (!isOnline()) return { synced: 0 }
    await processQueue()

    const pending = await db.batches.where('syncStatus').equals('pending').toArray()
    let synced = 0
    for (const batch of pending) {
        const plot = await db.plots.get(batch.plotLocalId)
        if (!plot?.serverId) continue

        try {
            const response = await createBatchRequest({ id_plot: plot.serverId, local_id: batch.local_id })
            const created = response.data.data
            await db.batches.update(batch.localId, {
                serverId: created.id_batch,
                code: created.code,
                syncStatus: 'synced',
            })
            synced += 1
        } catch {
            // Sin red o error transitorio: queda `pending` para el próximo intento.
        }
    }
    return { synced }
}

// Lotes de una parcela, más reciente primero.
export async function getBatches(plotLocalId) {
    const all = await db.batches.where('plotLocalId').equals(plotLocalId).toArray()
    return all.sort((a, b) => (b.localId ?? 0) - (a.localId ?? 0))
}
