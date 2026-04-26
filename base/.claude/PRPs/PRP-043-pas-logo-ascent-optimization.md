# PRP-043: Optimización de Ascenso Logo & Marca (PasSection)

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-05
> **Proyecto**: KIA Intelligence

---

## Objetivo

Sincronizar el desplazamiento vertical del logo y el nombre de marca con la aparición del texto del CTA final en la `PasSection`, eliminando latencias estáticas para que "suban a la par" y alcancen su posición final de forma más rápida y fluida.

## Por Qué

| Problema | Solución |
|----------|----------|
| El logo aparece centrado y se queda estático antes de subir, lo que genera una desconexión visual con el texto del CTA que aparece después. | Eliminar la fase estática del logo y sincronizar su ascenso con una nueva animación de entrada (Y-axis) del texto del CTA. |

**Valor de negocio**: Mejora la percepción de calidad ("premium feel") en el punto crítico de conversión de la landing page (el final del storytelling PAS).

## Qué

### Criterios de Éxito
- [ ] El logo y el nombre de marca comienzan a subir inmediatamente después de alcanzar el 100% de opacidad.
- [ ] El texto del CTA ("Control Absoluto") tiene un desplazamiento ascendente sincronizado con el logo.
- [ ] La animación total del cierre de la sección se siente más rápida y decidida.
- [ ] No se introducen regresiones en el layout responsive (mantenimiento de `will-change` y `transform`).

### Comportamiento Esperado
Al llegar al final del scroll de la `PasSection`:
1. El logo KIA Intelligence aparece (fade-in).
2. Tan pronto como es visible, inicia un ascenso fluido hacia la parte superior.
3. Simultáneamente, el texto "Control Absoluto" y el copy del CTA aparecen desde abajo deslizándose hacia arriba a la par del logo.
4. Ambos elementos llegan a sus posiciones finales de reposo de forma coordinada.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Componente principal a modificar.
- `framer-motion` - Librería de animaciones utilizada (useTransform, useScroll).

### Arquitectura Propuesta
Se realizarán cambios exclusivamente en las funciones de transformación de movimiento dentro de `PasSection.tsx`:
1.  **LogoBrandFlow**: Ajustar los keyframes de `y` para eliminar el "stop" en `[0.88, 0.90]`.
2.  **Final CTA motion.div**: Reemplazar `y: 0` por un `useTransform` que desplace el contenido hacia arriba sincronizado con el logo.

---

## Blueprint (Assembly Line)

### Fase 1: Ajuste del Logo (LogoBrandFlow)
**Objetivo**: Eliminar la pausa estática y suavizar el ascenso del logo.
**Validación**: Revisión de código de los rangos de `useTransform` (de `[0.88, 0.90, 0.94, 1]` a un flujo continuo).

### Fase 2: Animación del CTA Final
**Objetivo**: Implementar desplazamiento vertical (`y`) reactivo al scroll para el contenedor del CTA.
**Validación**: El `style` del contenedor del CTA debe incluir una propiedad `y` dinámica.

### Fase 3: Validación Técnica
**Objetivo**: Asegurar que el componente compile y no tenga errores de tipos.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Revisión manual de la lógica de rangos (scroll progress entre 0.88 y 0.96).

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### [2026-04-05]: Inicialización del PRP
- Propuesta de sincronización de ejes Y entre logo y CTA.

---

## Gotchas

- **Scroll Overlap**: El ascenso del logo termina en `0.94` pero el CTA alcanza su opacidad total en `0.96`. Debemos asegurar que el movimiento visual no se "corte" abruptamente.
- **Performance**: Mantener `willChange: "transform, opacity"` para evitar repaints costosos en móvil durante la traslación simultánea.

## Anti-Patrones

- NO usar estados globales (`useState`) para disparar estas animaciones; deben ser puramente reactivas al `scrollYProgress` para máxima fluidez.
- NO aumentar el `h-[900vh]` de la sección; el ajuste debe caber en el espacio de scroll actual.

---

*PRP completado y verificado con typecheck.*
