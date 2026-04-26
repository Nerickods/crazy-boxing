# PRP-020: Header Situacional + Label "Services" + Layout Vertical

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-02
> **Proyecto**: KIA Intelligence Landing

---

## Objetivo

Refinar la experiencia en la sección de servicios para que: (1) el header muestre "Services" como label adicional junto a "KIA Intelligence" cuando el usuario está dentro del bloqueo de esa sección, (2) se elimine el título redundante "KIA INTELLIGENCE SERVICES" del body de la sección, y (3) el contenido (foto + tarjetas) suba más en el viewport.

## Por Qué

| Problema | Solución |
|----------|----------|
| "KIA INTELLIGENCE SERVICES" aparece dos veces (header fijo + dentro de la sección) | Quitar el bloque interno; usar solo el header + label |
| El IntersectionObserver se activa/desactiva prematuramente porque la sección sticky no desbloquea el scroll hasta el final | Usar `threshold: 0` y detectar entrada/salida real del bloqueo |
| Título y tarjetas muy abajo en mobile | Reducir padding-top adicional |

**Valor de negocio**: Interfaz más limpia, experiencia cinematográfica coherente con el Hero.

## Qué

### Criterios de Éxito
- [ ] El header muestra "**KIA** Intelligence **· Services**" solo mientras la sección está bloqueando el scroll
- [ ] Al salir de la sección, desaparece "Services" del header y vuelve el glassmorphism
- [ ] El título redundante "KIA INTELLIGENCE SERVICES" dentro del `header={}` prop de `FullScreenScrollFX` es eliminado
- [ ] Foto del módulo y las 3 tarjetas se ven sin necesidad de scroll en un iPhone 14 (390x844)

### Comportamiento Esperado

1. **Antes de Servicios**: Header normal (glassmorphic cuando scrolled)
2. **Al entrar en Servicios**: Header → transparente + aparece "· Services" en verde esmeralda junto al nombre
3. **Durante todo el bloqueo sticky**: El header mantiene ese estado sin fluctuaciones
4. **Al salir de Servicios (siguiente sección)**: "Services" desaparece, header vuelve a glassmorphic

---

## Contexto

### Referencias
- `src/features/landing-page/components/Header.tsx` — lógica de IntersectionObserver actual
- `src/features/landing-page/components/BenefitsList.tsx` — prop `header={}` a eliminar
- `src/shared/components/ui/full-screen-scroll-fx.tsx` — padding mobile a ajustar

### Problema Técnico del IntersectionObserver
La sección `#benefits-scroll-fx` es una sección STICKY de scroll completo (GSAP ScrollTrigger). La altura total del elemento en el DOM es muy grande (3x viewport para anclar el scroll). Por eso:
- Con `threshold: 0.1` se activa al entrar el primer 10% → **OK**
- Pero se desactiva antes de que el usuario termine de scrollear las subsecciones → **PROBLEMA**

**Solución correcta**: Mantener `threshold: 0` y adicionalmente verificar que el `scrollY` está dentro del rango vertical del elemento (`getBoundingClientRect`) o usar un `rootMargin` negativo que solo detecte cuando el elemento está ocupando la pantalla completa.

### Arquitectura del Label "Services"
El label no es una ruta nueva — es un **estado del header**. Cuando `isInServices === true`:
```tsx
// Dentro del AnimatePresence del logo:
<span className="font-black text-emerald-400">· Services</span>
```

---

## Blueprint (Assembly Line)

### Fase 1: Fix del IntersectionObserver (Header.tsx)
**Objetivo**: Que `isInServices` sea `true` durante TODO el tiempo que la sección sticky esté bloqueando el scroll, sin fluctuaciones.
**Cambios**:
- Cambiar el observer a `threshold: 0` con `rootMargin: "-10% 0px"` para asegurar que el elemento ocupa suficiente del viewport.
- Alternativamente: comparar `scrollY` contra `getBoundingClientRect` del elemento en el scroll handler para determinar si estamos dentro del rango de la sección.
**Validación**: Scrollear en mobile — el header permanece transparente durante TODA la animación de la sección de servicios sin parpadeos.

### Fase 2: Label "Services" en el Header (Header.tsx)
**Objetivo**: Cuando `isInServices === true`, mostrar "· Services" animado junto al nombre en el header.
**Cambios en `Header.tsx`**:
```tsx
// En el bloque AnimatePresence del logo (estado !isScrolled || isInServices):
<motion.span
  initial={{ opacity: 0, x: -8 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -8 }}
  className="font-black text-sm md:text-base text-emerald-400 tracking-widest uppercase ml-1"
>
  · Services
</motion.span>
```
Solo visible cuando `isInServices === true`.
**Validación**: El label aparece y desaparece con transición suave.

### Fase 3: Eliminar Título Redundante (BenefitsList.tsx)
**Objetivo**: Quitar el prop `header={<motion.div>KIA Intelligence Services...</motion.div>}` del componente `FullScreenScrollFX`.
**Cambios**: Remover la prop `header={...}` completamente (líneas 121-144) o vaciarla. El header fijo del sitio ya maneja la identificación de sección.
**Validación**: La sección ya no muestra el título del header interno.

### Fase 4: Subir Contenido (full-screen-scroll-fx.tsx + BenefitsList.tsx)
**Objetivo**: Las 3 tarjetas y el título de cada módulo deben ser visibles sin scroll adicional en mobile.
**Cambios**:
- Reducir `padding: 180px 1rem 80px` → `padding: 130px 1rem 70px` para mobile.
- Reducir `mt-2 md:mt-24` → `mt-1 md:mt-24` en el wrapper `fx-featured-content`.
- Reducir `mt-8` → `mt-3` en `FeatureGrid`.
**Validación**: En 390x844, el título + 3 cards son visibles en el primer frame.

### Fase 5: Validación Final + Push
**Objetivo**: Sistema funcionando end-to-end sin regresiones.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] `git push origin feature/ai-chatbot-admin`

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-04-02: IntersectionObserver en secciones STICKY/ScrollTrigger
- **Error**: `threshold: 0.1` no es suficiente para secciones sticky de GSAP. El elemento DOM ocupa mucho espacio vertical pero visualmente "bloquea" toda la pantalla.
- **Fix**: Usar `threshold: 0` + `rootMargin: "-10% 0px"` o comparar con `scrollY` para detectar el rango real.
- **Aplicar en**: Cualquier sección con GSAP ScrollTrigger que use sticky + pin.

---

## Gotchas

- [ ] El `header={}` prop de `FullScreenScrollFX` puede usarse en otros contextos — verificar que eliminarlo no rompe el componente en otros lugares antes de borrar
- [ ] El AnimatePresence del label "Services" debe ser un hijo separado para no interferir con el "KIA Intelligence" existente
- [ ] El label "Services" solo debe aparecer en mobile/desktop si `isInServices === true`, no como estado persistente

## Anti-Patrones

- NO duplicar el nombre de la empresa en header + sección
- NO usar threshold > 0 en secciones sticky de GSAP
- NO hardcodear el texto "Services" como parte del logo permanente

---

*PRP-020 pendiente aprobación. No se ha modificado código.*
