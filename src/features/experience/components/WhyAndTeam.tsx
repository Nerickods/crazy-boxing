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
        title: "EL UMBRAL",
        period: "Día 1 - Mes 1",
        focus: "Seguridad y Pertenencia",
        icon: DoorOpen,
        copy: "Dudas si perteneces aquí. Te recibimos no como un cliente, sino como alguien listo para dejar de mentirse sobre su seguridad. Tu misión: cruzar el umbral del miedo y descubrir que no estás hecho de cristal.",
        methodology: "Metodología 'Zero-Daño'. Ese miedo a ser lastimado es lo primero que desmontamos. Sin sparring agresivo. Te sumergimos en drills técnicos donde 'sobrevivir' es simplemente aprender a caer y levantarte. Reprogramamos el pánico por técnica.",
        tags: ["SeguridadTotal", "Fundamentos"]
    },
    {
        id: 'stage-2',
        title: "LA FORJA",
        period: "Mes 1 - Mes 3",
        focus: "Disciplina y Adaptación",
        icon: Hammer,
        copy: "La comodidad que dejaste atrás empieza a sentirse vacía. Aquí, el dolor muscular es el precio de tu nueva armadura. Descubres que la \"versión segura\" de ti mismo era una cárcel. En La Forja, rompes los límites físicos que creías tener.",
        methodology: "Inoculación de Estrés Programada. Drills de 'Tiburón'. Te ponemos en situaciones de desventaja controlada (cansado, acorralado) para que tu mente aprenda a resolver problemas bajo presión. Dejas de congelarte; empiezas a calcular.",
        tags: ["Resistencia", "TecnicaPura"]
    },
    {
        id: 'stage-3',
        title: "EL DESPERTAR",
        period: "Mes 3 - Mes 6",
        focus: "Confianza y Reacción",
        icon: BrainCircuit,
        copy: "Ya no eres el mismo que entró temblando. Ahora caminas con una seguridad que se nota antes de que abras la boca; te paras diferente, ocupas tu espacio. Has despertado una conciencia nueva: en el caos del combate has aprendido a filtrar el ruido y concentrarte solo en lo que realmente importa. Esa claridad mental se traslada a tus estudios o trabajo; dejas de reaccionar a las urgencias de otros para darle prioridad a tu propio propósito.",
        methodology: "Ajedrez Humano (Sparring Situacional). Esta calma nace del control absoluto. Al desglosar la pelea en situaciones específicas, obligamos a tu cerebro a mantener el foco bajo presión extrema. La concentración que desarrollas para escapar de una posición difícil es la misma 'herramienta' que usarás para dominar tus retos fuera del tatami.",
        tags: ["FlowState", "Control"]
    },
    {
        id: 'stage-4',
        title: "LA TRANSFORMACIÓN",
        period: "Año 1+",
        focus: "Identidad y Liderazgo",
        icon: Crown,
        copy: "Has matado al impostor que vivía en tu cabeza. El mayor beneficio no es saber pelear, sino la libertad emocional de conocer tu verdadera identidad. Al entrar a cualquier lugar, proyectas la certeza de alguien que ha pasado por el fuego y ha salido íntegro; es imposible que pasas desapercibido. Dejas de buscar validación externa porque has encontrado tu verdad en el esfuerzo. Ya no entrenas para ser fuerte, sino para ser libre.",
        methodology: "El Código de la Tribu. Tu evolución se completa al convertirte en el espejo para los demás. Al mentorear a los nuevos que llegan con las mismas dudas que tú tenías, validas tu propia maestría. Tu liderazgo no es un título, es una radiación de carácter que infecta positivamente cada área de tu vida. te conviertes en un auténtico Guerrero.",
        tags: ["Liderazgo", "NuevaIdentidad"]
    }
];



function WhyAndTeam() {
    const [expandedStage, setExpandedStage] = useState<string | null>('stage-1');


    const toggleStage = (id: string) => {
        setExpandedStage(current => current === id ? null : id);
    };

    return (
        <section id="experiencia" className="py-16 md:py-32 bg-black relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0">
                <picture>
                    <source srcSet="/assets/mobile/initiate_mobile.png" media="(max-width: 768px)" />
                    <img
                        src="/assets/backgrounds/initiate.png"
                        alt="Path of the Initiate"
                        className="w-full h-full object-cover opacity-80 md:opacity-70"
                    />
                </picture>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_90%)] md:bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/5 to-black md:via-transparent" />
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

                            <div className="bg-zinc-900/80 backdrop-blur-md border border-white/20 rounded-xl p-6 mt-8 text-left grid md:grid-cols-3 gap-6 shadow-2xl">
                                <div>
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-[var(--accent)]">▪</span> Enfoque Láser
                                    </h4>
                                    <p className="text-sm text-gray-200 font-medium">Entrena tu capacidad de atención bajo presión extrema.</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-[var(--accent)]">▪</span> Motor Metabólico
                                    </h4>
                                    <p className="text-sm text-gray-200 font-medium">Activa tu quema de grasa horas después de entrenar.</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <span className="text-[var(--accent)]">▪</span> Seguridad Real
                                    </h4>
                                    <p className="text-sm text-gray-200 font-medium">Defensa personal aplicada que te acompañará siempre.</p>
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
                    ? "bg-black/80 border-[var(--accent)] shadow-[0_0_50px_-10px_rgba(255,215,0,0.2)]"
                    : "bg-black/40 border-white/5 hover:border-[var(--accent)]/30 hover:bg-black/60"
            )}
        >
            {/* Collapsed/Header View */}
            <div className="p-6 md:p-8 flex items-center gap-6">
                <div className={cn(
                    "p-4 rounded-xl transition-colors duration-300 shrink-0",
                    isExpanded ? 'bg-[var(--accent)] text-black' : 'bg-black/50 text-[var(--accent)] border border-[var(--accent)]/30'
                )}>
                    <stage.icon size={28} />
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold tracking-widest text-[var(--accent)] block mb-1">
                                {stage.period}
                            </span>
                            <h4 className={cn(
                                "font-bold text-xl uppercase",
                                isExpanded ? 'text-white' : 'text-gray-400'
                            )}>
                                {stage.title}
                            </h4>
                        </div>
                        <div className={cn(
                            "p-2 rounded-full transition-all duration-300",
                            isExpanded ? 'bg-[var(--accent)]/20 text-[var(--accent)] rotate-90' : 'text-gray-500'
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
                                <p className="text-white text-base leading-relaxed font-medium">
                                    {stage.copy}
                                </p>

                                {/* Methodology Block */}
                                <div className="bg-white/5 p-6 rounded-lg border-l-2 border-[var(--accent)] bg-gradient-to-r from-[var(--accent)]/10 to-transparent">
                                    <p className="text-gray-200 text-sm leading-relaxed italic">
                                        <span className="text-[var(--accent)] font-bold not-italic mr-2">Cómo lo logramos:</span>
                                        {stage.methodology}
                                    </p>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {stage.tags.map((tag: string) => (
                                        <span key={tag} className="text-[10px] font-bold uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 px-2 py-1 rounded tracking-wider">
                                            #{tag}
                                        </span>
                                    ))}
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
