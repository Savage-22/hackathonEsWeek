import { useEffect, useState } from 'react'

// Captura el evento `beforeinstallprompt` (Android/Chrome) para ofrecer la
// instalación "agregar a pantalla de inicio" desde un botón propio.
export function usePwaInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState(null)

    useEffect(() => {
        function onBeforeInstall(event) {
            event.preventDefault()
            setDeferredPrompt(event)
        }
        function onInstalled() {
            setDeferredPrompt(null)
        }
        window.addEventListener('beforeinstallprompt', onBeforeInstall)
        window.addEventListener('appinstalled', onInstalled)
        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstall)
            window.removeEventListener('appinstalled', onInstalled)
        }
    }, [])

    async function promptInstall() {
        if (!deferredPrompt) return
        await deferredPrompt.prompt()
        setDeferredPrompt(null)
    }

    return { canInstall: deferredPrompt !== null, promptInstall }
}
