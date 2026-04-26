'use client';

/**
 * useChatStream — Wrapper sobre useChat del Vercel AI SDK v5
 * KIA Intelligence — Invisible Stack
 *
 * FIX PRP-066: El `body` con sessionId/visitorId se pasa a nivel de REQUEST
 * (segundo argumento de sendMessage), NO en la config del hook.
 * Esto evita el bug de "stale closure" donde useChat captura los valores
 * del primer render (null) y nunca los actualiza reactivamente.
 */
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useChatStore } from '../store/chatStore';
import type { Message, ChatStreamState, UseChatStreamOptions } from '../types/chat.types';

export function useChatStream({ sessionId: propSessionId }: UseChatStreamOptions): ChatStreamState {
  const [input, setInput] = useState('');

  // ── Visitor & Session Identity ──────────────────────────────────────────────
  // Leemos del store en cada render. Estos valores se leen correctamente
  // DENTRO de handleSend (que se ejecuta al momento del envío), no en la
  // config del hook (que es un closure estático).
  const { 
    sessionId: storeSessionId, 
    visitorId: storeVisitorId,
  } = useChatStore();

  const {
    messages: sdkMessages,
    sendMessage: sdkSendMessage,
    status,
    error,
  } = (useChat as any)({
    id: 'crazy-boxing-chat-session', // ID estable — no reinicia historial interno
    api: '/api/chat',
    // ✅ Sin `body` aquí — los IDs dinámicos van a nivel de REQUEST en sendMessage
    // El body de la config es un closure estático y no se actualiza reactivamente.
    onError: (err: any) => {
      console.error('[useChatStream] Error:', err);
    },
  });

  const messages = sdkMessages as Message[];

  const handleSend = async (args: { text: string; attachments?: FileList | File[] }) => {
    if ((!args.text.trim() && !args.attachments?.length) || status === 'streaming' || status === 'submitted') return;
    
    const text = args.text.trim();
    setInput('');

    // ── IDs leídos en el momento exacto del envío (siempre actuales) ──────────
    // propSessionId tiene prioridad (pasado desde ChatDrawer).
    // storeSessionId como fallback (generado en onRehydrateStorage/initSession).
    const currentSessionId = propSessionId || storeSessionId;
    const currentVisitorId = storeVisitorId;

    console.log('[useChatStream] Enviando con IDs:', { 
      currentSessionId, 
      currentVisitorId,
      source: propSessionId ? 'prop' : 'store'
    });

    // PROCESAMIENTO: Convertimos imágenes a Base64 para transporte JSON
    const imageParts: any[] = [];
    if (args.attachments) {
      const filesArray = Array.from(args.attachments);
      for (const file of filesArray) {
        if (file.type.startsWith('image/')) {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          imageParts.push({
            type: 'image',
            image: base64,
            mimeType: file.type,
          });
        }
      }
    }

    try {
      const parts: any[] = [{ type: 'text', text: text || 'Analiza esta imagen' }];
      parts.push(...imageParts);

      // ✅ FIX CRÍTICO PRP-066: body a nivel de REQUEST
      // Se evalúa en este momento exacto, usando los valores actuales del store.
      // Antes estaba en la config de useChat() = closure estático = siempre null.
      await sdkSendMessage(
        { role: 'user', parts },
        { body: { sessionId: currentSessionId, visitorId: currentVisitorId } }
      );

      console.log('[useChatStream] Envío completado. SessionId usado:', currentSessionId);
    } catch (err) {
      console.error('[useChatStream] Error en el envío:', err);
    }
  };

  return {
    messages,
    input,
    setInput,
    sendMessage: handleSend,
    isLoading: status === 'submitted',
    isStreaming: status === 'streaming',
    error: error ?? undefined,
  };
}
