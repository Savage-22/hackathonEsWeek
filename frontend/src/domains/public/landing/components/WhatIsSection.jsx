import { Target, FileText, Star } from 'lucide-react'

const CARDS = [
    {
        icon: Target,
        iconClass: 'bg-primary/15 text-primary',
        title: 'Usa bien los pesticidas',
        text: 'Recomendaciones claras de dosis y plazos de seguridad para cada cultivo.',
    },
    {
        icon: FileText,
        iconClass: 'bg-info/15 text-info',
        title: 'Registra y demuestra',
        text: 'Cada aplicación queda guardada y genera un historial verificable de tu producto.',
    },
    {
        icon: Star,
        iconClass: 'bg-accent/20 text-accent',
        title: 'Gana por hacerlo bien',
        text: 'Acumula el sello AgroGuardian y accede a mejores mercados e incentivos.',
    },
]

export default function WhatIsSection() {
    return (
        <section className="bg-beige">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    ¿Qué es AgroGuardian?
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                    Una plataforma que cuida a quien trabaja la tierra.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
                    Más del 46 % de las verduras en Huánuco tienen residuos de pesticidas sobre el
                    límite permitido. AgroGuardian ayuda a cambiar eso: te guía para aplicar la dosis
                    correcta, guarda el registro de cada aplicación y convierte tus buenas prácticas
                    en confianza y mejores precios.
                </p>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {CARDS.map(({ icon: Icon, iconClass, title, text }) => (
                        <div key={title} className="rounded-2xl border border-black/5 bg-cream p-7 shadow-sm">
                            <span className={`grid h-12 w-12 place-items-center rounded-xl ${iconClass}`}>
                                <Icon size={22} />
                            </span>
                            <h3 className="mt-5 font-display text-xl font-bold text-ink">{title}</h3>
                            <p className="mt-2 leading-relaxed text-muted">{text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
