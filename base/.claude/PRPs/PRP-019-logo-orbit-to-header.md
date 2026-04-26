# PRP-019: Logo Orbit to Header – Scroll-Driven Logo Integration

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-03
> **Proyecto**: KIA Intelligence

---

## Objetivo

Implementar una animación scroll-driven que, conforme el usuario scrollea dentro de la `ProcessSection`, hace que el logo del `SectionSeparator` (inicio de la sección) vuele cinematográficamente hacia el centro del `Header` y quede ahí posicionado de forma estática y permanente durante el resto de la landing.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| El logo aparece en el `SectionSeparator` y luego simplemente "está" — no hay continuidad narrativa visual. | Crear una animación fluida que eleve el logo a elemento de navegación global, sincronizando su órbita con el scroll. |
| El header actualmente no tiene un elemento centrado — sólo logo (izquierda) y menú (derecha). | El logo integrado al centro del header crea una composición tripartita (Logo · Marca | Centro Logo | Menú) coherente con el minimalismo premium buscado. |

**Valor de negocio**: Refuerza la identidad de marca KIA en un momento de alta atención (cuando el usuario está evaluando el "Proceso"), y crea un elemento de navegación reconocible desde cualquier punto de la landing.

---

## Qué

### Criterios de Éxito
- [ ] El logo del `SectionSeparator` en `ProcessSection` comienza la animación fly-to-header aproximadamente en el 20% del scroll dentro de la sección.
- [ ] El logo finaliza su viaje hacia el centro del header en el 60% del scroll, donde queda fijo y visible de forma "permanente" para el resto de la landing.
- [ ] La animación es suave (spring / easeInOut), sin saltos o teleports. 
- [ ] La aparición del logo en el header no rompe el layout existente (logo izquierda + menú derecha se mantienen).
- [ ] El logo en el header es estático (no tiene animación de pulso/orb) — es simplemente la imagen `/logo-removebg-preview.png` a escala reducida.
- [ ] El logo del `SectionSeparator` en DOM desaparece conforme el logo "sube" al header para no duplicarse.
- [ ] El estado de "logo integrado" persiste para el resto de secciones: `AuthorityGuide`, `BenefitsList`, `FaqAccordion`, `LandingCta`.

### Comportamiento Esperado (Happy Path)

1. El usuario llega al inicio de `ProcessSection` — el logo está en el `SectionSeparator` como siempre, visible en la página.
2. El usuario scrollea hacia arriba (la página sube).
3. En el **momento exacto en que el logo del `SectionSeparator` llega al borde inferior del header** (la parte de arriba del logo toca el header), se dispara la transición:
   - El logo origen hace **fade-out** (`opacity: 0`, `0.3s easeOut`).
   - El logo destino hace **fade-in** en el centro del header (`opacity: 0 → 1`, `0.4s easeOut`).
4. El logo queda fijo en el header de forma permanente para el resto de la landing.
5. **Irreversible**: Una vez integrado al header, el logo NO vuelve al `SectionSeparator` aunque el usuario suba el scroll.

---

## Contexto

### Referencias
- `src/features/landing-page/components/SectionSeparator.tsx` — Fuente visual del logo (DOM origin).
- `src/features/landing-page/components/ProcessSection.tsx` — Sección donde se dispara la animación.
- `src/features/landing-page/components/Header.tsx` — Destino final del logo.
- `src/features/chat/store/chatStore.ts` — **Patrón de referencia**: `hasMorphedToHeader` para cambiar estado global.
- `src/features/landing-page/components/PasSection.tsx` — Patrón de referencia completo para `useScroll` + `useMotionValueEvent`.

### Arquitectura Propuesta

#### Enfoque: Shared Global State + IntersectionObserver (Threshold Precisón de Header)

En lugar de un porcentaje de scroll, el trigger se basa en la **posición física** del logo en el DOM respecto al header:

```
IntersectionObserver {
  root: null (viewport)
  rootMargin: "-${headerHeight}px 0px 0px 0px"
  threshold: 0
}

→ Cuando el logo DEL SectionSeparator sale del viewport superior (cruza el header),
  se dispara setLogoInHeader(true)
```

Esto significa: **la transición ocurre en el instante exacto en que el top del logo toca el bottom del header**.

#### Por qué IntersectionObserver y no useScroll

| Método | Descripción |
|--------|-------------|
| `useScroll` % | Trigger a porcentaje arbitrario del contenedor padre — no relacionado con posición real en viewport |
| `IntersectionObserver` | Trigger cuando el elemento DOM cruza una línea específica — **exactamente lo que el usuario pide** |

#### Cálculo del `rootMargin` dinámico

El header tiene dos alturas:
- `h-16` (64px) cuando scrolled
- `h-24` (96px) cuando no scrolled

Como el `SectionSeparator` está en el inicio de `ProcessSection`, el usuario ya hablá scrolleado lo suficiente para que el header esté en estado **scrolled** (`h-16`). Podemos usar `rootMargin: "-64px 0px 0px 0px"` como valor estático, o calcular el `offsetHeight` del header desde el DOM.

#### Nuevo estado en `chatStore.ts`

```typescript
hasLogoInHeader: boolean      // inicia en false
setLogoInHeader: (v: boolean) => void
```

#### Archivos a modificar

```
src/features/chat/store/chatStore.ts           [MODIFY] — add hasLogoInHeader state
src/features/landing-page/components/
├── SectionSeparator.tsx                        [MODIFY] — IntersectionObserver trigger + fade-out
└── Header.tsx                                  [MODIFY] — render center logo when hasLogoInHeader
```

> **Nota**: `ProcessSection.tsx` ya NO necesita ser convertido a Client Component — el observer se implementa en `SectionSeparator`, que ya es client-side.

---

## Blueprint (Assembly Line)

### Fase 1: Extender el Store Global
**Objetivo**: Añadir `hasLogoInHeader: boolean` y `setLogoInHeader` al `chatStore.ts`.
**Validación**: TypeScript no reporta errores. El nuevo estado puede leerse desde cualquier componente.

### Fase 2: Observer + Trigger en SectionSeparator
**Objetivo**: El `SectionSeparator` agrega un `useEffect` con `IntersectionObserver` que observa el logo con `rootMargin: "-64px 0px 0px 0px"`. Cuando el elemento sale del área de intersección (cruza el header), llama `setLogoInHeader(true)`. El estado es **irreversible**: una vez `true`, no vuelve a `false` aunque el scroll regrese.
**Validación**: Al scrollear hasta que el logo toca el header, el store se actualiza.

### Fase 3: Fade-out del Logo origen
**Objetivo**: El logo del `SectionSeparator` consume `hasLogoInHeader`. Cuando es `true`, aplica `opacity: 0` con una transición suave de Framer Motion (`duration: 0.3s easeOut`).
**Validación**: El logo desaparece exactamente cuando toca el header.

### Fase 4: Logo estático en el centro del Header
**Objetivo**: El `Header` consume `hasLogoInHeader`. Cuando es `true`, renderiza un elemento centrado:
- Posicionamiento: `absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2`.
- Entrar con `motion.div`: `initial={{ opacity: 0, scale: 0.7 }}` → `animate={{ opacity: 1, scale: 1 }}` con `type: "spring", stiffness: 300, damping: 20`.
- Imagen: `/logo-removebg-preview.png`, tamaño `size-8` (scrolled) / `size-10` (no scrolled).
**Validación**: El logo aparece en el header centrado con animación de spring. No rompe el layout.

### Fase 5: Validación Final
**Objetivo**: Sistema end-to-end funcionando con persistencia en secciones posteriores.
**Validación**:
- [ ] `npm run typecheck` pasa sin errores.
- [ ] `npm run build` exitoso.
- [ ] Al scrollear hasta la intersección logo/header, la transición ocurre en el momento exacto.
- [ ] El logo permanece en el header en `AuthorityGuide`, `BenefitsList`, `FaqAccordion`, `LandingCta`.
- [ ] El logo del `SectionSeparator` no reaparece si el usuario sube el scroll.

---

## Gotchas

- [ ] **`position: absolute` en Header**: El header usa `flex items-center justify-between`. Para centrar el logo sin afectar los flex-children (logo izquierda + menú derecha), el centro debe implementarse con `position: absolute left-1/2 -translate-x-1/2` relativo al header — NO como un flex child del `justify-between`.
- [ ] **`rootMargin` dinámico**: El header tiene `h-16` (64px) en estado scrolled y `h-24` (96px) en estado sans-scroll. Como el `SectionSeparator` está al inicio de `ProcessSection` y la sección anterior (`PasSection`) tiene 900vh, el header **siempre estará** en estado scrolled cuando el usuario llegue al separator. Podemos usar `-64px` estático con seguridad.
- [ ] **Irreversibilidad del estado**: El observer debe llamar `setLogoInHeader(true)` solo si `hasLogoInHeader === false` para evitar re-renders innecesarios. NO debe llamar `setLogoInHeader(false)` en ninguna condición.
- [ ] **Persistencia del state con `zustand/persist`**: Asegurarse de NO persistir `hasLogoInHeader` en `partialize` para que el logo siempre empiece en el `SectionSeparator` en cada nueva visita.
- [ ] **Z-index stacking**: El logo del header debe quedar detrás del botón de Menú y el logo izquierdo si hubiera superposición. Usar `z-10` relativo dentro del header.
- [ ] **`SectionSeparator` es client-side**: Confirmar que mantiene `'use client'` — ya lo tiene, no requiere cambio.
- [ ] **`ProcessSection` NO necesita cambiar**: El observer vive en `SectionSeparator`, que ya es client-side.

## Anti-Patrones

- ❌ NO usar `document.getElementById` para calcular posiciones — usar `useRef` y los transforms de framer-motion.
- ❌ NO animar el logo con `position: fixed` desde el DOM origen — eso es frágil y rompe en diferentes viewports. Usar el patrón de `Shared State` con dos logos distintos (uno que se desvanece, otro que aparece).
- ❌ NO hardcodear valores de `top` o `left` en píxeles para el logo del header.

---

## 🧠 Aprendizajes (Self-Annealing)

*Se actualizará durante la implementación.*

---

*PRP pendiente aprobación. No se ha modificado código.*
