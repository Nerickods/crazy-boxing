'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaClock, FaStar, FaTrophy, FaChevronDown, FaChevronUp, FaCalendarAlt, FaDumbbell } from 'react-icons/fa';

interface ScheduleItem {
  id: string;
  discipline: string;
  day: string;
  time: string;
  duration: string;
  level: string;
  instructor: string;
  classImage: string;
  availableSpots: number;
  maxSpots: number;
  isPopular?: boolean;
  isNew?: boolean;
}

const SCHEDULE_DATA: ScheduleItem[] = [
  // MMA
  {
    id: 'mma-lun-1',
    discipline: 'MMA',
    day: 'Lunes',
    time: '6:00 PM - 7:00 PM',
    duration: '60 min',
    level: 'Principiantes',
    instructor: 'Héctor',
    classImage: '/images/discipline_grappling.png',
    availableSpots: 8,
    maxSpots: 20,
    isPopular: true
  },
  {
    id: 'mma-mar-1',
    discipline: 'MMA',
    day: 'Martes',
    time: '5:00 PM - 6:00 PM',
    duration: '60 min',
    level: 'Intermedio',
    instructor: 'Héctor',
    classImage: '/images/discipline_grappling.png',
    availableSpots: 12,
    maxSpots: 20
  },
  {
    id: 'mma-mie-1',
    discipline: 'MMA',
    day: 'Miércoles',
    time: '5:00 PM - 6:00 PM',
    duration: '60 min',
    level: 'Principiantes',
    instructor: 'Héctor',
    classImage: '/images/discipline_grappling.png',
    availableSpots: 15,
    maxSpots: 20,
    isNew: true
  },
  {
    id: 'mma-jue-1',
    discipline: 'MMA',
    day: 'Jueves',
    time: '5:00 PM - 6:00 PM',
    duration: '60 min',
    level: 'Intermedio',
    instructor: 'Héctor',
    classImage: '/images/discipline_grappling.png',
    availableSpots: 10,
    maxSpots: 20
  },
  {
    id: 'mma-vie-1',
    discipline: 'MMA',
    day: 'Viernes',
    time: '5:00 PM - 6:00 PM',
    duration: '60 min',
    level: 'Avanzado',
    instructor: 'Héctor',
    classImage: '/images/discipline_grappling.png',
    availableSpots: 6,
    maxSpots: 15,
    isPopular: true
  },

  // BJJ
  {
    id: 'bjj-lun-1',
    discipline: 'BJJ',
    day: 'Lunes',
    time: '7:00 PM - 8:00 PM',
    duration: '60 min',
    level: 'No Gi',
    instructor: 'Jorge',
    classImage: '/images/discipline_jiu_jitsu.png',
    availableSpots: 18,
    maxSpots: 25,
    isPopular: true
  },
  {
    id: 'bjj-lun-2',
    discipline: 'BJJ',
    day: 'Lunes',
    time: '8:00 PM - 9:00 PM',
    duration: '60 min',
    level: 'Gi',
    instructor: 'Jorge',
    classImage: '/images/discipline_jiu_jitsu.png',
    availableSpots: 20,
    maxSpots: 25
  },
  {
    id: 'bjj-mar-1',
    discipline: 'BJJ',
    day: 'Martes',
    time: '7:00 PM - 8:00 PM',
    duration: '60 min',
    level: 'Principiantes',
    instructor: 'Jorge',
    classImage: '/images/discipline_jiu_jitsu.png',
    availableSpots: 8,
    maxSpots: 20,
    isNew: true
  },
  {
    id: 'bjj-mie-1',
    discipline: 'BJJ',
    day: 'Miércoles',
    time: '7:00 PM - 8:00 PM',
    duration: '60 min',
    level: 'No Gi',
    instructor: 'Jorge',
    classImage: '/images/discipline_jiu_jitsu.png',
    availableSpots: 16,
    maxSpots: 25
  },
  {
    id: 'bjj-mie-2',
    discipline: 'BJJ',
    day: 'Miércoles',
    time: '8:00 PM - 9:00 PM',
    duration: '60 min',
    level: 'Gi',
    instructor: 'Jorge',
    classImage: '/images/discipline_jiu_jitsu.png',
    availableSpots: 22,
    maxSpots: 25
  },
  {
    id: 'bjj-jue-1',
    discipline: 'BJJ',
    day: 'Jueves',
    time: '7:00 PM - 8:00 PM',
    duration: '60 min',
    level: 'Principiantes',
    instructor: 'Jorge',
    classImage: '/images/discipline_jiu_jitsu.png',
    availableSpots: 12,
    maxSpots: 20
  },
  {
    id: 'bjj-vie-1',
    discipline: 'BJJ',
    day: 'Viernes',
    time: '7:00 PM - 8:00 PM',
    duration: '60 min',
    level: 'Open Mat',
    instructor: 'Jorge',
    classImage: '/images/discipline_jiu_jitsu.png',
    availableSpots: 25,
    maxSpots: 30
  },

  // MUAY THAI
  {
    id: 'mt-mar-1',
    discipline: 'Muay Thai',
    day: 'Martes',
    time: '6:00 PM - 7:00 PM',
    duration: '60 min',
    level: 'Principiantes',
    instructor: 'Héctor',
    classImage: '/images/discipline_muay_thai.png',
    availableSpots: 14,
    maxSpots: 22,
    isPopular: true
  },
  {
    id: 'mt-mie-1',
    discipline: 'Muay Thai',
    day: 'Miércoles',
    time: '4:00 PM - 5:00 PM',
    duration: '60 min',
    level: 'Intermedio',
    instructor: 'Héctor',
    classImage: '/images/discipline_muay_thai.png',
    availableSpots: 16,
    maxSpots: 22
  },
  {
    id: 'mt-jue-1',
    discipline: 'Muay Thai',
    day: 'Jueves',
    time: '6:00 PM - 7:00 PM',
    duration: '60 min',
    level: 'Principiantes',
    instructor: 'Héctor',
    classImage: '/images/discipline_muay_thai.png',
    availableSpots: 9,
    maxSpots: 22
  },
  {
    id: 'mt-vie-1',
    discipline: 'Muay Thai',
    day: 'Viernes',
    time: '4:00 PM - 5:00 PM',
    duration: '60 min',
    level: 'Sparring Muay Thai',
    instructor: 'Héctor',
    classImage: '/images/discipline_muay_thai.png',
    availableSpots: 12,
    maxSpots: 18,
    isPopular: true
  },

  // BOXEO
  {
    id: 'box-lun-1',
    discipline: 'Boxeo',
    day: 'Lunes',
    time: '8:30 AM - 9:30 AM',
    duration: '60 min',
    level: 'Principiantes',
    instructor: 'César',
    classImage: '/images/discipline_boxing.png',
    availableSpots: 20,
    maxSpots: 25
  },
  {
    id: 'box-mar-1',
    discipline: 'Boxeo',
    day: 'Martes',
    time: '8:30 AM - 9:30 AM',
    duration: '60 min',
    level: 'Intermedio',
    instructor: 'César',
    classImage: '/images/discipline_boxing.png',
    availableSpots: 18,
    maxSpots: 25
  },
  {
    id: 'box-jue-1',
    discipline: 'Boxeo',
    day: 'Jueves',
    time: '8:30 AM - 9:30 AM',
    duration: '60 min',
    level: 'Principiantes',
    instructor: 'César',
    classImage: '/images/discipline_boxing.png',
    availableSpots: 22,
    maxSpots: 25
  },
  {
    id: 'box-vie-1',
    discipline: 'Boxeo',
    day: 'Viernes',
    time: '8:30 AM - 9:30 AM',
    duration: '60 min',
    level: 'Sparring',
    instructor: 'César',
    classImage: '/images/discipline_boxing.png',
    availableSpots: 15,
    maxSpots: 20,
    isPopular: true
  },
  {
    id: 'box-mar-2',
    discipline: 'Boxeo',
    day: 'Martes',
    time: '7:00 PM - 8:00 PM',
    duration: '60 min',
    level: 'Circuito Boxeo',
    instructor: 'Héctor',
    classImage: '/images/discipline_boxing.png',
    availableSpots: 12,
    maxSpots: 20,
    isNew: true
  },
  {
    id: 'box-jue-2',
    discipline: 'Boxeo',
    day: 'Jueves',
    time: '7:00 PM - 8:00 PM',
    duration: '60 min',
    level: 'Circuito Boxeo',
    instructor: 'Héctor',
    classImage: '/images/discipline_boxing.png',
    availableSpots: 10,
    maxSpots: 20,
    isNew: true
  }
];

const ScheduleGrid: React.FC = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const DAYS = ['all', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const filteredSchedule = SCHEDULE_DATA.filter(item => {
    const disciplineMatch = selectedDiscipline === 'all' || item.discipline === selectedDiscipline;
    const dayMatch = selectedDay === 'all' || item.day === selectedDay;
    return disciplineMatch && dayMatch;
  });

  const visibleSchedule = filteredSchedule.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredSchedule.length));
  };

  const handleShowLess = () => {
    setVisibleCount(6);
  };

  const handleReserveClick = (classId: string, className: string) => {
    console.log(`Reservando clase: ${className} (ID: ${classId})`);
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSpotsUrgency = (available: number, max: number) => {
    const percentage = (available / max) * 100;
    if (percentage <= 30) return { text: '¡ÚLTIMOS LUGARES!', color: 'text-indigo-500' };
    if (percentage <= 50) return { text: 'LIMITADO', color: 'text-sky-500' };
    return { text: 'DISPONIBLE', color: 'text-green-500' };
  };

  return (
    <section id="horarios" className="py-24 bg-black relative overflow-hidden">
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
          className="text-center mb-16"
        >
          <span className="text-[var(--brand-red)] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">
            Plan de Batalla
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            HORARIOS DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-yellow)]">GUERRA</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
            La disciplina es el puente entre metas y logros. Elige tu batalla y preséntate.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 flex flex-wrap justify-center gap-4"
        >
          <div className="relative group">
            <FaDumbbell className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-red)]" />
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="bg-gray-900 text-white border border-gray-800 rounded-sm px-12 py-3 focus:outline-none focus:border-[var(--brand-red)] appearance-none cursor-pointer min-w-[200px] uppercase font-bold tracking-wide transition-colors hover:border-gray-700"
            >
              <option value="all">Todas las Disciplinas</option>
              <option value="MMA">MMA</option>
              <option value="BJJ">BJJ</option>
              <option value="Muay Thai">Muay Thai</option>
              <option value="Boxeo">Boxeo</option>
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
          </div>

          <div className="relative group">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--brand-red)]" />
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="bg-gray-900 text-white border border-gray-800 rounded-sm px-12 py-3 focus:outline-none focus:border-[var(--brand-red)] appearance-none cursor-pointer min-w-[200px] uppercase font-bold tracking-wide transition-colors hover:border-gray-700"
            >
              <option value="all">Todos los días</option>
              {DAYS.slice(1).map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode='popLayout'>
            {visibleSchedule.map((item, index) => {
              const urgency = getSpotsUrgency(item.availableSpots, item.maxSpots);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative h-[280px] bg-gray-900 rounded-sm overflow-hidden cursor-pointer"
                  onClick={() => handleReserveClick(item.id, `${item.discipline} - ${item.day} ${item.time}`)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={item.classImage}
                      alt={item.discipline}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-black/80 group-hover:bg-black/70 transition-colors duration-500" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                      <span className="bg-[var(--brand-red)] text-black text-xs font-black px-2 py-1 uppercase tracking-wider">
                        {item.level}
                      </span>
                      {item.isPopular && (
                        <span className="flex items-center gap-1 text-indigo-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                          <FaStar /> Popular
                        </span>
                      )}
                    </div>

                    {/* Middle Info */}
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase mb-1 group-hover:text-[var(--brand-red)] transition-colors">
                        {item.discipline}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                        <FaCalendarAlt className="text-[var(--brand-red)]" />
                        <span className="uppercase tracking-wide font-bold">{item.day}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FaClock />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between border-t border-gray-700 pt-4 group-hover:border-[var(--brand-red)]/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-[var(--brand-red)] font-bold text-xs">
                          {item.instructor[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 uppercase">Coach</span>
                          <span className="text-sm font-bold text-white">{item.instructor}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`block text-xs font-bold ${urgency.color}`}>
                          {urgency.text}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.availableSpots} lugares
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Border */}
                  <div className="absolute inset-0 border-2 border-[var(--brand-red)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Show More/Less Button */}
        {filteredSchedule.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-16"
          >
            <button
              onClick={visibleCount < filteredSchedule.length ? handleShowMore : handleShowLess}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-[var(--brand-red)]/30 hover:border-[var(--brand-red)] transition-colors duration-300"
            >
              <span className="text-[var(--brand-red)] font-bold tracking-[0.2em] text-sm uppercase">
                {visibleCount < filteredSchedule.length ? 'Ver Calendario Completo' : 'Ver Menos Horarios'}
              </span>
              {visibleCount < filteredSchedule.length ? (
                <FaChevronDown className="text-[var(--brand-red)] text-xs group-hover:translate-y-1 transition-transform" />
              ) : (
                <FaChevronUp className="text-[var(--brand-red)] text-xs group-hover:-translate-y-1 transition-transform" />
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ScheduleGrid;