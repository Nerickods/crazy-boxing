# PRP-032: Sincronización de Título Cinemático (BenefitsList)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-29
> **Proyecto**: landing-linkedin

---

## Objetivo

Eliminar el salto brusco de layout y asegurar que el título "KIA Intelligence Product" se mantenga **fijado (pinned)** y visible durante toda la secuencia de beneficios, desapareciendo únicamente cuando se ha completado el scroll de todas las tarjetas de producto.

## Por Qué

| Problema | Solución |
|----------|----------|
| El título salta al entrar en la sección debido a una animación `whileInView` independiente del motor GSAP. | Eliminar la animación externa y dejar que el título herede el estado de entrada sincronizado del componente base. |
| El texto "sube" y desaparece a mitad de la sección, dejando las fotos sin contexto jerárquico. | Inyectar el título dentro del contenedor `fixed` de `FullScreenScrollFX` para que sea persistente (Sticky) durante el pinning de la sección. |

**Valor de negocio**: Mejora la retención visual y la claridad del producto. Un diseño que "salta" o se rompe en móvil proyecta falta de profesionalismo; corregirlo refuerza la estética premium de la marca "Elite".

## Qué

### Criterios de Éxito
- [ ] El título "KIA Intelligence Product" aparece de forma fluida al entrar en la sección.
- [ ] El título permanece en la parte superior de la pantalla durante las 3 secciones de beneficios (Landing, Vendedor IA, Dashboard).
- [ ] Cero saltos bruscos (`layout jumps`) al transicionar desde `AuthorityGuide`.
- [ ] Legibilidad total en móvil sin solaparse con el contenido de las tarjetas.

### Comportamiento Esperado
Al scrollear desde la historia del fundador (`AuthorityGuide`), la pantalla se bloquea suavemente (pinning). El título "KIA Intelligence Product" aparece en la parte superior y se queda ahí, estático y elegante, mientras las tarjetas de beneficios y los fondos fotográficos fluyen por debajo. Solo cuando el usuario termina de ver el último beneficio (Dashboard), el título sube y desaparece con el resto de la sección.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` - Componente a modificar.
- `src/shared/components/ui/full-screen-scroll-fx.tsx` - Motor de scroll a utilizar.

### Arquitectura Propuesta
No se requiere nueva arquitectura, solo un refactor de la implementación actual en `BenefitsList.tsx` para pasar el JSX del título a través de la prop `header` de `FullScreenScrollFX`.

---

## Blueprint (Assembly Line)

### Fase 1: Refactor de Inyección de Header
**Objetivo**: Mover el JSX del título desde el nivel raíz de `BenefitsList` hacia la prop `header` de `FullScreenScrollFX`.
**Validación**: El título aparece dentro del componente de scroll y se mantiene visible (fijo) mientras el fondo cambia.

### Fase 2: Sincronización de Opacidad y Entrada
**Objetivo**: Ajustar los estilos de `fx-header` en `FullScreenScrollFX.tsx` para que el título tenga el espaciado correcto en móvil (usando `top-[6vh]`).
**Validación**: El título no colisiona con el Notch o el borde superior en dispositivos pequeños.

### Fase 3: Validación de Transición "Seamless"
**Objetivo**: Eliminar el `Spacer for manual header` anterior y asegurar que el snap de inicio sea fluido.
**Validación**: Scroll continuo desde `AuthorityGuide` sin saltos visuales.

---

## Gotchas
- [ ] `FullScreenScrollFX` maneja su propio z-index; el header debe estar por encima de las capas de contenido pero por debajo de posibles modales.
- [ ] En móvil, el espacio es crítico; el `text-3xl` podría requerir un ajuste a `text-2xl` si se solapa con las tarjetas Pro.

---

*PRP pendiente aprobación. No se ha modificado código.*
