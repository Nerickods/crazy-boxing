import Link from 'next/link'
import { ForgotPasswordForm } from '@/features/auth/components'

export default function ForgotPasswordPage() {
    return (
        <div className="space-y-8 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Recuperar Contraseña</h1>
                <p className="mt-2 text-white/60">Te enviaremos un link para restablecer tu contraseña</p>
            </div>

            <ForgotPasswordForm />

            <p className="text-center text-sm text-white/60">
                <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
                    Volver al login
                </Link>
            </p>
        </div>
    )
}
