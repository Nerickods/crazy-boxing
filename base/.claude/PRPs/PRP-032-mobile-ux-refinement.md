# PRP-032: BenefitsList Mobile UI/UX Refinement

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-30
> **Proyecto**: KIA Intelligence

---

## Objetivo

Corregir la superposición de elementos y la saturación de contenido en dispositivos móviles para la sección `BenefitsList`. El objetivo es lograr una experiencia "Clean & Premium" donde el título global, los títulos de sección y las tarjetas de características convivan armoniosamente sin asfixiar la pantalla de `100vh`.

## Por Qué

| Problema | Solución |
|----------|----------|
| El Header "KIA Intelligence Product" pisa los títulos y descripciones en mobile. | Elevar el Header a `6vh` y reducir su tamaño de fuente en dispositivos táctiles. |
| Las 6 tarjetas por módulo son demasiado altas para mobile, rompiendo el scroll cinemático. | Priorizar las **4 características principales** en mobile para mantener la legibilidad y evitar scroll interno. |
| El diseño se siente "apretujado" y ruidoso. | Reducir paddings internos, iconos y gaps para ganar "aire" visual. |

---

## Qué (Especificaciones Detalladas)

### 1. Header Global Mobile
- **Posición**: Reubicar de `top-[10vh]` a `top-[6vh]`.
- **Tipografía**: Reducir de `text-4xl` a `text-3xl` (mobile) para maximizar el espacio vertical libre.

### 2. Feature Cards Compactas
- **Paddings**: De `p-4` a `p-3`.
- **Iconografía**: Escalar iconos de `20px` a `16px`.
- **Descripciones**: Reducir tamaño de fuente (`text-[11px]` o `text-[10px]` vs `text-xs`) e incrementar el interletrado.
- **Limitación de Contenido**: Mostrar solo `top 4` diferenciadores en mobile. Los 6 se mantienen en Desktop/Tablet.

### 3. Ajuste de Timeline (GSAP)
- **Transform Control**: Asegurar que la entrada de las tarjetas empiece `2rem` más arriba de lo actual en mobile para evitar que se salgan por la parte inferior de la pantalla o se peguen demasiado al Footer.

---

## Blueprint (Bucle Agéntico)

### FASE 1: Reubicación del Header
**Objetivo**: Ganar espacio en el tercio superior de la pantalla.
**Acción**: Actualizar `BenefitsList.tsx` con clases responsive para el `top` y `text-size`.

### FASE 2: Implementación de Cards Compactas
**Objetivo**: Reducir la huella vertical de cada beneficio.
**Acción**: Modificar el componente `FeatureCard` dentro de `BenefitsList.tsx` con ajustes de padding, icono y fuente condicionales.

### FASE 3: Lógica de Grid Responsivo
**Objetivo**: Controlar la cantidad de información según el viewport.
**Acción**: Usar un hook de media query o un simple slice condicional en `FeatureGrid`.

### FASE 4: Pulido de Spacing GSAP
**Objetivo**: Eliminar colisiones entre descripción y grid.
**Acción**: Ajustar `.fx-featured-extra` en el bloque de media query de `full-screen-scroll-fx.tsx`.

---

## Gotchas
- [ ] Asegurarse de que el `stagger` de entrada siga funcionando smooth en mobile aunque haya menos cartas.
- [ ] Verificar que el padding inferior (`pb-10`) no empuje las cartas fuera del viewport.

---

*PRP pendiente aprobación por Nerickods (UI/UX Impecable).*
