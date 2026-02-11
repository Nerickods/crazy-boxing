'use client';

import Link from 'next/link';
import { FaGavel, FaArrowLeft } from 'react-icons/fa';

export default function RulesPage() {
    return (
        <>
            {/* Page specific background */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/assets/legal/rules.png"
                    alt="Rules Background"
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
                        <FaGavel className="text-4xl text-[var(--accent)]" />
                        <h1 className="text-[var(--accent)] font-black uppercase tracking-tight m-0">Reglamento Interno</h1>
                    </div>

                    <p className="text-white/60 mb-12">El honor y el respeto son nuestros pilares. Sigue estas reglas para mantener la integridad de nuestra comunidad.</p>

                    <section className="mt-8 space-y-12 text-white/80">
                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4 italic">1. Etiqueta y Respeto</h2>
                            <p>El respeto es la base de nuestra academia. Trate a instructores y compañeros con dignidad. No se tolera el comportamiento agresivo fuera de los ejercicios controlados de combate.</p>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-6 border-l-4 border-[var(--accent)] pl-4 italic">2. Higiene</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                {[
                                    "Uso obligatorio de toalla y desodorante.",
                                    "Ropa limpia para cada entrenamiento.",
                                    "Uñas cortas para evitar lesiones.",
                                    "No caminar descalzo fuera del tatami.",
                                    "No subir al tatami con calzado de calle."
                                ].map((item, i) => (
                                    <li key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4 italic">3. Equipo</h2>
                            <p>Es responsabilidad del alumno traer su equipo de protección completo (guantes, bucal, espinilleras) según la disciplina.</p>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4 italic">4. Puntualidad</h2>
                            <p>Llegue 10 minutos antes de su clase. El calentamiento es obligatorio; si llega tarde, podría negársele el acceso por su propia seguridad.</p>
                        </div>

                        <div>
                            <h2 className="text-white font-bold text-2xl mb-4 border-l-4 border-[var(--accent)] pl-4 italic">5. Cuidado de Instalaciones</h2>
                            <p>Cuide el equipo y las instalaciones como si fueran suyas. Limpie su área y regrese el material a su lugar después de usarlo.</p>
                        </div>
                    </section>
                </article>

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                    <Link
                        href="/"
                        className="bg-[var(--accent)] text-black px-10 py-4 rounded-full font-black uppercase tracking-tighter hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                    >
                        Respeto y Volver
                    </Link>
                </div>
            </div>
        </>
    );
}

