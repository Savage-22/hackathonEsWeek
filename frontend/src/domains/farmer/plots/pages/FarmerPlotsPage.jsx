import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Sprout, CheckCircle2, RefreshCw } from 'lucide-react'

import { getUser } from '../../../../infrastructure/session.js'
import OfflineBanner from '../../../../shared/components/OfflineBanner.jsx'
import LocationPicker from '../components/LocationPicker.jsx'
import { savePlot, getPlots, validatePlotForm } from '../services/plotsService.js'

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

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaved(false)
        const validation = validatePlotForm(form)
        setErrors(validation)
        if (validation.length > 0) return

        setIsSaving(true)
        try {
            await savePlot(form, farmer.id)
            setForm(EMPTY)
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
                    <h2 className="font-display text-lg font-bold text-ink">Registrar parcela</h2>

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
                            Parcela guardada. Se sincronizará automáticamente cuando haya conexión.
                        </p>
                    )}

                    <button type="submit" disabled={isSaving}
                        className="mt-5 w-full rounded-lg bg-forest py-3 font-semibold text-white transition-colors hover:bg-forest-deep disabled:opacity-60">
                        {isSaving ? 'Guardando…' : 'Guardar parcela'}
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
                                <li key={plot.localId} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-forest/10 text-forest">
                                        <Sprout size={18} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-ink">{plot.name}</p>
                                        <p className="truncate text-sm text-muted">
                                            {plot.crop}
                                            {plot.area_ha != null && ` · ${plot.area_ha} ha`}
                                            {plot.latitude != null && ` · ${plot.latitude}, ${plot.longitude}`}
                                        </p>
                                    </div>
                                    {plot.syncStatus === 'synced' ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-forest">
                                            <CheckCircle2 size={14} /> Sincronizada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                                            <RefreshCw size={14} /> Pendiente
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}
