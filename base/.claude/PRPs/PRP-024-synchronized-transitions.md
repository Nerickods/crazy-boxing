# PRP-024: Lifecycle de Transición Sincronizada (BenefitsList)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-27
> **Proyecto**: KIA Intelligence

---

## Objetivo

Implementar una coreografía perfecta entre tarjetas donde la salida de una es dictada exactamente por la entrada de la siguiente. Además, se busca un efecto de "domado de color" (color maturing) donde la intensidad visual de la tarjeta entrante crece proporcionalmente a su revelado.

## Por Qué

| Intención del Usuario | Solución Técnica |
|-----------------------|------------------|
| "Que se valla desvaneciendo conforme la otra va entrando" | Sincronizar el `exitRange` de la Tarjeta N con el `entryRange` de la Tarjeta N+1. La opacidad de N será exactamente `1 - opacity(N+1)`. |
| "Que valla domando su color conforme va cargandose al 100%" | Ligar la intensidad del Shader `Warp` y el `glow` (box-shadow) directamente al `revealProgress` de la tarjeta, alcanzando el 100% de saturación/brillo solo al final del recorrido del clip-path. |

**Valor de negocio**: Transiciones cinemáticas nivel "Apple" que guían la mirada del usuario sin saltos bruscos ni amontonamientos, reforzando el branding de IA de "Élite".

## Qué

### Criterios de Éxito
- [ ] La tarjeta actual (N) desaparece completamente justo cuando la siguiente (N+1) termina su revelado (clip-path).
- [ ] No hay momentos de "pantalla vacía" ni de "triple traslape".
- [ ] Los colores del shader se sienten vibrantes y "completos" solo cuando la información es totalmente legible.

### Comportamiento Esperado
Mientras el usuario scrollea:
1. El Beneficio 1 (B1) está fijo y visible.
2. Inicia el scroll del Beneficio 2 (B2).
3. B2 empieza a deslizar su "curtina" (clip-path).
4. SINCRO: B1 reduce su opacidad en un ratio 1:1 con el progreso de B2.
5. Al llegar B2 al 100% de revelado, B1 es `opacity: 0` y B2 tiene su "color domado" (máximo esplendor).

---

## Contexto Técnico

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx`
- `framer-motion`: `useTransform` con múltiples keyframes sincronizados por `index`.

---

## Blueprint (Assembly Line)

### Fase 1: Mapeo Matemático de Co-Dependencia
**Objetivo**: Vincular el rango de salida de la tarjeta `i` con el rango de entrada de `i+1`.
**Lógica**: 
- `entry(i)` = [`fillStart`, `fillEnd`]
- `exit(i)` = [`fillEnd`, `nextFillEnd`]

### Fase 2: Implementación de "Color Maturing"
**Objetivo**: Transformar la intensidad visual basándose en el progreso local de la tarjeta.
**Acción**: Aplicar `useTransform` a la opacidad del shader y al brillo del glow.

### Fase 3: Validación Cinemática
**Objetivo**: Verificar fluidez extrema.
**Validación**:
- [ ] `npm run typecheck`
- [ ] Verificación visual del "hand-off" entre tarjetas.

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-03-27: Transiciones Linkeadas
- **Insight**: Para efectos premium, la salida de un elemento no debe ser una constante, sino una variable dependiente del progreso del siguiente elemento. Esto crea una sensación de "empuje" o "sustitución" orgánica.

---

*PRP pendiente aprobación.*
