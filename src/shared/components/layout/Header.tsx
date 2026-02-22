'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaFistRaised } from 'react-icons/fa';
import UiverseButton from '@/shared/components/UiverseButton';
import { scrollToElement } from '@/shared/utils/scrollToElement';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      // If we are not on the home page, we need to go to the home page with the hash
      router.push(`/#${sectionId}`);
    } else {
      // Access the global lenis instance if available
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(`#${sectionId}`, {
          offset: -80, // Space for the floating header
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        // Fallback to utility or native if lenis is not ready
        scrollToElement(sectionId);
      }
    }
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { name: 'EXPERIENCIA', id: 'experiencia', href: '/#experiencia' },
    { name: 'INSTALACIONES', id: 'instalaciones', href: '/instalaciones' },
    { name: 'MISIÓN', id: 'mision', href: '/mision' },
    { name: 'FAQ', id: 'faq', href: '/#faq' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'glass-panel py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
        : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => scrollToSection('inicio')}
          className="cursor-pointer flex items-center gap-4 group"
        >
          <div className="relative w-14 h-14 flex items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-white/10 group-hover:border-sky-500/50 transition-colors duration-500 shadow-[0_0_0_0_rgba(14,165,233,0)] group-hover:shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)]">
            <img
              src="/assets/logo.png"
              alt="Crazy Boxing Logo"
              className="w-full h-full object-contain p-1"
            />
            <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-[0.2em] text-lg leading-none group-hover:text-sky-400 transition-colors duration-500">
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
            item.href.startsWith('/#') ? (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-5 py-2 group overflow-hidden rounded-full"
              >
                <span className="relative z-10 text-xs font-bold text-white/70 tracking-widest group-hover:text-white transition-colors duration-300">
                  {item.name}
                </span>
                <div className="absolute inset-0 bg-sky-500/10 border border-sky-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full backdrop-blur-md shadow-[0_0_15px_-5px_rgba(14,165,233,0.3)]" />
              </button>
            ) : (
              <Link
                key={item.id}
                href={item.href}
                className="relative px-5 py-2 group overflow-hidden rounded-full"
              >
                <span className="relative z-10 text-xs font-bold text-white/70 tracking-widest group-hover:text-white transition-colors duration-300">
                  {item.name}
                </span>
                <div className="absolute inset-0 bg-sky-500/10 border border-sky-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full backdrop-blur-md shadow-[0_0_15px_-5px_rgba(14,165,233,0.3)]" />
              </Link>
            )
          ))}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-6">
          <div className="hidden md:block scale-75 origin-right">
            <UiverseButton
              text="VISITA GRATIS"
              onClick={() => scrollToSection('formulario')}
              style={{
                '--width': '220px',
                '--height': '55px',
                '--btn-font-size': '14px'
              } as React.CSSProperties}
            />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white hover:text-sky-400 transition-colors"
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
                item.href.startsWith('/#') ? (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(item.id)}
                    className="text-3xl font-black text-white/50 hover:text-sky-400 tracking-tighter transition-colors"
                  >
                    {item.name}
                  </motion.button>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl font-black text-white/50 hover:text-sky-400 tracking-tighter transition-colors"
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                )
              ))}
              <div className="mt-8">
                <UiverseButton
                  text="RESERVAR CLASE"
                  onClick={() => scrollToSection('formulario')}
                  style={{ '--width': '280px', '--height': '70px', '--btn-font-size': '18px' } as React.CSSProperties}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}