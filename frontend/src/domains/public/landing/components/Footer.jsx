import { Link } from 'react-router'

import BrandMark from './BrandMark.jsx'

// Columnas del footer. Los enlaces de sección apuntan a las anclas de la landing.
const COLUMNS = [
    {
        title: 'Producto',
        links: [
            { label: 'Cómo funciona', href: '#como-funciona' },
            { label: 'Características', href: '#caracteristicas' },
            { label: 'Trazabilidad', href: '#trazabilidad' },
            { label: 'Incentivos', href: '#incentivos' },
        ],
    },
    {
        title: 'Acceso',
        links: [
            { label: 'Iniciar sesión', to: '/login' },
            { label: 'Crear cuenta', to: '/registro' },
            { label: 'Contacto', href: '#contacto' },
        ],
    },
    {
        title: 'Recursos',
        links: [
            { label: 'Guías de uso', href: '#como-funciona' },
            { label: 'Preguntas frecuentes', href: '#contacto' },
            { label: 'Soporte', href: '#contacto' },
        ],
    },
]

function FooterLink({ link }) {
    const className = 'text-sm text-white/70 transition-colors hover:text-white'
    if (link.to) {
        return (
            <Link to={link.to} className={className}>
                {link.label}
            </Link>
        )
    }
    return (
        <a href={link.href} className={className}>
            {link.label}
        </a>
    )
}

export default function Footer() {
    return (
        <footer className="bg-forest-deep text-white">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
                    <div>
                        <BrandMark tone="light" />
                        <p className="mt-4 max-w-xs text-sm text-white/70">
                            Tecnología que cuida la tierra y a quien la trabaja. Buenas prácticas
                            agrícolas para Huánuco, con o sin internet.
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Funciona sin conexión
                        </span>
                    </div>

                    {COLUMNS.map((column) => (
                        <div key={column.title}>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                                {column.title}
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <FooterLink link={link} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <span>Cuidamos juntos la Pachamama · Huánuco, Perú</span>
                    <span>© 2026 AgroGuardian</span>
                </div>
            </div>
        </footer>
    )
}
