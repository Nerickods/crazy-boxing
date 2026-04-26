# PRP-058: Title Truncation Fix — Mobile Benefits

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Resolver el problema visual en dispositivos móviles donde los títulos de las tarjetas de beneficios se muestran cortados (con puntos suspensivos), impidiendo la lectura completa incluso cuando la tarjeta está expandida. 

## Por Qué

| Problema | Solución |
|----------|----------|
| La clase `truncate` en el elemento `h4` fuerza el texto a una sola línea con `whitespace-nowrap`, cortando títulos largos como "Landing de Alta Conversión" o "Dashboard CRM Inteligente". | Eliminar `truncate` y permitir el salto de línea (`whitespace-normal`). Ajustar el interletrado y la altura de línea para que los títulos multilínea se vean estéticos y no rompan la armonía del header de la tarjeta. |

**Valor de negocio**: Mejora drástica en la legibilidad y accesibilidad del contenido principal. Un producto "Elite" no puede permitirse tener textos ilegibles en su propuesta de valor.

## Qué

### Criterios de Éxito
- [ ] Los títulos largos en móvil se envuelven en 2 líneas de forma fluida.
- [ ] Al estar expandida, la tarjeta muestra el nombre completo del beneficio.
- [ ] El icono lateral y el badge "PRO" se mantienen alineados verticalmente de forma correcta respecto al título multilínea.
- [ ] Se mantiene el diseño Premium sin desbordamientos inesperados.

### Comportamiento Esperado (Mobile)
1. El usuario ve la tarjeta "COPYWRITING PERSUASIVO". Antes decía "COPYWRITING PERS...".
2. Ahora, el texto se divide en dos líneas si no cabe, manteniendo el icono a la izquierda centrado o alineado al top.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` -> Componente `FeatureCard` (línea ~55).

### Arquitectura Propuesta

**Cambio en Clases del Título (`h4`)**:
```tsx
// Antes
"text-[13px] md:text-[15px] font-bold ... truncate"

// Después
"text-[13px] md:text-[15px] font-bold ... leading-tight whitespace-normal break-words"
```

**Ajuste de Alineación en Header**:
Asegurar que el contenedor del icono (`Icon`) y las acciones (Chevron/PRO) usen `items-start` o un centrado que funcione con títulos de varias líneas.

---

## Blueprint (Assembly Line)

### Fase 1: Corrección de Propiedades de Texto
**Objetivo**: Eliminar la restricción de línea única en el CSS.
**Validación**: Los títulos "Copywriting Persuasivo" y "Mobile First Dinámico" se leen completos en el simulador de móvil.

### Fase 2: Refinamiento de Spacing
**Objetivo**: Ajustar `leading-tight` para que el espacio entre líneas sea óptimo y no se vea muy separado.
**Validación**: Comparación visual con el screenshot original para asegurar que la "mancha" de texto sea equilibrada.

---

## Gotchas

- [ ] **Height Layout Shift**: Al tener títulos de 2 líneas, la altura "contraída" de las tarjetas variará ligeramente. Como estamos usando `items-start` en el grid (según el PRP anterior), esto es aceptable y preferible a tener texto cortado.

## Anti-Patrones
- NO usar `overflow-visible` solo, ya que sin quitar `whitespace-nowrap` el texto seguiría en una línea saliéndose del contenedor. La clave es `whitespace-normal`.

---

*PRP pendiente aprobación.*
