import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Check } from 'lucide-react'

import AuthLayout from '../../../../shared/components/AuthLayout.jsx'
import { registerFarmer, getFarmerAuthErrorMessage } from '../services/farmerAuthService.js'

const inputClass =
    'mt-1 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none'

const PERKS = ['Sin costo, para siempre', 'Funciona sin internet', 'Listo en menos de 3 minutos']

const EMPTY = { nombre: '', dni: '', celular: '', distrito: '', cultivo: '', password: '' }

export default function FarmerRegisterPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    // Crea la cuenta en el backend y entra directo a la app (auto-login).
    // El "cultivo" es informativo: se asocia luego a cada parcela, no al agricultor.
    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)
        try {
            await registerFarmer({
                name: form.nombre.trim(),
                dni: form.dni.trim(),
                phone: form.celular.trim() || undefined,
                district: form.distrito.trim() || undefined,
                password: form.password,
            })
            navigate('/app')
        } catch (submitError) {
            setError(getFarmerAuthErrorMessage(submitError))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Crea tu cuenta gratis"
            description="Únete a los agricultores de Huánuco que cuidan su cosecha, su salud y la Pachamama."
            aside={
                <ul className="space-y-3">
                    {PERKS.map((perk) => (
                        <li key={perk} className="flex items-center gap-3 text-sm text-white/90">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">
                                <Check size={14} strokeWidth={3} />
                            </span>
                            {perk}
                        </li>
                    ))}
                </ul>
            }
        >
            <h2 className="font-display text-2xl font-bold text-ink">Tus datos</h2>
            <p className="mt-1 text-muted">Solo lo necesario para empezar.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                    <label htmlFor="nombre" className="text-sm font-medium text-ink">Nombre completo</label>
                    <input
                        id="nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Rosa Huamán"
                        className={inputClass}
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="dni" className="text-sm font-medium text-ink">DNI</label>
                        <input
                            id="dni"
                            name="dni"
                            value={form.dni}
                            onChange={handleChange}
                            required
                            inputMode="numeric"
                            placeholder="Ej: 12345678"
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

                <div>
                    <label htmlFor="distrito" className="text-sm font-medium text-ink">Distrito</label>
                    <input
                        id="distrito"
                        name="distrito"
                        value={form.distrito}
                        onChange={handleChange}
                        placeholder="Ej: Amarilis"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="cultivo" className="text-sm font-medium text-ink">
                        ¿Qué cultivas principalmente?
                    </label>
                    <input
                        id="cultivo"
                        name="cultivo"
                        value={form.cultivo}
                        onChange={handleChange}
                        placeholder="Ej: papa, maíz, hortalizas"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="text-sm font-medium text-ink">Crea una contraseña</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className={inputClass}
                    />
                </div>

                <label className="flex items-start gap-2 text-sm text-muted">
                    <input type="checkbox" required className="mt-1 accent-forest" />
                    Acepto el cuidado responsable de mis datos y las buenas prácticas agrícolas.
                </label>

                {error && <p className="text-sm text-error">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-forest py-3 font-semibold text-white transition-colors hover:bg-forest-deep disabled:opacity-60"
                >
                    {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-semibold text-forest hover:text-forest-deep">
                    Iniciar sesión
                </Link>
            </p>
        </AuthLayout>
    )
}
