# PRP-053: Mobile Vertical Progress Bar — Benefits Section

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Habilitar la visualización de la barra de progreso vertical en dispositivos móviles (actualmente restringida a desktop con `hidden md:flex`) ajustando las proporciones, el posicionamiento y los márgenes de las tarjetas de beneficios (`FeatureGrid`) para evitar solapamientos y asegurar una experiencia de usuario premium en todos los tamaños de pantalla.

## Por Qué

| Problema | Solución |
|----------|----------|
| La barra de progreso vertical desaparece completamente en dispositivos móviles debido a las clases responsivas previas. | Habilitar la barra en mobile removiendo el `hidden md:flex` y ajustando el layout. |
| El espacio horizontal en mobile es muy reducido, si simplemente activamos la barra se solapará con el contenido de las tarjetas. | Reducir el tamaño/escala de la barra en mobile y añadir padding derecho (`pr-12` o similar) al contenedor de las tarjetas (`FeatureGrid` o `fx-featured-content`). |

**Valor de negocio**: Mantiene la consistencia de la experiencia UX/UI premium a través de todos los dispositivos. Un porcentaje altísimo de leads proviene de tráfico móvil, por lo que las señales de navegación (como esta barra) son críticas para la retención y comprensión de los pilares de KIA Intelligence.

## Qué

### Criterios de Éxito
- [ ] La barra de progreso vertical es visible en dispositivos móviles (pantallas `< 768px`).
- [ ] La barra está correctamente escalada para mobile (ej: altura `h-[200px]`, posicionamiento ajustado a `right-2` o `right-4`).
- [ ] El contenedor de tarjetas (`FeatureGrid` o equivalente) recibe un padding derecho adicional en mobile para que las tarjetas no se superpongan visualmente con la barra.
- [ ] El diseño sigue siendo pixel-perfect y el scroll-trigger GSAP no presenta saltos ni parpadeos (jank) tras el ajuste.

### Comportamiento Esperado
1. Un lead entra desde su iPhone a la Landing Page.
2. Al llegar a la sección de beneficios (`BenefitsList.tsx`), observa en el borde derecho una delgada línea de progreso cian, con los números `01` y `03`.
3. Conforme hace scroll para leer los beneficios, la barra se llena de forma idéntica a la versión de escritorio, guiándole claramente a lo largo de las 3 secciones (Lander, Agente IA, Dashboard).
4. El contenido de texto e iconos de las tarjetas respeta un margen seguro respecto a la barra.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` - Ubicación actual de la barra y de `FeatureGrid`.
- `src/shared/components/ui/full-screen-scroll-fx.tsx` - Sistema base que maneja el z-index y el layout interno.

### Arquitectura Propuesta (Feature-First)
No se requieren nuevas carpetas ni archivos, la modificación reside 100% en `BenefitsList.tsx`.

La barra de progreso tiene este layout:
```tsx
<div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 h-[300px] w-6 flex-col items-center z-[100] pointer-events-none group">
```
Esto deberá cambiar a:
```tsx
<div className="flex absolute right-1 md:right-8 top-1/2 -translate-y-1/2 h-[200px] md:h-[300px] w-6 flex-col items-center z-[100] pointer-events-none group scale-[0.8] md:scale-100 origin-right">
```

Y el componente `FeatureGrid` o su contenedor principal deberá ajustar su padding:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-7xl px-4 pr-10 md:pr-4 md:px-4 mt-3 md:mt-12 pb-16">
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Habilitar barra en Mobile y ajustar escala
**Objetivo**: Modificar las clases de CSS Tailwind en el div contenedor de la barra de progreso para eliminar `hidden` e introducir variables de tamaño responsivo (e.g., `right-2 md:right-8`, escalado u offset vertical específico si `h-[200px]` en mobile vs `h-[300px]`).
**Validación**: Inspeccionando en vista mobile, la barra es visible en el borde derecho.

### Fase 2: Ajustar márgenes y padding de las tarjetas (Feature Content)
**Objetivo**: Aplicar padding derecho exclusivo en móvil a la cuadrícula de tarjetas o al contenedor global inyectado (`fx-featured-content` o en `FeatureGrid`) para asegurar que todo el texto renderice a la izquierda de la barra y sin overlapping.
**Validación**: Las tarjetas se encogen/adaptan correctamente sin que el texto "gotee" por debajo del área que ocupa la nueva barra lateral.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando end-to-end en todas las resoluciones
**Validación**:
- [ ] `npm run typecheck` pasa sin problemas.
- [ ] Las responsividades 100% pulidas. En tablet (ej: iPad 768px), también se ve impecable.
- [ ] No existen problemas de interacción táctil con la barra (asegurarse de dejar o mantener `pointer-events-none`).

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

*(Espacio en blanco, se actualizará tras la fase de desarrollo)*

---

## Gotchas

- [ ] Hay que cerciorarse de que el texto lateral vertical (`Beneficios KIA`) no se solape con el borde de la pantalla o de las tarjetas en tamaños de pantalla intermedios. Ocultarlo completamente en movil seria buena idea si no cabe.
- [ ] Evitar introducir CSS-in-JS o lógicas complejas; con las utilidades `sm:`, `md:`, `lg:` de Tailwind debería bastar para resolver el redimensionamiento.

## Anti-Patrones

- NO usar Media Queries manuales si Tailwind puede hacerlo.
- NO depender de JavaScript (`window.innerWidth`) para manejar la visibilidad u opacidad de este elemento visual cuando CSS grid/flex basta.

---

*PRP pendiente aprobación. No se ha modificado código.*
