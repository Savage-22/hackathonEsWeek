import { createPlotLocal, updatePlotLocal, listPlotsLocal } from '../api/plotsApi.js'

// Columnas que entiende el backend (#12 / sync whitelist). El resto de campos
// locales (p. ej. farmerServerId) se guardan solo para filtrar en el dispositivo.
function toBackendPayload(form) {
    return {
        name: form.name.trim(),
        crop: form.crop.trim(),
        area_ha: form.area_ha === '' || form.area_ha == null ? null : Number(form.area_ha),
        latitude: form.latitude ?? null,
        longitude: form.longitude ?? null,
        planting_date: form.planting_date || null,
        estimated_harvest_date: form.estimated_harvest_date || null,
    }
}

// Validación de cliente espejo de la del backend: evita encolar basura. Los
// errores se devuelven como lista para mostrarlos tal cual al agricultor.
export function validatePlotForm(form) {
    const errors = []
    if (!form.name?.trim()) errors.push('El nombre de la parcela es requerido')
    if (!form.crop?.trim()) errors.push('El cultivo es requerido')
    if (form.latitude == null || form.longitude == null) {
        errors.push('Captura la ubicación GPS de la parcela')
    }
    if (form.area_ha !== '' && form.area_ha != null && Number(form.area_ha) < 0) {
        errors.push('El área debe ser un número válido')
    }
    return errors
}

// Crea la parcela offline-first. `farmerServerId` ata la parcela al agricultor
// en sesión para poder filtrar en este dispositivo (el backend la reasocia por token).
export async function savePlot(form, farmerServerId) {
    const payload = { ...toBackendPayload(form), farmerServerId }
    return createPlotLocal(payload)
}

// Edición completa de la parcela (mismo whitelist que la creación).
export async function updatePlot(localId, form) {
    return updatePlotLocal(localId, toBackendPayload(form))
}

// Atajo: corrige solo la fecha de cosecha estimada (resuelve la alerta de
// carencia sin tocar el resto de la parcela). Espera 'YYYY-MM-DD'.
export async function updateHarvestDate(localId, estimatedHarvestDate) {
    if (!estimatedHarvestDate) return
    return updatePlotLocal(localId, { estimated_harvest_date: estimatedHarvestDate })
}

// Parcelas del agricultor en sesión, más recientes primero.
export async function getPlots(farmerServerId) {
    const all = await listPlotsLocal()
    return all
        .filter((plot) => plot.farmerServerId === farmerServerId)
        .sort((a, b) => (b.localId ?? 0) - (a.localId ?? 0))
}
