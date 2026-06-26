import Dexie from 'dexie'

// Base local (IndexedDB) espejo de las entidades del backend.
// Toda escritura de la PWA va primero aquí; la sincronización con el API
// se hace después vía la cola `outbox` (ver syncManager.js).
//
// Convención de cada registro de dominio:
//   - localId:  clave primaria local autoincremental (Dexie).
//   - serverId: id asignado por el backend tras sincronizar (null mientras `pending`).
//   - syncStatus: 'pending' | 'synced'.
const db = new Dexie('agroguardian')

db.version(1).stores({
    farmers: '++localId, serverId, syncStatus',
    plots: '++localId, serverId, syncStatus, farmerLocalId',
    applications: '++localId, serverId, syncStatus, plotLocalId',
    batches: '++localId, serverId, syncStatus, plotLocalId',
    // Cola de operaciones pendientes de enviar al backend (orden por createdAt).
    outbox: '++id, entity, localId, op, createdAt',
})

// Entidades de dominio que admiten escritura offline-first.
export const ENTITIES = ['farmers', 'plots', 'applications', 'batches']

export default db
