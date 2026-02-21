'use client';

import { Plan } from '../types/plan';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import UiverseButton from '@/shared/components/UiverseButton';
import { scrollToElement } from '@/shared/utils/scrollToElement';

interface PlanCardProps {
    plan: Plan;
    index: number;
}

export default function PlanCard({ plan, index }: PlanCardProps) {
    const isHighlight = plan.highlight;
    const isPopular = plan.isPopular;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={cn(
                "relative group flex flex-col rounded-xl border",
                "bg-black/20 backdrop-blur-sm border-white/5",
                "p-8 text-start",
                "hover:border-[var(--accent)]/50 hover:bg-black/60 hover:shadow-[0_0_30px_-10px_rgba(0,255,255,0.15)]",
                "w-[350px] sm:w-[400px] shrink-0 h-full", // Fixed width for marquee consistency
                "transition-all duration-500 group/card",
                isHighlight && "ring-1 ring-sky-500/30"
            )}
        >
            {/* Layer 3: Content Container */}
            <div className="relative z-10 flex flex-col h-full">

                {/* Popular Badge */}
                {isPopular && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl shadow-[var(--accent)]/40 whitespace-nowrap z-20">
                        <Star size={12} fill="currentColor" />
                        EL MÁS POPULAR
                    </div>
                )}

                {/* Savings Badge */}
                {plan.savings && (
                    <div className="mb-4 self-start text-[10px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-3 py-1 rounded-md backdrop-blur-md">
                        {plan.savings}
                    </div>
                )}

                <div className="mb-8">
                    <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight group-hover/card:text-[var(--accent)] transition-all duration-300 uppercase break-words leading-tight">
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
                <div className="flex-1 mb-6">
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

                {/* Info Text (Optional fallback for context) */}
                <div className="mt-auto pt-4 border-t border-white/5 opacity-50 group-hover/card:opacity-100 transition-opacity">
                    <p className="text-[10px] text-zinc-500 text-center font-bold tracking-widest uppercase">
                        {plan.period === 'semana' ? '7 días naturales' :
                            plan.period === 'visita' ? 'Sin compromisos' : 'Acceso Total'}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
