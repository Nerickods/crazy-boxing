# PRP-005: PasSection Sequential Drift (Infinite Flow)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-25
> **Proyecto**: landing-linkedin

---

## Objetivo

Implementar un sistema de "Deriva Secuencial" (Sequential Drift) para los títulos de la sección PAS. En lugar de amontonarse en una posición fija en la parte superior, cada título anterior continuará su viaje ascendente de forma proporcional al avance del scroll, desvaneciéndose gradualmente hasta desaparecer por completo. Esto garantiza que el espacio visual se mantenga limpio, dinámico y sin solapamientos excesivos.

## Por Qué

| Problema | Solución |
|----------|----------|
| Los títulos anteriores se "amontonan" en una posición estática arriba del centro, lo que ensucia la UI. | Implementar un movimiento ascendente continuo (Infinite Drift) para los elementos fuera de foco. |
| La persistencia estática puede sentirse rígida y romper la fluidez cinemática. | Opacidad y posición Y vinculadas dinámicamente al progreso total, creando un efecto de "valla" o "desfile" vertical. |

**Valor de negocio**: Refuerza la sensación de una tecnología fluida, imparable y de altísima gama, eliminando cualquier "friction" visual que distraiga del mensaje central.

## Qué

### Criterios de Éxito
- [ ] Los títulos antiguos nunca se quedan quietos; siempre se desplazan hacia arriba.
- [ ] La opacidad disminuye en niveles (100% -> 40% -> 15% -> 0%) según cuántos títulos nuevos han entrado.
- [ ] El espaciado entre títulos "viejos" es uniforme mientras se desplazan hacia el borde superior.
- [ ] Transición suave hacia el CTA final donde todo el "ruido" de problemas desaparece para revelar la solución.

### Comportamiento Esperado
1. Título 1 aparece en el centro.
2. Título 2 aparece en el centro; Título 1 sube a `y: -150` y `opacity: 0.4`.
3. Título 3 aparece en el centro; Título 2 sube a `y: -150`, Título 1 sube a `y: -300` y `opacity: 0.15`.
4. Título 4 aparece; Título 1 desaparece (`opacity: 0`), Título 2 baja a `opacity: 0.15` y sigue subiendo.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Implementación actual (Typography Stack).
- Estilo: Animaciones de créditos cinemáticos o "Scrollytelling" de alto nivel.

---

## Blueprint (Assembly Line)

### Fase 1: Lógica de Deriva Progresiva
**Objetivo**: Expandir los rangos de `useTransform` para `y` y `opacity` para cubrir estados de "segundo plano" y "tercer plano".
**Validación**: Los textos se mueven al unísono hacia arriba sin detenerse.

### Fase 2: Tuning de Espaciado y Opacidad
**Objetivo**: Ajustar los multiplicadores de desplazamiento para que los textos previos no se solapen entre sí mientras derivan hacia arriba.
**Validación**: Legibilidad mantenida incluso en estados de baja opacidad.

### Fase 3: Transición de Salida (CTA Sync)
**Objetivo**: Asegurar que todos los restos de texto persistente se desvanezcan elegantemente antes de que el CTA de "Control Absoluto" tome la pantalla.
**Validación**: Limpieza visual absoluta en el clímax de la sección.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

---

## Gotchas

- [ ] El `zIndex` debe ser descendente para los títulos que se van (el más nuevo arriba), pero el espaciado debe evitar que se pisen.
- [ ] En pantallas pequeñas (mobile), el drift debe ser más agresivo para no salirse del viewport sticky demasiado lento.

---

*PRP pendiente aprobación.*
