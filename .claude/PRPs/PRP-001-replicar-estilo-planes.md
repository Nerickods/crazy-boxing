# PRP-001: Replicación de Estilo Testimonios en Sección de Planes

> **Estado**: PENDIENTE
> **Fecha**: 2026-02-19
> **Proyecto**: Crazy Boxing

---

## Objetivo

Replicar el efecto visual de tarjetas y el desplazamiento infinito (marquee) de la sección de testimonios en la sección de planes, unificando el llamado a la acción (CTA) en un único botón debajo del carrusel.

## Por Qué

| Problema | Solución |
|----------|----------|
| La sección de planes actual se siente estática y desconectada visualmente del estilo premium de los testimonios. | Implementar el efecto "glassmorphism" y el movimiento infinito para aumentar el dinamismo y cohesión visual. |
| Múltiples CTAs individuales pueden generar fatiga de decisión o ruido visual en un carrusel dinámico. | Consolidar la acción en un único botón global "Agendar Clase" debajo del carrusel. |

**Valor de negocio**: Mejora en la experiencia de usuario (UX) mediante una narrativa visual coherente y un flujo de conversión más limpio.

## Qué

### Criterios de Éxito
- [ ] Las tarjetas de planes utilizan el estilo `backdrop-blur` y bordes sutiles de los testimonios.
- [ ] Los planes se desplazan en un bucle infinito (marquee) fluido.
- [ ] No existen botones individuales dentro de las tarjetas de planes.
- [ ] Un único botón de "Agendar Clase de Prueba" se encuentra centrado debajo de la sección de planes.
- [ ] El carrusel se pausa al pasar el mouse (hover).

### Comportamiento Esperado
El usuario llega a la sección de planes y ve un flujo continuo de opciones que se desplazan de derecha a izquierda. Las tarjetas tienen un efecto de vidrio esmerilado que se ilumina al pasar el cursor. Debajo de este flujo, un botón prominente invita al usuario a realizar la acción principal.

---

## Contexto

### Referencias
- `src/features/experience/components/TestimonialsSection.tsx` - Marquee logic
- `src/shared/components/ui/testimonial-card.tsx` - Card visual style
- `src/features/plans/components/PlansSection.tsx` - Target section
- `src/features/plans/components/PlanCard.tsx` - Target card

### Arquitectura Propuesta
No hay cambios en la estructura de archivos, solo refactorización de componentes existentes dentro de `plans` feature.

---

## Blueprint (Assembly Line)

### Fase 1: Refactorización de PlanCard
**Objetivo**: Aplicar estilos visuales de `TestimonialCard` y eliminar el botón interno.
**Validación**: Las tarjetas muestran el efecto glass y no tienen CTAs.

### Fase 2: Implementación de Marquee en PlansSection
**Objetivo**: Reemplazar el layout de grid/snapping actual por un sistema de marquee infinito.
**Validación**: Los planes rotan infinitamente sin cortes.

### Fase 3: Integración de CTA Global
**Objetivo**: Añadir el botón `UiverseButton` global debajo del carrusel.
**Validación**: El botón es visible, centrado y funcional (navega al formulario).

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] Responsividad en móviles (marquee adaptado)
- [ ] Hover states funcionando

---

## Gotchas
- El marquee requiere duplicar los elementos del array para un loop invisible.
- El ancho de las tarjetas debe ser consistente (`fixed width`) para evitar saltos en la animación.

## Anti-Patrones
- No introducir librerías de carrusel externas si el CSS Marquee ya está configurado en el proyecto.

---

*PRP pendiente aprobación. No se ha modificado código.*
