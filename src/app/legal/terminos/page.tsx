'use client';

import Link from 'next/link';
import { FaFileContract, FaArrowLeft } from 'react-icons/fa';

export default function TermsPage() {
    return (
        <>
            {/* Page specific background */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/assets/legal/terms.png"
                    alt="Terms Background"
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
                        <FaFileContract className="text-4xl text-[var(--accent)]" />
                        <h1 className="text-[var(--accent)] font-black uppercase tracking-tight m-0">Términos y Condiciones</h1>
                    </div>

                    <section className="mt-8 space-y-8 text-white/80">
                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">1. Aceptación</h2>
                            <p>Al inscribirse o utilizar las instalaciones de Crazy Boxing MMA, usted acepta cumplir con estos Términos y Condiciones.</p>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">2. Membresías y Pagos</h2>
                            <p>Las membresías son personales e intransferibles. Los pagos deben realizarse por adelantado. No se realizan reembolsos por cancelaciones anticipadas o falta de asistencia, salvo casos médicos justificados.</p>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">3. Riesgos y Responsabilidad</h2>
                            <p>La práctica de Artes Marciales Mixtas conlleva riesgos inherentes de lesiones físicas. Al participar, usted reconoce y asume estos riesgos. Crazy Boxing no será responsable por lesiones ocurridas durante el entrenamiento regular, salvo negligencia grave demostrada.</p>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">4. Cancelación</h2>
                            <p>Debe notificar su cancelación con al menos 30 días de anticipación para evitar cargos recurrentes automáticos (si aplica).</p>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4">5. Modificaciones</h2>
                            <p>Nos reservamos el derecho de modificar horarios, entrenadores y tarifas con previo aviso razonable a los miembros.</p>
                        </div>
                    </section>
                </article>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                    <Link
                        href="/"
                        className="bg-[var(--accent)] text-black px-10 py-4 rounded-full font-black uppercase tracking-tighter hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                    >
                        Aceptar y Volver
                    </Link>
                </div>
            </div>
        </>
    );
}
