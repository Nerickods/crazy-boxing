# PRP-010: Sincronización Visual de CTA y Footer

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-22
> **Proyecto**: landing-linkedin

---

## Objetivo

Sincronizar la aparición del CTA final y el Footer para que emerjan simultáneamente al final del scroll de la landing page, logrando un efecto de "revelación única" más elegante y cohesivo.

## Por Qué

| Problema | Solución |
|----------|----------|
| Desfase temporal en la aparición de elementos: el botón de CTA aparece antes que el Footer, rompiendo la unidad visual del cierre de la página. | Unificar los rangos de interpolación de `scrollYProgress` para que el CTA y el Footer compartan el mismo ciclo de animación (opacidad y desplazamiento vertical). |

**Valor de negocio**: Refuerza la identidad visual "Premium" de Kia Intelligence mediante micro-animaciones coordinadas y fluidas.

## Qué

### Criterios de Éxito
- [ ] El CTA y el Footer comienzan a aparecer exactamente al mismo tiempo.
- [ ] Ambos alcanzan su opacidad total (1) y posición final simultáneamente.
- [ ] La transición de fondo (desvanecimiento del negro al transparente) se coordina con la aparición de los elementos.

### Comportamiento Esperado
Al llegar al último 15% del scroll de la sección `LandingCta`, el fondo comenzará a aclararse mientras el botón de acción y los enlaces del footer suben suavemente desde abajo, apareciendo como un solo bloque funcional.

---

## Contexto

### Referencias
- `src/features/landing-page/components/LandingCta.tsx` - Contenedor principal de la lógica de scroll y animación.
- `src/features/landing-page/components/Footer.tsx` - Componente hijo inyectado en el CTA.

### Arquitectura de Animación Propuesta
Se ajustarán los hooks `useTransform` para usar un rango unificado:
- **Rango sugerido**: `[0.88, 0.98]` para la transición final.

---

## Blueprint (Assembly Line)

### Fase 1: Mapeo y Ajuste de Rangos
**Objetivo**: Unificar los valores de `useTransform` en `LandingCta.tsx`.
**Validación**: Revisión de código para asegurar que los valores de entrada del array coincidan.

### Fase 2: Sincronización de Componentes Secundarios
**Objetivo**: Aplicar la misma lógica a `ServicesCta.tsx` para mantener la consistencia en todo el sitio.
**Validación**: El comportamiento es idéntico en la landing y en la página de servicios.

### Fase 3: Validación Visual
**Objetivo**: Confirmar que la animación se siente fluida.
**Validación**: Uso de Playwright o inspección manual para verificar el "feeling" de la animación.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-04-22: Sincronización de Scroll en Framer Motion
- **Concepto**: El uso de rangos solapados pero no idénticos en `useTransform` crea una jerarquía visual que a veces puede percibirse como desordenada si los elementos están muy cerca físicamente.
- **Fix**: Para elementos que forman parte del mismo "footer visual", usar rangos idénticos.

---

## Gotchas

- [ ] El Footer tiene un `border-t` que podría verse antes de tiempo si no se maneja bien la opacidad del contenedor.

---

*PRP pendiente aprobación. No se ha modificado código.*
