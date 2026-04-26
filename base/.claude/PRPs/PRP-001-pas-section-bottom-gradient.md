# PRP-001: PasSection – Degradado Verde-Negro en el Cierre de Sección

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-26
> **Proyecto**: Nerick IA Services – Landing LinkedIn

---

## Objetivo

Añadir un efecto de degradado visual al **final de la sección `PasSection`** que reproduce fielmente el estilo de referencia: fondo negro en el centro de la pantalla que transiciona suavemente a un tono verde oscuro (`#0d3b2e` / `success-green`-esque) en la parte inferior, creando la sensación cinematográfica de que el contenido "emerge" del suelo verde.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| La `PasSection` termina abruptamente sobre un fondo negro plano. | Un degradado inferior negro → verde crea continuidad visual entre la sección PAS y las secciones siguientes, reforzando la identidad premium del landing. |

**Valor de negocio**: Mayor coherencia visual → sensación de diseño profesional → mayor confianza del visitante → más conversiones.

---

## Qué

### Criterios de Éxito
- [ ] Al llegar al final de `PasSection` se percibe el degradado negro → verde oscuro en la parte baja de la pantalla (matching al screenshot de referencia).
- [ ] El degradado **NO** interfiere con el contenido del CTA final (`Control Absoluto`).
- [ ] El efecto visualmente coincide con la foto compartida: fondo negro superior, transición difusa hacia un verde muy oscuro en la base.
- [ ] No hay errores TypeScript (`npm run typecheck` pasa).
- [ ] No hay regresiones visuales en el scroll flow de PasSection.

### Comportamiento Esperado (Happy Path)
1. El usuario hace scroll hacia el final de `PasSection`.
2. Cuando el CTA "FORJAR MI SISTEMA" es visible, la parte inferior del viewport muestra una capa semitransparente con un degradado radial/lineal: `transparent → rgba(0, 80, 50, 0.8)` desde el centro hacia abajo.
3. La transición es suave y apagada, no agresiva. Coincide con el tono verde oscuro de la imagen de referencia (`~#0a2a1e` a `#10B981` en opacidad muy baja).

---

## Contexto

### Referencia Visual (Screenshot del usuario)
- El degradado va de **negro puro en la zona central/superior** a **verde muy oscuro y difuso en la parte inferior**.
- La transición no tiene un borde definido – es completamente difusa (radial o lineal con múltiples stops).
- El verde no es brillante: es un verde oscuro profundo (`#0d3325` aprox), que hace referencia al `success-green: #10B981` del proyecto pero a muy baja saturación/opacidad.

### Archivos Relevantes
- [`PasSection.tsx`](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/PasSection.tsx) – Componente objetivo.
- [`tailwind.config.ts`](file:///home/nerick_ods/solutions/landing-linkedin/tailwind.config.ts) – Tokens de color: `success-green: #10B981`, `accent-cyan: #00f2ff`.

### Arquitectura Actual de PasSection
```
<section ref={containerRef} class="relative h-[800vh] bg-black z-10">
  <div class="sticky top-0 h-screen flex items-center justify-center">
    ← Aquí vive todo el contenido animado ←
  </div>
</section>
```

El elemento `sticky` ocupa `100vh`. El degradado debe agregarse **dentro del sticky container** para que sea visible en todo momento al final del scroll, específicamente envolviéndolo con una capa absoluta en la parte inferior.

---

## Blueprint (Assembly Line)

> Solo fases abstractas. Las subtareas se generan al entrar a cada fase con el bucle agéntico.

### Fase 1: Implementación del Degradado
**Objetivo**: Añadir la capa del degradado verde dentro del contenedor `sticky` de `PasSection.tsx`.
**Técnica propuesta**:
- Insertar un `<div>` con `position: absolute`, `bottom: 0`, `left: 0`, `right: 0` y altura de `~30-40vh`.
- Fondo: `linear-gradient(to top, rgba(16, 185, 129, 0.35) 0%, rgba(0,0,0,0) 100%)` con opacidad controlada por Framer Motion.
- Opcionalmente animar `opacity` vinculado a `smoothProgress` para que el degradado aparezca suavemente en el tramo final del scroll (`[0.8, 1]` → `[0, 1]`).
- No afectar el `z-index` del contenido CTA (que debe quedar encima).

**Validación**: El degradado es visible al final de la sección sin tapar el CTA. TypeScript sin errores.

### Fase 2: Ajuste Fino de Color e Intensidad
**Objetivo**: Ajustar el degradado para que coincida visualmente con el screenshot de referencia.
**Validación**: Playwright screenshot confirma que el tono y difuminado coinciden con la referencia (verde oscuro profundo, no agresivo).

### Fase 3: Validación Final
**Objetivo**: Confirmar que no hay regresiones y el resultado luce premium.
**Validación**:
- [ ] `npm run typecheck` pasa sin errores.
- [ ] Scroll animado completo funciona sin interrupciones.
- [ ] Playwright screenshot del final de la sección muestra el degradado.
- [ ] Revisión visual del usuario aprueba el resultado.

---

## Gotchas

- [ ] El sticky container usa `overflow-hidden` implícito en algunos layouts; verificar que el `div` absoluto no sea recortado.
- [ ] El color `success-green: #10B981` es mediano/brillante — usar con opacidad muy baja (~0.2–0.4) para lograr el verde oscuro de la referencia. Mejor usar un color raw `rgba(10, 60, 35, 0.8)` para el stop inferior.
- [ ] El degradado debe estar debajo del `z-index` del contenido CTA (`zIndex: 20+`).
- [ ] **NO** alterar la lógica de `smoothProgress`, `sectionOpacity`, ni el `bg-black` de la sección padre.

## Anti-Patrones

- NO crear un nuevo estado de React para controlar el gradiente si `smoothProgress` ya existe.
- NO añadir una nueva capa `fixed` (rompería con otros degradados fijos existentes).
- NO usar Tailwind arbitrary values complejos si un `style` inline es más legible.

---

## 🧠 Aprendizajes (Self-Annealing)

> Esta sección crece con cada error encontrado durante la implementación.

---

*PRP pendiente aprobación. No se ha modificado código.*
