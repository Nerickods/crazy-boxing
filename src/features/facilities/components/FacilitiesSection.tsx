'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Instagram, Facebook } from 'lucide-react';
import { cn, glass } from '@/shared/lib/utils';

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
        title: "OCTÁGONO PROFESIONAL",
        description: "El Epicentro de la Verdad.",
        details: "Jaula de medidas oficiales diseñada para simular las condiciones de combate de las ligas más importantes del mundo (UFC/PFL). Aquí no hay donde esconderse. Forjamos la distancia, el control de reja y la transición bajo fuego real.",
        gallery: ["/images/facilities/octagono/octagono-1.jpg"],
        category: "Combate"
    },
    {
        id: 2,
        title: "TATAMI OLÍMPICO",
        description: "Grappling sin límites.",
        details: "Superficie Dollamur de última generación con absorción de impacto biomecánica. El espacio sagrado para el Jiu Jitsu Brasileño y Lucha. Diseñado para sesiones de rolling intensas minimizando el riesgo de abrasión y lesiones articulares.",
        gallery: [
            "/images/facilities/tatami/tatami-1.jpg",
            "/images/facilities/tatami/tatami-2.jpg",
            "/images/facilities/tatami/tatami-3.jpg",
            "/images/facilities/tatami/tatami-4.jpg",
            "/images/facilities/tatami/tatami-5.jpg"
        ],
        category: "Técnica"
    },
    {
        id: 3,
        title: "ZONA DE STRIKING",
        description: "Poder y Precisión.",
        details: "Equipada con sacos de agua Aqua Training Bag para simular la densidad del cuerpo humano y bananas tailandesas para acondicionamiento de espinillas. Espacio optimizado para el footwork técnico y combinaciones de Muay Thai nivel élite.",
        gallery: ["/images/facilities/sacos/sacos-1.jpg"],
        category: "Striking"
    },
    {
        id: 4,
        title: "THE FORGE (PESAS)",
        description: "Fuerza Explosiva.",
        details: "Zona de preparación física con equipamiento Rogue Fitness. Kettlebells, racks de potencia y estaciones de acondicionamiento metabólico. Construimos el motor físico que respalda tu técnica marcial.",
        gallery: ["/images/facilities/pesas/pesas-1.jpg"],
        category: "Fuerza"
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

export default function FacilitiesSection() {
    const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isFullGalleryMode, setIsFullGalleryMode] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const overlayOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.4, 0.4, 1]);

    // Create a massive gallery of ~30 images (repeating existing ones for now as placeholders)
    const baseImages = facilities.flatMap(f => f.gallery);
    const fullGallery = [
        ...baseImages,
        ...baseImages,
        ...baseImages,
        ...baseImages
    ].slice(0, 30);

    const openLightbox = (index: number) => {
        setSelectedFacility(index);
        setCurrentImageIndex(0);
        setIsFullGalleryMode(false);
    };

    const openFullGallery = () => {
        setIsFullGalleryMode(true);
        setCurrentImageIndex(0);
        setSelectedFacility(0); // Dummy index to ensure modal opens, logic will check mode
    };

    const closeLightbox = () => {
        setSelectedFacility(null);
        setIsFullGalleryMode(false);
    };

    return (
        <section id="instalaciones" ref={containerRef} className="relative py-16 md:py-48 bg-black overflow-hidden">
            {/* Background Narrative Layer */}
            <div className="absolute inset-0 z-0">
                <picture>
                    <source srcSet="/assets/mobile/temple_mobile.png" media="(max-width: 768px)" />
                    <img
                        src="/assets/backgrounds/facilities.png"
                        alt="Blackbird House Facilities"
                        className="w-full h-full object-cover fixed-background"
                    />
                </picture>
                {/* Cinematic Overlay: Deep shadows with subtle golden bleed */}
                <motion.div
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/80 to-black z-10"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.9)_100%)] z-10 mix-blend-multiply" />
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
                            <span className="text-zinc-600 font-outline">DEL TRABAJO</span> <br />
                            SILENCIOSO
                        </h2>
                        <p className="text-zinc-400 text-xl md:text-2xl font-medium leading-relaxed max-w-xl mb-10">
                            En Blackbird House no vendemos membresías de gimnasio. Vendemos acceso al laboratorio donde tu debilidad es procesada y transformada en disciplina.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-zinc-800 relative group">
                            <img
                                src="/images/facilities/octagono/octagono-1.jpg"
                                alt="Main Facility Teaser"
                                className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-[var(--accent)] font-bold text-xs tracking-widest uppercase mb-2">En nuestro Octágono</p>
                                <h3 className="text-3xl font-black text-white uppercase italic leading-none mb-4">
                                    GANA TUS PROPIAS <br /> VICTORIAS EN LA JAULA
                                </h3>
                                <p className="text-zinc-300 text-sm font-medium leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    Para superar todos tus retos solo necesitarás activar el <span className="text-white font-bold">Modo Blackbird</span> dentro de estas paredes. Aquí se forjará tu carácter.
                                </p>
                            </div>
                        </div>
                        {/* Decorative background elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent)]/10 blur-[100px] z-0" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[var(--accent)]/10 blur-[100px] z-0" />
                    </motion.div>
                </div>

                {/* 2. THE VAULT (Interactive Gallery) */}
                <div className="relative">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
                                The Vault
                            </h3>
                            <div className="w-24 h-1 bg-[var(--accent)] mx-auto mb-6" />
                            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs md:text-sm mb-12">
                                Explora cada rincón de nuestra fortaleza
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
                                className="relative flex flex-col items-center gap-4 px-12 py-8 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[var(--accent)]/50 hover:bg-zinc-900/80 transition-all duration-500 group"
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
                <div className="max-w-6xl mx-auto mt-32">
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

                    <div className="grid md:grid-cols-3 gap-6">
                        {coaches.map((coach, index) => (
                            <motion.div
                                key={coach.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className={cn(
                                    glass.card,
                                    "group relative h-[400px] md:h-[450px] overflow-hidden rounded-sm bg-zinc-900 border-none block"
                                )}
                            >
                                {/* Image */}
                                <img
                                    src={coach.image}
                                    alt={coach.name}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 object-top"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
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
                                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
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
                </div>
            </div>

            {/* Lightbox Modal (Enhanced) */}
            <AnimatePresence>
                {selectedFacility !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center backdrop-blur-2xl"
                        onClick={closeLightbox}
                    >
                        <button className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-colors z-[110]">
                            <FaTimes size={40} />
                        </button>

                        <div className="w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" onClick={e => e.stopPropagation()}>
                            <div className="lg:col-span-8 relative">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="aspect-video relative overflow-hidden rounded-2xl border border-zinc-800"
                                >
                                    <img
                                        src={isFullGalleryMode ? fullGallery[currentImageIndex] : facilities[selectedFacility].gallery[currentImageIndex]}
                                        className="w-full h-full object-cover"
                                        alt=""
                                    />
                                </motion.div>

                                <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-4 pointer-events-none">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const total = isFullGalleryMode ? fullGallery.length : facilities[selectedFacility].gallery.length;
                                            setCurrentImageIndex(prev => (prev - 1 + total) % total)
                                        }}
                                        className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-[var(--accent)] hover:text-black transition-all pointer-events-auto shadow-2xl"
                                    >
                                        <FaChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const total = isFullGalleryMode ? fullGallery.length : facilities[selectedFacility].gallery.length;
                                            setCurrentImageIndex(prev => (prev + 1) % total)
                                        }}
                                        className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-[var(--accent)] hover:text-black transition-all pointer-events-auto shadow-2xl"
                                    >
                                        <FaChevronRight size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col justify-center">
                                {isFullGalleryMode ? (
                                    <>
                                        <span className="text-[var(--accent)] font-black tracking-[0.4em] text-xs uppercase mb-4 block">
                                            Galería Completa
                                        </span>
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                                            THE VAULT <span className="text-zinc-600">({currentImageIndex + 1}/{fullGallery.length})</span>
                                        </h3>
                                        <div className="w-20 h-1 bg-[var(--accent)] mb-8" />
                                        <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                                            {fullGallery.map((img, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentImageIndex(i)}
                                                    className={cn(
                                                        "w-16 h-12 object-cover rounded-sm border transition-all duration-300 overflow-hidden",
                                                        i === currentImageIndex ? "border-[var(--accent)] opacity-100" : "border-transparent opacity-40 hover:opacity-80"
                                                    )}
                                                >
                                                    <img src={img} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[var(--accent)] font-black tracking-[0.4em] text-xs uppercase mb-4 block">
                                            {facilities[selectedFacility].category}
                                        </span>
                                        <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                                            {facilities[selectedFacility].title}
                                        </h3>
                                        <div className="w-20 h-1 bg-[var(--accent)] mb-8" />
                                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-4">
                                            {facilities[selectedFacility].description}
                                        </p>
                                        <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                                            {facilities[selectedFacility].details}
                                        </p>

                                        {facilities[selectedFacility].gallery.length > 1 && (
                                            <div className="mt-8 flex gap-2">
                                                {facilities[selectedFacility].gallery.map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentImageIndex(i)}
                                                        className={cn(
                                                            "w-12 h-1 transition-all duration-300",
                                                            i === currentImageIndex ? "bg-[var(--accent)]" : "bg-zinc-800"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
