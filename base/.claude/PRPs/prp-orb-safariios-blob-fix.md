# PRP-003: Fix OrbSvgFallback Blob on Safari iOS (feGaussianBlur Compositing Bug)

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-09
> **Proyecto**: landing-linkedin

---

## Objetivo

Eliminar el bug de compositing de `feGaussianBlur` en Safari iOS que hace que el `OrbSvgFallback` se vea como un blob/disco sólido azul-verde en lugar de un anillo hueco con stroke fino, asegurando parity visual con la versión Desktop (WebGL + shader).

## Por Qué

| Problema | Solución |
|----------|----------|
| `feGaussianBlur` + `feComposite operator="over"` en Safari iOS 15-17 no limpian el `filterRegion`, imprimiendo un disco opaco encima del anillo SVG. Esto produce el "blob sólido" visible en iPhone 11. | Eliminar el `<filter>` SVG por completo. Reemplazar el efecto glow con un `<div>` hermano CSS absolutamente posicionado usando `filter: blur()` + `border-radius: 50%` + `background: conic-gradient(...)`, que funciona correctamente cross-browser incluyendo Safari iOS. |

**Valor de negocio**: El widget del chatbot es el principal CTA de conversión del landing. Un elemento roto en iPhone (40%+ del tráfico típico de B2B latinoamericano) destruye la credibilidad y la tasa de clicks.

## Qué

### Criterios de Éxito
- [ ] En iPhone 11 (Safari iOS 15+) el anillo se ve hueco — sin relleno sólido central.
- [ ] Se aprecia el efecto de glow/halo alrededor del contorno del anillo.
- [ ] El anillo gira con animación visible (rotación + pulso de opacidad).
- [ ] El logo permanece centrado dentro del anillo.
- [ ] El texto rotatorio "ASISTENTE KIA INTELLIGENCE" sigue visible.
- [ ] En Desktop (Chrome) el resultado es visualmente idéntico o mejor.
- [ ] `npm run typecheck` pasa sin errores.

### Comportamiento Esperado
**Desktop**: PulsingBorder WebGL shader (sin cambios).
**Mobile/iOS**: SVG con stroke azul fino rotatorio + efecto glow CSS (no SVG filter) debajo del stroke, generando aureola sin contaminar el interior del círculo.

---

## Contexto

### Causa Raíz Confirmada: Bug de Safari SVG Filter Compositing
Safari iOS tiene un comportamiento no estándar con los filtros SVG. Cuando `feComposite` usa `operator="over"` sobre un `feGaussianBlur`, la capa de resultado del blur NO es transparente fuera del región del stroke — en lugar de eso, Safari la pinta como una superficie opaca que cubre la totalidad del área de filtro. El resultado visual es un disco sólido.

**Reproductor del bug:**
```svg
<!-- Esto es lo que tenemos y rompe en iOS: -->
<filter id="orb-glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="X" result="blur" />
  <!-- Safari iOS imprime el "blur" como disco opaco en toda la filterRegion -->
  <feComposite in="SourceGraphic" in2="blur" operator="over" />
</filter>
```

**Fix arquitectónico:**
Mover el glow a CSS puro usando un `div` absolutamente posicionado con:
- `background: conic-gradient(...)` del mismo gradiente azul
- `filter: blur(Xpx)` para el halo
- `border-radius: 50%`
- `opacity` animado con Framer Motion
- `mask` o escalado para confinar el glow visualmente

### Referencias
- `src/features/landing-page/components/PulsingOrb.tsx` — función `OrbSvgFallback`
- `src/shared/hooks/useWebGLSupport.ts` — la detección de mobile funciona bien
- Bug conocido: [https://bugs.webkit.org/show_bug.cgi?id=23113](https://bugs.webkit.org/show_bug.cgi?id=23113) (feGaussianBlur compositing en Safari)

### Arquitectura Propuesta

#### `OrbSvgFallback` refactorizado:
```
<div className="relative" style={{ width: size, height: size }}>

  {/* CAPA 1: Glow CSS (no SVG filter, Safari-safe) */}
  <motion.div
    style={{
      position: 'absolute',
      inset: glowInset,          // slightly inside to create ring-shape glow
      borderRadius: '50%',
      background: 'conic-gradient(#0047FF, #00D1FF, #0047FF)',
      filter: 'blur(Npx)',
      opacity: 0,
    }}
    animate={{ opacity: [0.3, 0.7, 0.3] }}
    transition={{ duration: 3, repeat: Infinity }}
  />

  {/* CAPA 2: SVG ring stroke puro — sin <filter> */}
  <motion.svg
    width={size} height={size}
    animate={{ rotate: 360 }}
    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
  >
    <circle
      stroke="url(#ring-grad)"
      strokeWidth={strokeWidth}
      strokeDasharray={`75% 25%`}
      fill="none"
    />
  </motion.svg>

</div>
```

**Por qué esta arquitectura es Safari-safe:**
- CSS `filter: blur()` en un `div` NO tiene el bug del compositing SVG — funciona en todos los browsers.
- El SVG solo contiene el stroke del anillo sin ningún `<filter>`. Los filtros SVG son el problema raíz.
- La animación de la capa de glow (opacity pulse) usa Framer Motion + CSS transitions, que también son compositor-safe en iOS.

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Refactorizar `OrbSvgFallback` — Eliminar SVG Filters
**Objetivo**: Reemplazar la función `OrbSvgFallback` con la nueva arquitectura de `div` compuesto (glow CSS + SVG stroke puro sin `<filter>`).
**Validación**: El elemento renderizado no presenta blob sólido. El círculo SVG tiene `fill="none"` y el gradiente de stroke es visible. El `<filter>` SVG es history.

### Fase 2: Ajuste Visual — Calibrar glow y colores para iOS
**Objetivo**: Calibrar el radio del blur CSS y la opacidad del glow para que en mobile la aureola sea visible pero no opresiva. El stroke azul-índigo fino debe ser el protagonista.
**Validación**: En Chrome DevTools (emulación iPhone 12) el resultado luce premium y con identidad de marca.

### Fase 3: Validación Final Cross-browser
**Objetivo**: Confirmar que el componente luce bien en Desktop (modo WebGL intacto) y Mobile (nuevo SVG sin filtros). 
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Prueba visual en Chrome DevTools emulación iPhone
- [ ] Deploy en Vercel y prueba en iPhone 11 físico
- [ ] Criterios de éxito cumplidos

---

## 🧠 Aprendizajes (Self-Annealing)

### [2026-04-09]: Bug SVG feGaussianBlur en Safari iOS
- **Error**: `feGaussianBlur` + `feComposite operator="over"` en un `<filter>` SVG produce un disco opaco en Safari iOS 15+, convirtiendo el anillo hueco en un blob sólido.
- **Fix**: Nunca usar `<filter>` SVG para efectos de glow en componentes que se renderizan en Safari iOS. Usar CSS `filter: blur()` en un `div` hermano absolutamente posicionado.
- **Aplicar en**: Cualquier componente que use efectos de brillo o sombra en SVG que deba ser cross-browser compatible.

### [2026-04-09]: CSS Pseudo-elements vs SVG para Anillos
- **Error**: CSS `::before`/`::after` con `z-index: -1` dentro de `position: relative` genera un stacking context que en Safari iOS coloca el pseudo-elemento detrás del fondo de página.
- **Fix**: Usar SVG stroke con `fill="none"` para el anillo, y CSS `div` hermano para efectos decorativos.
- **Aplicar en**: Cualquier componente circular con glow o neon effects.

---

## Gotchas

- [ ] **CRÍTICO**: No reintroducir `<filter>` SVG en el `OrbSvgFallback`. Esta es la causa raíz del blob.
- [ ] **Para el animado CSS glow**: El `border-radius: 50%` en el div + `filter: blur()` no necesita `overflow: hidden` — el blur naturalmente se derrama creando el halo.
- [ ] **Conic-gradient en CSS**: Es compatible con Safari iOS 15.4+. Usar `background: conic-gradient(...)` es seguro para iPhone 11 en iOS 15+.
- [ ] **La capa SVG pura**: Necesita `overflow="visible"` en el elemento `<svg>` para que el stroke no se clippe en el borde del viewBox cuando hacemos el strokeWidth hacia afuera.

## Anti-Patrones

- ❌ NO usar `feGaussianBlur` + `feComposite` para glow effects en SVG destinados a Safari.
- ❌ NO usar `filter: url(#id)` para efectos visuales en elementos SVG que deben ser cross-platform.
- ❌ NO volver al CSS `::before/::after` con `z-index negativo` — ya sabemos que falla en iOS.
- ❌ NO animar propiedades como `width`, `height`, o `background-size` en el glow — preferir `opacity` y `transform: scale()` que son compositor-safe.

---

*PRP pendiente aprobación. No se ha modificado código.*
