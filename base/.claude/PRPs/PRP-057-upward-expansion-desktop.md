# PRP-057: Upward Expansion Logic — Desktop Benefits

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Modificar el comportamiento de expansión de las tarjetas en la sección de beneficios (`BenefitsList.tsx`) para que, en dispositivos de escritorio, se abran **hacia arriba** en lugar de hacia abajo. Esto implica cambiar el punto de anclaje vertical del grid de `items-start` a `items-end`.

## Por Qué

| Problema | Solución |
|----------|----------|
| La expansión hacia abajo empuja el contenido inferior (otros módulos o secciones), lo que puede causar saltos visuales incómodos si el usuario está cerca del final de la pantalla. | Cambiar la alineación a `items-end`. Esto fija la base de la tarjeta a la fila del grid, provocando que cualquier aumento de altura (expansión de contenido) empuje la cabecera del módulo hacia arriba, manteniendo el "suelo" de la sección estable. |

**Valor de negocio**: Refina la experiencia de navegación cinemática al evitar que el usuario pierda su punto de referencia visual (el final de la sección) cuando interactúa con las tarjetas.

## Qué

### Criterios de Éxito
- [ ] En escritorio (`md:` y superiores), al hacer clic en una tarjeta, esta crece hacia la parte superior de su fila.
- [ ] En móvil, se mantiene `items-start` (expansión hacia abajo) para evitar que el contenido "salte" fuera del viewport superior durante el scroll vertical natural.
- [ ] No hay solapamiento con el título de la sección (el cual también subirá dinámicamente gracias a la flexibilidad de Flex/Grid).

### Comportamiento Esperado (Desktop)
1. El usuario tiene el cursor sobre las tarjetas de la sección "Dashboard".
2. Al hacer click, la tarjeta se expande. La base de la fila se queda quieta, y la parte superior de la tarjeta sube.
3. El título del módulo ("Dashboard CRM") se desplaza hacia arriba suavemente para acomodar el nuevo tamaño.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` -> Clase del contenedor de `FeatureGrid`.

### Arquitectura Propuesta

**Ajuste de Clases en el Grid**:
```tsx
<div className={cn(
  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
  "items-start md:items-end", // <-- Cambio Crítico
  "w-full max-w-7xl px-4 pr-10 md:pr-4 mt-3 md:mt-12 pb-16"
)}>
```

---

## Blueprint (Assembly Line)

### Fase 1: Inversión de Anclaje Visual
**Objetivo**: Cambiar `items-start` por `items-end` en el breakpoint `md:`.
**Validación**: Al expandir una tarjeta, se observa que "crece hacia arriba".

### Fase 2: Ajuste de Alineación por Defecto
**Objetivo**: Verificar que las tarjetas colapsadas sigan alineadas correctamente.
**Validación**: Si los títulos tienen alturas diferentes, con `items-end` se alinearán por el borde inferior. 
*Nota*: Si el usuario prefiere alineación superior cuando están cerradas pero expansión hacia arriba, se requeriría una lógica mucho más compleja de `absolute` positioning, pero `items-end` es el estándar limpio.

---

## Gotchas

- [ ] **Section Header Overlap**: Si las tarjetas superiores crecen mucho hacia arriba, podrían acercarse demasiado al título del módulo. GSAP `FullScreenScrollFX` debería manejar el resize del contenedor principal sin problemas.

## Anti-Patrones
- NO usar `transform: translateY(-100%)` manual, ya que rompe el flujo del DOM y el cálculo de altura del contenedor principal de GSAP.

---

*PRP pendiente aprobación.*
