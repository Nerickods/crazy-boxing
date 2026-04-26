'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
    } else {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(`#${sectionId}`, {
          offset: -80,
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClose();
  };

  const navigationItems = [
    { label: 'EXPERIENCIA', id: 'experiencia', href: '/#experiencia' },
    { label: 'INSTALACIONES', id: 'instalaciones', href: '/instalaciones' },
    { label: 'MISIÓN', id: 'mision', href: '/mision' },
    { label: 'FAQ', id: 'faq', href: '/#faq' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-[420px] bg-black/95 backdrop-blur-3xl border-l border-white/10 z-[70] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Background Decor */}
            <div
              className="absolute inset-x-[-30%] top-[-15%] h-full opacity-100 pointer-events-none z-[1]"
              style={{
                background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, transparent 85%)',
              }}
            />
            
            {/* Header */}
            <div className="flex items-center justify-between p-7 border-b border-white/5 relative z-10">
              <span className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">Navegación</span>
              <button
                onClick={onClose}
                className="size-11 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/5"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 p-8 md:p-12 flex flex-col gap-10 z-10">
              <div className="space-y-6">
                {navigationItems.map((link, idx) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    {link.href.startsWith('/#') ? (
                      <button
                        onClick={() => scrollToSection(link.id)}
                        className="w-full flex items-center justify-between group py-2"
                      >
                        <span className="text-3xl font-black text-white group-hover:text-[var(--accent)] transition-all duration-300 group-hover:translate-x-2">
                          {link.label}
                        </span>
                        <ArrowRight className="size-6 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="w-full flex items-center justify-between group py-2"
                      >
                        <span className="text-3xl font-black text-white group-hover:text-[var(--accent)] transition-all duration-300 group-hover:translate-x-2">
                          {link.label}
                        </span>
                        <ArrowRight className="size-6 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA Area */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto items-center pt-8 border-t border-white/5 flex flex-col gap-6"
              >
                <button
                  onClick={() => scrollToSection('formulario')}
                  className="w-full py-4 bg-[var(--accent)] text-black font-black tracking-widest uppercase rounded-sm hover:bg-white transition-colors duration-300"
                >
                  RESERVAR CLASE
                </button>
                <div className="flex flex-col items-center gap-2 mt-4">
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.3em] text-center">
                    CRAZY BOXING
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
