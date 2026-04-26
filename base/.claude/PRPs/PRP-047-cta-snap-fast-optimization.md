# PRP-047: Snap-Fast Optimization for Landing & Services CTAs

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-15
> **Proyecto**: landing-linkedin

---

## Objetivo

Implementar la narrativa de scroll **"Snap-Fast"** en las secciones finales de la landing page (`LandingCta.tsx`) y la subpágina de servicios (`ServicesCta.tsx`). El estado final es una experiencia de scroll altamente ágil que utiliza "mesetas de lectura" (plateaus) para anclar el contenido brevemente en el centro del viewport antes de una transición rápida y con autoridad.

## Por Qué

| Problema | Solución |
|----------|----------|
| Sensación de "scroll infinito" o lento al final de la página que diluye el impacto del CTA. | Reducción de tiempos de transición y unificación de la física de movimiento para un cierre punchy. |
| Dificultad para leer copys importantes mientras el usuario scrollea rápidamente. | Implementación de zonas estáticas (plateaus) que "atrapan" el texto en el centro para facilitar el consumo de información. |

**Valor de negocio**: Aumentar la tasa de conversión al presentar la oferta final de manera más directa, autoritaria y sin fricciones de navegación.

## Qué

### Criterios de Éxito
- [ ] Implementación de física de resortes uniforme (`stiffness: 240`, `damping: 35`) en ambas secciones.
- [ ] Creación de **Reading Plateaus** de al menos el 15% del progreso de scroll para cada bloque de texto.
- [ ] Eliminación de "zonas grises" (donde ningún elemento es legible al 100%) mediante la reducción de ventanas de transición a `< 0.08` unidades.
- [ ] Sincronización del revelado del Botón CTA y el Footer con un delay imperceptible.

### Comportamiento Esperado
El usuario llega al final de la página. Al scrollear, el primer bloque de copy vuela al centro y se detiene (Snap). Un ligero scroll adicional lo dispara hacia arriba mientras el siguiente bloque entra y se detiene. Finalmente, el Logo y el Botón de Auditoría aparecen casi instantáneamente, cerrando la experiencia con un impacto visual de alta gama.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Patrón Snap-Fast ya implementado con éxito.
- PRP-045 - Optimización de PasSection (Base técnica).

### Componentes Involucrados
- `src/features/landing-page/components/LandingCta.tsx`
- `src/features/services/components/ServicesCta.tsx`

---

## Blueprint (Assembly Line)

### Fase 1: Calibración de Física y Estructura
**Objetivo**: Establecer la base de rendimiento y unificar los contenedores de scroll.
**Validación**: Confirmar que ambos componentes usan `stiffness: 240` y `damping: 35`.

### Fase 2: Implementación de Lógica de Meseta (Plateaus)
**Objetivo**: Modificar los `useTransform` (opacity/y/scale) para incluir zonas estáticas en el centro.
**Validación**: El texto debe permanecer al 100% de opacidad y `y: 0` durante un rango definido (ej: `[0.2, 0.4]` de su propia fase).

### Fase 3: Sincronización de Cierre Ultra-Rápido
**Objetivo**: Unificar el revelado del CTA final y el Footer para un final contundente.
**Validación**: Las ventanas de progreso para el reveal final deben ser de `0.05` aproximadamente.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end sin errores de hidratación ni lag.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Verificación visual de que no hay saltos de scroll (layout thrashing).
- [ ] Criterios de éxito cumplidos.

---

## Gotchas
- El `ServicesCta` actualmente tiene una física mucho más lenta (`stiffness: 70`). El cambio a `240` será un cambio de sensación visual drástico.
- El `LandingCta` integra el Footer; debemos asegurar que el "plateau" del CTA no oculte el footer prematuramente.

## Anti-Patrones
- NO añadir delays innecesarios en `useSpring`.
- NO usar transformaciones de `scale` excesivas que puedan pixelar el texto en dispositivos móviles.

---

*PRP pendiente aprobación. No se ha modificado código.*
