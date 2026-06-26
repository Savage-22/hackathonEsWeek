import { useState } from 'react'
import { useNavigate } from 'react-router'

import logo from '../../../../assets/logo2.jpeg'
import { loginInstitutional, getInstitutionalAuthErrorMessage } from '../services/institutionalAuthService.js'

export default function InstitutionalLoginPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
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
            await loginInstitutional(form.email, form.password)
            navigate('/panel')
        } catch (submitError) {
            setError(getInstitutionalAuthErrorMessage(submitError))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-sm p-8">
                <img src={logo} alt="AgroGuardian" className="mx-auto h-24 w-auto" />
                <p className="mt-2 text-center text-sm text-gray-500">Panel institucional</p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="username"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none"
                        />
                    </div>

                    {error && <p className="text-sm text-error">{error}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-primary py-2 font-medium text-white hover:bg-primary-dark disabled:opacity-60"
                    >
                        {isSubmitting ? 'Ingresando…' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </main>
    )
}
