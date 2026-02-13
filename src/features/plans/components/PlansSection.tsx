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
    const [loading, setLoading] = useState(true);
    const [isPlansExpanded, setIsPlansExpanded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Only fetch plans now
                const plansData = await plansService.getPlans();

                // If DB empty for plans, use static as fallback (optional safeguard)
                setPlans(plansData.length > 0 ? plansData : STATIC_PLANS);

            } catch (error) {
                console.error("Failed to fetch plans", error);
                setPlans(STATIC_PLANS);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const plansAnchorRef = useScrollAnchor(isPlansExpanded, 100);

    return (
        <section id="planes" className="py-16 md:py-32 bg-black relative overflow-hidden min-h-[100dvh] flex flex-col items-center justify-start">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-fixed overflow-hidden">
                    <picture>
                        <source srcSet="/assets/sections/plans-mobile.png" media="(max-width: 768px)" />
                        <img
                            src="/assets/sections/plans-desktop.png"
                            alt="Greatness Path"
                            className="w-full h-full object-cover opacity-60 md:opacity-80"
                            style={{ objectPosition: 'center 80%' }}
                        />
                    </picture>
                </div>
                {/* Layered Gradients for Legibility and Transition - Reduced intensity for visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/10 to-black z-10" />
                <div className="absolute inset-0 bg-black/10 z-10 backdrop-contrast-[1.1]" />
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
                        No pagues por entrenar, <br />
                        <span className="text-zinc-500">invierte en tu transformación.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-zinc-400 text-lg leading-relaxed"
                    >
                        Elige el plan que se adapte a tu meta.
                    </motion.p>
                </div>

                {/* Standard Plans Grid - Adjusted for 4 cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-24 min-h-[500px]">
                    {loading ? (
                        <div className="col-span-full flex justify-center items-center text-white/50">Cargando planes...</div>
                    ) : (
                        plans.map((plan, index) => (
                            <div
                                key={plan.id}
                                className={cn(
                                    "flex flex-col"
                                    // Always flex (visible)
                                )}
                            >
                                <PlanCard plan={plan} index={index} />
                            </div>
                        ))
                    )}

                </div>
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

            </div>
        </section>
    );
}

export default PlansSection;
