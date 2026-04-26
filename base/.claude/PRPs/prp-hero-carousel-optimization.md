# PRP-001: Optimización del HeroInfiniteCarousel en BenefitsList

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-18
> **Proyecto**: KIA Intelligence

---

## Objetivo

Eliminar el "lag", "stuttering" y lentitud general (drop de FPS) que experimentan los dispositivos móviles al hacer scroll y visualizar la pestaña "Lander Apple-Style" dentro de la sección `BenefitsList`. El objetivo es lograr una renderización sedosa a 60 FPS, manteniendo la alta calidad visual.

## Por Qué

| Problema | Solución |
|----------|----------|
| En dispositivos móviles (especialmente iOS/Android de gama media), la navegación se traba enormemente al llegar a `BenefitsList` debido a un consumo excesivo de CPU/GPU. | Refactorizar la arquitectura de renderizado y las animaciones de `InfiniteCarouselRow` y `ShaderBackground` para que sean "invisibles" y no consuman recursos cuando están inactivas. |
| Las animaciones continuas (Framer Motion y WebGL) se siguen calculando en background aunque tengan `opacity: 0`. | Implementar un sistema de pausado determinista y migrar animaciones JS pesadas a aceleración por hardware (CSS puro). |

**Valor de negocio**: La Landing Page debe proyectar una imagen "Apple-Style" premium. Si la página se traba (lag), la percepción de calidad del usuario colapsa instantáneamente, rompiendo el *Social Proof* pasivo del servicio e incrementando la tasa de rebote ("bounce rate"). Una UI fluida equivale a confianza.

## Qué

### Criterios de Éxito
- [ ] Al hacer scroll en móvil hacia la sección `BenefitsList`, no existe caída notoria de frames (mantenimiento de ~60 FPS).
- [ ] Cuando la pestaña "Lander Apple-Style" *no* está activa (es decir, el usuario cambió a "Agente IA" o "Dashboard CRM"), las animaciones del carrusel se pausan completamente y dejan de consumir ciclos de CPU/GPU.
- [ ] La superposición de imágenes en el carrusel se ha reducido al mínimo matemático para lograr el loop (de 3-duplicados a 2-duplicados, reduciendo DOM nodes).
- [ ] Las imágenes del carrusel son gestionadas mediante composite layers limpias (`translate3d`) sin invocar al main thread.

### Comportamiento Esperado
Al entrar en la sección `BenefitsList` y visualizar la primera tarjeta, el `HeroInfiniteCarousel` aparece mediante un fade-in fluido y comienza a rotar usando aceleración de GPU real. Al cambiar a la segunda o tercera opción del scroll, tanto el `HeroInfiniteCarousel` como el `ShaderBackground` detienen su procesamiento en segundo plano (no solo ocultan su opacidad, detienen su motor). Al volver a la primera tarjeta, la animación se reanuda de forma imperceptible.

---

## Contexto

### Referencias
- Archivo contenedor: `src/features/landing-page/components/BenefitsList.tsx`
- Background Container: `src/shared/components/ui/hero-infinite-carousel.tsx`
- Core render engine: `src/shared/components/ui/infinite-carousel-row.tsx`
- Problema detectado: Componentes pesados (24 `Image` tags de Next.js, Framer Motion Loops) no reciben ni respetan la prop `isActive`.

### Análisis de la Causa Raíz (Root Cause)
1. **Framer Motion Memory Leak / Background Running:** Actualmente `HeroInfiniteCarousel.tsx` recibe la prop `isActive={active}` y ajusta la opacidad (`opacity: 0`). **Pero no pasa esta prop hacia sus hijos** (`InfiniteCarouselRow`). Por ende, Framer Motion sigue calculando la interpolación de `x` infinitamente en segundo plano.
2. **WebGL Fallback:** `ShaderBackground` recibe `speed={0}` cuando está inactivo, lo cual reduce carga, pero el Canvas sigue montado y escuchando eventos. Sumado al Carrusel moviéndose, revienta la RAM del móvil.
3. **DOM Overdraw:** `InfiniteCarouselRow.tsx` actualmente concatena el array 3 veces: `[...images, ...images, ...images]`. Para 4 imágenes base, son 12 por fila, 24 imágenes pesadas simulando movimiento. Solo 2 copias son necesarias para lograr un loop de marquee perfecto.
4. **JS-Animation vs CSS:** Framer Motion animating `x` en un bucle infinito es excelente en web, pero en este caso de fondo puro que abarca todo el viewport, un fallback a native CSS `@keyframes` con `animation-play-state` brinda mayor offload de GPU.

### Arquitectura Propuesta (Modificaciones)
Modificaremos los componentes UI puramente a nivel de Hooks y CSS, manteniendo la misma estructura de carpetas:

```text
src/shared/components/ui/
├── hero-infinite-carousel.tsx (Se modifica para pasar play/pause prop y unmounts retrasados)
└── infinite-carousel-row.tsx (Se refactoriza de Framer Motion a CSS Marquee o pausa controlada vía JS API)
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Optimización de Hardware y DOM del Carrusel (`infinite-carousel-row.tsx`)
**Objetivo**: Limpiar el componente base. Reducir el DOM footprint eliminando el tercer array innecesario (de 3 arrays a 2 copias si el tamaño lo permite, o recalcular el ancho dinámico) y migrar la interpolación continua a variables puras de GPU.
**Validación**: Inspeccionar el HTML generado; verificar que el número de nodos de imagen se ha reducido drásticamente y que la animación sigue fluyendo suavemente sin cortes.

### Fase 2: Implementación de Contexto "isActive" y Control de Ejecución (`hero-infinite-carousel.tsx`)
**Objetivo**: Establecer un canal de comunicación real entre la visibilidad (opacity) y los motores de render de las animaciones.
**Validación**: Usar el Profiler/Performance tool del DevTools para confirmar que al pasar a la pestaña "Agente IA", la actividad de scripts ligada al "HeroInfiniteCarousel" cae a cero (0ms task time).

### Fase 3: Estrategia de Pausado Condicional (Animation `play-state`)
**Objetivo**: Conectar el evento de `isActive = false` del componente padre hacia una detención forzada del motor en los hijos. O bien deteniendo el hook de Framer Motion (`useAnimationControls`) o aplicando condicionalmente un estilo `animationPlayState: 'paused'`. También se puede introducir un flag `display: none` con un `setTimeout` o `onAnimationEnd` una vez que la transición de opacidad terminó.
**Validación**: Al cambiar de pestaña no hay cálculos fantasmas; al regresar a la primera, el carrusel se reanuda correctamente.

### Fase 4: Validación Final y Testeo en Responsividad
**Objetivo**: Sistema funcionando end-to-end con una subida visible en los FPS en herramientas de profiling sobre un throttle de CPU simulado en dispositivo móvil (Playwright/Chrome DevTools 4x CPU throttle).
**Validación**:
- [ ] No existe lag visible al hacer scroll hacia y dentro del `BenefitsList`.
- [ ] Rendimiento aceptable en Chrome DevTools con throttle móvil (CPU x4 / x6).
- [ ] El efecto visual original y la dirección de desplazamiento de las franjas quedan matemáticamente idénticas a la versión anterior.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### [YYYY-MM-DD]: [Espacio para iteraciones]
- **Error**: 
- **Fix**: 
- **Aplicar en**: 

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] **Desmontar vs Pausar**: Si se "desmonta" por completo al ocultarlo (`active && <Carousel/>`), cuando el usuario vuelva a enfocar, los assets (imágenes) pueden "parpadear" si el caché es purgativo. La recomendación es mantener el nodo DOM pero forzar detención de animaciones CSS (`play-state: paused`) y WebGL timers.
- [ ] **Seamless Loop Logic**: Si bajamos la concatenación a `[...images, ...images]`, es vital que el ancho combinado siempre supere holgadamente el ancho del viewport principal; de lo contrario ocurrirá un salto (glitch) al reiniciar la animación.

## Anti-Patrones

- NO usar condicionales `if (!isActive) return null` para destruir el componente (rompe la fluidez del fade-out del FullScreenScrollFX).
- NO depender de "will-change: transform" aislado como solución mágica; si la CPU sigue despachando eventos rAF, la RAM se llenará de igual modo.
- NO aplicar CSS modules nuevos: Mantenernos ceñidos estrictamente a Tailwind y CSS Inline Styles dinámicos donde compute la matemática.

---

*PRP pendiente aprobación. No se ha modificado código.*
