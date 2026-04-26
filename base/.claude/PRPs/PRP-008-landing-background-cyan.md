# PRP-008: Landing Page Background Customization (Cyan Theme)

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-22
> **Proyecto**: AI Sales Infra

---

## Objetivo

Sustituir la tonalidad azul sólida predominante en el fondo dinámico de la landing page (`GlassRefractionBackground`) por la paleta "Celeste/Cyan" (Hue 190) extraída de las tarjetas dinámicas del módulo `vendedor-ia`, unificando así la identidad visual de la página principal en torno al acento de marca primario (`text-accent-cyan`).

## Por Qué

| Problema | Solución |
|----------|----------|
| El fondo derefracción global empleaba azules genéricos (`#0367FE`, `#0A1DCB`) que desentonaban con los brillos del nuevo sistema Glassmorphism de las tarjetas de los módulos (las cuales usan colores cyan nativos definidos en `BRANDING.md`). | Mapear la lógica de colorimetría para usar la triada de Cyan (Hue ~190) en todos los "blobs" animados que conforman la iluminación de fondo del Glass Refraction. |

**Valor de negocio**: Refuerza la identidad única de marca. Elimina la estética "Template genérico azul" y posiciona la visual visual en el territorio del diseño exclusivo _Apple-Style / Cyber_.

## Qué

### Criterios de Éxito
- [ ] Extraer los equivalentes Hex/RGB del `Hue 190` usado en los WebGL Shaders del módulo 1.
- [ ] Modificar los 5 `motion.div` de `glass-refraction-background.tsx`.
- [ ] Blobs principales adoptarán degradados cyan (`#06b6d4` a `#0891b2`).
- [ ] El aura central se iluminará con sombra `rgba(6,182,212,0.4)`.

### Comportamiento Esperado
Al entrar al inicio, el usuario experimentará un fondo oscuro con refracciones y faros de luz de tono celeste moviéndose lentamente, igualando la estética exacta de las luces emitidas por los diferenciadores del Vendedor IA.

---

## Blueprint (Assembly Line)

### Fase 1: Identificación de Colorimetría
**Objetivo**: Obtener códigos exactos.
**Lograda**: Transformaciones calculadas:
- Tailwind `cyan-500` -> `#06b6d4` (Hue 190)
- Tailwind `cyan-600` -> `#0891b2`
- Tailwind `sky-500` -> `#0ea5e9`

### Fase 2: Ejecución de Inyección
**Objetivo**: Modificar los estilos `radial-gradient` quemados en `glass-refraction-background.tsx`.
**Validación**: Chunks reemplazando los códigos `#0A1DCB`, `#0367FE` y `rgba(59, 130, 246)` por las variables extraídas.

### Fase 3: Validación Final
- [x] `npm run typecheck`
- [x] Confirmación visual humana

---
*PRP ejecutado exitosamente.*
