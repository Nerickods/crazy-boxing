# PRP-019: Recuperación de Logo de Alta Fidelidad en Header

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-03
> **Proyecto**: KIA Intelligence

---

## Objetivo

Restaurar la presencia visual del logo en el header central tras las transiciones de scroll, asegurando que el componente "recuperado" mantenga la misma fidelidad, impacto visual y estilo que el logo original que se desvaneció en `PasSection`.

## Por Qué

| Problema | Solución |
|----------|----------|
| El logo que reaparece en el header central en `ProcessSection` se siente "menos visible" y visualmente inconsistente respecto al original o al que vuela en `PasSection`. | Unificar el logo en un componente compartido (`LogoIsotype`) con filtros, brillos (glows) y activos consistentes para todas las secciones involucradas. |

**Valor de negocio**: Refuerza la identidad de marca premium y la fluidez narrativa de la landing page, eliminando "saltos" visuales que degradan la experiencia del usuario.

## Qué

### Criterios de Éxito
- [ ] El logo en el header central tiene el mismo brillo, contraste y filtros que el logo de `LogoBrandFlow` (PasSection).
- [ ] La transición entre el logo "vuelo" de `SectionSeparator` y el logo "fijo" del `Header` es imperceptible.
- [ ] El componente visual del logo está centralizado en un solo lugar para facilitar futuros ajustes.
- [ ] Soporte completo para responsiveness (filtros ajustados para móvil vs desktop).

### Comportamiento Esperado (Happy Path)
1. El usuario hace scroll en `PasSection`. Al llegar al final, un logo central vuela hacia arriba.
2. Al cruzar el borde del header en `ProcessSection` (vía `SectionSeparator`), el logo del header reaparece exactamente con el mismo estilo visual.
3. El logo permanece centrado y vibrante durante el resto del scroll.

---

## Contexto

### Referencias
- `src/features/landing-page/components/Header.tsx`: Contiene el logo persistente central.
- `src/features/landing-page/components/PasSection.tsx`: Contiene `LogoBrandFlow` (el logo que vuela).
- `src/features/landing-page/components/SectionSeparator.tsx`: Gatillo de la reaparición del logo.
- `src/features/chat/store/chatStore.ts`: Gestiona `hasLogoInHeader`.

### Arquitectura Propuesta (Refactor)
Crear `src/features/landing-page/components/LogoIsotype.tsx`:
```tsx
export function LogoIsotype({ className, glow = true, variant = 'vibrant' }) {
  // Lógica de filtros unificada
  // Efectos de glow de alta fidelidad
}
```

---

## Blueprint (Assembly Line)

### Fase 1: Extracción del Componente Visual
**Objetivo**: Crear `LogoIsotype.tsx` basándose en el estilo más vibrante (probablemente el de `LogoBrandFlow` o `SectionSeparator`).
**Validación**: El componente se renderiza correctamente de forma aislada.

### Fase 2: Unificación en PasSection
**Objetivo**: Reemplazar el código manual de `LogoBrandFlow` por el nuevo `LogoIsotype`.
**Validación**: El logo que vuela mantiene su estilo anterior o mejora.

### Fase 3: Unificación en SectionSeparator
**Objetivo**: Usar `LogoIsotype` en el componente que gatilla la intersección.
**Validación**: Alineación visual perfecta con el logo del header.

### Fase 4: Unificación en Header
**Objetivo**: Reemplazar el logo persistente central de `Header.tsx` con `LogoIsotype`.
**Validación**: El logo reaparece con la fidelidad deseada.

### Fase 5: Validación Final
**Objetivo**: Sistema funcionando end-to-end con fluidez 60 FPS.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Verificación visual del scroll cross-fade.

---

## 🧠 Aprendizajes (Self-Annealing)

### [2026-04-03]: Inconsistencia en filtros de brillo
- **Error**: Se detectó que `Header.tsx` usaba `brightness-125` mientras que `SectionSeparator` usaba `brightness-150`.
- **Fix**: Centralizar en `LogoIsotype` con lógica adaptativa.

---

## Gotchas
- [ ] Los filtros de CSS (`drop-shadow`, `brightness`) tienen impacto diferente en móvil (Safari iOS) respecto a Chrome Desktop.
- [ ] `AnimatePresence` en el Header debe estar sincronizado con la reaparición para evitar parpadeos.

## Anti-Patrones
- NO duplicar los estilos de `filter` y `drop-shadow` en múltiples archivos.

---

*PRP pendiente aprobación. No se ha modificado código.*
