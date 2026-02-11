'use client'

import { useCallback } from 'react'
import { useChatStore } from '../store/chatStore'

export function useChat() {
    const {
        messages,
        conversationId,
        visitorId,
        setConversationId,
        setVisitorId,
        addMessage,
        updateMessage,
        clearConversation,
    } = useChatStore()

    const isLoading = messages.length > 0 &&
        messages[messages.length - 1]?.role === 'assistant' &&
        messages[messages.length - 1]?.content === ''

    // Send message and stream response
    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return

        // Create user message
        const userMessage = {
            id: `user_${Date.now()}`,
            role: 'user' as const,
            content: text,
        }

        // Add user message to store
        addMessage(userMessage)

        // Prepare messages for API
        const allMessages = [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
        }))

        // Create placeholder for assistant response
        const assistantId = `assistant_${Date.now()}`
        addMessage({
            id: assistantId,
            role: 'assistant',
            content: '',
        })

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: allMessages,
                    conversationId, // Send existing conversationId
                    visitorId,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            // Get conversationId from header if new
            const newConversationId = response.headers.get('X-Conversation-Id')
            if (newConversationId && newConversationId !== conversationId) {
                setConversationId(newConversationId)
            }

            // Get visitorId from cookie header
            const setCookie = response.headers.get('Set-Cookie')
            if (setCookie) {
                const visitorMatch = setCookie.match(/visitor_id=([^;]+)/)
                if (visitorMatch && visitorMatch[1]) {
                    setVisitorId(visitorMatch[1])
                }
            }

            if (!response.body) {
                throw new Error('No response body')
            }

            // Read streaming response
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let assistantContent = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                assistantContent += chunk

                // Update assistant message in real-time
                updateMessage(assistantId, assistantContent)
            }
        } catch (error) {
            console.error('Chat error:', error)
            // Update with error message
            updateMessage(assistantId, 'Hubo un error al conectar con el asistente. Por favor intenta de nuevo.')
        }
    }, [messages, conversationId, visitorId, addMessage, updateMessage, setConversationId, setVisitorId])

    // Start new conversation
    const startNewConversation = useCallback(() => {
        clearConversation()
    }, [clearConversation])

    return {
        messages,
        conversationId,
        isLoading,
        sendMessage,
        startNewConversation,
    }
}
