import Link from 'next/link'
import { SignupForm } from '@/features/auth/components'

export default function SignupPage() {
    return (
        <div className="space-y-8 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
                <p className="mt-2 text-white/60">Regístrate para comenzar</p>
            </div>

            <SignupForm />

            <p className="text-center text-sm text-white/60">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline">
                    Iniciar sesión
                </Link>
            </p>
        </div>
    )
}
