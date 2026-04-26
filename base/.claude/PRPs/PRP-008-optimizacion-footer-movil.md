# PRP-008: Optimización Móvil - CTA Final y Footer

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-22
> **Proyecto**: KIA Intelligence

---

## Objetivo

Ajustar el layout de la sección final (`LandingCta`) y el `Footer` para dispositivos móviles, eliminando el solapamiento visual y garantizando que tanto el CTA como la información del footer se muestren de forma armónica y legible en viewports cortos.

## Por Qué

| Problema | Solución |
|----------|----------|
| En móviles, el footer absoluto tapa el contenido del CTA centrado (HeroButton y avisos). | Refactorizar el layout para usar un posicionamiento dinámico o reducir el padding vertical en móviles. |
| Sensación de amontonamiento ("amontonado") en la última fase del scroll. | Ajustar las interpolaciones de Framer Motion para dar más "aire" a los elementos finales. |

**Valor de negocio**: Mejora la confianza y la claridad en el punto más crítico de conversión (el botón final). Un footer que tapa advertencias de precios o el botón mismo reduce drásticamente el CTR.

## Qué

### Criterios de Éxito
- [ ] Sin solapamiento entre el `HeroButtonExpendable` y el `Footer` en viewports de hasta 600px de altura.
- [ ] Lectura clara del aviso de incremento de precios (+30%) en móvil.
- [ ] El footer mantiene su funcionalidad (links y logo) pero con un footprint vertical reducido.
- [ ] Transición fluida (smooth) entre la fase de urgencia y la fase final.

### Comportamiento Esperado
Al llegar al final de la landing page, el usuario verá el CTA final ("Start your deployment today") con sus avisos correspondientes. A medida que completa el último tramo del scroll, el footer emergerá desde abajo sin "chocar" con el botón, posiblemente empujando o adaptando la posición del CTA para mantener la armonía visual.

---

## Contexto

### Referencias
- `src/features/landing-page/components/LandingCta.tsx` - Componente principal a modificar.
- `src/features/landing-page/components/Footer.tsx` - Componente de footer a optimizar.
- `src/features/services/components/ui/HeroButtonExpendable.tsx` - El disparador del modal.

### Arquitectura Propuesta (UI/UX Refinement)
No se requiere nueva arquitectura de carpetas, sino una refactorización de estilos y lógica de animación:

1.  **Footer Compacto**: Implementar clases condicionales en `Footer.tsx` para reducir paddings (`py-10` -> `py-6`) y gaps en pantallas móviles.
2.  **LandingCta Mobile Adjustments**: 
    - Cambiar `justify-center` por `justify-start pt-[15vh]` o similar en el contenedor del CTA en móviles.
    - O aumentar el `h-[180vh]` a `h-[200vh]` para dilatar el espacio de scroll entre fases.
3.  **Scroll Interpolation Fix**: Ajustar el `y` transform del `Footer` y del `CTA` para que coordinen su aparición sin invadir el espacio del otro.

---

## Blueprint (Assembly Line)

### Fase 1: Optimización del Footer
**Objetivo**: Crear una versión "compacta" del footer para dispositivos móviles.
**Validación**: El footer debe ocupar menos de 250px de altura en pantallas < 768px.

### Fase 2: Refactorización de LandingCta
**Objetivo**: Ajustar la posición absoluta del CTA y las animaciones de Framer Motion.
**Validación**: El CTA no debe solaparse con el Footer al llegar al `scrollYProgress === 1`.

### Fase 3: Validación Final y QA
**Objetivo**: Sistema funcionando end-to-end con estética premium.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Verificación en múltiples viewports (Mobile S, M, L).
- [ ] Criterios de éxito cumplidos.

---

## 🧠 Aprendizajes (Self-Annealing)

### [2026-04-22]: Viewport Shortage Awareness & Sticky Layouts
- **Error**: El uso de `absolute inset-0 flex justify-center` dentro de un contenedor `h-screen` asume que el contenido siempre cabe, ignorando elementos hijos absolutos como el Footer que consumen espacio real en el eje Y.
- **Fix**: Usar transformaciones negativas (`-translate-y`) responsivas para desplazar el contenido central hacia arriba en móviles y aumentar la altura del contenedor de scroll (`200vh`) para dilatar el espacio entre fases de animación.
- **Aplicar en**: Secciones con scroll-reveal de footer integrado.

---

## Gotchas

- [ ] **Sticky vs Absolute**: El contenedor es `sticky`, pero el contenido es `absolute`. Esto puede causar saltos si no se maneja bien el `will-change`.
- [ ] **Safe Areas**: Recordar los `env(safe-area-inset-bottom)` en dispositivos iOS.

## Anti-Patrones

- NO usar `!important` para forzar paddings.
- NO romper la consistencia de los colores (emerald/cyan) definidos en el sistema.

---

*PRP pendiente aprobación. No se ha modificado código.*
