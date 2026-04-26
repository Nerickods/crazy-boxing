# PRP-035: Early Logo-to-Chatbot Header Morph

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-03
> **Proyecto**: KIA Intelligence Landing Page

---

## Objetivo

Adelantar el morph del chatbot al **momento exacto en que el logo de KIA aparece en `PasSection`**, creando una sincronización cinemática entre el logo flotante en pantalla y el chatbot que "hereda" su posición en el Header — como si el logo volara hacia arriba para convertirse en el trigger de la IA.

## Por Qué

| Problema | Solución |
|----------|----------|
| El morph actual ocurre al 96% de la sección, cuando el usuario ya está casi en el final y la transición pasa desapercibida | Disparar el morph en el 65%: justamente cuando el logo KIA aparece en el centro de pantalla, el Header hace el swap simultáneamente, dando la ilusión de que el logo "se teletransporta" al Header |
| El Header y PasSection operan como elementos visuales desconectados | Sincronizar sus animaciones para que el usuario perciba un solo movimiento: el logo de la marca se convierte en la puerta de acceso al asistente de IA |

**Valor de negocio**: La ilusión de que el logo "se convierte en tu asistente" es un momento de alto impacto emocional. Cuando el usuario ve el logo y acto seguido lo ve en el Header como un chatbot pulsante, el mensaje de "KIA Intelligence es IA-first" queda grabado. Esto puede mejorar significativamente la tasa de apertura del chat.

---

## Qué

### Criterios de Éxito
- [ ] El logo del Header comienza a difuminarse y el PulsingOrb aparece **en el mismo frame** en que el logo KIA de PasSection empieza a ser visible (progress `~0.65`).
- [ ] Existe una transición de cross-fade fluida y simultánea entre el logo en PasSection y el PulsingOrb en el Header.
- [ ] El logo KIA en PasSection sigue apareciendo y haciendo su animación interna sin cambios visuales para el usuario.
- [ ] Al hacer scroll hacia atrás (si el usuario no recargó), el morph **no** se revierte (comportamiento no-reversible por diseño del store con `partialize`).
- [ ] `typecheck` y `build` pasan sin errores.

### Comportamiento Esperado (Happy Path)

1. Usuario scrollea por `PasSection` pasando los títulos cinéticos.
2. En el **65%** del scroll de la sección (`smoothProgress = 0.65`), el logo KIA empieza a aparecer en el centro de la pantalla.
3. **Simultáneamente**, el logo estático del Header se difumina con un fade-out + blur en ~300ms.
4. El `PulsingOrb` hace su fade-in + scale-in en el slot del logo del Header, también en ~300ms.
5. El usuario termina de scrollear por PasSection y llega al CTA final donde el Header ya tiene el orbe chatbot integrado.

---

## Contexto

### Análisis del Código Actual

**Archivo clave**: `src/features/landing-page/components/PasSection.tsx`

El `LogoBrandFlow` component (línea 259) define la aparición del logo con este rango:
```typescript
// Aparición del logo KIA en PasSection
const opacity = useTransform(progress, [0.65, 0.72, 0.94, 0.98], [0, 1, 1, 0]);
```
→ El logo **empieza a aparecer** en `progress = 0.65`.

El trigger actual del morph (línea 22-26):
```typescript
useMotionValueEvent(scrollYProgress, "change", (latest) => {
  if (latest >= 0.96 && !hasMorphedToHeader) {   // ← CAMBIAR: 0.96 → 0.65
    setMorphedToHeader(true);
  }
});
```

**Archivo clave**: `src/features/landing-page/components/Header.tsx`

El swap actual usa `AnimatePresence` con duración de 500ms. La nueva transición debe usar una duración más corta (~300ms) y un easing más rápido para sentirse sincronizada con el logo que aparece abajo.

**Archivo clave**: `src/features/chat/store/chatStore.ts`

`hasMorphedToHeader` es no-persistente (excluido vía `partialize`). Sin cambios necesarios aquí.

### Referencias
- `PasSection.tsx` línea 22 → Trigger del morph actual
- `PasSection.tsx` línea 261 → Range de aparición del `LogoBrandFlow`
- `Header.tsx` línea 79-105 → `AnimatePresence` para logo ↔ orb
- `chatStore.ts` línea 14-62 → Estado del morph

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo FASES. Subtareas se generan al entrar a cada fase con el bucle agéntico.

### Fase 1: Adelantar Trigger del Morph
**Objetivo**: Cambiar el threshold del `useMotionValueEvent` en `PasSection.tsx` de `0.96` a `0.65`, sincronizando con la primera aparición del logo KIA.
**Validación**: Al llegar al 65% del scroll de PasSection, `hasMorphedToHeader` se pone en `true`.

### Fase 2: Optimizar Animación del Header
**Objetivo**: Refinar las duraciones y easings del `AnimatePresence` en `Header.tsx` para que el swap logo→orb tome `~300ms` con un easing `easeOut` que se perciba instantáneo y suave, coordinado con la aparición del logo KIA en PasSection.
**Validación**: Visualmente, el logo del Header desaparece y el orbe aparece sin "salto" perceptible.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando con el nuevo timing, sin regresiones.
**Validación**:
- [ ] `npm run typecheck` pasa sin errores
- [ ] La transición se dispara al 65% de scroll en PasSection
- [ ] El orbe en el Header es estable y el ChatWidget funciona desde esa posición

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-04-03: Sincronización por threshold en useMotionValueEvent
- **Aprendido**: El `useMotionValueEvent` con threshold único (`>= X`) es la forma más determinista de disparar un evento global desde el scroll. Alternativas como `useEffect + scrollY` tienen lag por debounce implícito del re-render.
- **Aplicar en**: Cualquier feature que requiera sincronizar estado global con un punto específico del scroll.

### 2026-04-03: overflow-hidden corta el texto rotatorio del PulsingOrb
- **Error anterior**: El contenedor del logo en Header tenía `overflow-hidden`, lo que recortaba el texto SVG que orbitaba fuera del radio del orbe.
- **Fix**: Remover `overflow-hidden` condicionalmente cuando `hasMorphedToHeader === true`.
- **Aplicar en**: Cualquier componente SVG con elementos que desborden su contenedor padre.

---

## Gotchas

- [ ] **Backward scroll**: El morph es no-reversible en el store (by design). Si el usuario hace scroll hacia arriba, el orbe permanece en el Header. Esto es intencional para que el chatbot sea siempre accesible.
- [ ] **Mobile timing**: En mobile, el `smoothProgress` spring tiene la misma configuración. El trigger al 65% puede sentirse "brusco" en pantallas táctiles por la velocidad del scroll. Si hay feedback de mobile, considerar un margen de ±2% (`>= 0.63`).
- [ ] **No tocar `LogoBrandFlow`**: La animación del logo KIA en PasSection **no cambia**. Solo cambia cuándo se dispara el morph del Header.

---

*PRP pendiente aprobación. No se ha modificado código.*
