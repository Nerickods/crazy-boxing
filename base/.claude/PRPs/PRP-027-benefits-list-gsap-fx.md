# PRP-027: BenefitsList GSAP-FX Integration

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-29
> **Proyecto**: KIA Intelligence

---

## Objetivo

Transformar la sección `BenefitsList` en una experiencia cinematográfica de pantalla completa (Full Screen Scroll FX) utilizando **GSAP + ScrollTrigger**, integrando los "3 Pilares" de KIA Intelligence como el núcleo del producto "KIA Intelligence Product".

## Por Qué

| Problema | Solución |
|----------|----------|
| Las transiciones actuales son fluidas pero carecen del "impacto Apple" de una sección dedicada de pantalla completa con fondos sincronizados. | Implementar un sistema de scroll-pinning robusto con GSAP que permita transiciones de fondo (fade/wipe) y etiquetas sincronizadas (left/right labels). |

**Valor de negocio**: Refuerza el posicionamiento de "Elite IAintelligence" mediante una UX premium que justifica los tickets altos y la exclusividad del servicio.

## Qué

### Criterios de Éxito
- [ ] Transiciones de fondo sincronizadas con el scroll (fade mode).
- [ ] Etiquetas laterales (Left/Right labels) que se centran dinámicamente según el índice activo.
- [ ] Título central con animación de máscara (split-words) para mayor impacto visual.
- [ ] Integración de los "3 Pilares" de `BUSINESS_LOGIC.md` como contenido base.
- [ ] Rendimiento optimizado (zero-lag) en desktop y mobile.

### Comportamiento Esperado
1. El usuario entra en la sección `BenefitsList`.
2. El contenedor se "ancla" (pin) a la pantalla completa.
3. Al hacer scroll, la imagen de fondo actual hace un fade-out mientras la nueva hace fade-in.
4. Las listas laterales se desplazan para centrar la opción activa.
5. El título central animado revela la propuesta de valor de cada pilar.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` (Componente actual a reemplazar).
- `BUSINESS_LOGIC.md` (Fuente de verdad de los pilares del servicio).
- [GSAP Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) - Referencia de ScrollTrigger.

### Arquitectura Propuesta (Feature-First)
```
src/
├── shared/
│   └── components/
│       └── ui/
│           └── full-screen-scroll-fx.tsx  # Componente base GSAP
├── features/
│   └── landing-page/
│       └── components/
│           └── BenefitsList.tsx          # Implementación específica
```

---

## Blueprint (Assembly Line)

### Fase 1: Infraestructura y Componente UI
**Objetivo**: Instalar dependencias y crear el componente base `FullScreenScrollFX`.
**Validación**: El archivo existe y `gsap` está instalado correctamente.

### Fase 2: Implementación de Contenido
**Objetivo**: Mapear los "3 Pilares" de `BUSINESS_LOGIC.md` a las secciones del componente.
**Validación**: Las secciones muestran los labels y títulos correctos.

### Fase 3: Pulido Visual y Assets
**Objetivo**: Seleccionar imágenes de alta calidad (Unsplash) y ajustar colores cyan/emerald para el branding.
**Validación**: La paleta coincide con `BUSINESS_LOGIC.md`.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Playwright screenshot confirma UI premium.
- [ ] Criterios de éxito cumplidos.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-03-29: GSAP SSR
- **Error**: GSAP Plugin Registration en Next.js (SSR).
- **Fix**: Usar `if (typeof window !== "undefined")` para registrar plugins.
- **Aplicar en**: Cualquier integración visual compleja con GSAP.

---

## Gotchas
- [ ] GSAP + ScrollTrigger requieren una limpieza cuidadosa en `useEffect` (kill triggers).
- [ ] Las imágenes de Unsplash deben cargarse con optimización de Next.js si es posible, o usar `img` con `loading="eager"` para las primeras secciones.

## Anti-Patrones
- NO usar Framer Motion para esta sección específica si GSAP ya está al mando.
- NO omitir la limpieza de ScrollTriggers al desmontar el componente.

---

*PRP pendiente aprobación por Nerick Segoviano.*
