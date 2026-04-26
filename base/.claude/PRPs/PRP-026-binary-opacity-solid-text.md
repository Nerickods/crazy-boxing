# PRP-026: Opacidad Binaria y Revelado de Texto Sólido (100% Color)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-27
> **Proyecto**: KIA Intelligence

---

## Objetivo

Garantizar que el texto de cada beneficio aparezca con su intensidad de color completa (100% opaco) desde el primer píxel de revelado. Se busca eliminar cualquier desvanecimiento de opacidad inicial que haga que el texto se vea "tenue" o "fantasma" mientras entra, confiando plenamente en la geometría del `clip-path` para la transición.

## Por Qué

| Problema | Solución Técnica |
|----------|------------------|
| El texto entrante se ve opaco/tenue porque el `overallOpacity` tiene un fade progresivo. Al sumarse a la transparencia del card, el texto pierde fuerza visual durante el revelado. | Cambiar la lógica de opacidad de "Analógica" (fade gradual) a "Binaria con Desvanecimiento de Salida Sincronizado". |
| El usuario quiere que el texto esté "ya cargado al 100%" al entrar. | Fijar `contentVisualOpacity` en `1` inmediatamente al alcanzar el `fillStart`. El `clip-path` se encargará de mostrarlo físicamente de forma progresiva sin sacrificar su intensidad cromática. |

**Valor de negocio**: Legibilidad máxima e impacto visual inmediato. Refuerza la sensación de una interfaz de alta tecnología que "escanea" y muestra datos sólidos sin errores de renderizado.

## Qué

### Criterios de Éxito
- [ ] El texto tiene su color final (#FFFFFF o similar) desde que asoma el primer carácter.
- [ ] La tarjeta entrante sustituye visualmente a la anterior con una "cuchilla" de color sólido.
- [ ] El desvanecimiento de salida (Fade-out) se mantiene sincronizado 1:1 con la entrada de la siguiente para un hand-off limpio.

### Comportamiento Esperado
1. Beneficio 1 (B1) está opaco al 100%.
2. Inicia scroll hacia Beneficio 2 (B2).
3. B2 activa su opacidad al 100% INSTANTÁNEAMENTE, pero sigue oculto por el `clip-path`.
4. El `clip-path` de B2 empieza a abrirse; el contenido revelado es 100% sólido.
5. Simultáneamente, B1 se desvanece suavemente mientras B2 lo va "tapando" con su color sólido.

---

## Contexto Técnico

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx`
- `framer-motion`: Ajuste de `useTransform` para usar keyframes de transición rápida (instaswitch).

---

## Blueprint (Assembly Line)

### Fase 1: Implementación de Opacidad Binaria (Arrival Switch)
**Objetivo**: Modificar `contentVisualOpacity` y `overallOpacity` para que lleguen a `1` de forma casi instantánea al inicio del rango.
**Lógica**: 
- `contentVisualOpacity` = `[fillStart, fillStart + 0.01] -> [0, 1]`

### Fase 2: Sincronización de Salida Solid-to-Fade
**Objetivo**: Mantener la tarjeta actual al 100% de solidez hasta que la siguiente empiece a borrarla.
**Acción**: Refinar los keyframes de `overallOpacity` para que el fade-out sea la única parte "analógica" del ciclo.

### Fase 3: Validación de Intensidad Cromática
**Objetivo**: Asegurar que las capturas de pantalla muestren texto 100% nítido.
**Validación**:
- [ ] `npm run typecheck`
- [ ] Verificación de que el shader `Warp` no sea demasiado intrusivo con el texto sólido.

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-03-27: Clipping > Opacity
- **Insight**: Cuando se usa `clip-path`, la opacidad se vuelve redundante para la entrada y a menudo perjudicial para la legibilidad. El recorte geométrico es superior para transiciones "sharp" donde se requiere solidez inmediata.

---

*PRP pendiente aprobación.*
