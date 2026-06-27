import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Leaf, MapPin, User, Calendar, FlaskConical, ShieldCheck, SearchX } from 'lucide-react'

import { loadTraceability, photoSrc } from '../services/publicTraceabilityService.js'

// Niveles de certificación (#25); el badge solo aparece si el lote tiene nivel.
const LEVELS = {
    BRONCE: { label: 'Bronce', cls: 'bg-amber-700/15 text-amber-800' },
    PLATA: { label: 'Plata', cls: 'bg-slate-400/20 text-slate-700' },
    ORO: { label: 'Oro', cls: 'bg-yellow-500/20 text-yellow-700' },
}

function formatDate(value) {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function PublicTraceabilityPage() {
    const { code } = useParams()
    const [state, setState] = useState({ status: 'loading' })

    useEffect(() => {
        let active = true
        loadTraceability(code).then((result) => { if (active) setState(result) })
        return () => { active = false }
    }, [code])

    if (state.status === 'loading') {
        return <CenteredMessage>Cargando trazabilidad…</CenteredMessage>
    }

    if (state.status === 'notfound') {
        return (
            <CenteredMessage>
                <SearchX size={40} className="mb-3 text-muted" />
                <h1 className="font-display text-xl font-bold text-ink">Código no encontrado</h1>
                <p className="mt-1 max-w-xs text-sm text-muted">
                    El código <span className="font-mono">{code}</span> no corresponde a ningún lote registrado.
                </p>
                <Link to="/" className="mt-4 text-sm font-semibold text-forest">Ir al inicio</Link>
            </CenteredMessage>
        )
    }

    if (state.status === 'error') {
        return (
            <CenteredMessage>
                <h1 className="font-display text-xl font-bold text-ink">No se pudo cargar la ficha</h1>
                <p className="mt-1 text-sm text-muted">Revisa tu conexión e inténtalo de nuevo.</p>
            </CenteredMessage>
        )
    }

    const { data } = state
    const level = data.level ? LEVELS[data.level] : null

    return (
        <main className="min-h-screen bg-cream font-sans">
            {/* Cabecera */}
            <header className="bg-gradient-to-br from-forest to-forest-deep px-5 pb-8 pt-7 text-white">
                <div className="mx-auto max-w-xl">
                    <div className="flex items-center gap-2 text-white/80">
                        <Leaf size={18} />
                        <span className="font-display font-bold">AgroGuardian</span>
                    </div>
                    <p className="mt-4 text-sm text-white/70">Trazabilidad del producto</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                        <h1 className="font-display text-3xl font-bold capitalize">{data.plot.crop}</h1>
                        {level && (
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${level.cls}`}>
                                <ShieldCheck size={13} /> {level.label}
                            </span>
                        )}
                    </div>
                    <p className="mt-2 font-mono text-sm text-white/70">{data.code}</p>
                </div>
            </header>

            <div className="mx-auto max-w-xl space-y-5 px-5 py-6">
                {/* Agricultor */}
                <Card icon={User} title="Agricultor">
                    <p className="font-semibold text-ink">{data.farmer.name}</p>
                    <p className="text-sm text-muted">DNI {data.farmer.dniMasked}</p>
                    <p className="mt-1 text-sm text-ink/80">
                        {[data.farmer.community, data.farmer.district, data.farmer.province].filter(Boolean).join(', ')}
                    </p>
                    {data.farmer.association && (
                        <p className="text-sm text-muted">Asociación: {data.farmer.association}</p>
                    )}
                </Card>

                {/* Parcela y ubicación */}
                <Card icon={MapPin} title="Parcela">
                    <p className="font-semibold text-ink">{data.plot.name}</p>
                    {data.plot.areaHa != null && <p className="text-sm text-muted">{data.plot.areaHa} ha</p>}
                    {data.plot.latitude != null && (
                        <a
                            href={`https://www.openstreetmap.org/?mlat=${data.plot.latitude}&mlon=${data.plot.longitude}#map=15/${data.plot.latitude}/${data.plot.longitude}`}
                            target="_blank" rel="noreferrer"
                            className="mt-1 inline-block text-sm font-medium text-forest"
                        >
                            Ver ubicación en el mapa →
                        </a>
                    )}
                </Card>

                {/* Fechas */}
                <Card icon={Calendar} title="Campaña">
                    <p className="text-sm text-ink/80">Siembra: <strong>{formatDate(data.plot.plantingDate)}</strong></p>
                    <p className="text-sm text-ink/80">Cosecha estimada: <strong>{formatDate(data.plot.estimatedHarvestDate)}</strong></p>
                    <p className="text-sm text-ink/80">Lote cerrado: <strong>{formatDate(data.closedAt)}</strong></p>
                </Card>

                {/* Aplicaciones de pesticidas */}
                <Card icon={FlaskConical} title={`Aplicaciones (${data.applications.length})`}>
                    {data.applications.length === 0 ? (
                        <p className="text-sm text-muted">Sin aplicaciones de pesticidas registradas.</p>
                    ) : (
                        <ul className="space-y-4">
                            {data.applications.map((app, index) => (
                                <li key={index} className="border-t border-black/5 pt-4 first:border-0 first:pt-0">
                                    <div className="flex items-start gap-3">
                                        {photoSrc(app.photoUrl) && (
                                            <img src={photoSrc(app.photoUrl)} alt="Evidencia"
                                                className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-ink">{app.pesticide}</p>
                                            {app.activeIngredient && (
                                                <p className="text-xs text-muted">{app.activeIngredient}</p>
                                            )}
                                            <p className="mt-1 text-sm text-ink/80">
                                                {formatDate(app.appliedAt)} · dosis {app.dose}{app.doseUnit ? ` ${app.doseUnit}` : ''}
                                            </p>
                                            {app.withdrawalDays != null && (
                                                <p className="text-xs text-muted">Carencia: {app.withdrawalDays} días</p>
                                            )}
                                            {app.observations && <p className="mt-1 text-sm text-ink/70">{app.observations}</p>}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>

                <p className="pb-6 text-center text-xs text-muted">
                    Información declarada por el agricultor y registrada con AgroGuardian.
                </p>
            </div>
        </main>
    )
}

function Card({ icon: Icon, title, children }) {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                <Icon size={15} className="text-forest" /> {title}
            </h2>
            {children}
        </section>
    )
}

function CenteredMessage({ children }) {
    return (
        <main className="grid min-h-screen place-items-center bg-cream p-6 text-center font-sans">
            <div className="flex flex-col items-center">{children}</div>
        </main>
    )
}
