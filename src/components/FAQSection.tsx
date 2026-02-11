'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
  {
    q: "¿Necesito experiencia previa?",
    a: "Absolutamente no. El 90% de nuestros miembros comenzaron desde cero. Nuestro sistema está diseñado para construir guerreros desde la base."
  },
  {
    q: "¿Es seguro entrenar MMA?",
    a: "La seguridad es nuestra prioridad #1. El entrenamiento es controlado, progresivo y supervisado por profesionales. Te empujaremos al límite, pero nunca al peligro."
  },
  {
    q: "¿Qué equipo necesito?",
    a: "Para tu primera clase, solo ropa deportiva cómoda y agua. Nosotros te prestamos el equipo básico. Cuando te inscribas, te asesoraremos sobre tu propio equipo."
  },
  {
    q: "¿Hay límite de edad?",
    a: "Tenemos estudiantes desde 15 hasta 60 años. Si tienes la voluntad de aprender y trabajar duro, tienes un lugar en nuestro tatami."
  },
  {
    q: "¿Puedo competir?",
    a: "Sí. Tenemos un equipo de competencia activo. Si demuestras la disciplina y habilidad necesaria, te prepararemos para el octágono."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-black relative">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[var(--accent)] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">
            Dudas Comunes
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            PREGUNTAS <span className="text-gray-800">FRECUENTES</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-b border-white/10"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${openIndex === index ? 'text-[var(--accent)]' : 'text-white group-hover:text-gray-300'}`}>
                  {faq.q}
                </span>
                <span className={`text-[var(--accent)] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}