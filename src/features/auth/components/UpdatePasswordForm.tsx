'use client'

import { useState } from 'react'
import { updatePassword } from '@/actions/auth'

export function UpdatePasswordForm() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await updatePassword(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                    Nueva Contraseña
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="mt-1 block w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="Mínimo 6 caracteres"
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
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
        </form>
    )
}
