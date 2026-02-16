'use client';


import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight, FaClock, FaFistRaised, FaPlay, FaCamera, FaVideo } from 'react-icons/fa';
import { Instagram, Facebook } from 'lucide-react';
import { cn, glass } from '@/shared/lib/utils';
import { GymHour } from '@/features/facilities/services/hoursService';
import { GalleryImage } from '@/features/facilities/types/gallery';
import { useSnapCarousel } from '@/shared/hooks/use-snap-carousel';

interface Facility {
    id: number;
    title: string;
    description: string;
    details: string;
    gallery: string[];
    category: string;
}

const facilities: Facility[] = [
    {
        id: 1,
        title: "RING PROFESIONAL",
        description: "Adrenalina y Seguridad.",
        details: "Para que sientas la adrenalina de los profesionales, incluso si es tu primer día (seguridad total con suelo acolchado).",
        gallery: ["/images/facilities/octagono/octagono-1.jpg"],
        category: "Competición"
    },
    {
        id: 2,
        title: "ZONA HEAVY BAG",
        description: "Impacto Premium.",
        details: "Material que absorbe el impacto para proteger tus muñecas y articulaciones mientras descargas todo el estrés del día.",
        gallery: ["/images/facilities/sacos/sacos-1.jpg"],
        category: "Stess Relief"
    },
    {
        id: 3,
        title: "HIGIENE IMPECABLE",
        description: "Suda Sin Riesgos.",
        details: "Limpiamos y desinfectamos el material después de cada sesión. Aquí vienes a sudar, no a compartir gérmenes.",
        gallery: ["/images/facilities/tatami/tatami-1.jpg"],
        category: "Salud"
    },
    {
        id: 4,
        title: "CLIMATIZACIÓN",
        description: "Aire Puro.",
        details: "Entrena duro sin sentir que te falta el aire. Sistema de ventilación avanzado para mantener el oxígeno fluyendo.",
        gallery: ["/images/facilities/pesas/pesas-1.jpg"],
        category: "Confort"
    }
];

const coaches = [
    {
        id: 1,
        name: "CARLOS MENDEZ",
        role: "HEAD COACH",
        image: "/images/trainer_carlos.png",
        record: "42-0",
        social: { instagram: "#", facebook: "#" }
    },
    {
        id: 2,
        name: "ANA RODRIGUEZ",
        role: "BJJ BLACK BELT",
        image: "/images/trainer_ana.png",
        record: "200+ SUBS",
        social: { instagram: "#", facebook: "#" }
    },
    {
        id: 3,
        name: "MIGUEL TORRES",
        role: "BOXING ELITE",
        image: "/images/trainer_miguel.png",
        record: "18 CHAMPS",
        social: { instagram: "#", facebook: "#" }
    }
];

interface FacilitiesSectionProps {
    gymHours: GymHour[];
    galleryImages?: GalleryImage[];
}

export default function FacilitiesSection({ gymHours, galleryImages = [] }: FacilitiesSectionProps) {
    const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isFullGalleryMode, setIsFullGalleryMode] = useState(false);
    const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
    const containerRef = useRef<HTMLElement>(null);

    // Mobile Carousel Logic
    const { scrollRef, activeIndex, scrollTo } = useSnapCarousel();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const overlayOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.4, 0.4, 1]);

    // Use dynamic gallery from Supabase, fallback to static placeholders
    type GalleryItem = { url: string; media_type: 'image' | 'video' };
    const dynamicGallery: GalleryItem[] = galleryImages.map(img => ({
        url: img.public_url,
        media_type: img.media_type ?? 'image',
    }));
    const baseImages = facilities.flatMap(f => f.gallery);
    const fallbackGallery: GalleryItem[] = [...baseImages, ...baseImages, ...baseImages, ...baseImages]
        .slice(0, 30)
        .map(url => ({ url, media_type: 'image' as const }));
    const fullGallery = dynamicGallery.length > 0 ? dynamicGallery : fallbackGallery;

    const filteredGallery = useMemo(() => {
        if (mediaFilter === 'all') return fullGallery;
        return fullGallery.filter(item => item.media_type === mediaFilter);
    }, [fullGallery, mediaFilter]);

    const videoCount = useMemo(() => fullGallery.filter(i => i.media_type === 'video').length, [fullGallery]);
    const imageCount = useMemo(() => fullGallery.filter(i => i.media_type === 'image').length, [fullGallery]);

    const openLightbox = (index: number) => {
        setSelectedFacility(index);
        setCurrentImageIndex(0);
        setIsFullGalleryMode(false);
    };

    const openFullGallery = () => {
        setIsFullGalleryMode(true);
        setCurrentImageIndex(0);
        setMediaFilter('all');
        setSelectedFacility(0);
    };

    const closeLightbox = () => {
        setSelectedFacility(null);
        setIsFullGalleryMode(false);
        setMediaFilter('all');
    };

    return (
        <section id="instalaciones" ref={containerRef} className="relative py-16 md:py-48 bg-black overflow-hidden">
            {/* Background Narrative Layer */}
            <div className="absolute inset-0 z-0">
                <picture>
                    <source srcSet="/assets/sections/facilities-desktop.png" media="(max-width: 768px)" />
                    <img
                        src="/assets/sections/facilities-desktop.png"
                        alt="Blackbird House Facilities"
                        className="w-full h-full object-cover fixed-background"
                    />
                </picture>
                {/* Cinematic Overlay: Deep shadows with subtle golden bleed */}
                <motion.div
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/80 to-black z-10"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)] z-10 mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-6 relative z-20">
                {/* 1. EL MANIFESTO (Split View) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center mb-24 md:mb-40">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[var(--accent)] font-black tracking-[0.4em] text-sm uppercase mb-6 block">
                            Infraestructura de Guerra
                        </span>
                        <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 uppercase">
                            EL TEMPLO <br />
                            <span className="text-cyan-400 font-outline">DEL TRABAJO</span> <br />
                            SILENCIOSO
                        </h2>
                        <p className="text-zinc-400 text-xl md:text-2xl font-medium leading-relaxed max-w-xl mb-10">
                            Olvídate de los gimnasios oscuros, sucios y con mal ambiente. En Crazy Boxing hemos creado un santuario para el deporte:
                        </p>

                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                                <div>
                                    <strong className="text-white block mb-1">Ring Profesional de Competición:</strong>
                                    <span className="text-zinc-400 text-sm leading-relaxed">Para que sientas la adrenalina de los profesionales, incluso si es tu primer día (seguridad total con suelo acolchado).</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                                <div>
                                    <strong className="text-white block mb-1">Zona de Sacos "Heavy Bag" Premium:</strong>
                                    <span className="text-zinc-400 text-sm leading-relaxed">Material que absorbe el impacto para proteger tus muñecas y articulaciones mientras descargas todo el estrés del día.</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                                <div>
                                    <strong className="text-white block mb-1">Higiene Impecable:</strong>
                                    <span className="text-zinc-400 text-sm leading-relaxed">Limpiamos y desinfectamos el material después de cada sesión. Aquí vienes a sudar, no a compartir gérmenes.</span>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                                <div>
                                    <strong className="text-white block mb-1">Ventilación y Climatización:</strong>
                                    <span className="text-zinc-400 text-sm leading-relaxed">Entrena duro sin sentir que te falta el aire.</span>
                                </div>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        id="horarios-card"
                        className="relative scroll-mt-32"
                    >
                        {/* Decorative Elements */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-purple-600 rounded-3xl blur opacity-20 animate-pulse" />

                        <div className="relative bg-sky-950/30 backdrop-blur-md border border-sky-500/20 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_-10px_rgba(14,165,233,0.2)] h-full flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                                <div className="text-center w-full">
                                    <h3 className="text-2xl font-black text-white uppercase italic text-pretty">TU EXCUSA DE "NO TENGO TIEMPO" MUERE AQUÍ</h3>
                                    <p className="text-sm text-gray-400 mt-2">Mañanas para despertar al guerrero. Tardes para matar el estrés.</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                                    <FaClock size={24} />
                                </div>
                            </div>

                            <div className="space-y-6 flex-grow">
                                {gymHours.map((hour) => (
                                    <div key={hour.id} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {hour.label}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold uppercase tracking-wider mb-1">{hour.title}</h4>
                                            <div className="space-y-1">
                                                {hour.schedule.map((time, idx) => (
                                                    <p key={idx} className="text-[var(--accent)] font-mono text-lg font-bold">
                                                        {time}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/10">
                                <button
                                    onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full bg-[var(--accent)] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] flex items-center justify-center gap-2 group"
                                >
                                    Agendar Clase de Prueba
                                    <FaFistRaised className="group-hover:rotate-12 transition-transform" />
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-4">
                                    * La primera clase es cortesía de la casa.
                                </p>
                            </div>
                        </div>

                        {/* Ambient Glows */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent)]/10 blur-[100px] z-0" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--accent)]/10 blur-[100px] z-0" />
                    </motion.div>
                </div>



                {/* 2. THE VAULT (Interactive Gallery) */}
                <div className="relative">
                    {/* SUPER HIGH ANCHOR for Navigation */}
                    <div id="battleground" className="absolute -top-64 left-0 w-full h-1 pointer-events-none scroll-mt-[300px]" />
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
                                THE BATTLEGROUND
                            </h3>
                            <div className="w-24 h-1 bg-[var(--accent)] mx-auto mb-6" />
                            <p className="text-cyan-400 font-black uppercase tracking-[0.3em] text-xs md:text-sm mb-12 drop-shadow-[0_0_15px_rgba(37,99,235,0.9)]">
                                Donde las excusas vienen a morir
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            {/* Premium Button Aura */}
                            <div className="absolute -inset-4 bg-[var(--accent)]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <button
                                onClick={openFullGallery}
                                className="relative flex flex-col items-center gap-4 px-12 py-8 bg-sky-900/20 backdrop-blur-sm border border-sky-500/20 rounded-2xl hover:border-sky-400 hover:bg-sky-900/40 transition-all duration-500 group shadow-[0_0_30px_-5px_rgba(14,165,233,0.1)]"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[var(--accent)] group-hover:scale-110 transition-all duration-500">
                                    <FaExpand className="text-white group-hover:text-black transition-colors text-xl" />
                                </div>
                                <div className="text-center">
                                    <span className="block text-white font-black text-2xl uppercase tracking-tighter mb-1">
                                        Explorar Galería
                                    </span>
                                    <span className="text-zinc-500 group-hover:text-[var(--accent)] font-bold uppercase tracking-widest text-[10px] transition-colors">
                                        30+ Fotografías HD
                                    </span>
                                </div>
                            </button>
                        </motion.div>
                    </div>

                </div>

                {/* 3. THE SQUAD (TEAM) */}
                <div id="mentores" className="max-w-6xl mx-auto mt-32 scroll-mt-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-1 h-12 bg-[var(--accent)]" />
                        <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                                El Escuadrón
                            </h3>
                            <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase">
                                Mentores de Élite
                            </p>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide"
                    >
                        {coaches.map((coach, index) => (
                            <motion.div
                                key={coach.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={cn(
                                    glass.card,
                                    "group relative aspect-[3/4] overflow-hidden rounded-sm bg-zinc-900 border-none block w-[280px] min-w-[280px] md:w-auto md:min-w-0 snap-center shrink-0"
                                )}
                            >
                                {/* Image */}
                                <img
                                    src={coach.image}
                                    alt={coach.name}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    style={{ objectPosition: 'center 20%' }}
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <div className="transform translate-y-0 md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="inline-block px-2 py-1 bg-[var(--accent)] text-black text-xs font-black uppercase mb-3">
                                            {coach.record}
                                        </div>
                                        <h4 className="text-2xl font-black text-white italic uppercase mb-1 leading-none">
                                            {coach.name}
                                        </h4>
                                        <p className="text-[var(--accent)] text-xs font-bold tracking-widest uppercase mb-4">
                                            {coach.role}
                                        </p>

                                        {/* Socials (Reveal on Hover) */}
                                        <div className="flex gap-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            <a href={coach.social.instagram} className="text-white hover:text-[var(--accent)] transition-colors">
                                                <Instagram size={20} />
                                            </a>
                                            <a href={coach.social.facebook} className="text-white hover:text-[var(--accent)] transition-colors">
                                                <Facebook size={20} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mobile Scroll Indicators */}
                    <div className="flex justify-center gap-2 mb-8 md:hidden">
                        {coaches.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    activeIndex === i ? "w-8 bg-[var(--accent)]" : "w-1.5 bg-white/20"
                                )}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox Modal (Mobile-Optimized) */}
            <AnimatePresence>
                {selectedFacility !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col"
                    >
                        {/* Top Bar — Close + Counter */}
                        <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-5 shrink-0 bg-black/80 backdrop-blur-sm border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="text-[var(--accent)] font-black tracking-[0.3em] text-[10px] md:text-xs uppercase">
                                    {isFullGalleryMode ? 'Galería' : facilities[selectedFacility].category}
                                </span>
                                {isFullGalleryMode && (
                                    <span className="text-zinc-500 text-xs font-mono">
                                        {currentImageIndex + 1} / {filteredGallery.length}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={closeLightbox}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                                aria-label="Cerrar galería"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Media Filter Tabs (only in full gallery mode) */}
                        {isFullGalleryMode && (
                            <div className="flex items-center justify-center gap-2 px-4 py-3 shrink-0 bg-black/60">
                                {[
                                    { key: 'all' as const, label: 'TODO', icon: FaExpand, count: fullGallery.length },
                                    { key: 'image' as const, label: 'FOTOS', icon: FaCamera, count: imageCount },
                                    { key: 'video' as const, label: 'VIDEOS', icon: FaVideo, count: videoCount },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            setMediaFilter(tab.key);
                                            setCurrentImageIndex(0);
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all",
                                            mediaFilter === tab.key
                                                ? "bg-[var(--accent)] text-black"
                                                : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10"
                                        )}
                                    >
                                        <tab.icon size={12} />
                                        {tab.label}
                                        <span className={cn(
                                            "text-[10px] font-mono",
                                            mediaFilter === tab.key ? "text-black/60" : "text-zinc-600"
                                        )}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Media Area */}
                        <div className="flex-1 flex items-center justify-center relative min-h-0 px-2 md:px-12">
                            {filteredGallery.length > 0 ? (
                                <>
                                    <motion.div
                                        key={`${mediaFilter}-${currentImageIndex}`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className={cn(
                                            "relative overflow-hidden rounded-xl md:rounded-2xl flex items-center justify-center bg-zinc-950 max-w-5xl w-full mx-auto group/media",
                                            (() => {
                                                const currentMedia = isFullGalleryMode
                                                    ? filteredGallery[currentImageIndex]
                                                    : { url: '', media_type: 'image' as const };
                                                return currentMedia?.media_type === 'video' ? 'max-h-[60vh] md:max-h-[70vh]' : 'aspect-video max-h-[60vh] md:max-h-[70vh]';
                                            })()
                                        )}
                                    >
                                        {/* Overlay Expand Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const container = e.currentTarget.parentElement;
                                                const video = container?.querySelector('video');
                                                const videoEl = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };

                                                if (videoEl && videoEl.webkitEnterFullscreen) {
                                                    videoEl.webkitEnterFullscreen();
                                                } else if (container) {
                                                    if (!document.fullscreenElement) {
                                                        container.requestFullscreen().catch(err => {
                                                            console.warn("Fullscreen request failed", err);
                                                            // Fallback for iOS Safari which doesn't support requestFullscreen on divs
                                                            // We could toggle a "fullscreen" class here if needed, but the lightbox is already pretty big.
                                                        });
                                                    } else {
                                                        document.exitFullscreen();
                                                    }
                                                }
                                            }}
                                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/media:opacity-100 transition-opacity duration-200 hover:bg-[var(--accent)] hover:text-black"
                                            aria-label="Pantalla completa"
                                        >
                                            <FaExpand size={16} />
                                        </button>

                                        {(() => {
                                            const currentMedia = isFullGalleryMode
                                                ? filteredGallery[currentImageIndex]
                                                : { url: facilities[selectedFacility].gallery[currentImageIndex], media_type: 'image' as const };

                                            if (!currentMedia) return null;

                                            return currentMedia.media_type === 'video' ? (
                                                <video
                                                    key={`video-${currentImageIndex}`}
                                                    src={`${currentMedia.url}#t=0.5`}
                                                    controls
                                                    playsInline
                                                    preload="metadata"
                                                    className="max-w-full max-h-[60vh] md:max-h-[70vh] object-contain"
                                                />
                                            ) : (
                                                <img
                                                    src={currentMedia.url}
                                                    className="w-full h-full object-contain"
                                                    alt=""
                                                    loading="lazy"
                                                />
                                            );
                                        })()}
                                    </motion.div>

                                    {/* Navigation Arrows */}
                                    {filteredGallery.length > 1 && (
                                        <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-1 md:px-4 pointer-events-none">
                                            <button
                                                onClick={() => setCurrentImageIndex(prev => (prev - 1 + filteredGallery.length) % filteredGallery.length)}
                                                className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-[var(--accent)] hover:text-black transition-all pointer-events-auto active:scale-90"
                                            >
                                                <FaChevronLeft size={18} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentImageIndex(prev => (prev + 1) % filteredGallery.length)}
                                                className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-[var(--accent)] hover:text-black transition-all pointer-events-auto active:scale-90"
                                            >
                                                <FaChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center text-zinc-500">
                                    <p className="text-lg font-bold">No hay contenido en esta categoría</p>
                                </div>
                            )}
                        </div>

                        {/* Bottom Thumbnail Strip */}
                        {isFullGalleryMode && filteredGallery.length > 1 && (
                            <div className="shrink-0 px-4 py-3 md:py-4 bg-black/80 backdrop-blur-sm border-t border-white/5">
                                <div className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide max-w-5xl mx-auto pb-1">
                                    {filteredGallery.map((item, i) => (
                                        <button
                                            key={`thumb-${mediaFilter}-${i}`}
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={cn(
                                                "w-14 h-10 md:w-16 md:h-12 rounded-md border-2 transition-all duration-200 overflow-hidden relative shrink-0",
                                                i === currentImageIndex
                                                    ? "border-[var(--accent)] opacity-100 ring-1 ring-[var(--accent)]/50"
                                                    : "border-transparent opacity-40 hover:opacity-80"
                                            )}
                                        >
                                            {item.media_type === 'video' ? (
                                                <>
                                                    <video src={`${item.url}#t=0.5`} className="w-full h-full object-cover" muted preload="metadata" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                        <FaPlay className="text-white text-[8px]" />
                                                    </div>
                                                </>
                                            ) : (
                                                <img src={item.url} className="w-full h-full object-cover" alt="" loading="lazy" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Facility Detail (non-gallery mode) */}
                        {!isFullGalleryMode && selectedFacility !== null && (
                            <div className="shrink-0 px-6 py-4 md:py-6 bg-black/80 backdrop-blur-sm border-t border-white/5">
                                <div className="max-w-2xl mx-auto text-center">
                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-2">
                                        {facilities[selectedFacility].title}
                                    </h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {facilities[selectedFacility].details}
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </section >
    );
}
