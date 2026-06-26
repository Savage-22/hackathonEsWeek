import { usePwaInstall } from '../hooks/usePwaInstall.js'

// Botón para instalar la PWA en el dispositivo (visible solo cuando Android/Chrome
// ofrece la instalación). En iOS/escritorio o si ya está instalada, no se muestra.
export default function InstallButton() {
    const { canInstall, promptInstall } = usePwaInstall()
    if (!canInstall) return null

    return (
        <button
            type="button"
            onClick={promptInstall}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
            Instalar app
        </button>
    )
}
