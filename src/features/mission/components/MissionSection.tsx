'use client';

import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

export default function MissionSection() {
    return (
        <section id="mision" className="relative min-h-[80dvh] flex items-center justify-center py-16 md:py-24 overflow-hidden">
            {/* Background Image - Team/Gym Atmosphere */}
            <div className="absolute inset-0 z-0">
                <picture>
                    <source srcSet="/assets/mission-mobile.jpg" media="(max-width: 768px)" />
                    <img
                        src="/assets/mission-desktop.jpg"
                        alt="Crazy Boxing Team"
                        className="w-full h-full object-cover object-center scale-105"
                    />
                </picture>
                {/* Suavizado de capas para máxima visibilidad de la foto real */}
                {/* Capa base más clara */}
                <div className="absolute inset-0 bg-black/30"></div>
                {/* Degradados mucho más sutiles */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Header with Logo Shield */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[var(--accent)] blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <img
                                src="/assets/logo.png"
                                alt="Crazy Boxing Authority Logo"
                                className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_30px_rgba(255,183,0,0.3)] relative z-10"
                            />
                        </div>
                    </motion.div>

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
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
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

                        <div className="space-y-6 text-base sm:text-lg md:text-xl text-gray-300 font-light leading-relaxed text-left md:text-center">
                            <p>
                                Nuestra misión es formar personas íntegras más que atletas y obtener valores más que medallas, como: mejorar la autoestima, tener disciplina, el respeto, la lealtad, la honestidad, la fortaleza, la disciplina y la responsabilidad; creemos que los alumnos deben obtener una visión real de la vida mediante de la práctica de las Artes Marciales, ya que no siempre se alcanzan las metas en un día, que la vida no es siempre justa y no es siempre fácil, que algunas veces se pierde y otras se gana, y sobre todo; que si no trabajamos, no conseguimos lo que siempre debemos contar con: la humildad, humildad y el respeto a nosotros mismos y a los demás.
                            </p>
                            <p>
                                Black Bird House MMA es un centro de Artes Marciales Mixtas y acondicionamiento físico, cumpliendo nuestra misión que es trabajar:
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
                            MENTE, <span className="text-[var(--accent)]">CUERPO</span> Y ESPÍRITU
                        </h3>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
