# PRP-007: Shader Hero Experience Integration

> **Estado**: EN PROGRESO
> **Fecha**: 2026-03-22
> **Proyecto**: landing-linkedin

---

## Objetivo

Integrar un fondo dinámico basado en Shaders (`MeshGradient`) y elementos interactivos avanzados (Logo animado, Gooey Button, Pulsing Border con texto rotativo) en la sección Hero actual, manteniendo intacta la lógica de expansión por scroll (`ScrollExpandMedia`) y todos los elementos visuales existentes.

## Por Qué

| Problema | Solación |
|----------|----------|
| El fondo actual es estático o limitado en dinamismo visual premium. | Implementación de WebGL Shaders interactivos que reaccionan al movimiento y refuerzan la estética "Elite/Apple-style". |
| La navegación y el branding son funcionales pero no "Wow". | Integración de micro-animaciones SVG, filtros de distorsión y botones con efectos físicos (Gooey). |

**Valor de negocio**: Aumento de la retención del usuario en el primer impacto visual, refuerzo de la percepción de autoridad tecnológica y exclusividad del servicio.

## Qué

### Criterios de Éxito
- [ ] Fondo de `MeshGradient` funcionando detrás del contenido del Hero.
- [ ] Logo de la cabecera con animación de dibujo y filtros de brillo integrados.
- [ ] Botón "Login" con efecto Gooey y flecha interactiva.
- [ ] Elemento flotante inferior derecho con `PulsingBorder` y texto rotativo siguiendo el prompt.
- [ ] Mantenimiento de la lógica de expansión de `ScrollExpandMedia` (la caja se expande al hacer scroll).
- [ ] Todos los textos originales del Hero y los del prompt coexisten armoniosamente.

### Comportamiento Esperado
1. Al cargar la página, el usuario ve un fondo de gradiente animado y fluido.
2. El logo en el header se dibuja y brilla al pasar el ratón.
3. El botón de login revela una flecha mediante un efecto de "fusión" (gooey) al hacer hover.
4. Al hacer scroll, la caja central del Hero se expande suavemente, revelando el contenido secundario (Lumina Slider), mientras el fondo de shaders persiste o se integra en la transición.
5. El elemento flotante en la esquina inferior derecha pulsa y rota continuamente.

---

## Contexto

### Referencias
- `src/shared/components/ui/scroll-expansion-hero.tsx` - Controlador de la lógica de expansión.
- `src/features/landing-page/components/HeroSection.tsx` - Composición actual del Hero.
- `src/features/landing-page/components/Header.tsx` - Cabecera actual a refinar.
- `@paper-design/shaders-react` - Librería de WebGL Shaders instalada v0.0.72.

### Arquitectura Propuesta
```
src/features/landing-page/components/
├── ShaderBackground.tsx       [NEW] - MeshGradients + SVG Filters
├── PulsingExperience.tsx     [NEW] - PulsingBorder + Rotating Text
├── Header.tsx                 [MODIFY] - Logo + Gooey Button
└── HeroSection.tsx            [MODIFY] - Merge content
```

---

## Blueprint (Assembly Line)

### Fase 1: Infraestructura de Shaders
**Objetivo**: Implementar el fondo base y los filtros SVG globales.
**Validación**: El `MeshGradient` es visible como fondo de la sección Hero sin romper el layout.

### Fase 2: Refinamiento de Header & Branding
**Objetivo**: Integrar el logo animado y el "Gooey Button" en el Header existente.
**Validación**: El logo responde al hover con filtros de glowing y la animación `framer-motion`. El botón de login muestra el efecto Gooey.

### Fase 3: Integración de Contenido del Hero
**Objetivo**: Combinar los textos y botones del prompt con la lógica de `ScrollExpandMedia`.
**Validación**: Los títulos "Beautiful Shader Experiences" (prompt) y "Infraestructura de Ventas con IA" (actual) se visualizan según el diseño, respetando la lógica de expansión.

### Fase 4: Elementos Interactivos Flotantes
**Objetivo**: Añadir el `PulsingBorder` y el texto rotativo en la esquina inferior.
**Validación**: El componente se renderiza correctamente con z-index superior y animaciones fluidas.

### Fase 5: Ajustes de Performance & Responsividad
**Objetivo**: Asegurar que los shaders no penalicen el rendimiento en dispositivos móviles.
**Validación**: Testing en móviles (Playwright viewport resize) y verificación de `requestAnimationFrame` hooks si aplica.

---

## Gotchas
- El `MeshGradient` puede requerir `position: absolute` y `z-index: 0` para no tapar el contenido.
- Los filtros SVG definidos en el prompt deben estar presentes en el DOM para que los IDs (`#glass-effect`, `#logo-glow`, etc.) funcionen.
- `ScrollExpandMedia` usa manipulación directa de refs (DOM); la integración debe evitar colisiones con las animaciones de React/Framer Motion.

## Anti-Patrones
- NO eliminar el `ScrollExpandMedia`.
- NO duplicar el `Header` (fusionar en el actual).
- NO ignorar el `suppressHydrationWarning` en componentes que usen shaders/browser APIs.

---

*PRP pendiente de aprobación. No se ha modificado código aún.*
