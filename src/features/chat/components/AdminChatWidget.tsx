import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Rocket, Sparkles, Loader2, BrainCircuit, RotateCcw, Quote, Paperclip, ArrowUp, Square } from 'lucide-react'
import { useAdminChatStore, Message } from '../store/adminChatStore'
import { 
  PromptInput, 
  PromptInputTextarea, 
  PromptInputActions, 
  PromptInputAction 
} from '@/shared/components/ui/prompt-input'
import { Button } from '@/shared/components/ui/button'

export function AdminChatWidget() {
  const { 
    messages, isOpen, setOpen, addMessage, 
    sessionId, visitorId, initSession, resetChat 
  } = useAdminChatStore()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Initialize session on mount
  useEffect(() => {
    initSession()
  }, [initSession])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if ((!input.trim() && files.length === 0) || isLoading) return

    setIsLoading(true)
    
    // Process attachments to Base64 for the API
    const attachments: any[] = []
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        attachments.push({
          name: file.name,
          contentType: file.type,
          url: base64
        })
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      experimental_attachments: attachments as any
    }

    addMessage(userMessage)
    setInput('')
    setFiles([])

    try {
      const res = await fetch('/api/admin-chat-widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          sessionId: sessionId,
          visitorId: visitorId
        })
      })

      if (!res.ok) throw new Error('API Error')

      // Handle raw stream (Admin API doesn't use toUIMessageStreamResponse yet, but result.toTextStreamResponse)
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessageId = `assist_${Date.now()}`
      let fullContent = ''

      addMessage({
        id: assistantMessageId,
        role: 'assistant',
        content: ''
      })

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          fullContent += chunk
          
          // Update the specific assistant message in store
          useAdminChatStore.getState().updateMessage(assistantMessageId, fullContent)
        }
      }
    } catch (err) {
      console.error('Admin Chat error:', err)
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Hubo un error en el enlace neural estratégico. Intenta de nuevo.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = ""
    }
  }

  return (
    <div className="fixed z-[9999] flex flex-col bottom-8 right-8 items-end pointer-events-none">
      
      {/* TOGGLE BUTTON */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          onClick={() => setOpen(true)}
          className="size-16 rounded-full bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform"
        >
          <BrainCircuit className="w-8 h-8" />
        </motion.button>
      )}

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            className="w-[92vw] md:w-[480px] h-[700px] max-h-[85vh] bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative">
                  <BrainCircuit className="w-6 h-6 text-white" />
                  <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-success-green border-2 border-black" />
                </div>
                <div>
                  <h3 className="font-display font-black tracking-tight text-white flex items-center gap-2">
                    LinkedIn Strategist
                    <Sparkles className="w-3 h-3 text-white/40" />
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Neural Engine v2.0 • Admin Mode</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => confirm('¿Reiniciar estrategia?') && resetChat()}
                  className="size-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                  title="Reiniciar chat"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button 
                  onClick={() => setOpen(false)}
                  className="size-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth custom-scrollbar"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center px-6 gap-8">
                  <div className="size-20 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                     <Quote className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-white text-xl font-black font-display tracking-tight">Estrategia de Autoridad B2B</h4>
                    <p className="text-slate-500 text-xs leading-relaxed uppercase tracking-widest font-bold max-w-[280px]">
                      Pídeme redactar un post en formato SLAY/PAS o analizar un ángulo de venta para LinkedIn.
                    </p>
                  </div>
                </div>
              )}

              {messages.filter(m => m.content && (m.role === 'user' || m.role === 'assistant')).map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[90%] px-5 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                      ${m.role === 'user' 
                        ? 'bg-white text-black font-bold shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                        : 'bg-white/5 border border-white/10 text-slate-100 font-medium'
                      }
                    `}
                  >
                    {/* Render de Adjuntos (Locales o Persistidos) */}
                    {(m.experimental_attachments || m.metadata?.attachments) && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {/* Adjuntos en memoria (Sesión activa) */}
                        {m.experimental_attachments?.map((attachment: any, index: number) => (
                          <div key={`local-${index}`} className="relative size-20 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                            {(attachment.contentType?.startsWith('image/') || attachment.url?.startsWith('data:')) && (
                              <img 
                                src={attachment.url} 
                                alt={attachment.name || 'attachment'} 
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                        ))}
                        
                        {/* Adjuntos persistidos (Historial Supabase) */}
                        {m.metadata?.attachments?.map((url: string, index: number) => (
                          <div key={`db-${index}`} className="relative size-20 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                            <img 
                              src={url} 
                              alt={`stored-attachment-${index}`} 
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && !messages.some(m => m.role === 'assistant' && m.id.startsWith('assist_')) && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-3">
                     <Loader2 className="w-4 h-4 text-white animate-spin" />
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Calculando Ángulo Estratégico...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Input */}
            <div className="p-8 border-t border-white/5 bg-black/60 backdrop-blur-xl">
              <PromptInput
                value={input}
                onValueChange={setInput}
                isLoading={isLoading}
                onSubmit={handleSend}
                className="w-full bg-white/5 border-white/10 rounded-2xl p-4"
              >
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 pb-3">
                    {files.map((file: File, index: number) => (
                      <div
                        key={index}
                        className="bg-white/10 border border-white/20 flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-bold text-white uppercase tracking-wider"
                      >
                        <Paperclip className="size-3" />
                        <span className="max-w-[140px] truncate">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <PromptInputTextarea 
                  placeholder="Instrucción estratégica..." 
                  className="text-white placeholder:text-white/20 text-sm"
                />

                <PromptInputActions className="flex items-center justify-between gap-3 pt-4">
                  <PromptInputAction tooltip="Adjuntar archivos (Pro)">
                    <label
                      htmlFor="admin-file-upload"
                      className="hover:bg-white/5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-white/5 transition-colors shadow-sm"
                    >
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="admin-file-upload"
                        ref={uploadInputRef}
                      />
                      <Paperclip className="text-slate-400 size-5" />
                    </label>
                  </PromptInputAction>

                  <PromptInputAction
                    tooltip={isLoading ? "Calculando..." : "Enviar instrucción"}
                  >
                    <Button
                      variant="default"
                      size="icon"
                      className="h-10 w-10 rounded-2xl bg-white text-black hover:scale-105 active:scale-95 transition-all font-bold shadow-lg"
                      onClick={handleSend}
                    >
                      {isLoading ? (
                        <Square className="size-5 fill-current" />
                      ) : (
                        <ArrowUp className="size-6" />
                      )}
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
              <p className="mt-6 text-[9px] text-center uppercase tracking-[0.2em] font-black text-slate-600">
                Powered by Kia Intelligence Neural Engine
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
