import StripedPlaceholder from './StripedPlaceholder.jsx'

const AUDIENCES = [
    {
        tag: 'FOTO · agricultor',
        title: 'Agricultores',
        text: 'Aplican con seguridad, evitan multas y venden mejor sus productos.',
        base: 'rgba(22, 163, 74, 0.08)',
        stripe: 'rgba(22, 163, 74, 0.16)',
    },
    {
        tag: 'FOTO · mercado',
        title: 'Compradores y mercados',
        text: 'Verifican el origen y la calidad con un simple código de trazabilidad.',
        base: 'rgba(59, 130, 246, 0.08)',
        stripe: 'rgba(59, 130, 246, 0.16)',
    },
    {
        tag: 'FOTO · familia',
        title: 'Familias y salud pública',
        text: 'Consumen verduras más sanas y se reduce el riesgo para la comunidad.',
        base: 'rgba(245, 158, 11, 0.10)',
        stripe: 'rgba(245, 158, 11, 0.18)',
    },
]

export default function ChainSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="grid items-end gap-6 lg:grid-cols-2">
                <h2 className="max-w-md font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                    Ayuda a todos los que están en la cadena
                </h2>
                <p className="text-lg leading-relaxed text-muted lg:justify-self-end lg:text-right">
                    Desde el campo hasta tu mesa, todos ganan cuando se usan bien los pesticidas.
                </p>
            </div>

            <div className="mt-12 grid gap-7 md:grid-cols-3">
                {AUDIENCES.map((audience) => (
                    <div key={audience.title}>
                        <StripedPlaceholder
                            base={audience.base}
                            stripe={audience.stripe}
                            className="h-60 rounded-2xl border border-black/5"
                        >
                            <span className="absolute bottom-4 left-4 rounded-md bg-white/70 px-3 py-1 font-mono text-xs text-ink/60">
                                {audience.tag}
                            </span>
                        </StripedPlaceholder>
                        <h3 className="mt-5 font-display text-xl font-bold text-forest">{audience.title}</h3>
                        <p className="mt-2 leading-relaxed text-muted">{audience.text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
