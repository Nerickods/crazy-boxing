/**
 * Zustand Store for Trainers Feature
 * Feature-First Architecture - Comprehensive state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useMemo } from 'react';
import {
  Trainer,
  TrainerFilters,
  TrainersUIState,
  ModalState,
  SearchParams,
  SortOption,
  TrainersLocalStorage,
  Discipline,
  ExperienceLevel,
  Language,
  AvailabilitySlot,
  TrainersError,
  TrainersAsyncState
} from '../types/trainers';

// ========================================
// INITIAL STATE
// ========================================

const initialFilters: TrainerFilters = {
  disciplines: [],
  experienceLevels: [],
  rating: 0,
  priceRange: [0, 500],
  languages: [],
  availability: [],
  featuredOnly: false,
};

const initialUIState: TrainersUIState = {
  selectedTrainer: null,
  favoriteTrainers: [],
  viewedTrainers: [],
  compareMode: false,
  compareList: [],
  filtersVisible: false,
  searchVisible: false,
  listView: 'grid',
  loading: false,
  error: null,
};

const initialModalState: ModalState = {
  isOpen: false,
  trainer: null,
  type: 'details',
};

const initialSearchParams: SearchParams = {
  query: '',
  filters: initialFilters,
  sortBy: { field: 'rating', direction: 'desc' },
  page: 1,
  limit: 12,
};

// ========================================
// MAIN STORE INTERFACE
// ========================================

interface TrainersStore {
  // Data State
  trainers: TrainersAsyncState<Trainer[]>;
  featuredTrainers: Trainer[];
  filteredTrainers: Trainer[];
  totalResults: number;
  currentPage: number;
  hasMore: boolean;

  // Search and Filters
  searchParams: SearchParams;
  recentSearches: string[];
  searchSuggestions: string[];

  // UI State
  uiState: TrainersUIState;
  modalState: ModalState;

  // Local Storage Actions
  addToFavorites: (trainerId: string) => void;
  removeFromFavorites: (trainerId: string) => void;
  toggleFavorite: (trainerId: string) => void;
  isFavorite: (trainerId: string) => boolean;

  // View History
  addToViewed: (trainerId: string) => void;
  getViewedTrainers: () => string[];

  // Search Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<TrainerFilters>) => void;
  clearFilters: () => void;
  setSortOption: (sort: SortOption) => void;
  _applyFilters: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // UI Actions
  setSelectedTrainer: (trainer: Trainer | null) => void;
  setListView: (view: 'grid' | 'list') => void;
  toggleFiltersVisible: () => void;
  toggleSearchVisible: () => void;
  setCompareMode: (enabled: boolean) => void;
  addToCompare: (trainerId: string) => void;
  removeFromCompare: (trainerId: string) => void;
  clearCompareList: () => void;
  isInCompare: (trainerId: string) => boolean;

  // Modal Actions
  openModal: (trainer: Trainer, type: ModalState['type']) => void;
  closeModal: () => void;
  setModalType: (type: ModalState['type']) => void;

  // Data Actions
  setTrainers: (trainers: Trainer[]) => void;
  appendTrainers: (trainers: Trainer[]) => void;
  setFeaturedTrainers: (trainers: Trainer[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: TrainersError | null) => void;
  clearError: () => void;
  resetStore: () => void;

  // Pagination
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  resetPagination: () => void;

  // Computed Values (Getters)
  getFavoriteTrainers: () => Trainer[];
  getCompareTrainers: () => Trainer[];
  getFilteredCount: () => number;
  getActiveFiltersCount: () => number;
  hasActiveFilters: () => boolean;
}

// ========================================
// STORE IMPLEMENTATION
// ========================================

export const useTrainersStore = create<TrainersStore>()(
  persist(
    (set, get) => ({
      // Initial Data State
      trainers: {
        data: null,
        loading: false,
        error: null,
        lastUpdated: null,
      },
      featuredTrainers: [],
      filteredTrainers: [],
      totalResults: 0,
      currentPage: 1,
      hasMore: false,

      // Initial Search and Filters
      searchParams: initialSearchParams,
      recentSearches: [],
      searchSuggestions: [],

      // Initial UI State
      uiState: initialUIState,
      modalState: initialModalState,

      // ========================================
      // LOCAL STORAGE ACTIONS
      // ========================================

      addToFavorites: (trainerId: string) => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            favoriteTrainers: [...new Set([...state.uiState.favoriteTrainers, trainerId])]
          }
        }));
      },

      removeFromFavorites: (trainerId: string) => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            favoriteTrainers: state.uiState.favoriteTrainers.filter(id => id !== trainerId)
          }
        }));
      },

      toggleFavorite: (trainerId: string) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(trainerId)) {
          removeFromFavorites(trainerId);
        } else {
          addToFavorites(trainerId);
        }
      },

      isFavorite: (trainerId: string) => {
        return get().uiState.favoriteTrainers.includes(trainerId);
      },

      // ========================================
      // VIEW HISTORY
      // ========================================

      addToViewed: (trainerId: string) => {
        set((state) => {
          const viewed = [trainerId, ...state.uiState.viewedTrainers.filter(id => id !== trainerId)].slice(0, 20);
          return {
            uiState: {
              ...state.uiState,
              viewedTrainers: viewed
            }
          };
        });
      },

      getViewedTrainers: () => {
        return get().uiState.viewedTrainers;
      },

      // ========================================
      // SEARCH ACTIONS
      // ========================================

      setSearchQuery: (query: string) => {
        set((state) => ({
          searchParams: {
            ...state.searchParams,
            query
          }
        }));
      },

      setFilters: (filters: Partial<TrainerFilters>) => {
        set((state) => ({
          searchParams: {
            ...state.searchParams,
            filters: {
              ...state.searchParams.filters,
              ...filters
            }
          }
        }));
      },

      clearFilters: () => {
        set((state) => ({
          searchParams: {
            ...state.searchParams,
            filters: initialFilters
          }
        }));
      },

      setSortOption: (sort: SortOption) => {
        set((state) => ({
          searchParams: {
            ...state.searchParams,
            sortBy: sort
          }
        }));
      },

      // Raw applyFilters without memoization (used internally)
      _applyFilters: () => {
        const { trainers, searchParams } = get();
        if (!trainers.data) return;

        let filtered = [...trainers.data];

        // Apply text search
        if (searchParams.query.trim()) {
          const query = searchParams.query.toLowerCase();
          filtered = filtered.filter(trainer =>
            trainer.name.toLowerCase().includes(query) ||
            trainer.specialty.toLowerCase().includes(query) ||
            trainer.bio.toLowerCase().includes(query) ||
            trainer.disciplines.some(d => d.toLowerCase().includes(query))
          );
        }

        // Apply discipline filter
        if (searchParams.filters.disciplines.length > 0) {
          filtered = filtered.filter(trainer =>
            searchParams.filters.disciplines.some(discipline =>
              trainer.disciplines.includes(discipline)
            )
          );
        }

        // Apply experience level filter
        if (searchParams.filters.experienceLevels.length > 0) {
          filtered = filtered.filter(trainer =>
            searchParams.filters.experienceLevels.includes(trainer.experience)
          );
        }

        // Apply rating filter
        if (searchParams.filters.rating > 0) {
          filtered = filtered.filter(trainer => trainer.rating >= searchParams.filters.rating);
        }

        // Apply price range filter
        filtered = filtered.filter(trainer => {
          const minPrice = Math.min(...trainer.pricing.privateSession.map(p => p.price));
          const maxPrice = Math.max(...trainer.pricing.privateSession.map(p => p.price));
          return minPrice >= searchParams.filters.priceRange[0] &&
                 maxPrice <= searchParams.filters.priceRange[1];
        });

        // Apply language filter
        if (searchParams.filters.languages.length > 0) {
          filtered = filtered.filter(trainer =>
            searchParams.filters.languages.some(lang =>
              trainer.languages.includes(lang)
            )
          );
        }

        // Apply featured only filter
        if (searchParams.filters.featuredOnly) {
          filtered = filtered.filter(trainer => trainer.featured);
        }

        // Apply sorting
        filtered.sort((a, b) => {
          const { field, direction } = searchParams.sortBy;
          let aValue: any, bValue: any;

          switch (field) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'rating':
              aValue = a.rating;
              bValue = b.rating;
              break;
            case 'experience':
              aValue = a.stats.yearsActive;
              bValue = b.stats.yearsActive;
              break;
            case 'price':
              aValue = Math.min(...a.pricing.privateSession.map(p => p.price));
              bValue = Math.min(...b.pricing.privateSession.map(p => p.price));
              break;
            case 'students':
              aValue = a.stats.studentsCount;
              bValue = b.stats.studentsCount;
              break;
            case 'champions':
              aValue = a.stats.championsTrained;
              bValue = b.stats.championsTrained;
              break;
            case 'yearsActive':
              aValue = a.stats.yearsActive;
              bValue = b.stats.yearsActive;
              break;
            default:
              return 0;
          }

          if (aValue < bValue) return direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return direction === 'asc' ? 1 : -1;
          return 0;
        });

        set({
          filteredTrainers: filtered,
          totalResults: filtered.length
        });
      },

      addRecentSearch: (query: string) => {
        if (!query.trim()) return;

        set((state) => ({
          recentSearches: [
            query.trim(),
            ...state.recentSearches.filter(search => search !== query.trim())
          ].slice(0, 10)
        }));
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      // ========================================
      // UI ACTIONS
      // ========================================

      setSelectedTrainer: (trainer: Trainer | null) => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            selectedTrainer: trainer
          }
        }));

        if (trainer) {
          get().addToViewed(trainer.id);
        }
      },

      setListView: (view: 'grid' | 'list') => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            listView: view
          }
        }));
      },

      toggleFiltersVisible: () => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            filtersVisible: !state.uiState.filtersVisible
          }
        }));
      },

      toggleSearchVisible: () => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            searchVisible: !state.uiState.searchVisible
          }
        }));
      },

      setCompareMode: (enabled: boolean) => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            compareMode: enabled,
            compareList: enabled ? state.uiState.compareList : []
          }
        }));
      },

      addToCompare: (trainerId: string) => {
        set((state) => {
          if (state.uiState.compareList.includes(trainerId)) return state;

          const newList = [...state.uiState.compareList, trainerId].slice(0, 3); // Max 3 for comparison
          return {
            uiState: {
              ...state.uiState,
              compareList: newList,
              compareMode: newList.length > 0
            }
          };
        });
      },

      removeFromCompare: (trainerId: string) => {
        set((state) => {
          const newList = state.uiState.compareList.filter(id => id !== trainerId);
          return {
            uiState: {
              ...state.uiState,
              compareList: newList,
              compareMode: newList.length > 0
            }
          };
        });
      },

      clearCompareList: () => {
        set((state) => ({
          uiState: {
            ...state.uiState,
            compareList: [],
            compareMode: false
          }
        }));
      },

      isInCompare: (trainerId: string) => {
        return get().uiState.compareList.includes(trainerId);
      },

      // ========================================
      // MODAL ACTIONS
      // ========================================

      openModal: (trainer: Trainer, type: ModalState['type']) => {
        set({
          modalState: {
            isOpen: true,
            trainer,
            type
          }
        });
      },

      closeModal: () => {
        set({
          modalState: initialModalState
        });
      },

      setModalType: (type: ModalState['type']) => {
        set((state) => ({
          modalState: {
            ...state.modalState,
            type
          }
        }));
      },

      // ========================================
      // DATA ACTIONS
      // ========================================

      setTrainers: (trainers: Trainer[]) => {
        set({
          trainers: {
            data: trainers,
            loading: false,
            error: null,
            lastUpdated: new Date()
          }
        });
        get()._applyFilters();
      },

      appendTrainers: (trainers: Trainer[]) => {
        set((state) => {
          const existingIds = new Set(state.trainers.data?.map(t => t.id) || []);
          const newTrainers = trainers.filter(t => !existingIds.has(t.id));
          const allTrainers = [...(state.trainers.data || []), ...newTrainers];

          return {
            trainers: {
              data: allTrainers,
              loading: false,
              error: null,
              lastUpdated: new Date()
            }
          };
        });
        get()._applyFilters();
      },

      setFeaturedTrainers: (trainers: Trainer[]) => {
        set({ featuredTrainers: trainers });
      },

      setLoading: (loading: boolean) => {
        set((state) => ({
          trainers: {
            ...state.trainers,
            loading
          }
        }));
      },

      setError: (error: TrainersError | null) => {
        set((state) => ({
          trainers: {
            ...state.trainers,
            error,
            loading: false
          }
        }));
      },

      clearError: () => {
        set((state) => ({
          trainers: {
            ...state.trainers,
            error: null
          }
        }));
      },

      resetStore: () => {
        set({
          trainers: {
            data: null,
            loading: false,
            error: null,
            lastUpdated: null,
          },
          featuredTrainers: [],
          filteredTrainers: [],
          totalResults: 0,
          currentPage: 1,
          hasMore: false,
          searchParams: initialSearchParams,
          recentSearches: [],
          searchSuggestions: [],
          uiState: initialUIState,
          modalState: initialModalState
        });
      },

      // ========================================
      // PAGINATION
      // ========================================

      nextPage: () => {
        set((state) => ({
          currentPage: state.currentPage + 1
        }));
      },

      prevPage: () => {
        set((state) => ({
          currentPage: Math.max(1, state.currentPage - 1)
        }));
      },

      setPage: (page: number) => {
        set({ currentPage: Math.max(1, page) });
      },

      resetPagination: () => {
        set({ currentPage: 1 });
      },

      // ========================================
      // COMPUTED VALUES (GETTERS)
      // ========================================

      getFavoriteTrainers: () => {
        const { trainers, uiState } = get();
        if (!trainers.data) return [];

        return trainers.data.filter(trainer =>
          uiState.favoriteTrainers.includes(trainer.id)
        );
      },

      getCompareTrainers: () => {
        const { trainers, uiState } = get();
        if (!trainers.data) return [];

        return trainers.data.filter(trainer =>
          uiState.compareList.includes(trainer.id)
        );
      },

      getFilteredCount: () => {
        return get().totalResults;
      },

      getActiveFiltersCount: () => {
        const { filters } = get().searchParams;
        let count = 0;

        if (filters.disciplines.length > 0) count++;
        if (filters.experienceLevels.length > 0) count++;
        if (filters.rating > 0) count++;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
        if (filters.languages.length > 0) count++;
        if (filters.availability.length > 0) count++;
        if (filters.featuredOnly) count++;

        return count;
      },

      hasActiveFilters: () => {
        return get().getActiveFiltersCount() > 0;
      },
    }),
    {
      name: 'trainers-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        uiState: {
          favoriteTrainers: state.uiState.favoriteTrainers,
          viewedTrainers: state.uiState.viewedTrainers,
          listView: state.uiState.listView,
          compareList: state.uiState.compareList,
        },
        recentSearches: state.recentSearches,
        searchParams: {
          filters: state.searchParams.filters,
          sortBy: state.searchParams.sortBy,
        }
      }),
    }
  )
);

// ========================================
// SELECTORS FOR OPTIMIZED RE-RENDERS
// ========================================

export const useFavoriteTrainers = () => useTrainersStore(state => state.uiState.favoriteTrainers);
export const useCompareTrainers = () => useTrainersStore(state => state.uiState.compareList);
export const useSelectedTrainer = () => useTrainersStore(state => state.uiState.selectedTrainer);
export const useModalState = () => useTrainersStore(state => state.modalState);
export const useFilteredTrainers = () => useTrainersStore(state => state.filteredTrainers);
export const useSearchQuery = () => useTrainersStore(state => state.searchParams.query);
export const useFilters = () => useTrainersStore(state => state.searchParams.filters);
export const useLoadingState = () => useTrainersStore(state => state.trainers.loading);
export const useErrorState = () => useTrainersStore(state => state.trainers.error);

// ========================================
// ACTION SELECTORS - VERSION SIMPLE
// ========================================

export const useTrainersActions = () => useTrainersStore(state => ({
  addToFavorites: state.addToFavorites,
  removeFromFavorites: state.removeFromFavorites,
  toggleFavorite: state.toggleFavorite,
  isFavorite: state.isFavorite,
  addToViewed: state.addToViewed,
  setSearchQuery: state.setSearchQuery,
  addRecentSearch: state.addRecentSearch,
  clearRecentSearches: state.clearRecentSearches,
  setFilters: state.setFilters,
  clearFilters: state.clearFilters,
  setSortOption: state.setSortOption,
  _applyFilters: state._applyFilters,
  setSelectedTrainer: state.setSelectedTrainer,
  setListView: state.setListView,
  toggleFiltersVisible: state.toggleFiltersVisible,
  setCompareMode: state.setCompareMode,
  addToCompare: state.addToCompare,
  removeFromCompare: state.removeFromCompare,
  clearCompareList: state.clearCompareList,
  isInCompare: state.isInCompare,
  openModal: state.openModal,
  closeModal: state.closeModal,
  setModalType: state.setModalType,
  setTrainers: state.setTrainers,
  setFeaturedTrainers: state.setFeaturedTrainers,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  setPage: state.setPage,
  resetPagination: state.resetPagination,
  nextPage: state.nextPage,
  prevPage: state.prevPage,
  resetStore: state.resetStore,
}));