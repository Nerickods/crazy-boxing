/**
 * Modern React Hooks for Trainers Feature
 * Feature-First Architecture - Custom hooks implementation
 */

import { useEffect, useCallback, useMemo, useState } from 'react';
import { useTrainersStore, useTrainersActions } from '../store/trainersStore';
import { trainersService, generateSearchSuggestions } from '../services/trainersData';
import {
  Trainer,
  TrainerFilters,
  SearchParams,
  Discipline,
  ExperienceLevel,
  Language,
  AvailabilitySlot,
  TrainersError
} from '../types/trainers';

// ========================================
// PRIMARY TRAINERS HOOK
// ========================================

interface UseTrainersOptions {
  autoLoad?: boolean;
  featuredOnly?: boolean;
  discipline?: Discipline;
  initialFilters?: Partial<TrainerFilters>;
  pageSize?: number;
}

export const useTrainers = (options: UseTrainersOptions = {}) => {
  const {
    autoLoad = true,
    featuredOnly = false,
    discipline,
    initialFilters,
    pageSize = 12
  } = options;

  // Store selectors
  const trainers = useTrainersStore((state: any) => state.trainers.data);
  const featuredTrainers = useTrainersStore((state: any) => state.featuredTrainers);
  const filteredTrainers = useTrainersStore((state: any) => state.filteredTrainers);
  const loading = useTrainersStore((state: any) => state.trainers.loading);
  const error = useTrainersStore((state: any) => state.trainers.error);
  const currentPage = useTrainersStore((state: any) => state.currentPage);
  const totalResults = useTrainersStore((state: any) => state.totalResults);
  const hasMore = useTrainersStore((state: any) => state.hasMore);
  const searchParams = useTrainersStore((state: any) => state.searchParams);

  // Store actions
  const {
    setTrainers,
    setFeaturedTrainers,
    setLoading,
    setError,
    clearError,
    _applyFilters,
    setPage,
    resetPagination,
    setSearchQuery,
    setFilters
  } = useTrainersActions();

  // Memoized applyFilters to prevent infinite loops - FIXED
  const applyFilters = useCallback(() => {
    // Usar la función memoizada de actions para evitar dependency loops
    _applyFilters();
    _applyFilters();
  }, [_applyFilters]);

  // Initialize filters if provided - FIXED dependencies
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]); // Removed setFilters from dependencies

  // Set discipline filter if provided - FIXED dependencies
  useEffect(() => {
    if (discipline) {
      setFilters({ disciplines: [discipline] });
    }
  }, [discipline]); // Removed setFilters from dependencies

  // Auto-load trainers - FIXED dependencies
  useEffect(() => {
    if (autoLoad && !trainers && !loading) {
      loadTrainers();
    }
  }, [autoLoad, trainers, loading]); // OK - loadTrainers has correct dependencies

  const loadTrainers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      clearError();

      if (featuredOnly) {
        const featured = await trainersService.getFeaturedTrainers();
        setFeaturedTrainers(featured);
        setTrainers(featured);
      } else {
        const response = await trainersService.getTrainers(page, pageSize);

        if (page === 1) {
          setTrainers(response.trainers);
        } else {
          // Append for pagination
          const current = trainers || [];
          setTrainers([...current, ...response.trainers]);
        }

        setPage(page);
      }
    } catch (err) {
      const trainersError = err as TrainersError;
      setError(trainersError);
    } finally {
      setLoading(false);
    }
  }, [featuredOnly, pageSize, setTrainers, setFeaturedTrainers, setLoading, setError, clearError, setPage, trainers]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !featuredOnly) {
      loadTrainers(currentPage + 1);
    }
  }, [loading, hasMore, featuredOnly, currentPage, loadTrainers]);

  const search = useCallback(async (query: string) => {
    try {
      setLoading(true);
      clearError();
      setSearchQuery(query);

      if (query.trim()) {
        const results = await trainersService.searchTrainers(query);
        setTrainers(results);
      } else {
        loadTrainers(1);
      }
    } catch (err) {
      const trainersError = err as TrainersError;
      setError(trainersError);
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setSearchQuery, setTrainers, setError, loadTrainers]);

  const reset = useCallback(() => {
    resetPagination();
    setTrainers([]);
    setFeaturedTrainers([]);
    clearError();
    setSearchQuery('');
    setFilters({
      disciplines: [],
      experienceLevels: [],
      rating: 0,
      priceRange: [0, 500],
      languages: [],
      availability: [],
      featuredOnly: false
    });
  }, [resetPagination, setTrainers, setFeaturedTrainers, clearError, setSearchQuery, setFilters]);

  // Apply filters whenever they change - FIXED to prevent infinite loop
  useEffect(() => {
    if (trainers) {
      // Use the store method directly instead of applyFilters callback
      const currentState = useTrainersStore.getState();
      currentState._applyFilters();
    }
  }, [searchParams, trainers]); // Removed applyFilters from dependencies

  return {
    trainers: featuredOnly ? featuredTrainers : (trainers || []),
    filteredTrainers,
    loading,
    error,
    currentPage,
    totalResults,
    hasMore,
    searchQuery: searchParams.query,
    filters: searchParams.filters,
    loadMore,
    search,
    reset,
    refetch: () => loadTrainers(currentPage)
  };
};

// ========================================
// FAVORITES HOOK
// ========================================

export const useFavoriteTrainers = () => {
  const favoriteIds = useTrainersStore((state: any) => state.uiState.favoriteTrainers);
  const trainers = useTrainersStore((state: any) => state.trainers.data);
  const { addToFavorites, removeFromFavorites, toggleFavorite, isFavorite } = useTrainersActions();

  const favoriteTrainers = useMemo(() => {
    if (!trainers) return [];
    return trainers.filter((trainer: Trainer) => favoriteIds.includes(trainer.id));
  }, [trainers, favoriteIds]);

  return {
    favoriteIds,
    favoriteTrainers,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    count: favoriteIds.length
  };
};

// ========================================
// COMPARISON HOOK
// ========================================

export const useTrainerComparison = () => {
  const compareIds = useTrainersStore((state: any) => state.uiState.compareList);
  const compareMode = useTrainersStore((state: any) => state.uiState.compareMode);
  const trainers = useTrainersStore((state: any) => state.trainers.data);
  const {
    addToCompare,
    removeFromCompare,
    clearCompareList,
    setCompareMode,
    isInCompare
  } = useTrainersActions();

  const compareTrainers = useMemo(() => {
    if (!trainers) return [];
    return trainers.filter((trainer: Trainer) => compareIds.includes(trainer.id));
  }, [trainers, compareIds]);

  const canAddToCompare = useMemo(() => {
    return compareIds.length < 3;
  }, [compareIds.length]);

  const addToCompareSafe = useCallback((trainerId: string) => {
    if (canAddToCompare && !isInCompare(trainerId)) {
      addToCompare(trainerId);
    }
  }, [canAddToCompare, isInCompare, addToCompare]);

  return {
    compareIds,
    compareTrainers,
    compareMode,
    canAddToCompare,
    isFull: compareIds.length >= 3,
    count: compareIds.length,
    addToCompare: addToCompareSafe,
    removeFromCompare,
    clearCompareList,
    setCompareMode,
    isInCompare
  };
};

// ========================================
// SEARCH HOOK
// ========================================

export const useTrainersSearch = () => {
  const searchQuery = useTrainersStore((state: any) => state.searchParams.query);
  const recentSearches = useTrainersStore((state: any) => state.recentSearches);
  const {
    setSearchQuery,
    setFilters,
    _applyFilters,
    addRecentSearch,
    clearRecentSearches
  } = useTrainersActions();

  // Memoized applyFilters to prevent infinite loops - FIXED
  const applyFilters = useCallback(() => {
    // Usar la función memoizada de actions para evitar dependency loops
    _applyFilters();
    _applyFilters();
  }, [_applyFilters]);

  const suggestions = useMemo(() => {
    return generateSearchSuggestions(searchQuery);
  }, [searchQuery]);

  const search = useCallback((query: string, options: { addToRecent?: boolean } = {}) => {
    const { addToRecent = true } = options;

    setSearchQuery(query);

    if (query.trim() && addToRecent) {
      addRecentSearch(query);
    }

    // Apply filters directly to avoid callback dependency loop
    const currentState = useTrainersStore.getState();
    currentState._applyFilters();
  }, [setSearchQuery, addRecentSearch]); // Removed applyFilters from dependencies

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    // Apply filters directly to avoid callback dependency loop
    const currentState = useTrainersStore.getState();
    currentState._applyFilters();
  }, [setSearchQuery]); // Removed applyFilters from dependencies

  return {
    searchQuery,
    suggestions,
    recentSearches,
    search,
    clearSearch,
    addRecentSearch,
    clearRecentSearches
  };
};

// ========================================
// FILTER HOOK
// ========================================

interface UseTrainersFiltersOptions {
  debounceMs?: number;
}

export const useTrainersFilters = (options: UseTrainersFiltersOptions = {}) => {
  const { debounceMs = 300 } = options;
  const filters = useTrainersStore((state: any) => state.searchParams.filters);
  const sortBy = useTrainersStore((state: any) => state.searchParams.sortBy);
  const {
    setFilters,
    setSortOption,
    clearFilters,
    _applyFilters
  } = useTrainersActions();

  // Memoized applyFilters to prevent infinite loops - FIXED
  const applyFilters = useCallback(() => {
    // Usar la función memoizada de actions para evitar dependency loops
    _applyFilters();
    _applyFilters();
  }, [_applyFilters]);

  const updateFilter = useCallback(<K extends keyof TrainerFilters>(
    key: K,
    value: TrainerFilters[K]
  ) => {
    setFilters({ [key]: value });
  }, [setFilters]);

  const updateFilters = useCallback((newFilters: Partial<TrainerFilters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const removeFilter = useCallback(<K extends keyof TrainerFilters>(key: K) => {
    const defaultValues: TrainerFilters = {
      disciplines: [],
      experienceLevels: [],
      rating: 0,
      priceRange: [0, 500],
      languages: [],
      availability: [],
      featuredOnly: false
    };

    setFilters({ [key]: defaultValues[key] });
  }, [setFilters]);

  const addDiscipline = useCallback((discipline: Discipline) => {
    const current = filters.disciplines || [];
    if (!current.includes(discipline)) {
      updateFilter('disciplines', [...current, discipline]);
    }
  }, [filters.disciplines, updateFilter]);

  const removeDiscipline = useCallback((discipline: Discipline) => {
    const current = filters.disciplines || [];
    updateFilter('disciplines', current.filter((d: Discipline) => d !== discipline));
  }, [filters.disciplines, updateFilter]);

  const addExperienceLevel = useCallback((level: ExperienceLevel) => {
    const current = filters.experienceLevels || [];
    if (!current.includes(level)) {
      updateFilter('experienceLevels', [...current, level]);
    }
  }, [filters.experienceLevels, updateFilter]);

  const removeExperienceLevel = useCallback((level: ExperienceLevel) => {
    const current = filters.experienceLevels || [];
    updateFilter('experienceLevels', current.filter((l: ExperienceLevel) => l !== level));
  }, [filters.experienceLevels, updateFilter]);

  const setRating = useCallback((rating: number) => {
    updateFilter('rating', rating);
  }, [updateFilter]);

  const setPriceRange = useCallback((range: [number, number]) => {
    updateFilter('priceRange', range);
  }, [updateFilter]);

  const addLanguage = useCallback((language: Language) => {
    const current = filters.languages || [];
    if (!current.includes(language)) {
      updateFilter('languages', [...current, language]);
    }
  }, [filters.languages, updateFilter]);

  const removeLanguage = useCallback((language: Language) => {
    const current = filters.languages || [];
    updateFilter('languages', current.filter((l: Language) => l !== language));
  }, [filters.languages, updateFilter]);

  const toggleFeaturedOnly = useCallback(() => {
    updateFilter('featuredOnly', !filters.featuredOnly);
  }, [filters.featuredOnly, updateFilter]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.disciplines.length > 0) count++;
    if (filters.experienceLevels.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
    if (filters.languages.length > 0) count++;
    if (filters.availability.length > 0) count++;
    if (filters.featuredOnly) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return activeFiltersCount > 0;
  }, [activeFiltersCount]);

  return {
    filters,
    sortBy,
    activeFiltersCount,
    hasActiveFilters,
    updateFilter,
    updateFilters,
    removeFilter,
    clearFilters,
    addDiscipline,
    removeDiscipline,
    addExperienceLevel,
    removeExperienceLevel,
    setRating,
    setPriceRange,
    addLanguage,
    removeLanguage,
    toggleFeaturedOnly,
    setSortOption,
    applyFilters
  };
};

// ========================================
// INDIVIDUAL TRAINER HOOK
// ========================================

export const useTrainer = (trainerId: string) => {
  const trainer = useTrainersStore((state: any) => state.uiState.selectedTrainer);
  const favoriteIds = useTrainersStore((state: any) => state.uiState.favoriteTrainers);
  const { setSelectedTrainer, toggleFavorite, isFavorite } = useTrainersActions();

  const loadTrainer = useCallback(async () => {
    try {
      const trainerDetails = await trainersService.getTrainerById(trainerId);
      if (trainerDetails) {
        setSelectedTrainer(trainerDetails);
      }
    } catch (error) {
      console.error('Failed to load trainer:', error);
    }
  }, [trainerId, setSelectedTrainer]);

  useEffect(() => {
    if (trainerId && (!trainer || trainer.id !== trainerId)) {
      loadTrainer();
    }
  }, [trainerId, trainer, loadTrainer]);

  return {
    trainer,
    loading: !trainer,
    isFavorite: isFavorite(trainerId),
    toggleFavorite: () => toggleFavorite(trainerId),
    refetch: loadTrainer
  };
};

// ========================================
// AVAILABILITY HOOK
// ========================================

export const useTrainerAvailability = (trainerId: string) => {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(async (date: Date) => {
    try {
      setLoading(true);
      setError(null);
      const slots = await trainersService.checkAvailability(trainerId, date);
      setAvailability(slots);
    } catch (err) {
      setError('Failed to check availability');
      console.error('Availability check failed:', err);
    } finally {
      setLoading(false);
    }
  }, [trainerId]);

  const getAvailableSlots = useCallback((date: Date) => {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return availability.filter(slot => {
      // Simple logic for demo - in real app would be more complex
      return slot.type !== 'private' || date.getHours() >= 6;
    });
  }, [availability]);

  return {
    availability,
    loading,
    error,
    checkAvailability,
    getAvailableSlots
  };
};

// ========================================
// MODAL HOOK
// ========================================

export const useTrainerModal = () => {
  const modalState = useTrainersStore((state: any) => state.modalState);
  const { openModal, closeModal, setModalType } = useTrainersActions();

  const openTrainerDetails = useCallback((trainer: Trainer) => {
    openModal(trainer, 'details');
  }, [openModal]);

  const openBookingModal = useCallback((trainer: Trainer) => {
    openModal(trainer, 'booking');
  }, [openModal]);

  const openCompareModal = useCallback((trainer: Trainer) => {
    openModal(trainer, 'compare');
  }, [openModal]);

  const openContactModal = useCallback((trainer: Trainer) => {
    openModal(trainer, 'contact');
  }, [openModal]);

  return {
    modalState,
    openModal,
    closeModal,
    setModalType,
    openTrainerDetails,
    openBookingModal,
    openCompareModal,
    openContactModal
  };
};

// ========================================
// STATS AND ANALYTICS HOOK
// ========================================

export const useTrainersStats = () => {
  const trainers = useTrainersStore((state: any) => state.trainers.data);

  const stats = useMemo(() => {
    if (!trainers) return null;

    const totalTrainers = trainers.length;
    const featuredTrainers = trainers.filter((t: Trainer) => t.featured).length;
    const averageRating = trainers.reduce((sum: number, t: Trainer) => sum + t.rating, 0) / totalTrainers;
    const totalStudents = trainers.reduce((sum: number, t: Trainer) => sum + t.stats.studentsCount, 0);
    const totalChampions = trainers.reduce((sum: number, t: Trainer) => sum + t.stats.championsTrained, 0);
    const averageExperience = trainers.reduce((sum: number, t: Trainer) => sum + t.stats.yearsActive, 0) / totalTrainers;

    const disciplineCount = trainers.reduce((acc: Record<Discipline, number>, trainer: Trainer) => {
      trainer.disciplines.forEach((discipline: Discipline) => {
        acc[discipline] = (acc[discipline] || 0) + 1;
      });
      return acc;
    }, {} as Record<Discipline, number>);

    const experienceLevelCount = trainers.reduce((acc: Record<ExperienceLevel, number>, trainer: Trainer) => {
      acc[trainer.experience] = (acc[trainer.experience] || 0) + 1;
      return acc;
    }, {} as Record<ExperienceLevel, number>);

    return {
      totalTrainers,
      featuredTrainers,
      averageRating,
      totalStudents,
      totalChampions,
      averageExperience,
      disciplineCount,
      experienceLevelCount
    };
  }, [trainers]);

  return stats;
};

// ========================================
// UTILITY HOOKS
// ========================================

export const useLocalStorageFavorites = () => {
  const favoriteIds = useFavoriteTrainers().favoriteIds;

  useEffect(() => {
    // Persist to additional storage if needed
    localStorage.setItem('trainers-favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  return favoriteIds;
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// useState import moved to top of file