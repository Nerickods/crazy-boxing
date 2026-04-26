# PRP-045: UX de Scroll "Snap-Fast" en PasSection

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-15
> **Proyecto**: landing-linkedin

---

## Objetivo

Implementar una experiencia de usuario "Snap-Fast" donde el scroll entre los bloques de texto sea extremadamente rápido, pero el texto se "detenga" y permanezca legible (plateau) mientras está centrado. Reducir la altura total a `400vh`.

## Por Qué

| Problema | Solución |
|----------|----------|
| El scroll continuo puede hacer que el usuario "pase de largo" el contenido si es demasiado rápido, o que se sienta pesado si es muy lento. | Implementar un "rellano" (plateau) en las funciones de transformación de Framer Motion. Esto permite que el contenido llegue rápido al centro, se quede estático un momento para ser leído, y luego salga disparado rápidamente. |

**Valor de negocio**: Máxima agilidad narrativa. El usuario siente que el sitio responde a su velocidad de lectura, deteniéndose justo donde importa y acelerando en las transiciones irrelevantes.

## Qué

### Criterios de Éxito
- [ ] La altura total de `PasSection` se reduce a **`400vh`**.
- [ ] Implementación de una "zona muerta de movimiento" (plateau) en el centro de cada ítem de texto.
- [ ] El tiempo de transición (salida de item N y entrada de item N+1) es un 30% más rápido que la versión actual.
- [ ] El Logo y el CTA se muestran con la misma velocidad "snap" sincronizada (ventana de progreso de 0.05).
- [ ] No hay retraso percibido entre la marca y la oferta.

### Comportamiento Esperado
Al scrollear, el texto volará hacia el centro. Al llegar al centro exacto, el movimiento vertical se detendrá por unos ~50-80px de scroll (proporcional al progreso), permitiendo una lectura clara. Tras ese breve "anclaje", el texto saldrá disparado hacia arriba para dar paso al siguiente.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx`
- Patrón de "Plateau" en `useTransform`.

### Lógica Propuesta
Modificaremos la generación del `range` en `ScrollTitleFlow`:
```typescript
const plateau = step * 0.25; // 25% del paso es tiempo de lectura estático
const range = [
  itemCenter - step,
  itemCenter - plateau, // Inicio de meseta (opacity 1, y 0)
  itemCenter + plateau, // Fin de meseta (opacity 1, y 0)
  itemCenter + step
];
```

---

## Blueprint (Assembly Line)

### Fase 1: Reducción Extrema y Lógica de Meseta
**Objetivo**: Bajar a `400vh` y aplicar el nuevo array de rangos en `ScrollTitleFlow`.
**Validación**: Los textos se detienen visiblemente en el centro antes de continuar su camino.

### Fase 2: Ajuste de Fly-out y Sincronización Final
**Objetivo**: Asegurar que el Logo y el CTA sigan este ritmo acelerado sin "lag" entre el último ítem y la oferta.
**Validación**: Transición instantánea del último punto de dolor al Logo.

### Fase 3: Validación Final
**Objetivo**: UX pulida a 60fps.
**Validación**:
- [ ] `npm run typecheck`
- [ ] Sensación de "anclaje" confirmada en scroll táctil (mobile).

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

*(Se documentará durante la ejecución)*

---

## Gotchas

- [ ] Si la meseta (`plateau`) es muy grande en `400vh`, los textos podrían solaparse físicamente. Hay que equilibrar el `plateau` con el `step`.
- [ ] El `restDelta` del resorte (`useSpring`) es crítico aquí para que el "snap" se sienta firme y no "gomoso".

---

*PRP pendiente aprobación. No se ha modificado código.*
