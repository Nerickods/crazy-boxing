# PRP-012: Optimización de Espaciado y Composición Mobile (Cierre)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-22
> **Proyecto**: landing-linkedin

---

## Objetivo

Ajustar la composición visual del cierre (LandingCta y ServicesCta) específicamente para dispositivos móviles, evitando el agrupamiento excesivo en la parte superior y logrando un equilibrio visual más armonioso y "premium".

## Por Qué

| Problema | Solución |
|----------|----------|
| **Crowding Superior**: El texto "Deja de ser un espectador..." y el botón CTA se posicionan demasiado arriba en mobile, casi tocando el header. | Eliminar el `-translate-y-[10vh]` reactivo que desplaza el CTA hacia arriba en mobile y reducir el valor de desplazamiento del título (`text2Y`). |
| **Falta de Aire**: El espaciado entre el título (Fase 2) y el botón (Fase 3) se siente comprimido en pantallas pequeñas. | Ajustar las interpolaciones de scroll para que el título se posicione con más margen respecto al CTA. |

**Valor de negocio**: Asegura que la experiencia "Cinemática" sea consistente tanto en desktop como en mobile, eliminando fricción visual en el momento crítico de la conversión.

## Qué

### Criterios de Éxito
- [ ] El CTA aparece centrado verticalmente en mobile (o ligeramente desplazado hacia abajo para compensar el header).
- [ ] El título (Fase 2) termina en una posición que no colisiona con el Logo/Menu.
- [ ] El Footer mantiene su visibilidad sin encimarse con el contenido principal.

### Comportamiento Esperado
En mobile, al terminar el scroll, el mensaje persuasivo se desplazará a una posición superior más moderada (ej. `-100px` en lugar de `-200px`), y el botón de acción se mantendrá en una posición central relajada, permitiendo que el diseño "respire".

---

## Contexto

### Referencias
- `src/features/landing-page/components/LandingCta.tsx`
- `src/features/services/components/ServicesCta.tsx`

---

## Blueprint (Assembly Line)

### Fase 1: Limpieza de Clases de Posicionamiento
**Objetivo**: Eliminar el translate negativo en mobile.
**Validación**: El contenido baja visualmente en la pantalla.

### Fase 2: Lógica de Offset Responsivo
**Objetivo**: Usar constantes basadas en el ancho de pantalla para `text2Y`.
**Validación**: En desktop se mantiene el desplazamiento amplio (-200/220) y en mobile se reduce (-100/120).

### Fase 3: Pulido de Composición
**Objetivo**: Revisar márgenes y gaps.
**Validación**: El resultado final coincide con la estética de "Calidad Final" solicitada.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-04-22: Diseño Mobile-First en Animaciones de Scroll
- **Concepto**: Las unidades fijas de píxeles en animaciones de scroll (`y: -200`) son peligrosas en pantallas con poca altura. Siempre es preferible usar valores proporcionales o condicionales.

---

*PRP pendiente aprobación.*
