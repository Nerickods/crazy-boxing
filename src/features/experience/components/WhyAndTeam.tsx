'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoorOpen, Hammer, BrainCircuit, Crown, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useScrollAnchor } from '@/shared/hooks/use-scroll-anchor';

// --- DATA: THE EVOLUTION JOURNEY (PAIN-TO-POWER ALIGNED) ---
const journeyStages = [
    {
        id: 'stage-1',
        title: "EL DESBLOQUEO",
        period: "Día 1 - Mes 1",
        focus: "Seguridad y Pertenencia",
        icon: DoorOpen,
        headline: "El problema no es tu cuerpo, es tu miedo a romperte.",
        copy: "La mayoría abandona el boxeo la primera semana por miedo al dolor o al ridículo. Nosotros eliminamos esa barrera de entrada.",
        mechanism: {
            title: "Sistema 'Zero-Daño'",
            action: "Aprenderás a moverte, cubrirte y caer sin recibir un solo golpe real.",
            result: "En 30 días, tu cerebro deja de ver el gimnasio como una amenaza y empieza a verlo como tu zona segura.",
            reality: "Dejas de verte frágil al espejo."
        }
    },
    {
        id: 'stage-2',
        title: "LA INOCULACIÓN",
        period: "Mes 1 - Mes 3",
        focus: "Disciplina y Adaptación",
        icon: Hammer,
        headline: "La técnica sin presión es solo baile. Aquí empieza la realidad.",
        copy: "Ya sabes golpear al saco, ahora te enseñamos a pensar bajo fuego. Tu mente aprenderá a resolver problemas mientras tu cuerpo se agota.",
        mechanism: {
            title: "Drills de Estrés Controlado",
            action: "Ejercicios donde limitamos tu espacio o tu energía para obligarte a usar la técnica, no la fuerza bruta.",
            result: "Dejas de congelarte ante la presión. Aprendes a calcular en medio del caos.",
            reality: "Descubres que aguantas 10 veces más de lo que creías."
        }
    },
    {
        id: 'stage-3',
        title: "EL AJEDREZ FÍSICO",
        period: "Mes 3 - Mes 6",
        focus: "Confianza y Reacción",
        icon: BrainCircuit,
        headline: "La fuerza bruta tiene un límite. La inteligencia no.",
        copy: "Aquí es donde los \"peleadores de bar\" pierden y los verdaderos boxeadores nacen. Peleas con reglas matemáticas, no a ver quién pega más fuerte.",
        mechanism: {
            title: "Sparring Situacional",
            action: "Combates lentos y estratégicos donde el objetivo es anular al oponente, no lastimarlo.",
            result: "Desarrollas la famosa \"visión de túnel\". El ruido desaparece y solo ves objetivos.",
            reality: "Esa calma mental te la llevas a tu trabajo y a tu vida. Ya no reaccionas, respondes."
        }
    },
    {
        id: 'stage-4',
        title: "LA IDENTIDAD GUERRERA",
        period: "Año 1+",
        focus: "Identidad y Liderazgo",
        icon: Crown,
        headline: "Ya no entrenas para demostrar nada. Entrenas porque es quien eres.",
        copy: "Has matado al impostor. No necesitas validación externa porque tu confianza nace de tu competencia real.",
        mechanism: {
            title: "El Código de la Tribu",
            action: "Perfeccionar tu estilo propio y mentorear a los nuevos iniciados para que pierdan el miedo, tal como tú lo hiciste.",
            result: "Una seguridad silenciosa. Entras a cualquier habitación sabiendo que, pase lo que pase, podrás manejarlo.",
            reality: "Paz mental absoluta."
        }
    }
];



function WhyAndTeam() {
    const [expandedStage, setExpandedStage] = useState<string | null>(null);


    const toggleStage = (id: string) => {
        setExpandedStage(current => current === id ? null : id);
    };

    return (
        <section id="experiencia" className="py-16 md:py-32 bg-black relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0">
                <picture>
                    <source srcSet="/assets/sections/why-team-desktop.png" media="(max-width: 768px)" />
                    <img
                        src="/assets/sections/why-team-desktop.png"
                        alt="Path of the Initiate"
                        className="w-full h-full object-cover opacity-80 md:opacity-70"
                    />
                </picture>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_80%)] md:bg-[radial-gradient(circle_at_center,transparent_20%,black_90%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/5 to-black md:via-transparent opacity-60" />
            </div>

            <div className="container mx-auto px-6 relative z-10">

                {/* --- SECTION 1: METHODOLOGY JOURNEY --- */}
                <div className="max-w-4xl mx-auto mb-32">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-[var(--accent)] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">
                            Deja de "hacer ejercicio"
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight mb-8 drop-shadow-2xl">
                            ENTRENA UNA <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-sky-600 drop-shadow-sm">HABILIDAD REAL</span>
                        </h2>

                        <div className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed space-y-6">
                            <p>
                                Correr en una cinta es "alquilar" tu forma física; el boxeo es <strong>"comprar" una habilidad para toda la vida</strong>.
                                Mientras otros solo queman calorías, tú estás adquiriendo coordinación, potencia y reflejos.
                            </p>

                            <div className="bg-sky-500/5 backdrop-blur-md border border-sky-500/20 rounded-xl p-6 mt-8 text-left grid md:grid-cols-3 gap-6 shadow-[0_0_30px_-10px_rgba(14,165,233,0.15)] relative overflow-hidden">
                                {/* Decorational Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                                <div>
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-[var(--accent)]">▪</span> Enfoque Láser
                                    </h4>
                                    <p className="text-sm text-sky-100/80 font-medium">Entrena tu capacidad de atención bajo presión extrema.</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-[var(--accent)]">▪</span> Motor Metabólico
                                    </h4>
                                    <p className="text-sm text-sky-100/80 font-medium">Activa tu quema de grasa horas después de entrenar.</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-[var(--accent)]">▪</span> Seguridad Real
                                    </h4>
                                    <p className="text-sm text-sky-100/80 font-medium">Defensa personal aplicada que te acompañará siempre.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Timeline Stages (Stacked) */}
                    <div className="flex flex-col gap-6">
                        {journeyStages.map((stage, index) => (
                            <JourneyStageItem
                                key={stage.id}
                                stage={stage}
                                index={index}
                                isExpanded={expandedStage === stage.id}
                                onToggle={() => toggleStage(stage.id)}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

interface JourneyStageItemProps {
    stage: any;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}

function JourneyStageItem({ stage, index, isExpanded, onToggle }: JourneyStageItemProps) {
    const anchorRef = useScrollAnchor(isExpanded, 120);

    return (
        <motion.div
            ref={anchorRef}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={onToggle}
            className={cn(
                "relative rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-xl",
                isExpanded
                    ? "bg-sky-500/10 border-sky-500/50 shadow-[0_0_30px_-5px_rgba(14,165,233,0.3)]"
                    : "bg-black/40 border-white/5 hover:border-sky-500/30 hover:bg-sky-900/10"
            )}
        >
            {/* Collapsed/Header View */}
            <div className="p-6 md:p-8 flex items-center gap-6">
                <div className={cn(
                    "p-4 rounded-xl transition-colors duration-300 shrink-0",
                    isExpanded ? 'bg-sky-500 text-black shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'bg-black/50 text-sky-500 border border-sky-500/30'
                )}>
                    <stage.icon size={28} />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold tracking-widest text-sky-400 block mb-1">
                                {stage.period}
                            </span>
                            <h4 className={cn(
                                "font-bold text-xl uppercase",
                                isExpanded ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                            )}>
                                {stage.title}
                            </h4>
                        </div>
                        <div className={cn(
                            "p-2 rounded-full transition-all duration-300",
                            isExpanded ? 'bg-sky-500/20 text-sky-400 rotate-90' : 'text-gray-500 group-hover:text-sky-400'
                        )}>
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 md:px-8 pb-8 pt-0 border-t border-white/10 mx-6 md:mx-8">
                            <div className="mt-6 flex flex-col gap-6">
                                {/* Narrative Copy */}
                                <div className="space-y-4">
                                    <h5 className="text-white font-bold text-lg leading-tight">
                                        {stage.headline}
                                    </h5>
                                    <p className="text-gray-300 text-base leading-relaxed">
                                        {stage.copy}
                                    </p>
                                </div>

                                {/* Methodology Block */}
                                <div className="bg-sky-500/5 p-6 rounded-xl border border-sky-500/10 relative overflow-hidden group hover:border-sky-500/30 transition-colors">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xl">🛠️</span>
                                        <h6 className="text-sky-400 font-bold uppercase tracking-wider text-sm">
                                            El Mecanismo: {stage.mechanism.title}
                                        </h6>
                                    </div>

                                    <ul className="space-y-3">
                                        <li className="text-sm text-gray-300 leading-relaxed">
                                            <strong className="text-white block mb-1">Lo que harás:</strong>
                                            {stage.mechanism.action}
                                        </li>
                                        <li className="text-sm text-gray-300 leading-relaxed">
                                            <strong className="text-white block mb-1">El Resultado:</strong>
                                            {stage.mechanism.result}
                                        </li>
                                        <li className="text-sm text-gray-300 leading-relaxed pt-2 border-t border-sky-500/10 mt-2">
                                            <strong className="text-sky-400 block mb-1">Tu nueva realidad:</strong>
                                            <span className="italic">{stage.mechanism.reality}</span>
                                        </li>
                                    </ul>
                                </div>


                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default WhyAndTeam;
