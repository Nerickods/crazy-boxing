# PRP-002: FAQ Header Sync & Logo Integration

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-18
> **Proyecto**: KIA Intelligence

---

## Objetivo

Replicar el estilo de encabezado con logo centralizado de la sección de "Proceso" en la sección de "FAQ" (`FaqAccordion.tsx`), asegurando la sincronización visual y lógica de la aparición del logo en el header global mediante el `chatStore`.

## Por Qué

| Problema | Solución |
|----------|----------|
| Inconsistencia visual entre secciones que usan el estilo de "cápsula". | Estandarizar el patrón de transición entre secciones usando el `SectionSeparator`. |
| Falta de refuerzo de marca en el footer/FAQ. | Integrar el `LogoIsotype` con animación `whileInView` para mantener la autoridad visual. |

**Valor de negocio**: Mejora la percepción de calidad "Apple-level" del sitio y mantiene al usuario orientado mediante la sincronización del logo en el scroll.

## Qué

### Criterios de Éxito
- [ ] La sección de FAQ comienza con el logo centralizado cruzando la línea horizontal.
- [ ] La animación del logo (`scale` y `opacity`) funciona correctamente al entrar en el viewport.
- [ ] El scroll sincroniza la aparición del logo en el Navbar global cuando el logo de FAQ desaparece por la parte superior (si es el último logo en scrollear).
- [ ] Se mantiene la estética de "Cápsula" con bordes redondeados y efectos de glow.

### Comportamiento Esperado
Al llegar a la sección de FAQ, el usuario verá una línea horizontal elegante que se abre para dar paso al isotipo de KIA Intelligence. Al seguir bajando, el logo se desvanece y "reaparece" (lógicamente) en la barra de navegación superior.

---

## Contexto

### Referencias
- `src/features/landing-page/components/ProcessSection.tsx` - Patrón de implementación.
- `src/features/landing-page/components/SectionSeparator.tsx` - Componente core a reutilizar.

### Arquitectura Propuesta (Feature-First)
No se requieren nuevos archivos. Se modificará el componente existente en el feature `landing-page`.

---

## Blueprint (Assembly Line)

### Fase 1: Análisis y Preparación
**Objetivo**: Confirmar offsets y márgenes negativos para que la transición entre el fondo negro y la cápsula sea fluida.
**Validación**: Revisión de los componentes `SectionSeparator` y `FaqAccordion`.

### Fase 2: Implementación en FaqAccordion
**Objetivo**: Reemplazar el bloque de `pt-20` estático por el `SectionSeparator` envuelto en un contenedor de transición.
**Validación**: Verificación visual de los paddings y márgenes.

### Fase 3: Validación de Sincronización
**Objetivo**: Asegurar que el `IntersectionObserver` del nuevo separador interactúa correctamente con el `chatStore`.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Prueba visual de scroll: el logo del header aparece en el momento justo.

---

## Gotchas

- [ ] El margen negativo (`-mt-20`) en el contenedor de `SectionSeparator` debe estar equilibrado con el `pt-20` del contenedor padre para evitar saltos visuales.
- [ ] `SectionSeparator` ya incluye lógica de `IntersectionObserver`, por lo que añadir otra instancia es seguro pero debe verificarse el comportamiento del flag `hasLogoInHeader`.

## Anti-Patrones

- NO añadir CSS custom si se puede resolver con utilidades de Tailwind.
- NO duplicar la lógica de `SectionSeparator` dentro de `FaqAccordion`; usar el componente compartido.

---

*PRP pendiente aprobación. No se ha modificado código.*
