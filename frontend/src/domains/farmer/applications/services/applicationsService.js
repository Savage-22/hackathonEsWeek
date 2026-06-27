import db from '../../../../infrastructure/offline/db.js'
import { isOnline, processQueue } from '../../../../infrastructure/offline/syncManager.js'
import {
    createApplicationRequest,
    recommendationsByCropRequest,
} from '../api/applicationsApi.js'

// Las aplicaciones llevan FOTO (binario), así que no van por la cola JSON
// genérica (/api/sync): se sincronizan por su endpoint multipart (#16). Además
// una aplicación necesita el serverId de su parcela, por eso el flush primero
// asegura que las parcelas pendientes se sincronicen (processQueue).

const RECS_CACHE_PREFIX = 'ag_recs_'

// --- Catálogo de recomendaciones (con caché offline) -------------------------

// Productos recomendados para el cultivo. Online: pide al backend y cachea.
// Offline: usa la última caché conocida del cultivo.
export async function getRecommendations(crop) {
    if (!crop) return []
    const cacheKey = RECS_CACHE_PREFIX + crop
    if (isOnline()) {
        try {
            const response = await recommendationsByCropRequest(crop)
            const recommendations = response.data.data
            localStorage.setItem(cacheKey, JSON.stringify(recommendations))
            return recommendations
        } catch {
            // cae a la caché
        }
    }
    const cached = localStorage.getItem(cacheKey)
    return cached ? JSON.parse(cached) : []
}

// --- Registro offline-first --------------------------------------------------

export function validateApplicationForm(form) {
    const errors = []
    if (!form.id_pesticide) errors.push('Elige un producto recomendado')
    if (!form.applied_at) errors.push('La fecha y hora de aplicación son requeridas')
    if (!(Number(form.dose) > 0)) errors.push('La dosis debe ser un número mayor que 0')
    if (form.quantity !== '' && form.quantity != null && !(Number(form.quantity) > 0)) {
        errors.push('La cantidad debe ser un número mayor que 0')
    }
    return errors
}

/**
 * Guarda la aplicación local como `pending` (con la foto como Blob en IndexedDB)
 * e intenta sincronizar de inmediato si hay red. Devuelve { record, alerts, synced }.
 */
export async function saveApplication(plot, form, photoBlob) {
    const record = {
        plotLocalId: plot.localId,
        id_pesticide: Number(form.id_pesticide),
        pesticide_name: form.pesticide_name ?? null,
        applied_at: new Date(form.applied_at).toISOString(),
        dose: Number(form.dose),
        quantity: form.quantity ? Number(form.quantity) : null,
        observations: form.observations?.trim() || null,
        photoBlob: photoBlob ?? null,
        photoName: photoBlob ? form.photoName ?? 'foto.jpg' : null,
        serverId: null,
        syncStatus: 'pending',
        alerts: [],
        createdAt: Date.now(),
    }
    const localId = await db.applications.add(record)
    const flushed = await flushApplications()
    const saved = await db.applications.get(localId)
    return { record: saved, alerts: saved.alerts ?? [], synced: saved.syncStatus === 'synced', flushed }
}

/**
 * Empuja las aplicaciones pendientes al backend (multipart). Antes ejecuta la
 * cola genérica para que las parcelas pendientes obtengan su serverId; una
 * aplicación cuya parcela aún no sincroniza se reintenta en el próximo disparo.
 */
export async function flushApplications() {
    if (!isOnline()) return { synced: 0 }
    await processQueue()

    const pending = await db.applications.where('syncStatus').equals('pending').toArray()
    let synced = 0
    for (const app of pending) {
        const plot = await db.plots.get(app.plotLocalId)
        if (!plot?.serverId) continue // la parcela aún no sincroniza

        try {
            const formData = new FormData()
            formData.append('id_plot', String(plot.serverId))
            formData.append('id_pesticide', String(app.id_pesticide))
            formData.append('applied_at', app.applied_at)
            formData.append('dose', String(app.dose))
            if (app.quantity != null) formData.append('quantity', String(app.quantity))
            if (app.observations) formData.append('observations', app.observations)
            if (app.photoBlob) formData.append('photo', app.photoBlob, app.photoName || 'foto.jpg')

            const response = await createApplicationRequest(formData)
            const { application, alerts } = response.data.data
            await db.applications.update(app.localId, {
                serverId: application.id_application,
                photo_url: application.photo_url ?? null,
                syncStatus: 'synced',
                alerts: alerts ?? [],
            })
            synced += 1
        } catch {
            // Sin red o error transitorio: queda `pending` para el próximo intento.
        }
    }
    return { synced }
}

// Historial local de una parcela, más reciente primero.
export async function getApplications(plotLocalId) {
    const all = await db.applications.where('plotLocalId').equals(plotLocalId).toArray()
    return all.sort((a, b) => new Date(b.applied_at) - new Date(a.applied_at))
}
