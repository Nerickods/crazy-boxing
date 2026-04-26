# PRP-017: Cinematic Rounded Section Entry (ProcessSection)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-02
> **Proyecto**: KIA Intelligence

---

## Objetivo

Implementar un efecto de transición cinemático en el inicio de la `ProcessSection` utilizando bordes superiores redondeados de gran radio (`rounded-t-[3.5rem]`) y un separador de línea con logo central, replicando fielmente el diseño premium de Morningside.ai.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las transiciones entre secciones son planas y genéricas (borders rectos). | Crea una jerarquía visual clara y una sensación de "capas" premium mediante el uso de profundidad y curvatura. |

**Valor de negocio**: Refuerza el posicionamiento de "élite" y "Apple-style" prometido en la lógica de negocio, aumentando la percepción de valor del servicio.

## Qué

### Criterios de Éxito
- [ ] La `ProcessSection` tiene esquinas superiores redondeadas visibles en desktop y mobile.
- [ ] Existe un separador horizontal con el logo de KIA Intelligence centrado antes de que comience el contenido de la sección.
- [ ] La transición desde `PasSection` (scroll progress final) es fluida y no deja ver el fondo plano.
- [ ] Se mantiene el background `bg-emerald-500/[0.02]` dentro del contenedor redondeado, pero sobre un fondo base negro absoluto.

### Comportamiento Esperado
Al terminar el scroll de la `PasSection`, la `ProcessSection` aparece como un contenedor con bordes redondeados que se "superpone" visualmente o continúa la narrativa, precedida por una línea divisoria elegante con el isotipo de la marca.

---

## Contexto

### Referencias
- `src/features/landing-page/components/ProcessSection.tsx` - Componente a modificar.
- `src/features/landing-page/components/PasSection.tsx` - Sección previa que define el final del scroll.
- Imagen compartida por el usuario: [Morningside Reference](file:///home/nerick_ods/.gemini/antigravity/brain/ba028ec9-0102-49bb-bc67-226e0fa62ea6/tempmediaStorage/media__1775105647151.jpg)

### Arquitectura Propuesta
Se añadirá una capa de contenedor extra en `ProcessSection.tsx` y un componente shared o colocalizado `SectionSeparator`.

```tsx
// Estructura propuesta
<section id="proceso" className="bg-black pt-20">
  <SectionSeparator />
  <div className="rounded-t-[3.5rem] border-t border-x border-white/5 bg-emerald-500/[0.01] overflow-hidden">
    <Timeline data={data} />
  </div>
</section>
```

---

## Blueprint (Assembly Line)

### Fase 1: Estructura y Estilos de Contenedor
**Objetivo**: Aplicar la curvatura superior y el espaciado correcto en `ProcessSection.tsx`.
**Validación**: Inspección visual de los bordes redondeados y el fondo.

### Fase 2: Componente Logo Separator
**Objetivo**: Implementar la línea horizontal con el logo central (isotipo) que precede a la sección.
**Validación**: El logo está perfectamente centrado y la línea tiene el gradiente/estilo correcto.

### Fase 3: Ajuste de Transición PasSection
**Objetivo**: Asegurar que el final de la `PasSection` (h-[900vh]) revela la `ProcessSection` de manera natural.
**Validación**: No hay saltos visuales ni "flicker" en el cambio de sección.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Playwright screenshot confirma UI pixel-perfect vs referencia.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-02]: Inicialización del Blueprint
- **Nota**: Se detectó que `PasSection` termina con una opacidad y escala dinámica. La entrada de `ProcessSection` debe considerar este estado para no "chocar" visualmente.

---

## Gotchas

- [ ] El radio de curvatura en mobile debe ajustarse (ej. `rounded-t-[2rem]`) para no comerse demasiado espacio horizontal.
- [ ] `z-index` de las secciones debe estar bien definido para que el separador no quede oculto.

## Anti-Patrones

- NO usar un radio de curvatura demasiado pequeño que parezca un simple "border-radius" estándar.
- NO romper el flujo de `Timeline` que ya es complejo en su gestión de scroll.

---

*PRP pendiente aprobación. No se ha modificado código.*
