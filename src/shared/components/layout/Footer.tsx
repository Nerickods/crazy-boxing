'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaInstagram, FaFacebook, FaTiktok, FaArrowUp } from 'react-icons/fa';

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
    <footer ref={containerRef} className="relative bg-black pt-32 pb-10 overflow-hidden">
      {/* Octagon Final Background with Inverted Parallax */}
      {/* Background Layer - Adapted for Responsive Assets */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <picture>
          <img
            src="/assets/sections/testimonials-bg.png"
            alt="Footer Background"
            className="w-full h-full object-cover opacity-80"
          />
        </picture>
        {/* Dark Overlay for Legibility */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-20">

          {/* Brand - No Glass */}
          <div className="max-w-sm w-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-white/5 p-2 flex items-center justify-center border border-white/10 backdrop-blur-sm">
                <img
                  src="/assets/logo.png"
                  alt="Crazy Boxing Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tighter drop-shadow-md">
                CRAZY<span className="text-[var(--accent)] font-outline">BOXING</span>
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4 font-extrabold drop-shadow-md">
              CRAZY BOXING ACADEMY<br />
              <span className="font-bold italic text-white">Forjando el carácter desde 2024.</span>
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 font-bold drop-shadow-md">
              No somos un gimnasio para "mantenerse", somos una hermandad para transformarse.
              Si has bajado hasta aquí buscando la letra pequeña, no la hay. Solo hay trabajo duro y resultados reales.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/crazyboxing765?igsh=MTljZmtsNTk1cndkbg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black hover:scale-110 hover:brightness-125 transition-all duration-300 border border-white/10 backdrop-blur-sm"
                title="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61559222858682"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black hover:scale-110 hover:brightness-125 transition-all duration-300 border border-white/10 backdrop-blur-sm"
                title="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@crazy.boxing2?_t=8mnm7DeLubu&_r=1&fbclid=PAdGRleAP7TeVleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAacUWhbMKBjL5MzjuZCTa-NmUQLqc_yqlPsakemG-0PCqJsd-mRBZUESSBveXg_aem_iwIdZO4d-20ppNRQMWNqFg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black hover:scale-110 hover:brightness-125 transition-all duration-300 border border-white/10 backdrop-blur-sm"
                title="TikTok"
              >
                <FaTiktok size={18} />
              </a>
            </div>
          </div>

          {/* Links & Contact - No Glass */}
          <div className="w-fit">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-white font-black mb-6 uppercase text-sm tracking-widest drop-shadow-md">El Camino</h4>
                <ul className="space-y-4 text-sm text-gray-300 font-bold">
                  <li key="Inicio">
                    <button onClick={scrollToTop} className="hover:text-white hover:font-black hover:pl-2 transition-all duration-300 text-left drop-shadow-sm">
                      El Manifiesto
                    </button>
                  </li>
                  <li key="Sistema">
                    <a href="#experiencia" className="hover:text-white hover:font-black hover:pl-2 transition-all duration-300 block drop-shadow-sm">
                      Nuestro Sistema
                    </a>
                  </li>
                  <li key="Instalaciones">
                    <a href="#horarios-card" className="hover:text-white hover:font-black hover:pl-2 transition-all duration-300 block drop-shadow-sm">
                      Horarios
                    </a>
                  </li>
                  <li key="Mentores">
                    <a href="#mentores" className="hover:text-white hover:font-black hover:pl-2 transition-all duration-300 block drop-shadow-sm">
                      Los Mentores
                    </a>
                  </li>
                  <li key="Reglas">
                    <a href="/legal/reglamento" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:font-black hover:pl-2 transition-all duration-300 block drop-shadow-sm">
                      Reglas del Juego
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-black mb-6 uppercase text-sm tracking-widest drop-shadow-md">Legal</h4>
                <ul className="space-y-4 text-sm text-gray-300 font-bold">
                  <li key="Privacidad">
                    <a href="/legal/privacidad" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:font-black hover:pl-2 transition-all duration-300 drop-shadow-sm">
                      Privacidad
                    </a>
                  </li>
                  <li key="Terminos">
                    <a href="/legal/terminos" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:font-black hover:pl-2 transition-all duration-300 drop-shadow-sm">
                      Términos y Condiciones
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-black mb-6 uppercase text-sm tracking-widest drop-shadow-md">Cuartel General</h4>
                <ul className="space-y-6 text-sm text-gray-300 font-bold">
                  <li>
                    <strong className="block text-white mb-1 font-black drop-shadow-md">📍 Dónde ocurre la magia:</strong>
                    Av San Gaspar 54, El Molino, <br />45407 Tonalá, Jal.
                  </li>
                  <li>
                    <strong className="block text-white mb-1 font-black drop-shadow-md">📞 Línea Directa:</strong>
                    <a href="tel:3326088957" className="hover:text-[var(--accent)] transition-colors">33 26 08 89 57</a>
                    <span className="block text-xs text-gray-400 mt-1 font-semibold">(Llámanos o escribe por WhatsApp)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
          <p className="text-gray-400 text-xs font-bold">
            © 2024 Crazy Boxing MMA. Todos los derechos reservados. <span className="hidden md:inline">|</span> <span className="block md:inline text-[var(--accent)] font-black">Prohibido rendirse.</span>
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-black text-[var(--accent)] uppercase tracking-widest hover:text-white transition-all duration-300 group"
          >
            Volver arriba <FaArrowUp className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer >
  );
}
