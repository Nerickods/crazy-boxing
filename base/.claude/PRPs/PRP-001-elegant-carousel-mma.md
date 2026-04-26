# PRP-001: Implementación de ElegantCarousel en MMA Academy

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-17
> **Proyecto**: KIA Intelligence

---

## Objetivo

Integrar un componente de carrusel premium (`ElegantCarousel`) en la subpágina de caso de estudio de MMA Academy para visualizar las etapas del proceso de "Mutación Operativa" con una estética de alto impacto.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las etapas del proceso se muestran actualmente de forma estática y textual, lo que reduce el impacto visual del caso de estudio de "élite". | Implementar un carrusel interactivo con transiciones suaves, gradientes dinámicos y narrativa visual que refuerce la autoridad de la marca. |

**Valor de negocio**: Mejora la retención del usuario en la página de caso de estudio y refuerza la percepción de "tecnología de élite", aumentando la probabilidad de conversión (enrollment).

## Qué

### Criterios de Éxito
- [ ] Componente `ElegantCarousel` creado y funcional en `src/components/ui/elegant-carousel.tsx`.
- [ ] Contenido adaptado de `mma-academy.ts` (Fase 01, 02, 03).
- [ ] Integración de imágenes de alta calidad vía Unsplash (MMA/Technology).
- [ ] Responsividad total (Mobile/Desktop) con soporte touch.
- [ ] Estética alineada con el branding (Cyan/Emerald, Hex: `#06b6d4`, `#10b981`).

### Comportamiento Esperado
El carrusel ciclará automáticamente entre las 3 fases del proyecto cada 6 segundos. El usuario podrá navegar manualmente usando flechas o indicadores de progreso. Cada transición mostrará un lavado de color (accent wash) y animaciones de entrada para el texto e imagen.

---

## Contexto

### Referencias
- `src/features/portfolio/data/mma-academy.ts` - Fuente de datos de las fases.
- `src/app/(main)/casostudy/mma-academy/page.tsx` - Página destino.
- `src/components/ui/carousel.tsx` - Patrón de carrusel existente (Shadcn-like).

### Arquitectura Propuesta
- `src/components/ui/elegant-carousel.tsx` - El nuevo componente base.
- Adaptación de estilos a Tailwind CSS para mantener consistencia con el proyecto y evitar `index.css` externo si es posible.

---

## Blueprint (Assembly Line)

### Fase 1: Preparación de Activos y Estilos
**Objetivo**: Definir los datos de las fases y preparar los estilos base en Tailwind/CSS.
**Validación**: Archivo de tipos y datos locales listos para el componente.

### Fase 2: Implementación Técnica del Componente
**Objetivo**: Crear el componente `ElegantCarousel.tsx` con la lógica de transición, progreso y navegación.
**Validación**: El componente renderiza correctamente los datos y responde a eventos de usuario.

### Fase 3: Integración en MMA Academy
**Objetivo**: Sustituir o complementar `CaseStudyProcess` con el nuevo carrusel en la página del caso de estudio.
**Validación**: Navegación a `/casostudy/mma-academy` muestra el carrusel funcional y estéticamente impecable.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end sin regresiones.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Verificación visual en diferentes viewports.

---

## Gotchas
- El componente original usa una importación de `../../index.css`. Debemos migrar estos estilos a Tailwind o agregarlos de forma segura a `globals.css` para evitar romper el encapsulamiento.
- Las imágenes de Unsplash deben ser seleccionadas cuidadosamente para que coincidan con la estética "Dark-First" y "Glassmorphism" del proyecto.

## Anti-Patrones
- NO usar `any` en los tipos de datos del carrusel.
- NO hardcodear los estilos si pueden ser utilidades de Tailwind.

---

*PRP pendiente aprobación. No se ha modificado código.*
