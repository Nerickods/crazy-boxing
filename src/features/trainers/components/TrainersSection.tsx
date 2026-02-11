/**
 * Main TrainersSection Component
 * Feature-First Architecture - Complete trainers section with all features
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrophy,
  FaInstagram,
  FaFacebook,
  FaUsers,
  FaStar,
  FaFilter,
  FaSearch,
  FaHeart,
  FaTimes,
  FaArrowLeft,
  FaArrowRight
} from 'react-icons/fa';
import {
  Search,
  Filter,
  Users,
  Trophy,
  Star,
  Heart,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useTrainers, useTrainersFilters, useTrainerModal } from '../hooks/useTrainers';
import TrainerCard from './TrainerCard';
import TrainerFilters from './TrainerFilters';
import TrainerModal from './TrainerModal';
import { Discipline, ExperienceLevel } from '../types/trainers';
import { trainersService, getDisciplineDisplayName } from '../services/trainersData';

// ========================================
// PROPS INTERFACE
// ========================================

interface TrainersSectionProps {
  featuredOnly?: boolean;
  discipline?: Discipline;
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  limit?: number;
  className?: string;
}

// ========================================
// SECTION HEADER COMPONENT
// ========================================

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  stats?: {
    total: number;
    featured: number;
    averageRating: number;
  };
  onFilterToggle?: () => void;
  onSearchToggle?: () => void;
  activeFiltersCount?: number;
  showActions?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  stats,
  onFilterToggle,
  onSearchToggle,
  activeFiltersCount = 0,
  showActions = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-3 bg-black/20 backdrop-blur-sm border border-black/30 rounded-full px-6 py-3 mb-8"
      >
        <Trophy className="text-black text-xl" />
        <span className="text-black font-bold tracking-wide uppercase">NUESTRO EQUIPO</span>
      </motion.div>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="text-5xl md:text-7xl font-black text-black mb-6 leading-tight tracking-tight"
      >
        {title.split(' ').map((word, index, array) => (
          <React.Fragment key={index}>
            {word}
            {index < array.length - 1 && ' '}
          </React.Fragment>
        ))}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-xl text-black/80 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Stats Bar */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full">
            <Users className="w-4 h-4 text-[var(--brand-red)]" />
            <span className="font-bold text-black">{stats.total}</span>
            <span className="text-black/70">Entrenadores</span>
          </div>
          <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full">
            <Trophy className="w-4 h-4 text-[var(--brand-red)]" />
            <span className="font-bold text-black">{stats.featured}</span>
            <span className="text-black/70">Destacados</span>
          </div>
          <div className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full">
            <Star className="w-4 h-4 text-[var(--brand-red)]" />
            <span className="font-bold text-black">{stats.averageRating.toFixed(1)}</span>
            <span className="text-black/70">Rating Promedio</span>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {onFilterToggle && (
            <motion.button
              onClick={onFilterToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeFiltersCount > 0
                ? 'bg-[var(--brand-red)] text-black'
                : 'bg-black/20 text-black hover:bg-black/30'
                }`}
            >
              <Filter className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-black/30 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </motion.button>
          )}
          {onSearchToggle && (
            <motion.button
              onClick={onSearchToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-black/20 text-black px-6 py-3 rounded-xl font-bold hover:bg-black/30 transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              Buscar
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// ========================================
// SEARCH BAR COMPONENT
// ========================================

interface SearchBarProps {
  isVisible: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isVisible, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query.trim()) {
      // Generate suggestions based on trainers
      const mockSuggestions = [
        'Carlos Mendez',
        'Ana Rodriguez',
        'Miguel Torres',
        'Boxeo',
        'Kickboxing',
        'BJJ',
        'Muay Thai'
      ].filter(s => s.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(mockSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      onClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar entrenadores, disciplinas o especialidades..."
            className="w-full px-6 py-4 pr-24 bg-white/80 backdrop-blur-sm border-2 border-black/20 rounded-2xl text-black placeholder-black/50 focus:border-[var(--brand-red)] focus:outline-none transition-colors duration-300"
            autoFocus
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <motion.button
                type="button"
                onClick={() => setQuery('')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center hover:bg-black/20 transition-colors duration-200"
              >
                <FaTimes className="w-3 h-3 text-black/60" />
              </motion.button>
            )}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-[var(--brand-red)] text-black rounded-full flex items-center justify-center hover:bg-[var(--brand-red)]/90 transition-colors duration-300"
            >
              <Search className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 bg-white/80 backdrop-blur-sm border border-black/10 rounded-xl overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  className="w-full px-6 py-3 text-left text-black hover:bg-black/5 transition-colors duration-200 border-b border-black/5 last:border-b-0"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};

// ========================================
// TRAINERS GRID COMPONENT
// ========================================

interface TrainersGridProps {
  trainers: any[];
  loading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';
  onLoadMore: () => void;
  hasMore: boolean;
}

const TrainersGrid: React.FC<TrainersGridProps> = ({
  trainers,
  loading,
  error,
  viewMode,
  onLoadMore,
  hasMore
}) => {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-indigo-600 font-bold mb-4">Error al cargar entrenadores</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors duration-300"
        >
          Reintentar
        </button>
      </motion.div>
    );
  }

  if (trainers.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Users className="w-16 h-16 text-black/30 mx-auto mb-4" />
        <p className="text-black/60 font-bold mb-2">No se encontraron entrenadores</p>
        <p className="text-black/50">Intenta ajustar los filtros o realizar una nueva búsqueda</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid/List View */}
      <div className={viewMode === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        : "space-y-4 max-w-4xl mx-auto"
      }>
        <AnimatePresence mode="wait">
          {trainers.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TrainerCard
                trainer={trainer}
                variant={viewMode === 'grid' ? 'default' : 'compact'}
                animationDelay={index * 0.1}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <motion.button
            onClick={onLoadMore}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            className="bg-black text-[var(--brand-red)] px-8 py-4 rounded-xl font-bold text-xl border-2 border-black hover:bg-black/90 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-[var(--brand-red)] border-t-transparent rounded-full animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                Cargar Más Entrenadores
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

// ========================================
// CTA SECTION COMPONENT
// ========================================

const CTASection: React.FC = () => {
  const scrollToForm = () => {
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      viewport={{ once: true }}
      className="text-center mt-16"
    >
      <div className="bg-black/20 backdrop-blur-sm border border-black/30 rounded-3xl p-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-6 h-6 text-[var(--brand-red)]" />
          <h3 className="text-3xl md:text-4xl font-bold text-black">
            ¿Listo para transformar tu vida?
          </h3>
          <Sparkles className="w-6 h-6 text-[var(--brand-red)]" />
        </motion.div>
        <p className="text-black/80 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
          Únete a cientos de estudiantes que ya han transformado sus vidas con nuestros campeones.
          Tu primera visita es completamente gratis.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={scrollToForm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[var(--brand-red)] text-black px-8 py-4 rounded-xl font-bold text-xl hover:bg-[var(--brand-red)]/90 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
          >
            Iniciar Gratuitamente
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent text-black border-2 border-black px-8 py-4 rounded-xl font-bold text-xl hover:bg-black hover:text-[var(--brand-red)] transition-all duration-300"
          >
            Ver Horarios
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ========================================
// MAIN TRAINERS SECTION COMPONENT
// ========================================

const TrainersSection: React.FC<TrainersSectionProps> = ({
  featuredOnly = false,
  discipline,
  title = featuredOnly ? "Entrenadores Destacados" : "Conoce a Nuestros Campeones",
  subtitle = featuredOnly
    ? "Los mejores entrenadores seleccionados por su excelencia y resultados"
    : "Aprende de los mejores. Campeones mundiales, expertos en disciplinas de combate y transformadores de vidas.",
  showFilters: showFiltersProp = !featuredOnly,
  limit,
  className = ''
}) => {
  const [showFilters, setShowFilters] = useState(showFiltersProp);
  const [showSearch, setShowSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Use the trainers hook
  const {
    trainers,
    filteredTrainers,
    loading,
    error,
    hasMore,
    loadMore,
    search
  } = useTrainers({
    autoLoad: true,
    featuredOnly,
    discipline,
    pageSize: limit || 12
  });

  // Use filters hook
  const { activeFiltersCount, hasActiveFilters } = useTrainersFilters();

  // Use modal hook
  const { modalState, closeModal } = useTrainerModal();

  // Display trainers (filtered or all)
  const displayTrainers = hasActiveFilters ? filteredTrainers : trainers;

  // Calculate stats for header
  const stats = React.useMemo(() => ({
    total: trainers?.length || 0,
    featured: trainers?.filter((t: any) => t.featured).length || 0,
    averageRating: trainers?.reduce((sum: number, t: any) => sum + t.rating, 0) / (trainers?.length || 1) || 0
  }), [trainers]);

  const handleSearch = (query: string) => {
    search(query);
  };

  return (
    <section id="entrenadores" className={`py-16 bg-gradient-to-br from-[var(--brand-red)] via-black to-[var(--brand-red)] relative overflow-hidden ${className}`}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-black/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-black/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-black/2 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <SectionHeader
          title={title}
          subtitle={subtitle}
          stats={stats}
          onFilterToggle={showFilters ? () => setShowFilters(!showFilters) : undefined}
          onSearchToggle={() => setShowSearch(!showSearch)}
          activeFiltersCount={activeFiltersCount}
          showActions={!featuredOnly}
        />

        {/* Search Bar */}
        <AnimatePresence>
          <SearchBar
            isVisible={showSearch}
            onClose={() => setShowSearch(false)}
            onSearch={handleSearch}
          />
        </AnimatePresence>

        {/* View Mode Toggle (only if not featured only) */}
        {!featuredOnly && trainers && trainers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end mb-6"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-black/10 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors duration-200 ${viewMode === 'grid'
                  ? 'bg-[var(--brand-red)] text-black'
                  : 'text-black/60 hover:text-black'
                  }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors duration-200 ${viewMode === 'list'
                  ? 'bg-[var(--brand-red)] text-black'
                  : 'text-black/60 hover:text-black'
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Trainers Grid */}
        <TrainersGrid
          trainers={displayTrainers || []}
          loading={loading}
          error={error?.message || null}
          viewMode={viewMode}
          onLoadMore={loadMore}
          hasMore={hasMore && !featuredOnly}
        />

        {/* CTA Section */}
        {!featuredOnly && <CTASection />}
      </div>

      {/* Filters Modal */}
      <TrainerFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Trainer Modal */}
      <AnimatePresence>
        {modalState.isOpen && modalState.trainer && (
          <TrainerModal
            trainer={modalState.trainer}
            isOpen={modalState.isOpen}
            onClose={closeModal}
            type={modalState.type}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default TrainersSection;