# PRP-015: Synchronized Module Colors for Benefits

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-26
> **Proyecto**: KIA Intelligence

---

## Objetivo

Sincronizar la identidad visual de la landing page extrayendo los esquemas de color de las subpáginas de los módulos (`modulo-page`) y aplicándolos a las tarjetas de la sección `BenefitsList.tsx`. El resultado debe ser una experiencia visual coherente y premium que respete los efectos de glassmorphism y el fondo atmosférico actual.

## Por Qué

| Problema | Solución |
|----------|----------|
| Inconsistencia visual entre la landing principal y las subpáginas de módulos. | Mapear los `hues` y gradientes de los Shaders de los módulos a las tarjetas de beneficios. |
| Los colores actuales de beneficios son genéricos (Tailwind default). | Usar los HSL calculados dinámicamente en los módulos para un look más vibrante y personalizado. |

**Valor de negocio**: Refuerza la autoridad de marca a través de un diseño "pixel-perfect" y cohesivo. Mejora la retención visual mediante transiciones de color más ricas.

## Qué

### Criterios de Éxito
- [ ] Colores de las 3 tarjetas de `BenefitsList` coinciden exactamente con la identidad de los módulos 01 (Vendedor IA), 02 (Landing) y 03 (Dashboard).
- [ ] Se mantiene el efecto de "curtain background" y glassmorphism sin ruido visual.
- [ ] Los "glows" atmosféricos (difuminados traseros) se actualizan para coincidir con el nuevo esquema HSL.
- [ ] No se rompe el efecto de "Fill on Scroll" existente.

### Comportamiento Esperado (Happy Path)
1. El usuario navega por la sección de Resultados Tangibles.
2. Al hacer scroll, las tarjetas se llenan con gradientes vibrantes extraídos de los módulos:
   - **Tarjeta 1 (Independencia)**: Cyan profundo/eléctrico (Module 01: Vendedor IA).
   - **Tarjeta 2 (Filtro)**: Esmeralda vibrante (Module 03: Dashboard).
   - **Tarjeta 3 (Velocidad)**: Violeta/Púrpura premium (Module 02: Landing).
3. Los destellos (glows) se expanden suavemente al entrar en el viewport con el color correspondiente.

---

## Contexto

### Referencias
- `src/features/modulo-page/components/ModuloDifferentiators.tsx` - Fuente de los HSL.
- `src/features/landing-page/components/BenefitsList.tsx` - Target de la implementación.
- `src/shared/lib/modulos-data.ts` - Mapeo de identidad de módulos.

### Mapeo de Colores Detectado

| Módulo | Slug | Hue Base | Color Propuesto (Glow) |
|--------|------|----------|-----------------------|
| 01 | vendedor-ia | 190 (Cyan) | `rgba(6, 182, 212, 0.4)` |
| 02 | landing (03 en BenefitsList) | 280 (Purple) | `rgba(139, 92, 246, 0.4)` |
| 03 | dashboard (02 en BenefitsList)| 150 (Emerald) | `rgba(16, 185, 129, 0.4)` |

---

## Blueprint (Assembly Line)

### Fase 1: Extracción y Mapeo de Tokens
**Objetivo**: Convertir los esquemas de color de `ModuloDifferentiators` en constantes reutilizables para `BenefitsList`.
**Validación**: Definición de objetos de color en `BenefitsList.tsx`.

### Fase 2: Actualización de UI & Gradientes
**Objetivo**: Reemplazar las clases `from-X to-Y` por gradientes HSL inline que permitan mayor fidelidad al diseño de los módulos.
**Validación**: Verificación visual de los colores en los 3 estados de la tarjeta (Base, Active, Glow).

### Fase 3: Refinamiento de Background & Shaders
**Objetivo**: Asegurar que el fondo de la sección `BenefitsList` (curtain effect) armonice con los nuevos acentos.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Inspección visual (Screenshot) confirma cohesión cromática.

---

## Gotchas
- El Shaders original del módulo usa 4 colores. En `BenefitsList` debemos condensarlos en 2 para el gradiente de fondo de la tarjeta para no perder legibilidad del texto.

## Anti-Patrones
- NO usar colores estáticos de Tailwind si el diseño base de los módulos requiere especificidad HSL para la identidad de marca.

---

*PRP pendiente aprobación. No se ha modificado código.*
