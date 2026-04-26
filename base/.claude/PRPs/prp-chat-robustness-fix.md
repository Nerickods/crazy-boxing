# PRP: Robust Chat Persistence & Validation Fix

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-16
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Eliminar el error `AI_InvalidPromptError` (causado por tags internos del SDK como `step-start`) y garantizar que el `sessionId` sea consistente y nunca llegue `undefined` al backend, especialmente en hilos de conversación complejos con imágenes.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| `AI_InvalidPromptError`: El backend recibe mensajes del asistente con tags de control internos (`step-start`) que fallan la validación de Zod del SDK AI. | Implementar una **normalización estricta** en el backend que filtre y limpie las partes del mensaje, dejando solo `text`, `image`, `tool-call` y `tool-result`. |
| `sessionId: undefined`: Los logs muestran que el `sessionId` llega indefinido al backend a pesar de las correcciones previas. | Usar una referencia reactiva y pre-checks en el hook `useChatStream` para asegurar que el `sessionId` del store esté presente antes de emitir un request. |
| Inconsistencia en Visión: Las imágenes causan payloads grandes que a veces rompen el flujo de mensajes si el historial no está limpio. | Sanitizar el historial de mensajes de cualquier artefacto UI de sesiones anteriores antes de pasarlo a `streamText`. |

---

## Diagnóstico Técnico Detallado

### Bug #1 — AI_InvalidPromptError (The "step-start" issue)

El Vercel AI SDK, cuando se usa con herramientas o múltiples pasos (`stepCountIs(5)`), inserta partes invisibles en el contenido del mensaje del asistente para trackear el progreso (ej: `step-start`, `step-finish`). 
Cuando el usuario envía un nuevo mensaje, el hook `useChat` envía TODO el historial de vuelta al API. Nuestro código de normalización actual hace esto:

```typescript
// route.ts
content: rawParts.map((p: any) => {
  if (p.type === 'text') return { type: 'text', text: p.text };
  if (p.type === 'image') { ... }
  return p; // <--- ERROR: Retorna el objeto 'step-start' original
})
```

El validador de `streamText` ve `type: 'step-start'` y lanza un error porque no es una parte válida de un `CoreAssistantMessage`.

### Bug #2 — sessionId Inestable

A pesar de que el store genera un UUID, si la hidratación de Zustand ocurre milisegundos después de que el hook `useChatStream` se inicializa, el valor inicial pasado al request `body` puede quedar fijado como `undefined` o `null` si no se maneja de forma reactiva en el objeto de configuración del SDK.

---

## Qué

### Criterios de Éxito

- [ ] Mensajes del asistente con herramientas/pasos se re-envían sin errores de validación.
- [ ] El log del backend muestra `sessionId` siempre con un UUID válido (nunca `undefined`).
- [ ] La conversación fluye correctamente con imágenes y múltiples turnos de texto.
- [ ] `npm run build` exitoso.

---

## Blueprint (Assembly Line)

### Fase 1: Backend — Normalización de Mensajes Robusta
**Archivo**: `src/app/api/chat/route.ts`
- Modificar el mapeo de `messages` para que solo incluya partes de tipo `text`, `image`, `tool-call` y `tool-result`.
- **Eliminar** cualquier parte cuyo tipo no esté explícitamente permitido.
- Asegurar que el `content` de un `assistant` message sea filtrado para remover artefactos de UI.

### Fase 2: Frontend — Sincronización de SessionId
**Archivo**: `src/features/chat/hooks/useChatStream.ts`
- Asegurar que el `body: { sessionId }` sea evaluado dinámicamente o que se actualice cuando el store de Zustand cambie.
- Agregar log de depuración en el cliente antes de llamar a `sdkSendMessage`.

### Fase 3: Store — Hydration Guard
**Archivo**: `src/features/chat/store/chatStore.ts`
- Tweak en el inicializador para ser aún más agresivo con la creación del ID.

---

## Gotchas & Riesgos

- **Vercel AI SDK Internal Types**: Los tipos internos pueden cambiar. Es mejor filtrar por "lo que conocemos" (whitelist) que tratar de bloquear todo lo desconocido (blacklist).
- **Herramientas (Tools)**: Si el asistente usa herramientas, las respuestas incluyen objetos `tool-call`. Estos DEBEN preservarse para que el modelo mantenga el contexto de qué herramientas ejecutó.

---

*PRP pendiente de aprobación.*
