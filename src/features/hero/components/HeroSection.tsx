'use client';

import { motion } from 'framer-motion';
import { useHeroAnimations } from '../hooks/useHeroAnimations';
import { heroCarouselRows, heroContent, disciplinesBannerText, handleImageError } from '../services/heroData';
import { HeroSectionProps } from '../types/hero';

export default function HeroSection({ onCtaClick, animationConfig }: HeroSectionProps) {
  const { animations } = useHeroAnimations(animationConfig);

  const scrollToForm = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      heroContent.cta.action();
    }
  };

  // Duplicate items for seamless loop
  const bannerItems = [...disciplinesBannerText, ...disciplinesBannerText, ...disciplinesBannerText];

  return (
    <section id="inicio" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black">

      {/* Carrusel de fotos de fondo */}
      <div className="absolute inset-0 z-0 flex flex-col">

        {/* Fila superior - Movimiento hacia la izquierda */}
        <div className="relative w-full h-[50dvh] overflow-hidden border-b border-[#D4AF37]/10">
          <motion.div
            className="flex gap-0 absolute top-0 left-0 h-full"
            animate={{ x: ["0%", "-33.33%"] }}
            transition={{
              duration: 45,
              ease: "linear",
              repeat: Infinity
            }}
            style={{ width: "300%", willChange: "transform" }}
          >
            {[...heroCarouselRows[0].images, ...heroCarouselRows[0].images, ...heroCarouselRows[0].images].map((image, index) => (
              <div key={`row1-${index}`} className="flex-shrink-0 h-full w-[33.33vw] min-w-[300px] relative border-r border-black/50">
                <img
                  src={image.src}
                  onError={(e) => handleImageError(e, image.fallback)}
                  alt={image.alt}
                  className="h-full w-full object-cover opacity-100 filter grayscale contrast-110 brightness-110 hover:brightness-125 transition-all duration-700 select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            ))}
          </motion.div>
          {/* Bottom gradient for smooth text readability */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Separator Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent z-10 hidden md:block"></div>

        {/* Fila inferior - Movimiento hacia la derecha */}
        <div className="relative w-full h-[50dvh] overflow-hidden border-t border-[#D4AF37]/10">
          <motion.div
            className="flex gap-0 absolute top-0 left-0 h-full"
            animate={{ x: ["-33.33%", "0%"] }}
            transition={{
              duration: 50,
              ease: "linear",
              repeat: Infinity
            }}
            style={{ width: "300%", willChange: "transform" }}
          >
            {[...heroCarouselRows[1].images, ...heroCarouselRows[1].images, ...heroCarouselRows[1].images].map((image, index) => (
              <div key={`row2-${index}`} className="flex-shrink-0 h-full w-[33.33vw] min-w-[300px] relative border-l border-black/50">
                <img
                  src={image.src}
                  onError={(e) => handleImageError(e, image.fallback)}
                  alt={image.alt}
                  className="h-full w-full object-cover opacity-100 filter grayscale contrast-110 brightness-110 hover:brightness-125 transition-all duration-700 select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            ))}
          </motion.div>
          {/* Top gradient for smooth text readability */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black via-transparent to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Contenido principal del hero - Add subtle background for text only */}
      <motion.div
        {...animations.fadeInUp()}
        className="container mx-auto px-4 md:px-6 py-24 text-center relative z-20 max-w-6xl"
      >
        <div className="relative">
          <motion.h1
            {...animations.titleAnimation()}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-white mb-4 md:mb-8 leading-[0.9] md:leading-none tracking-tighter"
            style={{
              textShadow: '0 0 40px rgba(0,0,0,0.8)'
            }}
          >
            {heroContent.title.main}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-red)] via-[var(--brand-yellow)] to-[var(--brand-red)] relative pb-2 inline-block">
              {heroContent.title.highlight}
            </span>
          </motion.h1>

          <motion.p
            {...animations.subtitleAnimation()}
            className="text-base sm:text-lg md:text-2xl text-gray-300 mb-8 md:mb-10 font-light max-w-3xl mx-auto leading-relaxed px-2"
          >
            {heroContent.subtitle.split('GRATIS').map((part, index, array) => (
              <span key={index}>
                {part}
                {index < array.length - 1 && (
                  <span className="text-[var(--brand-red)] font-bold">GRATIS</span>
                )}
              </span>
            ))}
          </motion.p>

          <motion.div
            {...animations.ctaAnimation()}
            className="mt-6 md:mt-12"
          >
            <motion.button
              onClick={scrollToForm}
              {...animations.buttonHover}
              className="cta-button text-base md:text-xl px-8 py-4 md:px-12 md:py-5 relative overflow-hidden group bg-[var(--brand-red)] text-black font-black tracking-wider uppercase w-full sm:w-auto rounded-none"
            >
              <span className="relative z-10">{heroContent.cta.text}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Banner de disciplinas corrido */}
      <div className="absolute bottom-0 left-0 w-full bg-[var(--brand-red)] py-2 md:py-3 overflow-hidden z-20 border-t-2 md:border-t-4 border-black">
        <motion.div
          className="whitespace-nowrap flex gap-4 md:gap-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity
          }}
          style={{ width: "fit-content", willChange: "transform" }}
        >
          {bannerItems.map((item, index) => (
            <span key={index} className="text-black font-black text-lg md:text-2xl tracking-widest uppercase flex items-center gap-4 md:gap-8">
              {item} <span className="text-black/30">•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}