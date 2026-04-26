'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFistRaised } from 'react-icons/fa';
import { Menu } from "lucide-react";
import { NavigationDrawer } from './NavigationDrawer';
import { useChatStore } from '@/features/chat/store/chatStore';
import { PulsingOrb } from './PulsingOrb';

export default function Header() {
  const { 
    isOpen, 
    setOpen, 
    isMinimized, 
    toggleMinimized, 
    hasMorphedToHeader
  } = useChatStore();
  
  const [isNavDrawerOpen, setNavDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isMounted) return null;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transform-gpu transition-[background-color,backdrop-filter,-webkit-backdrop-filter,border-color,opacity,box-shadow] duration-500 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-md border-b border-white/5 h-16'
            : 'bg-transparent border-transparent h-24'
        }`}
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full grid grid-cols-[1fr_auto_1fr] items-center">
          
          {/* LEFT ZONE: Chatbot Orb */}
          <div className="flex items-center gap-2 md:gap-3">
            <motion.div
              onClick={() => {
                if (hasMorphedToHeader) {
                  if (!isOpen) {
                    if (isMinimized) toggleMinimized();
                    setOpen(true);
                  } else {
                    setOpen(false);
                  }
                }
              }}
              className={`relative rounded-xl border border-white/10 group cursor-pointer hover:border-white/30 transition-all duration-500 flex items-center justify-center ${
                hasMorphedToHeader ? '' : 'overflow-hidden'
              } ${isScrolled ? 'size-[40px] md:size-[44px]' : 'size-[50px] md:size-[56px]'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {!hasMorphedToHeader ? (
                  <motion.div 
                    key="initial-state"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="w-full h-full flex items-center justify-center bg-white/5"
                  >
                     <PulsingOrb isOpen={isOpen} size={isScrolled ? 36 : 44} showText={false} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="morphed-orb"
                    initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <PulsingOrb isOpen={isOpen} size={isScrolled ? 36 : 44} showText={false} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* CENTER ZONE: Logo */}
          <div className="flex justify-center items-center">
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
          </div>

          {/* RIGHT ZONE: Menu */}
          <div className="flex items-center justify-end">
            <button 
              onClick={() => setNavDrawerOpen(true)}
              className="flex items-center gap-3 group cursor-pointer py-1.5 px-3 rounded-full hover:bg-white/5 transition-all duration-300"
            >
               <div className="size-9 md:size-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[var(--accent)]/50 transition-all duration-300 group-hover:scale-110 active:scale-95 overflow-hidden">
                  <Menu className="size-4 md:size-5 text-white" />
               </div>
            </button>
          </div>

        </div>
      </header>

      <NavigationDrawer 
        isOpen={isNavDrawerOpen} 
        onClose={() => setNavDrawerOpen(false)} 
      />
    </>
  );
}