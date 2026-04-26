# PRP-044: Optimización de Velocidad de Scroll en PasSection

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-15
> **Proyecto**: landing-linkedin

---

## Objetivo

Reducir drásticamente la "distancia" de scroll requerida para transitar la `PasSection`, logrando que los textos intermedios (`ScrollTitleFlow`) pasen más rápido y el CTA final se muestre de forma mucho más ágil y directa.

## Por Qué

| Problema | Solución |
|----------|----------|
| El usuario percibe la sección como "infinita" en tiempo de scroll (`h-[900vh]`), lo que causa fatiga digital y puede generar abandono antes de llegar a la oferta principal. | Reducir la altura virtual del scroll y comprimir los tiempos de revelado (progress step) para maximizar la velocidad de consumo del mensaje. |

**Valor de negocio**: Retener la atención impaciente de perfiles C-Level/CEOs al entregarles la narrativa ("Problem-Agitation-Solution") a un ritmo acelerado, llevándolos más rápido a la conversión (CTA).

## Qué

### Criterios de Éxito
- [ ] La altura total del bloque `PasSection` se reduce sustancialmente (p. ej. de `900vh` a `400vh` o `500vh`).
- [ ] La velocidad percibida al hacer scroll entre el ítem 1 y el ítem 4 es visiblemente mayor.
- [ ] La aparición del bloque Final CTA se siente "inmediata" una vez terminan los textos intermedios, sin dejar espacios vacíos ("dead zones") o requerir scroll extra innecesario.
- [ ] No se rompe ninguna animación de desvanecimiento (`opacity`).

### Comportamiento Esperado
A medida que el usuario hace scroll, los textos de Agitación de Problemas aparecerán y desaparecerán en rápida sucesión. Inmediatamente después del último texto, el Logo y el bloque "Conecta tu negocio..." se desvanecerán en pantalla sin necesidad de seguir scrolleando infinitamente. 

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx`

### Arquitectura Propuesta (Feature-First)
No se requieren nuevos componentes. Modificaciones directas en `PasSection.tsx`:
- Ajuste de clase contenedora `h-[900vh]` a una altura menor.
- Ajuste del multiplicador `step` en `ScrollTitleFlow` (actualmente `0.17`).
- Ajuste de los rangos de entrada (`[0.84, 0.88, 1]`, `[0.92, 0.96]`, etc.) para el `LogoBrandFlow` y el `CTA final` para compensar los nuevos márgenes.

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Reducción de Altura y Compresión del Rango
**Objetivo**: Cortar la altura del contenedor principal y ajustar los pasos (`step`) de los items intermedios para que la secuencia pase rápidamente.
**Validación**: La barra de scroll es más grande (indicando menos contenido) y los textos fluyen a un ritmo acelerado sin romperse.

### Fase 2: Recalibración del Final Reveal
**Objetivo**: Mapear nuevamente los rangos de inicio del Logo y CTA para que calcen exactamente en el nuevo final de `smoothProgress` (sin "zonas muertas" de scroll al medio).
**Validación**: El CTA aparece justo cuando el usuario termina de leer el último punto del PAS, sintiéndose conectado y rápido.

### Fase 3: Validación Final UX/Performance
**Objetivo**: Sistema funcionando end-to-end con fluidez y velocidad optimizada.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] El scroll de principio a fin del componente dura aproximadamente un 50% menos que la versión original.
- [ ] Animaciones libres de lag (gracias a PRP-043 previo).

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.
> El conocimiento persiste para futuros PRPs. El mismo error NUNCA ocurre dos veces.

*(Se documentará durante la ejecución)*

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] Bajar demasiado el `vh` sin cambiar las matemáticas del `useTransform` puede causar que las animaciones ocurran "todas al mismo tiempo".
- [ ] El `restDelta` del `useSpring` puede necesitar un re-ajuste sutil si la velocidad de progreso es demasiado agresiva.

## Anti-Patrones

- NO añadir configuraciones de scroll complejas de Javascript (smooth scroll hijack). Siga confiando en CSS nativo y `framer-motion`.

---

*PRP pendiente aprobación. No se ha modificado código.*
