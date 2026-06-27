import { Link } from 'react-router'
import { UserRound, Sprout, ChevronRight } from 'lucide-react'

import { getUser } from '../../../../infrastructure/session.js'
import { useLogout } from '../../../../shared/hooks/useLogout.js'
import OfflineBanner from '../../../../shared/components/OfflineBanner.jsx'
import InstallButton from '../../../../shared/components/InstallButton.jsx'

// Accesos principales del agricultor. Cada uno funciona offline-first (#13/#14).
const SHORTCUTS = [
    { to: '/app/perfil', icon: UserRound, title: 'Mi perfil', desc: 'Tus datos de agricultor' },
    { to: '/app/parcelas', icon: Sprout, title: 'Mis parcelas', desc: 'Registra parcelas con ubicación GPS' },
]

export default function FarmerHomePage() {
    const user = getUser()
    const logout = useLogout('/login')

    return (
        <main className="min-h-screen bg-surface">
            <OfflineBanner />
            <div className="mx-auto max-w-2xl p-6">
                <header className="flex items-center justify-between">
                    <h1 className="font-display text-xl font-bold text-forest">AgroGuardian</h1>
                    <button type="button" onClick={logout} className="text-sm text-muted hover:text-error">
                        Cerrar sesión
                    </button>
                </header>

                <p className="mt-8 text-ink">Bienvenido, <span className="font-semibold">{user?.name}</span></p>

                <nav className="mt-6 space-y-3">
                    {SHORTCUTS.map(({ to, icon: Icon, title, desc }) => (
                        <Link key={to} to={to}
                            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-colors hover:bg-forest/5">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest/10 text-forest">
                                <Icon size={20} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-ink">{title}</p>
                                <p className="truncate text-sm text-muted">{desc}</p>
                            </div>
                            <ChevronRight size={18} className="text-muted" />
                        </Link>
                    ))}
                </nav>

                <div className="mt-6">
                    <InstallButton />
                </div>
            </div>
        </main>
    )
}
