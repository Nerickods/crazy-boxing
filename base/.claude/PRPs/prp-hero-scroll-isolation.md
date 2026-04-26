# PRP: Hero Scroll Isolation — Corrección de Scroll Leakage en Overlays

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-17
> **Proyecto**: KIA Intelligence

---

## Objetivo

Eliminar el comportamiento donde el scroll del Hero (`ScrollExpandMedia`) se "filtra" al background cuando el usuario interactúa con overlays (ChatDrawer y EnrollmentModal), causando que la animación cinematic de expansión sea disparada involucrariamente mientras el usuario navega dentro de estos overlays.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| Al abrir el `ChatDrawer` y hacer scroll en la lista de mensajes, los eventos `wheel`/`touchmove` se propagan al `window` y activan la lógica de `ScrollExpandMedia` en background | Contener los eventos de scroll dentro del overlay e impedir su propagación al `window` |
| Al abrir el `EnrollmentModal` y hacer scroll en el formulario, ocurre el mismo leak de eventos | Implementar el mismo `overscroll-behavior: contain` + stop-propagation en `EnrollmentModal` |
| `EnrollmentModal` implementa scroll lock con `document.body.style.overflow = "hidden"` directamente, en conflicto con el sistema centralizado `scroll-lock.ts` | Migrar `EnrollmentModal` al sistema de `lockScroll / unlockScroll` con su propio `owner` key |

**Valor de negocio**: El Hero cinematic es la primera impresión de KIA Intelligence. Que se active en background mientras el usuario intenta scrollear dentro del chat destruye la percepción de calidad y premium del producto. Es un bug UX crítico de alta visibilidad.

---

## Análisis de Root Cause (Diagnóstico Técnico)

### Bug 1 — ChatDrawer: Leak de eventos wheel/touch al Hero

**Archivo**: `src/features/chat/components/ChatDrawer.tsx`

El `ScrollExpandMedia` en `scroll-expansion-hero.tsx` registra listeners globales en `window`:

```ts
window.addEventListener("wheel", handleWheel, { passive: false });
window.addEventListener("touchstart", handleTouchStart, { passive: false });
window.addEventListener("touchmove", handleTouchMove, { passive: false });
```

Estos listeners son activos (non-passive) y están vivos mientras `mediaFullyExpanded === false`. El `ChatDrawer` bloquea el scroll del `body` correctamente vía `lockScroll('chat-drawer')`, pero los eventos de scroll dentro del `div` de mensajes (`ref={scrollRef}`) siguen burbujeando hasta `window` por el modelo de event bubbling del DOM, donde la función `handleWheel` del Hero los intercepta.

**El área de mensajes tiene**:
```tsx
className="flex-1 overflow-y-auto overscroll-contain p-6 ..."
```

`overscroll-contain` previene el "bounce" nativo del navegador pero **NO detiene la propagación del evento `wheel` al `window`**. Los listeners de `window` del Hero los capturan igualmente.

### Bug 2 — EnrollmentModal: Misma causa + sistema de lock inconsistente

**Archivo**: `src/features/services/components/ui/EnrollmentModal.tsx`

El modal usa scroll lock directo sin pasar por el utilitario centralizado:
```ts
// ❌ Bypassa el sistema centralizado
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = "unset"  // ❌ "unset" ≠ "" — puede no limpiar correctamente
  }
  return () => { document.body.style.overflow = "unset" }
}, [isOpen])
```

Además, el contenedor scrollable del modal en mobile (`overflow-y-auto` en el `motion.div` de contenido) tampoco bloquea la propagación de eventos al `window`.

### Bug 3 — scroll-expansion-hero.tsx: No verifica si hay overlays activos antes de procesar eventos

**Archivo**: `src/shared/components/ui/scroll-expansion-hero.tsx`

El `handleWheel` dentro del `ScrollExpandMedia` no tiene ninguna comprobación sobre si hay un overlay activo. Procesa **todos** los eventos de `wheel` del `window` mientras `!mediaFullyExpanded`.

---

## Qué

### Criterios de Éxito
- [ ] Scrollear dentro del ChatDrawer (lista de mensajes) NO activa la animación del Hero en background
- [ ] Scrollear dentro del EnrollmentModal (formulario en mobile) NO activa la animación del Hero en background
- [ ] El sistema de scroll lock queda unificado bajo `scroll-lock.ts` para todos los overlays
- [ ] Al cerrar cualquier overlay, el Hero retoma su comportamiento normal sin estado corrupto
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso

### Comportamiento Esperado (Happy Path)

1. Usuario llega al Hero → animación de expansión funciona normal (scroll down expande el media box)
2. Usuario hace clic en el chat → `ChatDrawer` abre, Hero se congela en su estado actual
3. Usuario scrollea los mensajes del chat → el chat scrollea, el Hero permanece inmóvil
4. Usuario cierra el chat → Hero retoma el comportamiento de scroll normal desde donde estaba
5. Usuario abre el CTA del Hero → `EnrollmentModal` se abre, Hero se congela
6. Usuario hace scroll en el formulario del modal (mobile) → el form scrollea, el Hero permanece inmóvil
7. Usuario cierra el modal → Hero retoma el comportamiento normal

---

## Contexto

### Archivos Clave Involucrados

| Archivo | Rol | Cambio Necesario |
|---------|-----|-----------------|
| `src/shared/components/ui/scroll-expansion-hero.tsx` | Motor del Hero — registra listeners en `window` | Agregar guard: ignorar eventos si hay un overlay activo |
| `src/features/chat/components/ChatDrawer.tsx` | Overlay del chat | Agregar `stopPropagation` en el área de mensajes |
| `src/features/services/components/ui/EnrollmentModal.tsx` | Modal del formulario | Migrar a `lockScroll/unlockScroll` + `stopPropagation` en contenedor scrollable |
| `src/shared/lib/scroll-lock.ts` | Sistema centralizado de scroll lock | Exponer estado `owners` para que el Hero pueda consultarlo |

### Soluciones por Componente

#### Solución A — `scroll-lock.ts` (Exponer estado de lock)
Agregar función `getScrollLockOwners(): Set<string>` o simplemente reusar `isScrollLocked()` (ya existe) para que `ScrollExpandMedia` pueda verificar si debe ignorar un evento.

#### Solución B — `scroll-expansion-hero.tsx` (Guard en handleWheel/handleTouchMove)
```ts
// En handleWheel y handleTouchMove, ANTES de procesar:
const handleWheel = (e: WheelEvent) => {
  // ✅ Guard: Si hay un overlay activo que bloqueó el scroll, ignorar
  if (isScrollLocked()) return; // ya existe esta función en scroll-lock.ts
  // ... resto de la lógica
}
```

> **IMPORTANTE**: Esto funciona porque `ChatDrawer` ya llama `lockScroll('chat-drawer')` cuando abre. El Hero simplemente verificará ese estado antes de procesar el evento.

#### Solución C — `ChatDrawer.tsx` (Containment adicional a nivel de div)
En el div de mensajes, agregar `onWheelCapture` para captura explícita y prevenir propagación al `window` cuando el div tiene scroll overflow:
```tsx
<div
  ref={scrollRef}
  className="flex-1 overflow-y-auto overscroll-contain ..."
  onWheelCapture={(e) => {
    // Contener el scroll: si el div puede scrollear internamente, no propagar
    e.stopPropagation();
  }}
>
```

> **Nota**: La Solución B es el fix robusto. La Solución C es defensa en profundidad. Implementar ambas.

#### Solución D — `EnrollmentModal.tsx` (Migrar a sistema centralizado)
```ts
// ❌ Antes
document.body.style.overflow = "hidden"
document.body.style.overflow = "unset"

// ✅ Después
import { lockScroll, unlockScroll } from '@/shared/lib/scroll-lock'

useEffect(() => {
  if (isOpen) {
    lockScroll('enrollment-modal')
  } else {
    unlockScroll('enrollment-modal')
  }
  return () => unlockScroll('enrollment-modal')
}, [isOpen])
```

Y añadir `onWheelCapture={(e) => e.stopPropagation()}` en el contenedor scrollable del modal.

### Arquitectura: Sin archivos nuevos

Esta fix es puramente correctiva. No se crean features nuevas ni nuevos archivos. Solo se modifican los 4 archivos existentes.

```
MODIFICAR:
├── src/shared/lib/scroll-lock.ts              (sin cambios necesarios — isScrollLocked() ya existe)
├── src/shared/components/ui/scroll-expansion-hero.tsx   (guard en handleWheel + handleTouchMove)
├── src/features/chat/components/ChatDrawer.tsx          (onWheelCapture en messages div)
└── src/features/services/components/ui/EnrollmentModal.tsx  (migrar a lockScroll + onWheelCapture)
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo se definen FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Guard en ScrollExpandMedia
**Objetivo**: Que el Hero NO procese eventos `wheel`/`touchmove` cuando hay un overlay activo (`isScrollLocked() === true`).
**Validación**: El Hero permanece inmóvil cuando `ChatDrawer` está abierto (lockScroll activo). Se puede verificar inspeccionando `document.documentElement.dataset.scrollLocked` en DevTools.

### Fase 2: Containment en ChatDrawer
**Objetivo**: Que el div de mensajes del ChatDrawer capture y detenga la propagación de eventos `wheel` cuando tiene overflow interno.
**Validación**: Abrir el chat, hacer scroll en mensajes → el Hero no se mueve. Verificar con más de 3 mensajes que tengan overflow real.

### Fase 3: Migrar EnrollmentModal a sistema centralizado
**Objetivo**: El `EnrollmentModal` usa `lockScroll('enrollment-modal')` y `unlockScroll('enrollment-modal')` en lugar de manipular `document.body.style.overflow` directamente. Añadir `onWheelCapture` en el contenedor scrollable.
**Validación**: Abrir el modal → `document.documentElement.dataset.scrollLockedBy` muestra `"enrollment-modal"`. Scrollear en el formulario (mobile) no activa el Hero.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end, sin regresiones.
**Validación**:
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso
- [ ] Flujo completo: Hero expande → Chat abre → scroll en chat → chat cierra → Hero retoma
- [ ] Flujo completo: Hero expande → Modal CTA abre → scroll en form → modal cierra → Hero retoma
- [ ] En mobile: touchmove dentro de overlays no afecta el Hero

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### 2026-04-17: Guard de isScrollLocked() es el fix correcto para event leakage en overlays
- **Error**: El Hero interceptaba eventos `wheel`/`touchmove` del `window` incluso cuando el ChatDrawer o el EnrollmentModal estaban abiertos, porque los listeners de `window` no tienen visibilidad del contexto de overlay.
- **Fix**: Agregar `if (isScrollLockedByOther('scroll-expand-hero')) return;` al inicio de `handleWheel` y `handleTouchMove` en `scroll-expansion-hero.tsx`. La función `isScrollLockedByOther()` fue añadida a `scroll-lock.ts`.
- **Aplicar en**: Cualquier componente que registre listeners en `window` para controlar scroll UI. Siempre verificar el estado global de scroll lock antes de procesar.

### 2026-04-17: ⚠️ REGRESIÓN CRÍTICA — isScrollLocked() vs isScrollLockedByOther() — El componente no puede bloquearse a sí mismo
- **Error**: El guard inicial usaba `isScrollLocked()` que retorna `true` cuando CUALQUIER owner tiene el lock, incluyendo `'scroll-expand-hero'` (el propio Hero). Durante la animación del Hero, él mismo llama `lockScroll('scroll-expand-hero')` → `isScrollLocked()` retorna `true` → el guard retorna early → el Hero NUNCA puede procesar sus propios eventos de scroll → **scroll permanentemente bloqueado**.
- **Fix**: Usar `isScrollLockedByOther('scroll-expand-hero')` que retorna `true` solo si hay un owner en el Set que NO sea `'scroll-expand-hero'`. Esto distingue correctamente entre "lock propio" (no ignorar) y "lock externo" (ignorar).
- **Aplicar en**: SIEMPRE que un componente que tiene su propio lock necesite verificar si hay un lock externo. Nunca usar `isScrollLocked()` — usar `isScrollLockedByOther(miOwner)`. Esta distinción es crítica en cualquier sistema de scroll lock con múltiples owners.

### 2026-04-17: overscroll-contain CSS no detiene event bubbling — necesitas stopPropagation
- **Error**: `overscroll-contain` en el div de mensajes del ChatDrawer prevenía el bounce de iOS pero no evitaba que el evento `wheel` bubbleara al `window`.
- **Fix**: `onWheelCapture={(e) => e.stopPropagation()}` en el div scrollable. Usar `onWheelCapture` (capture phase) en lugar de `onWheel` (bubble phase) para interceptar antes que los listeners nativos del window.
- **CRÍTICO**: Solo `stopPropagation`, NUNCA `preventDefault` en el handler del div scrollable. `preventDefault` bloquearía el scroll interno del propio div.
- **Aplicar en**: Cualquier overlay (drawer, modal, panel) que contenga un área scrollable y coexista con listeners de scroll en `window`.

### 2026-04-17: Manipulación directa de body.style.overflow rompe el sistema centralizado
- **Error**: `EnrollmentModal` usaba `document.body.style.overflow = "hidden"` / `"unset"` directamente, bypasando `scroll-lock.ts`. Esto causaba que `isScrollLocked()` retornara `false` cuando el modal estaba abierto, haciendo inefectivo el guard del punto anterior.
- **Fix**: Migrar a `lockScroll('enrollment-modal')` / `unlockScroll('enrollment-modal')`. Además, `"unset"` es diferente a `""` para limpiar inline styles — el sistema centralizado ya usa `""` (correcto).
- **Aplicar en**: Cualquier componente nuevo que necesite bloquear scroll. SIEMPRE usar `lockScroll/unlockScroll` del sistema centralizado, NUNCA manipular `body.style.overflow` directamente.

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] **`isScrollLocked()` se basa en `document.documentElement.dataset.scrollLocked`** — el inline Script en `layout.tsx` setea este dataset manualmente (`hero-inline`) en el primer render. La lógica de guard en el Hero debe funcionar correctamente desde ese primer estado.
- [ ] **`onWheelCapture` vs `onWheel`**: En React, `onWheelCapture` dispara en la fase de capture del evento (antes que los handlers del window). `onWheel` dispara en la fase de bubble. Para interceptar antes que el listener del window, se debe usar la **fase nativa de capture** (`addEventListener(..., { capture: true })`). React's `onWheelCapture` no necesariamente intercepta antes de los listeners nativos del `window`. Evaluar si `stopPropagation` en React es suficiente o si se necesita `useEffect` con `addEventListener` nativo.
- [ ] **`overscroll-contain` CSS property**: Ya está en el `ChatDrawer` pero no detiene el bubbling del evento `wheel`. Es complementario, no suficiente.
- [ ] **Estado del Hero al cerrar el overlay**: Cuando el overlay se cierra y `unlockScroll` libera el scroll, el Hero retomará el procesamiento de eventos. El `scrollProgressRef.current` se habrá mantenido en su estado previo (es un `useRef`, no estado de React), por lo que la animación continuará desde donde estaba. Verificar que esto sea correcto y no cause glitches visuales.
- [ ] **`EnrollmentModal` usa `"unset"` en lugar de `""`**: `overflow: unset` hereda el valor del padre o el inicial cascaded, mientras que `overflow: ""` elimina el inline style completamente. En algunos browsers pueden comportarse diferente. El sistema centralizado `scroll-lock.ts` ya usa `""` (correcto).

## Anti-Patrones

- NO usar `e.preventDefault()` en el `onWheelCapture` del ChatDrawer — solo `stopPropagation`. `preventDefault` en eventos de wheel puede bloquear el scroll interno del propio div.
- NO agregar un nuevo flag global de "overlay activo" — `isScrollLocked()` ya cumple esa función.
- NO modificar la lógica core de `ScrollExpandMedia` más allá del guard de 1 línea por función.

---

*PRP pendiente aprobación. No se ha modificado código.*
