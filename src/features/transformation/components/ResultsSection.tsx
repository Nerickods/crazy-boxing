'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaTrophy, FaFire, FaHeart, FaWeight } from 'react-icons/fa';

interface TestimonialResult {
  id: string;
  name: string;
  age: number;
  beforeImage: string;
  afterImage: string;
  timeFrame: string;
  discipline: string;
  quote: string;
  metrics: {
    weightLoss: number;
    strengthGain: string;
    confidenceLevel: number;
  };
  currentStatus: string;
}

const TESTIMONIAL_DATA: TestimonialResult[] = [
  {
    id: 'carlos-mma',
    name: 'Carlos Mendoza',
    age: 28,
    beforeImage: '/images/gym-facilities.jpg', // Placeholder antes
    afterImage: '/images/octagon-training.jpeg', // Después
    timeFrame: '6 meses',
    discipline: 'MMA',
    quote: "Nunca imaginé sentirme tan fuerte y enfocado. Crazy Boxing me cambió la mentalidad y me transformó por completo.",
    metrics: {
      weightLoss: 12,
      strengthGain: 'Resistencia +40%',
      confidenceLevel: 95
    },
    currentStatus: "Entrenando para su primera competencia amateur"
  },
  {
    id: 'fernanda-bjj',
    name: 'Fernanda López',
    age: 24,
    beforeImage: '/images/women-grappling.jpg',
    afterImage: '/images/jiu-jitsu-ground.jpeg',
    timeFrame: '4 meses',
    discipline: 'BJJ',
    quote: "Entrenar aquí me dio confianza y una nueva familia en el tatami. Cada día aprendo algo nuevo de mí misma.",
    metrics: {
      weightLoss: 8,
      strengthGain: 'Flexibilidad +60%',
      confidenceLevel: 88
    },
    currentStatus: "Cinta blanca avanzada, próxima a cinta azul"
  },
  {
    id: 'ricardo-muay',
    name: 'Ricardo Torres',
    age: 31,
    beforeImage: '/images/gym-group-training.jpeg',
    afterImage: '/images/muay-thai-sparring.jpeg',
    timeFrame: '5 meses',
    discipline: 'Muay Thai',
    quote: "Cada golpe me enseñó disciplina. Ahora mi energía es otra y mi cuerpo está más fuerte que nunca.",
    metrics: {
      weightLoss: 10,
      strengthGain: 'Masa magra +8kg',
      confidenceLevel: 92
    },
    currentStatus: "Entrenando técnicas avanzadas de clinch"
  },
  {
    id: 'valeria-boxeo',
    name: 'Valeria Hernández',
    age: 26,
    beforeImage: '/images/conditioning-class.jpeg',
    afterImage: '/images/boxing-training.jpeg',
    timeFrame: '3 meses',
    discipline: 'Boxeo',
    quote: "El entrenamiento me hizo más fuerte por dentro y por fuera. Descubrí una fuerza que no sabía que tenía.",
    metrics: {
      weightLoss: 6,
      strengthGain: 'Velocidad +50%',
      confidenceLevel: 85
    },
    currentStatus: "Mejorando su combinación de golpes y defensa"
  }
];

const ResultsSection: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState<number>(0);

  const currentTestimonial = TESTIMONIAL_DATA[activeTestimonial];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header con Copy Persuasivo */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
            TRANSFORMACIONES REALES
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Estas no son solo historias de <span className="text-sky-400 font-bold">pérdida de peso</span>.
            Son historias de <span className="text-sky-400 font-bold">guerreros que encontraron su fuerza interior</span>.
            Descubre cómo <span className="text-sky-400 font-bold">500+ estudiantes</span> cambiaron sus vidas.
          </p>

          {/* Stats Impactantes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-b from-sky-400/10 to-sky-400/5 rounded-xl p-6 border border-sky-400/20"
            >
              <FaTrophy className="text-3xl text-sky-400 mb-3 mx-auto" />
              <div className="text-3xl font-black text-sky-400">500+</div>
              <div className="text-gray-400 font-semibold">Estudiantes Transformados</div>
            </motion.div>

            <motion.div
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-b from-green-400/10 to-green-400/5 rounded-xl p-6 border border-green-400/20"
            >
              <FaFire className="text-3xl text-green-400 mb-3 mx-auto" />
              <div className="text-3xl font-black text-green-400">12kg</div>
              <div className="text-gray-400 font-semibold">Promedio Pérdida</div>
            </motion.div>

            <motion.div
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-b from-blue-400/10 to-blue-400/5 rounded-xl p-6 border border-blue-400/20"
            >
              <FaHeart className="text-3xl text-blue-400 mb-3 mx-auto" />
              <div className="text-3xl font-black text-blue-400">90%</div>
              <div className="text-gray-400 font-semibold">Confianza Ganada</div>
            </motion.div>

            <motion.div
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-b from-purple-400/10 to-purple-400/5 rounded-xl p-6 border border-purple-400/20"
            >
              <FaWeight className="text-3xl text-purple-400 mb-3 mx-auto" />
              <div className="text-3xl font-black text-purple-400">45días</div>
              <div className="text-gray-400 font-semibold">Primera Transformación</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonial Principal con Before/After */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Before/After Visual */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-xl z-10" />
                <img
                  src={currentTestimonial.beforeImage}
                  alt="Antes"
                  className="w-full h-64 object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&q=80";
                  }}
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <p className="text-white font-bold text-lg">ANTES</p>
                  <p className="text-gray-300 text-sm">
                    {currentTestimonial.age - 1} años • Iniciando
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-xl z-10" />
                <img
                  src={currentTestimonial.afterImage}
                  alt="Después"
                  className="w-full h-64 object-cover rounded-xl transform group-hover:scale-105 transition-all duration-500"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop&q=80";
                  }}
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <p className="text-sky-400 font-bold text-lg">DESPUÉS</p>
                  <p className="text-gray-300 text-sm">
                    {currentTestimonial.age} años • {currentTestimonial.timeFrame}
                  </p>
                </div>
                {/* Badge de transformación */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-sky-400 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    TRANSFORMADO
                  </span>
                </div>
              </div>
            </div>

            {/* Métricas de Resultado */}
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              <div className="text-center bg-gradient-to-b from-indigo-500/10 to-indigo-500/5 rounded-lg p-4">
                <FaWeight className="text-indigo-400 mb-2 mx-auto" />
                <div className="text-2xl font-black text-indigo-400">
                  -{currentTestimonial.metrics.weightLoss}kg
                </div>
                <div className="text-gray-400 text-xs">Pérdida</div>
              </div>
              <div className="text-center bg-gradient-to-b from-green-500/10 to-green-500/5 rounded-lg p-4">
                <FaFire className="text-green-400 mb-2 mx-auto" />
                <div className="text-lg font-black text-green-400">
                  {currentTestimonial.metrics.strengthGain}
                </div>
                <div className="text-gray-400 text-xs">Fuerza</div>
              </div>
              <div className="text-center bg-gradient-to-b from-blue-500/10 to-blue-500/5 rounded-lg p-4">
                <FaHeart className="text-blue-400 mb-2 mx-auto" />
                <div className="text-2xl font-black text-blue-400">
                  {currentTestimonial.metrics.confidenceLevel}%
                </div>
                <div className="text-gray-400 text-xs">Confianza</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Testimonial Content */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-sky-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">• {currentTestimonial.timeFrame}</span>
              </div>

              <div className="relative mb-6">
                <FaQuoteLeft className="text-3xl text-sky-400/20 absolute -top-4 -left-4" />
                <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed pl-6 mb-6">
                  &ldquo;{currentTestimonial.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-sky-400 mb-1">
                  {currentTestimonial.name}
                </h3>
                <p className="text-gray-400">
                  {currentTestimonial.age} años • Disciplina: {currentTestimonial.discipline}
                </p>
                <p className="text-green-400 font-semibold text-sm mt-2">
                  {currentTestimonial.currentStatus}
                </p>
              </div>
            </div>

            {/* Selector de Testimonios */}
            <div className="space-y-3">
              <p className="text-gray-400 text-sm mb-4">MÁS HISTORIAS DE TRANSFORMACIÓN:</p>
              {TESTIMONIAL_DATA.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${activeTestimonial === index
                      ? 'bg-sky-400/20 border-l-4 border-sky-400'
                      : 'bg-gray-800/50 hover:bg-gray-800 border-l-4 border-transparent'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {testimonial.discipline} • {testimonial.timeFrame}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sky-400 font-bold">
                        -{testimonial.metrics.weightLoss}kg
                      </span>
                      <div className="flex text-sky-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA Section Final */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-sky-400/10 to-cyan-500/10 rounded-3xl p-12 border border-sky-400/20"
        >
          <h3 className="text-3xl font-bold mb-4 text-sky-400">
            TU HISTORIA EMPIEZA AHORA
          </h3>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            ¿Lista para ser la próxima transformación? Únete a cientos de guerreros que encontraron su fuerza en Crazy Boxing.
          </p>
          <button
            onClick={() => {
              document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="cta-button text-lg px-8 py-4 text-black font-bold hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
          >
            COMENZAR MI TRANSFORMACIÓN
          </button>
          <p className="text-gray-400 text-sm mt-4">
            ✓ Día de clases gratuito • ✓ Sin compromiso • ✓ Resultados garantizados
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;