# PRP-049: Unificación de Precios y Transparencia

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-15
> **Proyecto**: KIA Intelligence

---

## Objetivo

Unificar el contenido estratégico de la página de Transparencia (Filosofía de Autor, Scarcity, Roadmap) dentro de la nueva subpágina de Precios, eliminando la redundancia y centralizando la autoridad en una sola ruta de alto impacto.

## Por Qué

| Problema | Solución |
|----------|----------|
| Dispersión de información crítica (Precios vs Por qué esos precios). | Unificar el "Qué" (Precios) con el "Cómo y Por Qué" (Filosofía de Autor/Scarcity). |
| Fricción en el usuario al navegar entre subpáginas para entender la política. | Una única scroll-page que lleva al usuario desde la inversión hasta la confianza técnica. |

**Valor de negocio**: Aumento de la tasa de conversión al respaldar los precios con argumentos de autoridad y escasez inmediata en la misma vista.

## Qué

### Criterios de Éxito
- [ ] Todo el contenido vital de `/transparencia` migrado a `/precios`.
- [ ] Nueva sección de Transparencia/Autoridad ubicada después de los precios.
- [ ] Ruta `/transparencia` eliminada sin dejar referencias rotas.
- [ ] Menús de navegación actualizados (Header/NavigationDrawer/Footer).

### Comportamiento Esperado
El usuario entra a `/precios`, ve primero las opciones de inversión (Cards). Al hacer scroll, encuentra la sección de **"Arquitectura de Autor"** que explica el límite de 2 proyectos por mes y el roadmap de precios (incremento de Mayo), reforzando la urgencia de compra.

---

## Contexto

### Referencias
- `src/features/transparencia/` - Fuente de contenido original.
- `src/features/pricing/` - Destino de la consolidación.

### Arquitectura Propuesta (Feature-First)
```
src/features/pricing/
├── components/
│   ├── PricingSection.tsx (Existente)
│   └── TransparencyConsolidation.tsx (NUEVO - Migrado)
```

---

## Blueprint (Assembly Line)

### Fase 1: Creación del Componente de Consolidación
**Objetivo**: Crear `TransparencyConsolidation.tsx` integrando `TransparencyHeader` y `PricingRoadmap`.
**Validación**: El componente se visualiza correctamente de forma aislada.

### Fase 2: Integración en Ruta de Precios
**Objetivo**: Añadir la sección de transparencia debajo de la sección de precios en `src/app/(main)/precios/page.tsx`.
**Validación**: Scroll fluido entre ambas secciones manteniendo el `GlassRefractionBackground`.

### Fase 3: Limpieza y Redirección
**Objetivo**: Eliminar rutas y componentes de `transparencia`, actualizar links en Header/Footer.
**Validación**: No hay errores de compilación (`typecheck` limpio).

### Fase 4: Validación Final
**Objetivo**: UX unificada y coherente.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Estilo visual consistente con `services`.

---

## Gotchas
- Los estilos de `transparencia` usaban `emerald-500` por defecto; ajustar para mantener el `accent-cyan` de la landing principal si es necesario, o mantener el esmeralda para denotar "seguridad/política".

## Anti-Patrones
- NO duplicar código; mover la lógica de roadmap a la feature de precios y eliminar la antigua.

---

*PRP pendiente aprobación por el usuario.*
