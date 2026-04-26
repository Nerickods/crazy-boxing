# PRP-056: Mobile Capacity Expansion & Desktop Alignment Fix

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Optimizar la sección de beneficios (`BenefitsList.tsx`) para: 
1. Incrementar el número de tarjetas visibles en dispositivos móviles de 3 a 5 items.
2. Corregir el comportamiento visual del grid en escritorio donde, debido al `items-stretch` por defecto, las tarjetas adyacentes a la expandida parecen "crecer" sin mostrar contenido. Se implementará alineación `items-start` para asegurar que solo la tarjeta seleccionada cambie su altura real.

## Por Qué

| Problema | Solución |
|----------|----------|
| En móvil, el usuario solo visualiza 3 tarjetas por pestaña, desaprovechando el espacio vertical ganado tras optimizar la barra de progreso. | Aumentar el `limit` a 5 tarjetas, permitiendo una visión más densa y completa de las capacidades por módulo. |
| El comportamiento actual de CSS Grid stretch hace que en escritorio todas las tarjetas de una fila crezcan al abrir una. | Aplicar `items-start` al grid. Esto permite que cada tarjeta tenga su propia altura independiente (auto), evitando el efecto "ghost expansion" en items vecinos. |

**Valor de negocio**: Mejora la entrega de información en mobile y refina la sensación de "software de élite" en desktop al tener interacciones quirúrgicas y precisas que no afectan elementos no seleccionados.

## Qué

### Criterios de Éxito
- [ ] En dispositivos móviles (`< 768px`), cada sección muestra hasta 5 tarjetas de beneficios.
- [ ] En escritorio, al abrir una tarjeta, el resto de las tarjetas de la misma fila mantienen su altura contraída original.
- [ ] La animación de `framer-motion` sigue siendo fluida y el `ScrollTrigger` no se descompone al tener listas más largas en móvil.

### Comportamiento Esperado
1. Usuario móvil entra en "Dashboard CRM". Ahora ve 5 pilares (antes 3).
2. Usuario desktop abre "WhatsApp Nativo". La tarjeta se expande. Las dos tarjetas de al lado en la misma fila siguen en su estado `shrink` compacto, sin espacio vacío extra debajo de sus títulos.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` - Ubicación de la lógica de `limit` y el markup del `FeatureGrid`.

### Arquitectura Propuesta (Feature-First)

**1. Ajuste de Límite Responsivo**
```tsx
useEffect(() => {
  const handleResize = () => {
    // Cambiamos de 3 a 5
    setLimit(window.innerWidth < 768 ? 5 : 6); 
  };
  // ...
}, []);
```

**2. Ajuste de Alineación en Grid**
```tsx
<div className="grid ... items-start mt-3 md:mt-12 pb-16"> 
```

---

## Blueprint (Assembly Line)

### Fase 1: Ajuste de Densidad en Mobile
**Objetivo**: Modificar el hook `useEffect` en `BenefitsList` para elevar el estado `limit` inicial y en resize a **5**.
**Validación**: En modo inspección mobile, se renderizan 5 tarjetas por cada módulo.

### Fase 2: Corrección de Alineación (Grid Alignment)
**Objetivo**: Añadir la clase `items-start` al contenedor `div` de `FeatureGrid`. Esto rompe el "stretch" por defecto de CSS Grid.
**Validación**: Al expandir una tarjeta en Desktop, sus hermanas de fila no se estiran hacia abajo.

### Fase 3: Validación Final
**Objetivo**: UI impecable en todos los viewports.
**Validación**:
- [ ] `npm run typecheck` sin errores.
- [ ] Se comprueba que el `pr-10` aplicado en el PRP anterior sigue dejando espacio suficiente para los 5 items en mobile.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

*(Espacio en blanco)*

---

## Gotchas

- [ ] **Mobile Overlap**: Con 5 tarjetas en móvil, la sección es más larga. El contenedor `.fx-fixed` (pinned) de GSAP maneja el scroll interno cuando el contenido excede la pantalla (`overflow-y-auto`), así que no debería haber problema de accesibilidad al contenido.

## Anti-Patrones

- NO usar alturas fijas (`h-[...]`) para solucionar el stretch. `items-start` es la solución nativa y flexible.

---

*PRP pendiente aprobación. No se ha modificado código.*
