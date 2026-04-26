import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatState {
  sessionId: string | null
  visitorId: string | null
  _hasHydrated: boolean
  isMinimized: boolean
  isOpen: boolean
  hasMorphedToHeader: boolean
  hasLogoInHeader: boolean
  isNavDrawerOpen: boolean
  setHasHydrated: (val: boolean) => void
  toggleMinimized: () => void
  setOpen: (open: boolean) => void
  setMorphedToHeader: (morphed: boolean) => void
  setLogoInHeader: (value: boolean) => void
  setNavDrawerOpen: (open: boolean) => void
  initSession: () => void
  resetChat: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      visitorId: null,
      _hasHydrated: false,
      isMinimized: false,
      isOpen: false,
      hasMorphedToHeader: true,
      hasLogoInHeader: true,
      isNavDrawerOpen: false,
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),
      setOpen: (open) => set({ isOpen: open }),
      setMorphedToHeader: (morphed) => set({ hasMorphedToHeader: morphed }),
      setLogoInHeader: (value) => set({ hasLogoInHeader: value }),
      setNavDrawerOpen: (open) => set({ isNavDrawerOpen: open }),

      // ── initSession: único punto de generación de IDs ───────────────────
      // Idempotente: solo genera si no existen. Seguro llamarlo múltiples veces.
      // Usa set() (patrón oficial de Zustand), no mutación directa del state.
      initSession: () => {
        const state = get()
        const updates: Partial<ChatState> = {}
        if (!state.visitorId) {
          updates.visitorId = crypto.randomUUID()
          console.log('[chatStore] visitorId generado:', updates.visitorId)
        }
        if (!state.sessionId) {
          updates.sessionId = crypto.randomUUID()
          console.log('[chatStore] sessionId generado:', updates.sessionId)
        }
        if (Object.keys(updates).length > 0) set(updates)
      },

      // Inicia una nueva conversación manteniendo la identidad del visitante
      resetChat: () => {
        set({ sessionId: crypto.randomUUID() })
      },
    }),
    {
      name: 'kia-chat-storage',
      // ✅ PATRÓN OFICIAL DE ZUSTAND: onRehydrateStorage solo marca hidratación.
      // La generación de IDs se delega a initSession() que usa set() correctamente.
      // Antes: se mutaba state.visitorId directamente — antipatrón que puede no
      // propagarse a los suscriptores del store.
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({
        sessionId: state.sessionId,
        visitorId: state.visitorId,
        isOpen: state.isOpen,
      }),
    }
  )
)
