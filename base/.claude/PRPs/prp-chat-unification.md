# PRP: Unificación de Sesiones & Fix de Fragmentación (PRP-043)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-16
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Eliminar la creación de múltiples tarjetas de sesión para un mismo usuario. Garantizar que toda la conversación se mantenga bajo un único `sessionId` persistente, incluso tras refrescar la página o reabrir el chat.

---

## Por Qué (Análisis del Fallo)

1.  **Generación Prematura**: Actualmente, `crypto.randomUUID()` se ejecuta en el momento en que se define el store. Esto genera un ID nuevo *antes* de que Zustand recupere el ID guardado en `localStorage`.
2.  **Race Condition**: El componente `ChatDrawer` y el hook `useChatStream` capturan este ID "efímero" antes de que la hidratación lo sobreescriba con el ID real.
3.  **Persistencia Fragmentada**: El backend, al recibir IDs distintos en cada carga, crea registros separados en Supabase, lo que resulta en la dispersión vista en el admin panel.

---

## Qué (Propuesta Técnica)

### 1. Store: Hydration-Aware Logic
**Archivo**: `src/features/chat/store/chatStore.ts`
- Inicializar `sessionId` en `null`.
- Añadir un estado interno `_hasHydrated` para rastrear cuándo es seguro leer/escribir el ID.
- Configurar el middleware `persist` para que marque `_hasHydrated: true` tras la carga.
- Refactorizar `initSession` para que solo genere un UUID si el ID sigue siendo `null` *después* de la hidratación.

### 2. Frontend: Chat Guard
**Archivo**: `src/features/chat/components/ChatDrawer.tsx`
- No inicializar el hook `useChatStream` (o no permitir envíos) hasta que el store haya hidratado.
- Mostrar un estado de "sincronización" si es necesario (milisegundos).

### 3. Backend: Registro Log Mejorado
**Archivo**: `src/app/api/chat/route.ts`
- Añadir logs de comparación para detectar si una sesión está siendo "reutilizada" o "creada" inesperadamente.

---

## Criterios de Éxito

- [ ] Al refrescar la página y enviar un segundo mensaje, este aparece en la **misma tarjeta** del admin panel.
- [ ] El `sessionId` en los logs del backend es idéntico entre diferentes turnos de conversación.
- [ ] No se generan IDs aleatorios al azar en el estado inicial de la aplicación.

---

## Gotchas & Riesgos

- **SSR Compatibility**: Debemos asegurar que el `null` inicial no cause errores de layout durante el renderizado en servidor (ya manejado por `typeof window`).
- **Reset Chat**: La función de "Reiniciar conversation" debe generar un nuevo ID y limpiar el anterior correctamente sin dejar residuos.

---

*PRP pendiente de aprobación por el usuario.*
