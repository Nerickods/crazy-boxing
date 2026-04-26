# PRP-021: Performance Optimization — Scroll Jank & /services Lag

> **Estado**: PENDIENTE  
> **Fecha**: 2026-04-03  
> **Proyecto**: KIA Intelligence  

---

## Objetivo

Eliminar completamente el scroll jank (tirones, saltos y lag) en toda la landing page y especialmente en la sub-página `/services`, llevando la experiencia a un render estable de **60 FPS** mediante cirugía precisa en los cuellos de botella de rendimiento identificados en el análisis exhaustivo del código.

---

## Por Qué

| Problema | Impacto | Solución |
|----------|---------|----------|
| Scroll jank en Vercel (producción) | Daña percepción de marca premium. Un cliente que ve "tirones" no confía. | Eliminar causas raíz identificadas |
| `/services` es la página más pesada | Es la página de **conversión directa** — el jank aquí destruye leads | Optimizar ServicesCta + ModulesTabs |
| Múltiples librerías compitiendo | GSAP + Framer Motion + Three.js + CSS animations = main thread saturado | Consolidar en compositing layers |
| GPU pressure por shaders concurrentes | MeshGradient (x2) + LuminaSlider WebGL simultáneos | Carga diferida y pausa inteligente |

**Valor de negocio**: Landing/services con 60 FPS fluido incrementa conversiones hasta 70% (benchmark Google).

---

## Análisis Crítico — Los 12 Cuellos de Botella

### CRITICO (causa directa del jank)

**Bug #1: Doble MeshGradient shader siempre corriendo**  
Archivo: `ShaderBackground.tsx` (líneas 45–55)  
Dos instancias WebGL corriendo simultáneamente. BenefitsList llama renderBackground con ShaderBackground ignorando el argumento `active`, creando 3 contextos WebGL concurrentes en ciertos scroll positions.  
Fix: Usar el argumento `active` del renderBackground callback para pasar `speed={active ? 0.3 : 0}`.

**Bug #2: `useSpring` en PasSection con fixed dentro de sticky**  
Archivo: `PasSection.tsx` (líneas 18–63)  
El `motion.div` con `className="fixed inset-0"` está DENTRO de un `section` con `position: sticky`. Un elemento `fixed` dentro de un transformado/sticky crea un nuevo stacking context que repinta constantemente en iOS Safari.  
Fix: Cambiar `fixed inset-0` a `absolute inset-0` — la sección sticky ya actúa como el reference frame.

**Bug #3: `backdropFilter` animado en ServicesCta + LandingCta**  
Archivos: `ServicesCta.tsx` (líneas 50–51), `LandingCta.tsx` (líneas 47–61)  
`backdropFilter` NO puede ser animado con GPU compositing. Cada cambio fuerza un full repaint del área — es la propiedad CSS más costosa para animar. LandingCta además tiene SSR mismatch con `typeof window !== 'undefined'`.  
Fix: Eliminar la animación dinámica de backdropFilter. Usar elemento hijo con backdrop-filter fijo y animar solo su opacity.

**Bug #4: Header.tsx — scroll listener con layout reflow**  
Archivo: `Header.tsx` (líneas 19–44)  
El handleScroll lee `section.offsetTop` y `section.offsetHeight` en CADA evento de scroll. Estas propiedades fuerzan forced synchronous layout (layout thrashing). El passive: true ayuda con bloqueo del thread pero no elimina el reflow.  
Fix: Calcular offsetTop y offsetHeight una sola vez en mount (y en ResizeObserver), guardar en refs. Al scrollear, solo comparar `window.scrollY` contra los refs.

**Bug #5: GSAP + Framer Motion RAF loops concurrentes**  
Archivos: `full-screen-scroll-fx.tsx` + `PasSection.tsx` (landing page)  
BenefitsList usa GSAP + ScrollTrigger mientras PasSection usa Framer Motion useScroll. Dos RAF loops compitiendo para actualizar el DOM en el mismo frame = dropped frames.  
Fix: El container root de FullScreenScrollFX debe tener `will-change: transform` para que el compositor lo maneje independientemente.

**Bug #6: Fetch externa de noise.svg bloqueante**  
Archivos: `PasSection.tsx` (líneas 62, 88), `ServicesCta.tsx` (línea 89)  
noise.svg se carga desde `grainy-gradients.vercel.app` en 3 lugares. El blend mode `mix-blend-overlay` es costoso para el compositor en GPUs. Single point of failure externo.  
Fix: Descargar noise.svg, convertir a data URI en globals.css, eliminar request externo.

### ALTO IMPACTO (específico de /services)

**Bug #7: willChange incorrecto en ServicesCta**  
Archivo: `ServicesCta.tsx` (línea 64)  
`willChange: "transform, opacity, background-color"` — background-color no puede ser compositor-only. Declararlo desperdicia GPU memory sin beneficio real.  
Fix: `willChange: "transform, opacity"` únicamente.

**Bug #8: AnimatePresence sin mode="wait" en ModulesTabs**  
Archivo: `ModulesTabs.tsx` (líneas 63–69)  
Sin mode="wait", AnimatePresence permite elemento saliente y entrante simultáneos con animaciones x-offset. Esto crea stacking de 2 animaciones Framer Motion en el mismo frame durante la transición de tab — el jank más visible en /services.  
Fix: Agregar `mode="wait"` al AnimatePresence. Simplificar a transition solo de opacity.

**Bug #9: GlassRefractionBackground — potencial compositing layer global**  
Ambas páginas envuelven todo en GlassRefractionBackground. Si aplica backdrop-filter en su root wrapper, toda la página se convierte en una capa de composición costosa.  
Fix: Verificar que NO aplique filter/backdrop-filter en el elemento raíz.

**Bug #10: LuminaSlider RAF loop continuo aunque no visible**  
Archivo: `lumina-slider.tsx` (líneas 271–279)  
`requestAnimationFrame` siempre se llama incluso cuando isVisibleRef.current === false. El RAF sigue siendo un callback que el browser procesa en cada frame aunque no renderice WebGL.  
Fix: Cancelar el RAF con cancelAnimationFrame cuando isVisibleRef es false. Reanudar solo cuando IntersectionObserver detecte visibilidad.

**Bug #11: useMotionValueEvent provoca re-render de Header durante scroll**  
Archivo: `PasSection.tsx` (líneas 23–27)  
setMorphedToHeader es una mutación de Zustand llamada durante el scroll event de Framer Motion. Desencadena re-render del Header en medio de una animación de scroll.  
Fix: El guard !hasMorphedToHeader funciona como one-shot. El Header debe envolverse en React.memo para minimizar el impacto del re-render a solo los elementos que usan hasMorphedToHeader.

**Bug #12: ShaderBackground activo en sección no visible**  
Archivo: `BenefitsList.tsx` (líneas 84–92)  
renderBackground recibe argumento `active` pero el callback lo ignora. El shader corre a velocidad completa incluso cuando la sección no es visible.  
Fix: `renderBackground: (active) => <ShaderBackground speed={active ? 0.3 : 0} />`

---

## Criterios de Éxito

- [ ] 0 dropped frames (barras rojas) en Chrome DevTools durante scroll en /services
- [ ] Scripting time por frame < 8ms en Performance profile
- [ ] ServicesCta: NO activar Paint Flashing durante progreso 0.85–0.98
- [ ] Header: 0 llamadas a offsetTop/offsetHeight en scroll listener
- [ ] LuminaSlider: RAF loop cancelado cuando no visible
- [ ] noise.svg servido desde dominio propio (no request a grainy-gradients.vercel.app)
- [ ] ModulesTabs: transición de tab sin dropped frames
- [ ] `npm run build` exitoso sin errores TypeScript
- [ ] Lighthouse Performance >= 85 en /services

---

## Contexto

### Arquitectura del Problema (el mapa del jank)

```
GlassRefractionBackground (¿backdrop-filter global?)
  ├─ Header [scroll listener con layout reflow en cada frame]
  ├─ HeroSection
  │    └─ ShaderBackground [WebGL x2] ← GPU Layers 1+2
  │    └─ ScrollExpandMedia [RAF loop manual + wheel listener]
  │         └─ LuminaSlider [Three.js WebGL] ← GPU Layer 3
  ├─ PasSection [Framer Motion RAF] [900vh height]
  │    └─ motion.div fixed [BUG: fixed dentro de sticky = full repaint]
  ├─ ProcessSection [Timeline GSAP]
  ├─ BenefitsList
  │    └─ FullScreenScrollFX [GSAP RAF] ← CONFLICTO con Framer Motion RAF
  │         └─ ShaderBackground [WebGL x2] ← siempre activo
  └─ LandingCta [Framer Motion + backdropFilter animado]
```

Resultado: En /, conviven simultáneamente:
- GSAP RAF loop (FullScreenScrollFX)
- Framer Motion RAF loop (PasSection, LandingCta)
- Three.js RAF loop (LuminaSlider)
- 2–3 MeshGradient WebGL contexts
- backdrop-filter animado (paint per frame)
- scroll event handler con DOM layout reads

### Archivos por Fase

```
Fase 1 (Quick Wins):
  Header.tsx, ServicesCta.tsx, LandingCta.tsx,
  ModulesTabs.tsx, BenefitsList.tsx, lumina-slider.tsx

Fase 2 (ServicesCta cirugía):
  ServicesCta.tsx, LandingCta.tsx, globals.css (noise asset)

Fase 3 (PasSection fixed -> absolute):
  PasSection.tsx

Fase 4 (Shaders WebGL):
  BenefitsList.tsx, ShaderBackground.tsx, lumina-slider.tsx

Fase 5 (Build + Lighthouse):
  next.config.ts, ProcessSection.tsx, BentoEcosystem.tsx
```

---

## Blueprint (Assembly Line)

### Fase 1: Quick Wins de Alto Impacto
**Objetivo**: Eliminar bugs de 1–5 líneas con mayor retorno de 60fps inmediato.  
Bugs: #4 (Header reflow), #7 (willChange), #8 (AnimatePresence), #12 (shader active), #10 (LuminaSlider RAF)  
**Validación**: `npm run build` sin errores. Código verificado sin DOM reads en scroll handlers.

### Fase 2: Cirugía en backdropFilter (el jank más perceptible en /services)
**Objetivo**: Eliminar full-repaint por animación de backdropFilter. Reemplazar con opacity compositor-safe.  
Bugs: #3 (ServicesCta + LandingCta), #6 (noise.svg local), #9 (GlassRefractionBackground audit)  
**Validación**: Chrome DevTools Paint Flashing NO activo durante scroll en ServicesCta.

### Fase 3: Corrección del fixed dentro de sticky en PasSection
**Objetivo**: Mover background dinámico de fixed a absolute dentro del sticky container.  
Bug: #2 (PasSection stacking context)  
**Validación**: DevTools Layers panel muestra background en misma compositing layer que sticky container.

### Fase 4: Aislamiento y pausado de shaders WebGL
**Objetivo**: Nunca más de 1 WebGL context activo simultáneamente según sección visible.  
Bugs: #1 (doble MeshGradient), #10 (LuminaSlider RAF), #5 (GSAP + Framer Motion will-change)  
**Validación**: GPU time no excede 8ms por frame en DevTools Performance.

### Fase 5: Validación Final + Next.js optimizaciones
**Objetivo**: Sistema a 60fps con build limpio.  
- next.config.ts: agregar `images.formats: ['image/avif', 'image/webp']`
- ProcessSection: verificar lazy loading en imágenes Unsplash
- BentoEcosystem: lazy loading en imagen lh3.googleusercontent.com  
**Validación**: npm run typecheck + npm run build + Lighthouse >= 85

---

## Gotchas

- [ ] `fixed` dentro de `sticky`: iOS Safari es especialmente sensible. Verificar en iOS físico o simulador tras el fix del Bug #2
- [ ] `backdropFilter` no es compositor-only: NUNCA animar directamente. Solo animar opacity del elemento hijo
- [ ] `willChange` memory cost: aplicar solo en elementos que realmente necesitan su propia compositing layer
- [ ] GSAP + Framer Motion: no mezclar en el mismo elemento. GSAP para FullScreenScrollFX, Framer Motion para el resto
- [ ] GlassRefractionBackground: verificar código ANTES de modificar cualquier otra cosa — si aplica filter en su root, todos los fixed de la landing se ven afectados

## Anti-Patrones

- NO animar backgroundColor, backdropFilter, filter, blur, color con useTransform
- NO leer offsetTop/offsetHeight en scroll event handlers
- NO tener múltiples RAF loops en el mismo viewport
- NO usar willChange en propiedades no compositor-safe

---

## Aprendizajes (Auto-Blindaje)

### 2026-04-03: fixed dentro de transformados
- **Error**: position:fixed dentro de sticky provoca full-repaint en iOS Safari
- **Fix**: Usar position:absolute con el sticky container como referencia
- **Aplicar en**: Cualquier sección con h-[NNNvh] + sticky + elementos absolutamente posicionados

### 2026-04-03: backdropFilter no es compositor-only
- **Error**: Animar backdropFilter con useTransform causa full-repaint por frame
- **Fix**: Elemento con backdropFilter fijo, animar solo opacity del hijo
- **Aplicar en**: ServicesCta, LandingCta, y todo glassmorphism futuro

### 2026-04-03: Assets externos en render crítico
- **Error**: noise.svg de grainy-gradients.vercel.app es single point of failure
- **Fix**: Data URI inline en globals.css o servir desde /public
- **Aplicar en**: Todo el proyecto antes de producción

---

*PRP-021 pendiente aprobación. No se ha modificado código.*
