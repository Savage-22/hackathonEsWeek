import { useMemo, useState } from 'react'
import { Search, BadgeCheck } from 'lucide-react'

// Tabla/ranking de agricultores con filtro en memoria (#24): el useMemo recalcula
// la lista sin recargar ni volver a pedir datos al backend.
export default function FarmersTable({ farmers }) {
    const [query, setQuery] = useState('')
    const [onlyCertified, setOnlyCertified] = useState(false)

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase()
        return farmers.filter((farmer) => {
            if (onlyCertified && !farmer.certified) return false
            if (!term) return true
            return [farmer.name, farmer.district, farmer.community, farmer.association]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(term))
        })
    }, [farmers, query, onlyCertified])

    return (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold text-ink">
                    Agricultores <span className="text-muted">({filtered.length})</span>
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 rounded-lg border border-black/10 bg-cream px-3 py-2">
                        <Search size={15} className="text-muted" />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Buscar por nombre o distrito…"
                            className="w-56 bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
                        />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-muted">
                        <input
                            type="checkbox"
                            checked={onlyCertified}
                            onChange={(event) => setOnlyCertified(event.target.checked)}
                            className="accent-forest"
                        />
                        Solo certificados
                    </label>
                </div>
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-black/10 text-xs uppercase tracking-wide text-muted">
                            <th className="px-3 py-2 font-semibold">Agricultor</th>
                            <th className="px-3 py-2 font-semibold">Distrito</th>
                            <th className="px-3 py-2 text-right font-semibold">Parcelas</th>
                            <th className="px-3 py-2 text-right font-semibold">Aplicaciones</th>
                            <th className="px-3 py-2 font-semibold">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-3 py-6 text-center text-muted">
                                    No se encontraron agricultores con ese criterio.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((farmer) => (
                                <tr key={farmer.id} className="border-b border-black/5 last:border-0">
                                    <td className="px-3 py-3">
                                        <p className="font-medium text-ink">{farmer.name}</p>
                                        {farmer.association && (
                                            <p className="text-xs text-muted">{farmer.association}</p>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-ink/80">{farmer.district || '—'}</td>
                                    <td className="px-3 py-3 text-right text-ink/80">{farmer.plots}</td>
                                    <td className="px-3 py-3 text-right text-ink/80">{farmer.applications}</td>
                                    <td className="px-3 py-3">
                                        {farmer.certified ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-forest/10 px-2.5 py-1 text-xs font-semibold text-forest">
                                                <BadgeCheck size={13} /> Certificado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-beige px-2.5 py-1 text-xs font-medium text-muted">
                                                Sin lote
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
