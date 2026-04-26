# PRP: Blindaje de LinkedIn Strategist Assistant (PRP-044)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-16
> **Proyecto**: KIA Intelligence — Admin Dashboard

---

## Objetivo

Corregir el fallo de respuesta en el asistente de administración (LinkedIn Strategist) y unificar su sistema de sesiones para evitar la fragmentación, aplicando la lógica robusa de normalización y el "Hydration Guard" ya implementado en el chat principal.

---

## Por Qué

1.  **Validación de Prompt (Backend)**: El API de `/api/admin-chat` no tiene la lógica de limpieza de mensajes. Al recibir historiales con artefactos del SDK (especialmente si hubo pasos intermedios), el motor de IA falla.
2.  **Fragmentación (Store)**: El `adminChatStore.ts` carece de control de hidratación. Al cargar el panel admin, se puede generar un `sessionId` nuevo antes de recuperar el anterior del `localStorage`.
3.  **Error en Primer Mensaje**: El usuario reporta que no responde ni el primero. Esto suele indicar un fallo en el mapeo inicial del `systemPrompt` o en la estructura de los mensajes enviados al SDK.

---

## Qué (Propuesta Técnica)

### 1. Backend: Normalización de Mensajes
**Archivo**: `src/app/api/admin-chat/route.ts`
- Implementar la función de filtrado de partes.
- Asegurar que `streamText` reciba solo partes válidas (`text`, `image`, `tool-call`, `tool-result`).
- Agregar validación de `sessionId` similar a la del chat principal.

### 2. Store: Hydration Guard
**Archivo**: `src/features/chat/store/adminChatStore.ts`
- Añadir flag `_hasHydrated`.
- Refactorizar `initSession` para que sea safe-call post-hidratación.

### 3. Frontend: Estabilización
**Archivo**: `src/features/chat/components/AdminChatWidget.tsx`
- Sincronizar el renderizado y el envío con el estado de hidratación.
- Asegurar que el `userMessage` no rompa el esquema de la IA.

---

## Criterios de Éxito

- [ ] El asistente de LinkedIn responde inmediatamente al primer mensaje.
- [ ] La sesión en el admin es persistente (misma tarjeta tras refrescar).
- [ ] Se filtran correctamente los artefactos internos del historial.

---

## Gotchas & Riesgos

- **Manual Streaming**: Dado que este componente usa un loop de streaming manual (no `useChat`), debemos ser cuidadosos al actualizar el estado de los mensajes para no perder el orden.

---

*PRP pendiente de aprobación.*
