# PRP-002: PasSection UI/UX Refinement (Clean Reveal)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-25
> **Proyecto**: landing-linkedin

---

## Objetivo

Rediseñar la transición de la sección PAS para eliminar el amontonamiento visual de tarjetas y asegurar una legibilidad premium. Se busca un efecto de "revelado limpio" donde el contenido anterior no ensucie la visualización del contenido actual.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las tarjetas con glasmorfismo y desenfoque acumulado crean una "nube" que dificulta la lectura. | Eliminar el fondo de vidrio pesado y usar un sistema de "Fade & Scale Out" para las tarjetas previas. |
| El apilado actual se ve desordenado ("amontonado") en diferentes resoluciones. | Implementar un sistema de enfoque único donde solo 1 o 2 tarjetas sean visibles con claridad a la vez. |

**Valor de negocio**: Mejora la retención del usuario en la sección de "Problema/Agitación", crucial para la conversión antes de presentar la solución técnica.

## Qué

### Criterios de Éxito
- [ ] Eliminación del efecto de apilado borroso (glassmorphism clutter).
- [ ] Legibilidad del 100% en el texto activo sin interferencia de capas inferiores.
- [ ] Transición fluida estilo "Focus Reveal" (la tarjeta nueva toma el foco, la anterior se desvanece o se retira).
- [ ] Mantener el rendimiento de 60fps con Framer Motion.

### Comportamiento Esperado
1. El usuario entra a la sección y ve el Logo Intro.
2. Al scrollear, la Tarjeta 1 entra con un efecto de "Focus".
3. Al seguir scrolleando, la Tarjeta 2 entra y la Tarjeta 1 **pierde opacidad y escala** (o se desplaza hacia atrás) de forma agresiva para no estorbar.
4. El fondo dinámico (glow) sigue activo pero de forma más sutil para no competir con el texto.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Implementación actual a refactorizar.
- [Framer Motion Layout Animations](https://www.framer.com/motion/layout-animations/)

### Arquitectura Propuesta
Se mantendrá dentro de la feature existente, pero se simplificará el componente `ScrollTextItem`.

---

## Blueprint (Assembly Line)

### Fase 1: Limpieza de Estilos y Props
**Objetivo**: Eliminar las clases de `glass` y `backdrop-blur` que causan el ruido visual. Probar un diseño "Typography First".
**Validación**: Las tarjetas no se ven borrosas al superponerse.

### Fase 2: Lógica de Focus Switching
**Objetivo**: Implementar una lógica donde `opacity` de la tarjeta `N` caiga a `0.1` o `0` cuando la tarjeta `N+1` esté activa.
**Validación**: Solo una tarjeta es protagonista en pantalla.

### Fase 3: Visual Polish & Glow Sync
**Objetivo**: Sincronizar el resplandor de fondo con la intensidad de la tarjeta activa.
**Validación**: El "wow effect" se mantiene pero de forma limpia.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] El usuario confirma que la UI ya no se ve "amontonada".
- [ ] Criterios de éxito cumplidos.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

---

## Gotchas

- [ ] `framer-motion` puede tener saltos si los rangos de `useTransform` se solapan demasiado.
- [ ] El `z-index` debe manejarse con cuidado para que la tarjeta nueva siempre esté arriba.

---

*PRP pendiente aprobación. No se ha modificado código.*
