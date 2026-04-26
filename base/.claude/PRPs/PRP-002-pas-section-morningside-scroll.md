# PRP-002: PasSection – Estilo de Scroll Morningside (Texto Estratificado por Opacidad)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-26
> **Proyecto**: Nerick IA Services – Landing LinkedIn

---

## Objetivo

Rediseñar el componente `ScrollTitleFlow` dentro de `PasSection` para replicar el patrón visual de la referencia (estilo Morningside): **un texto activo grande y brillante en el centro**, con el texto **anterior visible y tenue encima** y el texto **siguiente visible y tenue debajo**, todos sobrelapados en la misma pantalla simultáneamente durante el scroll.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| El scroll actual desplaza cada bloque hacia arriba hasta desaparecer — se ve solo un elemento a la vez. | Con el nuevo sistema, el usuario ve 3 bloques a la vez (anterior tenue, actual brillante, siguiente tenue), creando una sensación de flujo narrativo más cinematográfico y legible. |

**Valor de negocio**: Storytelling más efectivo = mayor comprensión del dolor del cliente = más conversiones.

---

## Qué

### Criterios de Éxito
- [ ] El bloque ACTIVO se muestra centrado, grande (~`text-3xl/4xl`), blanco brillante (`opacity: 1`).
- [ ] El bloque ANTERIOR se muestra encima, más pequeño y tenue (`opacity: ~0.3`, `text-xl/2xl`).
- [ ] El bloque SIGUIENTE se muestra debajo, tenue (`opacity: ~0.25`, `text-xl/2xl`).
- [ ] La tipografía es **sans-serif natural** (no uppercase, no black-weight), tipo `Inter` regular/medium, como en la referencia.
- [ ] Sin íconos visibles en el scroll principal (los íconos se eliminan o se integran sutilmente).
- [ ] La transición entre bloques es suave y continua usando `useTransform`.

### Comportamiento Esperado (Happy Path)
1. El usuario entra al scroll de `PasSection`.
2. Mientras avanza, el bloque #1 está centrado y brillante; el bloque #0 aparece encima (si existe) tenue.
3. Al continuar el scroll, #2 se activa en el centro, #1 sube y se atenúa, #3 aparece tenue debajo.
4. La sensación es de leer un párrafo completo de historia, no de ver tarjetas que aparecen/desaparecen.

---

## Contexto

### Análisis de la Referencia Visual
- **Fuente**: Sans-serif (posiblemente `Inter` o `DM Sans`), **peso medium a semibold** (no black/bold extremo), **no uppercase**, letra casing normal.
- **Tamaño activo**: ~28-36px desktop.
- **Tamaño inactivo (encima/debajo)**: ~20-24px, con `opacity: 0.3`.
- **Alineación**: centrada horizontalmente, con máximo ~70% de ancho de pantalla.
- **Espaciado**: El activo tiene ~120-150px de margen sobre el anterior y con la siguiente.
- **Sin íconos**: Solo texto puro y limpio.
- **Sin highlights de color cyan**: El texto activo es blanco brillante, sin colorear palabras individuales.

### Archivos Relevantes
- [`PasSection.tsx`](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/PasSection.tsx) – Componente objetivo, específicamente `ScrollTitleFlow`.
- [`tailwind.config.ts`](file:///home/nerick_ods/solutions/landing-linkedin/tailwind.config.ts) – Tipografía: `font-sans: Inter`.

### Arquitectura Actual de `ScrollTitleFlow`
Cada item es un `motion.div` con `position: absolute`, animado con `y` (drift vertical) y `opacity`. El problema: el y-drift los saca de la vista completamente. El nuevo patrón necesita que todos los items sean visibles pero en posiciones Y **estáticas relativas al centro** y solo varíen en opacity/scale.

### Nuevo Patrón: Posicionamiento Relativo Fijo
En lugar de `y` dinámico que saca los elementos de la pantalla, cada item tendrá una posición `y` calculada en función de su **distancia desde el item activo** (basada en el index relativo). El item i = active tiene `y=0`, i = active-1 tiene `y=-spacingPx`, i = active+1 tiene `y=+spacingPx`.

---

## Blueprint (Assembly Line)

> Solo fases abstractas. Las subtareas se generan al entrar a cada fase.

### Fase 1: Rediseño del componente `ScrollTitleFlow`
**Objetivo**: Reescribir la lógica de posicionamiento y opacidad para mostrar el stack de texto (anterior, activo, siguiente) simultáneamente.
**Técnica**:
- Eliminar el `y` drift que expulsa elementos del viewport.
- Calcular `yPosition` estático por item: `(index - activeIndex) * ITEM_GAP_PX`.
- Animar `opacity`, `scale`, y `y` con `useTransform` basado en qué tan "activo" es cada item.
- Transición fluida entre estados.
**Validación**: Al hacer scroll, los 3 elementos simultáneos son visibles.

### Fase 2: Actualización del Estilo de Tipografía
**Objetivo**: Reemplazar el estilo caption uppercase+black por el estilo natural de la referencia.
- Cambiar clases de `h3`: de `font-black tracking-tight uppercase` a `font-medium tracking-normal normal-case`.
- Fuente: `font-sans` (Inter).
- Eliminar el span de color cyan highlight, dejar texto monótono blanco.
- Eliminar los íconos del scroll flow.
- Ajustar tamaños: activo `text-3xl md:text-4xl`, inactivos `text-xl md:text-2xl`.
**Validación**: El texto coincide visualmente con la referencia. Natural, legible, limpio.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Scroll flow completo es visualmente limpio.
- [ ] Criterios de éxito cumplidos.

---

## Gotchas

- [ ] El `sectionOpacity` envuelve todo el contenido y desvanece en `progress >= 0.98` — no tocar esta lógica.
- [ ] La entrada del PAS (`progress 0-0.12`) tiene un intro separado — no afectarlo.
- [ ] El CTA final (`progress 0.88-0.94`) es independiente — mantenerlo intacto.
- [ ] El rango activo del scroll de items es `0.15 → 0.88` — subdividir entre 4 items.
- [ ] Con texto más pequeño para los inactivos, ajustar el gap Y para que no se amontonen (`~130-160px`).

## Anti-Patrones

- NO eliminar el `useSpring`/`smoothProgress` — es clave para el fluido del scroll.
- NO usar `position: fixed` para los items.
- NO hardcodear pixel values como strings — calcular dinámicamente.

---

## 🧠 Aprendizajes (Self-Annealing)

> Esta sección crece con cada error encontrado durante la implementación.

---

*PRP pendiente aprobación. No se ha modificado código.*
