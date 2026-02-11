'use client';

import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

export default function MissionSection() {
    return (
        <section id="mision" className="relative min-h-[80vh] flex items-center justify-center py-24 overflow-hidden">
            {/* Background Image - Team/Gym Atmosphere */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=1600&h=900&fit=crop&q=80"
                    alt="Crazy Boxing Team"
                    className="w-full h-full object-cover"
                />
                {/* Heavy Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/60"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] font-bold tracking-[0.2em] text-sm uppercase mb-6">
                            Nuestra Filosofía
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                            TU TRANSFORMACIÓN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-sky-600">COMIENZA AQUÍ</span>
                        </h2>
                    </motion.div>

                    {/* Manifesto Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <FaQuoteLeft className="text-[var(--accent)] text-4xl absolute -top-8 -left-4 md:-left-12 opacity-20" />

                        <div className="space-y-6 text-lg md:text-xl text-gray-300 font-light leading-relaxed text-justify md:text-center">
                            <p>
                                <span className="text-[var(--accent)] font-bold">Todos recordamos ese primer día.</span> El nudo en el estómago antes de cruzar la puerta. El miedo a no ser suficiente, a ser juzgado, a no poder seguir el ritmo. Es una voz que te dice "mejor quédate en casa".
                            </p>
                            <p>
                                Pero al dar ese primer paso, descubriste que <span className="text-white font-semibold">tus miedos eran mentira</span>. Encontraste compañeros que te levantaron cuando caíste, no rivales que celebraron tu derrota. Encontraste una fuerza interior que no sabías que existía.
                            </p>
                            <p>
                                En Crazy Boxing, no solo entrenamos luchadores; forjamos personas que han aprendido a estar cómodas en la incomodidad. Porque si puedes mantener la calma cuando alguien intenta asfixiarte, <span className="text-[var(--accent)]">puedes manejar cualquier problema que la vida te lance</span>.
                            </p>
                            <p className="font-medium text-white italic">
                                "La verdadera victoria no es vencer a otro, es vencer al miedo que te impedía intentarlo."
                            </p>
                        </div>
                    </motion.div>

                    {/* Footer / Core Values */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="mt-16 pt-12 border-t border-white/10"
                    >
                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-widest uppercase">
                            MENTE • <span className="text-[var(--accent)]">CUERPO</span> • ESPÍRITU
                        </h3>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
