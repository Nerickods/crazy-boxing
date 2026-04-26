# PRP-017: Optimización de Rendimiento Móvil (60 FPS Scroll)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-31
> **Proyecto**: KIA Intelligence

---

## Objetivo

Eliminar la sensación de lentitud y "pegajosidad" en dispositivos móviles (iPhone) al hacer scroll, optimizando el pipeline de renderizado y reduciendo el costo de composición de las secciones `PasSection` y `LandingCta`.

## Por Qué

| Problema | Soluición |
|----------|----------|
| El scroll se siente trabado y lento en iOS Safari debido al uso excesivo de `backdrop-filter` y grandes radios de `blur`. | Implementar una estrategia de "Adaptive UI" que desactive efectos costosos en móvil manteniendo la estética premium. |

**Valor de negocio**: La primera impresión en móvil es crítica para la conversión. Un scroll fluido transmite profesionalismo y tecnología de punta, mientras que el lag genera desconfianza y abandono.

## Qué

### Criterios de Éxito
- [ ] Scroll fluido (60 FPS estables) en iPhone 13+ o similar.
- [ ] Eliminación total de `backdrop-filter` en la versión móvil de la landing.
- [ ] Reducción del radio de `blur` en gradientes atmosféricos a un máximo de 40px en móvil.
- [ ] Cero dependencias de texturas de ruido (noise) SVG externas durante el scroll en móvil.

### Comportamiento Esperado
El usuario navega por la sección `PasSection`, viendo los textos cinemáticos aparecer sin saltos de frames. Al llegar al CTA final y Footer, la transición es instantánea y reactiva al tacto, sin el retraso actual provocado por el sobre-procesamiento de capas.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Foco de optimización de blurs.
- `src/features/landing-page/components/LandingCta.tsx` - Foco de optimización de glassmorphism.
- [MDN: backdrop-filter performance](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#performance_considerations)

### Arquitectura Propuesta (Adaptive UI)
Utilizaremos `tailwind` modifiers (`md:`, `hidden`, `block`) y hooks de React (ej: `useMediaQuery`) si es necesario para inyectar configuraciones de animación más ligeras en breakpoints móviles.

---

## Blueprint (Assembly Line)

### Fase 1: Auditoría y Desactivación de Glassmorphism
**Objetivo**: Remover `backdrop-filter` de contenedores críticos (Sticky y Footer).
**Validación**: Inspección de elementos en móvil confirma que no se aplica `backdrop-filter`.

### Fase 2: Simplificación de Gradientes Atmosféricos
**Objetivo**: Reducir radios de blur y simplificar gradientes `radial` y `linear` en `PasSection`.
**Validación**: Pruebas de scroll muestran una mejora inmediata en la respuesta táctil.

### Fase 3: Optimización de Assets y Filtros
**Objetivo**: Limpiar filtros CSS complejos (drop-shadow) del logo y texturas de ruido en móvil.
**Validación**: El "Paint time" en Chrome DevTools se reduce significativamente.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end con 60 FPS.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Prueba física en dispositivo móvil confirma fluidez.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-03-31]: iOS Safari vs Backdrop-Filter
- **Error**: El uso de `backdrop-filter` en elementos `sticky` de gran tamaño mata el rendimiento en iPhone.
- **Fix**: Desactivar blur en móvil y usar fallbacks de opacidad sólida.
- **Aplicar en**: Futuras secciones de dashboards o headers globales.

---

## Gotchas

- [ ] Los gradientes de fondo deben mantener la armonía de color (Cyan/Emerald) aunque se simplifiquen.
- [ ] `framer-motion` springs pueden necesitar un `damping` más alto en móvil para evitar oscilaciones lentas que se perciban como lag.

## Anti-Patrones

- NO usar `backdrop-filter` en elementos que cubran más del 50% del viewport en móvil.
- NO encadenar más de 3 filtros CSS (`contrast`, `brightness`, `drop-shadow`) en el mismo elemento.

---

*PRP pendiente aprobación. No se ha modificado código.*
