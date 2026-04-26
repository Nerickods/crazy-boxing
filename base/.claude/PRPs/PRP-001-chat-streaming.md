# PRP-001: Migración a Chat Streaming con Vercel AI SDK v5

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence — landing-linkedin

---

## Objetivo

Migrar el chatbot **KIA Intelligence** de un modelo de respuesta síncrona (espera total) a **streaming en tiempo real** usando Vercel AI SDK v5 (`streamText` + `useChat`), preservando al 100% la UI premium existente en `ChatDrawer.tsx`, la personalidad de marca "Invisible Stack" y la herramienta `register_lead`.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| El usuario ve una pantalla congelada ("Neural Processing...") por 3-8 segundos hasta que la IA termina de generar | El usuario ve el texto aparecer token a token en tiempo real, como lo hace ChatGPT |
| La UX actual rompe la percepción de "elite" y "premium" que KIA Intelligence proyecta | La respuesta progresiva refuerza la sensación de "motor neuronal en vivo" |
| El bucle manual de `tool_calls` en `openAiService.ts` es frágil y difícil de mantener | El SDK v5 maneja el ciclo de herramientas de forma nativa con `maxSteps` |

**Valor de negocio**: Una UX más fluida y premium incrementa el tiempo de conversación y la tasa de conversión hacia el `register_lead`. La percepción de velocidad es una señal de softare de alta calidad para el perfil de cliente objetivo.

---

## Qué

### Criterios de Éxito
- [ ] El texto de la IA aparece token por token en el `ChatDrawer` sin reemplazo de arquitectura visual
- [ ] La tool `register_lead` sigue ejecutándose correctamente (inserción en tabla `enrollments`)
- [ ] El indicador de carga ("Neural Processing...") desaparece durante el streaming y se mantiene solo mientras hay actividad de herramientas
- [ ] La persistencia en `chat_sessions` y `chat_messages` de Supabase sigue funcionando
- [ ] `npm run typecheck` y `npm run build` pasan sin errores
- [ ] El historial de mensajes en `chatStore.ts` (Zustand + persist) sigue funcionando correctamente al cerrar y abrir el drawer

### Comportamiento Esperado (Happy Path)

1. El usuario escribe un mensaje en `ChatDrawer` y presiona "Enviar"
2. El mensaje de usuario se añade al chat inmediatamente (comportamiento actual ✅)
3. Aparece un **placeholder de streaming** ("KIA está procesando...") en el chat
4. A medida que el modelo genera tokens, el texto se va renderizando progresivamente en ese placeholder
5. Si la IA llama a `register_lead`, la tool se ejecuta en el servidor, el resultado se envía de vuelta al stream sin interrumpir el flujo visible
6. Al completarse el stream, el mensaje se consolida en el store de Zustand como un mensaje `assistant` definitivo
7. Supabase recibe la persitencia del mensaje completo al finalizar el stream

---

## Contexto

### Descubrimiento Crítico: Dependencias YA Instaladas ✅

El `package.json` ya contiene las dependencias del Bloque 00 (Setup Base):
- `ai@^6.0.146` — Vercel AI SDK v5 Core ✅
- `@ai-sdk/react@^3.0.148` — Hook `useChat` ✅
- `@ai-sdk/openai-compatible@^2.0.38` — Provider compatible con OpenRouter ✅
- `openai@^6.33.0` — Librería actual (a REEMPLAZAR en el servicio, no desinstalar)

> **IMPORTANTE**: El proyecto usa `@ai-sdk/openai-compatible` en lugar de `@openrouter/ai-sdk-provider` (que indica el template `00-setup-base.md`). La funcionalidad es equivalente. Se respetará el provider ya instalado.

### Referencias de Código
- `src/features/chat/services/openAiService.ts` — **REFACTORIZAR**: Reemplazar con `streamText`
- `src/app/api/chat/route.ts` — **REFACTORIZAR**: Cambiar de `NextResponse.json` a `result.toUIMessageStreamResponse()`
- `src/features/chat/components/ChatDrawer.tsx` — **ADAPTAR**: Migrar de fetch manual a `useChat` hook
- `src/features/chat/store/chatStore.ts` — **REVISAR**: Evaluar si `chatStore` sigue siendo necesario con `useChat`
- `.agent/skills/ai/references/agents/01-chat-streaming.md` — Template de referencia principal
- `.agent/skills/ai/references/agents/05-tools-funciones.md` — Referencia para tools con SDK v5

### Arquitectura Propuesta (Feature-First)

```
src/features/chat/
├── components/
│   └── ChatDrawer.tsx        [MODIFICAR] - Migrar a useChat hook
├── hooks/
│   └── useChatStream.ts      [NUEVO] - Wrapper personalizado sobre useChat
├── services/
│   └── openAiService.ts      [REEMPLAZAR] - Nuevo servicio con streamText
├── store/
│   └── chatStore.ts          [ADAPTAR] - Reducir a solo estado de UI (isOpen, etc.)
└── types/
    └── chat.types.ts         [NUEVO] - Tipos TypeScript para el nuevo flujo

src/app/api/chat/
└── route.ts                  [REEMPLAZAR] - Endpoint de streaming
```

### Análisis de Conflicto: `chatStore` vs `useChat`

El hook `useChat` del SDK v5 gestiona internamente el estado de los mensajes (`messages`, `status`, `error`). Esto **crea un conflicto** con el estado de mensajes en `chatStore.ts`.

**Decisión de Diseño**: 
- `useChat` gestiona los **mensajes de la sesión activa** (voátil, en-memoria)
- `chatStore` se reduce a gestionar **estado de UI** (`isOpen`, `isMinimized`, etc.) y el `sessionId` para Supabase
- Los mensajes del drawer se obtienen desde el hook, no del store

### Modelo de Datos (Sin cambios en Supabase)

Las tablas `chat_sessions` y `chat_messages` existentes se mantienen. Solo cambia el **momento y método** de la persistencia: ahora se hace vía un callback `onFinish` del `streamText` en el servidor.

```sql
-- Sin cambios DDL requeridos
-- Tablas existentes:
-- public.chat_sessions (id, updated_at)
-- public.chat_messages (session_id, role, content, metadata)
-- public.enrollments (name, email, company, employee_size, source)
```

### Configuración del Provider (Existente)

El proyecto usa `@ai-sdk/openai-compatible`. El nuevo `openAiService.ts` usará este patrón:

```typescript
// src/lib/ai/openrouter.ts [NUEVO]
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

export const openrouter = createOpenAICompatible({
  name: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
})

export const DEFAULT_MODEL = openrouter('openai/gpt-4o')
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo se definen FASES. Las subtareas se generan al entrar a cada fase.

### Fase 1: Crear Infraestructura de Provider y Tipos
**Objetivo**: Crear el archivo `src/lib/ai/openrouter.ts` con el provider centralizado y el archivo de tipos `src/features/chat/types/chat.types.ts`
**Validación**: El módulo exporta correctamente el provider y el modelo; `typecheck` pasa

### Fase 2: Refactorizar API Route a Streaming
**Objetivo**: Reemplazar `src/app/api/chat/route.ts` para usar `streamText`, manejo nativo de herramientas (`tools`, `maxSteps`), persistencia en Supabase en el callback `onFinish`, y retornar `result.toUIMessageStreamResponse()`
**Validación**: `curl -X POST /api/chat` con un mensaje simple retorna un stream de texto visible y el mensaje persiste en Supabase

### Fase 3: Crear Hook `useChatStream`
**Objetivo**: Crear `src/features/chat/hooks/useChatStream.ts`; un wrapper sobre `useChat` que encapsula la configuración del endpoint, el `sessionId` y expone solo lo que `ChatDrawer` necesita (`messages`, `sendMessage`, `status`, `error`, `input`, `setInput`)
**Validación**: El hook importa correctamente desde `@ai-sdk/react` y su tipado es estricto

### Fase 4: Adaptar `ChatDrawer.tsx` al Hook de Streaming
**Objetivo**: Reemplazar el fetch manual en `handleSend` con `sendMessage` del hook. Actualizar el renderizado para mostrar texto streaming token a token usando `message.parts`. Actualizar el indicador de carga según `status === 'streaming'`. Preservar al 100% toda la UI, las animaciones, el `PulsingOrb` y las sugerencias iniciales.
**Validación**: El chat muestra tokens en tiempo real; el drawer se ve idéntico al anterior

### Fase 5: Adaptar `chatStore.ts`
**Objetivo**: Eliminar del store las acciones y estado de mensajes que ahora maneja `useChat` (`messages`, `addMessage`, `updateMessage`, `setMessages`). Conservar todo el estado de UI y el `sessionId`.
**Validación**: El store reducido compila sin errores; el drawer sigue abriendo/cerrando correctamente

### Fase 6: Validación Final End-to-End
**Objetivo**: Sistema completo funcionando sin errores — streaming, tools, persistencia y UI premium
**Validación**:
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso
- [ ] Enviar "hola" → texto aparece en tiempo real en el drawer
- [ ] Conversar hasta dar nombre + email + empresa → `register_lead` se ejecuta → fila encontrada en tabla `enrollments`
- [ ] Cerrar y reabrir el drawer → `sessionId` se mantiene
- [ ] Inspector de red (DevTools) muestra respuesta con `Content-Type: text/event-stream`

---

## 🧠 Aprendizajes (Self-Annealing)

> Esta sección CRECE durante la implementación. Vacía por ahora.

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] **SDK v5 usa `message.parts`, NO `message.content`**: En v5, el texto de un mensaje se accede via `message.parts.filter(p => p.type === 'text').map(p => p.text).join('')`. El uso de `message.content` es v4 y causará texto vacío.
- [ ] **`useChat` importa de `@ai-sdk/react`, NO de `'ai/react'`**: El import incorrecto causará errores de módulo en runtime.
- [ ] **`toUIMessageStreamResponse()` NO `toDataStreamResponse()`**: El método del v4 retorna un formato incompatible. Causa que `useChat` no parsee la respuesta.
- [ ] **El `sessionId` debe pasar vía `body` en `useChat`**: El hook acepta un objeto `body` que se mezcla automáticamente en cada request al endpoint. Úsalo para enviar el `sessionId`.
- [ ] **`onFinish` en `streamText` se ejecuta en el SERVIDOR**: Es el lugar correcto para la persistencia en Supabase. No intentar persistir desde el cliente.
- [ ] **Tool `register_lead` requiere `execute` async**: La definición de tools en SDK v5 usa la propiedad `execute`, que es una `async function`. No usar el formato de herramientas del SDK de `openai` directamente.
- [ ] **La UI de `ChatDrawer` usa `m.content` actualmente**: Habrá que migrar los renders a `message.parts`. Hacerlo con un helper `getMessageText(m)`.
- [ ] **`@ai-sdk/openai-compatible` vs `@openrouter/ai-sdk-provider`**: El proyecto usa el primero. La API es `createOpenAICompatible`. NO instalar el segundo; causará conflictos.
- [ ] **El `chatStore` tiene `persist` de Zustand**: Al reducirlo, verificar que los campos eliminados no estén en el `partialize` del middleware para evitar datos huérfanos en `localStorage`.

## Anti-Patrones

- NO mezclar el estado de mensajes entre `useChat` y `chatStore` — una sola fuente de verdad
- NO usar `message.content` directamente en el template (v4 pattern) — siempre usar `message.parts`
- NO persistir en Supabase desde el cliente — siempre en el `onFinish` del servidor
- NO modificar el diseño visual del `ChatDrawer` — solo la capa lógica de datos
- NO ignorar errores de TypeScript — tipar correctamente todos los `message.parts`

---

*PRP pendiente aprobación. No se ha modificado código.*
