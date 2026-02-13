'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaPlus, FaMinus, FaRobot } from 'react-icons/fa';
import { useChatStore } from '@/features/chat/store/chatStore';
import { useScrollAnchor } from '@/shared/hooks/use-scroll-anchor';

const faqs = [
  {
    q: "🟢 Nivel: PRINCIPIANTE — ¿Voy a 'morir' en la primera clase?",
    a: (
      <>
        Rotundamente no. No necesitas estar en forma para empezar; vienes aquí <span className="italic text-white">para</span> ponerte en forma.
        Nuestros coaches adaptan la intensidad a tu nivel actual. No buscamos que te revientes el primer día, buscamos que quieras volver el segundo.
      </>
    )
  },
  {
    q: "🛡️ Miedo: SEGURIDAD — Tengo reuniones mañana. ¿Voy a salir con un ojo morado?",
    a: (
      <>
        Absolutamente <span className="font-bold text-white">NO</span>.
        En las fases iniciales (El Desbloqueo y La Inoculación), el contacto es exclusivo con sacos y manoplas. Nadie te va a pegar. El sparring (combate) es opcional y solo para alumnos avanzados que lo solicitan. Aquí cuidamos tu integridad física por encima de todo.
      </>
    )
  },
  {
    q: "🎒 Logística: EQUIPO — ¿Tengo que comprar guantes caros para la clase de prueba?",
    a: "No. Nosotros te prestamos todo el material (guantes y vendas) para tu primera sesión. Solo trae ropa deportiva cómoda, una botella de agua y la mentalidad correcta."
  },
  {
    q: "💰 Dinero: VALOR VS. PRECIO — La inversión es más alta que en un gimnasio convencional. ¿Por qué?",
    a: (
      <>
        Porque son dos cosas distintas.
        En un gimnasio comercial pagas una cuota baja por <span className="font-bold text-white">alquilar máquinas</span> que nadie te enseña a usar. Aquí inviertes en <span className="font-bold text-[var(--accent)]">Mentoría, Metodología y Resultados</span>.
        <br /><br />
        No cobramos por "acceso", cobramos por la transformación que te llevas puesta. Si buscas lo barato, un gimnasio 'low-cost' es tu opción. Si buscas cambiar tu realidad, tu sitio es este.
      </>
    )
  },
  {
    q: "🔓 Compromiso: PERMANENCIA — ¿Me vais a atar con un contrato de permanencia?",
    a: "No. Odiamos la letra pequeña tanto como tú. Nuestros planes son mensuales. Queremos que vengas porque el boxeo te apasiona, no porque un papel te obligue. Si decides irte, te vas (aunque te advertimos: engancha)."
  }
];

export default function FAQSection() {
  const { toggleOpen } = useChatStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const faqHeaderRef = useScrollAnchor(isExpanded, 100);

  return (
    <section id="faq" ref={containerRef} className="py-16 md:py-40 bg-black relative overflow-hidden">
      {/* Parallax Fence Background - Disabled on Mobile for performance */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div
          className="w-full h-full bg-cover bg-center md:hidden"
          style={{ backgroundImage: 'url("/assets/faq-bg-fence.jpg")' }}
        />
        <motion.div
          className="hidden md:block w-full h-[120%] bg-cover bg-center will-change-transform"
          style={{ y: backgroundY, backgroundImage: 'url("/assets/faq-bg-fence.jpg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Background Accents - Hidden on Mobile */}
      <div className="hidden md:block absolute top-0 right-0 w-1/3 h-1/2 bg-[var(--accent)]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 left-0 w-1/4 h-1/3 bg-[var(--accent)]/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 z-0 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div
          ref={faqHeaderRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[var(--accent)] font-bold tracking-[0.3em] text-xs uppercase mb-4 block">
            RESULTADOS REALES
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            ¿TIENES DUDAS? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] via-white to-[var(--accent)]">
              GOLPÉALAS AQUÍ.
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
            Respuestas directas para que no tengas excusas.
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              isExpanded={isExpanded}
            />
          ))}
        </div>

        {/* Mobile View More Items */}
        {!isExpanded && (
          <div className="mt-8 text-center md:hidden">
            <button
              onClick={() => setIsExpanded(true)}
              className="px-8 py-3 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black transition-all duration-300 rounded-full w-full"
            >
              Ver más preguntas frecuentes (+{faqs.length - 1})
            </button>
          </div>
        )}
        {isExpanded && (
          <div className="mt-8 text-center md:hidden">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
            >
              Mostrar menos
            </button>
          </div>
        )}

        {/* Chatbot CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24 p-8 md:p-12 rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-xl text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-30" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[var(--accent)]/20 animate-pulse">
              <FaRobot className="text-[var(--accent)] text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">¿TE QUEDA ALGUNA DUDA RONDANDO?</h3>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              <span className="block font-bold text-white mb-2">No dejes que una pregunta te frene.</span>
              Nuestro <span className="text-[var(--accent)]">Crazy Bot (IA)</span> no necesita dormir. Está activo <span className="font-bold text-white">24/7</span> para responderte cualquier cosa sobre horarios, precios o equipo en segundos.
              <br />
              <span className="text-xs uppercase tracking-widest mt-2 block opacity-70">Sin esperas. Sin música de ascensor.</span>
            </p>
            <button
              onClick={toggleOpen}
              className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-[var(--accent)] hover:scale-105 transition-all duration-300 rounded-sm inline-flex items-center gap-3 group/btn"
            >
              🥊 HABLAR CON EL COACH DIGITAL
            </button>
          </div>

          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--accent)]/5 blur-[80px] rounded-full group-hover:bg-[var(--accent)]/10 transition-colors duration-700" />
        </motion.div>
      </div>
    </section>
  );
}

function FAQItem({ faq, index, isOpen, onToggle, isExpanded }: { faq: any, index: number, isOpen: boolean, onToggle: () => void, isExpanded: boolean }) {
  // Solo anclamos el scroll si estamos en Desktop. En móvil el momentum del usuario debe mandar.
  const itemRef = useScrollAnchor(isOpen, 120);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`
        group rounded-2xl border transition-all duration-500 overflow-hidden will-change-transform
        ${isOpen
          ? 'bg-zinc-900/90 md:bg-zinc-900/50 border-[var(--accent)]/50 shadow-[0_0_40px_-10px_rgba(255,215,0,0.2)] scale-[1.01] backdrop-blur-none md:backdrop-blur-md'
          : 'bg-zinc-900/40 md:bg-zinc-900/30 border-white/5 hover:border-white/10 hover:bg-zinc-900/50 backdrop-blur-none md:backdrop-blur-md'}
        ${index > 0 && !isExpanded ? 'hidden md:block' : 'block'}
      `}
    >
      <button
        onClick={onToggle}
        className="w-full p-6 md:p-8 flex items-center justify-between text-left transition-all duration-300"
      >
        <span className={`text-xl md:text-2xl font-bold tracking-tight pr-8 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
          {faq.q}
        </span>
        <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen ? 'bg-[var(--accent)] text-black border-[var(--accent)] shadow-[0_0_15px_rgba(255,183,0,0.5)]' : 'bg-white/5 text-gray-500 border-white/10 group-hover:border-[var(--accent)]/30 group-hover:text-[var(--accent)]'}`}>
          {isOpen ? <FaMinus size={14} /> : <FaPlus size={14} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.25 : 0.4,
              ease: "easeInOut"
            }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8">
              <div className="h-px w-full bg-white/5 mb-6" />
              <div className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl">
                {faq.a}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div className="absolute inset-0 pointer-events-none border border-[var(--accent)]/20 rounded-2xl md:animate-pulse" />
      )}
    </motion.div>
  );
}