import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Message {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
}

interface ChatState {
    // UI State
    isOpen: boolean

    // Conversation State (persisted)
    conversationId: string | null
    messages: Message[]
    visitorId: string | null

    // Actions
    toggleOpen: () => void
    setOpen: (open: boolean) => void
    setConversationId: (id: string) => void
    setVisitorId: (id: string) => void
    addMessage: (message: Message) => void
    updateMessage: (id: string, content: string) => void
    clearConversation: () => void
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            // Initial state
            isOpen: false,
            conversationId: null,
            messages: [],
            visitorId: null,

            // UI Actions
            toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
            setOpen: (open) => set({ isOpen: open }),

            // Conversation Actions
            setConversationId: (id) => set({ conversationId: id }),
            setVisitorId: (id) => set({ visitorId: id }),

            addMessage: (message) => set((state) => ({
                messages: [...state.messages, message]
            })),

            updateMessage: (id, content) => set((state) => ({
                messages: state.messages.map(m =>
                    m.id === id ? { ...m, content } : m
                )
            })),

            // Clear conversation (start fresh)
            clearConversation: () => set({
                conversationId: null,
                messages: []
            })
        }),
        {
            name: 'chat-storage',
            storage: createJSONStorage(() => localStorage),
            // Only persist conversation-related state, not UI state
            partialize: (state) => ({
                conversationId: state.conversationId,
                messages: state.messages,
                visitorId: state.visitorId,
            })
        }
    )
)
