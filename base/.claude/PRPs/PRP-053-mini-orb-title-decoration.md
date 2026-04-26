# PRP-053: Mini-Orbe de Marca en el Título

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence

---

## Objetivo

Sustituir el icono de destello (`Sparkles`) situado junto al título "KIA Assistant" en el encabezado del `ChatDrawer` por una versión en miniatura del `PulsingOrb`.

## Por Qué

| Problema | Solución |
|----------|----------|
| El icono `Sparkles` es genérico y no pertenece al lenguaje visual de KIA. | Unificar la estética: todo lo que "brilla" en KIA es un orbe de color. |

## Qué

### Criterios de Éxito
- [ ] Reemplazar `<Sparkles />` por `<PulsingOrb size={16} showText={false} />`.
- [ ] Asegurar alineación visual con el texto del título.

---

## Blueprint

### Fase 1: Implementación
- Editar `ChatDrawer.tsx`.
- Ajustar `size` y `gap`.

### Fase 2: Validación
- Verificar renderizado de shaders en tamaño reducido.
