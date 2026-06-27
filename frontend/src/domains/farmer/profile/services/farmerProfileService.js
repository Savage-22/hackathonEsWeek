import db from '../../../../infrastructure/offline/db.js'
import { isOnline } from '../../../../infrastructure/offline/syncManager.js'
import { getProfileRequest, updateProfileRequest } from '../api/farmerProfileApi.js'

// Campos editables del perfil (espejo del backend #11; el DNI es identidad, no se edita aquí).
const EDITABLE = ['name', 'community', 'district', 'province', 'phone', 'association']

// El perfil es un registro singleton del agricultor en sesión. A diferencia de
// las parcelas (cola genérica /api/sync), el perfil se sincroniza por su propio
// endpoint REST: es un UPDATE de la fila del propio agricultor, no un hijo
// encolable. Por eso vive aquí y NO toca la outbox genérica.

function pickEditable(source) {
    const out = {}
    for (const key of EDITABLE) {
        if (source[key] !== undefined && source[key] !== null) out[key] = source[key]
    }
    return out
}

// Fila local del perfil (Dexie `farmers`), identificada por su serverId.
async function getLocalRow(farmerId) {
    return db.farmers.where('serverId').equals(farmerId).first()
}

async function upsertLocal(farmerId, data, syncStatus) {
    const existing = await getLocalRow(farmerId)
    if (existing) {
        await db.farmers.update(existing.localId, { ...data, syncStatus })
        return { ...existing, ...data, syncStatus }
    }
    const localId = await db.farmers.add({ ...data, serverId: farmerId, syncStatus })
    return { localId, serverId: farmerId, ...data, syncStatus }
}

/**
 * Carga el perfil: local-first. Si hay red y el perfil local no tiene cambios
 * pendientes, se refresca desde el backend y se cachea como `synced`. Si hay
 * edición pendiente, gana la copia local para no pisar lo que falta sincronizar.
 */
export async function loadProfile(farmerId) {
    const local = await getLocalRow(farmerId)
    if (local?.syncStatus === 'pending') return local

    if (isOnline()) {
        try {
            const response = await getProfileRequest(farmerId)
            const remote = response.data.data
            // El DNI se cachea para mostrarlo (no es editable, no se reenvía al backend).
            return upsertLocal(farmerId, { ...pickEditable(remote), dni: remote.dni }, 'synced')
        } catch {
            // Sin red o error transitorio: se usa lo que haya en local.
        }
    }
    return local ?? null
}

/**
 * Guarda el perfil offline-first: persiste local como `pending` y, si hay red,
 * intenta sincronizar de inmediato. Devuelve { record, synced, errors }.
 * `errors` trae los mensajes de validación del backend para mostrarlos al usuario.
 */
export async function saveProfile(farmerId, changes) {
    const data = pickEditable(changes)
    const record = await upsertLocal(farmerId, data, 'pending')
    const result = await flushProfile(farmerId)
    return { record: result.record ?? record, synced: result.synced, errors: result.errors }
}

/**
 * Empuja el perfil pendiente al backend. Idempotente: si no hay nada pendiente
 * o no hay red, no hace nada. Se llama al guardar y al recuperar la conexión.
 */
export async function flushProfile(farmerId) {
    const local = await getLocalRow(farmerId)
    if (!local || local.syncStatus !== 'pending') {
        return { record: local, synced: local?.syncStatus === 'synced', errors: [] }
    }
    if (!isOnline()) return { record: local, synced: false, errors: [] }

    try {
        await updateProfileRequest(farmerId, pickEditable(local))
        const synced = await upsertLocal(farmerId, pickEditable(local), 'synced')
        return { record: synced, synced: true, errors: [] }
    } catch (error) {
        return { record: local, synced: false, errors: extractErrors(error) }
    }
}

function extractErrors(error) {
    const data = error.response?.data
    if (data?.errors?.length) return data.errors
    if (data?.message) return [data.message]
    if (!isOnline()) return []
    return ['No se pudo guardar el perfil. Inténtalo de nuevo.']
}
