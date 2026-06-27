import { QRCodeSVG } from 'qrcode.react'

const BATCH_CODE = 'AG-HCO-2026-0421'

// Eventos de ejemplo del lote (los colores siguen el diseño).
const TIMELINE = [
    { date: '12 abr 2026', title: 'Siembra registrada', color: '#16a34a' },
    {
        date: '28 may 2026',
        title: 'Aplicación: Cipermetrina 40 ml/20 L',
        detail: 'Dentro del límite · carencia 7 días',
        color: '#3b82f6',
    },
    { date: '18 jun 2026', title: 'Plazo de carencia cumplido', color: '#f59e0b' },
    { date: '21 jun 2026', title: 'Cosecha lista para venta segura', color: '#14532d' },
]

export default function TraceabilitySection() {
    return (
        <section id="trazabilidad" className="scroll-mt-20">
            {/* Encabezado en banda beige */}
            <div className="bg-beige">
                <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Trazabilidad</p>
                    <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                        Del campo a la mesa, con una historia que se puede verificar
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-muted">
                        Cada lote lleva un código que muestra qué se aplicó, cuándo y respetando qué
                        plazos. Así tus productos generan confianza y mejor precio.
                    </p>
                </div>
            </div>

            {/* Cuerpo: tarjeta QR + línea de tiempo */}
            <div className="bg-cream">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
                    {/* Tarjeta del lote */}
                    <div className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm sm:p-12">
                        <div className="mx-auto w-fit rounded-2xl border border-black/5 bg-white p-4">
                            <QRCodeSVG
                                value={`https://agroguardian.pe/t/${BATCH_CODE}`}
                                size={184}
                                fgColor="#14271c"
                                bgColor="#ffffff"
                                level="M"
                            />
                        </div>
                        <p className="mt-6 font-mono font-semibold tracking-wide text-forest">{BATCH_CODE}</p>
                        <p className="mt-1 text-sm text-muted">Maíz amarillo · Lote verificado</p>
                        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-1.5 text-sm font-medium text-forest">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            Sello AgroGuardian
                        </span>
                    </div>

                    {/* Línea de tiempo */}
                    <div>
                        <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                            Una línea de tiempo clara para cada lote
                        </h3>
                        <p className="mt-3 leading-relaxed text-muted">
                            Al escanear el código, cualquiera puede ver el historial completo, sin
                            tecnicismos.
                        </p>

                        <ol className="mt-8">
                            {TIMELINE.map((event, index) => (
                                <li key={event.date} className="grid grid-cols-[auto_1fr] gap-4">
                                    <div className="flex flex-col items-center">
                                        <span
                                            className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full"
                                            style={{ backgroundColor: event.color }}
                                        />
                                        {index < TIMELINE.length - 1 && (
                                            <span className="w-px flex-1 bg-black/10" />
                                        )}
                                    </div>
                                    <div className="pb-7">
                                        <p className="text-xs text-muted">{event.date}</p>
                                        <p className="font-semibold text-forest">{event.title}</p>
                                        {event.detail && (
                                            <p className="mt-0.5 text-sm text-muted">{event.detail}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    )
}
