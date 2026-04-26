# PRP-005: Global Footer Unification

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-19
> **Proyecto**: KIA Intelligence Landing

---

## Objetivo

Replicar el diseño minimalista de navegación del footer (creado en la subpágina MMA Academy) y unificarlo globalmente para reemplazar el diseño de píldora flotante actual en las vistas de Home (`LandingCta.tsx`), Services (`ServicesCta.tsx`), y dentro del mismo caso de estudio.

## Por Qué

| Problema | Solución |
|----------|----------|
| Código duplicado de múltiples tipos de footers anidados en CTAs interactivos. | Extraer y centralizar el footer en un único componente exportable (`Footer.tsx`). |
| Inconsistencia visual ("píldora" vs borde superior clásico minimalista). | Adoptar el UI de Stitch como el "North Star", estandarizando los links requeridos ("Inicio", "Servicios", "LinkedIn"). |

**Valor de negocio**: Mantenibilidad bajo los principios SOLID (Single Responsibility) y DRY. Al centralizar la navegación, futuros cambios (agregar otra red social o cambiar un link) impactan toda la aplicación instantáneamente, ahorrando tiempo.

## Qué

### Criterios de Éxito
- [ ] El componente en `src/features/landing-page/components/Footer.tsx` es el único depositario del diseño del footer.
- [ ] `LandingCta.tsx` usa este componente sin romper su animación de scroll de revelado final.
- [ ] `ServicesCta.tsx` usa este componente sin romper su animación de scroll.
- [ ] `StitchMmaFinalCta.tsx` borra su footer harcodeado y adopta `<Footer />`.
- [ ] Opciones redundantes o desalineadas han sido eliminadas dejando solo ("Inicio", "Servicios", Icono LinkedIn Lucide).

### Comportamiento Esperado
En el Home y en `/services`, al scrollear hasta el fondo de la página, el CTA se revelará de la misma forma que ya lo hace, pero el diseño en la parte inferior será el footer con estilo "Minimalista Stitch" (`border-t border-cyan-500/20`), sin fondos en píldora o sobrecargas pesadas en móviles, alineado correctamente.

---

## Contexto

### Referencias
- `src/features/portfolio/components/StitchMmaFinalCta.tsx` - Base del diseño deseado para portar.
- `src/features/landing-page/components/LandingCta.tsx` - Reemplazo requerido en líneas 156-198.
- `src/features/services/components/ServicesCta.tsx` - Reemplazo requerido en líneas 155-198.

### Arquitectura Propuesta (Feature-First)
El footer, al ser una pieza puramente de navegación visual agnóstica a un feature complejo, puede residir globalmente o bien en el feature principal de *landing-page* que rige la app:
```
src/features/landing-page/components/Footer.tsx
```
Dado que Next.js ya lo importa así, lo usaremos como maestro.

---

## Blueprint (Assembly Line)

### Fase 1: Estandarización del Componente Maestro
**Objetivo**: Convertir el diseño de `StitchMmaFinalCta.tsx` en el componente reutilizable de `Footer.tsx`.
**Validación**: `Footer.tsx` modificado con los estilos definidos y libre de props atados a componentes vecinos.

### Fase 2: Integración en Home y Services
**Objetivo**: Importar `<Footer />` dentro de las animaciones `motion.div` dedicadas en los componentes `LandingCta.tsx` y `ServicesCta.tsx`, reemplazando el JSX en duro en forma de píldora actual.
**Validación**: Integración sin fallos visuales en el DOM para ambos wrappers interactivos.

### Fase 3: Limpieza Global de Redundancia
**Objetivo**: Reemplazar en `StitchMmaFinalCta.tsx` el footer por el nuevo `<Footer />` importado.
**Validación**: DRY conseguido, `npm run typecheck` pasa en su totalidad evitando conflictos de TS o imports fantasmas como `Linkedin` que ya no serán usados allí.

---

## Gotchas

- [ ] `LandingCta` tiene `padding-x (px-6)` sobre el `motion.div`. El nuevo footer usa max-w-7xl. Consideraremos cómo colisionan las áreas para evitar barras de desplazamiento.
- [ ] `motion.div` aplica opacidad en un `bottom-8` lo que implica elementos absolutos. El nuevo footer no es un "absolute pill". Habrá que ajustar para que rinda a un `bottom-0` en los CTAs animados para que actúe como ancla tradicional en la finalización del scroll.

## Anti-Patrones

- NO añadir configuraciones de colores estáticos si podemos depender de utilidades Tailwind estándar del sistema (`cyan`, `emerald`, `slate`).

---

*PRP pendiente aprobación. No se ha modificado código.*
