'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFistRaised,
    FaClock, FaStar
} from 'react-icons/fa';





export default function TrainingProgramSection() {

    const handleReserve = () => {
        document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
    };

    // CRAZY BOXING IDENTITY DATA
    const activeDisciplineInfo = {
        name: "CRAZY BOXING ACADEMY",
        subtitle: "¿POR QUÉ BOXEO? PORQUE HABLAR NO SIEMPRE FUNCIONA.",
        description: "Crazy Boxing no es un gimnasio tradicional. Es un espacio diseñado para una generación bajo presión. Elegimos el boxeo porque es la única terapia donde golpear tus problemas es la solución. Aquí, tu ansiedad no es un defecto, es combustible. Abrazamos tu intensidad y te enseñamos a usarla. Ser 'Crazy' es atreverse a exponerse a la incomodidad.",
        benefits: ["Terapia de Impacto", "Comunidad Sin Juicios", "Tu Versión Más Fuerte", "Desconexión Total"],
        image: "/assets/generated/boxing_luxury_bw.png",
        mobileImage: "/assets/generated/boxing_mobile_recreation.png",
        accentColor: "text-indigo-500",
        gradient: "from-indigo-900/20 to-black",
        icon: FaFistRaised
    };

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT COLUMN: IDENTITY & PHILOSOPHY */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="text-[var(--accent)] font-bold tracking-[0.3em] text-xs uppercase mb-4 block animate-fade-in">
                                THE NEW STANDARD
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] italic uppercase tracking-tighter mb-4">
                                CRAZY <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-white">
                                    BOXING ACADEMY
                                </span>
                            </h2>
                            <div className="h-1 w-24 bg-[var(--accent)] rounded-full" />
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-[var(--accent)] transition-colors duration-300">
                            <div className="absolute -right-10 -top-10 text-white/5 text-9xl">
                                <FaFistRaised />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 relative z-10 flex items-center gap-3">
                                {activeDisciplineInfo.subtitle}
                            </h3>
                            <p className="text-gray-300 leading-relaxed relative z-10">
                                {activeDisciplineInfo.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {activeDisciplineInfo.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-white/90 bg-black/40 border border-white/5 px-4 py-3 rounded-lg hover:bg-[var(--accent)]/10 hover:border-[var(--accent)] transition-all cursor-default">
                                    <FaStar className="text-[var(--accent)] text-xs" />
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </motion.div>


                    {/* RIGHT COLUMN: OPENING HOURS CARD */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-purple-600 rounded-3xl blur opacity-20 animate-pulse" />

                        <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
                            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase italic">Horarios</h3>
                                    <p className="text-sm text-gray-400">Siempre listos para ti</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                                    <FaClock size={24} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Weekdays */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white font-bold text-sm">
                                        L-V
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-wider mb-1">Lunes a Viernes</h4>
                                        <div className="space-y-1">
                                            <p className="text-[var(--accent)] font-mono text-lg font-bold">07:00 AM - 11:00 AM</p>
                                            <p className="text-[var(--accent)] font-mono text-lg font-bold">05:00 PM - 09:00 PM</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Saturdays */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white font-bold text-sm">
                                        S
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-wider mb-1">Sábados</h4>
                                        <p className="text-[var(--accent)] font-mono text-lg font-bold">09:00 AM - 01:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/10">
                                <button
                                    onClick={handleReserve}
                                    className="w-full bg-[var(--accent)] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] flex items-center justify-center gap-2"
                                >
                                    Agendar Clase de Prueba <FaFistRaised />
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-4">
                                    * La primera clase es cortesía de la casa.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section >
    );
}
