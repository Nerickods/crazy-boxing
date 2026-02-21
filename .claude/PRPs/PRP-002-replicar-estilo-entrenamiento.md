# PRP-002: Replicación de Estilo en Sección de Entrenamiento

> **Estado**: PENDIENTE
> **Fecha**: 2026-02-19
> **Proyecto**: Crazy Boxing

---

## Objetivo

Replicar el efecto visual de tarjetas (glassmorphism) y el desplazamiento infinito (marquee) en la cuadrícula de beneficios de la sección de Entrenamiento (TrainingProgramSection), alineando la estética con las secciones de Testimonios y Planes.

## Por Qué

| Problema | Solución |
|----------|----------|
| Los beneficios del programa de entrenamiento se presentan en una cuadrícula estática que rompe el flujo dinámico del sitio. | Implementar el sistema de marquee infinito para los beneficios. |
| El estilo visual de las tarjetas de beneficios es básico comparado con el nuevo estándar premium de glassmorphism. | Aplicar el efecto de vidrio esmerilado, bordes sutiles y estados de hover iluminados. |

**Valor de negocio**: Coherencia de marca y percepción de calidad premium en toda la landing page.

## Qué

### Criterios de Éxito
- [ ] Las tarjetas de beneficios utilizan `backdrop-blur` y bordes `border-white/5`.
- [ ] Los beneficios se desplazan en un bucle infinito (marquee).
- [ ] El carrusel se pausa al pasar el mouse (hover).
- [ ] El diseño es responsivo y se adapta correctamente a pantallas pequeñas.

### Comportamiento Esperado
El usuario ve el manifiesto de la academia y, debajo, un flujo continuo de "beneficios" o "pilares" que se desplazan lateralmente. Cada tarjeta reacciona al cursor con un brillo cian característico.

---

## Contexto

### Referencias
- `src/features/plans/components/PlanCard.tsx` - Nuevo estándar de tarjeta
- `src/features/plans/components/PlansSection.tsx` - Marquee implementation
- `src/features/training/components/TrainingProgramSection.tsx` - Target section

### Arquitectura Propuesta
Refactorización interna del componente `TrainingProgramSection.tsx`.

---

## Blueprint (Assembly Line)

### Fase 1: Refactorización de Beneficios (Cards)
**Objetivo**: Transformar el estilo de las tarjetas de beneficios a glassmorphism.
**Validación**: Las tarjetas tienen el mismo Look & Feel que las de planes.

### Fase 2: Implementación de Marquee
**Objetivo**: Sustituir el scroll horizontal actual por un marquee infinito Duplicate-based.
**Validación**: Desplazamiento fluido y continuo.

### Fase 3: Puliendo el Manifiesto
**Objetivo**: Ajustar sutilmente el estilo del cuadro de manifiesto para que no desentone con el nuevo carrusel.
**Validación**: Armonía visual en toda la sección.

---

## Gotchas
- Con solo 3 beneficios, se necesita multiplicar el array al menos 4-6 veces para que el marquee se sienta "lleno" en pantallas anchas.

## Anti-Patrones
- No crear componentes de tarjeta externos si solo se usan en esta sección (mantener local si es específico).

---

*PRP pendiente aprobación. No se ha modificado código.*
