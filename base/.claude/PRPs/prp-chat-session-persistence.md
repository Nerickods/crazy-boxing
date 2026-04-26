# PRP: Chat Session Persistence Fix

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-16
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Corregir la lógica de persistencia del chat para que todos los mensajes de una misma conversación se almacenen bajo **un único `session_id`** en Supabase, eliminando el patrón actual donde cada par de mensajes genera una sesión nueva en la BD.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| Cada envío de mensaje (especialmente con imágenes) genera una sesión nueva en `chat_sessions`, fragmentando la conversación | Estabilizar el `sessionId` desde el primer render usando el store persistido de Zustand y pasarlo correctamente al hook `useChat` |
| El admin panel muestra conversaciones de 1-2 mensajes en lugar de hilos completos, imposibilitando el análisis de leads | Con el fix, cada visitante tendrá 1 sesión completa con toda la conversación legible |
| El error en el segundo mensaje se genera porque `useChat` detecta un `id` cambiante y resetea su caché interna | Usar la misma clave de `id` de manera estable durante toda la vida del componente |

**Valor de negocio**: El admin panel es la herramienta de ventas central. Sin conversaciones completas, Nerick no puede analizar la intención del lead, calificar prospectos, ni cerrar ventas. Este fix es crítico para la operación.

---

## Diagnóstico Técnico Exhaustivo (Root Cause)

### Bug #1 — Race Condition: sessionId llega `null` al primer render

**Archivo**: `src/features/chat/hooks/useChatStream.ts` → `useChat({ id: sessionId ?? undefined })`

**Flujo del problema**:
```
1. ChatDrawer renderiza → useChatStream({ sessionId: null }) [Zustand aún no rehidrató del localStorage]
2. useChat({ id: undefined }) se inicializa con id indefinido → genera ID interno temporal
3. isOpen = true → useEffect → initSession() → sessionId = UUID-A
4. ChatDrawer re-renderiza → useChatStream({ sessionId: UUID-A })
5. useChat({ id: UUID-A }) detecta que cambió el id → RESET de historial interno
```

**Consecuencia**: El `sessionId` que llega al primer POST es `null` o diferente al que llega al segundo POST, por lo que el API en cada llamada ejecuta:
```
finalSessionId = sessionId && isValidUuid(sessionId) ? sessionId : crypto.randomUUID()
```
...generando UUIDs distintos en cada request.

### Bug #2 — useChat re-crea historial al cambiar `id`

En `@ai-sdk/react`, la prop `id` en `useChat` actúa como **llave de conversación**. Si `id` cambia entre renders (de `undefined` → `UUID-A`), el hook borra el historial in-memory y empieza de cero. Esto es lo que causa el error en el segundo mensaje: el hook ya no conoce los mensajes anteriores y el API recibe un array con solo 1 mensaje.

### Bug #3 — initSession() se llama en handleSend (peligroso)

En `ChatDrawer.tsx` línea 80:
```tsx
const handleSend = (e?, textOverride?) => {
  ...
  initSession(); // ← PELIGROSO: puede cambiar sessionId mid-flight
  sendMessage({ text: textToSend, attachments: files });
};
```
Si por cualquier motivo `sessionId` es null cuando el usuario envía, `initSession()` genera un UUID nuevo DURANTE el envío, cambiando el `body.sessionId` del siguiente re-render pero no del request ya en flight.

### Bug #4 — RLS Policy SELECT faltante en `chat_sessions`

```
Políticas chat_sessions actuales:
- "Admins full access chat_sessions" → ALL, solo is_admin()
- "Public can start chat sessions"   → INSERT
❌ FALTA: Política SELECT para lectura

Políticas chat_messages actuales:
- "Admins full access chat_messages" → ALL
- "Public can insert messages"       → INSERT
- "Public can view their session messages" → SELECT (qual: true) ✅
```

El upsert en `route.ts` necesita primero leer la fila existente para saber si hacer INSERT o UPDATE. Sin SELECT policy, el upsert puede fallar silenciosamente.

---

## Evidencia en BD (Confirmación del Bug)

Patrón observado en las últimas 10 sesiones:

| session_id | messages | Diagnóstico |
|-----------|----------|-------------|
| `46bbce3f...` | 1 | Solo user msg, onFinish falló o nueva sesión |
| `f58dcfc5...` | 1 | Solo user msg, nueva sesión por UUID cambiado |
| `dc75256f...` | 2 | user + assistant — OK pero sesión distinta de anterior |
| `684d5803...` | 1 | Solo user msg |
| `34465ba9...` | 2 | user + assistant — Diferente al anterior |

**Patrón**: Sesiones consecutivas creadas con segundos de diferencia (mismo usuario, conversación fragmentada). Confirmado: la conversación de imagen + texto siguiente = 2 sesiones distintas.

---

## Qué

### Criterios de Éxito

- [ ] Enviar 5 mensajes consecutivos → todos bajo el mismo `session_id` en Supabase
- [ ] Enviar mensaje con imagen → seguido de texto → misma sesión
- [ ] Admin panel muestra el hilo completo de una conversación
- [ ] No hay error rojo en el segundo mensaje del chat
- [ ] `npm run typecheck` pasa sin errores nuevos
- [ ] `npm run build` exitoso

### Comportamiento Esperado (Happy Path)

```
Visitante abre el chat
  → sessionId = UUID-A (generado antes del primer render de useChat)
  → useChat({ id: 'UUID-A' }) se inicializa estable
  
  → Msg1 (texto): POST sessionId=UUID-A → session upsert OK → msgs insert OK
  → Msg2 (imagen): POST sessionId=UUID-A → session upsert OK → msgs insert OK
  → Msg3 (texto): POST sessionId=UUID-A → session upsert OK → msgs insert OK
  
→ Supabase: 1 sesión, N mensajes, admin ve hilo completo ✓
```

---

## Contexto

### Referencias
- `src/features/chat/store/chatStore.ts` — Store con Zustand persist
- `src/features/chat/hooks/useChatStream.ts` — Hook central del bug
- `src/features/chat/components/ChatDrawer.tsx` — Componente con timing issue
- `src/app/api/chat/route.ts` — API de persistencia en BD
- Supabase project: `ultljlakvxnrfrlpldpm`

### Arquitectura de la Solución

Sin archivos nuevos. Cambios quirúrgicos en los existentes:

```
chatStore.ts       → sessionId nunca es null: generar UUID en definición inicial
useChatStream.ts   → id de useChat referenciado desde store directamente (skip props)
ChatDrawer.tsx     → Remover initSession() del handleSend
route.ts           → [Opcional] mejorar logging
BD Migration       → Policy SELECT en chat_sessions
```

### Modelo de Datos (Solo parche RLS)

```sql
-- Política SELECT faltante en chat_sessions
CREATE POLICY "Public can view own sessions"
ON public.chat_sessions
FOR SELECT
USING (true);
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo fases. Las subtareas se mapean al entrar a cada fase.

### Fase 1: Fix del Store — sessionId Siempre Válido
**Objetivo**: El `sessionId` en `chatStore` ya tiene un UUID válido desde la inicialización, nunca es null en el primer render.
**Validación**: Al montar el ChatDrawer, `sessionId` impreso en console es un UUID válido desde el primer log.

### Fase 2: Fix del Hook — useChat con id Estable
**Objetivo**: El hook `useChat` en `useChatStream` recibe la misma clave `id` durante toda la vida del componente.
**Validación**: 3 mensajes consecutivos → los 3 logs `[API-CHAT] Request Received` muestran el mismo `sessionId`.

### Fase 3: Limpieza del Componente — ChatDrawer
**Objetivo**: Remover la llamada a `initSession()` en `handleSend` y simplificar el flujo de inicialización.
**Validación**: Chat funciona correctamente, mensajes se envían, no hay errores de TypeScript.

### Fase 4: Fix de BD — Política RLS SELECT en chat_sessions
**Objetivo**: La tabla `chat_sessions` tiene la política SELECT para que el upsert del servicio funcione sin interferencias.
**Validación**: `execute_sql` verifica que la política existe. `get_advisors` no reporta alertas nuevas.

### Fase 5: Validación Final End-to-End
**Objetivo**: Sistema completo verificado.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Verificar en Supabase: 1 sesión con N mensajes por conversación
- [ ] Admin panel muestra conversación completa
- [ ] Test manual: texto → imagen → texto → 3 mensajes en 1 sesión ✓

---

## 🧠 Aprendizajes (Self-Annealing)

> Esta sección crece durante la implementación.

---

## Gotchas

- [ ] **Zustand `persist` con SSR**: El store no está rehidratado en el primer servidor render. El sessionId inicial debe ser generado solo en el cliente (`typeof window !== 'undefined'`).
- [ ] **`useChat` id inmutable conceptualmente**: En `@ai-sdk/react`, cambiar `id` post-mount = nueva conversación. Tratar como key inmutable desde el primer render.
- [ ] **`crypto.randomUUID()` en SSR**: Funciona en Node 18+ pero el store Zustand debe tener un inicializador que detecte si está en el servidor.
- [ ] **upsert requiere SELECT**: El `upsert` con `{ onConflict: 'id' }` necesita permisos SELECT para leer la fila existente antes de decidir INSERT vs UPDATE.
- [ ] El historial de mensajes en el API ya está correctamente implementado: solo guarda el último mensaje, no todos. NO cambiar esa lógica.

## Anti-Patrones

- NO crear nuevo store/hook para gestionar la sesión
- NO mover la inicialización del sessionId al servidor
- NO usar `as any` adicionales en TypeScript
- NO eliminar el `persist` de Zustand — es lo que mantiene la sesión entre page refreshes

---

*PRP pendiente aprobación. No se ha modificado código.*
