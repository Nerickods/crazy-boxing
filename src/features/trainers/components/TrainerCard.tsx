/**
 * Enhanced TrainerCard Component
 * Feature-First Architecture - Premium trainer card with rating system
 */

'use client';

import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  Users,
  Trophy,
  MapPin,
  Clock,
  DollarSign,
  Award,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { Trainer, Discipline, ExperienceLevel } from '../types/trainers';
import { useTrainerModal, useFavoriteTrainers } from '../hooks/useTrainers';
import { getDisciplineDisplayName, getExperienceDisplayName, formatPrice } from '../services/trainersData';
import {
  cardEntrance,
  cardHover,
  buttonHover,
  fadeInUp,
  scaleIn
} from '../../../shared/animations';
import { colors, shadows, borderRadius, spacing, goldTheme, gradients } from '../../../shared/constants/visual';

// ========================================
// PROPS INTERFACE
// ========================================

interface TrainerCardProps {
  trainer: Trainer;
  variant?: 'default' | 'compact' | 'featured';
  showQuickActions?: boolean;
  animationDelay?: number;
  onClick?: (trainer: Trainer) => void;
  className?: string;
}

// ========================================
// SUB-COMPONENTS
// ========================================

interface StarRatingProps {
  rating: number;
  reviewCount: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = memo(({
  rating,
  reviewCount,
  showCount = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${star <= rating
                ? 'fill-current text-current'
                : 'fill-gray-300 text-gray-300'
              } transition-colors duration-200`}
            style={{
              color: star <= rating ? colors.accent.primary : undefined
            }}
          />
        ))}
      </div>
      {showCount && (
        <span className={`${textSizes[size]} font-medium ml-1`} style={{ color: colors.gray[600] }}>
          {rating} ({reviewCount})
        </span>
      )}
    </div>
  );
});

StarRating.displayName = 'StarRating';

interface DisciplineTagProps {
  discipline: Discipline;
  size?: 'sm' | 'md';
}

const DisciplineTag: React.FC<DisciplineTagProps> = memo(({ discipline, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs px-3 py-1'
  };

  return (
    <span
      className={`inline-block ${sizeClasses[size]} rounded-full font-medium`}
      style={{
        backgroundColor: `${colors.gray[100]}80`,
        color: colors.gray[700]
      }}
    >
      {getDisciplineDisplayName(discipline)}
    </span>
  );
});

DisciplineTag.displayName = 'DisciplineTag';

interface ExperienceBadgeProps {
  level: ExperienceLevel;
}

const ExperienceBadge: React.FC<ExperienceBadgeProps> = memo(({ level }) => {
  const colors = {
    [ExperienceLevel.BEGINNER]: 'bg-green-500',
    [ExperienceLevel.INTERMEDIATE]: 'bg-blue-500',
    [ExperienceLevel.ADVANCED]: 'bg-purple-500',
    [ExperienceLevel.PROFESSIONAL]: 'bg-indigo-500',
    [ExperienceLevel.ELITE]: 'bg-gradient-to-r from-sky-400 to-indigo-500'
  };

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white font-bold text-xs ${colors[level]}`}>
      <Award className="w-3 h-3" />
      {getExperienceDisplayName(level)}
    </div>
  );
});

ExperienceBadge.displayName = 'ExperienceBadge';

interface PriceTagProps {
  price: number;
  currency?: string;
  showFrom?: boolean;
}

const PriceTag: React.FC<PriceTagProps> = memo(({ price, currency = 'USD', showFrom = true }) => {
  const formattedPrice = formatPrice(price, currency);

  return (
    <div className="flex items-center gap-1 text-black/80">
      <DollarSign className="w-3 h-3" />
      <span className="font-semibold text-sm">
        {showFrom && 'Desde '}{formattedPrice}
      </span>
      <span className="text-xs">/hora</span>
    </div>
  );
});

PriceTag.displayName = 'PriceTag';

// ========================================
// QUICK ACTIONS OVERLAY
// ========================================

interface QuickActionsProps {
  trainer: Trainer;
  onQuickView: () => void;
  onAddToCompare: () => void;
  onContact: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = memo(({
  trainer,
  onQuickView,
  onAddToCompare,
  onContact
}) => {
  const { toggleFavorite, isFavorite } = useFavoriteTrainers();

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(trainer.id);
  };

  return (
    <motion.div
      className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
      initial={{ opacity: 0, x: 20 }}
      whileHover={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleFavorite}
        className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${isFavorite(trainer.id)
            ? 'bg-indigo-500 text-white'
            : 'bg-black/80 text-white hover:bg-white/90 hover:text-black'
          }`}
        title={isFavorite(trainer.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        <Heart className={`w-4 h-4 ${isFavorite(trainer.id) ? 'fill-current' : ''}`} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onQuickView}
        className="w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[var(--brand-red)] hover:text-black transition-all duration-300"
        title="Vista rápida"
      >
        <ExternalLink className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAddToCompare}
        className="w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[var(--brand-red)] hover:text-black transition-all duration-300"
        title="Comparar"
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
});

QuickActions.displayName = 'QuickActions';

// ========================================
// SOCIAL MEDIA LINKS
// ========================================

interface SocialLinksProps {
  socialMedia: Trainer['socialMedia'];
}

const SocialLinks: React.FC<SocialLinksProps> = memo(({ socialMedia }) => {
  const links = [
    { icon: Instagram, url: socialMedia.instagram, label: 'Instagram' },
    { icon: Facebook, url: socialMedia.facebook, label: 'Facebook' },
    { icon: Youtube, url: socialMedia.youtube, label: 'YouTube' }
  ].filter(link => link.url);

  if (links.length === 0) return null;

  return (
    <div className="flex gap-2">
      {links.map((link, index) => (
        <motion.a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-black hover:bg-[var(--brand-red)] hover:text-black transition-colors duration-300"
          title={link.label}
        >
          <link.icon className="w-4 h-4" />
        </motion.a>
      ))}
    </div>
  );
});

SocialLinks.displayName = 'SocialLinks';

// ========================================
// MAIN TRAINER CARD COMPONENT
// ========================================

const TrainerCard: React.FC<TrainerCardProps> = memo(({
  trainer,
  variant = 'default',
  showQuickActions = true,
  animationDelay = 0,
  onClick,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const { openTrainerDetails, openBookingModal, openCompareModal } = useTrainerModal();

  const handleCardClick = () => {
    if (onClick) {
      onClick(trainer);
    } else {
      openTrainerDetails(trainer);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openTrainerDetails(trainer);
  };

  const handleAddToCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCompareModal(trainer);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle contact action
  };

  const handleBookSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    openBookingModal(trainer);
  };

  // Wrapper functions for QuickActions component (without event parameters)
  const handleQuickViewClick = () => openTrainerDetails(trainer);
  const handleAddToCompareClick = () => openCompareModal(trainer);
  const handleContactClick = () => {
    // Handle contact action
  };

  // Variant-specific classes
  const variantClasses = {
    default: 'max-w-sm',
    compact: 'max-w-xs',
    featured: 'max-w-md ring-2 ring-[var(--brand-red)] ring-offset-2'
  };

  // Get min price for display
  const minPrice = Math.min(...trainer.pricing.privateSession.map(p => p.price));

  return (
    <motion.div
      variants={cardEntrance}
      initial="initial"
      animate="animate"
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, type: 'spring' as const, damping: 15 }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.6,
        delay: animationDelay
      }}
      viewport={{ once: true }}
      className={`group ${variantClasses[variant]} ${className}`}
    >
      <motion.div
        onClick={handleCardClick}
        className="overflow-hidden cursor-pointer relative"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
          backdropFilter: 'blur(8px)',
          borderRadius: borderRadius['2xl'],
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: shadows.lg
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: shadows.xl,
          borderColor: `${colors.accent.primary}50`
        }}
      >
        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <QuickActions
            trainer={trainer}
            onQuickView={handleQuickViewClick}
            onAddToCompare={handleAddToCompareClick}
            onContact={handleContactClick}
          />
        )}

        {/* Featured Badge */}
        {trainer.featured && (
          <div className="absolute top-4 left-4 z-10">
            <motion.div
              variants={scaleIn}
              initial="initial"
              animate="animate"
              transition={{ delay: animationDelay + 0.3 }}
              className="flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs"
              style={{
                background: gradients.gold.primary,
                color: colors.text.inverse,
                boxShadow: shadows.gold.medium
              }}
            >
              <Trophy className="w-3 h-3" />
              DESTACADO
            </motion.div>
          </div>
        )}

        {/* Trainer Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <AnimatePresence mode="wait">
            {imageError ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-500 mb-2">
                    {trainer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-sm text-gray-600">Foto no disponible</div>
                </div>
              </div>
            ) : (
              <motion.img
                key={trainer.image}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                src={trainer.image}
                alt={`${trainer.name} - ${trainer.role}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  filter: 'grayscale(20%) contrast(1.1) brightness(0.95)',
                }}
                onError={() => setImageError(true)}
              />
            )}
          </AnimatePresence>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Rating Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: animationDelay + 0.2 }}
              className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg"
            >
              <StarRating rating={trainer.rating} reviewCount={trainer.reviewCount} size="sm" />
            </motion.div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div className="mb-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <h3
                  className="font-bold text-lg sm:text-xl leading-tight transition-colors duration-300"
                  style={{
                    color: colors.text.primary,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = colors.accent.primary }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = colors.text.primary }}
                >
                  {trainer.name}
                </h3>
                {trainer.nickname && (
                  <p className="text-xs font-medium text-black/60 italic">
                    "{trainer.nickname}"
                  </p>
                )}
              </div>
              <ExperienceBadge level={trainer.experience} />
            </div>

            <p className="text-sm font-bold text-black/80 uppercase tracking-wide">
              {trainer.role}
            </p>
          </div>

          {/* Disciplines */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {trainer.disciplines.slice(0, variant === 'compact' ? 2 : 3).map((discipline) => (
                <DisciplineTag key={discipline} discipline={discipline} size="sm" />
              ))}
              {trainer.disciplines.length > (variant === 'compact' ? 2 : 3) && (
                <span className="text-xs text-black/60 font-medium">
                  +{trainer.disciplines.length - (variant === 'compact' ? 2 : 3)} más
                </span>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: `${colors.gray[100]}30` }}
            >
              <Users className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent.primary }} />
              <p className="text-xs font-bold" style={{ color: colors.gray[700] }}>{trainer.stats.studentsCount}</p>
              <p className="text-xs" style={{ color: colors.gray[500] }}>Estudiantes</p>
            </div>
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: `${colors.gray[100]}30` }}
            >
              <Trophy className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent.primary }} />
              <p className="text-xs font-bold" style={{ color: colors.gray[700] }}>{trainer.stats.championsTrained}</p>
              <p className="text-xs" style={{ color: colors.gray[500] }}>Campeones</p>
            </div>
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: `${colors.gray[100]}30` }}
            >
              <Clock className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent.primary }} />
              <p className="text-xs font-bold" style={{ color: colors.gray[700] }}>{trainer.stats.yearsActive}</p>
              <p className="text-xs" style={{ color: colors.gray[500] }}>Años</p>
            </div>
          </div>

          {/* Bio (only in default/featured variant) */}
          {variant !== 'compact' && (
            <p className="text-sm text-black/70 line-clamp-2 mb-4 leading-relaxed">
              {trainer.bio}
            </p>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between border-t border-black/10 pt-3">
            <PriceTag price={minPrice} />
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: shadows.gold.button,
                background: `${colors.primary}e6`
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookSession}
              className="px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-all duration-300"
              style={{
                background: colors.primary,
                color: colors.accent.primary,
                boxShadow: shadows.gold.subtle
              }}
            >
              <CheckCircle className="w-3 h-3" />
              Reservar
            </motion.button>
          </div>
        </div>

        {/* Social Links (footer) */}
        {variant !== 'compact' && (
          <div className="px-4 pb-4 pt-0 border-t border-black/5">
            <SocialLinks socialMedia={trainer.socialMedia} />
          </div>
        )}

        {/* Hover Effect Gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          initial={false}
          style={{
            background: gradients.gold.radial,
            opacity: 0
          }}
          whileHover={{
            opacity: 0.1
          }}
        />
      </motion.div>
    </motion.div>
  );
});

TrainerCard.displayName = 'TrainerCard';

export default TrainerCard;