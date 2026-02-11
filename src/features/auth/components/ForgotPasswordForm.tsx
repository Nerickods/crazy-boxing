'use client'

import { useState } from 'react'
import { resetPassword } from '@/actions/auth'

export function ForgotPasswordForm() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await resetPassword(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center p-6 rounded-xl bg-green-500/10 border border-green-500/30">
                <p className="text-green-400">Revisa tu email para restablecer tu contraseña.</p>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="tu@email.com"
                />
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                    <p className="text-sm text-indigo-400">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-black font-semibold hover:from-blue-400 hover:to-blue-500 disabled:opacity-50 transition-all"
            >
                {loading ? 'Enviando...' : 'Enviar Link de Recuperación'}
            </button>
        </form>
    )
}
