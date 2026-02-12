'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import UiverseButton from '@/shared/components/UiverseButton';

export default function PainToPowerStory() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
    };

    const scrollToForm = () => {
        document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-4xl mx-auto px-6 py-16 md:py-32">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 select-none">
                <img
                    src="/assets/backgrounds/transformation.png"
                    alt="Locker Room Focus"
                    className="w-full h-full object-cover opacity-60"
                />
                {/* Smart Gradient: Clear middle for the fighter, dark top/bottom for UI/Text */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

                {/* Enhanced Spotlight Accent (Subtle Gold Glow) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.15),transparent_70%)] blur-[80px]" />
            </div>

            <motion.div className="space-y-24 relative z-10">

                {/* BLOCK 1: THE PAIN */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="text-center md:text-left md:ml-0 md:mr-auto md:w-3/4"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                        DEJA DE SER UN ESPECTADOR <span className="text-white/30">Y RENACE EN VIDA CRAZY.</span>
                    </h2>
                    <div className="w-20 h-1 bg-[var(--accent)] mb-8 mx-auto md:mx-0" />

                    <h3 className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm mb-4">
                        La Pasividad Mata
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed">
                        Has pasado la vida en las gradas, viendo cómo otros toman acción, cómo otros se hacen fuertes.
                        Mientras tú sigues ahí, estancado, <strong className="text-white font-medium">vulnerable</strong>.
                        Esperando que el mundo sea amable contigo. Spoiler: No lo será.
                    </p>
                </motion.div>

                {/* BLOCK 2: THE AGITATION */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="text-center md:w-3/4 mx-auto"
                >
                    <div className="inline-block p-4 border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg mb-8">
                        <h3 className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm">
                            El Dolor de la Mediocridad
                        </h3>
                    </div>
                    <p className="text-base sm:text-lg md:text-2xl text-gray-300 leading-relaxed font-medium">
                        Tienes dos opciones: cerrar esta página y seguir siendo quien eres, con todas tus inseguridades intactas.
                        O venir a Crazy Boxing a matar a tu antiguo yo. <strong className="text-[var(--accent)] font-bold">Decide.</strong>
                    </p>
                </motion.div>

                {/* BLOCK 3: THE SOLUTION / IDENTITY */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="text-center md:text-right md:ml-auto md:mr-0 md:w-3/4"
                >
                    <h3 className="text-[var(--accent)] font-bold tracking-widest uppercase text-sm mb-4">
                        Tu Última Oportunidad
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-8">
                        En Crazy Boxing, hemos visto esta historia cientos de veces. Vemos llegar a personas con la mirada baja, convencidas de que su "fuego" se apagó para siempre.
                        <br /><br />
                        Y te seremos honestos: <strong className="text-white font-medium">antes de dedicarnos al boxeo, también sentíamos que el ejercicio era una obligación pesada</strong>, una tortura más en una vida gris.
                        <br /><br />
                        <strong className="text-[var(--accent)] font-bold">Hoy, hemos ayudado a más de 500 alumnos</strong> no solo a bajar de peso, sino a recuperar esa hambre de vivir, a caminar con una seguridad inquebrantable por la vida y a dormir como bebés tranquilos por las noches.
                    </p>
                </motion.div>

                {/* BLOCK 4: CTA (Simplified) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    className="flex justify-center flex-col items-center gap-6 mt-12"
                >
                    <h4 className="text-2xl md:text-4xl font-black text-white text-center">
                        No más excusas. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-sky-200">
                            .
                        </span>
                    </h4>

                    <div style={{ transform: "scale(1.2)" }} className="mt-8">
                        <UiverseButton
                            text="VISITA GRATUITA"
                            onClick={scrollToForm}
                        />
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
