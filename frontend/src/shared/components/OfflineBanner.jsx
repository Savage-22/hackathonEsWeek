import { useOnlineStatus } from '../hooks/useOnlineStatus.js'

// Aviso fijo cuando no hay conexión: los datos se guardan localmente y se
// sincronizan al volver la red.
export default function OfflineBanner() {
    const online = useOnlineStatus()
    if (online) return null

    return (
        <div className="bg-accent/15 px-4 py-2 text-center text-sm text-gray-800">
            Sin conexión — tus datos se guardan en el dispositivo y se sincronizan al volver la red.
        </div>
    )
}
