import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Sprout, CheckCircle2, RefreshCw, ChevronRight, Pencil, X } from 'lucide-react'

import { getUser } from '../../../../infrastructure/session.js'
import OfflineBanner from '../../../../shared/components/OfflineBanner.jsx'
import LocationPicker from '../components/LocationPicker.jsx'
import { savePlot, updatePlot, getPlots, validatePlotForm } from '../services/plotsService.js'

const inputClass =
    'mt-1 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none'

const EMPTY = {
    name: '',
    crop: '',
    area_ha: '',
    planting_date: '',
    estimated_harvest_date: '',
    latitude: null,
    longitude: null,
    accuracy: null,
}

export default function FarmerPlotsPage() {
    const farmer = getUser()
    const [form, setForm] = useState(EMPTY)
    const [plots, setPlots] = useState([])
    const [errors, setErrors] = useState([])
    const [saved, setSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    // localId de la parcela en edición; null = modo creación.
    const [editingId, setEditingId] = useState(null)

    const refresh = async () => setPlots(await getPlots(farmer.id))

    useEffect(() => {
        refresh()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleLocation = (coords) => setForm((prev) => ({ ...prev, ...coords }))

    // Carga la parcela en el formulario para editarla. Las fechas se recortan a
    // 'YYYY-MM-DD' para el input date; el área a string para el input number.
    const startEdit = (plot) => {
        setEditingId(plot.localId)
        setForm({
            name: plot.name ?? '',
            crop: plot.crop ?? '',
            area_ha: plot.area_ha == null ? '' : String(plot.area_ha),
            planting_date: (plot.planting_date ?? '').slice(0, 10),
            estimated_harvest_date: (plot.estimated_harvest_date ?? '').slice(0, 10),
            latitude: plot.latitude ?? null,
            longitude: plot.longitude ?? null,
            accuracy: plot.accuracy ?? null,
        })
        setErrors([])
        setSaved(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setForm(EMPTY)
        setErrors([])
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaved(false)
        const validation = validatePlotForm(form)
        setErrors(validation)
        if (validation.length > 0) return

        setIsSaving(true)
        try {
            if (editingId != null) {
                await updatePlot(editingId, form)
            } else {
                await savePlot(form, farmer.id)
            }
            setForm(EMPTY)
            setEditingId(null)
            setSaved(true)
            await refresh()
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <main className="min-h-screen bg-surface">
            <OfflineBanner />
            <div className="mx-auto max-w-2xl p-5">
                <header className="flex items-center gap-3">
                    <Link to="/app" className="text-muted hover:text-forest" aria-label="Volver">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="font-display text-xl font-bold text-ink">Mis parcelas</h1>
                </header>

                {/* Formulario de registro */}
                <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-lg font-bold text-ink">
                            {editingId != null ? 'Editar parcela' : 'Registrar parcela'}
                        </h2>
                        {editingId != null && (
                            <button type="button" onClick={cancelEdit}
                                className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
                                <X size={15} /> Cancelar
                            </button>
                        )}
                    </div>

                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-ink">Nombre de la parcela</label>
                            <input id="name" name="name" value={form.name} onChange={handleChange}
                                placeholder="Ej: Chacra de arriba" className={inputClass} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="crop" className="text-sm font-medium text-ink">Cultivo</label>
                                <input id="crop" name="crop" value={form.crop} onChange={handleChange}
                                    placeholder="Ej: Papa" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="area_ha" className="text-sm font-medium text-ink">Área (ha)</label>
                                <input id="area_ha" name="area_ha" value={form.area_ha} onChange={handleChange}
                                    type="number" step="0.01" min="0" inputMode="decimal"
                                    placeholder="Ej: 1.5" className={inputClass} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="planting_date" className="text-sm font-medium text-ink">Fecha de siembra</label>
                                <input id="planting_date" name="planting_date" value={form.planting_date}
                                    onChange={handleChange} type="date" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="estimated_harvest_date" className="text-sm font-medium text-ink">Cosecha estimada</label>
                                <input id="estimated_harvest_date" name="estimated_harvest_date"
                                    value={form.estimated_harvest_date} onChange={handleChange} type="date"
                                    className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <span className="text-sm font-medium text-ink">Ubicación</span>
                            <div className="mt-1">
                                <LocationPicker value={form} onChange={handleLocation} />
                            </div>
                        </div>
                    </div>

                    {errors.length > 0 && (
                        <ul className="mt-4 space-y-1 rounded-lg bg-error/5 px-4 py-3 text-sm text-error">
                            {errors.map((message) => <li key={message}>• {message}</li>)}
                        </ul>
                    )}

                    {saved && (
                        <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-forest">
                            {editingId != null
                                ? 'Cambios guardados. Se sincronizarán automáticamente cuando haya conexión.'
                                : 'Parcela guardada. Se sincronizará automáticamente cuando haya conexión.'}
                        </p>
                    )}

                    <button type="submit" disabled={isSaving}
                        className="mt-5 w-full rounded-lg bg-forest py-3 font-semibold text-white transition-colors hover:bg-forest-deep disabled:opacity-60">
                        {isSaving
                            ? 'Guardando…'
                            : editingId != null ? 'Guardar cambios' : 'Guardar parcela'}
                    </button>
                </form>

                {/* Listado */}
                <section className="mt-8">
                    <h2 className="font-display text-lg font-bold text-ink">Registradas ({plots.length})</h2>
                    {plots.length === 0 ? (
                        <p className="mt-3 text-sm text-muted">Aún no has registrado parcelas.</p>
                    ) : (
                        <ul className="mt-3 space-y-3">
                            {plots.map((plot) => (
                                <li
                                    key={plot.localId}
                                    className="flex items-center gap-2 rounded-xl bg-white pr-2 shadow-sm transition-colors hover:bg-forest/5"
                                >
                                    <Link
                                        to={`/app/parcelas/${plot.localId}`}
                                        className="flex min-w-0 flex-1 items-center gap-3 p-4"
                                    >
                                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-forest/10 text-forest">
                                            <Sprout size={18} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold text-ink">{plot.name}</p>
                                            <p className="truncate text-sm text-muted">
                                                {plot.crop}
                                                {plot.area_ha != null && ` · ${plot.area_ha} ha`}
                                                {plot.estimated_harvest_date &&
                                                    ` · cosecha ${plot.estimated_harvest_date.slice(0, 10)}`}
                                            </p>
                                        </div>
                                        {plot.syncStatus === 'synced' ? (
                                            <span className="hidden items-center gap-1 text-xs font-medium text-forest sm:inline-flex">
                                                <CheckCircle2 size={14} /> Sincronizada
                                            </span>
                                        ) : (
                                            <span className="hidden items-center gap-1 text-xs font-medium text-accent sm:inline-flex">
                                                <RefreshCw size={14} /> Pendiente
                                            </span>
                                        )}
                                        <ChevronRight size={18} className="text-muted" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => startEdit(plot)}
                                        aria-label={`Editar ${plot.name}`}
                                        className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-forest hover:text-forest"
                                    >
                                        <Pencil size={14} /> Editar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}
