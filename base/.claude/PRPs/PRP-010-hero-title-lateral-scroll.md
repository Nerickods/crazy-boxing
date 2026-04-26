# PRP-010: Hero Title Lateral Scroll Enhancement

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-23
> **Proyecto**: landing-linkedin

---

## Objetivo

Implementar un efecto de desplazamiento lateral sincronizado con el scroll para la segunda línea del título principal ("ELIMINA EL TRABAJO MANUAL CON IA") en la Hero Section, manteniendo su estilo actual pero dotándolo de la misma dinámica premium que los títulos superiores.

## Por Qué

| Problema | Solución |
|----------|----------|
| El segundo título permanece estático mientras el superior se expande lateralmente, rompiendo la armonía visual. | Sincronizar ambos títulos con desplazamientos coordinados para crear una sensación de profundidad y cohesión. |

**Valor de negocio**: Refuerza la identidad visual "Élite/Premium" de la marca, aumentando la retención del usuario en los primeros segundos de la landing page.

## Qué

### Criterios de Éxito
- [ ] La línea "ELIMINA EL TRABAJO" se desplaza hacia la izquierda al hacer scroll.
- [ ] La línea "MANUAL CON IA" se desplaza hacia la derecha al hacer scroll.
- [ ] Se mantiene el gradiente animado y las sombras del diseño original.
- [ ] El desplazamiento es fluido y coordinado con la expansión de la media central (Lumina).
- [ ] El rendimiento se mantiene óptimo (sin re-renders por scroll).

### Comportamiento Esperado
Al iniciar el scroll en la Hero, el primer grupo de títulos se abre lateralmente. Inmediatamente después (o simultáneamente), el segundo grupo de títulos (ELIMINA EL TRABAJO | MANUAL CON IA) también comienza su apertura lateral, creando un efecto de "puerta" doble o parallax que revela el contenido central.

---

## Contexto

### Referencias
- `src/shared/components/ui/scroll-expansion-hero.tsx` - Contiene la lógica actual de `applyProgress` y `translateX`.
- `src/features/landing-page/components/HeroSection.tsx` - Implementación actual del Hero.

### Arquitectura Propuesta (Feature-First)
No se requieren nuevas carpetas, solo modificaciones en:
- `shared/components/ui/scroll-expansion-hero.tsx` (Core de animación)
- `features/landing-page/components/HeroSection.tsx` (Uso de la feature)

---

## Blueprint (Assembly Line)

### Fase 1: Extensión de ScrollExpandMedia
**Objetivo**: Modificar el componente base para soportar un segundo nivel de títulos animados vía refs.
**Validación**: Las nuevas refs están disponibles y mapeadas en `applyProgress`.

### Fase 2: Implementación en HeroSection
**Objetivo**: Vincular el título secundario a las nuevas funcionalidades de desplazamiento.
**Validación**: El título secundario se mueve lateralmente al hacer scroll.

### Fase 3: Pulido Visual y Sorpresa
**Objetivo**: Ajustar velocidades (parallax) y asegurar que el gradiente se vea perfecto durante el movimiento.
**Validación**: Efecto de profundidad superior al original ("Wow effect").

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] El desplazamiento es fluido en Chrome DevTools (60fps)
- [ ] Criterios de éxito cumplidos

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

---

## Gotchas
- El componente `ScrollExpandMedia` usa manipulación directa del DOM para evitar re-renders. Debemos seguir este patrón para evitar pérdida de frames.
- Los títulos están centrados; el desplazamiento debe ser simétrico.

## Anti-Patrones
- NO usar `useState` para el progreso del scroll.
- NO romper la compatibilidad de `ScrollExpandMedia` con otros posibles usos.

---

*PRP pendiente aprobación. No se ha modificado código.*
