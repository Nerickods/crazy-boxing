# PRP-022: Eliminación de Parpadeo Desktop + Lag Mobile en PasSection, LandingCta y ServicesCta

> **Estado**: PENDIENTE  
> **Fecha**: 2026-04-03  
> **Proyecto**: KIA Intelligence Landing Page

---

## Objetivo

Eliminar el **parpadeo recurrente cada ~1 segundo en desktop** (que afecta toda la UI/UX durante el scroll) y el **lag visible con tirones en mobile** en tres secciones clave: `PasSection` (landing), `LandingCta` (landing), y `ServicesCta` (/services). El objetivo es 60 FPS constantes en ambos dispositivos sin ningún flash visual.

---

## Por Qué

| Dispositivo | Síntoma | Root Cause Identificada |
|-------------|---------|------------------------|
| **Desktop** | UI completa parpadea ~1 s durante scroll | `animate-gradient-flow` usa `background-position` animado sobre 6 elementos con `WebkitBackgroundClip: text` simultáneamente — provoca paint records frecuentes ya que el texto clip requiere rasterización, no compositing |
| **Desktop** | UI parpadea / "refresca" en transición al header compacto | Header cambia de `h-24` → `h-16` con `transition-all duration-500` que incluye `height` — animar `height` es la operación más costosa del layout engine, fuerza relayout completo de todos los descendientes |
| **Desktop** | Flash sutil al entrar/salir de secciones | `LogoIsotype` tiene `animate-pulse` en un div con `blur-2xl` + `filter: drop-shadow` en imagen anidada — doble compositing layer creada innecesariamente en el header |
| **Mobile** | PasSection lentísima durante scroll | `useSpring` con `stiffness 200 / damping 40` en un contenedor de 900vh genera 4 `useTransform` + 2 `useMotionValueEvent` simultáneos en el hilo principal de JS; en mobile los schedulers de JS y compositor están en el MISMO hilo (sin multithreading), bloqueando el render pipeline |
| **Mobile** | PasSection parpadea | El `motion.div` background en PasSection (`absolute inset-0`) tiene `scale: bgScale` (de 1 a 1.2 sobre 900vh). `scale` animado en un div de `150vw x 150vh` obliga al compositor a re-rasterizar el layer por frame en mobile |
| **Mobile** | LandingCta / ServicesCta laggean | Ambas tienen `useSpring` con `restDelta: 0.0005` — valor **extremadamente pequeño** que mantiene el spring activo por decenas de frames adicionales en mobile (donde el clock es más lento). El spring no se "calma" nunca limpiamente |
| **Mobile** | LandingCta / ServicesCta: textos tiemblan | `useTransform` con `color` como propiedad animada (`text2Color`): animar `color` en CSS no es compositor-safe — fuerza paint por frame. En mobile con GPU Mali o Adreno de gama media la penalidad es ~2-3 ms/frame |
| **Mobile** | Footer dentro de CTA glitchea | El footer dentro de las CTAs usa `backdrop-blur-2xl` en mobile (explícitamente) — en iOS `backdrop-filter` es el GPU op más caro que existe y combinado con scroll causa exactamente el "parpadeo cada segundo" reportado. En Android con `bg-[#002814]/90` el fix ya está aplicado pero hay inconsistencia |

---

## Análisis Profundo de Cada Bug

### BUG-A: `animate-gradient-flow` + `WebkitBackgroundClip: text` = Paint Storms (DESKTOP PRINCIPAL)

**Ubicación**: `Header.tsx:145`, `PasSection.tsx:156`, `LandingCta.tsx:159`, `ServicesCta.tsx:156`, `HeroSection.tsx:21`, `Footer.tsx:16`

**Código problemático**:
```css
/* globals.css */
.animate-gradient-flow {
  animation: gradient-flow 8s linear infinite;
}
@keyframes gradient-flow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

Con `WebkitBackgroundClip: text` + `WebkitTextFillColor: transparent`, el browser trata cada elemento como una **isolated compositing layer** que debe rasterizarse en cada frame de la animación. Con 6 instancias activas simultáneas, se producen 6 × 60 = 360 paint operations por segundo en el hilo principal. Esto es el source del "parpadeo cada segundo" — en realidad son paint storms que saturan el compositor.

**Diagnóstico exacto**: El `background-position` no es compositor-only para elementos con clip-path o -webkit-background-clip:text. El browser no puede trasladar esto al GPU compositor thread porque el texto requiere rasterización en CPU antes de aplicar el clip. El resultado es un pattern de "acumulación de dirty regions" que se vacía en batch cada ~16-32 frames, produciendo el parpadeo visible.

**Fix correcto**: Usar `@property` CSS con `background-position` que fuerza GPU, O directamente reemplazar la animación por un gradiente estático con `filter: hue-rotate` que SÍ es compositor-only, O convertir la animación a una SVG gradient con `animateTransform`. La solución más pragmática: reemplazar `background-position` animation por una **pseudo-element técnica** con `opacity` transition entre dos gradientes estáticos (compositor-safe).

---

### BUG-B: Header `transition-all` con `height` animado = Full Relayout (DESKTOP)

**Ubicación**: `Header.tsx:69`

**Código problemático**:
```tsx
className={`fixed top-0 w-full z-50 transition-all duration-500 transform-gpu ${
  (isScrolled && !isInServices) 
    ? "bg-background-dark/40 backdrop-blur-md border-b border-white/5 h-16" 
    : "bg-transparent border-transparent h-24"
}`}
```

**Diagnóstico**: `transition-all` incluye TODAS las propiedades CSS. Cuando cambia de `h-24` a `h-16`, el browser anima `height` durante 500ms. Animar `height` es equivalente a re-layoutear el documento completo en cada frame de la transición — todos los elementos en el flow normal recalculan su posición. El content principal está bajo el header fixed así que el impact es mínimo en layout, PERO la animación de height fuerza un nuevo paint call del header en cada frame. Combined con el backdrop-blur que también repaints, genera micro-stutters.

**Fix**: Usar `max-height` con valores fijos + `transform: scaleY()` en lugar de height, o simplemente animar solo `padding` (que no hace relayout) y `opacity` del border (compositor-safe). La forma más limpia: eliminar la transición de height y usar solo `padding-top/bottom` para simular el cambio de tamaño.

---

### BUG-C: `LogoIsotype` con `animate-pulse` + `blur` + `drop-shadow` en el Header = Layer Explosion (DESKTOP)

**Ubicación**: `LogoIsotype.tsx:54`, renderizado en `Header.tsx:200`, `PasSection.tsx:141`, `SectionSeparator.tsx:60`

**Código problemático**:
```tsx
{/* Main Atmospheric Glow */}
<div className="absolute inset-[-20%] bg-accent-cyan/20 blur-2xl rounded-full pointer-events-none -z-10 animate-pulse" />

{/* secondary green/emerald glow */}
<div className="absolute inset-[-40%] bg-emerald-500/10 blur-3xl rounded-full pointer-events-none -z-20 scale-150" />
```

Y en el `Image`:
```tsx
style={{ filter: 'brightness(1.5) saturate(1.5) contrast(1.2) drop-shadow(0 0 15px rgba(0,242,255,0.6))', willChange: "transform, filter" }}
```

**Diagnóstico**:
- `animate-pulse` usa `@keyframes` que muta `opacity` — correcto, ese es compositor-safe.
- PERO: el div con `blur-2xl` está dentro del mismo stacking context que el `img` con `filter: drop-shadow`. Cuando coexisten un `backdrop-filter`/`filter` y un elemento con `blur`, el browser crea **múltiples compositing layers anidadas** que se re-combinan en cada frame.
- `willChange: "transform, filter"` en la imagen es particularmente dañino: declarar `filter` en `willChange` le dice al browser que anticipe cambios de filter CADA FRAME, manteniendo el layer rasterizado en GPU memory aunque el filter no change nunca durante scroll normal.
- En el `Header`, el `LogoIsotype` se renderiza con `glow=true` permanentemente visible en `hasLogoInHeader` — esto significa estos layers están activos TODO el tiempo durante el scroll de la segunda mitad de la página.

**Fix**: 
1. Eliminar `willChange: "filter"` del Image — solo `transform` si acaso
2. Mover los blur glows a `::before`/`::after` pseudo-elements o reemplazarlos con `box-shadow` (mucho más barato que `blur-2xl`)
3. Cuando el logo está en el header (scroll activo), renderizar la versión SIN glow (`glow=false`)

---

### BUG-D: `useSpring` restDelta demasiado pequeño + múltiples `useTransform` = Mobile Main Thread Overload

**Ubicación**: `PasSection.tsx:30-34`, `LandingCta.tsx:15-19`, `ServicesCta.tsx:16-20`

**Código problemático** (PasSection):
```tsx
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 200,
  damping: 40,
  restDelta: 0.0005   // <-- DEMASIADO PEQUEÑO
});
```

**LandingCta** tiene exactamente los mismos valores. **ServicesCta** tiene `stiffness: 70, damping: 25` que es mejor pero igualmente con `restDelta: 0.002`.

**Diagnóstico**:
- `restDelta: 0.0005` significa que el spring continúa actualizando hasta que la diferencia entre su valor actual y el target sea menor de 0.0005. En mobile, con framerate variable (30-60 FPS), el spring puede tomar 80-100 frames (1.5-3 segundos) en "calmarse".
- Durante ese tiempo, cada update del spring propaga cambios a TODOS los `useTransform` derivados de `smoothProgress`.
- PasSection tiene: `bgOpacity`, `bgScale`, `sectionOpacity` + `ScrollTitleFlow × 4` (cada uno con 3 transforms: opacity, y, scale) + `LogoBrandFlow` (opacity, y, scale, glowOpacity) + CTA final (opacity, scale, y) = **15+ MotionValues activas** que React/Framer Motion recalcula en cada tick del spring.
- En mobile (JavaScript single-threaded), este recálculo compite con el hilo de compositing.

**Fix**: 
- Aumentar `restDelta` a `0.01` (20× más permisivo) — imperceptible visualmente pero 20× menos actualizaciones de spring al frenar
- Reducir `stiffness` en mobile (detectar vía `useEffect` / CSS media query + ref) o usar directamente `scrollYProgress` sin spring en mobile (el scroll nativo ya tiene inercia propia en iOS/Android)
- Alternativamente: usar `useReducedMotion` hook de Framer Motion para desactivar springs en dispositivos con prefer-reduced-motion (que en mobile es frecuente)

---

### BUG-E: `scale` animado en contenedor grande = Rasterización costosa en Mobile (PASECTION)

**Ubicación**: `PasSection.tsx:41, 58-65`

**Código problemático**:
```tsx
const bgScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);

<motion.div
  className="absolute inset-0 pointer-events-none overflow-hidden"
  style={{ opacity: bgOpacity, scale: bgScale }}  // <-- bgScale en contenedor 900vh
>
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] ..." />
```

**Diagnóstico**: El motion.div tiene `absolute inset-0` en un contenedor de 900vh — es decir, su tamaño renderizado es ~9 alturas de pantalla. Aplicar `scale` a un elemento de ese tamaño obliga al GPU a:
1. Rasterizar el elemento completo en su tamaño original (muy costoso)
2. Escalar la textura resultante (relativamente barato)

Pero en mobile con GPU integrado (no discrete), el paso 1 puede demorar varios ms. Al animarse continuamente durante 900vh de scroll, esto causa el lag consistente reportado.

**Fix**: 
- Cambiar `scale` por `transform: translateZ(0)` estático (sin animación) 
- Mover el efecto de "crecimiento del glow" al div interno (`w-[150vw] h-[150vh]`) usando `scale` solo sobre ESE div, que es más pequeño en la viewport aunque grande en px
- Mejor aún: eliminar `bgScale` completamente — el `bgOpacity` ya provee suficiente efecto atmospheric

---

### BUG-F: `color` animado con `useTransform` = Non-Compositor Paint (MOBILE CTAs)

**Ubicación**: `LandingCta.tsx:34-38`, `ServicesCta.tsx:36-40`

**Código problemático**:
```tsx
const text2Color = useTransform(
  smoothProgress, 
  [0.45, 0.6, 0.8, 1], 
  ["rgba(255,255,255,1)", "rgba(255,255,255,1)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.4)"]
);

<motion.div style={{ opacity: text2Opacity, y: text2Y, scale: text2Scale, color: text2Color }}>
```

**Diagnóstico**: `color` es una propiedad CSS que cambia el color del texto. NO es compositor-safe — requiere un paint call para rasterizar el texto con el nuevo color. En mobile con scroll rápido, esto puede dispararse 30-60 veces/segundo.

**Fix**: Reemplazar el efecto de fade del color con `opacity` — ya que text2Opacity ya controla la transparencia del container, y si se necesita una apariencia "desvanecida" puede lograrse con un `opacity` adicional sobre el texto usando `filter: opacity()` (que SÍ es compositor-safe) o simplemente cambiar al usar `opacity` en lugar de `color`.

Alternativa elegante: usar un pseudo-efecto similar con `mix-blend-mode: multiply` + overlay estático que logra el mismo resultado visual sin paint por frame.

---

### BUG-G: Footer con `backdrop-blur-2xl` en Mobile CTAs = GPU Stall (MOBILE)

**Ubicación**: `LandingCta.tsx:148`, `ServicesCta.tsx:145`

**Código problemático** (LandingCta):
```tsx
<div className="max-w-7xl mx-auto flex ... bg-[#002814]/90 md:bg-[#002814]/40 md:backdrop-blur-2xl ...">
```

**`ServicesCta.tsx:145`**:
```tsx
<div className="max-w-7xl mx-auto flex ... bg-[#002814]/40 backdrop-blur-lg ...">
```

**Diagnóstico**:
- En `LandingCta`, el mobile recibe `bg-[#002814]/90` (sólido) — correcto, no usa backdrop-blur.
- Pero en `ServicesCta`, el footer tiene `backdrop-blur-lg` **sin excepción mobile** — afecta iOS y Android mid-range por igual.
- En iOS Safari, `backdrop-filter: blur()` en un elemento que está dentro de un `sticky` container con scroll activo causa stalls GPU frecuentes. El pattern exacto es: el backdrop-blur necesita "ver" lo que hay detrás en tiempo real, lo que fuerza un composite operation con el layer de la sticky section en cada frame de scroll.
- Este es probablemente el mayor contributor al "parpadeo cada segundo en mobile" junto con BUG-A.

**Fix**: En mobile (`max-md`), reemplazar `backdrop-blur-*` con un background sólido con alta opacidad. En desktop, mantener el blur estático.

---

### BUG-H: `useMotionValueEvent` disparando `setMorphedToHeader` = Zustand Re-render Global (PASECTION)

**Ubicación**: `PasSection.tsx:23-27`

**Código problemático**:
```tsx
useMotionValueEvent(scrollYProgress, "change", (latest) => {
  if (latest >= 0.65 && !hasMorphedToHeader) {
    setMorphedToHeader(true);
  }
});
```

**Diagnóstico**: Cuando `scrollYProgress.latest >= 0.65`, `setMorphedToHeader(true)` actualiza el Zustand store. Zustand re-renderiza **todos los suscriptores** de `chatStore`. Los suscriptores son: `Header.tsx`, `ChatWidget.tsx`, `PulsingExperience.tsx`, `SectionSeparator.tsx` — todos se re-renderizan simultáneamente. Este re-render coincide con el momento exacto del scroll en el PasSection y produce un "flash" visible mientras React re-renderiza 4 componentes a la vez.

**Fix**: El guard `!hasMorphedToHeader` ya evita que se llame más de una vez, pero el problema es que se llama EXACTAMENTE cuando el spring está más agresivo (progreso > 0.65 es mid-animation). Fix: usar `useEffect` con un threshold + ref debounced, o procesar el event en el compositor thread usando `scrollYProgress.on("change")` directamente sin ir por React state.

---

## Qué

### Criterios de Éxito

- [ ] **Desktop**: Ningún "flash" o parpadeo visible durante 10 segundos de scroll continuo (validado visualmente)
- [ ] **Desktop**: La transición del header (expanded → compact) se ejecuta sin micro-stutters perceptibles
- [ ] **Mobile**: PasSection scrolleable a velocidad normal sin lag visible en dispositivo real o emulador de 60fps
- [ ] **Mobile**: LandingCta y ServicesCta sin tirones durante la animación de fases (texto1 → texto2 → CTA)
- [ ] **Mobile**: Ningún "parpadeo periódico" de la UI en Safari iOS o Chrome Android durante scroll
- [ ] **Ambos**: `npm run build` exit code 0 + `npx tsc --noEmit` 0 errores

### Comportamiento Esperado tras la Implementación

**Desktop**: El usuario hace scroll continuo por toda la landing. No ve ningún destello, flash, ni "refresco" de la UI. La transición del header de alto a compacto sucede de forma totalmente suave. Los textos con gradiente ("KIA") muestran su animación de color fluida pero sin causar repaints visibles.

**Mobile (iOS/Android)**: El usuario scrollea el PasSection completo (900vh de contenido), ve cada título de problema aparecer y desaparecer con fluidez. Al llegar a LandingCta y ServicesCta, las fases de texto (Garantía → Urgencia → CTA) se ejecutan sin tirones. El footer glassmórfico no causa stalls.

---

## Contexto

### Árbol de Dependencias del Problema

```
globals.css
└── .animate-gradient-flow                          # BUG-A (6 instancias simultáneas)
    ├── Header.tsx KIA text (line 145)
    ├── PasSection.tsx CTA KIA text (line 156)
    ├── LandingCta.tsx footer KIA (line 159)
    ├── ServicesCta.tsx footer KIA (line 156)
    ├── HeroSection.tsx titulo (line 21)
    └── Footer.tsx (line 16)

Header.tsx
├── transition-all height animation                  # BUG-B
├── LogoIsotype glow=true en hasLogoInHeader         # BUG-C
└── scroll handler → setIsScrolled (React state)

LogoIsotype.tsx
├── animate-pulse + blur-2xl                         # BUG-C
├── blur-3xl secondary glow                          # BUG-C  
└── willChange: "transform, filter" en Image         # BUG-C (filter in willChange)

PasSection.tsx (900vh)
├── useSpring restDelta: 0.0005                       # BUG-D
├── bgScale en motion.div inset-0 900vh              # BUG-E
├── 15+ MotionValues activas                          # BUG-D
└── useMotionValueEvent → Zustand global re-render   # BUG-H

LandingCta.tsx + ServicesCta.tsx
├── useSpring restDelta: 0.0005                       # BUG-D
├── text2Color useTransform (color CSS)              # BUG-F
└── Footer backdrop-blur en mobile                   # BUG-G (ServicesCta sin excepción mobile)
```

### Referencias de Código

- `src/features/landing-page/components/PasSection.tsx` — Scroll section 900vh
- `src/features/landing-page/components/LandingCta.tsx` — CTA section landing
- `src/features/services/components/ServicesCta.tsx` — CTA section /services
- `src/features/landing-page/components/Header.tsx` — Header con animación de altura
- `src/features/landing-page/components/LogoIsotype.tsx` — Logo con glows costosos
- `src/app/globals.css` — Definición de `animate-gradient-flow`

### Decisiones de Arquitectura

#### Solución para `animate-gradient-flow` (BUG-A)
En lugar de `background-position` animation (no compositor-safe con `-webkit-background-clip: text`), usaremos **CSS Hue-Rotate Animation** que SÍ es compositor-safe:
```css
@keyframes gradient-rotate {
  0%   { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(30deg); }
}
```
O alternativamente, un **shimmer via pseudo-element** con `transform: translateX` (100% compositor-safe). La elección final depende del look deseado — se testearán ambas.

#### Solución para Header height (BUG-B)
Eliminar `h-16`/`h-24` del className dinámico. En su lugar:
- Usar `transition-all` → `transition-[padding,background-color,backdrop-filter,border-color]` (explicit list sin height)
- Simular el cambio de tamaño via `py-4` (compacto) vs `py-6` (expanded) 
- Esto mantiene el visual sin animar height

#### Solución para useSpring en Mobile (BUG-D)
Implementar un hook `useOptimizedSpring` que detecta mobile y aplica parámetros diferentes:
- Mobile: `{ stiffness: 150, damping: 35, restDelta: 0.01 }` — 20× más permisivo en restDelta
- O directamente: eliminar el spring en mobile y usar `scrollYProgress` directo (el overscroll bounce nativo de iOS ya provee smooth)

#### Solución para `color` animation (BUG-F)
Reemplazar `color: text2Color` con `opacity` adicional en el container. El efecto visual de "texto que se desvanece en gris" se puede lograr con:
```tsx
// En lugar de color motion value (no compositor-safe):
<motion.div style={{ opacity: combinedOpacity }}>
  <h3 className="text-white/40"> /* Color estático */
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo FASES. Las subtareas se generan al entrar a cada fase con el bucle agéntico.

### Fase 1: `animate-gradient-flow` → CSS Compositora Safe (BUG-A)
**Objetivo**: Reemplazar la animación `background-position` en `globals.css` con una técnica compositor-safe que no genere paint storms. Actualizar todos los 6 componentes que usan la clase para mantener el mismo efecto visual de gradiente en movimiento.  
**Validación**: Con DevTools Layers panel, el texto "KIA" no debe aparecer en la lista de "Layers" activas durante scroll (indica que dejó de crear compositing layers por paint).

### Fase 2: Header Height Animation Fix (BUG-B)
**Objetivo**: Eliminar la animación de `height` del header y reemplazarla por transición de `padding`/`scale` que no genere relayout. El Header debe mantener exactamente el mismo aspecto visual expandido/compacto pero la transición debe ser una operación de compositing pura.  
**Validación**: En Chrome Performance panel, durante la transición expanded→compact del header, no deben aparecer registros de "Layout" o "Paint" — solo "Composite Layers".

### Fase 3: LogoIsotype Glow Optimization (BUG-C)
**Objetivo**: Eliminar `willChange: "filter"` de la imagen Logo. Reemplazar el `blur-2xl animate-pulse` container por `box-shadow` en el div padre (que sí es compositor-safe). Cuando el logo está en el header (`hasLogoInHeader = true`), renderizar sin glow para eliminar layers extra durante el scroll principal.  
**Validación**: En DevTools Layers, el `LogoIsotype` del header debe aparecer como UNA sola compositing layer, no anidadas.

### Fase 4: useSpring Optimization + bgScale Elimination (BUG-D + BUG-E)
**Objetivo**: En `PasSection`, `LandingCta` y `ServicesCta`, aumentar `restDelta` a `0.01`. Eliminar `bgScale` de PasSection (reemplazar por ninguna transformación o una estática). Implementar detección de mobile para reducir agresividad del spring en dispositivos con framerate limitado.  
**Validación**: En emulador Android de Chrome (CPU throttling 4×), el PasSection debe verse fluido sin tirones al scrollear.

### Fase 5: `color` Motion → `opacity` Motion (BUG-F) + Footer Mobile Glass Fix (BUG-G)
**Objetivo**: En `LandingCta` y `ServicesCta`, reemplazar `text2Color` (animación CSS color) por `opacity` sobre el elemento. En `ServicesCta` footer, agregar `max-md:backdrop-filter-none` o equivalente para eliminar blur en mobile. Verificar consistencia entre `LandingCta` y `ServicesCta` en el tratamiento mobile del footer.  
**Validación**: En iOS Simulator, ningún "stall" visible al scrollear hasta el footer de ServicesCta.

### Fase 6: Zustand Re-render Debounce (BUG-H)
**Objetivo**: Estabilizar el `setMorphedToHeader` en `PasSection` para que el Zustand update no ocurra en mid-animation. Implementar una verificación via `useRef` que debounce el set a 100ms después de que se detecta el threshold, evitando el flash de re-render simultáneo de 4 componentes.  
**Validación**: En React DevTools Profiler, al cruzar el 65% del PasSection, solo debe re-renderizarse UNA vez el Header (no en batch con otros 3 componentes simultáneamente).

### Fase 7: Validación Final + Git Push
**Objetivo**: Build completo, typecheck, y prueba de smoke visual.  
**Validación**:
- [ ] `npm run typecheck` — 0 errores
- [ ] `npm run build` — exit code 0
- [ ] Scroll continuo desktop 10s — 0 flashes visibles
- [ ] Scroll mobile emulado — 0 tirones en PasSection, LandingCta, ServicesCta
- [ ] `git push origin feature/ai-chatbot-admin`

---

## 🧠 Aprendizajes (Self-Annealing)

> A poblar durante la implementación.

---

## Gotchas

- [ ] `animate-gradient-flow` se usa en 6 lugares — el fix debe ser global desde CSS pero sin romper los lugares donde `backgroundImage` y `WebkitBackgroundClip: text` son necesarios en el style prop
- [ ] El `Header` usa `transition-all` que incluye height — al cambiar solo las transiciones específicas, verificar que `backdrop-blur` y `border-color` también transicionan correctamente
- [ ] `LogoIsotype` tiene `priority` en el Image — no remover eso (afecta LCP)
- [ ] El `PulsingOrb` también usa `PulsingBorder` de `@paper-design/shaders-react` — verificar que no genera RAF loop adicional en el header cuando `hasMorphedToHeader`
- [ ] En `SectionSeparator`, el `LogoIsotype` lleva `glow={true}` — solo se ve durante la primera parte del scroll; por eso la optimización de "glow=false en header" solo aplica al `hasLogoInHeader` context
- [ ] El `restDelta` más permisivo puede hacer que las animaciones "se corten" antes de llegar exactamente a su valor final — verificar que los valores de `useTransform` en los keyframes siguen siendo alcanzados correctamente

## Anti-Patrones

- NO usar `transition-all` en elementos que cambian height, width, o layout properties
- NO declarar `filter` en `willChange` — solo `transform` y `opacity`
- NO animar propiedades CSS de color/background-color directamente con Framer Motion `useTransform` en mobile
- NO usar `backdrop-blur` en elementos que están dentro de contenedores `sticky` en mobile
- NO permitir `restDelta < 0.005` en springs usados en dispositivos mobile

---

*PRP pendiente aprobación. No se ha modificado código.*
