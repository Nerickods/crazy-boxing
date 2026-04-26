# PRP-007: Tarjetas de Shaders Dinámicos por Módulo

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-22
> **Proyecto**: AI Sales Infra

---

## Objetivo

Reemplazar el diseño actual de tarjetas "Glassmorphism" estáticas en la sección de Diferenciadores por tarjetas inmersivas interactivas utilizando shaders WebGL (a través de `@paper-design/shaders-react`). Además, asignar una identidad de color única a cada módulo, donde sus tarjetas emitan diferentes tonalidades y patrones de shader (ej. Módulo 1 en tonos Cyan/Celestes, Módulo 2 en Púrpuras, etc).

## Por Qué

| Problema | Solución |
|----------|----------|
| Las tarjetas actuales, aunque funcionales, comparten la misma estética en todas las subpáginas, perdiendo la oportunidad de diferenciar la personalidad de cada servicio (IA, Analítica, Integración). | Integrar `Warp` component de `paper-design` implementando un paletizado dinámico. Cada módulo pasará un "Hue" o paleta base al componente, garantizando un efecto visual memorable y una navegación diferenciada. |

**Valor de negocio**: Refuerza agresivamente el "Apple-Style" y el "Premium Feel" solicitado en los lineamientos de marca (`BRANDING.md`). Aumenta radicalmente el *Time On Page* por la interactividad visual de los shaders.

## Qué

### Criterios de Éxito
- [ ] Se añade `@paper-design/shaders-react` a las dependencias.
- [ ] Se refactoriza/reemplaza `ModuloDifferentiators.tsx` o se crea `ShaderDifferentiators.tsx`.
- [ ] El componente mapea correctamente los iconos de `lucide-react`.
- [ ] Se implementa lógica de generación de paletas condicional basadas en el ID/Slug del módulo (ej: Vendedor IA = Celeste, Dashboard = Verde, Conectividad = Naranja, Landing = Púrpura).
- [ ] Responsividad total (Mobile First, Desktop).

### Comportamiento Esperado
1. El usuario hace scroll hacia los diferenciadores de un módulo.
2. Cada una de las 6 tarjetas contiene en su interior un canvas WebGL animado con distorsiones y patrones de fluidos.
3. El color primario del fluido cambia radicalmente dependiendo en qué subpágina/módulo te encuentres.

---

## Blueprint (Assembly Line)

### Fase 1: Setup e Infraestructura
**Objetivo**: Instalar dependencias necesarias.
**Validación**: `npm install @paper-design/shaders-react` ejecutado exitosamente.

### Fase 2: Desarrollo del Componente
**Objetivo**: Homologar el código crudo proveído al stack actual.
**Tareas**:
- Mover el snippet a `src/features/modulo-page/components/ModuloShaderCards.tsx` (o reemplazar el anterior).
- Reemplazar los SVGs crudos del propuesto por nuestros íconos de `lucide-react` atados a la Data de `modulos-data.ts`.
- Inyectar una función `getModuleTheme(slug)` que retorne el Hue/Saturación base y modifique las paletas de `getShaderConfig`.

### Fase 3: Integración y Data Layer Refactor
**Objetivo**: Enchufar el componente al layout general.
**Tareas**:
- Modificar `src/app/(main)/modulos/[slug]/page.tsx` para pasarle el `slug` o un `themeColor` al componente de tarjetas.

### Fase 4: Validación Final
**Validación**:
- [x] `npm run typecheck` y linter pasan sin problemas (especialmente con los typings de la librería externa).
- [x] UI Visual test pasa revisando cada uno de los 4 módulos (Manual).

---
*PRP ejecutado y blindado exitosamente.*
