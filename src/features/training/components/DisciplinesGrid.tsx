'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFistRaised, FaFire, FaShieldAlt, FaBolt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { disciplines } from '@/shared/constants/training-data';

export default function DisciplinesGrid() {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const toggleCard = (id: string) => {
    setExpandedCards(prev =>
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  return (
    <section id="disciplinas" className="py-24 bg-black relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,215,0,0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[var(--brand-red)] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">
            Arsenal de Combate
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            ELIGE TU <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-yellow)]">ARMA</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
            No enseñamos deportes. Enseñamos sistemas de combate probados en la jaula.
            Especialízate en una o domínalas todas para convertirte en un arma completa.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {disciplines.map((discipline, index) => (
            <motion.div
              key={discipline.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative h-[600px] rounded-sm overflow-hidden bg-gray-900 cursor-pointer"
              onClick={() => toggleCard(discipline.id)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={discipline.image}
                  alt={discipline.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                {/* Icon & Title */}
                <div className="mb-4 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <discipline.icon className={`text-4xl mb-4 ${discipline.accentColor}`} />
                  <h3 className="text-4xl font-black text-white uppercase leading-none mb-2">
                    {discipline.name}
                  </h3>
                  <p className="text-[var(--brand-red)] font-bold tracking-wider text-sm">
                    {discipline.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                  {discipline.description}
                </p>

                {/* Expandable Benefits */}
                <AnimatePresence>
                  {expandedCards.includes(discipline.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 mb-6 border-t border-gray-700 pt-4">
                        {discipline.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-400 text-xs">
                            <span className="text-[var(--brand-red)] mt-1">›</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Button */}
                <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-auto">
                  <span className="text-white text-xs font-bold tracking-widest uppercase group-hover:text-[var(--brand-red)] transition-colors">
                    {expandedCards.includes(discipline.id) ? 'MENOS INFORMACIÓN' : 'EXPLORAR DISCIPLINA'}
                  </span>
                  {expandedCards.includes(discipline.id) ? (
                    <FaChevronUp className="text-[var(--brand-red)]" />
                  ) : (
                    <FaChevronDown className="text-white group-hover:text-[var(--brand-red)] transition-colors" />
                  )}
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-[var(--brand-red)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
