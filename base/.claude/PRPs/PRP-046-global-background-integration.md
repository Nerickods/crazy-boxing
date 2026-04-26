# PRP-046: Integración Global de Fondo "Vertical Folds" en Secciones Oscuras

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-05
> **Proyecto**: KIA Intelligence

---

## Objetivo

Integrar el efecto visual de fondo general (las "tiras de cristal" o pliegues verticales sombreados) en las secciones `PasSection`, `AuthorityGuide` y el Menú de navegación (Drawer), manteniendo un color base negro puro y evitando mostrar los orbes verde/azul (blobs) del fondo global.

## Por Qué

| Problema | Solución |
|----------|----------|
| Inconsistencia visual: `PasSection`, `AuthorityGuide` y Menú son sólidos (`bg-black`), rompiendo la inmersión del fondo estriado global. | Extraer el efecto de tiras verticales a un componente reutilizable y proyectarlo sobre los fondos negros. |
| El fondo global tiene orbes de color (blobs) que no queremos en las zonas oscuras de autoridad. | Colocar fondos negros absolutos en estas secciones y poner los pliegues verticales *encima* del negro pero *debajo* del contenido. |

**Valor de negocio**: Consolidación total de la estética premium (branding "Glass Refraction" / "Vertical Folds") a través de toda la experiencia de usuario, aumentando el valor percibido del software.

## Qué

### Criterios de Éxito
- [ ] Creación de un componente reutilizable `VerticalFolds` o `VerticalGlassStrips`.
- [ ] Integración del componente como fondo `absolute` (o `fixed` ajustado) en `PasSection.tsx` con fondo negro absoluto.
- [ ] Integración en `AuthorityGuide.tsx` garantizando que no obstaculice la lectura del contenido por z-index.
- [ ] Integración en el `NavigationDrawer` (Menú Mobile) que actualmente es `bg-background-dark/95`. Ahora será fondo oscuro con los pliegues integrados.
- [ ] No se ven manchas verdes/azules (blobs) a través de estas secciones oscuras.

### Comportamiento Esperado
Cuando el usuario haga scroll hacia la `PasSection` o abra el `Menu`, verá una superficie completamente negra, sobre la cual sutilmente se dibujan los mismos pliegues/cortes verticales animados que el resto de la página. El texto y los botones fluyen perfectamente por encima de este efecto.

---

## Contexto

### Referencias
- `src/components/ui/glass-refraction-background.tsx` (Fuente del efecto original).
- `src/features/landing-page/components/PasSection.tsx`
- `src/features/landing-page/components/AuthorityGuide.tsx`
- `src/features/landing-page/components/NavigationDrawer.tsx`

### Arquitectura Propuesta
1. Extraer la lógica de las tiras del archivo `glass-refraction-background.tsx` a un nuevo archivo `src/components/ui/vertical-folds.tsx`.
2. Actualizar `glass-refraction-background.tsx` para que consuma `VerticalFolds`.
3. Inyectar `VerticalFolds` con `position: absolute` (y `inset-0`) dentro de contenedores envolventes o la propia `PasSection` y `AuthorityGuide`. En el caso de `PasSection` que mide `900vh`, podríamos aplicar el fondo con un posicionador `fixed` o limitarlo al área visual (`sticky top-0 h-screen`).

---

## Blueprint (Assembly Line)

### Fase 1: Arquitectura de Componente Común
**Objetivo**: Abstraer el efecto visual.
**Validación**: Creación de `vertical-folds.tsx` y refactor de `glass-refraction-background.tsx`. Asegurar que nada visual cambie en las demás áreas.

### Fase 2: Integración en PasSection + AuthorityGuide
**Objetivo**: Aplicar los pliegues sobre base negra.
**Validación**: Insertar `<VerticalFolds className="..." />` dentro del marco `sticky` de la `PasSection` (en base de z-index: 00) y como `absolute inset-0` en `AuthorityGuide`.

### Fase 3: Integración en NavigationDrawer (Menú)
**Objetivo**: Aplicar el efecto de fondo al menú móvil.
**Validación**: Insertar el efecto visual detrás de la lista de hipervínculos del Menú.

### Fase N: Validación Final
**Objetivo**: Sistema funcionando sin errores de Typescript.
**Validación**:
- [ ] `npm run typecheck` pasa.

---

## Gotchas

- **Rendimiento:** Reutilizar 12 div con animaciones `framer-motion` por cada sección puede mermar FPS en móviles si existen múltiples instancias simultáneas en DOM. Recomiendo usar `absolute inset-0` dentro de un marco de altura visible (100vh), o controlar el renderizado para que solo se anime lo visible.
- **Scroll Infinito en PasSection:** La `PasSection` tiene `900vh`. Si le ponemos `absolute inset-0` al `VerticalFolds`, tendríamos pliegues de 900vh de altura, lo que destruiría la memoria/GPU del móvil. Deberemos colocar los `VerticalFolds` dentro del `div` interior que tiene `sticky top-0 h-screen`, para que su altura real sea solo la de la pantalla (`100vh`).
- **Z-Index en Menú:** El drawer tiene sub-elementos. Debemos asegurar que el texto quede en `z-10` y los pliegues en `z-0`.

---

*PRP pendiente aprobación. No se ha modificado código.*
