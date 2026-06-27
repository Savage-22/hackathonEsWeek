import { AlertTriangle, ShieldAlert, Info } from 'lucide-react'

// Render de las alertas tipadas del motor de buenas prácticas (#18). El estilo
// se decide por `severity`, no por el texto del mensaje.
const SEVERITY = {
    danger: { icon: ShieldAlert, box: 'bg-error/10 text-error' },
    warning: { icon: AlertTriangle, box: 'bg-accent/15 text-ink' },
    info: { icon: Info, box: 'bg-info/10 text-info' },
}

export default function AlertList({ alerts }) {
    if (!alerts?.length) return null

    return (
        <ul className="space-y-2">
            {alerts.map((alert) => {
                const style = SEVERITY[alert.severity] ?? SEVERITY.info
                const Icon = style.icon
                return (
                    <li key={alert.type} className={`flex items-start gap-3 rounded-lg px-4 py-3 ${style.box}`}>
                        <Icon size={18} className="mt-0.5 shrink-0" />
                        <span className="text-sm">{alert.message}</span>
                    </li>
                )
            })}
        </ul>
    )
}
