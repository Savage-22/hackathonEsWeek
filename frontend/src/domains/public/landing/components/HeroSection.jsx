import { Link } from 'react-router'
import { Check } from 'lucide-react'

import logo from '../../../../assets/logo.jpeg'
import StripedPlaceholder from './StripedPlaceholder.jsx'

const CHIPS = [
    { label: 'Sin internet', color: 'bg-info' },
    { label: 'Trazabilidad real', color: 'bg-primary' },
    { label: 'Incentivos', color: 'bg-accent' },
]

export default function HeroSection() {
    return (
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            {/* Texto */}
            <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1.5 text-sm font-medium text-forest">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Allin tarpuy · Agricultura responsable
                </span>

                <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
                    Cuida tu cosecha, tu familia y la tierra.
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                    AgroGuardian te acompaña para usar los pesticidas de forma correcta, registrar
                    cada aplicación y demostrar que tus productos son sanos.{' '}
                    <span className="font-semibold text-forest">Funciona aunque no tengas internet.</span>
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        to="/registro"
                        className="rounded-full bg-forest px-7 py-3.5 font-semibold text-white transition-colors hover:bg-forest-deep"
                    >
                        Empezar gratis
                    </Link>
                    <Link
                        to="/como-funciona"
                        className="rounded-full border border-black/10 bg-white px-7 py-3.5 font-semibold text-ink transition-colors hover:border-forest hover:text-forest"
                    >
                        Ver cómo funciona
                    </Link>
                </div>

                <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
                    {CHIPS.map((chip) => (
                        <li key={chip.label} className="flex items-center gap-2 text-sm font-medium text-ink/80">
                            <span className={`h-2.5 w-2.5 rounded-full ${chip.color}`} />
                            {chip.label}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mockup */}
            <div className="relative">
                <StripedPlaceholder className="aspect-[4/5] w-full rounded-3xl border border-black/5">
                    <span className="absolute left-5 top-5 grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-md">
                        <img src={logo} alt="" className="h-12 w-12 object-contain" />
                    </span>
                    <span className="absolute bottom-5 left-5 rounded-md bg-white/70 px-3 py-1 font-mono text-xs text-ink/60">
                        FOTO · agricultor en su chacra
                    </span>
                </StripedPlaceholder>

                <div className="absolute -bottom-5 right-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-lg sm:right-0">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
                        <Check size={20} strokeWidth={3} />
                    </span>
                    <span className="leading-tight">
                        <span className="block text-sm font-semibold text-ink">Aplicación registrada</span>
                        <span className="block text-xs text-muted">Dosis dentro del límite seguro</span>
                    </span>
                </div>
            </div>
        </section>
    )
}
