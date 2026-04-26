# PRP-005: Lumina Slider Z-Index Ghost Fix (Definitivo)

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-21
> **Proyecto**: SaaS Factory V3

---

## Objetivo

Eliminar el "escudo fantasma" invisible que está bloqueando y absorbiendo físicamente todos los clics destinados al `LuminaSlider`, permitiendo que la interactividad validada en PRP-004 finalmente sea utilizable por el usuario.

## Por Qué

| Problema | Solución |
|----------|----------|
| El slider principal no reacciona a los clics del usuario a pesar de que el código interno de eventos es perfecto (`onClick`). Esto ocurre porque la capa de texto inicial (`HeroSection`) no se clarea y sigue atrapando eventos como un muro transparente (`pointer-events-auto` sobreescribiendo a su padre). | Remover la clase de Tailwind `pointer-events-auto` del hijo en `HeroSection.tsx` y aplicar renderizado condicional inteligente / mitigación de propagación de clics en la capa de expansión intermedia. |

**Valor de negocio**: Evitar la sensación de "producto roto" en la Landing Page principal y desbloquear del todo la navegación hacia los perfiles de los módulos convertidores.

## Qué

### Criterios de Éxito
- [ ] Clic en flecha derecha/izquierda funciona sin impedimentos.
- [ ] Clic en título central redirige al href correcto.
- [ ] No hay ningún div invisible (con altura/anchura ocupando pantalla) entorpeciendo clics cuando la expansión termina.

### Comportamiento Esperado
1. El usuario hace scroll hacia abajo en la Landing Page.
2. El efecto cinemático condensa el Hero y revela el `LuminaSlider`.
3. El contenido de texto inicial (copys estáticos transparentes) cede completamente la jerarquía de eventos (`pointer-events: none`).
4. El slider atrapa los eventos con éxito.

---

## Contexto

### Referencias
- `src/features/landing-page/components/HeroSection.tsx`
- `src/shared/components/ui/scroll-expansion-hero.tsx`

### El Origen del Defecto (Post Mortem H1)
En el DOM, existen las siguientes capas al superponerse:
1. `z-0` -> La caja del slider.
2. `z-10` -> Contenedor de Textos Hero.

Durante la animación de `scrollProgress`, JS añade un estilo envolvente al contenedor de textos (`z-10`):
`childrenRef.current.style.pointerEvents = 'none'` y `opacity: 0`. 

**El Error fatal:** Sin embargo, dentro de este contenedor invisible, hay un div gigantesco renderizado en `HeroSection.tsx`:
`<div className="w-full min-h-[90vh] ... pointer-events-auto text-center">`
Según las normas del estándar CSS, un hijo con `pointer-events: auto` explícito siempre reactivará la captación de clics, **sobrenscribiendo** el `pointer-events: none` de su padre en cascada.
Dado que está en `z-10` y ocupa el 90% vertical de la pantalla (`min-h-[90vh]`), se ha vuelto un muro invisible que absorbe indiscriminadamente todos los clics del ratón, impidiendo que el Slider (ubicado en `z-0`) reciba interacción táctil en absoluto.

### Arquitectura Propuesta (Feature-First)
Modificación de propiedades CSS nativas controladas por `ScrollExpandMedia` y reescritura de clases Tailwind restrictivas.

---

## Blueprint (Assembly Line)

### Fase 1: Limpieza de Capas Fantasma (HeroSection)
**Objetivo**: Remover el origen del muro transparente en la capa cliente que declara `pointer-events-auto` hardcodeado.
**Validación**: Borrado el tag `pointer-events-auto` del `<div className="w-full min-h-[90vh]">` en `HeroSection.tsx`.

### Fase 2: Robustecimiento Híbrido (ScrollExpandMedia)
**Objetivo**: Condicionar la renderización interna de CSS o utilizar render explícito de estado.
**Validación**: 
- Reasegurar que la opacidad reducida `progress === 1` colapsa el container (`display: none` localmente o `pointer-events: none !important`), erradicando cualquier sobreescritura CSS local.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando end-to-end interactivo.
**Validación**:
- [x] UI Visual test pasa (Manual).
- [x] `npm run typecheck` pasa.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-03-21: CSS Pointer-Events Hierarchy override
- **Error**: Asumir que aplicar `pointer-events: none` por JS a un elemento padre desactivará a todos sus hijos. Un hijo con una clase explícita de `pointer-events-auto` (Tailwind) siempre heredará su propio estado por especificidad y reactivará la captación de clics, formando un muro invisible si está posicionado sobre otros elementos.
- **Fix**: Remover las clases explícitas innecesarias del renderizado de los hijos para dejar que el padre fluya naturalmente el `none` hacia abajo por toda la cascada cuando es inyectado por JS.
- **Aplicar en**: Cualquier arquitectura de React que use enmascaramiento Z-Index y opacidades variables para paneles/fondos (ej. Acordeones, Sliders con Scroll, Modales superpuestos).

---
*PRP ejecutado y blindado exitosamente.*
