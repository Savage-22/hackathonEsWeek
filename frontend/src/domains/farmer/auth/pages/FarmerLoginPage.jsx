import { useState } from 'react'
import { useNavigate } from 'react-router'

import logo from '../../../../assets/logo2.jpeg'
import { loginFarmer, getFarmerAuthErrorMessage } from '../services/farmerAuthService.js'

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
            navigate('/')
        } catch (submitError) {
            setError(getFarmerAuthErrorMessage(submitError))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-sm p-8">
                <img src={logo} alt="AgroGuardian" className="mx-auto h-28 w-auto" />

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
                        <input
                            id="dni"
                            name="dni"
                            value={form.dni}
                            onChange={handleChange}
                            inputMode="numeric"
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
