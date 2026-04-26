# PRP-002: Sticky Scroll-Reveal Sections (PasSection + BentoEcosystem)

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-21
> **Proyecto**: landing-linkedin

---

## Objetivo

Implementar un efecto de scroll donde las 2 primeras secciones después del Hero (`PasSection` y `BentoEcosystem`) tengan un contenedor "sticky" que permanezca fijo en pantalla mientras el usuario hace scroll. Dentro de ese contenedor, las tarjetas (3 en PasSection, 4 en BentoEcosystem) se revelarán secuencialmente: aparecen, se muestran centradas en pantalla, y se desvanecen al avanzar el scroll, dando paso a la siguiente tarjeta.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las secciones actuales son estáticas y no generan impacto visual al scrollear | Un efecto secuencial tipo Apple crea una experiencia inmersiva y premium |
| El contenido aparece descentrado y cortado — el usuario no alcanza a leer las últimas tarjetas | Centrado absoluto perfecto + timing calibrado con suficiente scroll travel |

**Valor de negocio**: Mejora dramática de la percepción premium del landing y retención visual del usuario.

## Qué

### Criterios de Éxito
- [ ] Las tarjetas aparecen **perfectamente centradas** vertical y horizontalmente en la pantalla
- [ ] Cada tarjeta se muestra con opacity=1 durante un tramo de scroll suficiente para leerla (~15-20% del travel)
- [ ] Las 3 tarjetas de PasSection y las 4 de BentoEcosystem son TODAS visibles al 100% en su momento
- [ ] La transición entre tarjetas es suave (fade out → fade in, con leve translate-y)
- [ ] El efecto funciona en desktop Y mobile
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso

### Comportamiento Esperado

```
Usuario hace scroll hacia abajo:

[ HeroSection — no se toca ]
  |
  v  scroll
[ PasSection (h-[300vh]) ]
  ├─ sticky container ocupa 100vh, centrado
  ├─ scroll 0-20%: Título "Tu negocio factura..." fade in/out
  ├─ scroll 20-45%: Card 1 "Missing Leads" (roja) fade in, visible, fade out
  ├─ scroll 40-65%: Card 2 "Black Box" (amarilla) fade in, visible, fade out
  └─ scroll 60-90%: Card 3 "Tech Mutation" (cyan) fade in, visible, fade out
  |
  v  scroll
[ BentoEcosystem (h-[400vh]) ]
  ├─ sticky container ocupa 100vh, centrado
  ├─ scroll 0-15%: Título "ecosistema inteligente" fade in/out
  ├─ scroll 15-35%: Módulo 01 "Vendedor IA" fade in, visible, fade out
  ├─ scroll 30-50%: Módulo 02 "Landing" fade in, visible, fade out
  ├─ scroll 45-70%: Módulo 03 "Dashboard" fade in, visible, fade out
  └─ scroll 65-90%: Módulo 04 "Conectividad" fade in, visible, fade out
```

---

## Contexto

### Bug Raíz Identificado: `overflow-hidden` rompe `sticky`

El componente `GlassRefractionBackground` (que envuelve toda la landing) tiene:
```css
/* Línea 19 de glass-refraction-background.tsx */
className="relative w-full min-h-screen bg-black overflow-hidden"
```

**CSS Spec**: `position: sticky` NO funciona si cualquier ancestro tiene `overflow: hidden` (o `overflow: auto/scroll`). El browser interpreta que el "scrolling container" es ese ancestro, no el viewport. Resultado: el `sticky` no se engancha y el contenido scrollea normalmente, apareciendo descentrado.

### Bug Secundario: Layout de Cards asimétrico

En la implementación actual, Card 1 está en flujo normal (`className="w-full"`) mientras Cards 2/3 están con `absolute inset-0`. Esto hace que el contenedor `div` tenga la altura de Card 1 en lugar de colapsar a cero, desplazando todo hacia arriba del centro del viewport.

### Referencias
- [glass-refraction-background.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/components/ui/glass-refraction-background.tsx) — Wrapper con `overflow-hidden` (línea 19)
- [PasSection.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/PasSection.tsx) — Sección 1 actual
- [BentoEcosystem.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/BentoEcosystem.tsx) — Sección 2 actual
- [page.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/app/page.tsx) — Layout de la landing

### Arquitectura (NO cambia estructura Feature-First)
Los cambios son in-place sobre los mismos archivos, no se crean features nuevas.

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase.

### Fase 1: Desbloquear `position: sticky`
**Objetivo**: Eliminar el `overflow-hidden` del contenedor padre en `GlassRefractionBackground` o reemplazarlo con `overflow-x-hidden` (que no rompe sticky) para que los hijos puedan usar `position: sticky`.
**Validación**: Un `div` con `position: sticky; top: 0` dentro de la landing se queda pegado al scrollear.

### Fase 2: Re-implementar PasSection con centrado absoluto
**Objetivo**: Reescribir `PasSection` con las siguientes specs:
- Contenedor section: `h-[300vh]` (3 cards × ~100vh por card de scroll travel)
- Sticky inner: `position: sticky; top: 0; height: 100vh; display: flex; align-items: center; justify-content: center`
- TODAS las cards con `position: absolute` + centrado via `inset-0 flex items-center justify-center` — ninguna en flujo normal
- Cada card animada con `useScroll` + `useTransform` (opacity + y)
- Offset del scroll: `["start start", "end end"]` para que el progress se mapee 0→1 mientras la sección está sticky
**Validación**: Las 3 tarjetas se ven perfectamente centradas en la pantalla al scrollear.

### Fase 3: Re-implementar BentoEcosystem con centrado absoluto
**Objetivo**: Misma lógica que Fase 2 pero para 4 módulos (Vendedor IA, Landing, Dashboard, Conectividad).
- Contenedor section: `h-[400vh]` (4 cards)
- Mismo patrón de sticky + absolute cards
**Validación**: Los 4 módulos se ven perfectamente centrados.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Las 3 tarjetas PAS se ven centradas y legibles
- [ ] Los 4 módulos Bento se ven centrados y legibles
- [ ] Mobile responsive funciona
- [ ] Criterios de éxito cumplidos

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-03-21: `overflow-hidden` rompe `position: sticky`
- **Error**: Usamos `sticky` dentro de un ancestro con `overflow-hidden`, por lo que nunca se activó
- **Fix**: Cambiar a `overflow-x-hidden` (solo clip horizontal) o quitar overflow del wrapper
- **Aplicar en**: Cualquier futuro uso de sticky positioning — siempre verificar ancestros con overflow

### 2026-03-21: Cards en flujo normal + absolute mezclados = descentrado
- **Error**: Card 1 en flujo normal empuja el layout del sticky container, descentrando las cards absolutas
- **Fix**: TODAS las cards deben ser `absolute` para no afectar el flow del contenedor
- **Aplicar en**: Todo sistema de stacked/overlapping cards

### 2026-03-21: Offset `["start end", "end start"]` es incorrecto para sticky
- **Error**: Este offset calcula el progress basado en cuándo la sección entra/sale del viewport, pero con sticky la sección siempre está visible
- **Fix**: Usar `["start start", "end end"]` que mapea el scroll progress al recorrido interno de la sección
- **Aplicar en**: Cualquier sección con position sticky

---

## Gotchas

- [ ] `overflow-hidden` en ancestro ROMPE `position: sticky` — CSS spec
- [ ] Al quitar `overflow-hidden` de GlassRefractionBackground, verificar que los blobs de fondo no provoquen scrollbar horizontal (solución: `overflow-x: clip` o `overflow-x: hidden`)
- [ ] Todas las cards DEBEN ser `absolute` para centrado correcto — ninguna en flujo normal
- [ ] `framer-motion` maneja `position: sticky` correctamente dentro de `motion.div`, pero hay que validar que el `style={{ y }}` no interfiera con el sticky

## Anti-Patrones

- NO mezclar cards en flujo normal con cards absolutas en el mismo contenedor
- NO usar `overflow-hidden` en ancestros de elementos sticky
- NO usar offset `["start end", "end start"]` para secciones sticky (produce timing erróneo)
- NO hardcodear alturas de cards — usar auto-height

---

*PRP pendiente aprobación. No se ha modificado código.*
