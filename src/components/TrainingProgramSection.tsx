'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFistRaised, FaFire, FaShieldAlt, FaBolt,
    FaClock, FaCalendarAlt, FaUser, FaStar,
    FaInfoCircle, FaDumbbell
} from 'react-icons/fa';

// --- DATA: DISCIPLINES ---
const disciplines = [
    {
        id: "mma",
        name: "MMA",
        subtitle: "DOMINIO TOTAL",
        description: "No se trata de pelear, se trata de sobrevivir. Aprende a controlar el caos y descubre una versión de ti que no conocías.",
        benefits: ["Confianza Absoluta", "Defensa Real", "Cuerpo Atlético", "Mente Estratégica"],
        image: "/images/discipline_grappling.png", // Using grappling as placeholder
        icon: FaFistRaised,
        accentColor: "text-sky-500",
        gradient: "from-sky-900/20 to-black"
    },
    {
        id: "boxing",
        name: "BOXEO",
        subtitle: "TERAPIA DE IMPACTO",
        description: "Desconecta del estrés diario golpeando el saco. Desarrolla una concentración láser y libera toda la tensión acumulada.",
        benefits: ["Adiós Estrés", "Reflejos Rápidos", "Brazos Tonificados", "Mente Clara"],
        image: "/images/discipline_boxing.png",
        icon: FaFistRaised,
        accentColor: "text-indigo-500",
        gradient: "from-indigo-900/20 to-black"
    },
    {
        id: "muay-thai",
        name: "MUAY THAI",
        subtitle: "POTENCIA PURA",
        description: "Descubre la fuerza que hay en tus piernas y codos. Una disciplina intensa que forjará un carácter de hierro.",
        benefits: ["Defensa Integral", "Carácter Fuerte", "Piernas de Acero", "Quema Grasa"],
        image: "/images/discipline_muay_thai.png",
        icon: FaFire,
        accentColor: "text-cyan-500",
        gradient: "from-cyan-900/20 to-black"
    },
    {
        id: "bjj",
        name: "JIU JITSU",
        subtitle: "INTELIGENCIA EN MOVIMIENTO",
        description: "Aprende que la técnica vence a la fuerza. Ideal para ganar seguridad sin necesidad de ser el más grande o fuerte.",
        benefits: ["Seguridad Real", "Control Técnico", "Paciencia", "Resolución Problemas"],
        image: "/images/discipline_jiu_jitsu.png",
        icon: FaShieldAlt,
        accentColor: "text-blue-500",
        gradient: "from-blue-900/20 to-black"
    },
    {
        id: "kickboxing",
        name: "KICKBOXING",
        subtitle: "PODER Y PRECISIÓN",
        description: "La evolución del combate de pie. Combina el boxeo occidental con patadas devastadoras.",
        benefits: ["Distancia Perfecta", "Cuerpo Blindado", "Combos Letales", "Explosividad"],
        image: "/images/discipline_kickboxing.png",
        icon: FaBolt,
        accentColor: "text-purple-500",
        gradient: "from-purple-900/20 to-black"
    },
    {
        id: "acondicionamiento",
        name: "ACONDICIONAMIENTO",
        subtitle: "MOTOR INCANSABLE",
        description: "Construye la energía para rendir en tu vida diaria. No es solo ejercicio, es el combustible para tu día a día.",
        benefits: ["Energía Infinita", "Salud Integral", "Mejor Descanso", "Cuerpo Funcional"],
        image: "/images/fighters_running_bw.png",
        icon: FaDumbbell,
        accentColor: "text-green-500",
        gradient: "from-green-900/20 to-black"
    }
];

// --- DATA: SCHEDULE ---
const SCHEDULE_DATA = [
    // LUNES
    { id: 'l1', discipline: 'Boxeo', type: 'boxing', day: 'Lunes', time: '08:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'l2', discipline: 'Kickboxing', type: 'kickboxing', day: 'Lunes', time: '09:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'l3', discipline: 'Acondicionamiento Físico', type: 'acondicionamiento', day: 'Lunes', time: '16:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'l4', discipline: 'Acondicionamiento Físico', type: 'acondicionamiento', day: 'Lunes', time: '17:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'l5', discipline: 'Artes Marciales Mixtas', type: 'mma', day: 'Lunes', time: '18:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'l6', discipline: 'Jiu Jitsu No Gi', type: 'bjj', day: 'Lunes', time: '19:00', duration: '60 min', level: 'No Gi', instructor: 'Jorge', spots: 20 },
    { id: 'l7', discipline: 'Jiu Jitsu Gi', type: 'bjj', day: 'Lunes', time: '20:00', duration: '60 min', level: 'Gi', instructor: 'Jorge', spots: 20 },

    // MARTES
    { id: 'm1', discipline: 'Boxeo', type: 'boxing', day: 'Martes', time: '08:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'm2', discipline: 'Jiu-Jitsu / Grappling', type: 'bjj', day: 'Martes', time: '09:30', duration: '60 min', level: 'Grappling', instructor: 'César', spots: 20 },
    { id: 'm3', discipline: 'Kickboxing', type: 'kickboxing', day: 'Martes', time: '16:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'm4', discipline: 'Artes Marciales Mixtas', type: 'mma', day: 'Martes', time: '17:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'm5', discipline: 'Muay Thai', type: 'muay-thai', day: 'Martes', time: '18:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'm6', discipline: 'Circuito Boxeo', type: 'boxing', day: 'Martes', time: '19:00', duration: '60 min', level: 'Circuito', instructor: 'Héctor', spots: 20 },
    { id: 'm7', discipline: 'Jiu Jitsu Principiantes', type: 'bjj', day: 'Martes', time: '20:00', duration: '60 min', level: 'Básico', instructor: 'Jorge', spots: 20 },

    // MIERCOLES
    { id: 'x1', discipline: 'Acondicionamiento Físico', type: 'acondicionamiento', day: 'Miércoles', time: '08:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'x2', discipline: 'Acondicionamiento Físico', type: 'acondicionamiento', day: 'Miércoles', time: '09:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'x3', discipline: 'Muay Thai', type: 'muay-thai', day: 'Miércoles', time: '16:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'x4', discipline: 'Artes Marciales Mixtas', type: 'mma', day: 'Miércoles', time: '17:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'x5', discipline: 'Kickboxing', type: 'kickboxing', day: 'Miércoles', time: '18:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'x6', discipline: 'Jiu Jitsu No Gi', type: 'bjj', day: 'Miércoles', time: '19:00', duration: '60 min', level: 'No Gi', instructor: 'Jorge', spots: 20 },
    { id: 'x7', discipline: 'Jiu Jitsu Gi', type: 'bjj', day: 'Miércoles', time: '20:00', duration: '60 min', level: 'Gi', instructor: 'Jorge', spots: 20 },

    // JUEVES
    { id: 'j1', discipline: 'Boxeo', type: 'boxing', day: 'Jueves', time: '08:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'j2', discipline: 'Jiu-Jitsu / Grappling', type: 'bjj', day: 'Jueves', time: '09:30', duration: '60 min', level: 'Grappling', instructor: 'César', spots: 20 },
    { id: 'j3', discipline: 'Kickboxing', type: 'kickboxing', day: 'Jueves', time: '16:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'j4', discipline: 'Artes Marciales Mixtas', type: 'mma', day: 'Jueves', time: '17:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'j5', discipline: 'Muay Thai', type: 'muay-thai', day: 'Jueves', time: '18:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'j6', discipline: 'Circuito Boxeo', type: 'boxing', day: 'Jueves', time: '19:00', duration: '60 min', level: 'Circuito', instructor: 'Héctor', spots: 20 },
    { id: 'j7', discipline: 'Jiu Jitsu Principiantes', type: 'bjj', day: 'Jueves', time: '20:00', duration: '60 min', level: 'Básico', instructor: 'Jorge', spots: 20 },

    // VIERNES
    { id: 'v1', discipline: 'Sparring', type: 'boxing', day: 'Viernes', time: '08:30', duration: '60 min', level: 'Sparring', instructor: 'César', spots: 20 },
    { id: 'v2', discipline: 'Sparring', type: 'boxing', day: 'Viernes', time: '09:30', duration: '60 min', level: 'Sparring', instructor: 'César', spots: 20 },
    { id: 'v3', discipline: 'Sparring Muay Thai', type: 'muay-thai', day: 'Viernes', time: '16:00', duration: '60 min', level: 'Sparring', instructor: 'Héctor', spots: 20 },
    { id: 'v4', discipline: 'Sparring MMA', type: 'mma', day: 'Viernes', time: '17:00', duration: '60 min', level: 'Sparring', instructor: 'Héctor', spots: 20 },
    { id: 'v5', discipline: 'Sparring MMA', type: 'mma', day: 'Viernes', time: '18:00', duration: '60 min', level: 'Sparring', instructor: 'Héctor', spots: 20 },
    { id: 'v6', discipline: 'Jiu Jitsu', type: 'bjj', day: 'Viernes', time: '19:00', duration: '60 min', level: 'General', instructor: 'Jorge', spots: 20 },
    { id: 'v7', discipline: 'Open Mat Jiu Jitsu', type: 'bjj', day: 'Viernes', time: '20:00', duration: '60 min', level: 'Open Mat', instructor: 'Jorge', spots: 20 },
];

export default function TrainingProgramSection() {
    const [activeTab, setActiveTab] = useState<string>('mma'); // Default to MMA

    const handleReserve = (className: string) => {
        document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
    };

    const filteredSchedule = SCHEDULE_DATA.filter(item => item.type === activeTab);
    const activeDisciplineInfo = disciplines.find(d => d.id === activeTab);

    return (
        <section id="programa" className="py-24 bg-black relative min-h-screen flex flex-col">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80" />

            <div className="container mx-auto px-6 relative z-10 flex-grow flex flex-col">
                {/* HEADER */}
                <div className="text-center mb-12">
                    <span className="text-[var(--accent)] font-bold tracking-[0.3em] text-xs uppercase mb-4 block animate-fade-in">
                        PROGRAMA DE ÉLITE
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase">
                        Elige tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-sky-600">Camino</span>
                    </h2>

                    {/* OPENING HOURS BADGE */}
                    <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-6 py-3 backdrop-blur-md hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-xs uppercase tracking-widest whitespace-nowrap">
                            <FaClock /> Horarios de Apertura
                        </div>
                        <div className="flex flex-col items-start gap-1 text-xs text-gray-400">
                            <span className="flex items-center gap-2">
                                <span className="text-white font-bold">LUN-VIE:</span> 8:30-10:30 AM / 4:00-9:00 PM
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-white font-bold">SÁB:</span> 8:00-10:00 AM
                            </span>
                        </div>
                    </div>
                </div>

                {/* TABS SELECTOR */}
                <div className="flex overflow-x-auto pb-4 mb-12 gap-4 no-scrollbar items-center md:justify-center px-4">
                    {disciplines.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => setActiveTab(d.id)}
                            className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 border flex items-center gap-2 ${activeTab === d.id
                                ? `bg-[var(--accent)] text-black border-[var(--accent)] scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)]`
                                : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-500 hover:text-white'
                                }`}
                        >
                            <d.icon className={activeTab === d.id ? 'text-black' : d.accentColor} />
                            {d.name}
                        </button>
                    ))}
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: INFO */}
                    <AnimatePresence mode='wait'>
                        {activeDisciplineInfo && (
                            <motion.div
                                key={activeDisciplineInfo.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="lg:col-span-5 relative overflow-hidden rounded-2xl min-h-[500px] group"
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={activeDisciplineInfo.image}
                                        alt={activeDisciplineInfo.name}
                                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/discipline_grappling.png'; // Fallback
                                        }}
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${activeDisciplineInfo.gradient} opacity-90`} />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="mb-6">
                                        <activeDisciplineInfo.icon className={`text-6xl mb-4 ${activeDisciplineInfo.accentColor}`} />
                                        <h3 className="text-5xl font-black text-white italic uppercase leading-none mb-2">
                                            {activeDisciplineInfo.name}
                                        </h3>
                                        <p className="text-[var(--accent)] font-bold tracking-widest">{activeDisciplineInfo.subtitle}</p>
                                    </div>

                                    <p className="text-gray-300 mb-8 leading-relaxed border-l-2 border-[var(--accent)] pl-4">
                                        {activeDisciplineInfo.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        {activeDisciplineInfo.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 p-2 rounded backdrop-blur-sm">
                                                <FaStar className="text-[var(--accent)] text-[10px]" />
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* RIGHT COLUMN: SCHEDULE LIST */}
                    <div className="lg:col-span-7">
                        <div className="h-full flex flex-col">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={activeTab + "-list"}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-3"
                                >
                                    {filteredSchedule.sort((a, b) => {
                                        // Sort by day index, then time
                                        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
                                        const dayDiff = days.indexOf(a.day) - days.indexOf(b.day);
                                        if (dayDiff !== 0) return dayDiff;
                                        return a.time.localeCompare(b.time);
                                    }).map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="group relative bg-gray-900 border border-gray-800 hover:border-[var(--accent)] p-4 rounded-xl overflow-hidden transition-all hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                                            onClick={() => handleReserve(item.id)}
                                        >
                                            {/* Time & Day */}
                                            <div className="w-[25%] sm:w-[20%]">
                                                <div className="flex items-center gap-1 text-[var(--accent)] font-bold text-[10px] sm:text-xs mb-1 uppercase tracking-wider">
                                                    <FaCalendarAlt /> <span className="truncate">{item.day}</span>
                                                </div>
                                                <div className="text-lg sm:text-xl font-black text-white">
                                                    {item.time}
                                                </div>
                                            </div>

                                            {/* Class Info */}
                                            <div className="w-[40%] sm:w-[40%] px-2">
                                                <h4 className="text-sm sm:text-base font-bold text-white uppercase group-hover:text-[var(--accent)] transition-colors leading-tight">
                                                    {item.discipline}
                                                </h4>
                                                <p className="text-gray-400 text-[10px] uppercase tracking-wide mt-1">{item.level}</p>
                                            </div>

                                            {/* Instructor & CTA */}
                                            <div className="w-[35%] sm:w-[40%] flex items-center justify-end gap-2 sm:gap-4">
                                                <div className="hidden sm:flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[var(--accent)]">
                                                        <FaUser size={10} />
                                                    </div>
                                                    <span className="text-xs text-gray-300 font-medium whitespace-nowrap">{item.instructor}</span>
                                                </div>

                                                <button className="bg-[var(--accent)] text-black hover:bg-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors shadow-[0_0_10px_rgba(255,215,0,0.2)]">
                                                    Reservar
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {filteredSchedule.length === 0 && (
                                        <div className="text-center py-20 text-gray-500 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
                                            <FaInfoCircle className="mx-auto text-4xl mb-4 opacity-50" />
                                            <p>No hay clases de {activeDisciplineInfo?.name} programadas actualmente.</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
