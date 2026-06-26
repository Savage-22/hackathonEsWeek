import db from './db.js'
import { pushOperations } from './syncApi.js'

// Coordina la cola de sincronización: detecta conectividad, procesa la `outbox`
// y, cuando el backend confirma, marca los registros como `synced`.
//
// No bloquea la UI: procesar la cola es idempotente y reentrante-seguro gracias
// al flag `syncing`. Se dispara al volver el `online` y manualmente tras escribir.

let syncing = false
const listeners = new Set()

function notify() {
    for (const listener of listeners) listener(isOnline())
}

export function isOnline() {
    return typeof navigator === 'undefined' ? true : navigator.onLine
}

// Suscribe un callback a los cambios de conectividad. Devuelve la función de baja.
export function onConnectivityChange(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

// Procesa la cola pendiente. Sin red o si el backend falla, no hace nada y deja
// los registros en `pending` para el próximo intento.
export async function processQueue() {
    if (syncing || !isOnline()) return
    const operations = await db.outbox.orderBy('createdAt').toArray()
    if (operations.length === 0) return

    syncing = true
    try {
        const applied = await pushOperations(operations)
        await db.transaction('rw', db.tables, async () => {
            for (const { entity, localId, serverId } of applied) {
                await db.table(entity).update(localId, { serverId, syncStatus: 'synced' })
                await db.outbox.where({ entity, localId }).delete()
            }
        })
    } catch {
        // Sin conexión o backend no disponible: se reintenta en el próximo disparo.
    } finally {
        syncing = false
    }
}

// Arranca los disparadores de sincronización. Llamar una sola vez al iniciar la app.
export function startSyncManager() {
    if (typeof window === 'undefined') return
    window.addEventListener('online', () => {
        notify()
        processQueue()
    })
    window.addEventListener('offline', notify)
    processQueue()
}
