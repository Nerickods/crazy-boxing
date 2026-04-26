# PRP-018: Optimización Global y Fluidez de Animaciones (60 FPS Project)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-31
> **Proyecto**: KIA Intelligence

---

## Objetivo

Lograr una experiencia visual premium y fluida de 60 FPS en toda la landing page, eliminando cuellos de botella de renderizado críticos en `PasSection` y optimizando el consumo de GPU/CPU en móviles.

## Por Qué

| Problema | Soluición |
|----------|----------|
| Retraso evidente (lag) al final de `PasSection` y sensación de pesadez general en el scroll dinámico. | Depuración exhaustiva de capas de composición, optimización de WebGL y migración de assets pesados a formatos vectoriales ligeros. |

**Valor de negocio**: El posicionamiento de marca de "IA de Elite" requiere que la infraestructura del sitio sea tan rápida como la tecnología que vende. El lag rompe la narrativa de "alta automatización".

## Qué

### Criterios de Éxito
- [ ] 60 FPS estables en el final de `PasSection` de móvil.
- [ ] Reducción del "Paint time" en un 40%.
- [ ] Sustitución del PNG del Logo + filtros por un SVG optimizado.
- [ ] Configuración adaptable de `pixelRatio` y complejidad de shader según dispositivo.

### Comportamiento Esperado
El usuario navega por la landing y el logo final de KIA aparece instantáneamente sin "tirones" visuales. El scroll cinemático se siente ligero y responde fielmente al movimiento del dedo (thumb scroll) en dispositivos móviles.

---

## Contexto

### Referencias
- `src/shared/components/ui/shaded-background-transition.tsx` - Optimizador de WebGL/Shader.
- `src/features/landing-page/components/PasSection.tsx` - Refactor de salida cinemática.
- `src/shared/components/ui/full-screen-scroll-fx.tsx` - Análisis de ScrollTrigger.

### Arquitectura Propuesta (Performance First)
No cambiaremos la arquitectura Feature-First, sino los parámetros internos de renderizado de cada componente crítico para priorizar el "Main Thread" del navegador.

---

## Blueprint (Assembly Line)

### Fase 1: Optimización de Shaders y WebGL Buffers
**Objetivo**: Reducir el consumo de GPU en `ShadedBackgroundTransition`.
**Validación**: FPS Meter muestra mejora del 20% en transiciones de fondo.

### Fase 2: PasSection Final Reveal Refactor
**Objetivo**: Re-escribir la lógica de salida de los títulos y entrada del logo para reducir repintados.
**Validación**: Las herramientas de renderizado de Chrome confirman reducción de "Paint areas".

### Fase 3: Migración de Branding (Asset Audit)
**Objetivo**: Eliminar el PNG con fltros CSS costosos y usar SVG con glow embebido.
**Validación**: Carga instantánea del asset y eliminación del filtro `drop-shadow`.

### Fase 4: Validación y Calibración
**Objetivo**: Ajuste fino de constantes de `framer-motion` (springs) para máxima fluidez.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Test de estrés en dispositivo móvil confirma fluidez.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-03-31]: Filtros CSS vs GPU
- **Error**: Encadenar filtros CSS complejos (`brightness`, `contrast`, `saturate`, `drop-shadow`) sobre elementos fijos consume el frame budget rápidamente.
- **Fix**: Usar pre-procesamiento de imágenes o SVG nativos para efectos estáticos pesados.
- **Aplicar en**: Todo asset visual crítico del proyecto.

---

## Gotchas

- [ ] La reducción de resolución del canvas no debe ser perceptible a simple vista (usar pixelRatio dinámico).
- [ ] El SVG del logo debe mantener la fidelidad visual del diseño original.

## Anti-Patrones

- NO añadir más capas `sticky` sin evaluar el costo de composición.
- NO usar "heavy shaders" en móviles sin un fallback ligero.

---

*PRP pendiente aprobación. No se ha modificado código.*
