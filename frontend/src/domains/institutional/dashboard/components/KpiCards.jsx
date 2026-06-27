import { Users, MapPinned, SprayCan, BadgeCheck } from 'lucide-react'

// Tarjetas KPI con los conteos globales (#24). Recibe el objeto kpis de #23.
const CARDS = [
    { key: 'farmers', label: 'Agricultores', icon: Users },
    { key: 'plots', label: 'Parcelas', icon: MapPinned },
    { key: 'applications', label: 'Aplicaciones', icon: SprayCan },
    { key: 'certified_farmers', label: 'Certificados', icon: BadgeCheck },
]

export default function KpiCards({ kpis }) {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CARDS.map(({ key, label, icon: Icon }) => (
                <div key={key} className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-muted">
                        <Icon size={16} className="text-forest" />
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                    <p className="mt-2 font-display text-3xl font-bold text-ink">{kpis[key] ?? 0}</p>
                </div>
            ))}
        </div>
    )
}
