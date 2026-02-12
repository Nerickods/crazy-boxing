'use client';

import { Plan } from '../types/plan';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import UiverseButton from '@/shared/components/UiverseButton';

interface PlanCardProps {
    plan: Plan;
    index: number;
}

export default function PlanCard({ plan, index }: PlanCardProps) {
    const isHighlight = plan.highlight;
    const isPopular = plan.isPopular;

    const handleCtaClick = () => {
        const formElement = document.getElementById('formulario');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={cn(
                "relative group flex flex-col p-8 rounded-3xl border transition-all duration-500 h-full pt-12", // Increased pt-12 to accommodate badge
                "backdrop-blur-2xl backdrop-saturate-150",
                isHighlight
                    ? "bg-zinc-900/40 border-[var(--accent)]/30 shadow-[0_0_40px_-10px_rgba(var(--accent-rgb),0.2)] scale-100 md:scale-105 z-10"
                    : "bg-white/[0.03] border-white/10 hover:border-[var(--accent)]/30 hover:bg-white/[0.05]"
            )}
        >
            {/* Ambient Accent Glow (only for highlighted or popular) */}
            {(isHighlight || isPopular) && (
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent)]/10 blur-[80px] z-0" />
            )}

            {/* Layer 1: Premium Surface Overlays - Moved inside to avoid spilling without overflow-hidden on main container */}
            <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-50" />
                {/* Subtle inner border for depth */}
                <div className="absolute inset-[1px] rounded-[23px] z-0 pointer-events-none border border-white/5" />
            </div>

            {/* Layer 3: Content Container */}
            <div className="relative z-10 flex flex-col h-full">

                {/* Popular Badge */}
                {isPopular && (
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl shadow-[var(--accent)]/40 whitespace-nowrap z-20">
                        <Star size={12} fill="currentColor" />
                        MÁS POPULAR
                    </div>
                )}

                {/* Savings Badge - Relocated for better title space */}
                {plan.savings && (
                    <div className="mb-4 self-start text-[10px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-3 py-1 rounded-md backdrop-blur-md">
                        {plan.savings}
                    </div>
                )}

                <div className="mb-8">
                    <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight group-hover:text-[var(--accent)] transition-all duration-300 uppercase break-words leading-tight">
                        {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-5xl font-black text-white tracking-tighter">
                            ${plan.price}
                        </span>
                        <span className="text-zinc-500 font-bold text-sm uppercase tracking-widest">
                            {plan.period === 'visita' ? ' / CLASE' : plan.period === 'pareja' ? '' : ` / ${plan.period}`}
                        </span>
                    </div>
                    <p className="text-zinc-400 text-sm mt-4 leading-relaxed font-medium">
                        {plan.description}
                    </p>
                </div>

                {/* Features list */}
                <div className="flex-1 mb-10">
                    <ul className="space-y-4">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-4 text-sm text-zinc-300 group/item">
                                <div className={cn(
                                    "mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                                    feature.includes('✨')
                                        ? "bg-[var(--accent)] text-black"
                                        : "bg-zinc-800 text-zinc-500 group-hover/item:text-zinc-300"
                                )}>
                                    <Check size={14} strokeWidth={4} />
                                </div>
                                <span className={cn(
                                    "leading-tight transition-colors duration-300",
                                    feature.includes('✨') ? "text-white font-bold" : "group-hover/item:text-white"
                                )}>
                                    {feature.replace('✨ ', '')}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Action Section */}
                <div className="mt-auto">
                    <UiverseButton
                        text={
                            plan.ctaText ||
                            (plan.key === 'visita' ? 'RESERVAR 1 CLASE' :
                                plan.key === 'semanal' ? 'COMPRAR SEMANA' :
                                    plan.key === 'mensual' ? 'QUIERO TRANSFORMARME' :
                                        plan.key === 'pareja' ? 'PROMO PAREJAS' :
                                            'NO DISPONIBLE ONLINE')
                        }
                        onClick={handleCtaClick}
                        style={{
                            '--pulse-hue': plan.highlight ? '130deg' : '0deg', // Pulse green if highlighted
                            '--btn-font-size': '12px',
                            cursor: 'pointer' // Always actionable
                        } as React.CSSProperties}
                        className={cn(
                            "w-full transition-all duration-300 hover:scale-[1.02]"
                        )}
                    />

                    {plan.period === 'semana' && (
                        <p className="text-[10px] text-zinc-500 text-center mt-3 font-bold tracking-widest uppercase">
                            7 días naturales
                        </p>
                    )}
                    {plan.period === 'visita' && (
                        <p className="text-[10px] text-zinc-500 text-center mt-3 font-bold tracking-widest uppercase">
                            Sin compromisos
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
