# PRP-003: Animated Glassy Pricing — Sección de Precios KIA Intelligence

> **Estado**: PENDIENTE  
> **Fecha**: 2026-04-23  
> **Proyecto**: KIA Intelligence (landing-linkedin)

---

## Objetivo

Reemplazar el componente `PricingSection.tsx` actual (genérico, enfocado en un solo plan SaaS tipo "kit de diseño") por una sección de precios de élite con tres cards glassmorphism animadas WebGL, alineada al branding dark/cyan de KIA Intelligence y los paquetes reales de la oferta Gran Slam: **Básico, Premium y Élite**.

## Por Qué

| Problema | Solución |
|----------|----------|
| La sección de precios actual muestra lógica de un producto genérico (kits Figma, licencias corporativas) desconectada de la propuesta de valor real de KIA Intelligence | Reemplazarla con las tres ofertas reales: Básico ($1,000), Premium ($1,900) y Élite (Cotización) |
| El diseño actual tiene un fondo animado Warp + toggle switches que comunica un producto tipo "toolkit", no un servicio de desarrollo artesanal premium | El nuevo diseño usa glassmorphism con shader WebGL de anillos luminosos que comunica exclusividad tecnológica |
| Las cards no reflejan el branding dark/cyan de KIA Intelligence | Adaptar el componente `animated-glassy-pricing` al dark mode absoluto + acento `accent-cyan` del design system |
| Los botones usarán `RippleButton` (nueva dependencia) que necesita instalarse en `/components/ui` | Crear `multi-type-ripple-buttons.tsx` en `/components/ui` como dependencia de la card de precios |

**Valor de negocio**: La sección de precios es el momento de decisión más crítico del funnel. Un diseño que comunica el tier de los paquetes y el posicionamiento artesanal aumenta la conversión y reduce la fricción al precio.

## Qué

### Criterios de Éxito
- [ ] `src/components/ui/animated-glassy-pricing.tsx` creado y funcional
- [ ] `src/components/ui/multi-type-ripple-buttons.tsx` creado como dependencia
- [ ] `PricingSection.tsx` reemplazado completamente usando `ModernPricingPage`
- [ ] Tres planes reales de KIA Intelligence: **Básico ($1,000)**, **Premium ($1,900)**, **Élite (Cotización)**
- [ ] Fondo WebGL `ShaderCanvas` desactivado (`showAnimatedBackground={false}`)
- [ ] Card "Popular" es **Premium** con badge `Más Popular`
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso

### Comportamiento Esperado
El usuario navega a `/precios` y ve tres cards glassmorphism flotando sobre el dark background del `GlassRefractionBackground` existente. La card central (Premium) aparece escalada con borde luminoso `accent-cyan`. Cada card muestra: nombre del plan, descripción, precio, lista de beneficios con checkmarks cyan, y un `RippleButton` CTA. Los botones Básico y Élite tienen variante `secondary` (glass); Premium tiene variante `primary` (accent-cyan sólido).

---

## Contexto

### Referencias
- `src/features/pricing/components/PricingSection.tsx` — Componente a reemplazar (406 líneas, actualmente genérico)
- `src/features/pricing/components/TransparencyConsolidation.tsx` — Se **conserva** sin cambios
- `src/app/(main)/precios/page.tsx` — Ruta que importa ambos componentes, se mantiene igual
- `src/components/ui/glass-refraction-background.tsx` — Background actual de la página, **NO reemplazar**
- `.docs/BRANDING.md` — Dark mode absoluto, acento cyan, glassmorphism
- `.docs/GRAN-SLAM-OFFER.md` — Los 3 paquetes, precios, features incluidas por plan

### Arquitectura de Archivos

```
src/
├── components/ui/
│   ├── animated-glassy-pricing.tsx      [NEW] Componente pricing glassmorphism
│   └── multi-type-ripple-buttons.tsx    [NEW] Dependencia: RippleButton
│
└── features/pricing/components/
    └── PricingSection.tsx               [MODIFY] Reemplazo completo del contenido
```

### Datos de los Planes (GRAN-SLAM-OFFER.md — Bloque 3.2)

| Plan | Precio | Badge | CTA Variant |
|------|--------|-------|-------------|
| Básico | $1,000 USD | — | secondary |
| Premium | $1,900 USD | Más Popular | primary |
| Élite | Cotización | — | secondary |

**Features Básico ($1,000)**:
- Landing Page CEO (Apple-Style, branding completo)
- Copywriting y arquitectura de conversión
- 3 sesiones de trabajo · 15 días
- Soporte técnico 1er mes (Garantía de Funcionamiento)
- Revisión de entregables

**Features Premium ($1,900)**:
- Todo lo de Básico
- Agente IA "Vendedor 24/7" (entrenado con lógica del negocio)
- Dashboard CRM Privado (gestión de leads en tiempo real)
- Soporte por WhatsApp durante el proyecto

**Features Élite (Cotización personalizada)**:
- Todo lo de Premium
- Automatizaciones a medida según necesidades del negocio
- Duración y sesiones a definir
- Atención al estándar más alto de la industria

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase.

### Fase 1: Instalar Dependencias UI
**Objetivo**: Crear `multi-type-ripple-buttons.tsx` en `src/components/ui/` con el código exacto proporcionado.  
**Validación**: El archivo existe sin errores de TypeScript.

### Fase 2: Crear y Adaptar `animated-glassy-pricing.tsx`
**Objetivo**: Copiar el componente a `src/components/ui/` y adaptar:
1. Hacer el campo `price` de tipo `string` en `PricingCardProps` para soportar "Cotización"
2. Reemplazar texto hardcoded: "Most Popular" → "Más Popular", "/mo" → "/USD"
3. Ajustar colores: `bg-cyan-400` → compatible con `accent-cyan` del proyecto
4. El dark mode ya es el default del proyecto (class `dark` no se usa explícitamente)  
**Validación**: Importación sin errores de tipos.

### Fase 3: Reemplazar PricingSection.tsx
**Objetivo**: Reescribir `PricingSection.tsx` usando `ModernPricingPage` con:
- Los 3 planes reales extraídos del GRAN-SLAM-OFFER.md
- `showAnimatedBackground={false}`
- Mantener el mismo `export default PricingSection` para que `precios/page.tsx` no cambie
- Copy del título alineado con COPYWRITING.md ("Autoridad Elite", directo, sin jerga)  
**Validación**: La página `/precios` compila y muestra las 3 cards.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.  
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Screenshot visual de `/precios` muestra las 3 cards glassmorphism

---

## 🧠 Aprendizajes (Self-Annealing)

*(Vacío — se actualiza durante la ejecución)*

---

## Gotchas

> Críticos ANTES de implementar

- [ ] **Tailwind 3, NO Tailwind 4**: El proyecto usa `@tailwind base/components/utilities` en globals.css. El bloque CSS de las instrucciones usa sintaxis Tailwind 4 (`@import "tailwindcss"`). NO agregar ese bloque — solo añadir las custom properties CSS necesarias (`--button-ripple-color`) al `globals.css` existente.
- [ ] **ShaderCanvas OFF**: `showAnimatedBackground={false}` — el `GlassRefractionBackground` de la página ya provee el fondo visual.
- [ ] **`accent-cyan` custom**: Verificar en `tailwind.config.js` cómo está definido el color `accent-cyan` para usarlo correctamente en el componente (puede ser como extend color o como variable CSS).
- [ ] **Plan Élite sin precio fijo**: Cambiar `price: string` en `PricingCardProps` (no `number`) y mostrar "A cotizar" en lugar del bloque `$price /USD`.
- [ ] **`"use client"` obligatorio**: `animated-glassy-pricing.tsx` y `multi-type-ripple-buttons.tsx` usan hooks de React — requieren directive `"use client"` en la primera línea.
- [ ] **No modificar `TransparencyConsolidation.tsx`** — se conserva íntegro.

## Anti-Patrones

- NO dejar `ShaderCanvas` activo — conflicto con `GlassRefractionBackground`
- NO usar `any` en TypeScript
- NO mezclar estilos light mode — este proyecto es dark mode absoluto
- NO modificar `TransparencyConsolidation.tsx` ni `precios/page.tsx`

---

*PRP pendiente aprobación. No se ha modificado código.*
