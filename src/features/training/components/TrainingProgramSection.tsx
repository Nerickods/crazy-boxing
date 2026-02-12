'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFistRaised,
    FaClock, FaStar
} from 'react-icons/fa';
import { Brain, Fingerprint, Mountain, Eye } from 'lucide-react';





export default function TrainingProgramSection() {

    const handleReserve = () => {
        document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
    };

    // CRAZY BOXING IDENTITY DATA
    const activeDisciplineInfo = {
        name: "CRAZY BOXING ACADEMY",
        subtitle: "¿POR QUÉ BOXEO? PORQUE A VECES, HABLAR NO ES SUFICIENTE.",
        description: (
            <>
                <p className="mb-4 font-bold text-white">Olvídate del gimnasio tradicional. Esto es el Nuevo Estándar.</p>
                <p className="mb-4">No estás aquí solo por deporte. Estás aquí porque formas parte de una generación bajo presión y necesitas una válvula de escape.</p>
                <p className="mb-4">Elegimos el boxeo porque es la única terapia donde <strong className="text-white">golpear tus problemas es la solución.</strong></p>
                <p className="mb-4">En <strong className="text-white">Crazy Boxing Academy</strong>, tu ansiedad no es un defecto, es tu combustible. No venimos a "hablar de ello". Venimos a sudarlo, a soltarlo y a transformarlo en poder.</p>
                <p className="font-bold italic text-white">"Ser 'Crazy' no es estar loco. Es atreverse a estar incómodo para volverse invencible."</p>
            </>
        ),
        benefits: [
            {
                title: "Terapia de Impacto",
                text: "No pagues un psicólogo para que te diga que respires. Aquí liberas el estrés de la semana en el primer asalto.",
                icon: "🥊"
            },
            {
                title: 'Comunidad "Zero-Judgment"',
                text: "Nadie te mira mal. Aquí todos luchamos contra algo. Entras solo, pero peleas acompañado.",
                icon: "🛡️"
            },
            {
                title: "Tu Versión Más Letal",
                text: "Deja de ser la persona que \"aguanta\" todo. Conviértete en quien tiene la confianza para devolver el golpe (en el ring y en la vida).",
                icon: "🔥"
            }
        ],
        image: "/assets/generated/boxing_luxury_bw.png",
        mobileImage: "/assets/generated/boxing_mobile_recreation.png",
        accentColor: "text-indigo-500",
        gradient: "from-indigo-900/20 to-black",
        icon: FaFistRaised
    };

    // PILLARS DATA moved from EssenceSection
    const [activePillar, setActivePillar] = useState<string | null>(null);

    const pillars = [
        {
            key: 'mindset',
            icon: <Brain className="w-6 h-6 md:w-8 md:h-8" />,
            title: "MENTALIDAD",
            subtitle: "Del miedo al poder",
            copy: "Deja de ser la 'víctima' de tu historia y conviértete en el protagonista. En el combate aprendes que tu seguridad no depende de la suerte, sino de tu capacidad para defenderte."
        },
        {
            key: 'identity',
            icon: <Fingerprint className="w-6 h-6 md:w-8 md:h-8" />,
            title: "IDENTIDAD",
            subtitle: "De la confusión a la verdad",
            copy: "El mundo te dice quién \"deberías\" ser; el ring te revela quién eres realmente. Sin filtros ni máscaras. Aquí encontrarás tu versión más honesta cuando el cansancio aprieta y decides no rendirte."
        },
        {
            key: 'discipline',
            icon: <Mountain className="w-6 h-6 md:w-8 md:h-8" />,
            title: "DISCIPLINA",
            subtitle: "Del caos al rumbo",
            copy: "La motivación es efímera; la disciplina es eterna. Creamos la estructura inquebrantable que necesitas para dejar de fallarte y empezar a cumplir las promesas que te haces a ti mismo."
        },
        {
            key: 'vision',
            icon: <Eye className="w-6 h-6 md:w-8 md:h-8" />,
            title: "VISIÓN",
            subtitle: "De la ceguera al propósito",
            copy: "Entrena tu mente para ver caminos donde otros solo ven muros. Desarrolla la capacidad de anticipar, reaccionar y avanzar, tanto esquivando golpes como superando problemas diarios."
        }
    ];

    return (
        <section id="programa" className="relative min-h-[100dvh] flex flex-col justify-center bg-black overflow-hidden py-16 md:py-24">

            {/* --- 1. IMMERSIVE BACKGROUND LAYER --- */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <picture className="absolute inset-0 w-full h-full">
                            {activeDisciplineInfo.mobileImage && (
                                <source
                                    media="(max-width: 768px)"
                                    srcSet={activeDisciplineInfo.mobileImage}
                                />
                            )}
                            <img
                                src={activeDisciplineInfo.image}
                                alt="Crazy Boxing Background"
                                className="w-full h-full object-cover brightness-[0.8] contrast-[1.2] grayscale"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/discipline_boxing.png';
                                }}
                            />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40" />
                        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay" />
                    </motion.div>
                </AnimatePresence>
            </div>


            {/* --- 2. MAIN CONTENT (Z-10) --- */}
            <div className="container mx-auto px-6 relative z-10">

                <div className="max-w-5xl mx-auto mb-24 relative z-10">

                    {/* CENTERED IDENTITY HEADER */}
                    <div className="text-center mb-16">
                        <span className="text-[var(--accent)] font-bold tracking-[0.3em] text-xs uppercase mb-4 block animate-fade-in">
                            THE NEW STANDARD
                        </span>
                        <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.9] italic uppercase tracking-tighter mb-8">
                            CRAZY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-white">
                                BOXING ACADEMY
                            </span>
                        </h2>
                        <div className="h-1 w-24 bg-[var(--accent)] rounded-full mx-auto" />
                    </div>

                    {/* CENTERED MANIFESTO */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl relative overflow-hidden group hover:border-[var(--accent)] transition-colors duration-500 mb-12 text-center"
                    >
                        <div className="absolute -right-10 -top-10 text-white/5 text-[15rem] rotate-12 pointer-events-none">
                            <FaFistRaised />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black text-white mb-6 relative z-10 uppercase italic">
                            {activeDisciplineInfo.subtitle}
                        </h3>
                        <div className="text-gray-300 leading-relaxed relative z-10 text-lg md:text-xl font-light max-w-3xl mx-auto space-y-6">
                            {activeDisciplineInfo.description}
                        </div>
                    </motion.div>

                    {/* BENEFITS GRID (3 Columns) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {activeDisciplineInfo.benefits.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-black/40 border border-white/5 p-8 rounded-2xl hover:bg-[var(--accent)]/10 hover:border-[var(--accent)] transition-all group cursor-default text-center hover:-translate-y-2 duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6 group-hover:bg-[var(--accent)] group-hover:text-black transition-colors text-3xl">
                                    {benefit.icon}
                                </div>
                                <h4 className="font-bold text-white text-xl mb-3 group-hover:text-[var(--accent)] transition-colors uppercase italic">{benefit.title}</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">{benefit.text}</p>
                            </motion.div>
                        ))}
                    </div>

                </div>

                {/* --- 3. MOVED PILLARS SECTION --- */}
                <div className="mt-12 pt-12 border-t border-white/10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-2">
                            NUESTROS <span className="text-[var(--accent)]">FUNDAMENTOS</span>
                        </h3>
                        <p className="text-gray-400 text-sm uppercase tracking-widest">El código del guerrero</p>
                    </motion.div>

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
                    <div className="h-[200px] md:h-[150px] relative">
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

            </div>
        </section >
    );
}
