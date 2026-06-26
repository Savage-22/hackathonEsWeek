import { getUser } from '../../../../infrastructure/session.js'
import { useLogout } from '../../../../shared/hooks/useLogout.js'
import OfflineBanner from '../../../../shared/components/OfflineBanner.jsx'
import InstallButton from '../../../../shared/components/InstallButton.jsx'

// Placeholder: el home real del agricultor se construye en #13
export default function FarmerHomePage() {
    const user = getUser()
    const logout = useLogout('/login')

    return (
        <main className="min-h-screen">
            <OfflineBanner />
            <div className="p-6">
                <header className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-primary">AgroGuardian</h1>
                    <button type="button" onClick={logout} className="text-sm text-gray-500 hover:text-error">
                        Cerrar sesión
                    </button>
                </header>

                <p className="mt-8 text-gray-700">Bienvenido, {user?.name}</p>

                <div className="mt-6">
                    <InstallButton />
                </div>
            </div>
        </main>
    )
}
