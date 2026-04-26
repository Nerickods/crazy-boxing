# PRP-018: Continuidad Visual PasSection → ProcessSection

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-03
> **Proyecto**: KIA Intelligence

---

## Objetivo

Eliminar el desvanecimiento (fade-out) del Logo y el CTA al final de la `PasSection`, permitiendo que estos elementos permanezcan visibles y se desplacen naturalmente hacia afuera de la pantalla al entrar en la `ProcessSection`.

## Por Qué

| Problema | Solución |
|----------|----------|
| El contenido final de PasSection desaparece repentinamente antes de que la sección termine de desplazarse. | Mantener la opacidad en 1 al final del scroll para que el contenido "suba" con el contenedor. |
| Sensación de "parpadeo" o vacío visual entre secciones críticas de conversión. | Crear una transición fluida donde el footer de una sección empuja el contenido de la siguiente sin saltos. |

**Valor de negocio**: Mejora la retención visual en el punto más alto de intención (CTA) y refuerza la percepción de fluidez premium (estilo Apple).

## Qué

### Criterios de Éxito
- [ ] El Logo (KIA Intelligence) mantiene opacidad 1.0 al llegar al final del scroll de PasSection.
- [ ] El botón CTA "HABLAR CON EL SISTEMA" mantiene opacidad 1.0 al final del scroll.
- [ ] Los elementos finales no desaparecen antes de que la `ProcessSection` los cubra o los desplace.

### Comportamiento Esperado
Cuando el usuario llega al final del scroll de la `PasSection` (progress ~1.0), el contenido final (Logo + CTA) se mantiene estático en su posición final. Al seguir haciendo scroll, la sección entera (incluyendo estos elementos) se desplaza hacia arriba con el flujo natural de la página, revelando la `ProcessSection`.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Componente a modificar.
- `src/features/landing-page/components/ProcessSection.tsx` - Sección siguiente que entra en juego.

### Arquitectura Propuesta
No se requieren archivos nuevos, solo ajustes en los hooks de `framer-motion` dentro de `PasSection.tsx`.

---

## Blueprint (Assembly Line)

### Fase 1: Ajuste de Opacidades y Transformaciones
**Objetivo**: Modificar los rangos de `useTransform` para evitar el fade-out al final del scroll.
**Validación**: Revisar que `sectionOpacity` y `LogoBrandFlow` terminen en `1` en lugar de `0`.

### Fase 2: Sincronización de Y-Translations
**Objetivo**: Asegurar que las posiciones relativas (y) del Logo y el CTA sean consistentes al final de la animación para que no se separen de forma extraña.
**Validación**: Revisión estática del código para confirmar rangos `[..., 1.0]`.

### Fase 3: Resolución de Gaps (Opcional)
**Objetivo**: Verificar si el `SectionSeparator` en `ProcessSection` genera algún gap visual con el contenido persistente de `PasSection`.
**Validación**: Inspección de márgenes y paddings entre secciones.

---

## Gotchas

- [ ] La `sectionOpacity` se aplica a todo el wrapper. Al dejarla en 1, los elementos de fondo (glows) también podrían persistir; debemos verificar si esto ensucia la entrada de la siguiente sección.
- [ ] El `LogoBrandFlow` tiene su propio control de opacidad interno que debe ser sincronizado.

## Anti-Patrones

- NO usar estados de React para animaciones basadas en scroll si `framer-motion` puede manejarlo de forma declarativa.

---

*PRP pendiente aprobación. No se ha modificado código.*
