# PRP-020: Tripartite Header Layout — Logo-Reserved Center Slot

> **Estado**: PENDIENTE — Awaiting approval
> **Fecha**: 2026-04-03
> **Proyecto**: KIA Intelligence Landing

---

## Objetivo

Rediseñar el header para las secciones **Hero** y **BenefitsList (Services)** con un layout tripartito que reserva el slot central para el `LogoIsotype` permanente de PRP-019, eliminando la colisión visual entre el logo centrado y el texto "KIA INTELLIGENCE" existente.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| El logo central de PRP-019 se superpone con "KIA INTELLIGENCE" en Hero y Services | Layout de 3 columnas que separa la marca alrededor del slot del logo |
| El header no comunica la sección activa de forma elegante | Indicador contextual `· hero` o `· services` animado |

**Valor de negocio**: Cohesión visual premium — el logo siempre protagonista central, flanqueado por la marca.

---

## Qué

### Layout Final Propuesto

```
┌─────────────────────────────────────────────────────────────────┐
│  [Orb]  KIA  · hero   [   LOGO SLOT   ]   INTELLIGENCE  [≡ Menu]│
└─────────────────────────────────────────────────────────────────┘
   LEFT ZONE               CENTER ZONE             RIGHT ZONE
```

| Zona | Contenido |
|------|-----------|
| **LEFT** | ChatOrb/icono + "KIA" gradient + `· hero` o `· services` label |
| **CENTER** | `LogoIsotype` — slot siempre reservado, invisible si `!hasLogoInHeader` |
| **RIGHT** | "INTELLIGENCE" (extralight) + botón `≡ Menu` |

### Criterios de Éxito
- [ ] "KIA" y "INTELLIGENCE" flanquean el logo sin colisión visual
- [ ] El slot central tiene dimensiones fijas (64px) — sin layout shift
- [ ] Tripartito en estado expandido, compacto cuando `isScrolled && !isInServices`
- [ ] Label contextual animado con `AnimatePresence`
- [ ] Sin regresión en el morph ChatOrb

### Comportamiento por Estado

| Estado | Layout |
|--------|--------|
| `!isScrolled && !hasLogoInHeader` | Tripartite — center slot invisible |
| `!isScrolled && hasLogoInHeader` | Tripartite — center con LogoIsotype |
| `isScrolled && !isInServices` | Compacto — sin texto brand |
| `isInServices` (pinned) | Tripartite — logo + `· services` |

---

## Blueprint (Assembly Line)

### Fase 1: Grid Tripartito en Header.tsx
**Objetivo**: Reemplazar `flex justify-between` por `grid grid-cols-[1fr_auto_1fr]`.
```tsx
// Col 1: [Orb] KIA · label    (justify-start)
// Col 2: Logo slot fijo 64px  (justify-center)
// Col 3: INTELLIGENCE + Menu   (justify-end)
```
**Validación**: Sin colisión visual, flanqueamiento correcto.

### Fase 2: Activación Condicional
**Objetivo**: `showTripartiteLayout = !isScrolled || isInServices`. En `false`, vuelve al `flex` compacto.
**Validación**: Transición suave entre modos.

### Fase 3: Center Slot con Placeholder Invisible
**Objetivo**: Slot siempre ocupa `w-16 h-16`. Si `!hasLogoInHeader`, placeholder invisible.
**Validación**: Sin CLS al aparecer el logo.

### Fase 4: INTELLIGENCE al Right + Labels
**Objetivo**: "INTELLIGENCE" al Right Zone, label contextual en Left con `AnimatePresence`.
**Validación**: Label correcto, animación suave.

### Fase 5: Validación Final
- [ ] `npm run typecheck` sin errores
- [ ] Sin regresión en PasSection morph
- [ ] Correcto en mobile (375px) y desktop (1440px)

---

## Gotchas

- [ ] **NUNCA** usar `absolute left-1/2` para el logo — causa raíz del bug actual
- [ ] Slot central con `min-w-[64px]` para no collapsar cuando logo está invisible
- [ ] Mobile: validar que los textos flanqueantes no se sobrepongan en < 375px
- [ ] La lógica `hasMorphedToHeader` del icono izquierdo NO cambia

---

## Aprendizajes Pre-Implementación

### 2026-04-03: `absolute left-1/2` causa colisión
- **Error**: Logo con `position: absolute` vive fuera del flujo — se superpone con texto
- **Fix**: Logo como elemento DENTRO del grid tripartito, nunca absoluto
- **Aplicar en**: Cualquier elemento centrado que coexista con contenido lateral

---

*PRP pendiente aprobación. No se ha modificado código.*
