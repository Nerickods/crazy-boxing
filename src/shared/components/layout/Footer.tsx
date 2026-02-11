'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp, FaArrowUp } from 'react-icons/fa';

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Inverted Parallax for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={containerRef} className="relative bg-black/40 border-t border-white/10 pt-32 pb-10 overflow-hidden backdrop-blur-sm">
      {/* Octagon Final Background with Inverted Parallax */}
      <motion.div
        className="absolute inset-0 z-0 opacity-40"
        style={{ y: backgroundY }}
      >
        <img
          src="/assets/octagono-final.jpg"
          alt="El Legado Final"
          className="w-full h-full object-cover"
        />
        {/* Superior Fade and Solid Bottom Transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">

          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-white/5 p-2 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                <img
                  src="/assets/logo.png"
                  alt="Crazy Boxing Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tighter">
                CRAZY<span className="text-[var(--accent)] font-outline">BOXING</span>
              </h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
              Forjando guerreros desde 2024. Más que un gimnasio, somos una hermandad dedicada a la excelencia marcial y el desarrollo personal.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/crazyboxing_mma/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black hover:scale-110 hover:brightness-125 transition-all duration-300 border border-white/5"
                title="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/CrazyBoxingMMA/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black hover:scale-110 hover:brightness-125 transition-all duration-300 border border-white/5"
                title="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://youtube.com/@crazyboxing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black hover:scale-110 hover:brightness-125 transition-all duration-300 border border-white/5"
                title="YouTube"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Explorar</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li key="Inicio">
                  <button onClick={scrollToTop} className="hover:text-white hover:brightness-150 hover:pl-2 transition-all duration-300">
                    Inicio
                  </button>
                </li>
                <li key="Disciplinas">
                  <a href="#programa" className="hover:text-white hover:brightness-150 hover:pl-2 transition-all duration-300">
                    Disciplinas
                  </a>
                </li>
                <li key="Horarios">
                  <a href="#programa" className="hover:text-white hover:brightness-150 hover:pl-2 transition-all duration-300">
                    Horarios
                  </a>
                </li>
                <li key="Entrenadores">
                  <a href="#experiencia" className="hover:text-white hover:brightness-150 hover:pl-2 transition-all duration-300">
                    Entrenadores
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li key="Privacidad">
                  <a href="/legal/privacidad" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:brightness-150 hover:pl-2 transition-all duration-300">
                    Privacidad
                  </a>
                </li>
                <li key="Terminos">
                  <a href="/legal/terminos" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:brightness-150 hover:pl-2 transition-all duration-300">
                    Términos
                  </a>
                </li>
                <li key="Reglamento">
                  <a href="/legal/reglamento" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:brightness-150 hover:pl-2 transition-all duration-300">
                    Reglamento
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li>Av. Río Nilo 4301, Tonalá</li>
              <li>33 28 14 57 00</li>
              <li>crazyboxing@hotmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs font-medium">
            © 2024 Crazy Boxing MMA. Todos los derechos reservados.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-widest hover:text-white transition-all duration-300 group"
          >
            Volver arriba <FaArrowUp className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
