'use client';

import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp, FaArrowUp } from 'react-icons/fa';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <picture>
          <source srcSet="/assets/sections/footer-mobile.png" media="(max-width: 768px)" />
          <img
            src="/assets/sections/footer-desktop.png"
            alt="Footer Background"
            className="w-full h-full object-cover opacity-50"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">

          {/* Brand */}
          <div className="max-w-sm">
            <h3 className="text-2xl font-black text-white mb-6 tracking-tighter">
              CRAZY<span className="text-[var(--accent)]">BOXING</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Forjando guerreros desde 2024. Más que un gimnasio, somos una hermandad dedicada a la excelencia marcial y el desarrollo personal.
            </p>
            <div className="flex gap-4">
              {[FaInstagram, FaFacebook, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Explorar</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                {['Inicio', 'Disciplinas', 'Horarios', 'Entrenadores'].map(item => (
                  <li key={item}><a href={`#${item.toLowerCase()}`} className="hover:text-[var(--accent)] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                {['Privacidad', 'Términos', 'Reglamento'].map(item => (
                  <li key={item}><a href="#" className="hover:text-[var(--accent)] transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>Av. Río Nilo 4301, Tonalá</li>
              <li>33 28 14 57 00</li>
              <li>crazyboxing@hotmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © 2024 Crazy Boxing MMA. Todos los derechos reservados.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-widest hover:text-white transition-colors"
          >
            Volver arriba <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
