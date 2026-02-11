import { UpdatePasswordForm } from '@/features/auth/components'

export default function UpdatePasswordPage() {
    return (
        <div className="space-y-8 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Nueva Contraseña</h1>
                <p className="mt-2 text-white/60">Ingresa tu nueva contraseña</p>
            </div>

            <UpdatePasswordForm />
        </div>
    )
}
