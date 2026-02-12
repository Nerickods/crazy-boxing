'use client';

import { motion } from 'framer-motion';
// Icons removed as they were moved to TrainingProgramSection

export default function EssenceSection() {
    // Pillars logic moved to TrainingProgramSection

    return (
        <section className="relative py-16 md:py-32 bg-black overflow-hidden min-h-[100dvh] flex flex-col justify-center">

            {/* --- ATMOSPHERIC BACKGROUND --- */}
            {/* --- ATMOSPHERIC BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <picture>
                        <source srcSet="/assets/mobile/evolution_mobile.png" media="(max-width: 768px)" />
                        <img
                            src="/assets/backgrounds/evolution.png"
                            alt="MMA Evolution Background"
                            className="w-full h-full object-cover opacity-70"
                        />
                    </picture>
                </motion.div>
                {/* Smart Gradient: Vignette for focus + Bottom fade */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-5xl">

                {/* --- HEADER BLOCK --- */}
                <div className="text-center mb-16">

                    {/* Monumental Title */}
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-red-600 tracking-tighter leading-none mb-6"
                    >
                        EL AUTO <br />
                        ENGAÑO
                    </motion.h2>

                    {/* Intro ("Sabemos cómo se siente...") */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-gray-400 text-sm md:text-base mb-12 tracking-wider uppercase font-medium"
                    >
                        <span className="text-[var(--accent)]">Sabemos cómo se siente el "Piloto Automático".</span>
                    </motion.p>

                    {/* --- THE MANIFIESTO (CORE COPY) --- */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        viewport={{ once: true }}
                        className="relative p-8 md:p-12 border-l-2 border-[var(--accent)]/30 bg-gradient-to-r from-[var(--accent)]/5 to-transparent text-left max-w-4xl mx-auto rounded-r-2xl"
                    >
                        {/* Decorative Quote Mark */}
                        <span className="absolute -top-6 left-4 text-6xl text-[var(--accent)]/20 font-serif">"</span>

                        <div className="space-y-6 text-gray-300 text-lg md:text-xl font-light leading-relaxed">
                            <p>
                                Te levantas, trabajas, cumples con todos... menos contigo. Llegas al final del día y te sientes extrañamente vacío, <strong className="text-white font-bold">como si solo fueras un engranaje más.</strong>
                            </p>
                            <ul className="space-y-4 my-6">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 mt-1.5">▪</span>
                                    <span>Te empiezas a convencer de que "El deporte no es para ti".</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 mt-1.5">▪</span>
                                    <span>Sigues con tus viejos hábitos porque se sienten cómodos y seguros.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 mt-1.5">▪</span>
                                    <span>Te sientes un impostor cuando hablas de tus metas.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 mt-1.5">▪</span>
                                    <span>Empiezas a aceptar silenciosamente que <strong className="text-white font-bold">estás es tu versión definitiva pero mediocre.</strong></span>
                                </li>
                            </ul>
                            <div className="text-white font-medium italic border-t border-white/10 pt-4 mt-4">
                                <span className="text-[var(--accent)] font-bold not-italic">Mentira.</span> No has fallado tú; ha fallado un sistema diseñado para masas, no para guerreros con visión.
                                No necesitas más "Culpa", necesitas una <span className="text-[var(--accent)] not-italic underline decoration-[var(--accent)] decoration-2 underline-offset-4">transformación</span>.
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Signal */}
                <div className="flex justify-center mt-12 pb-12">
                    <p className="text-white/20 text-xs tracking-[0.5em] uppercase font-bold">The Warrior Code</p>
                </div>

            </div>
        </section>
    );
}
