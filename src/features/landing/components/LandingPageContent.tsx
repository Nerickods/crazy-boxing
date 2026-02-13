'use client';

import { motion } from 'framer-motion';
import Header from "@/shared/components/layout/Header";
import HeroDoubleCarousel from "@/features/hero/components/HeroDoubleCarousel";
import FacilitiesSection from "@/features/facilities/components/FacilitiesSection";
import MissionSection from "@/features/mission/components/MissionSection";
import TrainingProgramSection from "@/features/training/components/TrainingProgramSection";
import WhyAndTeam from "@/features/experience/components/WhyAndTeam";
import FAQSection from "@/features/faq/components/FAQSection";
import EnrollForm from "@/features/enrollment/components/EnrollForm";
import Footer from "@/shared/components/layout/Footer";
import TransformationSection from "@/features/transformation/components/TransformationSection";
import EssenceSection from "@/features/essence/components/EssenceSection";
import PlansSection from "@/features/plans/components/PlansSection";


import { GymHour } from "@/features/facilities/services/hoursService";

interface LandingPageProps {
    gymHours: GymHour[];
}

export default function LandingPageContent({ gymHours }: LandingPageProps) {
    return (
        <div className="min-h-screen font-['Poppins'] bg-[var(--background)] text-[var(--foreground)]">
            <Header />

            <main>
                {/* 1. INICIO - Hero Section Dual Infinite Carousel (Black & White Luxury) */}
                <HeroDoubleCarousel />

                {/* 3. PROGRAMA DE ENTRENAMIENTO - Unified Disciplines & Schedule */}
                <TrainingProgramSection />

                {/* 1.2 ESENCIA - Crazy Boxing Code (Interactive) */}
                <EssenceSection />

                {/* 1.5 TRANSFORMACIÓN - Pain vs Pleasure Narrative */}
                <TransformationSection />

                {/* 5. EXPERIENCIA & TEAM - Unified Section */}
                <WhyAndTeam />

                {/* 2. INSTALACIONES - Bento Grid con Lightbox */}
                <FacilitiesSection gymHours={gymHours} />

                {/* 4. PLANES - Pricing */}
                <PlansSection />

                {/* 2. MISIÓN - Rediseñada con esencia ACE */}
                <MissionSection />

                {/* 7. FAQ - Preguntas que separan campeones de víctimas */}
                <FAQSection />

                {/* 8. FORMULARIO - Optimizado con fondo de Vestidor */}
                <section id="formulario" className="relative py-24 md:py-40 overflow-hidden">
                    {/* Vestidor Background with Parallax/Fade */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/assets/vestidor.jpg"
                            alt="Vestidor Crazy Boxing"
                            className="w-full h-full object-cover opacity-50"
                        />
                        {/* Smooth Transition from FAQ (Top) and towards Footer (Bottom) */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}

                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight uppercase tracking-tighter">
                                TU TRANSFORMACIÓN EMPIEZA <br />
                                <span className="text-[var(--accent)]">CUANDO TÚ DECIDES.</span>
                            </h2>
                            <h3 className="text-xl md:text-2xl font-bold text-white/90 mb-6 tracking-wide">
                                Sin llamadas molestas. Sin esperas.
                            </h3>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed font-medium mb-8">
                                Obtén tu <strong className="text-white">CÓDIGO DE ACCESO INMEDIATO</strong> ahora mismo. <br className="hidden md:block" />
                                Rellena tus datos, genera tu pase en pantalla y preséntalo en la recepción el día que elijas.
                            </p>

                            {/* Warning Box */}
                            <div className="max-w-2xl mx-auto bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 text-left relative overflow-hidden group hover:border-amber-500/40 transition-colors">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative flex items-start gap-4">
                                    <span className="text-3xl animate-pulse">⚠️</span>
                                    <div>
                                        <h4 className="text-amber-400 font-black uppercase tracking-wider text-sm mb-2">DISPONIBILIDAD EN TIEMPO REAL:</h4>
                                        <div className="text-amber-100/90 text-sm space-y-2">
                                            <p><strong className="text-white">La alta demanda de las tardes suele llenar los cupos rápido.</strong></p>
                                            <p>El formulario de abajo se bloqueará automáticamente cuando se alcance el limite máximo de las plazas.</p>
                                            <p className="font-bold text-white pt-1">Si puedes ver el botón de "Generar Código", aprovecha tu oportunidad.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="max-w-2xl mx-auto"
                        >
                            <EnrollForm />
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* 8. FOOTER */}
            <Footer />
        </div>
    );
}
