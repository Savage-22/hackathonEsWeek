import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, CheckCircle2, RefreshCw, Image as ImageIcon } from 'lucide-react'

import db from '../../../../infrastructure/offline/db.js'
import { onConnectivityChange } from '../../../../infrastructure/offline/syncManager.js'
import OfflineBanner from '../../../../shared/components/OfflineBanner.jsx'
import PhotoCapture from '../components/PhotoCapture.jsx'
import AlertList from '../components/AlertList.jsx'
import {
    getRecommendations,
    saveApplication,
    getApplications,
    flushApplications,
    validateApplicationForm,
} from '../services/applicationsService.js'

const inputClass =
    'mt-1 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none'

// Fecha/hora local en formato datetime-local (YYYY-MM-DDTHH:mm).
function nowLocal() {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
}

const emptyForm = () => ({
    id_pesticide: '',
    pesticide_name: '',
    applied_at: nowLocal(),
    dose: '',
    quantity: '',
    observations: '',
})

export default function FarmerApplicationsPage() {
    const { plotLocalId } = useParams()
    const localId = Number(plotLocalId)

    const [plot, setPlot] = useState(null)
    const [recommendations, setRecommendations] = useState([])
    const [form, setForm] = useState(emptyForm)
    const [photo, setPhoto] = useState(null)
    const [history, setHistory] = useState([])
    const [errors, setErrors] = useState([])
    const [lastAlerts, setLastAlerts] = useState(null)
    const [savedMsg, setSavedMsg] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const refreshHistory = async () => setHistory(await getApplications(localId))

    useEffect(() => {
        let active = true
        ;(async () => {
            const found = await db.plots.get(localId)
            if (!active) return
            setPlot(found)
            if (found?.crop) setRecommendations(await getRecommendations(found.crop))
            await refreshHistory()
        })()

        // Al volver la conexión: sincroniza pendientes y refresca el historial.
        const unsubscribe = onConnectivityChange(async (online) => {
            if (!online) return
            await flushApplications()
            await refreshHistory()
        })
        return () => { active = false; unsubscribe() }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localId])

    const selectedRec = useMemo(
        () => recommendations.find((r) => String(r.id_pesticide) === String(form.id_pesticide)),
        [recommendations, form.id_pesticide],
    )

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    // Al elegir producto, prefiere la dosis recomendada y guarda el nombre.
    const handleProduct = (event) => {
        const id = event.target.value
        const rec = recommendations.find((r) => String(r.id_pesticide) === id)
        setForm((prev) => ({
            ...prev,
            id_pesticide: id,
            pesticide_name: rec?.pesticide_name ?? '',
            dose: rec ? String(rec.recommended_dose) : prev.dose,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSavedMsg('')
        setLastAlerts(null)
        const validation = validateApplicationForm(form)
        setErrors(validation)
        if (validation.length > 0) return

        setIsSaving(true)
        try {
            const photoName = photo?.name
            const { alerts, synced } = await saveApplication(plot, { ...form, photoName }, photo)
            setForm(emptyForm())
            setPhoto(null)
            setLastAlerts(alerts)
            setSavedMsg(synced
                ? 'Aplicación registrada y sincronizada.'
                : 'Aplicación guardada. Se sincronizará al volver la conexión.')
            await refreshHistory()
        } finally {
            setIsSaving(false)
        }
    }

    if (!plot) {
        return (
            <main className="min-h-screen bg-surface p-6">
                <p className="text-muted">Cargando parcela…</p>
                <Link to="/app/parcelas" className="mt-4 inline-block text-forest">← Volver a parcelas</Link>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-surface">
            <OfflineBanner />
            <div className="mx-auto max-w-2xl p-5">
                <header className="flex items-center gap-3">
                    <Link to="/app/parcelas" className="text-muted hover:text-forest" aria-label="Volver">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-display text-xl font-bold text-ink">{plot.name}</h1>
                        <p className="text-sm text-muted">Cultivo: {plot.crop}</p>
                    </div>
                </header>

                {/* Formulario de aplicación */}
                <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                    <h2 className="font-display text-lg font-bold text-ink">Registrar fumigación</h2>

                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="id_pesticide" className="text-sm font-medium text-ink">Producto recomendado</label>
                            <select id="id_pesticide" name="id_pesticide" value={form.id_pesticide}
                                onChange={handleProduct} className={inputClass}>
                                <option value="">Elige un producto…</option>
                                {recommendations.map((rec) => (
                                    <option key={rec.id_pesticide} value={rec.id_pesticide}>
                                        {rec.pesticide_name} — rec. {rec.recommended_dose} {rec.dose_unit}
                                    </option>
                                ))}
                            </select>
                            {recommendations.length === 0 && (
                                <p className="mt-1 text-xs text-muted">
                                    No hay productos recomendados en caché para “{plot.crop}”. Conéctate una vez para descargarlos.
                                </p>
                            )}
                            {selectedRec && (
                                <p className="mt-1 text-xs text-muted">
                                    Carencia {selectedRec.withdrawal_days} días · cada {selectedRec.frequency_days} días
                                </p>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="dose" className="text-sm font-medium text-ink">
                                    Dosis {selectedRec ? `(${selectedRec.dose_unit})` : ''}
                                </label>
                                <input id="dose" name="dose" value={form.dose} onChange={handleChange}
                                    type="number" step="0.01" min="0" inputMode="decimal" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="text-sm font-medium text-ink">Cantidad total (opcional)</label>
                                <input id="quantity" name="quantity" value={form.quantity} onChange={handleChange}
                                    type="number" step="0.01" min="0" inputMode="decimal" className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="applied_at" className="text-sm font-medium text-ink">Fecha y hora</label>
                            <input id="applied_at" name="applied_at" value={form.applied_at} onChange={handleChange}
                                type="datetime-local" className={inputClass} />
                        </div>

                        <div>
                            <label htmlFor="observations" className="text-sm font-medium text-ink">Observaciones (opcional)</label>
                            <textarea id="observations" name="observations" value={form.observations}
                                onChange={handleChange} rows={2} className={inputClass} />
                        </div>

                        <div>
                            <span className="text-sm font-medium text-ink">Evidencia fotográfica</span>
                            <div className="mt-1">
                                <PhotoCapture onChange={setPhoto} />
                            </div>
                        </div>
                    </div>

                    {errors.length > 0 && (
                        <ul className="mt-4 space-y-1 rounded-lg bg-error/5 px-4 py-3 text-sm text-error">
                            {errors.map((message) => <li key={message}>• {message}</li>)}
                        </ul>
                    )}

                    {savedMsg && <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-forest">{savedMsg}</p>}

                    {lastAlerts && lastAlerts.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-semibold text-ink">Alertas de buenas prácticas</p>
                            <AlertList alerts={lastAlerts} />
                        </div>
                    )}

                    <button type="submit" disabled={isSaving}
                        className="mt-5 w-full rounded-lg bg-forest py-3 font-semibold text-white transition-colors hover:bg-forest-deep disabled:opacity-60">
                        {isSaving ? 'Guardando…' : 'Registrar fumigación'}
                    </button>
                </form>

                {/* Historial del cultivo */}
                <section className="mt-8">
                    <h2 className="font-display text-lg font-bold text-ink">Historial ({history.length})</h2>
                    {history.length === 0 ? (
                        <p className="mt-3 text-sm text-muted">Aún no hay fumigaciones registradas en esta parcela.</p>
                    ) : (
                        <ul className="mt-3 space-y-3">
                            {history.map((app) => (
                                <li key={app.localId} className="rounded-xl bg-white p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <ApplicationThumb app={app} />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-ink">{app.pesticide_name ?? 'Producto'}</p>
                                            <p className="text-sm text-muted">
                                                {new Date(app.applied_at).toLocaleString()} · dosis {app.dose}
                                                {app.quantity != null && ` · ${app.quantity} total`}
                                            </p>
                                            {app.observations && <p className="mt-1 text-sm text-ink/80">{app.observations}</p>}
                                        </div>
                                        {app.syncStatus === 'synced' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-forest">
                                                <CheckCircle2 size={14} /> Sincronizada
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                                                <RefreshCw size={14} /> Pendiente
                                            </span>
                                        )}
                                    </div>
                                    {app.alerts?.length > 0 && (
                                        <div className="mt-3">
                                            <AlertList alerts={app.alerts} />
                                        </div>
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

// Miniatura de evidencia: usa el Blob local (offline) o la URL del backend.
function ApplicationThumb({ app }) {
    const [url, setUrl] = useState(null)

    useEffect(() => {
        if (app.photoBlob) {
            const objectUrl = URL.createObjectURL(app.photoBlob)
            setUrl(objectUrl)
            return () => URL.revokeObjectURL(objectUrl)
        }
        if (app.photo_url) setUrl(import.meta.env.VITE_API_URL + app.photo_url)
    }, [app.photoBlob, app.photo_url])

    if (!url) {
        return (
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-cream text-muted">
                <ImageIcon size={18} />
            </span>
        )
    }
    return <img src={url} alt="Evidencia" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
}
