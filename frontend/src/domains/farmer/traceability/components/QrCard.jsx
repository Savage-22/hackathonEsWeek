import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Share2, ExternalLink } from 'lucide-react'

import { publicUrlForCode } from '../services/traceabilityService.js'

// Render del QR del lote + acciones de descarga y compartir. El QR codifica la
// URL pública /t/:code que abre el comprador al escanear.
export default function QrCard({ code }) {
    const wrapRef = useRef(null)
    const url = publicUrlForCode(code)

    const getCanvas = () => wrapRef.current?.querySelector('canvas')

    const download = () => {
        const canvas = getCanvas()
        if (!canvas) return
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `lote-${code}.png`
        link.click()
    }

    const share = async () => {
        // Comparte el archivo del QR si el dispositivo lo soporta; si no, la URL.
        const canvas = getCanvas()
        try {
            if (canvas && navigator.canShare) {
                const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
                const file = new File([blob], `lote-${code}.png`, { type: 'image/png' })
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({ files: [file], title: `Trazabilidad ${code}`, text: url })
                    return
                }
            }
            if (navigator.share) {
                await navigator.share({ title: `Trazabilidad ${code}`, text: url, url })
                return
            }
            await navigator.clipboard.writeText(url)
            alert('Enlace copiado al portapapeles')
        } catch {
            // El usuario canceló el diálogo de compartir: sin acción.
        }
    }

    return (
        <div className="flex flex-col items-center rounded-xl border border-black/10 bg-white p-4">
            <div ref={wrapRef} className="rounded-lg bg-white p-2">
                <QRCodeCanvas value={url} size={160} level="M" includeMargin />
            </div>
            <p className="mt-2 font-mono text-sm font-semibold text-ink">{code}</p>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={download}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-white hover:bg-forest-deep">
                    <Download size={15} /> Descargar
                </button>
                <button type="button" onClick={share}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-forest/30 px-3 py-2 text-sm font-semibold text-forest hover:bg-forest/5">
                    <Share2 size={15} /> Compartir
                </button>
                <a href={url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold text-muted hover:text-ink">
                    <ExternalLink size={15} /> Ver ficha
                </a>
            </div>
        </div>
    )
}
