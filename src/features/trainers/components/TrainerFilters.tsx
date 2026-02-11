/**
 * Interactive TrainerFilters Component
 * Feature-First Architecture - Advanced filtering system
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Star,
  DollarSign,
  Users,
  Award,
  Globe,
  Calendar,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import {
  Discipline,
  ExperienceLevel,
  Language,
  SortField
} from '../types/trainers';
import type { TrainerFilters as TrainerFiltersType } from '../types/trainers';
import { useTrainersFilters } from '../hooks/useTrainers';
import { getDisciplineDisplayName, getExperienceDisplayName } from '../services/trainersData';

// ========================================
// PROPS INTERFACE
// ========================================

interface TrainerFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onFiltersChange?: (filters: Partial<TrainerFiltersType>) => void;
  className?: string;
  compact?: boolean;
}

// ========================================
// FILTER SECTION COMPONENT
// ========================================

interface FilterSectionProps {
  title: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = memo(({
  title,
  icon: Icon,
  children,
  defaultOpen = true
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      className="border border-black/10 rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm"
      initial={false}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-black/5 transition-colors duration-200"
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[var(--brand-red)]" />
          <span className="font-semibold text-black">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-black/60" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-t border-black/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FilterSection.displayName = 'FilterSection';

// ========================================
// DISCIPLINE FILTER
// ========================================

const DisciplineFilter: React.FC = memo(() => {
  const { filters, addDiscipline, removeDiscipline } = useTrainersFilters();

  const disciplines = Object.values(Discipline);

  const toggleDiscipline = (discipline: Discipline) => {
    if (filters.disciplines.includes(discipline)) {
      removeDiscipline(discipline);
    } else {
      addDiscipline(discipline);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {disciplines.map((discipline) => {
        const isSelected = filters.disciplines.includes(discipline);
        return (
          <motion.button
            key={discipline}
            onClick={() => toggleDiscipline(discipline)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${isSelected
              ? 'bg-[var(--brand-red)] text-black border-[var(--brand-red)]'
              : 'bg-white/70 text-black/70 border-black/20 hover:bg-black/10'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {getDisciplineDisplayName(discipline)}
          </motion.button>
        );
      })}
    </div>
  );
});

DisciplineFilter.displayName = 'DisciplineFilter';

// ========================================
// EXPERIENCE LEVEL FILTER
// ========================================

const ExperienceFilter: React.FC = memo(() => {
  const { filters, addExperienceLevel, removeExperienceLevel } = useTrainersFilters();

  const levels = Object.values(ExperienceLevel);

  const toggleLevel = (level: ExperienceLevel) => {
    if (filters.experienceLevels.includes(level)) {
      removeExperienceLevel(level);
    } else {
      addExperienceLevel(level);
    }
  };

  const levelColors = {
    [ExperienceLevel.BEGINNER]: 'bg-green-500',
    [ExperienceLevel.INTERMEDIATE]: 'bg-blue-500',
    [ExperienceLevel.ADVANCED]: 'bg-purple-500',
    [ExperienceLevel.PROFESSIONAL]: 'bg-indigo-500',
    [ExperienceLevel.ELITE]: 'bg-gradient-to-r from-sky-400 to-indigo-500'
  };

  return (
    <div className="space-y-2">
      {levels.map((level) => {
        const isSelected = filters.experienceLevels.includes(level);
        return (
          <motion.button
            key={level}
            onClick={() => toggleLevel(level)}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center gap-3 ${isSelected
              ? 'bg-black/10 text-black border-black/30'
              : 'bg-white/70 text-black/70 border-black/20 hover:bg-black/5'
              }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className={`w-3 h-3 rounded-full ${levelColors[level]}`} />
            {getExperienceDisplayName(level)}
          </motion.button>
        );
      })}
    </div>
  );
});

ExperienceFilter.displayName = 'ExperienceFilter';

// ========================================
// RATING FILTER
// ========================================

const RatingFilter: React.FC = memo(() => {
  const { filters, setRating } = useTrainersFilters();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-black/70">Calificación mínima</span>
        <span className="font-bold text-black">{filters.rating > 0 ? `${filters.rating}+` : 'Todos'}</span>
      </div>

      <div className="space-y-2">
        {[4, 3, 2, 1].map((rating) => {
          const isSelected = filters.rating === rating;
          return (
            <motion.button
              key={rating}
              onClick={() => setRating(isSelected ? 0 : rating)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border ${isSelected
                ? 'bg-[var(--brand-red)]/20 text-black border-[var(--brand-red)]'
                : 'bg-white/70 text-black/70 border-black/20 hover:bg-black/5'
                }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${star <= rating
                      ? 'fill-[var(--brand-red)] text-[var(--brand-red)]'
                      : 'fill-gray-300 text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {rating} estrellas o más
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

RatingFilter.displayName = 'RatingFilter';

// ========================================
// PRICE RANGE FILTER
// ========================================

const PriceRangeFilter: React.FC = memo(() => {
  const { filters, setPriceRange } = useTrainersFilters();

  const priceRanges = [
    { label: 'Económico ($0-$50)', min: 0, max: 50 },
    { label: 'Estándar ($50-$100)', min: 50, max: 100 },
    { label: 'Premium ($100-$200)', min: 100, max: 200 },
    { label: 'Lujo ($200+)', min: 200, max: 500 }
  ];

  const selectedRange = priceRanges.find(
    range => filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-black/70">Rango de precios</span>
        <span className="font-bold text-black">
          ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </span>
      </div>

      <div className="space-y-2">
        {priceRanges.map((range) => {
          const isSelected = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
          return (
            <motion.button
              key={`${range.min}-${range.max}`}
              onClick={() => setPriceRange([range.min, range.max])}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 border ${isSelected
                ? 'bg-[var(--brand-red)]/20 text-black border-[var(--brand-red)]'
                : 'bg-white/70 text-black/70 border-black/20 hover:bg-black/5'
                }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <DollarSign className="w-4 h-4" />
              {range.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

PriceRangeFilter.displayName = 'PriceRangeFilter';

// ========================================
// LANGUAGE FILTER
// ========================================

const LanguageFilter: React.FC = memo(() => {
  const { filters, addLanguage, removeLanguage } = useTrainersFilters();

  const languages = Object.values(Language);

  const languageNames = {
    [Language.SPANISH]: 'Español',
    [Language.ENGLISH]: 'English',
    [Language.PORTUGUESE]: 'Português',
    [Language.FRENCH]: 'Français',
    [Language.ITALIAN]: 'Italiano',
    [Language.GERMAN]: 'Deutsch'
  };

  const toggleLanguage = (language: Language) => {
    if (filters.languages.includes(language)) {
      removeLanguage(language);
    } else {
      addLanguage(language);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {languages.map((language) => {
        const isSelected = filters.languages.includes(language);
        return (
          <motion.button
            key={language}
            onClick={() => toggleLanguage(language)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border flex items-center gap-1 ${isSelected
              ? 'bg-[var(--brand-red)] text-black border-[var(--brand-red)]'
              : 'bg-white/70 text-black/70 border-black/20 hover:bg-black/10'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Globe className="w-3 h-3" />
            {languageNames[language] || language}
          </motion.button>
        );
      })}
    </div>
  );
});

LanguageFilter.displayName = 'LanguageFilter';

// ========================================
// SORT OPTIONS
// ========================================

const SortOptions: React.FC = memo(() => {
  const { sortBy, setSortOption } = useTrainersFilters();

  const sortOptions: { field: SortField; label: string; description: string }[] = [
    { field: 'rating', label: 'Mejor calificados', description: 'Ordenar por rating' },
    { field: 'experience', label: 'Más experiencia', description: 'Ordenar por años activos' },
    { field: 'students', label: 'Más populares', description: 'Ordenar por número de estudiantes' },
    { field: 'champions', label: 'Más campeones', description: 'Ordenar por campeones entrenados' },
    { field: 'price', label: 'Menor precio', description: 'Ordenar por precio' },
    { field: 'name', label: 'Nombre A-Z', description: 'Ordenar alfabéticamente' }
  ];

  return (
    <div className="space-y-2">
      {sortOptions.map((option) => {
        const isSelected = sortBy.field === option.field;
        return (
          <motion.button
            key={option.field}
            onClick={() => setSortOption({
              field: option.field,
              direction: option.field === 'name' ? 'asc' : 'desc'
            })}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 border ${isSelected
              ? 'bg-[var(--brand-red)]/20 text-black border-[var(--brand-red)]'
              : 'bg-white/70 text-black/70 border-black/20 hover:bg-black/5'
              }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="font-medium text-sm">{option.label}</div>
            <div className="text-xs text-black/60">{option.description}</div>
          </motion.button>
        );
      })}
    </div>
  );
});

SortOptions.displayName = 'SortOptions';

// ========================================
// ACTIVE FILTERS DISPLAY
// ========================================

const ActiveFilters: React.FC = memo(() => {
  const {
    filters,
    hasActiveFilters,
    removeFilter,
    clearFilters,
    activeFiltersCount
  } = useTrainersFilters();

  if (!hasActiveFilters) return null;

  const getFilterDisplayName = (key: keyof TrainerFiltersType, value: any): string => {
    switch (key) {
      case 'disciplines':
        return getDisciplineDisplayName(value);
      case 'experienceLevels':
        return getExperienceDisplayName(value);
      case 'rating':
        return `${value}+ estrellas`;
      case 'priceRange':
        return `$${value[0]}-$${value[1]}`;
      case 'languages':
        const languageNames: Record<Language, string> = {
          [Language.SPANISH]: 'Español',
          [Language.ENGLISH]: 'English',
          [Language.PORTUGUESE]: 'Português',
          [Language.FRENCH]: 'Français',
          [Language.ITALIAN]: 'Italiano',
          [Language.GERMAN]: 'Deutsch'
        };
        // Type guard to ensure value is a valid Language
        const isValidLanguage = (val: any): val is Language =>
          Object.values(Language).includes(val);
        return isValidLanguage(value) ? languageNames[value] : String(value);
      case 'featuredOnly':
        return 'Solo destacados';
      default:
        return String(value);
    }
  };

  const activeFilterTags: Array<{ key: keyof TrainerFiltersType; value: any; label: string }> = [];

  // Collect active filters
  filters.disciplines.forEach((discipline: Discipline) => {
    activeFilterTags.push({
      key: 'disciplines',
      value: discipline,
      label: getDisciplineDisplayName(discipline)
    });
  });

  filters.experienceLevels.forEach((level: ExperienceLevel) => {
    activeFilterTags.push({
      key: 'experienceLevels',
      value: level,
      label: getExperienceDisplayName(level)
    });
  });

  if (filters.rating > 0) {
    activeFilterTags.push({
      key: 'rating',
      value: filters.rating,
      label: `${filters.rating}+ estrellas`
    });
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
    activeFilterTags.push({
      key: 'priceRange',
      value: filters.priceRange,
      label: `$${filters.priceRange[0]}-$${filters.priceRange[1]}`
    });
  }

  filters.languages.forEach((language: Language) => {
    activeFilterTags.push({
      key: 'languages',
      value: language,
      label: getFilterDisplayName('languages', language)
    });
  });

  if (filters.featuredOnly) {
    activeFilterTags.push({
      key: 'featuredOnly',
      value: true,
      label: 'Solo destacados'
    });
  }

  const handleRemoveFilter = (key: keyof TrainerFiltersType, value: any) => {
    removeFilter(key);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 p-3 bg-[var(--brand-red)]/10 rounded-lg border border-[var(--brand-red)]/20"
    >
      <span className="text-sm font-medium text-black mr-2">
        Filtros activos ({activeFiltersCount}):
      </span>

      <AnimatePresence mode="popLayout">
        {activeFilterTags.map((filter, index) => (
          <motion.button
            key={`${filter.key}-${filter.value}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleRemoveFilter(filter.key, filter.value)}
            className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--brand-red)] text-black rounded-full text-xs font-medium hover:bg-[var(--brand-red)]/80 transition-colors duration-200"
          >
            {filter.label}
            <X className="w-3 h-3" />
          </motion.button>
        ))}
      </AnimatePresence>

      <motion.button
        onClick={clearFilters}
        className="inline-flex items-center gap-1 px-2 py-1 bg-black/20 text-black rounded-full text-xs font-medium hover:bg-black/30 transition-colors duration-200 ml-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw className="w-3 h-3" />
        Limpiar todo
      </motion.button>
    </motion.div>
  );
});

ActiveFilters.displayName = 'ActiveFilters';

// ========================================
// MAIN FILTERS COMPONENT
// ========================================

const TrainerFilters: React.FC<TrainerFiltersProps> = memo(({
  isOpen,
  onClose,
  onFiltersChange,
  className = '',
  compact = false
}) => {
  const {
    filters,
    hasActiveFilters,
    clearFilters,
    updateFilters
  } = useTrainersFilters();

  // Notify parent when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleClearAll = () => {
    clearFilters();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 ${compact ? 'relative' : ''}`}
          onClick={compact ? undefined : onClose}
        >
          {/* Backdrop */}
          {!compact && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
          )}

          {/* Filters Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className={`absolute right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden ${compact ? 'relative w-full' : 'h-full'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-black/10 px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[var(--brand-red)]" />
                  <h2 className="text-lg font-bold text-black">Filtros de Entrenadores</h2>
                  {hasActiveFilters && (
                    <span className="bg-[var(--brand-red)] text-black text-xs px-2 py-1 rounded-full font-bold">
                      {Object.values(filters).filter(f =>
                        Array.isArray(f) ? f.length > 0 : f !== false && f !== 0 && (!Array.isArray(f) ? f : true)
                      ).length}
                    </span>
                  )}
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-black" />
                </motion.button>
              </div>
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Active Filters */}
              <ActiveFilters />

              {/* Discipline Filter */}
              <FilterSection title="Disciplinas" icon={Award}>
                <DisciplineFilter />
              </FilterSection>

              {/* Experience Level Filter */}
              <FilterSection title="Nivel de Experiencia" icon={Users}>
                <ExperienceFilter />
              </FilterSection>

              {/* Rating Filter */}
              <FilterSection title="Calificación" icon={Star}>
                <RatingFilter />
              </FilterSection>

              {/* Price Range Filter */}
              <FilterSection title="Rango de Precios" icon={DollarSign}>
                <PriceRangeFilter />
              </FilterSection>

              {/* Language Filter */}
              <FilterSection title="Idiomas" icon={Globe}>
                <LanguageFilter />
              </FilterSection>

              {/* Sort Options */}
              <FilterSection title="Ordenar por" icon={Filter}>
                <SortOptions />
              </FilterSection>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-black/10 px-4 py-4">
              <div className="flex gap-2">
                <motion.button
                  onClick={handleClearAll}
                  className="flex-1 px-4 py-2 bg-black/10 text-black rounded-lg font-medium hover:bg-black/20 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Limpiar Filtros
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-[var(--brand-red)] text-black rounded-lg font-bold hover:bg-[var(--brand-red)]/90 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Aplicar Filtros
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

TrainerFilters.displayName = 'TrainerFilters';

export default TrainerFilters;