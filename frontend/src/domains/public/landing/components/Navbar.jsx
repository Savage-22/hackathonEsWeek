import { useState } from 'react'
import { Link, NavLink } from 'react-router'

import BrandMark from './BrandMark.jsx'
import { PUBLIC_NAV } from '../navConfig.js'

export default function Navbar() {
    const [open, setOpen] = useState(false)

    const linkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors hover:text-forest ${
            isActive ? 'text-forest' : 'text-ink/70'
        }`

    const mobileLinkClass = ({ isActive }) =>
        `block py-2 text-sm font-medium transition-colors hover:text-forest ${
            isActive ? 'text-forest' : 'text-ink/80'
        }`

    return (
        <header className="sticky top-0 z-50 border-b border-black/5 bg-cream/90 backdrop-blur">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                <Link to="/" aria-label="AgroGuardian — inicio">
                    <BrandMark />
                </Link>

                {/* Enlaces de vista (escritorio) */}
                <ul className="hidden items-center gap-7 lg:flex">
                    {PUBLIC_NAV.map((item) => (
                        <li key={item.to}>
                            <NavLink to={item.to} end={item.to === '/'} className={linkClass}>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Accesos (escritorio) */}
                <div className="hidden items-center gap-3 lg:flex">
                    <Link to="/login" className="text-sm font-semibold text-forest hover:text-forest-deep">
                        Iniciar sesión
                    </Link>
                    <Link
                        to="/registro"
                        className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-deep"
                    >
                        Crear cuenta
                    </Link>
                </div>

                {/* Botón móvil */}
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="grid h-10 w-10 place-items-center rounded-lg text-ink lg:hidden"
                    aria-label="Abrir menú"
                    aria-expanded={open}
                >
                    <span className="text-2xl leading-none">{open ? '✕' : '☰'}</span>
                </button>
            </nav>

            {/* Menú móvil desplegable */}
            {open && (
                <div className="border-t border-black/5 bg-cream lg:hidden">
                    <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
                        {PUBLIC_NAV.map((item) => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end={item.to === '/'}
                                    onClick={() => setOpen(false)}
                                    className={mobileLinkClass}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                        <li className="mt-2 flex gap-3 border-t border-black/5 pt-3">
                            <Link
                                to="/login"
                                onClick={() => setOpen(false)}
                                className="flex-1 rounded-full border border-forest py-2.5 text-center text-sm font-semibold text-forest"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/registro"
                                onClick={() => setOpen(false)}
                                className="flex-1 rounded-full bg-forest py-2.5 text-center text-sm font-semibold text-white"
                            >
                                Crear cuenta
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}
