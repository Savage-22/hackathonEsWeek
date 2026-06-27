import { useEffect, useState } from 'react'
import { QrCode, RefreshCw } from 'lucide-react'

import { onConnectivityChange } from '../../../../infrastructure/offline/syncManager.js'
import QrCard from './QrCard.jsx'
import { generateBatch, getBatches, flushBatches } from '../services/traceabilityService.js'

// Sección "cerrar producción": genera el lote (#21) y muestra su QR. Se embebe
// en la página de la parcela, junto al historial de aplicaciones.
export default function BatchSection({ plot }) {
    const [batches, setBatches] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)

    const refresh = async () => setBatches(await getBatches(plot.localId))

    useEffect(() => {
        refresh()
        // Al volver la conexión, sincroniza lotes pendientes (obtienen su código).
        const unsubscribe = onConnectivityChange(async (online) => {
            if (!online) return
            await flushBatches()
            await refresh()
        })
        return unsubscribe
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plot.localId])

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            await generateBatch(plot)
            await refresh()
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <section className="mt-8">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-ink">Lote y QR</h2>
                <button type="button" onClick={handleGenerate} disabled={isGenerating}
                    className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-forest-deep disabled:opacity-60">
                    <QrCode size={16} />
                    {isGenerating ? 'Generando…' : 'Cerrar producción'}
                </button>
            </div>

            {batches.length === 0 ? (
                <p className="mt-3 text-sm text-muted">
                    Cierra la producción para generar el QR de trazabilidad de esta cosecha.
                </p>
            ) : (
                <ul className="mt-4 space-y-4">
                    {batches.map((batch) => (
                        <li key={batch.localId}>
                            {batch.code ? (
                                <QrCard code={batch.code} />
                            ) : (
                                <div className="flex items-center gap-2 rounded-xl border border-dashed border-accent/40 bg-accent/5 px-4 py-3 text-sm text-ink">
                                    <RefreshCw size={16} className="text-accent" />
                                    Lote creado sin conexión. El código y el QR aparecerán al sincronizar.
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
