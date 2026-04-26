import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from '../types/chat.types'

export type { Message };

interface AdminChatState {
  messages: Message[]
  sessionId: string | null
  visitorId: string | null
  _hasHydrated: boolean
  isOpen: boolean
  addMessage: (message: Message) => void
  updateMessage: (id: string, content: string) => void
  setMessages: (messages: Message[]) => void
  setOpen: (open: boolean) => void
  setHasHydrated: (val: boolean) => void
  clearMessages: () => void
  initSession: () => void
  resetChat: () => void
}

export const useAdminChatStore = create<AdminChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      sessionId: null,
      visitorId: null,
      _hasHydrated: false,
      isOpen: false,
      addMessage: (message: Message) => 
        set((state) => ({ messages: [...state.messages, message] })),
      updateMessage: (id: string, content: string) =>
        set((state) => ({
          messages: state.messages.map((m: Message) => 
            m.id === id ? { ...m, content } : m
          )
        })),
      setMessages: (messages: Message[]) => set({ messages }),
      setOpen: (open: boolean) => set({ isOpen: open }),
      setHasHydrated: (val: boolean) => set({ _hasHydrated: val }),
      clearMessages: () => set({ messages: [], sessionId: null }),
      initSession: () => {
        const state = get()
        if (state._hasHydrated) {
          const updates: Partial<AdminChatState> = {}
          if (!state.visitorId) updates.visitorId = crypto.randomUUID()
          if (!state.sessionId) updates.sessionId = crypto.randomUUID()
          
          if (Object.keys(updates).length > 0) {
            set(updates)
          }
        }
      },
      resetChat: () => {
        set({ 
          messages: [], 
          sessionId: crypto.randomUUID() 
        })
      }
    }),
    {
      name: 'kia-admin-chat-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({ 
        sessionId: state.sessionId,
        visitorId: state.visitorId,
        isOpen: state.isOpen
      }),
    }
  )
)
