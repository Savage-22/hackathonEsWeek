import { getUser } from '../../../../infrastructure/session.js'
import { useLogout } from '../../../../shared/hooks/useLogout.js'

// Placeholder: el dashboard real se construye en #24
export default function PanelHomePage() {
    const user = getUser()
    const logout = useLogout('/panel/login')

    return (
        <main className="min-h-screen p-6">
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-primary">AgroGuardian · Panel</h1>
                <button type="button" onClick={logout} className="text-sm text-gray-500 hover:text-error">
                    Cerrar sesión
                </button>
            </header>

            <p className="mt-8 text-gray-700">
                {user?.name} — {user?.role}
            </p>
        </main>
    )
}
