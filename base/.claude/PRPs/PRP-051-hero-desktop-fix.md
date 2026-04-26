# PRP-051: Optimización de Layout Hero Desktop

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-18
> **Proyecto**: kia intelligence

---

## Objetivo

Ajustar la alineación y el espaciado de la sección Hero en dispositivos Desktop para eliminar el solapamiento visual entre los títulos flotantes de `ScrollExpandMedia` y el contenido descriptivo (párrafo y CTAs).

## Por Qué

| Problema | Solución |
|----------|----------|
| En resoluciones Desktop, tanto los títulos como el contenido de soporte están centrados verticalmente (`justify-center`), lo que causa que se amontonen y tapen información crítica. | Cambiar la estrategia de alineación en Desktop de `justify-center` a `justify-start` con un offset (pt) que deje espacio libre para los títulos. |

**Valor de negocio**: Mejora inmediata en la legibilidad de la propuesta de valor principal y profesionalismo visual en pantallas grandes (UX/UI Premium).

---

## Qué

### Criterios de Éxito
- [ ] El párrafo descriptivo no se solapa con "Infraestructura de Ventas con IA" en Desktop.
- [ ] Se mantiene el centrado vertical perfecto en dispositivos Mobile/Tablet.
- [ ] Las animaciones de entrada (`initial/animate`) de Framer Motion no se ven afectadas.
- [ ] El cambio es puramente CSS/Tailwind (sin lógica de JS adicional si es posible).

### Comportamiento Esperado
1. El usuario entra en Desktop.
2. Los títulos "Infraestructura de Ventas..." y "Escala en Piloto Automático" aparecen en su posición central.
3. El párrafo "Implementamos tu Landing Page..." aparece notablemente más abajo, ocupando el espacio visual inferior sin interferir con los títulos.
4. Al hacer scroll, la expansión del video/lumina ocurre normalmente.

---

## Contexto

### Referencias
- `src/features/landing-page/components/HeroSection.tsx` - Archivo principal a modificar.
- `src/shared/components/ui/scroll-expansion-hero.tsx` - Componente que maneja los títulos absolutos.

### Arquitectura Propuesta
Modificación directa en el componente `HeroSection` para ajustar clases de Tailwind:
- Cambiar `justify-center` por `md:justify-start` en el contenedor de contenido.
- Incrementar el `pt` o la altura del spacer invisible `h-48`.

---

## Blueprint (Assembly Line)

### Fase 1: Diagnóstico Visual y Ajuste de Layout
**Objetivo**: Identificar el offset exacto necesario en Desktop y aplicar el cambio de clases en `HeroSection.tsx`.
**Validación**: Inspección visual manual y verificación de clases de Tailwind aplicadas correctamente en `md:` y `lg:`.

### Fase 2: Refinamiento de Animaciones
**Objetivo**: Asegurar que los desplazamientos de `y: 20` en Framer Motion no causen "jumps" visuales con el nuevo espaciado.
**Validación**: Transiciones suaves al cargar la página.

### Fase 3: Validación Final (Quality Control)
**Objetivo**: Confirmar que el fix solo afecta a Desktop y que Mobile sigue funcionando perfectamente.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Capturas de pantalla en 375px (Mobile) y 1440px (Desktop) muestran layouts correctos.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-04-18: Conflictos de Centrado Vertical en Absolute Layers
- **Error**: Usar `flex-col justify-center` en múltiples capas `absolute inset-0` garantiza el solapamiento de contenido si no hay una gestión de "zonas muertas" o offsets.
- **Fix**: Usar `justify-start` con padding superior calculado o `justify-end` con padding inferior en la capa de contenido de soporte.
- **Aplicar en**: Hero sections con elementos flotantes o shaders de fondo centrados.

---

## Gotchas
- [ ] El componente `ScrollExpandMedia` ya tiene un `-translate-y-[12vh]` en Mobile que debemos respetar.
- [ ] La altura del shader de fondo debe cubrir el nuevo espaciado si el contenido se empuja muy abajo.

## Anti-Patrones
- NO modificar `ScrollExpandMedia.tsx` si el problema se puede resolver desde el consumidor (`HeroSection.tsx`).
- NO usar valores de `top` fijos si se pueden usar utilidades de espaciado de Tailwind.

---

*PRP pendiente aprobación. No se ha modificado código.*
