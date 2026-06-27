import { Ban, Target, QrCode, Star, CircleCheck, Link2 } from 'lucide-react'

const FEATURES = [
    {
        icon: Ban,
        iconClass: 'bg-info/15 text-info',
        title: 'Modo sin conexión',
        text: 'Registra y consulta todo en el campo. Los datos se guardan en el celular y se sincronizan al recuperar señal.',
    },
    {
        icon: Target,
        iconClass: 'bg-primary/15 text-primary',
        title: 'Calculadora de dosis',
        text: 'Te indica la cantidad exacta de producto y agua según tu cultivo y la plaga que enfrentas.',
    },
    {
        icon: QrCode,
        iconClass: 'bg-accent/20 text-accent',
        title: 'Historial y trazabilidad',
        text: 'Cada aplicación queda registrada y genera un código QR verificable por compradores y autoridades.',
    },
    {
        icon: Star,
        iconClass: 'bg-accent/20 text-accent',
        title: 'Alertas y plazos de carencia',
        text: 'Te avisa cuántos días esperar antes de cosechar para que tu producto sea seguro de consumir.',
    },
    {
        icon: CircleCheck,
        iconClass: 'bg-primary/15 text-primary',
        title: 'Sello e incentivos',
        text: 'Acumula reconocimiento por buenas prácticas y accede a beneficios, capacitación y mejores mercados.',
    },
    {
        icon: Link2,
        iconClass: 'bg-info/15 text-info',
        title: 'Pensado para todos',
        text: 'Interfaz clara y sencilla, con textos en español y apoyos en quechua para que nadie se quede atrás.',
    },
]

export default function FeaturesSection() {
    return (
        <section id="caracteristicas" className="scroll-mt-20">
            {/* Encabezado en banda beige */}
            <div className="bg-beige">
                <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Características</p>
                    <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                        Todo lo que necesitas para aplicar con seguridad
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-muted">
                        Herramientas pensadas para el campo real de Huánuco: simples, en tu idioma y sin
                        depender del internet.
                    </p>
                </div>
            </div>

            {/* Grid de features */}
            <div className="bg-cream">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon: Icon, iconClass, title, text }) => (
                        <div key={title} className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
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
