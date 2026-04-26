# PRP-065: Sistema de Tarjetas Premium GlowingEffect — KIA Intelligence

> **Estado**: PENDIENTE DE APROBACIÓN
> **Fecha**: 2026-04-24
> **Proyecto**: landing-linkedin (KIA Intelligence)
> **Referencia**: Portado desde `/home/nerick_ods/solutions/perfil`

---

## 🎯 Objetivo

Unificar la identidad visual de **KIA Intelligence** implementando el sistema de tarjetas "Glowing Glass" (borde animado magnético) en todo el ecosistema web. Esto incluye la landing page principal, la ruta de `/precios` y la sección de `/casostudy`.

El objetivo es elevar la percepción de marca a un nivel "Apple-Style / Premium Cinematic" mediante micro-interacciones de alta fidelidad.

---

## 🏗️ Arquitectura del Sistema de Tarjetas

El estilo premium se basa en un patrón de tres capas para crear el efecto de anillo luminoso:

1.  **Outer Wrapper**: Define el radio exterior (`rounded-[1.5rem]`), el padding (`p-2`) y el borde base.
2.  **GlowingEffect**: Componente `use client` que dibuja el arco de luz dinámico siguiendo el cursor (usando variables CSS y `framer-motion`/`motion`).
3.  **Inner Container**: El contenedor del contenido real con un radio menor (`rounded-xl`), fondo `bg-slate-950/50` y `backdrop-blur`.

---

## 🛠️ Propuesta de Cambios

### 1. Infraestructura Compartida

#### [NEW] [glowing-effect.tsx](file:///\\wsl.localhost\Ubuntu\home\nerick_ods\solutions\landing-linkedin\src\components\ui\glowing-effect.tsx)
Portaremos el componente desde `/perfil`, adaptando los imports a la estructura de este proyecto (`@/lib/utils` para `cn`) y asegurando compatibilidad con `framer-motion` v12.

#### [NEW] [GlassCard.tsx](file:///\\wsl.localhost\Ubuntu\home\nerick_ods\solutions\landing-linkedin\src\shared\components\GlassCard.tsx)
Crearemos un wrapper reutilizable para evitar repetir la lógica de las 3 capas en cada sección.

```tsx
interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'emerald' | 'white';
  className?: string;
  innerClassName?: string;
}
```

### 2. Componentes a Refactorizar

| Prioridad | Sección | Archivo | Cambio |
|-----------|---------|---------|--------|
| **CRÍTICO** | **WhyMeSection** | [WhyMeSection.tsx](file:///\\wsl.localhost\Ubuntu\home\nerick_ods\solutions\landing-linkedin\src\features\landing-page\components\WhyMeSection.tsx) | Reemplazar el contenedor de `DIFFERENTIATORS` por `GlassCard`. |
| **ALTA** | **Pricing** | [animated-glassy-pricing.tsx](file:///\\wsl.localhost\Ubuntu\home\nerick_ods\solutions\landing-linkedin\src\components\ui\animated-glassy-pricing.tsx) | Integrar el efecto en las 3 tarjetas de planes. |
| **ALTA** | **Benefits** | [BenefitsList.tsx](file:///\\wsl.localhost\Ubuntu\home\nerick_ods\solutions\landing-linkedin\src\features\landing-page\components\BenefitsList.tsx) | Envolver `FeatureCard` (expandible) en el patrón Glowing. |
| **MEDIA** | **Authority** | [AuthorityGuide.tsx](file:///\\wsl.localhost\Ubuntu\home\nerick_ods\solutions\landing-linkedin\src\features\landing-page\components\AuthorityGuide.tsx) | Aplicar el efecto a la foto del fundador y tarjetas de arsenal. |
| **MEDIA** | **Case Study** | [StitchMmaProblemGrid.tsx](file:///\\wsl.localhost\Ubuntu\home\nerick_ods\solutions\landing-linkedin\src\features\portfolio\components\StitchMmaProblemGrid.tsx) | Aplicar a las tarjetas de Problema/Solución. |

---

## 🚀 Plan de Ejecución

### Fase 1: Core (Infraestructura)
- [ ] Instalar dependencia `motion` (si es necesario para compatibilidad exacta con el snippet de `/perfil`).
- [ ] Implementar `src/components/ui/glowing-effect.tsx`.
- [ ] Implementar `src/shared/components/GlassCard.tsx`.

### Fase 2: Implementación Visual
- [ ] Refactorizar `WhyMeSection` (Landing).
- [ ] Refactorizar `BenefitsList` (Landing).
- [ ] Refactorizar `AuthorityGuide` (Landing).
- [ ] Refactorizar `PricingSection` (/precios).
- [ ] Refactorizar `CaseStudy` (/casostudy).

### Fase 3: Optimización Mobile
- [ ] Configurar el prop `disabled` en `GlowingEffect` para desactivar el tracking del mouse en dispositivos táctiles, manteniendo un borde estático elegante.

---

## 🧪 Plan de Verificación

### Manual
- [ ] **Desktop**: Verificar que el borde luminoso sigue el cursor de forma fluida (sin lag).
- [ ] **Mobile**: Verificar que las tarjetas se ven correctamente y no hay caída de FPS al hacer scroll.
- [ ] **Accesibilidad**: Asegurar que los clicks en las tarjetas (especialmente en `BenefitsList` expandible) siguen funcionando perfectamente.

### Automatizado
- [ ] `npm run typecheck`
- [ ] `npm run build` (Verificar que no hay errores de SSR/Hydration con el componente `use client`).

---

## ⚠️ Riesgos y Gotchas

1.  **Hydration Mismatch**: El componente `GlowingEffect` usa `window` y `document`. Debe estar blindado con `useEffect` (ya lo está en el source).
2.  **Z-Index**: Asegurarse de que el `inner wrapper` no oculte el efecto luminoso que debe quedar "entre" el borde y el contenido.
3.  **Conflictos con GSAP**: Algunas secciones usan GSAP para scroll. El `GlowingEffect` usa `framer-motion`. No deberían chocar, pero se debe monitorear el rendimiento del hilo principal.

---

**¿Procedemos con la creación de los componentes base?**
