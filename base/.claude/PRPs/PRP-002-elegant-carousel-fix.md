# PRP-002: Refactorización Robusta del ElegantCarousel

> **Estado**: PENDIENTE DE APROBACIÓN
> **Fecha**: 2026-04-19
> **Proyecto**: KIA Intelligence

---

## Objetivo

Solucionar el defecto de navegación (fuga de clics/taps) en `<ElegantCarousel />` mediante la corrección de los parachoques lógicos de los eventos táctiles (`onTouch`) y el fortalecimiento de la cola de transiciones. El objetivo es que las flechas y gestos sean 100% predecibles sin adelantar o atrasar las vistas de forma errática.

## Por Qué

| Problema | Solución |
|----------|----------|
| En pantallas táctiles o laptops con touch-pad, el simple hecho de "tapear" cualquier parte de la pantalla retiene valores anteriores de movimiento (`touchEndX`), validando falsos "swipes" y volviéndose inmanejable. | Aislamiento y reseteo inmediato de coordenadas táctiles (`touchStartX` y `touchEndX`) en cada iteración de `onTouchStart`. Adicionalmente se blindará con `e.stopPropagation()` y mejores dependencias. |

**Valor de negocio**: La sección de Proceso/Casos de Estudio debe destilar el perfeccionismo técnico (la "Ingeniería de Élite") prometido. Un widget que se comporta de manera errática o inestable sabotea directamente la "Autoridad Digital" que la interfaz pretende transmitir.

## Qué

### Criterios de Éxito
- [ ] Tocar la pantalla en un punto fijo (tap) sin mover el dedo NO debe saltar de slide.
- [ ] Los botones de Flecha (Prev/Next) no deben burbujear eventos indeseados a contenedores padre.
- [ ] Los deslizadores inferiores (Progress Indicators) deben reflejar un cambio inmediato sin cruzar estados si se clickean masivamente por el usuario (debouncing visual).

### Comportamiento Esperado (Happy Path)
El usuario ve el carrusel y, si está en PC, usa los botones del slide. Si arrastra con su dedo en un móvil/tablet, el carrusel cambia solo cuando la diferencia del arrastre excede el margen (60px). Un simple tap para intentar leer un texto o tocar cualquier zona no afecta la posición actual del slider bajo ninguna circunstancia.

---

## Contexto

### Referencias
- **Componente Afectado**: `src/components/ui/elegant-carousel.tsx`
- **Bug Detectado**: `touchEndX.current` conserva su estado anterior si un usuario hace un *swipe* y luego simplemente hace un *tap*. Esto genera la impresión de que "se vuelve loco". Se soluciona forzando que `touchEndX.current = touchStartX.current` al iniciar el evento.

### Arquitectura Propuesta
- **Fix Lógico #1**: Igualar coordenadas en el inicio del toque.
- **Fix Lógico #2**: Añadir `e.stopPropagation()` en los `onClick` de las flechas.
- **Micro-interacción**: Refinar los chequeos de `isTransitioning` introduciendo un timeout seguro en un hook limpiable (cleanup in `useEffect`) para no tener memory leaks si el componente se desmonta.

---

## Blueprint (Assembly Line)

### Fase 1: Ingeniería de Autocorrección Táctil
**Objetivo**: Prevenir cálculos falsos en `onTouchEnd`.
**Especificaciones**:
1. En `handleTouchStart`, asignar ambas coordenadas al mismo punto de origen para que por defecto la diferencia sea `0`.

### Fase 2: Blindaje de Clics y Memoria (Debounce)
**Objetivo**: Fortalecer las flechas y la memoria de JS.
**Especificaciones**:
1. Modificar `goNext` y `goPrev` para evitar clicks accidentales mientras se transiciona el componente (y prevenir que se encolen `setTimetouts` paralelos sin control).

### Fase 3: Q&A Testing
**Verificación Preventiva**: Comprobar que en ambiente de desarrollo, `npm run typecheck` y las interacciones manuales devuelvan 0 fugas conductuales.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)
*(Se rellenará tras la ejecución)*

## Gotchas
- El progreso (`setProgress`) se basa en un `setInterval` dependiente de render; nos aseguraremos de que la limpieza (`clearInterval`) se mantiene sólida para evitar parpadeos si el usuario pasa rápido de tarjetas.

## Anti-Patrones
- No instalar librerías como `framer-motion` o `react-swipeable` para este componente en particular si ya está construido con Tailwind y React vainilla (manteniendo dependencias bajas).
