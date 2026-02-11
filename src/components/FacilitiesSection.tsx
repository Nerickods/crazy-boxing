'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Datos de las instalaciones (Placeholders de alta calidad)
const facilities = [
    {
        id: 1,
        title: "OCTÁGONO PROFESIONAL",
        description: "Jaula de medidas oficiales para sparring y simulación de combate real.",
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&h=600&fit=crop&q=80",
        size: "large" // ocupa 2x2
    },
    {
        id: 2,
        title: "ZONA DE SACOS",
        description: "Sacos de agua, bananas y speed bags para perfeccionar tu striking.",
        image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&h=600&fit=crop&q=80",
        size: "tall" // ocupa 1x2
    },
    {
        id: 3,
        title: "TATAMI OLÍMPICO",
        description: "Superficie Dollamur de alta densidad para grappling y BJJ seguro.",
        image: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=800&h=600&fit=crop&q=80",
        size: "normal"
    },
    {
        id: 4,
        title: "ÁREA DE PESAS",
        description: "Equipamiento Rogue Fitness para acondicionamiento de fuerza explosiva.",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&q=80",
        size: "normal"
    },
    {
        id: 5,
        title: "ZONA CARDIO",
        description: "Assault bikes y remadoras para llevar tu resistencia al límite.",
        image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=600&fit=crop&q=80",
        size: "wide" // ocupa 2x1
    },
    {
        id: 6,
        title: "VESTIDORES PREMIUM",
        description: "Duchas privadas, lockers seguros y sauna de recuperación.",
        image: "https://images.unsplash.com/photo-1560233075-6c44937868c7?w=800&h=600&fit=crop&q=80",
        size: "normal"
    }
];

export default function FacilitiesSection() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const openLightbox = (index: number) => setSelectedImage(index);
    const closeLightbox = () => setSelectedImage(null);

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % facilities.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImage !== null) {
            setSelectedImage((selectedImage - 1 + facilities.length) % facilities.length);
        }
    };

    return (
        <section id="instalaciones" className="py-24 bg-black relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,215,0,0.15) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }}></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="text-[var(--accent)] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">
                        Donde se Forjan los Campeones
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                        NUESTRAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-sky-600">INSTALACIONES</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        Un espacio diseñado para la excelencia. Equipamiento de clase mundial para atletas que no aceptan excusas.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-4 max-w-7xl mx-auto">
                    {facilities.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => openLightbox(index)}
                            className={`group relative cursor-pointer overflow-hidden rounded-sm border border-gray-800 hover:border-[var(--accent)] transition-colors duration-500
                ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${item.size === 'tall' ? 'md:col-span-1 md:row-span-2' : ''}
                ${item.size === 'wide' ? 'md:col-span-2 md:row-span-1' : ''}
                ${item.size === 'normal' ? 'md:col-span-1 md:row-span-1' : ''}
              `}
                        >
                            {/* Image */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase leading-none">
                                        {item.title}
                                    </h3>
                                    <FaExpand className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="w-12 h-0.5 bg-[var(--accent)] mb-3 group-hover:w-full transition-all duration-700" />
                                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50"
                        >
                            <FaTimes size={32} />
                        </button>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 md:left-8 text-white/50 hover:text-[var(--accent)] transition-colors z-50 hidden md:block"
                        >
                            <FaChevronLeft size={48} />
                        </button>

                        <div
                            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={facilities[selectedImage].image}
                                alt={facilities[selectedImage].title}
                                className="max-h-[80vh] w-auto object-contain rounded-sm shadow-2xl border border-gray-800"
                            />

                            <div className="mt-6 text-center">
                                <h3 className="text-2xl font-black text-white uppercase mb-2">
                                    {facilities[selectedImage].title}
                                </h3>
                                <p className="text-gray-400">
                                    {facilities[selectedImage].description}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 md:right-8 text-white/50 hover:text-[var(--accent)] transition-colors z-50 hidden md:block"
                        >
                            <FaChevronRight size={48} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
