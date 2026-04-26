# PRP-018: Restoration of Atmospheric Depth in Cinematic Transition

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-02
> **Proyecto**: KIA Intelligence

---

## Objetivo

Restaurar la profundidad atmosférica del "Invisible Stack" (GlassRefractionBackground) dentro del contenedor curvado de la `ProcessSection`, asegurando que el fondo sea translúcido y permita ver los blobs verdes y las tiras de refracción originales, tal como el usuario lo solicita ("recuperar el background que ya tenía").

## Por Qué

| Problema | Solución |
|----------|----------|
| La implementación actual usa `bg-black` sólido, lo que bloquea el fondo animado y rompe la estética de "transparencia premium". | Eliminar los backgrounds opacos y usar capas semi-transparentes (`bg-emerald-500/0.02`) para integrar la nueva curvatura con el fondo global. |

**Valor de negocio**: Mantiene la identidad visual de "infraestructura invisible" y profundidad cinematográfica que es el sello distintivo de KIA Intelligence.

## Qué

### Criterios de Éxito
- [ ] La `ProcessSection` ya no tiene un `bg-black` opaco que bloquee el fondo global.
- [ ] El contenedor redondeado (`rounded-t-[4rem]`) conserva su borde y sombra pero es translúcido.
- [ ] Se recupera el tinte `emerald` sutil (`0.02`) que da profundidad al contenido del Timeline.
- [ ] La transición desde la sección negra anterior (`PasSection`) se mantiene fluida gracias al `SectionSeparator`.

### Comportamiento Esperado
Al llegar a la transición de la `ProcessSection`, el usuario ve el separador de diamante sobre fondo negro. Inmediatamente debajo, la "tarjeta" curvada comienza a revelar el fondo global con sus movimientos de blobs verdes, creando una sensación de que el contenido está flotando sobre la infraestructura.

---

## Contexto

### Referencias
- `src/features/landing-page/components/ProcessSection.tsx` - Archivo principal a revertir parcialmente.
- `src/components/ui/glass-refraction-background.tsx` - Fuente de la profundidad visual que queremos recuperar.
- Captura del usuario: [Refinamiento de curvatura](file:///home/nerick_ods/.gemini/antigravity/brain/ba028ec9-0102-49bb-bc67-226e0fa62ea6/tempmediaStorage/media__1775110815151.png)

### Arquitectura Propuesta
No se requieren componentes nuevos, solo ajustes de clases de Tailwind en la estructura de `ProcessSection.tsx`.

```tsx
// Cambio conceptual
<section className="bg-transparent"> // Remueve bg-black
  <SectionSeparator wrapperClassName="bg-black" /> // El separador mantiene el bloque sólido de arriba
  <div className="bg-emerald-500/[0.02] backdrop-blur-sm"> // Restaura profundidad
    <Timeline />
  </div>
</section>
```

---

## Blueprint (Assembly Line)

### Fase 1: Limpieza de Backgrounds Opacos
**Objetivo**: Eliminar `bg-black` de la sección y el contenedor interno.
**Validación**: El fondo global (`GlassRefractionBackground`) es visible a través de la sección.

### Fase 2: Restauración de Tinte Emerald y Profundidad
**Objetivo**: Aplicar `bg-emerald-500/[0.02]` y opcionalmente un `backdrop-blur` muy ligero para legibilidad.
**Validación**: Coincidencia visual con el estado previo a la implementación de la curva.

### Fase 3: Ajuste de SectionSeparator
**Objetivo**: Asegurar que el separador tenga un fondo negro sólido en su parte superior para "tapar" el final de la sección anterior, pero que su transición hacia abajo sea transparente.
**Validación**: No hay saltos de color entre `PasSection` y `ProcessSection`.

### Fase 4: Validación Final
**Objetivo**: UI consistente con el diseño "Apple-style" y profundidad recuperada.
**Validación**:
- [ ] Build exitoso.
- [ ] Visualmente las "líneas de refracción" atraviesan la sección de proceso.

---

## Gotchas

- [ ] Si la transparencia es demasiada, el texto del Timeline puede perder legibilidad contra los blobs verdes brillantes. Usar un `bg-black/20` o similar como capa base si es necesario.

---

*PRP pendiente aprobación. No se ha modificado código.*
