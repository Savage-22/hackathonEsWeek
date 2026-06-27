import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react'

import { getUser } from '../../../../infrastructure/session.js'
import { onConnectivityChange } from '../../../../infrastructure/offline/syncManager.js'
import OfflineBanner from '../../../../shared/components/OfflineBanner.jsx'
import { loadProfile, saveProfile, flushProfile } from '../services/farmerProfileService.js'

const inputClass =
    'mt-1 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none'

const EMPTY = { name: '', community: '', district: '', province: '', phone: '', association: '' }

export default function FarmerProfilePage() {
    const farmer = getUser()
    const [form, setForm] = useState(EMPTY)
    const [dni, setDni] = useState(farmer.dni ?? '')
    const [status, setStatus] = useState(null) // 'pending' | 'synced' | null
    const [errors, setErrors] = useState([])
    const [saved, setSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const applyRecord = (record) => {
        if (!record) {
            // Sin copia local todavía: precarga el nombre conocido de la sesión.
            setForm((prev) => ({ ...prev, name: farmer.name ?? '' }))
            return
        }
        setForm({
            name: record.name ?? '',
            community: record.community ?? '',
            district: record.district ?? '',
            province: record.province ?? '',
            phone: record.phone ?? '',
            association: record.association ?? '',
        })
        setStatus(record.syncStatus ?? null)
        if (record.dni) setDni(record.dni)
    }

    useEffect(() => {
        loadProfile(farmer.id).then(applyRecord)

        // Al recuperar la conexión, intenta sincronizar el perfil pendiente.
        const unsubscribe = onConnectivityChange(async (online) => {
            if (!online) return
            const result = await flushProfile(farmer.id)
            if (result.synced) setStatus('synced')
        })
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaved(false)
        setErrors([])

        if (!form.name.trim()) {
            setErrors(['El nombre es requerido'])
            return
        }

        setIsSaving(true)
        try {
            const result = await saveProfile(farmer.id, form)
            setErrors(result.errors)
            setStatus(result.record?.syncStatus ?? 'pending')
            if (result.errors.length === 0) setSaved(true)
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
                    <h1 className="font-display text-xl font-bold text-ink">Mi perfil</h1>
                    {status === 'synced' && (
                        <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-forest">
                            <CheckCircle2 size={14} /> Sincronizado
                        </span>
                    )}
                    {status === 'pending' && (
                        <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-accent">
                            <RefreshCw size={14} /> Pendiente
                        </span>
                    )}
                </header>

                <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="dni" className="text-sm font-medium text-ink">DNI</label>
                            <input id="dni" value={dni} disabled
                                className={`${inputClass} cursor-not-allowed bg-cream text-muted`} />
                        </div>

                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-ink">Nombre completo</label>
                            <input id="name" name="name" value={form.name} onChange={handleChange}
                                placeholder="Ej: Rosa Huamán" className={inputClass} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="community" className="text-sm font-medium text-ink">Comunidad</label>
                                <input id="community" name="community" value={form.community} onChange={handleChange}
                                    placeholder="Ej: Cayhuayna" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="phone" className="text-sm font-medium text-ink">Celular</label>
                                <input id="phone" name="phone" value={form.phone} onChange={handleChange}
                                    inputMode="tel" placeholder="Ej: 982 345 678" className={inputClass} />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="district" className="text-sm font-medium text-ink">Distrito</label>
                                <input id="district" name="district" value={form.district} onChange={handleChange}
                                    placeholder="Ej: Pillco Marca" className={inputClass} />
                            </div>
                            <div>
                                <label htmlFor="province" className="text-sm font-medium text-ink">Provincia</label>
                                <input id="province" name="province" value={form.province} onChange={handleChange}
                                    placeholder="Ej: Huánuco" className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="association" className="text-sm font-medium text-ink">Asociación (opcional)</label>
                            <input id="association" name="association" value={form.association} onChange={handleChange}
                                placeholder="Ej: Asociación de productores" className={inputClass} />
                        </div>
                    </div>

                    {errors.length > 0 && (
                        <ul className="mt-4 space-y-1 rounded-lg bg-error/5 px-4 py-3 text-sm text-error">
                            {errors.map((message) => <li key={message}>• {message}</li>)}
                        </ul>
                    )}

                    {saved && (
                        <p className="mt-4 rounded-lg bg-primary/10 px-4 py-3 text-sm text-forest">
                            {status === 'synced'
                                ? 'Perfil actualizado y sincronizado.'
                                : 'Perfil guardado. Se sincronizará al volver la conexión.'}
                        </p>
                    )}

                    <button type="submit" disabled={isSaving}
                        className="mt-5 w-full rounded-lg bg-forest py-3 font-semibold text-white transition-colors hover:bg-forest-deep disabled:opacity-60">
                        {isSaving ? 'Guardando…' : 'Guardar cambios'}
                    </button>
                </form>
            </div>
        </main>
    )
}
