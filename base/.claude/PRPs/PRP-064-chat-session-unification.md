# PRP-064: Chat Session Unification — Un Visitante = Una Sesión

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-16
> **Proyecto**: KIA Intelligence (landing-linkedin)

---

## Objetivo

Unificar todos los mensajes de un mismo visitante bajo una única `chat_session` persistente, eliminando la fragmentación actual (1 sesión por mensaje) mediante un identificador de dispositivo estable basado en `localStorage` + `fingerprint` de dispositivo, persistido correctamente con el patrón `_hasHydrated` de Zustand.

---

## Por Qué

| Problema | Impacto Real | Solución |
|----------|-------------|----------|
| 81% de sesiones tienen 1 solo mensaje (42 de 52) | Imposible ver el hilo de conversación de un lead en `/admin/conversations` | SessionId persistente en localStorage con hydration guard |
| `initSession()` en `chatStore.ts` **sin** `_hasHydrated` guard | Durante SSR/hidratación se genera un UUID extra antes de leer localStorage → el primer mensaje usa ese UUID efímero | Replicar el mismo guard que ya funciona en `linkedinChatStore.ts` |
| `adminChatStore.ts` también sin guard | El widget flotante del admin genera sessionId en SSR también | Aplicar el mismo fix |
| Sin `fingerprint` ni IP en `chat_sessions.metadata` | No hay forma de agrupar sesiones del mismo usuario anónimo | Añadir `visitorId` basado en `crypto.randomUUID()` + localStorage con TTL de 30 días |

**Valor de negocio**: El admin podrá ver conversaciones completas de leads → identificar patrones de objeciones → mejorar el script de ventas → más conversiones.

---

## Qué

### Criterios de Éxito
- [ ] Un mismo visitante que envía 5 mensajes → **1 sola `chat_session`** en Supabase con 10 mensajes
- [ ] Al refrescar la página, el visitante reanuda la misma sesión
- [ ] `/admin/conversations` muestra sesiones con historial completo (>1 mensaje)
- [ ] El widget admin flotante mantiene su sessionId entre aperturas/cierres
- [ ] `npx tsc --noEmit` pasa sin errores

### Comportamiento Esperado (Happy Path)

1. Visitante llega al sitio → `_hasHydrated = false` → no se genera sessionId
2. Zustand hidrata desde localStorage → usa sessionId existente o genera uno nuevo
3. Todos los mensajes de la visita usan el mismo sessionId estable
4. Admin ve 1 sesión con el historial completo del lead

---

## Contexto

### Diagnóstico Técnico (Datos Reales de BD)

```
chat_sessions:   53 total
├── multi_msg_sessions: 10 (19%)  ← Sesiones "sanas"
└── single_msg_sessions: 42 (81%) ← Fragmentación total — CRÍTICO
```

**Root Cause #1 — `chatStore.ts` (Chat público)**:
```typescript
// ❌ BUGGY: Sin _hasHydrated guard
initSession: () => {
  if (!get().sessionId) {  // Durante SSR, sessionId = null SIEMPRE
    set({ sessionId: crypto.randomUUID() })  // UUID efímero
  }
}
```

**Root Cause #2 — `adminChatStore.ts` (Widget admin)**:
```typescript
// ❌ BUGGY: Sin _hasHydrated guard (igual que el anterior)
initSession: () => {
  if (!get().sessionId) {
    set({ sessionId: crypto.randomUUID() })
  }
}
```

**Gold Standard en el proyecto** — `linkedinChatStore.ts` (ya correcto):
```typescript
// ✅ CORRECTO: _hasHydrated guard
_hasHydrated: false,
setHasHydrated: (val) => set({ _hasHydrated: val }),
initSession: () => {
  const state = get()
  if (state._hasHydrated && !state.sessionId) {  // Doble check
    set({ sessionId: crypto.randomUUID() })
  }
},
// En persist:
onRehydrateStorage: () => (state) => {
  state?.setHasHydrated(true)  // Marca hidratación COMPLETA
}
```

### Referencias de Código

- `src/features/chat/store/chatStore.ts` — **Store a corregir** (sin hydration guard) ← ROOT CAUSE
- `src/features/chat/store/adminChatStore.ts` — **Store a corregir** (sin hydration guard) ← ROOT CAUSE
- `src/features/admin-linkedin/store/linkedinChatStore.ts` — **Gold Standard** (ya tiene `_hasHydrated`)
- `src/features/chat/hooks/useChatStream.ts` — Envía `body: { sessionId }` al backend
- `src/features/chat/components/ChatDrawer.tsx` — Llama `initSession()` en mount
- `src/app/api/chat/route.ts` — Recibe `sessionId`, hace upsert en `chat_sessions`

### Schema de BD (sin cambios necesarios para Fases 1-3)

```
chat_sessions:
  id: UUID PK
  metadata: JSONB  ← añadir { visitorId, source } en Fase 3
  updated_at: timestamptz
  is_processed: bool
  is_seen: bool

chat_messages:
  id: UUID PK
  session_id: UUID FK → chat_sessions.id
  role: text
  content: text
  metadata: JSONB
```

---

## Blueprint (Assembly Line)

### Fase 1: Corregir `chatStore.ts` — Hydration Guard (Chat Público)
**Objetivo**: El store del chat público nunca genera sessionId durante SSR. Solo genera después de que Zustand confirma que leyó localStorage (`_hasHydrated = true`).
**Validación**: En DevTools > Application > localStorage: `kia-chat-storage.sessionId` persiste entre recargas del mismo visitante.

### Fase 2: Corregir `adminChatStore.ts` — Hydration Guard (Widget Admin)
**Objetivo**: El widget flotante del admin tampoco genera sessionId en SSR. Eliminar `messages` del partialize — el historial en localStorage es innecesario con persistencia en Supabase.
**Validación**: Mismo test que Fase 1 con `kia-admin-chat-storage.sessionId`.

### Fase 3: Añadir `visitorId` en `useChatStream` + `/api/chat`
**Objetivo**: El cliente genera un `visitorId` estable (localStorage, 30 días TTL) y lo envía con cada request. El backend lo guarda en `chat_sessions.metadata`. Respaldo para agrupar sesiones en caso de expiración del sessionId.
**Validación**: `chat_sessions.metadata` en Supabase contiene `{ visitorId: "uuid", source: "public_chat" }`.

### Fase 4: Mejorar `/admin/conversations` — Panel de Historial por Visitante
**Objetivo**: La página de conversaciones filtra sesiones con `metadata->>'source' != 'linkedin_admin'` para mostrar solo el chat público. Agrupa sesiones del mismo `visitorId` con un indicador de "historial fragmentado".
**Validación**: Admin puede ver todas las sesiones relacionadas de un lead.

### Fase 5: Validación Final E2E
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npx tsc --noEmit` limpio
- [ ] Test: 3 mensajes → refresh → 2 mensajes → 1 sesión en BD con 10 mensajes
- [ ] DevTools Network: todos los POST /api/chat usan el mismo sessionId
- [ ] `/admin/conversations` muestra sesiones con múltiples mensajes correctamente

---

## Gotchas

- [ ] **`onRehydrateStorage` es el trigger clave**: Sin él, `_hasHydrated` nunca se pone en `true`. Verificar que el callback esté dentro de la config de `persist` (segundo argumento), no dentro del store.
- [ ] **`initSession()` debe usarse en `useEffect([_hasHydrated])`**: No en `useEffect([])` que se ejecuta antes de la hidratación.
- [ ] **El `id` del hook `useChat`** (`kia-intelligence-chat-session`) es estable y no debe cambiarse. Es el ID del historial interno del SDK, no el sessionId de Supabase.
- [ ] **localStorage solo existe en el cliente**: Cualquier código que genere `visitorId` debe ir dentro de `useEffect` o verificar `typeof window !== 'undefined'`.
- [ ] **Sesiones históricas**: Las 42 sesiones fragmentadas existentes NO se pueden unificar retroactivamente (cada una tiene su propia UUID). El fix aplica solo para sesiones NUEVAS.

## Anti-Patrones

- ❌ NO usar `crypto.randomUUID()` fuera del `_hasHydrated` guard
- ❌ NO leer `localStorage` directamente en componentes — usar Zustand `persist`
- ❌ NO usar IP del cliente como identificador único (colisiones + GDPR)
- ❌ NO crear nueva tabla — usar `metadata` JSONB existente
- ❌ NO modificar el `id` estable del hook `useChat`

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-04-16: `initSession()` sin `_hasHydrated` genera IDs fantasma
- **Error**: `chatStore.ts` → `initSession()` ejecuta durante SSR porque `sessionId === null` antes de que Zustand lea localStorage. Genera UUID efímero → el primer mensaje usa ese UUID → nueva sesión huérfana.
- **Fix**: Añadir `_hasHydrated: false`, `setHasHydrated`, y en `onRehydrateStorage` llamar `state?.setHasHydrated(true)`. En `initSession()`, verificar `state._hasHydrated && !state.sessionId`.
- **Aplicar en**: TODO store que genere IDs únicos con `persist` de Zustand.

---

*PRP pendiente aprobación. No se ha modificado código.*
