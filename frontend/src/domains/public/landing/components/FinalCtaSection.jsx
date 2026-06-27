import { Link } from 'react-router'

export default function FinalCtaSection() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-forest px-8 py-16 sm:px-14">
                {/* Círculo decorativo */}
                <span className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/5" />

                <div className="relative max-w-2xl">
                    <h2 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
                        Empieza hoy. Funciona sin internet, contigo en el campo.
                    </h2>
                    <p className="mt-4 text-lg text-white/70">
                        Crea tu cuenta gratis y registra tu primera aplicación en minutos.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            to="/registro"
                            className="rounded-full bg-white px-7 py-3.5 font-semibold text-forest transition-colors hover:bg-white/90"
                        >
                            Crear mi cuenta
                        </Link>
                        <Link
                            to="/contacto"
                            className="rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
                        >
                            Hablar con el equipo
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
