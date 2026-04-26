# PRP-022: Fix PulsingOrb iOS — CSS Fallback para Shader WebGL

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-09
> **Proyecto**: KIA Intelligence
> **Afecta**: `PulsingOrb.tsx` → usado en `PulsingExperience.tsx`, `PasSection.tsx`, `Header.tsx`

---

## Objetivo

Implementar un fallback CSS/SVG premium que se active automáticamente cuando el shader `PulsingBorder` de `@paper-design/shaders-react` no puede renderizarse (iOS Safari, modo batería baja, contexto WebGL bloqueado), garantizando que el orbe central del widget del chatbot siempre sea visible y mantenga el nivel estético de la marca.

## Por Qué

| Problema | Solución |
|----------|----------|
| `PulsingBorder` usa WebGL canvas. iOS Safari puede denegar el contexto silenciosamente (batería, política de privacidad). El componente renderiza invisible. | Detector `useWebGLSupport` hook que devuelve `boolean`. Si `false`, usa fallback CSS conic-gradient + blur + pulse animation. |
| El widget del chatbot (CTA focal principal de la landing) aparece incompleto en iPhone → pérdida de conversión en mobile. | El fallback nunca puede ser inferior al original en intención visual. Debe transmitir "sistema activo, inteligencia viva". |
| El texto rotatorio SVG (siempre funciona) hace más evidente la ausencia del orbe → el widget parece "roto". | El fallback debe ser pixel-similar al WebGL original: círculo con glow animado, colores de marca (cyan/emerald). |

**Valor de negocio**: El PulsingOrb es el único punto de entrada al chatbot en la sección PAS. Un widget visualmente roto en iOS = prospectos que no hacen clic = leads perdidos directamente por un bug de renderizado.

---

## Qué

### Criterios de Éxito
- [ ] El orbe central es visible en iPhone 12/14/15 con iOS Safari actual
- [ ] La transición entre WebGL-nativo y CSS-fallback es imperceptible (mismos colores, misma animación de brillo)
- [ ] Cero regresiones en desktop/Chrome (el WebGL sigue usándose donde funciona)
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso
- [ ] El texto SVG rotatorio sigue funcionando en ambos modos
- [ ] El componente funciona correctamente en Header (size 36-44px) y PasSection (size 100px)

### Comportamiento Esperado (Happy Path)

1. **Desktop / Android Chrome** → `useWebGLSupport()` = `true` → renderiza `PulsingBorder` como hoy
2. **iOS Safari / WebGL bloqueado** → `useWebGLSupport()` = `false` → renderiza fallback CSS:
   - Círculo con `conic-gradient` animado en colores de marca (cyan → emerald → cyan)
   - `filter: blur` central para simular el glow difuso del shader
   - Animación `orb-pulse` para simular el "latido" del orbe vivo
   - Mismo `border-radius: 50%` y dimensiones que `PulsingBorder`
3. El texto SVG rotatorio se superpone igual en ambos casos (no cambia)

---

## Contexto

### Arquitectura del Problema

```
PulsingOrb.tsx
├── PulsingBorder (@paper-design/shaders-react ^0.0.72)
│   └── WebGL canvas → FALLA en iOS Safari (contexto nulo)
│       → El elemento queda invisible (canvas vacío sin error)
└── motion.svg (texto circular rotatorio) → SIEMPRE funciona (SVG puro)
```

**Root cause**: `PulsingBorder` no tiene manejo de errores de contexto WebGL. En iOS, `canvas.getContext('webgl2')` o `getContext('webgl')` puede retornar `null`. El shader no emite error, simplemente no pinta nada.

### Referencia de Código

#### Archivo Principal a Modificar
- `src/features/landing-page/components/PulsingOrb.tsx`

#### Usages (3 sitios — NO se tocan)
| Archivo | Tamaño | Contexto |
|---------|--------|----------|
| `PulsingExperience.tsx` L35 | `size={60}` | Botón flotante bottom-right |
| `PasSection.tsx` L187 | `size={100}`, `scale-75 md:scale-110` | CTA central de la sección |
| `Header.tsx` L134 | `size={36-44}` (dinámico) | Logo morphed del header |

#### Package
```json
"@paper-design/shaders-react": "^0.0.72"
```

### Especificación del Fallback CSS

```css
/* globals.css — añadir al final */
@keyframes orb-rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes orb-pulse {
  0%   { opacity: 0.55; filter: blur(3px) brightness(1);   }
  50%  { opacity: 0.85; filter: blur(5px) brightness(1.3); }
  100% { opacity: 0.55; filter: blur(3px) brightness(1);   }
}

.orb-css-fallback {
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #00f2ff,
    #06b6d4,
    #10b981,
    #34d399,
    #0891b2,
    rgba(255,255,255,0.15),
    #00f2ff
  );
  animation:
    orb-rotate 6s linear infinite,
    orb-pulse  3s ease-in-out infinite;
}
```

### Hook `useWebGLSupport` (nuevo)

```typescript
// src/shared/hooks/useWebGLSupport.ts
"use client";
import { useState, useEffect } from "react";

/**
 * Detecta si WebGL está disponible en el contexto del browser actual.
 * Retorna `true` por defecto en SSR para evitar hydration mismatch.
 * La detección real corre client-side tras el mount.
 */
export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(true); // SSR-safe default

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
```

### Modificación de `PulsingOrb.tsx`

```typescript
"use client";
import { motion } from "framer-motion";
import { PulsingBorder } from "@paper-design/shaders-react";
import { useWebGLSupport } from "@/shared/hooks/useWebGLSupport";

export function PulsingOrb({ isOpen = false, size = 60, showText = true, className = "" }: PulsingOrbProps) {
  const webGLSupported = useWebGLSupport();
  const borderSize = size;
  const svgScale = size < 50 ? (size / 60) * 1.8 : (size / 60) * 1.6;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size * 1.4, height: size * 1.4 }}>

      {/* --- CONDICIONAL: WebGL vs CSS Fallback --- */}
      {webGLSupported ? (
        <PulsingBorder
          {...({ /* mismas props actuales */ } as any)}
          style={{ width: `${borderSize}px`, height: `${borderSize}px`, borderRadius: "50%" }}
        />
      ) : (
        <div
          className="orb-css-fallback"
          style={{ width: `${borderSize}px`, height: `${borderSize}px` }}
        />
      )}

      {/* Texto SVG rotatorio — sin cambios */}
      {showText && (
        <motion.svg /* sin cambios */ >
          {/* ... */}
        </motion.svg>
      )}
    </div>
  );
}
```

### Archivos a Modificar/Crear

```
src/
├── shared/
│   └── hooks/
│       └── useWebGLSupport.ts    [NUEVO]
├── features/landing-page/
│   └── components/
│       └── PulsingOrb.tsx        [MODIFICAR — integrar hook + fallback]
└── app/
    └── globals.css               [MODIFICAR — añadir @keyframes + .orb-css-fallback]
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo FASES. Las subtareas se generan al entrar a cada fase (bucle agéntico).

### Fase 1: Crear `useWebGLSupport` hook
**Objetivo**: Hook SSR-safe exportado desde `src/shared/hooks/useWebGLSupport.ts` que detecta soporte WebGL.
**Validación**: `typecheck` pasa. No hay errores de hydration al testear.

### Fase 2: Añadir keyframes + clase CSS en `globals.css`
**Objetivo**: Animaciones `orb-rotate` y `orb-pulse` disponibles globalmente. Clase `.orb-css-fallback` lista para usarse.
**Validación**: Build exitoso. En DevTools mobile se puede ver la clase y la animación corriendo.

### Fase 3: Modificar `PulsingOrb.tsx`
**Objetivo**: El componente importa el hook e intercambia `PulsingBorder` por `.orb-css-fallback` cuando `webGLSupported === false`. La prop API y el texto SVG no cambian.
**Validación**: `typecheck` pasa. En Desktop → shader activo. Emulando WebGL nulo → fallback visible.

### Fase 4: Validación Visual Cross-Device
**Objetivo**: Confirmar que el fix funciona en iPhone (viewport 390×844) y no regresiona Desktop.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Playwright screenshot viewport 390×844 muestra el orbe visible con fallback CSS
- [ ] Playwright screenshot viewport 1440×900 muestra el shader WebGL original
- [ ] Los 3 contextos de uso (flotante, central PAS, header) visualmente correctos

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-04-09: WebGL falla silenciosamente en iOS
- **Error**: `PulsingBorder` de `@paper-design/shaders-react` no renderiza en iOS Safari
- **Root cause**: `canvas.getContext('webgl')` retorna `null` → canvas silenciosamente vacío, sin error en consola
- **Fix**: Detector client-side pre-mount + CSS fallback encapsulado en el mismo componente
- **Aplicar en**: `ShaderBackground.tsx` también usa `MeshGradient` del mismo paquete → candidato para fix similar si surge el reporte de hero invisible en iOS

---

## Gotchas

- [ ] **Hydration mismatch**: El hook DEBE retornar `true` en SSR. Si inicializa en `false`, el servidor renderiza WebGL pero el cliente renderiza CSS → error de hydration en React.
- [ ] **SSR**: `document` no existe en server. El `try/catch` debe estar dentro de `useEffect` únicamente.
- [ ] **Tamaños**: El fallback CSS debe responder a la prop `size`. Usar `style={{ width: borderSize, height: borderSize }}` (no hardcodear px).
- [ ] **z-index y posición**: No cambiar la estructura del contenedor relativo. El texto SVG se posiciona con `absolute inset-0` sobre el orbe — ambas capas deben mantener ese contrato.
- [ ] **Versión inestable**: `@paper-design/shaders-react ^0.0.72` es 0.x — puede tener breaking changes sin semver. No agregar `onError` prop que no existe; la solución debe ser externa al componente.

## Anti-Patrones a Evitar

- ❌ NO usar `navigator.userAgent` para detectar iOS → frágil y no cubre todos los browsers que fallan WebGL
- ❌ NO envolver `PulsingBorder` en `try/catch` → no lanza excepciones, falla silenciosamente en el DOM
- ❌ NO usar `dynamic(() => import(...), { ssr: false })` → el componente ya es `'use client'`, no resuelve el problema de iOS
- ❌ NO crear un componente separado `PulsingOrbFallback` → viola DRY; todo debe estar en `PulsingOrb.tsx`
- ❌ NO eliminar `PulsingBorder` en favor del CSS para todos los devices → el shader en desktop es visualmente superior

---

*PRP pendiente de aprobación. No se ha modificado ningún archivo de código.*
