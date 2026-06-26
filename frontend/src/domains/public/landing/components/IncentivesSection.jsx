import { Link } from 'react-router'
import { Sprout, Award, Trophy, Store, TrendingUp, GraduationCap, Handshake } from 'lucide-react'

const LEVELS = [
    {
        icon: Sprout,
        name: 'Sello Bronce',
        badge: 'Primeros pasos',
        badgeClass: 'bg-orange-100 text-orange-700',
        iconClass: 'bg-orange-100 text-orange-600',
        text: 'Comienza a registrar tus siembras y cosechas básicas.',
        featured: false,
    },
    {
        icon: Award,
        name: 'Sello Plata',
        badge: 'Buen cumplimiento',
        badgeClass: 'bg-slate-100 text-slate-600',
        iconClass: 'bg-slate-100 text-slate-500',
        text: 'Mantén un registro constante y aplica prácticas recomendadas.',
        featured: true,
    },
    {
        icon: Trophy,
        name: 'Sello Oro',
        badge: 'Agricultor modelo',
        badgeClass: 'bg-amber-100 text-amber-700',
        iconClass: 'bg-amber-100 text-amber-600',
        text: 'Trazabilidad completa, sostenibilidad total e influencia positiva.',
        featured: false,
    },
]

const SECONDARY_BENEFITS = [
    {
        icon: GraduationCap,
        iconClass: 'bg-primary/15 text-primary',
        title: 'Capacitación',
        text: 'Cursos gratuitos y asesoría técnica especializada.',
    },
    {
        icon: Handshake,
        iconClass: 'bg-accent/20 text-accent',
        title: 'Alianzas',
        text: 'Descuentos en insumos con socios locales.',
    },
]

export default function IncentivesSection() {
    return (
        <section id="incentivos" className="scroll-mt-20 bg-cream">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
                {/* Hero */}
                <div
                    className="relative overflow-hidden rounded-3xl px-6 py-20 text-center"
                    style={{ background: 'linear-gradient(135deg, #1a5d36 0%, #0f3d24 100%)' }}
                >
                    <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-20"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(115deg, rgba(255,255,255,0.10) 0 2px, transparent 2px 22px)',
                        }}
                    />
                    <div className="relative mx-auto max-w-2xl">
                        <h2 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
                            Hacer las cosas bien tiene su recompensa
                        </h2>
                        <p className="mt-5 leading-relaxed text-white/75">
                            Registra tus actividades, acumula puntos y sube de nivel con los Sellos
                            AgroGuardian. Tu esfuerzo por una agricultura sostenible se traduce en
                            beneficios reales.
                        </p>
                    </div>
                </div>

                {/* Niveles */}
                <div className="mt-16 text-center">
                    <h3 className="font-display text-3xl font-bold text-forest">Tu Camino al Éxito</h3>
                    <p className="mt-2 text-muted">
                        Mejora tus prácticas y desbloquea nuevos niveles de reconocimiento.
                    </p>
                </div>

                <div className="mt-10 grid items-start gap-6 md:grid-cols-3">
                    {LEVELS.map(({ icon: Icon, name, badge, badgeClass, iconClass, text, featured }) => (
                        <div
                            key={name}
                            className={`rounded-2xl border bg-white p-8 text-center ${
                                featured
                                    ? 'border-black/5 shadow-xl md:-translate-y-4'
                                    : 'border-black/5 shadow-sm'
                            }`}
                        >
                            <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${iconClass}`}>
                                <Icon size={28} />
                            </span>
                            <h4 className="mt-5 font-display text-xl font-bold text-ink">{name}</h4>
                            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                                {badge}
                            </span>
                            <p className="mt-4 leading-relaxed text-muted">{text}</p>
                        </div>
                    ))}
                </div>

                {/* Beneficios reales */}
                <div className="mt-20 text-center">
                    <h3 className="font-display text-3xl font-bold text-forest">Beneficios Reales</h3>
                    <p className="mt-2 text-muted">Tus sellos abren puertas a oportunidades tangibles.</p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    {/* Card destacada con imagen */}
                    <div
                        className="relative flex min-h-72 flex-col justify-end overflow-hidden rounded-2xl p-8 text-white"
                        style={{ background: 'linear-gradient(160deg, #2f7a48 0%, #14532d 100%)' }}
                    >
                        <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 opacity-15"
                            style={{
                                backgroundImage:
                                    'repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 1px, transparent 1px 16px)',
                            }}
                        />
                        <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/15">
                            <Store size={22} />
                        </span>
                        <h4 className="relative mt-4 font-display text-2xl font-bold">
                            Acceso a mejores mercados
                        </h4>
                        <p className="relative mt-2 max-w-md text-white/80">
                            Conecta directamente con compradores que valoran la calidad y la trazabilidad
                            de tus cultivos.
                        </p>
                    </div>

                    {/* Columna derecha */}
                    <div className="grid gap-6">
                        <div className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/20 text-accent">
                                <TrendingUp size={22} />
                            </span>
                            <h4 className="mt-4 font-display text-xl font-bold text-ink">
                                Mejor precio por producto
                            </h4>
                            <p className="mt-2 leading-relaxed text-muted">
                                Negocia con la confianza que te da un historial documentado y verificado.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            {SECONDARY_BENEFITS.map(({ icon: Icon, iconClass, title, text }) => (
                                <div key={title} className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
                                    <span className={`grid h-11 w-11 place-items-center rounded-xl ${iconClass}`}>
                                        <Icon size={22} />
                                    </span>
                                    <h4 className="mt-4 font-display text-lg font-bold text-ink">{title}</h4>
                                    <p className="mt-2 leading-relaxed text-muted">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Banner quechua */}
                <div className="mt-10 flex flex-col items-start gap-6 rounded-2xl border border-black/5 bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="font-display text-2xl font-bold text-forest">Allin ruray, allin chaskiy</h4>
                        <p className="mt-1 max-w-xl text-muted">
                            <em>Hacer bien, recibir bien.</em> Premiamos a quien cuida la tierra, su salud
                            y la de su comunidad.
                        </p>
                    </div>
                    <Link
                        to="/registro"
                        className="shrink-0 rounded-full bg-forest px-7 py-3.5 font-semibold text-white transition-colors hover:bg-forest-deep"
                    >
                        Empezar a sumar
                    </Link>
                </div>
            </div>
        </section>
    )
}
