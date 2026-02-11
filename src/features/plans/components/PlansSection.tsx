'use client';
import { useState, useEffect } from 'react';
import PlanCard from './PlanCard';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import { Check } from 'lucide-react';
import { useScrollAnchor } from '@/shared/hooks/use-scroll-anchor';
import UiverseButton from '@/shared/components/UiverseButton';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { plansService } from '../services/plansService';
import { Plan, Promotion, SectionConfig } from '../types/plan';
import { PLANS as STATIC_PLANS, PROMOTIONS_2026 as STATIC_PROMOS } from '../data/plans'; // Fallback

function PlansSection() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [headerConfig, setHeaderConfig] = useState<SectionConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPlansExpanded, setIsPlansExpanded] = useState(false);
    const [isPromosExpanded, setIsPromosExpanded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [plansData, promosData, headerData] = await Promise.all([
                    plansService.getPlans(),
                    plansService.getPromotions(),
                    plansService.getSectionConfig('promotions_header')
                ]);

                // If DB empty for plans, use static as fallback (optional safeguard)
                setPlans(plansData.length > 0 ? plansData : STATIC_PLANS);

                // For promotions, we respect the DB result even if empty (user might have deactivated all)
                setPromotions(promosData);

                // Set header config if available
                if (headerData) setHeaderConfig(headerData);

            } catch (error) {
                console.error("Failed to fetch plans/promos", error);
                setPlans(STATIC_PLANS);
                setPromotions(STATIC_PROMOS); // Fallback for promotions too if fetch fails
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to map DB fields to UI if needed, currently types match mostly
    // Note: PlanCard expects 'plan' object. Ensure structure matches.
    const showPromotions = headerConfig?.isActive !== false; // Default true if no config found, or respect false
    const subTitle = headerConfig?.title || 'OFERTA POR TIEMPO LIMITADO';
    const mainTitle = headerConfig?.subtitle || '2026: Tu Año. Tu Legado.';
    const description = headerConfig?.description || 'Promociones válidas por tiempo limitado.';

    const plansAnchorRef = useScrollAnchor(isPlansExpanded, 100);
    const promosAnchorRef = useScrollAnchor(isPromosExpanded, 100);

    return (
        <section id="planes" className="py-16 md:py-32 bg-black relative overflow-hidden min-h-[100dvh] flex flex-col items-center justify-start">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-fixed overflow-hidden">
                    <picture>
                        <source srcSet="/assets/mobile/greatness_mobile.png" media="(max-width: 768px)" />
                        <img
                            src="/images/plans-bg-octagon.jpg"
                            alt="Greatness Path"
                            className="w-full h-full object-cover opacity-60 md:opacity-80"
                            style={{ objectPosition: 'center 80%' }}
                        />
                    </picture>
                </div>
                {/* Layered Gradients for Legibility and Transition - Reduced intensity for visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black z-10" />
                <div className="absolute inset-0 bg-black/20 z-10 backdrop-contrast-[1.1]" />
            </div>

            <div className="container mx-auto px-6 relative z-20">
                <div ref={plansAnchorRef} className="text-center max-w-3xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[var(--accent)] font-bold tracking-wider uppercase text-sm mb-4 block"
                    >
                        Precios 2026
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
                    >
                        Elige tu camino <br />
                        <span className="text-zinc-500">hacia la grandeza</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-zinc-400 text-lg leading-relaxed"
                    >
                        Sin costos ocultos ni contratos forzosos.
                        <br />
                        <span className="text-[var(--accent)] font-semibold">Inscripción única: $200 MXN</span> (Aplica desde Plan Mensual).
                    </motion.p>
                </div>

                {/* Standard Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 items-stretch mb-24 min-h-[500px]">
                    {loading ? (
                        <div className="col-span-full flex justify-center items-center text-white/50">Cargando planes...</div>
                    ) : (
                        plans.map((plan, index) => (
                            <div
                                key={plan.id}
                                className={cn(
                                    "flex flex-col",
                                    plan.highlight && "md:col-span-1 lg:col-span-1 xl:col-span-1",
                                    index >= 3 && "lg:col-span-1 lg:first-of-type:ml-[16.666%] lg:last-of-type:mr-[16.666%]",
                                    index > 0 && !isPlansExpanded ? "hidden md:flex" : "flex"
                                )}
                            >
                                <PlanCard plan={plan} index={index} />
                            </div>
                        ))
                    )}

                </div>

                {/* Mobile View More (Plans) */}
                {plans.length > 1 && !isPlansExpanded && (
                    <div className="text-center md:hidden -mt-16 mb-24">
                        <button
                            onClick={() => setIsPlansExpanded(true)}
                            className="px-8 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black transition-all duration-300 rounded-full w-full max-w-xs"
                        >
                            Ver todos los planes (+{plans.length - 1})
                        </button>
                    </div>
                )}
                {isPlansExpanded && (
                    <div className="text-center md:hidden -mt-16 mb-24">
                        <button
                            onClick={() => setIsPlansExpanded(false)}
                            className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Mostrar menos
                        </button>
                    </div>
                )}

                {/* 🏆 PROMOCIONES 2026: THE GOLDEN ERA 🏆 */}
                {showPromotions && (
                    <div className="relative py-20 max-w-5xl mx-auto">

                        {/* Section Header */}
                        <motion.div
                            ref={promosAnchorRef}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h3 className="text-sm font-bold tracking-[0.3em] text-[var(--accent)] uppercase mb-2">
                                {subTitle}
                            </h3>
                            <div className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                                {mainTitle}
                            </div>
                        </motion.div>

                        {promotions.length === 0 ? (
                            <div className="text-center py-10 text-zinc-500">
                                {/* Empty state if active but no promos */}
                                <p>No hay promociones activas en este momento.</p>
                            </div>
                        ) : (
                            /* The Golden Ticket Board */
                            <GlassCard
                                variant="holographic"
                                className="p-0 border-[var(--accent)]/20"
                            >
                                {/* Background Effects */}
                                <div className="absolute inset-0 bg-zinc-950/80 z-0" />
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent opacity-50" />

                                <div className={cn(
                                    "grid relative z-10 divide-y md:divide-y-0 md:divide-x divide-white/10 transition-all duration-300",
                                    promotions.length === 1 ? "grid-cols-1" :
                                        promotions.length === 2 ? "grid-cols-1 md:grid-cols-2" :
                                            "grid-cols-1 md:grid-cols-3"
                                )}>
                                    {promotions.map((promo, idx) => (
                                        <div
                                            key={promo.id}
                                            className={cn(
                                                "relative p-8 group transition-all duration-500 overflow-hidden",
                                                idx > 0 && !isPromosExpanded ? "hidden md:block" : "block"
                                            )}
                                        >
                                            {/* 0. Background Image with Zoom Effect */}
                                            {promo.backgroundImage && (
                                                <div className="absolute inset-0 z-0">
                                                    <div className="absolute inset-0 bg-black/70 z-10" /> {/* Dark Overlay */}
                                                    <img
                                                        src={promo.backgroundImage}
                                                        alt={promo.title}
                                                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700 ease-out grayscale-[0.3] group-hover:grayscale-0"
                                                    />
                                                </div>
                                            )}

                                            {/* 1. Large Background Number (Blended) */}
                                            <span className="absolute -right-4 -bottom-8 text-[12rem] font-black text-white/[0.05] leading-none pointer-events-none select-none transition-transform duration-500 group-hover:scale-110 z-0 mix-blend-overlay">
                                                {promo.description?.split(' ')[0]}
                                            </span>

                                            {/* 2. Content */}
                                            <div className="relative z-10 flex flex-col h-full items-center text-center">
                                                <div className="mb-6">
                                                    <h4 className="text-lg font-bold text-white tracking-[0.2em] mb-1 drop-shadow-md">
                                                        {promo.title}
                                                    </h4>
                                                    <p className="text-xs text-zinc-300 uppercase font-semibold tracking-widest">
                                                        {promo.description}
                                                    </p>
                                                </div>

                                                <div className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
                                                    <span className="bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent">
                                                        {promo.discount}
                                                    </span>
                                                </div>

                                                <ul className="space-y-4 mb-10 w-full text-left pl-4">
                                                    {promo.features && promo.features.map((feat, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm group-hover:text-zinc-200 transition-colors">
                                                            <Check size={14} className="mt-1 text-[var(--accent)] shrink-0" />
                                                            {feat}
                                                        </li>
                                                    ))}
                                                </ul>

                                                <div className="mt-auto w-full">
                                                    <UiverseButton
                                                        text="NO DISPONIBLE ONLINE"
                                                        onClick={undefined}
                                                        style={{
                                                            '--pulse-hue': '0deg', // Red for unavailable
                                                            '--btn-font-size': '12px',
                                                            cursor: 'default'
                                                        } as React.CSSProperties}
                                                        className="w-full hover:scale-[1.01] transition-all duration-300"
                                                    />
                                                    <p className="text-[10px] text-zinc-500 text-center mt-3 font-bold tracking-widest uppercase opacity-60">
                                                        Solo en sucursal
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {/* Mobile View More (Promos) */}
                        {promotions.length > 1 && !isPromosExpanded && (
                            <div className="mt-8 text-center md:hidden">
                                <button
                                    onClick={() => setIsPromosExpanded(true)}
                                    className="px-8 py-3 bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black transition-all duration-300 rounded-full w-full max-w-xs"
                                >
                                    Ver todas las promos (+{promotions.length - 1})
                                </button>
                            </div>
                        )}
                        {isPromosExpanded && (
                            <div className="mt-8 text-center md:hidden">
                                <button
                                    onClick={() => setIsPromosExpanded(false)}
                                    className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Ocultar promociones
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-zinc-500 text-sm">
                        * Todos los precios están en Pesos Mexicanos (MXN).
                        El acceso a sucursal Zapopan aplica únicamente para planes Mensuales, Semestrales y Anuales.
                        Promociones válidas por tiempo limitado.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

export default PlansSection;
