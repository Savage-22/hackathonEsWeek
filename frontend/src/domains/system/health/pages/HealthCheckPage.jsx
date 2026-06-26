import { useEffect, useState } from 'react'

import { checkHealth } from '../services/healthService.js'

const STATUS_STYLES = {
    checking: 'bg-gray-100 text-gray-600',
    online: 'bg-success/10 text-success',
    offline: 'bg-error/10 text-error',
}

const STATUS_LABEL = {
    checking: 'Verificando conexión…',
    online: 'API operativa',
    offline: 'API no disponible',
}

export default function HealthCheckPage() {
    const [status, setStatus] = useState('checking')
    const [message, setMessage] = useState('')

    useEffect(() => {
        let isMounted = true

        async function loadHealth() {
            try {
                const result = await checkHealth()
                if (isMounted) {
                    setStatus('online')
                    setMessage(result.message)
                }
            } catch {
                if (isMounted) setStatus('offline')
            }
        }

        loadHealth()

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-sm p-8 text-center">
                <h1 className="text-2xl font-bold text-primary">AgroGuardian</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Cultivando tecnología, cosechando calidad
                </p>

                <div className={`mt-6 rounded-lg px-4 py-3 text-sm font-medium ${STATUS_STYLES[status]}`}>
                    {STATUS_LABEL[status]}
                </div>

                {message && <p className="mt-3 text-xs text-gray-400">{message}</p>}
            </div>
        </main>
    )
}
