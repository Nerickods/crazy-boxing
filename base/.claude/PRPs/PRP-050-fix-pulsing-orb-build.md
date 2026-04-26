# PRP-050: Fix PulsingOrb Build Error & CSS Migration Cleanup

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence

---

## Objetivo

Resolver el error de compilación `Expression expected` en `PulsingOrb.tsx` eliminando los marcadores de conflicto de Git y consolidando la migración hacia una implementación de CSS puro (PRP-041). El objetivo final es restaurar la estabilidad del build y garantizar que el orbe del chatbot sea 100% compatible con iOS Safari sin depender de WebGL.

## Por Qué

| Problema | Solución |
|----------|----------|
| Marcadores de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`) rompen la sintaxis de JavaScript/TypeScript. | Limpieza manual del código preservando la rama `HEAD` (CSS-pure). |
| `PulsingBorder` (WebGL) causa problemas de renderizado en iOS ("blob sólido"). | Eliminación definitiva de la dependencia de shaders WebGL en favor de `conic-gradient` y Framer Motion. |
| Inconsistencia en la estructura del componente tras merges fallidos. | Unificación de la arquitectura del componente bajo el patrón "Fase 2: Compositor-safe". |

**Valor de negocio**: El PulsingOrb es el punto focal de interacción con la IA. Un error de build bloquea el despliegue de toda la plataforma, y un orbe roto en mobile reduce drásticamente la conversión de leads en dispositivos Apple.

## Qué

### Criterios de Éxito
- [ ] `PulsingOrb.tsx` libre de marcadores de conflicto y sintácticamente válido.
- [ ] Implementación visual basada en CSS (`conic-gradient`, `wrapperSize`, `glowSize`).
- [ ] `npm run build` exitoso (Turbopack/Next.js).
- [ ] Animación fluida y compositor-safe (uso de `willChange`).

### Comportamiento Esperado
El componente debe renderizar un orbe pulsante con un anillo animado y texto rotatorio. La animación del anillo debe ser suave y no entrar en conflicto con el escalado del texto SVG. En iOS Safari, el orbe debe verse como un círculo perfecto (anillo) y no como un bloque sólido.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PulsingOrb.tsx` - Archivo afectado.
- `PRP-041: PulsingOrb CSS-pure` - Especificación original de la migración.
- `PRP-022: Fix PulsingOrb iOS` - Intento previo de fallback.

### Arquitectura Propuesta (Cleanup)
Se mantendrá la estructura de "CSS puro" ya iniciada en el archivo:
- **Geometry**: Variables calculadas (`thickness`, `glowSize`, `wrapperSize`).
- **Animation**: `useAnimationFrame` para una rotación unificada.
- **Layers**: 
  1. Halo Glow (CSS Background)
  2. Ring Track (Conic Gradient)
  3. Inner Mask (Hole)
  4. Rotating Text (SVG Motion)

---

## Blueprint (Assembly Line)

### Fase 1: Limpieza Quirúrgica de Conflictos
**Objetivo**: Eliminar marcadores de conflicto y código redundante de `PulsingBorder`.
**Validación**: El archivo no muestra errores de sintaxis en el IDE.

### Fase 2: Reconstrucción de la Lógica CSS
**Objetivo**: Asegurar que las variables `wrapperSize` y `glowSize` están correctamente vinculadas al `div` del Halo Glow.
**Validación**: `thickness` se aplica correctamente a la máscara interna.

### Fase 3: Optimización del Compositor
**Objetivo**: Verificar que todos los estilos animados usan `transform` o `opacity` con `willChange`.
**Validación**: Inspección visual de las props de `style`.

### Fase 4: Validación de Build y Tipos
**Objetivo**: Confirmar que el proyecto compila sin errores.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-04-11: Peligros de Merges en Componentes Críticos
- **Error**: Dejar marcadores de conflicto en un componente central.
- **Fix**: Siempre verificar la sintaxis post-merge y priorizar la rama de "Fix Mobile" (HEAD) sobre la rama de "Estabilidad Antigua" (main).
- **Aplicar en**: Futuras migraciones de componentes WebGL a CSS.

---

## Gotchas

- [ ] **Glow Layering**: El div del Halo Glow debe estar antes que el anillo para que quede por detrás.
- [ ] **Masking**: El `background` de la máscara interna debe ser oscuro para crear el efecto de anillo hueco.

## Anti-Patrones

- NO mezclar lógica de `PulsingBorder` (WebGL) con la nueva lógica CSS.
- NO dejar imports de `@paper-design/shaders-react` si no se están usando.

---

*PRP pendiente aprobación. No se ha modificado código.*
