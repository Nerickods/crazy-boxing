'use client';
import { useState, useEffect } from 'react';
import PlanCard from './PlanCard';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import UiverseButton from '@/shared/components/UiverseButton';
import { plansService } from '../services/plansService';
import { Plan } from '../types/plan';
import { PLANS as STATIC_PLANS } from '../data/plans'; // Fallback

function PlansSection() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isReversed, setIsReversed] = useState(false);
    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

    const effectivelyPaused = isPaused || isHovered;

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

    const marqueeItems = [...plans, ...plans, ...plans, ...plans];

    const handleGlobalCtaClick = () => {
        const formulario = document.getElementById('formulario');
        if (formulario) {
            formulario.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="planes" className="py-16 md:py-32 bg-black relative overflow-hidden min-h-[100dvh] flex flex-col items-center justify-start">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-fixed overflow-hidden">
                    <picture>
                        <source srcSet="/assets/sections/plans-desktop.png" media="(max-width: 768px)" />
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
                <div className="text-center max-w-3xl mx-auto mb-16">
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

                {/* Marquee Section */}
                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-16 mb-12">
                    {loading ? (
                        <div className="flex justify-center items-center text-white/50 w-full py-20">Cargando planes...</div>
                    ) : (
                        <div
                            onClick={() => setIsPaused(!isPaused)}
                            onMouseEnter={() => {
                                if (window.matchMedia('(hover: hover)').matches) {
                                    setIsHovered(true);
                                }
                            }}
                            onMouseLeave={() => setIsHovered(false)}
                            onPointerDown={(e) => {
                                setTouchStart({ x: e.clientX, y: e.clientY });
                            }}
                            onPointerUp={(e) => {
                                if (!touchStart) return;
                                const deltaX = e.clientX - touchStart.x;
                                const deltaY = Math.abs(e.clientY - touchStart.y);

                                // Thresholds: Swipe must be primarily horizontal and move enough distance
                                // Swipe Right (deltaX > 50) -> Reverse
                                // Swipe Left (deltaX < -50) -> Normal
                                if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 50) {
                                    if (deltaX > 0) {
                                        setIsReversed(true);
                                    } else {
                                        setIsReversed(false);
                                    }
                                }
                                setTouchStart(null);
                            }}
                            className="group flex overflow-hidden pt-20 pb-4 px-2 [--gap:2rem] [gap:var(--gap)] flex-row w-full [--duration:50s] cursor-pointer select-none"
                        >
                            <div
                                className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row min-w-full"
                                style={{
                                    animationPlayState: effectivelyPaused ? 'paused' : 'running',
                                    animationDirection: isReversed ? 'reverse' : 'normal'
                                }}
                            >
                                {marqueeItems.map((plan, i) => (
                                    <PlanCard
                                        key={`p1-${i}`}
                                        plan={plan}
                                        index={i}
                                    />
                                ))}
                            </div>
                            <div
                                className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row min-w-full"
                                aria-hidden="true"
                                style={{
                                    animationPlayState: effectivelyPaused ? 'paused' : 'running',
                                    animationDirection: isReversed ? 'reverse' : 'normal'
                                }}
                            >
                                {marqueeItems.map((plan, i) => (
                                    <PlanCard
                                        key={`p1-${i}`}
                                        plan={plan}
                                        index={i}
                                    />
                                ))}
                            </div>
                            <div
                                className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row min-w-full"
                                aria-hidden="true"
                                style={{ animationPlayState: effectivelyPaused ? 'paused' : 'running' }}
                            >
                                {marqueeItems.map((plan, i) => (
                                    <PlanCard
                                        key={`p2-${i}`}
                                        plan={plan}
                                        index={i}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Fade Edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent z-20" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent z-20" />
                </div>

                {/* Global CTA */}
                <div className="flex flex-col items-center gap-6 mt-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <UiverseButton
                            text="¡EMPIEZA TU TRANSFORMACIÓN AHORA!"
                            onClick={handleGlobalCtaClick}
                            className="w-full sm:w-auto px-12 h-16 text-lg font-black"
                        />
                    </motion.div>
                    <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">
                        Plazas limitadas para nuevos alumnos
                    </p>
                </div>
            </div>
        </section>
    );
}

export default PlansSection;
