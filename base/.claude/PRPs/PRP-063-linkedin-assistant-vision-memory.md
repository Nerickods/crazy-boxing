# PRP-063: LinkedIn Neural Strategist — Vision + Persistent Memory

> **Estado**: COMPLETADO  
> **Fecha**: 2026-04-16  
> **Proyecto**: KIA Intelligence (landing-linkedin)

---

## Objetivo

Replicar el sistema de **visión multimodal** y la **memoria conversacional persistente** del chat público (`/api/chat`) al **LinkedIn Neural Strategist** del panel admin (`/api/admin-chat`).

---

## Archivos Modificados / Creados

| Archivo | Acción |
|---------|--------|
| `src/app/api/admin-chat/route.ts` | MODIFICADO — normalizador multimodal, persistencia Supabase, `toUIMessageStreamResponse` |
| `src/features/admin-linkedin/store/linkedinChatStore.ts` | NUEVO — Zustand con `_hasHydrated` guard |
| `src/features/admin-linkedin/hooks/useLinkedinChat.ts` | NUEVO — `useChat` + Base64 + sessionId |
| `src/features/admin-linkedin/components/LinkedinStrategistChat.tsx` | NUEVO — Chat UI conversacional con visión |
| `src/features/admin-linkedin/components/LinkedinAdminTabs.tsx` | NUEVO — Tabs Generador / Estratega |
| `src/app/admin/linkedin/page.tsx` | MODIFICADO — Usa `LinkedinAdminTabs` |

## Validación Final
- [x] `npx tsc --noEmit` — exit code 0, sin errores
- [x] Arquitectura Feature-First respetada
- [x] `_hasHydrated` guard en store
- [x] `toUIMessageStreamResponse()` en API + `useChat` en hook
- [x] `createAdminClient()` para toda persistencia Supabase
- [x] `export const runtime = 'nodejs'` en route
- [x] Discriminador `metadata.source: 'linkedin_admin'` en BD

## 🧠 Aprendizajes (Self-Annealing)

### 2026-04-16: `useCompletion` vs `useChat` para chat multi-turno
- **Error**: `useCompletion` no mantiene historial de mensajes entre turnos. Cada llamada es una completion independiente.
- **Fix**: Migrar a `useChat` que gestiona el array `messages` de forma acumulativa.
- **Aplicar en**: Cualquier feature que necesite historial conversacional. Nunca usar `useCompletion` para chat.

### 2026-04-16: `toTextStreamResponse()` incompatible con `useChat`
- **Error**: El hook `useChat` espera el protocolo de streaming de Vercel AI SDK UI (UIMessage stream). `toTextStreamResponse()` envía texto plano que `useChat` no puede parsear.
- **Fix**: Cambiar la API route a `result.toUIMessageStreamResponse()`.
- **Aplicar en**: Siempre que se use `useChat` en el cliente → `toUIMessageStreamResponse()` en el servidor. `useCompletion` → `toTextStreamResponse()`.

### 2026-04-16: `convertToModelMessages` no soporta `parts.image` en Base64
- **Error**: La función del SDK no normaliza imágenes enviadas como `parts: [{type:'image', image: 'data:image/jpeg;base64,...'}]`.
- **Fix**: Usar el normalizador manual que extrae el base64, convierte a Buffer, y construye el `CoreMessage` correcto.
- **Aplicar en**: Cualquier API route que reciba imágenes multimodales del cliente.

### 2026-04-16: `proxy.requireAdmin()` con throw causa 404 en Server Components
- **Error**: `proxy.requireAdmin()` lanza `throw new Error('Unauthorized')`. En un async Server Component de Next.js, un error no capturado no redirige al login — Next.js lo convierte en un 404 genérico.
- **Fix**: Reemplazar `proxy.requireAdmin()` por un check directo: `const { data: { user } } = await supabase.auth.getUser()` + `if (!user) redirect('/login')`. Nunca usar throw para auth guards en Server Components.
- **Aplicar en**: Todos los Server Components del panel admin que protejan con `proxy.requireAdmin()`.

### 2026-04-16: Un API route no puede servir dos contratos de streaming distintos
- **Error**: `AdminChatWidget` (fetch directo) y `LinkedinStrategistChat` (useChat del SDK) consumían el mismo `/api/admin-chat`. Al cambiar a `toUIMessageStreamResponse()` para el nuevo chat, el widget rompió porque esperaba texto plano.
- **Fix**: Crear endpoints separados: `/api/admin-chat` (UIMessageStream para useChat) y `/api/admin-chat-widget` (TextStream para fetch directo). Un endpoint, un contrato.
- **Aplicar en**: Siempre que un mismo backend deba servir a clientes con diferentes protocolos de streaming.
