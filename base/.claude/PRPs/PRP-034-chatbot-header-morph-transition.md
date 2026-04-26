# PRP-034: Chatbot Header Morph Transition

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-02
> **Proyecto**: KIA Intelligence (landing-linkedin)

---

## Objetivo

Reubicar el componente `PulsingExperience` (trigger del chatbot) desde su posición `fixed bottom-right` hacia el **lado izquierdo del Header**, donde actualmente vive el logo. La transición ocurre una sola vez: al terminar la sección `PasSection` (scroll progress ≈ 1.0), el PulsingExperience se difumina en su posición actual y **simultáneamente** aparece materializado en el slot del logo del Header, donde permanece **fijo y funcional** durante el resto de la página.

## Por Qué

| Problema | Solución |
|----------|----------|
| El chatbot trigger (`PulsingExperience`) vive en `bottom-right` — zona de "banner blindness" donde los usuarios lo ignoran por fatiga UX de floating buttons | Integrarlo orgánicamente en el Header, la zona de mayor visibilidad persistente. El usuario lo ve **siempre** sin que sea intrusivo |
| El logo del Header ocupa espacio pero no genera conversión directa. El fundador tiene otros planes para él | Reemplazar con el asset de mayor valor de conversión: el trigger del chatbot IA |
| La transición abrupta (aparecer/desaparecer) rompe la narrativa cinematográfica que ya establece PasSection | Cross-fade scroll-driven que sigue la misma filosofía Morningside: todo fluye con el scroll |

**Valor de negocio**: Maximizar la visibilidad del chatbot IA (el "vendedor 24/7") colocándolo en la posición de mayor tiempo de exposición de toda la landing (el Header). Esto debería incrementar la tasa de interacción con el bot al eliminar la dependencia de que el usuario note un floating button.

## Qué

### Criterios de Éxito
- [ ] `PulsingExperience` **NO** es visible al cargar la página en su posición `bottom-right` inicial → aparece ahí normalmente solo durante Hero + PasSection
- [ ] Al alcanzar `scrollYProgress ≈ 0.96-1.0` de PasSection, el componente en `bottom-right` se difumina con `opacity 1 → 0` + `blur(0 → 10px)` + `scale(1 → 0.8)`
- [ ] **Simultáneamente**, una instancia del mismo componente aparece en el Header (slot izquierdo donde era el logo) con `opacity 0 → 1` + `blur(10px → 0)` + `scale(0.8 → 1)`
- [ ] Una vez materializado en el Header, permanece ahí **fijo** sin importar cuánto se scrollee (no se revierte)
- [ ] El `ChatWidget` (ventana del chat) sigue abriendo/cerrando correctamente desde la nueva posición
- [ ] El `ChatWidget` se reposiciona: ahora se abre desde el **lado izquierdo** (alineado con su trigger en el Header)
- [ ] Performance: 0 jank, 60 FPS en la transición. Sin re-renders innecesarios
- [ ] Mobile responsive: funciona en todas las resoluciones
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso

### Comportamiento Esperado (Happy Path)

```
SCROLL TIMELINE:
═══════════════════════════════════════════════════════════════

[Hero Section]
  → PulsingExperience visible en bottom-right (comportamiento actual)
  → Logo visible en Header (comportamiento actual)

[PasSection — scrollYProgress 0.0 → 0.95]
  → PulsingExperience sigue en bottom-right
  → Logo sigue en Header
  → Todo normal

[PasSection — scrollYProgress 0.96 → 1.0] ← ZONA DE TRANSICIÓN
  → PulsingExperience en bottom-right:
      opacity:  1.0 → 0.0
      blur:     0px → 10px  
      scale:    1.0 → 0.8
  → PulsingExperience en Header (slot del logo):
      opacity:  0.0 → 1.0
      blur:     10px → 0px
      scale:    0.8 → 1.0
  → Logo del Header: desaparece (o ya no estaba)

[ProcessSection → FaqAccordion → LandingCta]
  → PulsingExperience FIJO en Header-left ← estado permanente
  → Click → Abre ChatWidget desde el lado izquierdo
  → El componente bottom-right no existe / está oculto

[Si el usuario scrollea DE VUELTA al Hero]  
  → El PulsingExperience en Header SE MANTIENE (no revierte)
  → NOTA: Considerar si se debe revertir. Decisión: NO revertir.
    El usuario ya "descubrió" el chatbot. Mantener en Header siempre.
    (Si en el futuro se necesita reversibilidad, se agrega una flag.)
```

---

## Contexto

### Referencias — Archivos a Modificar

| Archivo | Rol Actual | Cambio |
|---------|------------|--------|
| [PulsingExperience.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/PulsingExperience.tsx) | Trigger del chat. `fixed bottom-8 right-8 z-[100]`. Usa `PulsingBorder` shader + SVG text rotativo. Se conecta a `useChatStore`. | **Refactorizar**: Extraer la lógica visual del componente a un sub-componente reutilizable (`PulsingOrb`). La instancia "floating" y la instancia "header" renderizan el mismo `PulsingOrb` pero en contenedores distintos con estados de visibilidad distintos. |
| [Header.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/Header.tsx) | Navbar con logo `logo.png` a la izquierda + nav links + menu button. El logo cambia de tamaño con scroll (`isScrolled`). | **Modificar**: Reemplazar el bloque del logo (`<Link href="/">` → `<motion.div>` con logo) por un contenedor que reciba el `PulsingOrb` cuando `hasMorphed=true`. Usar transición controlada por el nuevo state global. |
| [ChatWidget.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/chat/components/ChatWidget.tsx) | Ventana del chat. `fixed bottom-28 right-6 z-[9999]`. Se abre/cierra con `isOpen` del store. | **Modificar posición**: Cuando el chatbot está "morphed" al Header, el `ChatWidget` debe abrirse desde `top-20 left-6` en lugar de `bottom-28 right-6`. La ventana se desplegará tipo dropdown-panel desde el Header. |
| [chatStore.ts](file:///home/nerick_ods/solutions/landing-linkedin/src/features/chat/store/chatStore.ts) | Zustand store con `isOpen`, `isMinimized`, `messages`, `sessionId`, etc. | **Extender**: Agregar `hasMorphedToHeader: boolean` + `setMorphedToHeader(v: boolean)`. Esta flag controla dónde se renderiza el trigger y dónde se posiciona el ChatWidget. |
| [layout.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/app/layout.tsx) | Root layout. Renderiza `<PulsingExperience />` y `<ChatWidget />` globalmente debajo de `{children}`. | **Modificar**: El `PulsingExperience` floating solo se renderiza cuando `!hasMorphedToHeader`. El `ChatWidget` ajusta su posición basado en `hasMorphedToHeader`. |
| [page.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/app/page.tsx) | Landing page. Compone: Header → Hero → PasSection → Process → etc. | **Sin cambios directos**, pero el Header ahora recibirá el `PulsingOrb`. |
| [PasSection.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/PasSection.tsx) | Sección scroll-driven (900vh). `scrollYProgress` con offset `["start start", "end end"]`. Usa Framer Motion springs. | **Agregar observer**: Al detectar `scrollYProgress >= 0.96`, dispatchar `setMorphedToHeader(true)` al store. Este es el **trigger point** de la transición. |

### Arquitectura Propuesta

```
ANTES (actual):
┌─────────────────────────────────────┐
│ layout.tsx                          │
│  ├── {children}                     │
│  │    └── page.tsx                  │
│  │         ├── Header (con logo)    │
│  │         ├── PasSection           │
│  │         └── ...                  │
│  ├── PulsingExperience (bottom-R)   │  ← siempre visible aquí
│  └── ChatWidget (bottom-R)          │  
└─────────────────────────────────────┘

DESPUÉS (propuesto):
┌─────────────────────────────────────┐
│ layout.tsx                          │
│  ├── {children}                     │
│  │    └── page.tsx                  │
│  │         ├── Header               │
│  │         │    └── [Logo slot] ←── │── PulsingOrb aparece aquí
│  │         ├── PasSection            │   (cuando hasMorphedToHeader)
│  │         └── ...                  │
│  ├── PulsingExperience (bottom-R)   │  ← se oculta post-morph
│  └── ChatWidget (LEFT o RIGHT)      │  ← posición dinámica
└─────────────────────────────────────┘
```

### Patrón de Transición — Detalle Técnico

**Problema clave**: No se puede animar suavemente un componente de "bottom-right" a "top-left header" con CSS/Framer Motion posicional porque son dos contextos de layout completamente distintos (`fixed` en root vs. `relative` en Header). Un `FLIP animation` sería complejo y propenso a bugs.

**Solución elegida: Cross-Fade Dual Instance**

Se renderizan **dos instancias** del orbe visual:
1. **Instancia A** (bottom-right): La actual. Se desvanece con el scroll de PasSection.
2. **Instancia B** (header-left): Aparece simultáneamente cuando A se desvanece.

Ambas usan el mismo sub-componente visual (`PulsingOrb`) y comparten el mismo store para el chat toggle. El resultado visual es un "morph" donde el orbe parece viajar del bottom-right al header, pero en realidad son dos nodos del DOM con un cross-fade sincronizado.

```typescript
// Flujo de estado:
// 1. PasSection scrollYProgress llega a 0.96
// 2. PasSection llama setMorphedToHeader(true)
// 3. layout.tsx: PulsingExperience floating empieza fade-out
// 4. Header.tsx: PulsingOrb en slot del logo empieza fade-in
// 5. Ambas transiciones duran ~400ms con easing
// 6. Estado final: solo el orbe del Header es visible y clickeable
```

### Dimensiones del Orbe en Header

El PulsingExperience actual tiene `w-20 h-20` (80px) con el PulsingBorder incrustado a `60x60`. En el Header:
- **Header expandido** (`h-24`, no scrolled): orbe de `size-10` (40px) para encajar con el espacio del logo actual (`size-10`)
- **Header compacto** (`h-16`, scrolled): orbe de `size-8` (32px) para mantener proporción con el header compacto
- El SVG de texto rotativo se **omite** en la versión Header (demasiado pequeño para leerse). Solo se conserva el orbe pulsante.

### Posición del ChatWidget Post-Morph

Actualmente: `fixed bottom-28 right-6`

Post-morph: `fixed top-20 left-6` (dropdown desde el header)

La animación de entrada cambia:
- **Antes**: `y: 40 → 0` (sube desde abajo)
- **Después**: `y: -40 → 0` (baja desde arriba, como dropdown)

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Store y Componente Reutilizable

**Objetivo**: Extender `chatStore` con `hasMorphedToHeader` y extraer `PulsingOrb` como sub-componente visual reutilizable (sin cambios visibles aún para el usuario).

**Validación**: 
- `PulsingOrb` existe como componente independiente que acepta props de tamaño y puede ser renderizado en cualquier contenedor
- `chatStore` expone `hasMorphedToHeader` y `setMorphedToHeader`
- El comportamiento actual de la landing NO cambia (regresión cero)

### Fase 2: PasSection Observer + Cross-Fade Floating

**Objetivo**: Implementar el trigger en PasSection que detecta `scrollYProgress >= 0.96` y dispara `setMorphedToHeader(true)`. El `PulsingExperience` floating en bottom-right ejecuta la animación de fade-out cuando `hasMorphedToHeader === true`.

**Validación**: 
- Al scrollear hasta el final de PasSection, el orbe en bottom-right se desvanece con la animación especificada (opacity+blur+scale)
- El store refleja `hasMorphedToHeader: true`
- Si se hace scroll hacia arriba, el orbe floating NO reaparece

### Fase 3: Header Morph-In + Logo Replacement

**Objetivo**: Modificar `Header.tsx` para renderizar el `PulsingOrb` en el slot del logo cuando `hasMorphedToHeader === true`. El orbe aparece con la animación de fade-in sincronizada. El logo desaparece.

**Validación**:
- Al terminar PasSection, el orbe aparece en el Header con animación suave
- El orbe en el Header es clickeable y abre/cierra el chat correctamente
- El logo ya no se muestra post-morph
- El branding text "KIA Intelligence" junto al logo se conserva o se adapta (decisión: conservar el texto, reemplazar solo el icono del logo)

### Fase 4: ChatWidget Reposicionamiento

**Objetivo**: Modificar `ChatWidget.tsx` para que, cuando `hasMorphedToHeader === true`, se posicione como dropdown desde el Header-left en lugar de floating bottom-right.

**Validación**:
- Click en el orbe del Header → ChatWidget aparece como panel dropdown desde `top-20 left-6`
- La animación de entrada es `y: -40 → 0` (dropdown style)
- Todos los features del chat siguen funcionando: enviar mensaje, recibir respuesta, reset, close
- En mobile, el ChatWidget sigue siendo full-width o casi (92vw)

### Fase 5: Responsive, Polish y Validación Final

**Objetivo**: Asegurar que todo funciona en mobile y desktop, optimizar performance, y verificar la integración end-to-end.

**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Transición suave 60 FPS en desktop y mobile
- [ ] No hay jank ni re-renders innecesarios visibles en React DevTools
- [ ] El chat funciona correctamente desde ambas posiciones (antes y después del morph)
- [ ] Criterios de éxito del PRP cumplidos al 100%

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.
> El conocimiento persiste para futuros PRPs. El mismo error NUNCA ocurre dos veces.

*(Vacío — se llena durante implementación)*

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] **SSR + Zustand persist**: `hasMorphedToHeader` NO debe persistirse en localStorage. Si el usuario recarga la página, debe empezar en `false`. Usar `partialize` en el persist middleware para excluirlo, o manejarlo fuera del persist.
- [ ] **PulsingBorder shader**: Es un WebGL canvas. Renderizar dos instancias simultáneamente (durante el cross-fade de ~400ms) podría ser costoso. Mitigar: la instancia floating puede ser un `<div>` estático con CSS glow durante el fade-out en lugar del shader activo.
- [ ] **Header z-index**: El header es `z-50`. El PulsingExperience actual es `z-[100]`. El ChatWidget es `z-[9999]`. Asegurarse de que el orbe en el Header hereda un z-index suficiente para que el ChatWidget se abra por encima.
- [ ] **Hydration**: `PulsingExperience` usa `PulsingBorder` que es client-only. El componente ya es `'use client'`, pero verificar que no haya mismatch al renderizar condicionalmente en Header.
- [ ] **PasSection solo existe en `/`**: Si el usuario navega directo a `/services` u otra ruta, el morph nunca ocurre. Necesitamos un fallback: en rutas que no sean `/`, el PulsingExperience permanece en bottom-right (comportamiento actual).

## Anti-Patrones

- NO intentar una animación posicional FLIP entre dos nodos de layout distintos → Cross-fade dual instance es más predecible
- NO persistir `hasMorphedToHeader` en localStorage → causaría que la transición se "salte" en reloads
- NO renderizar dos shaders WebGL simultáneamente por más de 500ms → usar fallback CSS para la instancia que se desvanece
- NO romper el flujo actual del chat → el store es la fuente de verdad, no el layout
- NO hardcodear breakpoints para el tamaño del orbe → usar las mismas clases responsive que el logo actual

---

*PRP pendiente aprobación. No se ha modificado código.*
