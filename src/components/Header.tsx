'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaFistRaised } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { name: 'INICIO', id: 'inicio' },
    { name: 'MISIÓN', id: 'mision' },
    { name: 'PROGRAMA', id: 'programa' },
    { name: 'ENTRENADORES', id: 'entrenadores' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => scrollToSection('inicio')}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg bg-white/5 border border-white/10 group-hover:border-[var(--accent)]/50 transition-colors duration-500">
            <FaFistRaised className="text-white text-lg group-hover:text-[var(--accent)] transition-colors duration-500" />
            <div className="absolute inset-0 bg-[var(--accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-[0.2em] text-sm leading-none group-hover:text-[var(--accent)] transition-colors duration-500">
              CRAZY
            </span>
            <span className="text-white/50 font-bold tracking-[0.5em] text-[10px] leading-none group-hover:text-white transition-colors duration-500">
              BOXING
            </span>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="relative px-5 py-2 group overflow-hidden rounded-full"
            >
              <span className="relative z-10 text-xs font-bold text-white/70 tracking-widest group-hover:text-white transition-colors duration-300">
                {item.name}
              </span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>
          ))}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('formulario')}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-black text-xs font-black tracking-widest uppercase rounded-sm hover:bg-white transition-colors duration-300"
          >
            <span>Clase Gratis</span>
          </motion.button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white hover:text-[var(--accent)] transition-colors"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-0 top-[80px] bg-black z-40 overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 pb-20">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.id)}
                  className="text-3xl font-black text-white/50 hover:text-white tracking-tighter transition-colors"
                >
                  {item.name}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => scrollToSection('formulario')}
                className="mt-8 px-8 py-4 bg-[var(--accent)] text-black font-black tracking-widest uppercase rounded-sm"
              >
                RESERVAR CLASE
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}