# PRP-039: Permanent Tripartite Header Layout

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-05
> **Proyecto**: KIA Intelligence

---

## Objetivo

Estandarizar el header global de la landing page a un formato **tripartito permanente** como se muestra en la identidad de marca, eliminando la transición condicional de diseño inicial y asegurando que el logo central y las marcas laterales sean visibles desde el primer momento de carga.

## Por Qué

| Problema | Solución |
|----------|----------|
| El header inicial se siente vacío en comparación con el header "final" tras el scroll. | Unificar la identidad visual premium desde el primer frame de carga. |
| El logo central solo aparece mediante un trigger de scroll (morph), perdiendo impacto inicial. | Posicionar el Isotipo (diamante) en el centro de forma permanente desde el Hero. |
| La inconsistencia visual entre el estado "scrolled" y "unscrolled" fragmenta el branding. | Layout robusto de 3 zonas (Izquierda: **KIA INTELLIGENCE**, Centro: Isotipo, Derecha: **Dynamic Context + Menú**). |

**Valor de negocio**: Reforzar el posicionamiento de marca de "élite" y "tecnológica" desde que el usuario aterriza en la web, mejorando la percepción de autoridad inmediata.

---

## Qué

### Criterios de Éxito
- [ ] Header utiliza layout `grid grid-cols-[1fr_auto_1fr]` de forma permanente (Tripartite Grid).
- [ ] El logo central (`LogoIsotype`) es visible desde el scroll 0.
- [ ] El bloque **"KIA INTELLIGENCE"** aparece unido en la zona izquierda.
- [ ] El indicador dinámico (**"· Hero" / "· Services"**) se mueve a la zona derecha, junto al menú.
- [ ] La transición de altura (24 -> 16) se mantiene por performance, pero el contenido se ajusta suavemente.

### Comportamiento Esperado (Happy Path)
1. El usuario entra a la landing.
2. El header aparece inmediatamente con: **KIA INTELLIGENCE** (izquierda), Isotipo Diamante (centro) y el contexto dinámico (derecha: **· Hero**).
3. Al hacer scroll, el header reduce su altura de 24 a 16 px y activa el backdrop-blur, pero mantiene exactamente los mismos 3 elementos en su posición original.
4. El indicador dinámico cambia a **"· Services"** cuando el usuario llega a esa sección, siempre ubicado en la zona derecha.

---

## Contexto

### Referencias
- `src/features/landing-page/components/Header.tsx`: Archivo principal a modificar.
- `src/features/landing-page/components/HeroSection.tsx`: Contexto visual inicial.
- `src/features/chat/store/chatStore.ts`: Variables `hasLogoInHeader` y `hasMorphedToHeader`.

### Arquitectura Propuesta (Refactor)
Se simplificará la lógica de renderizado condicional en `Header.tsx`:
- Eliminar `useTripartiteGrid` variable y forzar el uso de la clase de grid.
- Eliminar condicional `hasLogoInHeader` para el renderizado del logo central.
- Eliminar condicional `showTripartiteLayout` para las marcas laterales.

---

## Blueprint (Assembly Line)

### Fase 1: Refactor de Layout Estático
**Objetivo**: Forzar el grid de 3 columnas y visibilidad de labels laterales.
**Validación**: El header muestra "KIA" e "INTELLIGENCE" incluso en scroll 0.

### Fase 2: Integración de Logo Central Permanente
**Objetivo**: Hacer que el `LogoIsotype` aparezca por defecto.
**Validación**: Logo diamante visible en el centro desde el inicio.

### Fase 3: Coordinación de Animaciones (Self-Annealing)
**Objetivo**: Ajustar la transición de "morph" del separator para que no cause doble logo o saltos visuales si la lógica anterior dependía de un desvanecimiento.
**Validación**: Scroll suave sin glitches visuales de duplicidad de assets.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Playwright screenshot confirma UI similar a la imagen compartida.
- [ ] Criterios de éxito cumplidos

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-05]: Redundancia de Estado en Header
- **Error**: El header dependía de variables globales de chat para renderizar elementos de marca base.
- **Fix**: Separar la identidad visual del header de la lógica del asistente IA (exceptuando el 'morphed orb').
- **Aplicar en**: Futuros refactors de UI donde el branding deba ser persistente.

---

## Gotchas
- [ ] El morphing del separator actual podría requerir ajustes en `hasLogoInHeader` para evitar que intente "inyectar" un segundo logo si ya existe uno.
- [ ] La altura del header en mobile (Responsive) debe verificarse para evitar que el logo central choque con los laterales en viewports pequeños.

## Anti-Patrones
- NO usar `flex items-center justify-between` si el objetivo es un layout alineado por zonas (usar Grid).
- NO duplicar componentes de Logo; usar el `LogoIsotype` existente.

---

*PRP pendiente aprobación. No se ha modificado código.*
