'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Fingerprint, Mountain, Eye, Dumbbell, Trophy } from 'lucide-react'; // Added icons for diversity if needed, but sticking to pillars
import { useState } from 'react';

type PillarKey = 'mindset' | 'identity' | 'discipline' | 'vision';

const pillars = [
    {
        key: 'mindset' as PillarKey,
        icon: <Brain className="w-6 h-6 md:w-8 md:h-8" />,
        title: "MENTALIDAD",
        subtitle: "Del miedo al poder",
        copy: "Cambiamos la narrativa de 'víctima' a 'protagonista'. A través del combate, entenderas que tu seguridad no depende de la suerte, sino de tu capacidad para desarrollarla."
    },
    {
        key: 'identity' as PillarKey,
        icon: <Fingerprint className="w-6 h-6 md:w-8 md:h-8" />,
        title: "IDENTIDAD",
        subtitle: "De la confusión a la verdad",
        copy: "En un mundo que te dice quién crees que eres, el tatami te revelara quién REALMENTE podrias llegar a ser. Sin máscaras. Las Artes Marciales Mixtas seran tu espejo más honesto."
    },
    {
        key: 'discipline' as PillarKey,
        icon: <Mountain className="w-6 h-6 md:w-8 md:h-8" />,
        title: "DISCIPLINA",
        subtitle: "Del caos al rumbo",
        copy: "La motivación es efímera; la disciplina sera eterna. Te daremos la estructura inquebrantable para cumplir tus promesas contigo mismo, dentro y fuera del gym."
    },
    {
        key: 'vision' as PillarKey,
        icon: <Eye className="w-6 h-6 md:w-8 md:h-8" />,
        title: "VISIÓN",
        subtitle: "De la ceguera al propósito",
        copy: "Aprenderas a ver caminos donde otros ven muros. Desarrollaras la capacidad de anticipar, reaccionar y avanzar, tanto en las peleas como en la vida diaria."
    }
];

export default function EssenceSection() {
    // Zero-Shot layout: No active pillar by default to keep clean, or one active? 
    // "Compact Icon Dock" suggests start small. Let's start null.
    const [activePillar, setActivePillar] = useState<PillarKey | null>(null);

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
                        className="text-4xl sm:text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6"
                    >
                        EL ARTE DE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-600">
                            LA EVOLUCIÓN MMA
                        </span>
                    </motion.h2>

                    {/* Intro ("Llegas buscando...") */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-gray-400 text-sm md:text-base mb-12 tracking-wider uppercase font-medium"
                    >
                        <span className="text-[var(--accent)]">Llegaras buscando defensa personal.</span> Y te quedaras por en quién te convertiras.
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
                                Aquí no entrenamos por partes; forjamos el todo.
                            </p>
                            <p>
                                Dominarás la precisión del <strong className="text-white font-bold">Boxeo</strong> y el <strong className="text-white font-bold">Kickboxing</strong> para agudizar tu enfoque.
                                Utilizarás la intensidad del <strong className="text-white font-bold">Muay Thai</strong> para encontrar calma en el caos.
                                Aplicarás la ingeniería del <strong className="text-white font-bold">Jiu-Jitsu</strong> para resolver problemas bajo presión extrema,
                                y potenciarás tu motor con un <strong className="text-white font-bold">Acondicionamiento</strong> físico diseñado para romper barreras mentales.
                            </p>
                            <p className="text-white font-medium italic">
                                Todo converge en el <span className="text-[var(--accent)] not-italic underline decoration-[var(--accent)] decoration-2 underline-offset-4">MMA</span>: la expresión máxima del combate humano.
                                Un sistema integral donde no hay dudas, solo evolución.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* --- COMPACT ICON DOCK --- */}
                <div className="mt-20">
                    {/* Dock Container */}
                    <div className="flex justify-center gap-4 md:gap-8 mb-8">
                        {pillars.map((pillar) => {
                            const isActive = activePillar === pillar.key;
                            return (
                                <motion.button
                                    key={pillar.key}
                                    onClick={() => setActivePillar(isActive ? null : pillar.key)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border transition-all duration-300
                                        ${isActive
                                            ? 'bg-[var(--accent)] border-[var(--accent)] text-black shadow-[0_0_30px_-5px_var(--accent)]'
                                            : 'bg-zinc-900 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                        }
                                    `}
                                >
                                    {pillar.icon}

                                    {/* Tooltip Label (Visible only when NOT active & Hovered? Optional, keeping simple) */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-dot"
                                            className="absolute -bottom-3 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* --- DETAIL PANEL (EXPANDER) --- */}
                    <div className="h-[200px] md:h-[150px] relative"> {/* Fixed height container to prevent layout shifts or visual jumping */}
                        <AnimatePresence mode="wait">
                            {activePillar ? (
                                (() => {
                                    const pillar = pillars.find(p => p.key === activePillar)!;
                                    return (
                                        <motion.div
                                            key={pillar.key}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-center max-w-2xl mx-auto p-6 rounded-2xl border border-[var(--accent)]/20 bg-zinc-900/50 backdrop-blur-md"
                                        >
                                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                                                {pillar.title}
                                            </h3>
                                            <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4">
                                                {pillar.subtitle}
                                            </p>
                                            <p className="text-gray-300 leading-relaxed font-light">
                                                {pillar.copy}
                                            </p>
                                        </motion.div>
                                    );
                                })()
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-full text-gray-600 gap-2"
                                >
                                    <span className="text-sm uppercase tracking-widest">
                                        Selecciona un pilar
                                    </span>
                                    <div className="w-1 h-8 bg-gradient-to-b from-gray-800 to-transparent" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                {/* Footer Signal */}
                <div className="flex justify-center mt-12 pb-12">
                    <p className="text-white/20 text-xs tracking-[0.5em] uppercase font-bold">The Warrior Code</p>
                </div>

            </div>
        </section>
    );
}
