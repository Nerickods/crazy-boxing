import { motion } from 'framer-motion';
import InfiniteCarouselRow from './InfiniteCarouselRow';
import { heroCarouselRows } from '../services/heroData';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { GlassButton } from '@/shared/components/ui/GlassButton';

export default function HeroDoubleCarousel() {
    const handleCtaClick = () => {
        // Direct implementation to ensure functionality
        const formElement = document.getElementById('formulario');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('Formulario element not found');
        }
    };

    return (
        <section id="inicio" className="relative w-full min-h-[100dvh] bg-[var(--background)] overflow-hidden flex flex-col font-['Poppins']">

            {/* 1. TOP CAROUSEL (Left) */}
            <div className="w-full h-[50dvh] relative z-0 border-b border-white/5">
                <InfiniteCarouselRow
                    images={heroCarouselRows[0].images}
                    direction="left"
                    duration={heroCarouselRows[0].animation.duration}
                />
            </div>

            {/* 2. BOTTOM CAROUSEL (Right) */}
            <div className="w-full h-[50dvh] relative z-0 border-t border-white/5">
                <InfiniteCarouselRow
                    images={heroCarouselRows[1].images}
                    direction="right"
                    duration={heroCarouselRows[1].animation.duration}
                />
            </div>

            {/* 3. CENTRAL OVERLAY - GLASSMORPHISM BOX */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center p-3 md:p-6">

                {/* Glassmorphism Box */}
                <GlassCard
                    variant="premium"
                    className="relative z-20 max-w-5xl w-full mx-auto px-4 py-8 md:p-16 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-1000"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter mb-4 md:mb-8 uppercase leading-[1.1] md:leading-[0.9] text-center mx-auto"
                    >
                        DEJA DE "INTENTAR" PONERTE EN FORMA. <br />
                        <span className="text-[var(--accent)] drop-shadow-[0_0_25px_rgba(255,215,0,0.4)]">
                            APRENDE A PELEAR POR TUS OBJETIVOS
                        </span>

                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-sm sm:text-base md:text-xl text-white font-normal max-w-3xl mb-6 md:mb-10 leading-relaxed tracking-wide drop-shadow-sm px-2 text-center mx-auto"
                    >
                        Prueba el entrenamiento de los profesionales adaptado a ti. <br className="hidden md:block" />
                        <span className="text-[var(--accent)] font-bold">Adrenalina, técnica y un ambiente que te empuja a ser mejor.</span> <br />
                        Si buscas resultados rápidos y divertidos, tu sitio está aquí. <strong className="text-[var(--accent)] font-black uppercase tracking-wider text-lg md:text-2xl ml-1">Crazy Boxing</strong>
                    </motion.p>

                    {/* Compact & Alive CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="flex flex-col items-center gap-3"
                    >
                        <GlassButton
                            variant="glow"
                            size="lg"
                            onClick={handleCtaClick}
                            className="pointer-events-auto w-full sm:w-auto text-xs sm:text-sm md:text-base py-4 sm:py-3 px-6 md:px-8 font-bold tracking-wider"
                        >
                            🚀 RESERVAR CLASE DE PRUEBA
                        </GlassButton>
                        <span className="text-xs sm:text-sm text-white/60 font-light tracking-wide animate-pulse-slow">
                            (Te prestamos todo el equipo)
                        </span>
                    </motion.div>

                </GlassCard>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/30 pointer-events-none"
            >
                <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                    <div className="w-1 h-1.5 md:h-2 bg-white/40 rounded-full animate-scroll"></div>
                </div>
            </motion.div>

        </section>
    );
}
