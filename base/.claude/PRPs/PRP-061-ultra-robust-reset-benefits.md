# PRP-061: Lógica Ultra-Robusta de Reset para Focus Mode

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-12
> **Proyecto**: landing-linkedin

---

## Objetivo
Garantizar que el reseteo de la visibilidad de las tarjetas sea infalible al cambiar de sección en el scroll de beneficios, eliminando bloqueos por animaciones o ciclos de renderizado inconsistentes.

## Por Qué

| Problema | Solución |
|----------|----------|
| `onIndexChange` no se dispara de forma fiable si el usuario scrollea rápido (bloqueo por `isAnimating` en el componente base). | Refactorizar `FullScreenScrollFX` para que el cambio de índice sea independiente del estado de animación visual. |
| Re-creación constante de `cinematicSections` causa remonte de componentes. | Usar `useMemo` para estabilizar la estructura de datos de las secciones. |
| El reseteo de estado en el handler puede perderse en re-renders. | Implementar un `useEffect` reactivo al `activeIndex` para forzar la visibilidad. |

## Qué

### Criterios de Éxito
- [ ] Ocultar tarjetas en el slide 1.
- [ ] Scrollear al slide 4 (conectividad total).
- [ ] Las tarjetas del slide 4 aparecen inmediatamente (reseteo forzado).
- [ ] El botón se actualiza visualmente al estado "Focus Mode" activo.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx`
- `src/shared/components/ui/full-screen-scroll-fx.tsx`

---

## Blueprint (Assembly Line)

### Fase 1: Optimización de BenefitsList (Contexto IA)
**Objetivo**: Estabilizar el componente y asegurar reactividad pura.
- **Cambio 1**: Envolver `cinematicSections` en `useMemo` con dependencias `[isCardsVisible, limit]`.
- **Cambio 2**: Añadir `useEffect` dependiente de `activeIndex` que llame a `setIsCardsVisible(true)`.
- **Cambio 3**: Eliminar logs de debug una vez verificado.

### Fase 2: Robustez en FullScreenScrollFX
**Objetivo**: Asegurar que `onIndexChange` se ejecute siempre, incluso si hay una transición en curso.
- **Cambio**: Permitir que el estado de índice cambie (y se emita el evento) sin esperar a que `gsap` termine la animación de opacidad/escala de los fondos.

### Fase 3: Validación de Ciclo de Vida
**Objetivo**: Probar bajo stress (scroll rápido).
**Validación**:
- [ ] `npm run typecheck`.
- [ ] Prueba visual mobile y desktop.

---

## Gotchas

- [ ] Si `isCardsVisible` cambia mientras el componente `FeatureGrid` está en transición, podría haber un salto visual si no se usa `AnimatePresence` correctamente (ya está implementado).

---

*PRP pendiente aprobación. No se ha modificado código.*
