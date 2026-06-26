import db from './db.js'
import { processQueue } from './syncManager.js'

// Repositorio local-first que los servicios de dominio deben usar en lugar de
// llamar al API directamente. Cada escritura persiste en IndexedDB como `pending`
// y encola la operación correspondiente; la sincronización ocurre en segundo plano.

// Crea un registro local y lo encola para enviar al backend.
// Devuelve el `localId` asignado por Dexie.
export async function createLocal(entity, data) {
    const localId = await db.transaction('rw', db.table(entity), db.outbox, async () => {
        const id = await db.table(entity).add({
            ...data,
            serverId: null,
            syncStatus: 'pending',
        })
        await db.outbox.add({
            entity,
            op: 'create',
            localId: id,
            payload: data,
            createdAt: Date.now(),
        })
        return id
    })
    processQueue()
    return localId
}

// Actualiza un registro local y lo vuelve a marcar `pending` para re-sincronizar.
export async function updateLocal(entity, localId, changes) {
    await db.transaction('rw', db.table(entity), db.outbox, async () => {
        await db.table(entity).update(localId, { ...changes, syncStatus: 'pending' })
        await db.outbox.add({
            entity,
            op: 'update',
            localId,
            payload: changes,
            createdAt: Date.now(),
        })
    })
    processQueue()
}

// Lecturas locales (la PWA siempre lee de IndexedDB, online u offline).
export function listLocal(entity) {
    return db.table(entity).toArray()
}

export function getLocal(entity, localId) {
    return db.table(entity).get(localId)
}

// Cantidad de registros aún sin sincronizar (para indicadores en la UI).
export function countPending(entity) {
    const table = entity ? db.table(entity) : db.outbox
    return entity ? table.where('syncStatus').equals('pending').count() : table.count()
}
