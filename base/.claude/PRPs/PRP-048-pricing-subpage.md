# PRP-048: Subpágina de Precios e Integración de Componente de Venta

> **Estado**: APROBADO
> **Fecha**: 2026-04-15
> **Proyecto**: KIA Intelligence

---

## Objetivo

Implementar una nueva subpágina `/precios` que presente la estructura de costos del servicio utilizando un componente premium con animaciones avanzadas, integrada directamente en el menú de navegación global.

## Por Qué

| Problema | Solución |
|----------|----------|
| El usuario no tiene un acceso rápido y claro a la estructura de precios desde la landing. | Una subpágina dedicada con selectores interactivos (Suscripción vs Lifetime y Personal vs Corporate). |
| Falta de visualización dinámica de la oferta. | Integración del componente `PricingSection2` con animaciones de `VerticalCutReveal` y `TimelineContent`. |

**Valor de negocio**: Aumenta la transparencia y facilita la conversión al permitir que los prospectos califiquen su inversión antes de la llamada de venta.

## Qué

### Criterios de Éxito
- [ ] Subpágina `/precios` accesible y funcional con el branding oficial (background shader).
- [ ] Selector de "3 Months vs Forever" y "Personal vs Corporate" calculando precios dinámicamente.
- [ ] Animaciones de entrada sincronizadas con el scroll.
- [ ] Enlace "Precios" añadido al `NavigationDrawer` y `Header`.
- [ ] Responsive design impecable en mobile y desktop.

### Comportamiento Esperado
El usuario hace clic en "Precios" en el menú, navega a `/precios`. Al hacer scroll, los elementos de precio y características aparecen con efectos de "Vertical Cut" y desenfoque. El usuario puede alternar entre las opciones de licencia, viendo cómo el precio cambia con una animación fluida de números.

---

## Contexto

### Referencias
- `src/features/landing-page/components/Header.tsx` - Punto de entrada para el menú.
- `src/features/landing-page/components/NavigationDrawer.tsx` - Navegación global.
- `src/features/transparencia/` - Ejemplo de subpágina con branding consistente.

### Arquitectura Propuesta (Feature-First)
```
src/features/pricing/
├── components/
│   ├── PricingSection.tsx      # Componente principal (pricing-section-1.tsx)
│   └── PricingSwitch.tsx       # Sub-componente de selección
├── types/
│   └── pricing.ts
```

### Componentes UI Reutilizables
- `src/shared/components/ui/vertical-cut-reveal.tsx` [NEW]
- `src/shared/components/ui/timeline-animation.tsx` [NEW - Mock/Basic implementation needed]

---

## Blueprint (Assembly Line)

### Fase 1: Infraestructura y Dependencias
**Objetivo**: Instalar librerías necesarias y registrar los componentes base.
**Validación**: `npm install @number-flow/react` exitoso y componentes UI creados sin errores de tipos.

### Fase 2: Implementación de la Feature de Precios
**Objetivo**: Crear la lógica de la feature y el componente de precios.
**Validación**: El componente calcula correctamente los 4 estados de precio (98, 400, 159, 650).

### Fase 3: Ruta e Integración de Navegación
**Objetivo**: Crear la página en `app/precios` y añadirla al menú global.
**Validación**: Navegación fluida entre Home y Precios.

### Fase 4: Pulido Estético y Validación Visual
**Objetivo**: Asegurar que el background shader y los colores coincidan con el branding.
**Validación**: Screenshot con Playwright comparando con el branding de `PasSection`.

---

## 🧠 Aprendizajes (Self-Annealing)

### [2026-04-15]: Dependencia de TimelineContent
- **Error**: El componente proporcionado utiliza `TimelineContent` de `@/components/ui/timeline-animation`, el cual no existe originalmente en el repo.
- **Fix**: Se implementará una versión ligera de `TimelineContent` que herede la lógica de `framer-motion` para mantener la compatibilidad con el código proporcionado.

---

## Gotchas
- El componente proporcionado usa `motion/react` (Framer Motion v12), asegurar que la versión instalada es compatible.
- El background en `/precios` debe usar `ShaderBackground` para coherencia visual.

## Anti-Patrones
- No hardcodear el background, usar el sistema de tokens de `BUSINESS_LOGIC.md`.

---

*PRP pendiente aprobación. No se ha modificado código.*
