import Link from 'next/link'

export default function CheckEmailPage() {
    return (
        <div className="space-y-8 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>

            <div>
                <h1 className="text-3xl font-bold text-white">Revisa tu Email</h1>
                <p className="mt-4 text-white/60">
                    Te hemos enviado un link de confirmación. Por favor revisa tu correo para completar el registro.
                </p>
            </div>

            <Link
                href="/login"
                className="inline-block text-blue-400 hover:text-blue-300 hover:underline"
            >
                Volver al login
            </Link>
        </div>
    )
}
