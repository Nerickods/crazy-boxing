# PRP-028: BenefitsList Stacked Layout Refinement

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-29
> **Proyecto**: KIA Intelligence

---

## Objetivo

Rediseñar la estructura visual del componente `FullScreenScrollFX` para migrar de una disposición de tres columnas (Label/Title/Description) a una **disposición central apilada (Stacked)**. El título subirá a la mitad superior de la pantalla y la descripción se ubicará directamente debajo de él, eliminando las etiquetas laterales para maximizar el minimalismo "Apple-Style".

## Por Qué

| Problema | Solución |
|----------|----------|
| El exceso de información lateral (Label izquierda / Desc derecha) distrae del impacto visual de las imágenes de fondo. | Unificar la narrativa en el eje central del usuario. Al mover la descripción debajo del título, se crea un flujo de lectura natural e ininterrumpido. |

**Valor de negocio**: Refuerza el minimalismo "Elite" y la autoridad de marca al reducir el ruido visual y centrar el mensaje en el beneficio del producto.

## Qué

### Criterios de Éxito
- [ ] Eliminar la visualización de la columna izquierda (`fx-left`).
- [ ] Integrar el `rightLabel` (descripción) en el contenedor central (`fx-center`).
- [ ] Título posicionado en la parte superior-media (aprox. 30-40% del viewport).
- [ ] Descripción posicionada justo debajo del título (aprox. 50-60% del viewport).
- [ ] Sincronización de animaciones: Ambos elementos deben aparecer y desaparecer con el mismo *feel* cinematográfico.
- [ ] Rendimiento optimizado (zero-lag).

### Comportamiento Esperado
1. Al hacer scroll, la imagen de fondo anterior se desvanece (fade-out).
2. El nuevo título entra desde abajo con un "Word-Mask" reveal, situándose en la parte superior.
3. La nueva descripción entra simultáneamente (o con un ligero delay poético) justo debajo del título.
4. Las listas laterales no son visibles, dejando solo el mensaje central y el fondo.

---

## Contexto

### Referencias
- `full-screen-scroll-fx.tsx` (Componente actual a refinar).
- `BenefitsList.tsx` (Implementación de negocio actual).

### Arquitectura Propuesta (Stacked Pattern)
```typescript
// En full-screen-scroll-fx.tsx
<div className="fx-center">
  {sections.map((s, sIdx) => (
    <div key={...} className="fx-featured">
      <h3 className="fx-featured-title">{...}</h3>
      <div className="fx-featured-desc">{s.rightLabel}</div>
    </div>
  ))}
</div>
```

---

## Blueprint (Assembly Line)

### Fase 1: Refactor de Layout Interno
**Objetivo**: Modificar el CSS y la estructura JSX de `FullScreenScrollFX` para el modo apilado.
**Validación**: Las etiquetas laterales desaparecen y el `rightLabel` se muestra en el centro.

### Fase 2: Coordinación de Animaciones GSAP
**Objetivo**: Extender `changeSection` para animar el nuevo elemento de descripción en sincronía con el título.
**Validación**: El título y la descripción tienen una entrada/salida fluida durante el cambio de sección.

### Fase 3: Ajustes Estéticos (Typography & Spacing)
**Objetivo**: Calibrar el tamaño de fuente y el espaciado vertical para un look premium.
**Validación**: Legibilidad óptima y composición visual equilibrada.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Playwright screenshot confirma UI limpia y centrada.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-03-29: Centralized Composition
- **Error**: El título centralizado en el eje Y exacto compite con el punto de enfoque de muchas fotografías.
- **Fix**: Subir el título (y bajar la descripción) para dejar "aire" visual en el centro focal de la imagen.

---

## Gotchas
- [ ] GSAP necesita rastrear la descripción por separado si se quiere un efecto de fade independiente.
- [ ] El `header` fijo puede superponerse con el título si no se maneja el padding superior.

## Anti-Patrones
- NO mantener lógica de tracking de listas laterales si no se van a usar (limpiar código muerto).

---

*PRP pendiente aprobación por Nerick Segoviano.*
