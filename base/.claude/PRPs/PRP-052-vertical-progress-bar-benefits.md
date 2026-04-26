# PRP-052: Vertical Progress Bar — Benefits Section (Derecha)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Redespertar la barra de progreso de scroll que actualmente existe **horizontalmente en la parte inferior** del componente `FullScreenScrollFX` y moverla a una posición **vertical fija en el lado derecho** de la sección `BenefitsList`, respetando el mismo estilo visual (color cian, números de sección, glow) pero como una barra de progreso vertical que crece de arriba hacia abajo.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| La barra horizontal en el footer del componente se pierde visualmente por estar en la parte inferior, donde el usuario no la ve mientras hace scroll | Moverla al lado derecho como barra vertical sticky, siempre visible durante el scroll de la sección |
| No hay indicador claro de en qué sección (1, 2 o 3) está el usuario dentro del BenefitsList | La barra vertical mostrará los números `01/03` con la barra creciendo de arriba a abajo conforme el progreso avanza |
| El diseño no aprovecha el espacio lateral en desktop | Una barra lateral vertical es un patrón premium de UX (Apple, Linear, Vercel) que refuerza el sentido de navegación |

**Valor de negocio**: Mejora la orientación del usuario dentro de la sección de beneficios, reduciendo la tasa de rebote y aumentando la comprensión del contenido (3 módulos distintos = 3 propuestas de valor distintas).

---

## Qué

### Criterios de Éxito
- [ ] La barra horizontal original de abajo (`fx-progress`) queda **oculta** o eliminada visualmente dentro del `FullScreenScrollFX`
- [ ] Una nueva barra **vertical** aparece anclada al lado derecho de la sección `BenefitsList`
- [ ] La barra crece de **arriba hacia abajo** conforme el scroll progresa dentro de la sección
- [ ] Muestra los **números de sección** (`01` actual / `03` total) con el mismo estilo del original
- [ ] El color de la barra mantiene el estilo: `#00f2ff` (cian) con efecto `box-shadow glow`
- [ ] Es completamente **responsive**: se oculta en mobile (`<768px`) para no ocupar espacio
- [ ] La barra se **sincroniza con el `ScrollTrigger`** de GSAP existente, sin crear un segundo ScrollTrigger

### Comportamiento Esperado (Happy Path)
1. El usuario llega a la sección `#benefits-scroll-fx`
2. A la derecha de la pantalla aparece una barra vertical delgada (`2px` de ancho), fijada verticalmente durante todo el scroll de la sección
3. La barra `fill` crece de arriba hacia abajo conforme el progreso del ScrollTrigger avanza (0% → 100%)
4. Los números `01` y `03` se muestran encima y abajo de la barra (o a la izquierda de la barra, como en el original)
5. Al llegar al final de la sección, la barra está completamente llena y la sección transiciona a la siguiente

---

## Contexto

### Análisis del Componente Actual

#### `BenefitsList.tsx` (componente consumidor)
```
src/features/landing-page/components/BenefitsList.tsx
```
- Envuelve `<FullScreenScrollFX>` en un `<section id="benefits-scroll-fx">`
- Le pasa `showProgress={true}` — esto activa la barra horizontal actual
- **Estrategia**: Pasar `showProgress={false}` y crear la barra vertical **fuera** del componente (en `BenefitsList.tsx`), controlada por un `ref` del tipo `FullScreenFXAPI`

#### `full-screen-scroll-fx.tsx` (componente base)
```
src/shared/components/ui/full-screen-scroll-fx.tsx
```
**La barra actual** existe en el CSS como `.fx-progress` y `.fx-progress-fill`:
```css
/* Línea 717 */
.fx-progress { width: 200px; height: 2px; margin: 1rem auto 0; ... }
.fx-progress-fill { position: absolute; inset: 0 auto 0 0; width: 0%; ... }
```
- El `progressFillRef` se actualiza dentro del `ScrollTrigger.onUpdate` con `progressFillRef.current.style.width = \`${p}%\``
- **El ref `progressFillRef` solo existe dentro del componente** — necesitamos una estrategia de comunicación

### Estrategia de Implementación

**Opción A (Recomendada): Prop `onProgress` callback**
Agregar una prop `onProgress?: (progress: number) => void` al `FullScreenScrollFX`. En el `ScrollTrigger.onUpdate`, llamar a este callback junto con la actualización del `progressFillRef`. En `BenefitsList.tsx`, usar este callback para actualizar un `ref` externo que controle el `style.height` de la nueva barra vertical.

**Opción B: API Ref con método `getProgress`**
Extender el `FullScreenFXAPI` con `getProgress: () => number`. Menos eficiente porque requiere polling.

**Opción C: Ref externo pasado desde BenefitsList**
Pasar un `externalProgressRef?: React.RefObject<HTMLDivElement>` a `FullScreenScrollFX` para que el componente lo actualice directamente. Similar al `progressFillRef` interno existente.

> **Decisión**: Se usará **Opción A** (`onProgress` callback) por ser la más idiomática en React, compatible con la API existente, y no romper la encapsulación del componente.

### Referencias
- `src/shared/components/ui/full-screen-scroll-fx.tsx` — Fuente de verdad del ScrollTrigger y la lógica de progreso (líneas 268-278)
- `src/features/landing-page/components/BenefitsList.tsx` — Consumidor que montará la barra vertical
- Patrón visual de referencia: barra vertical del lado derecho estilo Linear.app / Apple Developer

### Arquitectura Propuesta

```
# Sin nueva feature — modificación de componentes existentes
src/shared/components/ui/
└── full-screen-scroll-fx.tsx   [MODIFY] — Agregar prop onProgress

src/features/landing-page/components/
└── BenefitsList.tsx            [MODIFY] — Agregar barra vertical con useRef + callback
```

### Modelo de Datos

No aplica — cambio puramente de UI/UX.

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase.

### Fase 1: Exponer el progreso desde `FullScreenScrollFX`
**Objetivo**: Agregar la prop `onProgress?: (progress: number) => void` al tipo `FullScreenFXProps` y llamarla dentro del `ScrollTrigger.onUpdate` justo donde ya se actualiza `progressFillRef.current.style.width`.
**Validación**: La prop nueva existe en el tipo. El callback se invoca con valores entre 0 y 1 durante el scroll.

### Fase 2: Ocultar la barra horizontal original
**Objetivo**: En `BenefitsList.tsx`, pasar `showProgress={false}` para eliminar la barra horizontal del footer del componente.
**Validación**: No se ve ninguna barra horizontal en la parte inferior de la sección.

### Fase 3: Crear la barra vertical en `BenefitsList.tsx`
**Objetivo**: Crear un elemento `div` posicionado absolutamente en el lado derecho de la `<section>`, con una barra de `fill` que crece verticalmente. El callback `onProgress` actualiza el `style.height` de la barra fill via `ref` (sin re-render de React).
**Validación**: La barra aparece en el lado derecho, crece con el scroll, y tiene números `01/03`.

### Fase 4: Estilizar para coincidir con el diseño original
**Objetivo**: Aplicar el mismo estilo visual del `.fx-progress-fill` original: color `#00f2ff`, `box-shadow: 0 0 10px #00f2ff`, fondo del track `rgba(245,245,245,0.28)`. Ocultar en mobile (`<768px`).
**Validación**: La barra es visualmente idéntica a la original pero en orientación vertical.

### Fase 5: Validación Final
**Objetivo**: Sistema funcionando end-to-end, sin regresiones en mobile ni en la lógica de ScrollTrigger existente.
**Validación**:
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso
- [ ] La barra vertical aparece en desktop y se oculta en mobile
- [ ] Los números de sección se actualizan correctamente
- [ ] La barra horizontal original ya no aparece
- [ ] No hay jank de scroll ni layout shifts adicionales

---

## 🧠 Aprendizajes (Self-Annealing)

> Esta sección CRECE con cada error encontrado durante la implementación.

*(Vacío — pendiente de implementación)*

---

## Gotchas

- [ ] El `ScrollTrigger` del componente usa `pinSpacing: true` — la sección tiene altura `300vh` (3 × 100vh). La barra vertical debe posicionarse relativa al elemento `fx-fixed-section` (el scrollable container de 300vh), pero **visualmente sticky** durante el scroll.
- [ ] La actualización del `style.height` de la barra DEBE hacerse via `ref` directo al DOM, **NO via setState**, para evitar re-renders durante el scroll y mantener 60fps.
- [ ] El `onProgress` callback se llamará en cada frame de scroll. Asegurarse de que la función pasada sea estable (usar `useCallback` o definirla fuera del componente).
- [ ] En el CSS de `full-screen-scroll-fx.tsx` existe `jsx` como prop de `<style>` — esto es CSS-in-JS dentro del componente. La barra vertical se implementará como Tailwind/inline en `BenefitsList.tsx` para evitar modificar ese bloque CSS.
- [ ] La prop `showProgress` ya existe y controla la visibilidad del `.fx-footer`. Con `showProgress={false}` desaparecerá toda la sección footer incluyendo la barra — verificar que no haya otros elementos en el footer que deban mantenerse.

## Anti-Patrones

- NO crear un segundo `ScrollTrigger` en `BenefitsList.tsx` — hay que reutilizar el existente via callback
- NO usar `useState` para actualizar la barra (causa re-renders cada frame)
- NO añadir `will-change: height` a la barra (solo `will-change: transform` o nada)
- NO depender de `window.scrollY` directamente — usar el progreso ya computado por GSAP

---

*PRP pendiente de aprobación. No se ha modificado código.*
