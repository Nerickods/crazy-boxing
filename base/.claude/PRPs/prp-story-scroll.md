# PRP-001: Experiencia "Story Scroll" (Inspiración Morningside)

> **Estado**: COMPLETADA
> **Fecha**: 2026-03-21
> **Proyecto**: landing-linkedin

---

## Objetivo

Arreglar y perfeccionar la experiencia de "Story Scroll" (inspirada en morningside.ai) **únicamente en las dos primeras secciones después del Hero**: `PasSection.tsx` y `BentoEcosystem.tsx`. El Hero se mantendrá intacto. Se buscará una transición cinemática fluida donde el copy y las tarjetas respondan al scroll sin los fallos o saltos actuales.

## Por Qué

| Problema | Solución |
|----------|----------|
| La implementación actual de framer-motion en `PasSection` y `BentoEcosystem` no funciona correctamente (se sienten desconectadas, saltan o los tiempos no cuadran). | Refactorizar la coreografía de `useScroll` y `useTransform` en ambos componentes para que la narrativa fluya sin interrupciones ni overlapping indeseado. |

**Valor de negocio**: Aumentar la retención en las primeras etapas críticas del embudo (PasSection y Solución Bento), logrando que el usuario asimile el mensaje de "Tech Mutation" de forma obligatoria y fluida.

## Qué

### Criterios de Éxito
- [ ] Se implementa un contenedor `sticky` de múltiples viewports de altura (`h-[400vh]` o similar).
- [ ] El texto y las tarjetas cambian de posición, escala y opacidad progresivamente vinculados a la posición exacta del scroll (sin usar videos, solo elementos de React/DOM).
- [ ] Refleja el flujo lógico similar a Morningside (Ej: Problema -> Solución -> Proceso: Identify/Develop/Adopt).
- [ ] La experiencia es fluida en Desktop (60fps) usando transformaciones GPU (`will-change: transform`).
- [ ] El diseño es responsivo (se adapta a Mobile sin romper la interfaz, ajustando rangos de animación y stacking).

### Comportamiento Esperado
1. El usuario llega a la sección de Storytelling. La pantalla se "ancla" (sticky).
2. TÍTULO aparece centrado: "Nuestro Proceso / No solo hablamos de IA, la entregamos".
3. Scroll (20%): El título se encoge o se mueve arriba/izquierda para dar paso a la Tarjeta 1 (Fase 1 del Método).
4. Scroll (40%): La Tarjeta 1 se difumina/escala hacia atrás, aparece la Tarjeta 2.
5. El flujo continúa revelando la información de manera secuencial. Una vez finalizada la secuencia, el ancla se libera y el usuario hace scroll hacia las siguientes secciones (Testimonios/Beneficios/FAQ).

---

## Contexto

### Referencias
- Código base: `src/features/landing-page/components/PasSection.tsx` y `BentoEcosystem.tsx` (ya usan `useScroll` y `useTransform` de `framer-motion` para anclar vistas).
- UX Inspiración: https://www.morningside.ai/ (Transición fluida de texto e imágenes sin video de fondo, puro DOM manipulation).
- El proyecto usa diseño *Feature-First* y ya tiene el contenedor base unificado `page.tsx` con contexto Glassmorphism.

### Arquitectura Propuesta (Feature-First)
No se crearán archivos nuevos, se refactorizará el código existente:
- `src/features/landing-page/components/PasSection.tsx` (Sección de Problema > Agitación > Solución)
- `src/features/landing-page/components/BentoEcosystem.tsx` (Grid/Tarjetas de la solución)

Ambos mantendrán la estructura `sticky top-0 h-screen` con su propio wrapper `h-[300vh]` o `h-[400vh]`, pero se sincronizarán y recalcularán las interpolaciones de opacidad, Y, y scale.

---

## Blueprint (Assembly Line)

> FASES PREPARADAS PARA EL BUCLE AGÉNTICO.

### Fase 1: Diagnóstico y Mapeo de Ejes
**Objetivo**: Entender exactamente por qué falló la implementación actual. Auditar los arrays de interpolación matemática (`[0, 0.2, 0.4]`) de Framer Motion en `PasSection` y `BentoEcosystem`.
**Validación**: Variables de `useTransform` recalculadas lógicamente para evitar overlapping y saltos bruscos.

### Fase 2: Fix de `PasSection.tsx` (El Storytelling del Problema)
**Objetivo**: Implementar matemática asertiva para la entrada y salida de las 3 tarjetas de Missing Leads, Black Box y Tech Mutation.
**Validación**: Las tarjetas se sienten como "diapositivas" suaves al scrollear sin encimarse.

### Fase 3: Fix de `BentoEcosystem.tsx` (El Ecosistema)
**Objetivo**: Ajustar la revelación sucesiva de los 4 módulos sobre un mismo contenedor anclado, con un efecto escalonado estilo Apple.
**Validación**: Transiciones fluidas entre el Modulo 1, 2, 3 y 4.

### Fase 4: Optimización Responsiva y Pulido
**Objetivo**: Adaptar la coreografía para móviles (ajustar las posiciones X e Y para pantallas pequeñas) y asegurar performance (suprimir el repintado usando texturas difusas o `translateZ`).
**Validación**:
- [ ] En móvil la información no se desborda.
- [ ] No interfiere con el `GlassRefractionBackground` global.
- [ ] Pasa las pruebas de `npm run typecheck` y linter de Next.js.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECERÁ con cada error encontrado durante la implementación.

### 2026-03-21: Solapamiento y Saltos en `useTransform` (Framer Motion)
- **Error**: En componentes anclados (`h-[300vh]`), si el array de entrada (e.g. `[0.2, 0.4]`) de animación de opacidad/posición no tiene tiempos de retención (`hold duration`) claros entre entrada y salida, múltiples tarjetas se mezclaban en pantalla causando ruido con el *Glassmorphism*.
- **Fix**: Se modificó la matemática para que siempre consista en 4 puntos clave `[startIn, endIn, startOut, endOut]`, asegurando que `endIn` y `startOut` tengan una separación de un `10%` o `15%` mínimo de la altura (generando el tiempo de lectura estático deseado). Además, se separaron los bloques sin cruzarse `[0.0, 0.2]`, `[0.2, 0.4]`, etc.
- **Aplicar en**: Cualquier futura sección scroll-driven (Scroll-Storytelling) del proyecto.

---

## Gotchas

- [ ] **Múltiples useTransform**: Cuidar de no solapar los arrays de rangos numéricos si se desean "tiempos muertos" (hold times) entre animaciones.
- [ ] **Will-Change**: Aplicar estilo `will-change: transform, opacity` a los envoltorios animados para evitar saltos en Safari o móviles debido al scroll repainting con el fondo de Glassmorphism.

## Anti-Patrones

- NO usar event listeners manuales de `scroll` en la ventana, usar estrictamente hooks reactivos como `useScroll` de Framer Motion.
- NO depender de z-index conflictivos; mantener todo dentro del mismo contenedor de pila.

---

*PRP pendiente aprobación. No se ha modificado código.*
