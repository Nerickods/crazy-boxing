# PRP-030: GSAP-BenefitsList Mobile Optimization

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-30
> **Proyecto**: KIA Intelligence

---

## Objetivo

Corregir la invisibilidad del contenido (títulos y descripciones) en dispositivos móviles para la sección `BenefitsList`. El objetivo es alinear las media queries con la nueva arquitectura "Stacked" y asegurar que la jerarquía visual sea legible y equilibrada en pantallas pequeñas.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las media queries heredadas de la versión anterior fuerzan `height: auto` y `grid-columns`, lo que colapsa el contenedor flex-centrado en mobile. | Eliminar reglas conflictivas y mantener la estructura flex-centered con `height: 100%`. |
| Tipografía demasiado grande para mobile puede causar desbordamiento o clipping. | Calibrar `clamp()` y márgenes laterales para asegurar que el mensaje quepa en anchos de 375px+. |

---

## Contexto

### Síntomas Detectados
- En mobile (Safari/Chrome), las imágenes de fondo cargan pero el texto central desaparece.
- El contenedor `.fx-content` parece colapsar a 0px de altura debido al `height: auto` y la falta de contenido estático (todo es `position: absolute`).

---

## Blueprint (Bucle Agéntico)

### FASE 1: Limpieza de Legacy CSS
**Objetivo**: Eliminar todas las referencias a `.fx-left`, `.fx-right` y layouts de grid en las media queries.
**Acción**: Limpiar el bloque `@media (max-width: 900px)`.

### FASE 2: Estabilización de Contenedores Mobile
**Objetivo**: Forzar que `.fx-content` y `.fx-center` ocupen el 100% de la altura del viewport fijado.
**Acción**: Garantizar `height: 100%` y `min-height: 100%` en mobile.

### FASE 3: Calibración Visual Mobile
**Objetivo**: Ajustar paddings y tamaños de fuente para que el diseño se sienta "Premium" en mobile.
**Acción**: Ajustar `fx-featured-title` y `fx-featured-desc` verticalmente.

### FASE 4: Validación Visual Browser
- [ ] Screenshot móvil capturado.
- [ ] Título visible y centrado.
- [ ] Descripción legible.
- [ ] Fondo visible.

---

## Gotchas
- [ ] El `header` de la landing puede tapar el título si no se maneja bien el padding superior en mobile.

---

*PRP pendiente aprobación por Nerick Segoviano.*
