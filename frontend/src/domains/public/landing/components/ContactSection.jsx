import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

const CHANNELS = [
    { icon: Mail, iconClass: 'bg-primary/15 text-primary', label: 'Correo', value: 'hola@agroguardian.pe' },
    { icon: Phone, iconClass: 'bg-info/15 text-info', label: 'Teléfono / WhatsApp', value: '+51 962 000 111' },
    { icon: MapPin, iconClass: 'bg-accent/20 text-accent', label: 'Dónde estamos', value: 'Huánuco, Perú' },
]

const EMPTY = { nombre: '', celular: '', correo: '', mensaje: '' }
const inputClass =
    'mt-1 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none'

export default function ContactSection() {
    const [form, setForm] = useState(EMPTY)

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    // Sin backend: se compone un correo con los datos (mailto).
    const handleSubmit = (event) => {
        event.preventDefault()
        const subject = `Consulta de ${form.nombre || 'un agricultor'}`
        const body = `Nombre: ${form.nombre}\nCelular: ${form.celular}\nCorreo: ${form.correo}\n\n${form.mensaje}`
        window.location.href = `mailto:hola@agroguardian.pe?subject=${encodeURIComponent(
            subject,
        )}&body=${encodeURIComponent(body)}`
    }

    return (
        <section id="contacto" className="scroll-mt-20">
            {/* Encabezado en banda beige */}
            <div className="bg-beige">
                <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Contacto</p>
                    <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                        Estamos aquí para ayudarte
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-muted">
                        ¿Tienes dudas o quieres llevar AgroGuardian a tu comunidad? Escríbenos, te
                        respondemos en tu idioma.
                    </p>
                </div>
            </div>

            {/* Cuerpo: canales + formulario */}
            <div className="bg-cream">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
                    {/* Canales */}
                    <div className="space-y-4">
                        {CHANNELS.map(({ icon: Icon, iconClass, label, value }) => (
                            <div
                                key={label}
                                className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
                            >
                                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${iconClass}`}>
                                    <Icon size={20} />
                                </span>
                                <span>
                                    <span className="block text-sm text-muted">{label}</span>
                                    <span className="block font-semibold text-ink">{value}</span>
                                </span>
                            </div>
                        ))}

                        <div className="rounded-2xl bg-forest p-5 text-white">
                            <span className="font-semibold">Yanapakuyniku kachkan</span> — estamos para
                            ayudarte, en español y quechua.
                        </div>
                    </div>

                    {/* Formulario */}
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
                    >
                        <h3 className="font-display text-2xl font-bold text-ink">Envíanos un mensaje</h3>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="nombre" className="text-sm font-medium text-ink">Nombre</label>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tu nombre"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label htmlFor="celular" className="text-sm font-medium text-ink">Celular</label>
                                <input
                                    id="celular"
                                    name="celular"
                                    value={form.celular}
                                    onChange={handleChange}
                                    inputMode="tel"
                                    placeholder="982 345 678"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label htmlFor="correo" className="text-sm font-medium text-ink">Correo</label>
                            <input
                                id="correo"
                                name="correo"
                                type="email"
                                value={form.correo}
                                onChange={handleChange}
                                placeholder="tucorreo@ejemplo.com"
                                className={inputClass}
                            />
                        </div>

                        <div className="mt-5">
                            <label htmlFor="mensaje" className="text-sm font-medium text-ink">
                                ¿En qué te ayudamos?
                            </label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                value={form.mensaje}
                                onChange={handleChange}
                                required
                                rows={4}
                                placeholder="Cuéntanos…"
                                className={`${inputClass} resize-y`}
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-lg bg-forest py-3 font-semibold text-white transition-colors hover:bg-forest-deep"
                        >
                            Enviar mensaje
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
