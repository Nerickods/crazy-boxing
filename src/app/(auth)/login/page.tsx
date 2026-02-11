import Link from 'next/link'
import { LoginForm } from '@/features/auth/components'

export default function LoginPage() {
    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative space-y-8 p-10 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
                        <span className="font-bold text-white text-xl tracking-tighter">BB</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenido</h1>
                    <p className="text-white/40 text-sm font-medium">Accede al panel de control de Crazy Boxing</p>
                </div>

                <div className="login-form-wrapper">
                    <LoginForm />
                </div>

                <p className="text-center text-xs text-white/40">
                    ¿No tienes cuenta?{' '}
                    <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                        Solicitar acceso
                    </Link>
                </p>
            </div>
        </div>
    )
}
