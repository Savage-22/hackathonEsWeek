import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import AuthLayout from '../components/AuthLayout.jsx'
import { loginFarmer, getFarmerAuthErrorMessage } from '../services/farmerAuthService.js'

const inputClass =
    'mt-1 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none'

export default function FarmerLoginPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ dni: '', password: '' })
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)
        try {
            await loginFarmer(form.dni, form.password)
            navigate('/app')
        } catch (submitError) {
            setError(getFarmerAuthErrorMessage(submitError))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Allin kutimuy 👋"
            subtitle="Bienvenido de nuevo"
            description="Tus registros te esperan, estés donde estés. Recuerda: la app funciona también sin internet."
            aside={
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Sesión disponible sin conexión
                </span>
            }
        >
            <h2 className="font-display text-2xl font-bold text-ink">Iniciar sesión</h2>
            <p className="mt-1 text-muted">Ingresa con tu DNI y contraseña.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                    <label htmlFor="dni" className="text-sm font-medium text-ink">Número de DNI</label>
                    <input
                        id="dni"
                        name="dni"
                        value={form.dni}
                        onChange={handleChange}
                        inputMode="numeric"
                        autoComplete="username"
                        placeholder="Ej: 12345678"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="text-sm font-medium text-ink">Contraseña</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className={inputClass}
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-muted">
                        <input type="checkbox" defaultChecked className="accent-forest" />
                        Recordarme
                    </label>
                    <Link to="/contacto" className="font-semibold text-forest hover:text-forest-deep">
                        ¿Olvidaste tu clave?
                    </Link>
                </div>

                {error && <p className="text-sm text-error">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-forest py-3 font-semibold text-white transition-colors hover:bg-forest-deep disabled:opacity-60"
                >
                    {isSubmitting ? 'Ingresando…' : 'Entrar'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                ¿Aún no tienes cuenta?{' '}
                <Link to="/registro" className="font-semibold text-forest hover:text-forest-deep">
                    Crear cuenta
                </Link>
            </p>
        </AuthLayout>
    )
}
