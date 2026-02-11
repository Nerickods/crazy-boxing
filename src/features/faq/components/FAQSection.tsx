'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaPlus, FaMinus, FaRobot } from 'react-icons/fa';
import { useChatStore } from '@/features/chat/store/chatStore';
import { useScrollAnchor } from '@/shared/hooks/use-scroll-anchor';

const faqs = [
  {
    q: "¿Qué necesito llevar para mi visita de cortesía?",
    a: (
      <>
        Para tu primer paso en el Octágono, solo necesitarás ropa deportiva cómoda guantes y vendas para tu sesión, hidratación y las ganas de superarte. <span className="text-indigo-500 font-bold">Importante:</span> si vienes a Muay Thai o Jiu Jitsu, trae sandalias (está prohibido caminar descalzo fuera del tatami). Te sugerimos llegar 10 minutos antes para validar tu ingreso y activarte.
      </>
    )
  },
  {
    q: "¿Es este entrenamiento solo para quienes buscan competir?",
    a: "No. En Crazy Boxing, la mayoría de nuestros miembros entrenan por superación personal, salud y manejo de estrés. Ofrecemos dos líneas: Recreativa y Competencia. No necesitas conocimientos previos; te acompañamos desde el primer día para que forjes tu mejor versión, busques o no una medalla."
  },
  {
    q: "¿Tengo que adquirir un plan obligatoriamente después del día gratuito?",
    a: "Nuestra garantía es simple: Sin Compromiso. La visita de cortesía es para que experimentes nuestra cultura y metodología. Si decides que no es para ti, no hay presiones. Estamos tan seguros de nuestra metodología que dejamos que los resultados hablen por nosotros."
  },
  {
    q: "No estoy en forma, ¿puedo empezar ahora o debo esperar?",
    a: "La condición física es el resultado del entrenamiento, no el requisito. Nuestro programa para principiantes está diseñado para adaptar tu cuerpo de forma progresiva. No esperes a 'estar en forma' para empezar; ven y nosotros nos encargaremos de ponerte en forma."
  },
  {
    q: "¿Qué tan seguro es el entrenamiento para alguien sin experiencia?",
    a: "Tu integridad es nuestra prioridad absoluta. Utilizamos una metodología de progresión técnica enfocada en el control antes que en la intensidad. Entrenarás en un ambiente profesional y supervisado por coaches certificados, asegurando que cada sesión sea un resto constructivo, nunca un peligro."
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
            Inteligencia de Combate
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            PROTOCOLO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-500 to-gray-800">
              SIN EXCUSAS
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
            Lo que necesitas saber para dejar de negociar con tu mente y empezar a entrenar como un profesional.
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
            <h3 className="text-2xl font-bold text-white mb-2">¿Aún tienes dudas específicas?</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Nuestro asistente virtual está disponible 24/7 para resolver cualquier inquietud sobre tu entrenamiento.
            </p>
            <button
              onClick={toggleOpen}
              className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-[var(--accent)] hover:scale-105 transition-all duration-300 rounded-sm inline-flex items-center gap-3 group/btn"
            >
              Consultar con Crazy Assistant
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