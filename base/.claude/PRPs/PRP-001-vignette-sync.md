# PRP-001: Gradientes Dinámicos en BenefitsList (Vignette Sync)

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-22
> **Proyecto**: landing-linkedin

---

## Objetivo

Sincronizar la visibilidad de los gradientes de desvanecimiento oscuro (vignette vertical) con el estado del botón "Ocultar Tarjetas" (`isCardsVisible`) en la sección de beneficios. El objetivo es que cuando el usuario entre en "Focus Mode" (tarjetas ocultas), los gradientes también se desvanezcan para permitir una vista limpia y total del fondo.

## Por Qué

| Problema | Solución |
|----------|----------|
| En "Focus Mode", los gradientes superiores e inferiores siguen presentes, oscureciendo parte de la imagen de fondo que el usuario desea ver con claridad. | Vincular la opacidad de los gradientes al estado `isCardsVisible`, permitiendo que desaparezcan suavemente cuando las tarjetas se ocultan. |

**Valor de negocio**: Mejora la experiencia estética y la coherencia de la funcionalidad "Focus Mode", reforzando la sensación de control y calidad cinematográfica del producto.

## Qué

### Criterios de Éxito
- [ ] Los gradientes desaparecen cuando `isCardsVisible` es `false`.
- [ ] Los gradientes reaparecen cuando `isCardsVisible` es `true`.
- [ ] La transición de visibilidad es suave (mínimo 500ms de duración).
- [ ] No se rompe la interactividad del botón de toggle.

### Comportamiento Esperado
1. El usuario hace clic en el botón de "Ojo" (Toggle).
2. Las tarjetas se desvanecen (lógica actual).
3. Simultáneamente, los gradientes oscuros superior e inferior se desvanecen gradualmente hasta ser transparentes.
4. Al volver a activar el modo tarjetas, tanto las tarjetas como los gradientes regresan a su estado original.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` - Archivo principal a modificar.
- Estado `isCardsVisible` (useState) - Controlador de la visibilidad.

### Arquitectura Propuesta
Modificación directa en el componente `BenefitsList.tsx` dentro de `src/features/landing-page/components/`.

---

## Blueprint (Assembly Line)

### Fase 1: Mapeo de Clases Dinámicas
**Objetivo**: Identificar los 3 puntos de inyección de gradientes y preparar las clases de Tailwind dinámicas usando `cn()`.
**Validación**: Las clases se compilan correctamente y el estado `isCardsVisible` llega a los contenedores de fondo.

### Fase 2: Implementación de Transiciones
**Objetivo**: Aplicar las clases `transition-opacity` y condicionar la opacidad (`opacity-0` vs `opacity-100`) basándose en `isCardsVisible`.
**Validación**: Verificación visual de que el desvanecimiento ocurre en sincronía con las tarjetas.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando end-to-end sin regresiones.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] El botón de toggle funciona correctamente en todas las pestañas.
- [ ] Los gradientes se ocultan en las 3 secciones (Lander, IA, CRM).

---

## Gotchas
- El primer slide usa `z-[2]` para los gradientes, los otros no. Mantener esta consistencia.
- Asegurar que `pointer-events-none` esté presente para no bloquear clics accidentales en el fondo.

---

*PRP pendiente aprobación. No se ha modificado código.*
