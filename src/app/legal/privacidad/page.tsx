'use client';

import Link from 'next/link';
import { FaShieldAlt, FaArrowLeft } from 'react-icons/fa';

export default function PrivacyPage() {
    return (
        <>
            {/* Page specific background */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/assets/legal/privacy.png"
                    alt="Privacy Background"
                    className="w-full h-full object-cover opacity-50"
                />
            </div>

            <div className="relative z-10 bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
                >
                    <FaArrowLeft /> Volver al Inicio
                </Link>

                <article className="prose prose-invert lg:prose-xl max-w-none">
                    <div className="flex items-center gap-4 mb-8">
                        <FaShieldAlt className="text-4xl text-[var(--accent)]" />
                        <h1 className="text-[var(--accent)] font-black uppercase tracking-tight m-0">Aviso de Privacidad</h1>
                    </div>

                    <p className="text-white/60 text-sm italic">Última actualización: Enero 2026</p>

                    <section className="mt-8 space-y-8 text-white/80">
                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">1. Responsable de sus datos</h2>
                            <p>Crazy Boxing MMA ("nosotros", "nuestro", "la Academia") se compromete a proteger su privacidad. Esta política describe cómo recopilamos, usamos y protegemos su información personal.</p>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">2. Información que recopilamos</h2>
                            <p>Podemos recopilar la siguiente información:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Nombre completo y datos de contacto.</li>
                                <li>Información de salud relevante para la práctica deportiva.</li>
                                <li>Información de pago y facturación.</li>
                                <li>Registros de asistencia y progreso.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">3. Uso de la información</h2>
                            <p>Utilizamos su información para:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Gestionar su membresía y acceso a las instalaciones.</li>
                                <li>Procesar pagos y facturación.</li>
                                <li>Notificarle sobre cambios en horarios o eventos.</li>
                                <li>Garantizar su seguridad durante el entrenamiento.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">4. Protección de datos</h2>
                            <p>Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra acceso no autorizado, alteración o pérdida.</p>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">5. Derechos ARCO</h2>
                            <p>Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, contáctenos directamente en la academia.</p>
                        </div>
                    </section>
                </article>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                    <Link
                        href="/"
                        className="bg-[var(--accent)] text-black px-10 py-4 rounded-full font-black uppercase tracking-tighter hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                    >
                        Entendido y Volver
                    </Link>
                </div>
            </div>
        </>
    );
}
