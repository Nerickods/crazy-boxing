'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function LoginForm() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Important for cookies
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                setError(data.error || 'Error al iniciar sesión')
                setLoading(false)
                return
            }

            // Redirect on success
            router.push(data.redirect || '/admin')
            router.refresh() // Force refresh to pick up new cookies
        } catch {
            setError('Error de conexión')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                    Contraseña
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 backdrop-blur-sm"
                    placeholder="••••••••"
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
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <p className="text-center text-sm text-white/60">
                <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 hover:underline">
                    ¿Olvidaste tu contraseña?
                </Link>
            </p>
        </form>
    )
}
