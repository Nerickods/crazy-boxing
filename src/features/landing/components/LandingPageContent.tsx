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
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-3 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-full px-6 py-3 mb-8">
                                <span className="text-[var(--accent)] font-bold tracking-wide">COMENZAR HOY</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">
                                Tu <span className="text-[var(--accent)] font-outline">primera visita</span> <br />
                                corre por Crazy Boxing
                            </h2>
                            <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                                Domina el miedo. Supera tus límites.
                                <span className="text-[var(--accent)] font-bold block mt-2 underline decoration-[var(--accent)]/30 underline-offset-8">Reserva tu lugar ahora y forja tu propia historia.</span>
                            </p>
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
