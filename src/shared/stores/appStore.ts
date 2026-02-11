/**
 * Global Application Store
 * Feature-First Architecture - Zustand state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ========================================
// TYPES
// ========================================

export interface UIState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  notificationsOpen: boolean;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    role?: 'student' | 'trainer' | 'admin';
  } | null;
  preferences: {
    language: 'es' | 'en';
    notifications: boolean;
    marketing: boolean;
  };
}

export interface AppState {
  ui: UIState;
  user: UserState;
  version: string;
  lastUpdated: Date | null;
}

export interface AppActions {
  // UI Actions
  setTheme: (theme: UIState['theme']) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // User Actions
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: UserState['user']) => void;
  updateUserPreferences: (preferences: Partial<UserState['preferences']>) => void;
  logout: () => void;

  // Global Actions
  reset: () => void;
  hydrate: () => void;
}

// ========================================
// INITIAL STATE
// ========================================

const initialState: AppState = {
  ui: {
    theme: 'dark',
    sidebarOpen: false,
    notificationsOpen: false,
    loading: false,
    error: null
  },
  user: {
    isAuthenticated: false,
    user: null,
    preferences: {
      language: 'es',
      notifications: true,
      marketing: false
    }
  },
  version: '1.0.0',
  lastUpdated: null
};

// ========================================
// STORE DEFINITION
// ========================================

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // UI Actions
      setTheme: (theme) =>
        set((state: AppState) => ({
          ui: { ...state.ui, theme },
          lastUpdated: new Date()
        })),

      toggleSidebar: () =>
        set((state: AppState) => ({
          ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
          lastUpdated: new Date()
        })),

      setSidebarOpen: (sidebarOpen) =>
        set((state: AppState) => ({
          ui: { ...state.ui, sidebarOpen },
          lastUpdated: new Date()
        })),

      setNotificationsOpen: (notificationsOpen) =>
        set((state: AppState) => ({
          ui: { ...state.ui, notificationsOpen },
          lastUpdated: new Date()
        })),

      setLoading: (loading) =>
        set((state: AppState) => ({
          ui: { ...state.ui, loading },
          lastUpdated: new Date()
        })),

      setError: (error) =>
        set((state: AppState) => ({
          ui: { ...state.ui, error },
          lastUpdated: new Date()
        })),

      // User Actions
      setAuthenticated: (isAuthenticated) =>
        set((state: AppState) => ({
          user: { ...state.user, isAuthenticated },
          lastUpdated: new Date()
        })),

      setUser: (user) =>
        set((state: AppState) => ({
          user: { ...state.user, user },
          lastUpdated: new Date()
        })),

      updateUserPreferences: (preferences) =>
        set((state: AppState) => ({
          user: {
            ...state.user,
            preferences: { ...state.user.preferences, ...preferences }
          },
          lastUpdated: new Date()
        })),

      logout: () =>
        set(() => ({
          ui: { ...initialState.ui },
          user: { ...initialState.user },
          lastUpdated: new Date()
        })),

      // Global Actions
      reset: () =>
        set(() => ({
          ...initialState,
          lastUpdated: new Date()
        })),

      hydrate: () =>
        set((state: AppState) => ({
          lastUpdated: new Date()
        }))
    }),
    {
      name: 'mma-app-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ui: {
          theme: state.ui.theme
        },
        user: {
          preferences: state.user.preferences
        },
        version: state.version
      }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.lastUpdated = new Date();
        }
      }
    }
  )
);

// ========================================
// SELECTORS
// ========================================

export const useUIState = () => useAppStore((state) => state.ui);
export const useUserState = () => useAppStore((state) => state.user);
export const useTheme = () => useAppStore((state) => state.ui.theme);
export const useIsAuthenticated = () => useAppStore((state) => state.user.isAuthenticated);
export const useCurrentUser = () => useAppStore((state) => state.user.user);

// ========================================
// ACTIONS SELECTORS
// ========================================

export const useAppActions = () => useAppStore((state) => ({
  setTheme: state.setTheme,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen,
  setNotificationsOpen: state.setNotificationsOpen,
  setLoading: state.setLoading,
  setError: state.setError,
  setAuthenticated: state.setAuthenticated,
  setUser: state.setUser,
  updateUserPreferences: state.updateUserPreferences,
  logout: state.logout,
  reset: state.reset,
  hydrate: state.hydrate
}));

// ========================================
// UTILITY HOOKS
// ========================================

export const useLoadingState = () => {
  const loading = useAppStore((state) => state.ui.loading);
  const setLoading = useAppStore((state) => state.setLoading);

  const withLoading = async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      return await fn();
    } finally {
      setLoading(false);
    }
  };

  return { loading, setLoading, withLoading };
};

export const useErrorHandling = () => {
  const error = useAppStore((state) => state.ui.error);
  const setError = useAppStore((state) => state.setError);

  const clearError = () => setError(null);

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    setError(message);
    setTimeout(clearError, 5000); // Auto-clear after 5 seconds
  };

  return { error, setError, clearError, handleError };
};

// ========================================
// DEVTOOLS
// ========================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Enable Zustand devtools
  const { mountStoreDevtool } = require('zustand/middlewares');

  mountStoreDevtool('AppStore', useAppStore);
}