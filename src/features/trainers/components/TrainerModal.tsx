/**
 * Enhanced TrainerModal Component
 * Feature-First Architecture - Detailed trainer view modal
 */

'use client';

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  X,
  Star,
  Users,
  Trophy,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Heart,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Play,
  MessageSquare,
  User,
  Target,
  Zap
} from 'lucide-react';
import { Trainer, ModalState, Review, Achievement, Discipline } from '../types/trainers';
import { useTrainerModal, useFavoriteTrainers } from '../hooks/useTrainers';
import { getDisciplineDisplayName, formatPrice } from '../services/trainersData';

// ========================================
// PROPS INTERFACE
// ========================================

interface TrainerModalProps {
  trainer: Trainer;
  isOpen: boolean;
  onClose: () => void;
  type?: ModalState['type'];
}

// ========================================
// MODAL VARIANTS
// ========================================

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 400
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

// ========================================
// SUB-COMPONENTS
// ========================================

interface AchievementCardProps {
  achievement: Achievement;
  delay: number;
}

const AchievementCard: React.FC<AchievementCardProps> = memo(({ achievement, delay }) => {
  const getIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'championship': return Trophy;
      case 'title': return Award;
      case 'record': return Target;
      case 'award': return Star;
      default: return Award;
    }
  };

  const getLevelColor = (level: Achievement['level']) => {
    switch (level) {
      case 'world': return 'from-sky-400 to-cyan-500';
      case 'international': return 'from-blue-400 to-purple-500';
      case 'national': return 'from-green-400 to-blue-500';
      case 'local': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const Icon = getIcon(achievement.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className={`bg-gradient-to-r ${getLevelColor(achievement.level)} text-white p-4 rounded-xl`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h4 className="font-bold text-sm">{achievement.title}</h4>
          <p className="text-xs opacity-90 mt-1">{achievement.description}</p>
          <p className="text-xs opacity-75 mt-2">{achievement.year}</p>
        </div>
      </div>
    </motion.div>
  );
});

AchievementCard.displayName = 'AchievementCard';

interface ReviewCardProps {
  review: Review;
  delay: number;
}

const ReviewCard: React.FC<ReviewCardProps> = memo(({ review, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className="bg-white/70 backdrop-blur-sm border border-black/10 p-4 rounded-xl"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[var(--brand-red)] to-[var(--brand-red)]/70 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {review.studentName.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-sm text-black">{review.studentName}</h4>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < review.rating
                    ? 'fill-[var(--brand-red)] text-[var(--brand-red)]'
                    : 'fill-gray-300 text-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-black/80 leading-relaxed">{review.comment}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-black/60">
              {new Date(review.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCircle className="w-3 h-3" />
                Verificado
              </span>
            )}
          </div>
          {review.response && (
            <div className="mt-3 p-3 bg-[var(--brand-red)]/10 rounded-lg border border-[var(--brand-red)]/20">
              <p className="text-xs font-medium text-black/60 mb-1">Respuesta del entrenador:</p>
              <p className="text-sm text-black/80">{review.response.text}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ReviewCard.displayName = 'ReviewCard';

interface PricingCardProps {
  title: string;
  price: number;
  duration: number;
  currency?: string;
  includes?: string[];
  featured?: boolean;
  onSelect: () => void;
}

const PricingCard: React.FC<PricingCardProps> = memo(({
  title,
  price,
  duration,
  currency = 'USD',
  includes = [],
  featured = false,
  onSelect
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-300 ${featured
        ? 'bg-gradient-to-br from-[var(--brand-red)] to-[var(--brand-red)]/70 text-black border-[var(--brand-red)]'
        : 'bg-white/70 text-black border-black/20 hover:border-[var(--brand-red)]'
        }`}
    >
      {featured && (
        <div className="absolute -top-2 right-4 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          POPULAR
        </div>
      )}
      <div className="text-center mb-3">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="text-2xl font-bold mt-1">
          {formatPrice(price, currency)}
        </div>
        <p className="text-sm opacity-80">por {duration} minutos</p>
      </div>
      {includes.length > 0 && (
        <div className="space-y-1">
          {includes.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3 h-3 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
      <button className={`w-full mt-4 py-2 rounded-lg font-bold text-sm transition-colors duration-300 ${featured
        ? 'bg-black text-white hover:bg-black/90'
        : 'bg-black text-[var(--brand-red)] hover:bg-black/90'
        }`}>
        Reservar Ahora
      </button>
    </motion.div>
  );
});

PricingCard.displayName = 'PricingCard';

interface GalleryImageProps {
  src: string;
  alt: string;
  onClick: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = memo(({ src, alt, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative aspect-video overflow-hidden rounded-lg cursor-pointer"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <Play className="w-8 h-8 text-white" />
      </div>
    </motion.div>
  );
});

GalleryImage.displayName = 'GalleryImage';

// ========================================
// MAIN TRAINER MODAL COMPONENT
// ========================================

const TrainerModal: React.FC<TrainerModalProps> = memo(({
  trainer,
  isOpen,
  onClose,
  type = 'details'
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'achievements' | 'reviews' | 'pricing'>('about');
  const [imageError, setImageError] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoriteTrainers();

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('about');
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trainer.name} - ${trainer.role}`,
          text: trainer.bio,
          url: window.location.href
        });
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Share cancelled or failed');
        }
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookSession = (sessionType: string) => {
    // Handle booking logic
    if (process.env.NODE_ENV === 'development') {
      console.log(`Booking ${sessionType} session with ${trainer.name}`);
    }
  };

  const handleContactTrainer = () => {
    // Handle contact logic
    if (process.env.NODE_ENV === 'development') {
      console.log(`Contacting ${trainer.name}`);
    }
  };

  // Get min price for display
  const minPrice = Math.min(...trainer.pricing.privateSession.map(p => p.price));

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className="bg-white/95 backdrop-blur-md rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              {/* Background Image */}
              <div className="relative h-64 sm:h-80 overflow-hidden">
                {imageError ? (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-gray-500 mb-2">
                        {trainer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                    style={{
                      filter: 'grayscale(30%) contrast(1.2) brightness(0.9)',
                    }}
                    onError={() => setImageError(true)}
                  />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Quick Actions */}
                <div className="absolute top-4 right-20 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(trainer.id)}
                    className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${isFavorite(trainer.id)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-black/50 text-white hover:bg-[var(--brand-red)] hover:text-black'
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(trainer.id) ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[var(--brand-red)] hover:text-black transition-colors duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Trainer Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="max-w-3xl">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{trainer.name}</h1>
                    {trainer.nickname && (
                      <p className="text-lg font-medium opacity-90 mb-1">"{trainer.nickname}"</p>
                    )}
                    <p className="text-xl font-bold text-[var(--brand-red)]">{trainer.role}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < trainer.rating
                              ? 'fill-[var(--brand-red)] text-[var(--brand-red)]'
                              : 'fill-white/30 text-white/30'
                              }`}
                          />
                        ))}
                        <span className="ml-1 text-sm">
                          {trainer.rating} ({trainer.reviewCount} reseñas)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{trainer.stats.studentsCount} estudiantes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">Desde {formatPrice(minPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-black/10 bg-white/50">
                {[
                  { id: 'about', label: 'Acerca de', icon: User },
                  { id: 'achievements', label: 'Logros', icon: Trophy },
                  { id: 'reviews', label: 'Reseñas', icon: MessageSquare },
                  { id: 'pricing', label: 'Precios', icon: DollarSign }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200 border-b-2 ${isActive
                        ? 'text-[var(--brand-red)] border-[var(--brand-red)] bg-[var(--brand-red)]/10'
                        : 'text-black/60 border-transparent hover:text-black hover:bg-black/5'
                        }`}
                      whileHover={{ backgroundColor: isActive ? 'rgba(255,215,0,0.1)' : 'rgba(0,0,0,0.05)' }}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </motion.button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6 overflow-y-auto max-h-96">
                <AnimatePresence mode="wait">
                  {activeTab === 'about' && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-bold text-lg mb-3">Biografía</h3>
                        <p className="text-black/80 leading-relaxed">{trainer.bio}</p>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Especialidad</h3>
                        <p className="text-black/80 leading-relaxed">{trainer.specialty}</p>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Disciplinas</h3>
                        <div className="flex flex-wrap gap-2">
                          {trainer.disciplines.map((discipline) => (
                            <span
                              key={discipline}
                              className="px-3 py-1 bg-[var(--brand-red)]/20 text-black rounded-full text-sm font-medium"
                            >
                              {getDisciplineDisplayName(discipline)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-3">Estadísticas</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-black/5 rounded-lg p-3 text-center">
                            <Users className="w-6 h-6 text-[var(--brand-red)] mx-auto mb-2" />
                            <p className="font-bold text-lg">{trainer.stats.studentsCount}</p>
                            <p className="text-xs text-black/60">Estudiantes</p>
                          </div>
                          <div className="bg-black/5 rounded-lg p-3 text-center">
                            <Trophy className="w-6 h-6 text-[var(--brand-red)] mx-auto mb-2" />
                            <p className="font-bold text-lg">{trainer.stats.championsTrained}</p>
                            <p className="text-xs text-black/60">Campeones</p>
                          </div>
                          <div className="bg-black/5 rounded-lg p-3 text-center">
                            <Clock className="w-6 h-6 text-[var(--brand-red)] mx-auto mb-2" />
                            <p className="font-bold text-lg">{trainer.stats.yearsActive}</p>
                            <p className="text-xs text-black/60">Años activos</p>
                          </div>
                          <div className="bg-black/5 rounded-lg p-3 text-center">
                            <Zap className="w-6 h-6 text-[var(--brand-red)] mx-auto mb-2" />
                            <p className="font-bold text-lg">{trainer.rating}</p>
                            <p className="text-xs text-black/60">Rating</p>
                          </div>
                        </div>
                      </div>

                      {trainer.stats.specialMoves && trainer.stats.specialMoves.length > 0 && (
                        <div>
                          <h3 className="font-bold text-lg mb-3">Movimientos Especiales</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {trainer.stats.specialMoves.map((move, index) => (
                              <div key={index} className="bg-[var(--brand-red)]/10 text-black px-3 py-2 rounded-lg text-center text-sm font-medium">
                                {move}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'achievements' && (
                    <motion.div
                      key="achievements"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {trainer.achievements.map((achievement, index) => (
                          <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                            delay={index * 0.1}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      {/* Sample Reviews - In real app, these would come from API */}
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <ReviewCard
                            key={i}
                            review={{
                              id: `review-${i}`,
                              studentName: `Estudiante ${i}`,
                              rating: 5,
                              comment: 'Excelente entrenador, muy profesional y comprometido con el progreso de sus alumnos.',
                              date: new Date(2024, 0, i * 10),
                              verified: true,
                              helpful: i * 5
                            }}
                            delay={i * 0.1}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'pricing' && (
                    <motion.div
                      key="pricing"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trainer.pricing.privateSession.map((session, index) => (
                          <PricingCard
                            key={`private-${index}`}
                            title="Sesión Privada"
                            price={session.price}
                            duration={session.duration}
                            currency={session.currency}
                            includes={session.includes || ['Entrenamiento personalizado']}
                            featured={index === 0}
                            onSelect={() => handleBookSession(`private-${session.duration}min`)}
                          />
                        ))}
                        {trainer.pricing.groupSession.map((session, index) => (
                          <PricingCard
                            key={`group-${index}`}
                            title="Sesión Grupal"
                            price={session.price}
                            duration={session.duration}
                            currency={session.currency}
                            includes={session.includes || ['Dinámica de grupo', 'Compañeros de entrenamiento']}
                            onSelect={() => handleBookSession(`group-${session.duration}min`)}
                          />
                        ))}
                        {trainer.pricing.trialSession && (
                          <PricingCard
                            key="trial"
                            title="Clase de Prueba"
                            price={trainer.pricing.trialSession.price}
                            duration={trainer.pricing.trialSession.duration}
                            currency={trainer.pricing.trialSession.currency}
                            includes={trainer.pricing.trialSession.includes || ['Consulta gratuita']}
                            featured={true}
                            onSelect={() => handleBookSession('trial')}
                          />
                        )}
                      </div>

                      <div className="mt-6 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleContactTrainer}
                          className="bg-black text-[var(--brand-red)] px-8 py-3 rounded-xl font-bold text-lg hover:bg-black/90 transition-colors duration-300 flex items-center gap-2 mx-auto"
                        >
                          <Mail className="w-5 h-5" />
                          Contactar Directamente
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-black/10 p-4 bg-white/50">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBookSession('quick')}
                  className="flex-1 bg-[var(--brand-red)] text-black px-6 py-3 rounded-xl font-bold hover:bg-[var(--brand-red)]/90 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Reservar Sesión
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContactTrainer}
                  className="flex-1 bg-black text-[var(--brand-red)] px-6 py-3 rounded-xl font-bold hover:bg-black/90 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Enviar Mensaje
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

TrainerModal.displayName = 'TrainerModal';

export default TrainerModal;