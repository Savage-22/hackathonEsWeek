import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Sprout, Building2 } from 'lucide-react'

import AuthLayout from '../../../shared/components/AuthLayout.jsx'
import { loginFarmer } from '../../farmer/auth/services/farmerAuthService.js'
import { loginInstitutional } from '../../institutional/auth/services/institutionalAuthService.js'

const inputClass =
    'mt-1 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-forest focus:outline-none'

// Configuración por rol: un solo formulario que cambia de campos y destino según
// quién entra. Así hay un único punto de acceso (antes el login institucional no
// se enlazaba desde ningún lado público).
const ROLES = {
    farmer: {
        label: 'Agricultor',
        icon: Sprout,
        redirect: '/app',
        aside: 'Tus registros funcionan también sin internet.',
        login: (form) => loginFarmer(form.identifier, form.password),
    },
    institutional: {
        label: 'Institución',
        icon: Building2,
        redirect: '/panel',
        aside: 'Panel de DRA, municipalidades y cooperativas.',
        login: (form) => loginInstitutional(form.identifier, form.password),
    },
}

const EMPTY = { identifier: '', password: '' }

export default function LoginPage({ defaultRole = 'farmer' }) {
    const navigate = useNavigate()
    const [role, setRole] = useState(defaultRole)
    const [form, setForm] = useState(EMPTY)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isFarmer = role === 'farmer'
    const config = ROLES[role]

    const switchRole = (next) => {
        if (next === role) return
        setRole(next)
        setForm(EMPTY)
        setError('')
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsSubmitting(true)
        try {
            await config.login(form)
            navigate(config.redirect)
        } catch (submitError) {
            setError(getErrorMessage(submitError))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthLayout
            title="Bienvenido 👋"
            subtitle="Inicia sesión"
            description="Un solo acceso para agricultores e instituciones."
            aside={
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {config.aside}
                </span>
            }
        >
            <h2 className="font-display text-2xl font-bold text-ink">Iniciar sesión</h2>
            <p className="mt-1 text-muted">Elige cómo quieres entrar.</p>

            {/* Selector de rol */}
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-cream p-1">
                {Object.entries(ROLES).map(([key, { label, icon: Icon }]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => switchRole(key)}
                        className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                            role === key ? 'bg-white text-forest shadow-sm' : 'text-muted hover:text-ink'
                        }`}
                    >
                        <Icon size={16} />
                        {label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                    <label htmlFor="identifier" className="text-sm font-medium text-ink">
                        {isFarmer ? 'Número de DNI' : 'Email'}
                    </label>
                    <input
                        id="identifier"
                        name="identifier"
                        value={form.identifier}
                        onChange={handleChange}
                        type={isFarmer ? 'text' : 'email'}
                        inputMode={isFarmer ? 'numeric' : 'email'}
                        autoComplete="username"
                        placeholder={isFarmer ? 'Ej: 12345678' : 'tu@institucion.pe'}
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

                {error && <p className="text-sm text-error">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-forest py-3 font-semibold text-white transition-colors hover:bg-forest-deep disabled:opacity-60"
                >
                    {isSubmitting ? 'Ingresando…' : 'Entrar'}
                </button>
            </form>

            {isFarmer && (
                <p className="mt-6 text-center text-sm text-muted">
                    ¿Aún no tienes cuenta?{' '}
                    <Link to="/registro" className="font-semibold text-forest hover:text-forest-deep">
                        Crear cuenta
                    </Link>
                </p>
            )}
        </AuthLayout>
    )
}

// Ambos flujos de auth devuelven el mismo formato de error del backend.
function getErrorMessage(error) {
    if (error.response?.data?.message) return error.response.data.message
    if (error.response?.data?.errors?.length) return error.response.data.errors.join(', ')
    return 'No se pudo iniciar sesión.'
}
