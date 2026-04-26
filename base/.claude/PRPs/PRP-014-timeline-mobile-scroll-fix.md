# PRP-014: Timeline Mobile Scroll Sync Fix

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-23
> **Proyecto**: landing-linkedin

---

## Objetivo

Corregir la desincronización de la luz de progreso (scroll-driven progress bar) en el componente `Timeline` para dispositivos móviles, asegurando que el indicador visual siga el scroll del usuario de forma precisa durante todas las fases.

## Por Qué

| Problema | Solución |
|----------|----------|
| La luz de progreso se queda atrás o desaparece en móviles al llegar a la Fase 2. | Implementar offsets dinámicos y un sistema de tracking de altura reactivo al redimensionamiento. |

**Valor de negocio**: Mejora la experiencia de usuario (UX) en la sección crítica de "Nuestro Proceso", transmitiendo profesionalismo y atención al detalle en la plataforma principal de captura de leads.

## Qué

### Criterios de Éxito
- [ ] La luz de progreso llega al final de la Fase 3 exactamente cuando el usuario termina de scrollear la sección en móvil.
- [ ] El indicador visual no desaparece prematuramente durante el scroll.
- [ ] La altura del contenedor se recalcula si hay cambios en el layout (resize o carga de imágenes).

### Comportamiento Esperado
1. El usuario entra en la sección "Tu Hoja de Ruta".
2. Al scrollear, la luz cyan desciende por la línea de tiempo.
3. En móvil, la luz se mantiene visible y sincronizada con el contenido de las fases scrolleadas.
4. Al llegar a la Fase 03, la luz completa el recorrido de la línea.

---

## Contexto

### Referencias
- `src/shared/components/ui/timeline.tsx` - Componente a modificar.
- [Framer Motion useScroll Docs](https://www.framer.com/motion/use-scroll/) - Referencia para offsets dinámicos.

### Análisis Técnico
- El `offset: ["start 10%", "end 50%"]` actual es estático y no considera que el viewport móvil es mucho más corto.
- El `height` se calcula en un `useEffect` con dependencia `[ref]`, pero no escucha cambios de tamaño de ventana (`resize`).

---

## Blueprint (Assembly Line)

### Fase 1: Diagnóstico Visual & Offsets
**Objetivo**: Identificar los offsets ideales para móviles y tablets mediante pruebas visuales.
**Validación**: Confirmar que `scrollYProgress` llega a 1 en el punto correcto del viewport.

### Fase 2: Robustez de Altura & Resize
**Objetivo**: Implementar un `ResizeObserver` o un listener de resize para actualizar el estado `height` dinámicamente.
**Validación**: Scrollear después de rotar el dispositivo o cambiar el tamaño de ventana sin perder sincronización.

### Fase 3: Validación Final (Playwright)
**Objetivo**: Asegurar que la implementación es pixel-perfect en dispositivos móviles simulados.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Screenshots de Playwright en viewport móvil (390x844) validan la posición de la luz.
- [ ] Criterios de éxito cumplidos.

---

### 2026-03-24: Sincronización de Scroll en Viewports Cortos (Móvil)
- **Error**: El uso de offsets estáticos (`end 50%`) y una sola medición de altura en el mount causaba que la luz de progreso se desincronizara en dispositivos móviles debido a cambios en el layout y viewports más dinámicos.
- **Fix**: 
    1. Implementar `ResizeObserver` para recalcular la altura (`height`) de forma reactiva a cambios de layout.
    2. Usar `useSpring` para suavizar el progreso y evitar saltos visuales.
    3. Ajustar offsets a `["start 20%", "end 80%"]` para mayor margen de maniobra en pantallas pequeñas.
- **Aplicar en**: Cualquier componente que use `framer-motion` `useScroll` con un target específico y dependa de la altura del contenedor.

---

## Gotchas
- El sticky de las fases puede interferir con la percepción de la luz si el offset es muy agresivo.
- `ResizeObserver` es fundamental si hay imágenes con carga perezosa que desplazan el contenido.

---

*PRP completado y verificado. Código robusto ante cambios de layout.*
