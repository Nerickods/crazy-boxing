# PRP (Product Requirements Proposal): Services CTA Scroll Animation

**Objetivo:** Adaptar el componente `ServicesCta.tsx` para incorporar el comportamiento cinemático atado al scroll (Sticky Scroll) del componente `PasSection.tsx`.
**Por qué:** Para armonizar la experiencia premium entre las distintas secciones fundamentales, ofreciendo un cierre hipnótico en lugar de un bloque estático tradicional.

## Criterios de Éxito
1. Fluidez en Framer Motion (`useScroll`, `useTransform`, `useSpring`), anclada al visor sin lags.
2. Contenedor Sticky: El texto final y botón de acción se mostrarán estáticos en pantalla mientras dura la transición temporal generada por el `250vh`.
3. Efecto Cascado Inverso (Scale + Y Fade): La transición de entrada del CTA final de "Get in touch" imitará explícitamente el fragmento `y: useTransform(progress, [0.89, 0.95], [40, 0])` referenciado.

## Comportamiento Esperado (Happy Path)
1. El visitante baja por `ModulesTabs`.
2. Al llegar a `ServicesCta`, el layout entra en modo 'Sticky' bloqueando la página en un fondo negro/verde oscuro con un resplandor ambiental estático (`opacity: bgOpacity`, `scale: bgScale`).
3. Aparece con `y: -100` y `opacity: 1 -> 0` una leyenda de pre-remate (ej. *"AI is here..."*).
4. Luego, la frase núcleo ("We build For Those Few") crece en escala y se instala.
5. El scroll final (`[0.85, 1.0]`) destapa el resplandor focal definitivo y atrae el Botón Principal ascendiendo `[40px -> 0px]` hacia el centro.
6. El scroll finaliza y suelta el anclaje, permitiendo descubrir el Footer a continuación.

## Blueprint de Fases

### Fase 1: Envoltorio Sticky e "useScroll"
- Envolver `ServicesCta.tsx` en contenedor `h-[250vh]`.
- Implementar `sticky top-0 h-screen` interior.

### Fase 2: Mapeo de Ejes
- Crear animaciones `opacity`, `scale` y `y` para Bloque de Texto 1 (progreso: `0.1` -> `0.45`).
- Crear animaciones para Bloque de Texto 2 (progreso: `0.3` -> `0.7`).

### Fase 3: Remate Final de CTA
- Refactorizar el Bottom-CTA para coincidir con la transición original y estilo del botón de `PasSection`.

### Fase 4: QA 
- Garantizar responsividad (`md:text-5xl`) e inspeccionar el overlapping con el `<Footer/>` (evitar layouts rotos).

---

## Aprendizajes 
*(Por documentar post-implementación)*
