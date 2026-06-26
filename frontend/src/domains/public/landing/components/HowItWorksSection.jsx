import { Link } from 'react-router'
import { Leaf, UserPlus, Tractor, RefreshCcw, BadgeCheck, WifiOff, ArrowRight } from 'lucide-react'

import StripedPlaceholder from './StripedPlaceholder.jsx'

export default function HowItWorksSection() {
    return (
        <section id="como-funciona" className="scroll-mt-20 bg-cream">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
                {/* Encabezado */}
                <div className="mx-auto max-w-3xl rounded-3xl bg-primary/5 px-6 py-10 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 text-sm font-medium text-forest">
                        <Leaf size={15} />
                        Rimaykullayki (Bienvenido)
                    </span>
                    <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                        Tecnología que respeta tu tierra, <span className="text-primary">paso a paso.</span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted">
                        Diseñado para ser tan sencillo como usar una herramienta de mano. Registra,
                        protege y da valor a tu cosecha sin complicaciones tecnológicas, incluso cuando
                        estás lejos de la señal.
                    </p>
                </div>

                {/* Bento de pasos */}
                <div className="mt-12 grid gap-6 lg:grid-cols-3">
                    {/* Paso 1 (ancho) */}
                    <article className="flex flex-col gap-6 rounded-2xl border border-black/5 bg-white p-7 shadow-sm sm:flex-row lg:col-span-2">
                        <div className="flex-1">
                            <span className="grid h-11 w-11 place-items-center rounded-full bg-ink/5 text-ink">
                                <UserPlus size={20} />
                            </span>
                            <h3 className="mt-4 font-display text-xl font-bold text-ink">1. Empieza fácilmente</h3>
                            <p className="mt-2 leading-relaxed text-muted">
                                Crea tu perfil en minutos con datos básicos. Nuestro sistema está pensado
                                para agricultores, sin jerga técnica. Lo mejor: puedes configurar tu cuenta
                                inicial sin necesidad de una conexión a internet fuerte.
                            </p>
                        </div>
                        <StripedPlaceholder
                            base="rgba(22, 163, 74, 0.10)"
                            stripe="rgba(22, 163, 74, 0.18)"
                            className="hidden w-44 shrink-0 rounded-xl sm:block"
                        >
                            <span className="absolute bottom-3 left-3 rounded bg-white/70 px-2 py-0.5 font-mono text-[10px] text-ink/60">
                                FOTO · app en la chacra
                            </span>
                        </StripedPlaceholder>
                    </article>

                    {/* Paso 2 */}
                    <article className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white">
                            <Tractor size={20} />
                        </span>
                        <h3 className="mt-4 font-display text-xl font-bold text-ink">2. Diario de campo</h3>
                        <p className="mt-2 leading-relaxed text-muted">
                            Anota tus aplicaciones de insumos, riegos y tareas diarias directamente desde
                            la chacra. Botones grandes y opciones claras para que no pierdas tiempo.
                        </p>
                        <div className="mt-5 flex gap-1.5">
                            <span className="h-1.5 w-6 rounded-full bg-forest" />
                            <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
                            <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
                        </div>
                    </article>

                    {/* Paso 3 */}
                    <article className="relative rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
                        <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink/60">
                            <WifiOff size={13} />
                            Modo Offline
                        </span>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-white">
                            <RefreshCcw size={20} />
                        </span>
                        <h3 className="mt-4 font-display text-xl font-bold text-ink">3. Sincronización sin estrés</h3>
                        <p className="mt-2 leading-relaxed text-muted">
                            ¿No hay señal en la parcela? No te preocupes. AgroGuardian guarda todo
                            localmente de forma segura. Tan pronto como tu teléfono detecte señal (en el
                            pueblo o en casa), los datos se subirán automáticamente.
                        </p>
                    </article>

                    {/* Paso 4 (ancho) */}
                    <article className="rounded-2xl border border-black/5 bg-white p-7 shadow-sm lg:col-span-2">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                            <BadgeCheck size={22} />
                        </span>
                        <h3 className="mt-4 font-display text-xl font-bold text-ink">4. Trazabilidad y Valor</h3>
                        <p className="mt-2 max-w-2xl leading-relaxed text-muted">
                            Tus registros ordenados se transforman en un “pasaporte” digital para tu
                            cultivo. Esto facilita la obtención de certificaciones, asegura la trazabilidad
                            exigida por los compradores y te abre puertas a mejores precios.
                        </p>
                        <Link
                            to="/registro"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
                        >
                            Empezar ahora
                            <ArrowRight size={16} />
                        </Link>
                    </article>
                </div>
            </div>
        </section>
    )
}
