# PRP-060: Reset Automático del Modo Focus en Beneficios

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-12
> **Proyecto**: landing-linkedin

---

## Objetivo

Desactivar automáticamente el "Focus Mode" (restaurar la visibilidad de las tarjetas) cada vez que el usuario hace scroll hacia una nueva sección o título dentro de la lista de beneficios, asegurando que el contenido por defecto siempre esté visible al cambiar de contexto.

## Por Qué

| Problema | Solución |
|----------|----------|
| El usuario oculta las tarjetas en un slide, hace scroll al siguiente y encuentra la pantalla "vacía" sin el contexto del nuevo beneficio. | Resetear el estado `isCardsVisible` a `true` automáticamente al detectar un cambio de índice en el scroll cinemático. |

**Valor de negocio**: Mejora la experiencia de usuario (UX) al prevenir confusión y asegurar que el usuario siempre lea la propuesta de valor (las tarjetas) de la nueva sección a la que acaba de hacer scroll, maximizando la retención de la información fundamental.

## Qué

### Criterios de Éxito
- [ ] Ocultar tarjetas en la primera sección.
- [ ] Realizar scroll (arriba o abajo) hacia una nueva sección.
- [ ] Confirmar que las tarjetas de la nueva sección aparecen visibles de manera automática.
- [ ] Confirmar que el botón de "Toggle View" vuelve a su estado por defecto (listo para ocultar).

### Comportamiento Esperado
El usuario hace clic en el botón flotante "Toggle View" para ocultar las tarjetas y apreciar el fondo cinemático completo. Al continuar explorando la página haciendo scroll, el componente principal detecta el salto a la siguiente "pantalla" (cambio de índice). En este momento exacto, la interfaz activa de nuevo la visualización de las tarjetas, haciendo que el nuevo contenido aparezca fluidamente, listo para ser leído.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` - Archivo donde se centraliza la lógica (`isCardsVisible` y `handleIndexChange`).
- `src/shared/components/ui/full-screen-scroll-fx.tsx` - Controlador subyacente que emite el evento de cambio de slide (`onIndexChange`).

### Arquitectura Propuesta (Feature-First)
La arquitectura actual se mantiene, la inyección de la lógica es local.
```typescript
// Lógica a incorporar dentro de BenefitsList.tsx
const handleIndexChange = (index: number) => {
  setActiveIndex(index);
  setIsCardsVisible(true); // <--- Inyección del reset de estado
};
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico.

### Fase 1: Sincronización del Estado con el Scroll
**Objetivo**: Enlazar el reseteo del estado lógico de `isCardsVisible` al disparador de cambio de vista (`onIndexChange`) de la sección.
**Validación**: Validación funcional en un explorador web local; probar la interacción ocultando tarjetas y cambiando de slide de manera secuencial.

### Fase 2: Validación Final
**Objetivo**: Confirmar que la transición de estado no causa parpadeos bruscos (flickering) en la animación de Framer Motion.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Integración manual UX validada: Transición fluida.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-12]: Mapeo pre-implementación
- **Definición**: El evento onIndexChange ya existe gracias a previas implementaciones estructurales. Sinergia inmediata disponible.

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] Validar que la forzada de `setIsCardsVisible(true)` no anule o reseteé de forma abrupta las animaciones de `framer-motion` activas en las tarjetas. Deben conservar su flujo original.

## Anti-Patrones

- NO utilizar hooks globales (`useEventListener` en el objeto window) para trackear la posición del scroll y deducir la tarjeta.
- Utilizar exclusivamente la API propia de estado declarativo del componente pasados por callbacks (`handleIndexChange`).

---

*PRP pendiente aprobación. No se ha modificado código.*
