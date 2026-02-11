'use client';

import { useRef, useEffect, useState, FormEvent } from 'react';
import { useChatStore } from '../store/chatStore';
import { useChat } from '../hooks/useChat';
import { MessageCircle, X, Send, Loader2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import ReactMarkdown from 'react-markdown';

export default function ChatWidget() {
    const { isOpen, toggleOpen } = useChatStore();
    const { messages, isLoading, sendMessage, startNewConversation } = useChat();
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input);
            setInput('');
        }
    };

    const handleSuggestionClick = (text: string) => {
        sendMessage(text);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-[90vw] md:w-[400px] h-[500px] md:h-[600px] overflow-hidden flex flex-col mb-4"
                    >
                        {/* Header */}
                        <div className="h-16 bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <div>
                                    <h3 className="font-bold text-white text-sm">Crazy Assistant</h3>
                                    <p className="text-xs text-zinc-400">En línea ahora</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* New Conversation Button */}
                                {messages.length > 0 && (
                                    <button
                                        onClick={startNewConversation}
                                        title="Nueva conversación"
                                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={toggleOpen}
                                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/80"
                        >
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-4">
                                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center">
                                        <BotIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white mb-1">¡Hola! ¿En qué puedo ayudarte?</p>
                                        <p className="text-xs">Pregúntame sobre horarios o tu visita gratuita.</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 w-full max-w-[200px]">
                                        <SuggestionButton text="¿Cómo es la visita de prueba?" onClick={() => handleSuggestionClick("¿Cómo es la visita de prueba?")} />
                                        <SuggestionButton text="¿Qué horarios tienen?" onClick={() => handleSuggestionClick("¿Qué horarios tienen?")} />
                                    </div>
                                </div>
                            )}

                            {messages.map((msg) => (
                                <div key={msg.id} className={cn("flex gap-2", msg.role === 'user' && "justify-end")}>
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 bg-[var(--accent)] border-none text-black rounded-full flex items-center justify-center shrink-0">
                                            <BotIcon />
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[80%] px-4 py-3 rounded-2xl text-sm",
                                            msg.role === 'user'
                                                ? "bg-[var(--accent)] text-black rounded-tr-sm"
                                                : "bg-zinc-900 border border-zinc-800 text-white rounded-tl-sm prose prose-sm prose-invert max-w-none"
                                        )}
                                    >
                                        {msg.role === 'assistant' ? (
                                            msg.content ? (
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 size={14} className="animate-spin" />
                                                    Escribiendo...
                                                </span>
                                            )
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-zinc-900/50 backdrop-blur-sm border-t border-zinc-800 shrink-0">
                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    type="text"
                                    placeholder="Escribe un mensaje..."
                                    disabled={isLoading}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/50 transition-all placeholder:text-zinc-600 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--accent)] text-black rounded-lg hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                onClick={toggleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "pointer-events-auto h-14 w-14 rounded-full bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20 flex items-center justify-center transition-all hover:bg-[var(--accent)]/90 relative group",
                    isOpen && "bg-zinc-800 text-white hover:bg-zinc-700 shadow-none border border-zinc-700"
                )}
            >
                <AnimatePresence mode='wait'>
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle size={28} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Connection Status Indicator */}
                {!isOpen && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-zinc-950 rounded-full animate-pulse" />
                )}
            </motion.button>
        </div>
    );
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="text-xs bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 py-2 px-3 rounded-lg transition-all text-left"
        >
            {text}
        </button>
    );
}

function BotIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
    )
}
