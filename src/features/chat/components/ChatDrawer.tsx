'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Loader2, RotateCcw, Paperclip, ArrowUp, Square } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useChatStream } from '../hooks/useChatStream';
import { lockScroll, unlockScroll } from '@/shared/lib/scroll-lock';
import { PulsingOrb } from '@/components/PulsingOrb';
import type { Message } from '../types/chat.types';
import { 
  PromptInput, 
  PromptInputTextarea, 
  PromptInputActions, 
  PromptInputAction 
} from '@/shared/components/ui/prompt-input';
import { Button } from '@/shared/components/ui/button';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper para extraer texto en SDK v5+
const getMessageText = (m: Message): string => {
  if (m.parts && m.parts.length > 0) {
    return m.parts
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map(part => part.text)
      .join('');
  }
  return typeof m.content === 'string' ? m.content : '';
};

export function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const { sessionId, visitorId, _hasHydrated, initSession, resetChat } = useChatStore();
  
  // Pasamos los IDs directamente del store.
  // onRehydrateStorage garantiza que estén disponibles antes del primer render.
  const chatStream = useChatStream({ sessionId });

  const {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    isStreaming,
    error,
  } = chatStream;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Inicializamos la sesión al montar (fallback) y al abrir el drawer
  useEffect(() => {
    initSession();
  }, [initSession]);

  // Lock scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      lockScroll('chat-drawer');
    } else {
      unlockScroll('chat-drawer');
    }
    return () => {
      unlockScroll('chat-drawer');
    };
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isStreaming]);

  // ─── Mobile Touch Containment ─────────────────────────────────────────────
  // En mobile los eventos son touchmove, NO wheel. onWheelCapture no es
  // suficiente. Adjuntamos un listener nativo con { capture: true, passive: false }
  // para interceptar touchmove ANTES que el listener global del Hero y:
  //   1. stopPropagation() → el evento no llega al window del Hero
  //   2. preventDefault()  → bloquear el scroll nativo del cuerpo si el div
  //                            ya está en sus límites (scroll chaining)
  // La condición de "puede el div scrollear internamente" evita bloquear el
  // scroll propio de los mensajes.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isOpen) return;

    const handleTouchMove = (e: TouchEvent) => {
      // Siempre detener propagación al window
      e.stopPropagation();

      // Solo prevenir el scroll del body si el propio div no puede scrollear
      // internamente. Esto permite scroll en la lista de mensajes pero evita
      // que el cuerpo se mueva cuando el div ya llegó a sus bordes.
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      const touch = e.touches[0];
      const prevTouch = e.changedTouches[0];
      const movingDown = touch.clientY < prevTouch.clientY; // sube pantalla → scroll down
      const movingUp = touch.clientY > prevTouch.clientY;   // baja pantalla → scroll up

      if ((atTop && movingUp) || (atBottom && movingDown)) {
        e.preventDefault(); // En el borde: bloquear scroll chain al body
      }
    };

    el.addEventListener('touchmove', handleTouchMove, { capture: true, passive: false });
    return () => el.removeEventListener('touchmove', handleTouchMove, { capture: true });
  }, [isOpen]);

  const handleSend = (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const textToSend = textOverride || input;
    if ((!textToSend.trim() && files.length === 0) || isLoading || isStreaming) return;

    sendMessage({ text: textToSend, attachments: files });
    setFiles([]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] touch-none"
          />

          {/* Drawer Panel — touch-none en el panel raíz para bloquear gestos
              del sistema operativo. El scrollable interno recupera el control
              via el useEffect de containment. */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[92%] sm:w-[460px] bg-background-dark/95 backdrop-blur-3xl border-r border-blue-500/20 z-[70] flex flex-col shadow-[20px_0_80px_rgba(30,64,175,0.15)] overflow-hidden touch-none"
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
              <img 
                src="/assets/sections/testimonials-bg.png" 
                alt="Background" 
                className="w-full h-full object-cover"
              />
              {/* Overlay for better readability */}
              <div className="absolute inset-0 bg-background-dark/60 backdrop-blur-[2px]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-background-dark/80 backdrop-blur-md relative z-20">
              <div className="flex items-center gap-4">
                <div className="size-14 flex items-center justify-center relative group">
                  <Image 
                    src="/assets/logo.png" 
                    alt="Crazy Boxing Logo" 
                    fill
                    sizes="56px"
                    className="object-contain filter drop-shadow-[0_0_15px_rgba(0,242,255,0.3)] group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="flex items-center text-lg tracking-tight">
                    <span 
                      className="font-display font-black uppercase animate-gradient-flow"
                      style={{
                        backgroundImage: "linear-gradient(135deg, #1e40af 0%, #2563eb 30%, #3b82f6 70%, #1e3a8a 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        backgroundSize: "200% 100%",
                        display: "inline-block",
                      }}
                    >
                      CRAZY
                    </span>
                    <span className="font-display font-extralight uppercase text-slate-300 ml-2">
                      Coach AI
                    </span>
                    <PulsingOrb size={16} showText={false} className="ml-2" />
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (confirm('¿Reiniciar conversación neuronal?')) {
                      resetChat();
                      window.location.reload(); // Simple way to clear the useChat cache 
                    }
                  }}
                  className="size-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 hover:border-white/20"
                  title="Reiniciar chat"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={onClose}
                  className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/10"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Messages Area — touch-auto anula el touch-none del panel padre,
                nuestro useEffect de containment nativo gestiona el behavior. */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-8 space-y-8 scroll-smooth custom-scrollbar relative z-10 touch-auto"
              onWheelCapture={(e) => {
                // Desktop: detener propagación del evento wheel al listener del Hero.
                e.stopPropagation();
              }}
            >
              {messages.length === 0 && (
                <div className="flex flex-col gap-6 pt-4">
                  {/* Animated Initial Message from Assistant */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[88%] px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed bg-white/5 border border-white/10 text-slate-200 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,242,255,0.05)] font-medium">
                      ¡Qué tal, guerrero! Soy el Coach AI de Crazy Boxing. ¿Listo para llevar tu entrenamiento al siguiente nivel o tienes dudas sobre nuestras clases de MMA y Box?
                    </div>
                  </motion.div>

                  {/* Smart Suggestions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col gap-2 mt-2 px-2"
                  >
                    {[
                      "Dime los horarios de las clases de Box.",
                      "¿Qué equipo necesito para mi primera clase?",
                      "¿Cómo funciona el pase de visita gratis?"
                    ].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(undefined, suggestion)}
                        className="text-xs px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 hover:border-blue-500/40 transition-all text-left shadow-sm hover:shadow-[0_0_15px_rgba(30,64,175,0.15)] flex items-center gap-2 group"
                      >
                        <Sparkles className="w-3 h-3 text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Message List Rendering */}
              {(() => {
                // Find index of the last assistant message that has content
                const assistantMessages = messages.filter(m => getMessageText(m) && m.role === 'assistant');
                const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
                
                return messages
                  .filter(m => {
                    const hasText = getMessageText(m).trim().length > 0;
                    const hasAttachments = (m.experimental_attachments && m.experimental_attachments.length > 0) || 
                                         (m.parts && m.parts.some(p => p.type === 'image'));
                    return (hasText || hasAttachments) && m.role !== 'system';
                  })
                  .map((m) => {
                    const isLastAssistant = m.role === 'assistant' && m.id === lastAssistantMessage?.id;
                    const text = getMessageText(m);
                    
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex items-end gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {m.role === 'assistant' && (
                          <div className="w-10 flex-shrink-0 flex flex-col items-center justify-end mb-1 gap-1">
                            {isLastAssistant ? (
                              <>
                                <PulsingOrb size={28} showText={false} className="scale-120" />
                                <span 
                                  className="font-black text-[9px] uppercase tracking-tighter animate-gradient-flow select-none py-0.5"
                                  style={{
                                    backgroundImage: "linear-gradient(135deg, #1e40af 0%, #2563eb 30%, #3b82f6 70%, #1e3a8a 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    backgroundSize: "200% 100%",
                                    display: "inline-block",
                                  }}
                                >
                                  CRAZY
                                </span>
                              </>
                            ) : (
                              <div className="size-2 rounded-full bg-white/10 mb-1" />
                            )}
                          </div>
                        )}
                        
                        <div
                          className={`
                            max-w-[88%] px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed whitespace-pre-wrap
                            ${m.role === 'user'
                              ? 'bg-blue-600 text-white font-semibold shadow-[0_10px_30px_rgba(37,99,235,0.15)]'
                              : 'bg-white/5 border border-white/10 text-slate-200 backdrop-blur-sm'
                            }
                          `}
                        >
                          {/* Render Attachments if any */}
                          {(m.experimental_attachments && m.experimental_attachments.length > 0) && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {m.experimental_attachments.map((attachment, index) => (
                                <div key={index} className="relative size-32 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                  {attachment.contentType?.startsWith('image/') && (
                                    <img 
                                      src={attachment.url} 
                                      alt={attachment.name || 'attachment'} 
                                      className="object-cover w-full h-full"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Render Image Parts (SDK v5+) */}
                          {m.parts && m.parts.some(p => p.type === 'image') && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {m.parts
                                .filter((p): p is { type: 'image'; image: string | URL } => p.type === 'image')
                                .map((p, i) => (
                                  <div key={i} className="relative size-32 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                    <img 
                                      src={typeof p.image === 'string' ? p.image : p.image.toString()} 
                                      alt="Analysis" 
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                ))}
                            </div>
                          )}
                          {text}
                        </div>
                      </motion.div>
                    );
                  });
              })()}

              {/* Error Rendering */}
              {error && (
                <div className="flex justify-start">
                  <div className="bg-red-500/10 border border-red-500/20 px-5 py-4 rounded-[1.5rem] flex items-center gap-3 backdrop-blur-sm text-red-400 text-sm">
                    ⚠️ {error.message}
                  </div>
                </div>
              )}

              {/* Loading Indicator for Server Roundtrips & Setup delays */}
              {(isLoading || isStreaming) && messages[messages.length - 1]?.role === 'user' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 px-5 py-4 rounded-[1.5rem] flex items-center gap-3 backdrop-blur-sm">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] animate-pulse">
                      CRAZY processing...
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Input */}
            <div className="p-6 md:p-8 border-t border-white/5 bg-background-dark/60 backdrop-blur-2xl relative z-10">
              <PromptInput
                value={input}
                onValueChange={setInput}
                isLoading={isLoading || isStreaming}
                onSubmit={handleSend}
                className="w-full bg-white/5 border-white/10 rounded-2xl p-4"
              >
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-3">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-blue-500/10 border border-blue-500/20 flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider"
                      >
                        <Paperclip className="size-3" />
                        <span className="max-w-[140px] truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="hover:bg-blue-500/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <PromptInputTextarea 
                  placeholder="Escribe tu mensaje..." 
                  className="text-white placeholder:text-white/20 text-sm"
                />

                <PromptInputActions className="flex items-center justify-between gap-3 pt-4">
                  <PromptInputAction tooltip="Adjuntar archivos">
                    <label
                      htmlFor="file-upload"
                      className="hover:bg-white/5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-white/5 transition-colors shadow-sm"
                    >
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        ref={uploadInputRef}
                      />
                      <Paperclip className="text-slate-400 size-5" />
                    </label>
                  </PromptInputAction>

                  <PromptInputAction
                    tooltip={isLoading || isStreaming ? "Detener generación" : "Enviar mensaje"}
                  >
                    <Button
                      variant="default"
                      size="icon"
                      className="h-10 w-10 rounded-2xl bg-white text-black hover:scale-105 active:scale-95 transition-all font-bold shadow-lg"
                      onClick={handleSend}
                    >
                      {isLoading || isStreaming ? (
                        <Square className="size-5 fill-current" />
                      ) : (
                        <ArrowUp className="size-6" />
                      )}
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
              <p className="text-[9px] text-center text-slate-600 uppercase tracking-widest mt-6">
                CRAZY BOXING · Centro de Entrenamiento de Alto Rendimiento
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
