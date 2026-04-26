# PRP-068: Rediseño y Migración de UI para el Caso de Estudio (MMA Academy)

## 1. Problema Identificado (User Context)
La implementación actual de la subpágina `/casostudy/mma-academy` en el proyecto de KIA Intelligence no cumple con los estándares estéticos y de experiencia de usuario (UI/UX) esperados por el cliente. Actualmente utiliza una serie de componentes fragmentados (`StitchMmaProblemGrid`, `StitchMmaProcessTimeline`, etc.) que generan un diseño sobrecargado.
El objetivo es reemplazar completamente esta interfaz extrayendo y adaptando el diseño de la subpágina equivalente del proyecto `perfil` (`/work/mma-academy-landing`), el cual posee un layout más limpio, elegante y probado.

## 2. Investigación y Mapeo de Contexto
He analizado ambas bases de código para estructurar la migración:

- **Proyecto Destino (`landing-linkedin`):**
  - La data reside en `src/features/portfolio/data/mma-academy.ts`.
  - El diseño base debe respetar el envoltorio `GlassRefractionBackground`, incluir el `<Header />`, `<Footer />` y el `EnrollmentModal`.
  - El branding es "Premium Cinematic", caracterizado por fondos oscuros y acentos esmeralda/cyan (ej. `#00FF9D`).

- **Proyecto Origen (`perfil`):**
  - La UI en `src/app/work/[slug]/page.tsx` fluye semánticamente: un Hero limpio con metadatos (Rol, Año, Duración), un contenedor destacado para multimedia, seguido por secciones bien definidas (Problema, Proceso, Solución, Tecnologías) y un grid de Resultados en la parte inferior con enlaces de acción.
  - El diseño descansa sobre contenedores estandarizados (`section-container`, `max-w-4xl`) en lugar de depender de múltiples componentes aislados.

## 3. Blueprint de la Solución (Proposed Changes)
El plan consiste en reescribir por completo el archivo `src/app/(main)/casostudy/mma-academy/page.tsx`, importando la estructura HTML del proyecto `perfil` pero aplicando las clases de Tailwind y estilos visuales propios del branding de KIA Intelligence.

### src/app/(main)/casostudy/mma-academy

#### [MODIFY] page.tsx
Reescribir el archivo de la siguiente manera:
1. **Layout y Wrapper**: Mantener `GlassRefractionBackground` y fondo oscuro.
2. **Hero Section**: Mostrar el `title`, `subtitle` y la metadata (`client`, `role`, `year`, `duration`) usando textos en `slate-300` y acentos de color esmeralda.
3. **Showcase / Imagen**: Recrear el contenedor de aspecto visual ("aspect-video") con un estilo `glassmorphism` (bordes translúcidos) para la presentación del proyecto.
4. **Contenido Analítico (Problema, Solución, Proceso)**: 
   - Renderizar como flujo de lectura limpio (max-w-4xl) al centro.
   - Reemplazar los emojis nativos del proyecto `perfil` por acentos minimalistas o íconos sutiles (ej. destellos de luz con tailwind).
5. **Pila Tecnológica**: Mostrar las tecnologías en pastillas (badges) translúcidas.
6. **Resultados (Grid)**: Implementar las 3 tarjetas de resultados usando un estilo similar a los "Glass Cards" premium, con números degradados (gradient-text) en tonos cyan.
7. **CTA Final**: Mantener los enlaces de acción integrados directamente en la vista.

## 4. Verification Plan
- **Revisión en Desktop y Mobile**: Validar que los márgenes (`py-20`, `mb-16`) mantengan la fluidez de lectura.
- **Data Binding**: Confirmar que toda la información provista en `mmaAcademyData` se pinta correctamente en pantalla.
- **Branding Check**: Verificar que el esquema de colores coincide con la paleta principal (dark mode + acentos emerald/cyan) y no hereda estilos incompatibles del proyecto anterior.
