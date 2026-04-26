# PRP-066: Optimización de Interacción Táctil (Mobile Hover Bug)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-24
> **Proyecto**: landing-linkedin

---

## Objetivo

Eliminar el retraso en la activación de los efectos visuales (glow/magnetic border) en dispositivos móviles, asegurando que las tarjetas respondan instantáneamente al toque (`touchstart`) sin depender del scroll para recalcular la posición del puntero.

## Por Qué

| Problema | Solución |
|----------|----------|
| En móvil, el efecto `GlowingEffect` solo se activa tras hacer scroll, ya que el evento `pointermove` no se dispara de forma consistente al tocar. | Implementar listeners de `touchstart` y `pointerdown` directamente en los contenedores para forzar la actualización inmediata de las coordenadas del puntero. |
| El estado del puntero (`lastPosition`) se vuelve estático en móvil, causando que el efecto se sienta "muerto" hasta que hay movimiento de scroll. | Sincronizar el estado de "actividad" de la tarjeta con eventos de toque inmediatos y añadir un fallback de "pulso" o "centro fijo" para punteros gruesos (coarse). |

**Valor de negocio**: Mejora drástica en la percepción de calidad y respuesta (perceived performance) del sitio en dispositivos móviles, eliminando la sensación de "lag" o bugs visuales en el primer contacto del usuario.

## Qué

### Criterios de Éxito
- [ ] Activación instantánea del borde luminoso al tocar cualquier `GlassCard` en iOS y Android.
- [ ] Eliminación de la dependencia del evento `scroll` para mostrar el estado inicial del hover.
- [ ] Desactivación limpia del efecto al tocar fuera de la tarjeta (evitar hover persistente).
- [ ] Mantenimiento de la fluidez actual (60fps) en animaciones de escritorio.

### Comportamiento Esperado
1. El usuario toca una tarjeta en su móvil.
2. El evento `pointerdown` actualiza instantáneamente `lastPosition`.
3. La variable CSS `--active` cambia a `1` inmediatamente.
4. El borde luminoso aparece en el punto de contacto.
5. Al soltar o tocar otra área, la tarjeta vuelve a su estado inactivo de forma suave.

---

## Contexto

### Referencias
- `src/components/ui/glowing-effect.tsx` - Lógica central del efecto (actualmente dependiente de global `pointermove`).
- `src/shared/components/GlassCard.tsx` - Wrapper que inyecta el efecto.
- `src/features/landing-page/components/WhyMeSection.tsx` - Ejemplo de uso intensivo.

### Arquitectura Propuesta (Refactor)
No se requiere una nueva estructura, sino una mejora en `GlowingEffect.tsx` y potencialmente en `GlassCard.tsx` para propagar eventos de toque.

```typescript
// En GlowingEffect.tsx
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0];
  handleMove({ x: touch.clientX, y: touch.clientY });
};
```

---

## Blueprint (Assembly Line)

### Fase 1: Diagnóstico y Prototipado de Eventos
**Objetivo**: Validar qué eventos de toque (`touchstart` vs `pointerdown`) son más confiables en el stack actual.
**Validación**: Logs en consola confirman captura instantánea de coordenadas en móvil.

### Fase 2: Refactor de GlowingEffect
**Objetivo**: Integrar los nuevos listeners en el hook `useEffect` de `GlowingEffect.tsx` y asegurar que `handleMove` acepte actualizaciones forzadas.
**Validación**: El efecto visual se muestra al primer toque sin necesidad de scroll.

### Fase 3: Gestión de Estado "Sticky" en Móvil
**Objetivo**: Implementar lógica para limpiar el estado `--active` cuando el usuario deja de interactuar o toca otra sección (evitar que el glow se quede pegado).
**Validación**: Solo una tarjeta (o la actual) muestra el efecto activo.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end sin regresiones en desktop.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Pruebas en dispositivos reales (o emulador de Chrome con touch habilitado).

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-24]: Mobile Pointer Latency
- **Error**: El uso exclusivo de `pointermove` global en `document.body` causa latencia en móvil porque el navegador prioriza el scroll antes que el movimiento del puntero.
- **Fix**: Añadir listeners de `pointerdown` y `touchstart` localmente o asegurar que no sean bloqueados por el scroll.

---

## Gotchas

- [ ] Los eventos de `touch` pueden interferir con el scroll nativo si no se usan con `{ passive: true }`.
- [ ] En iOS, el estado `:hover` se emula y puede causar que el glow se quede "encendido" hasta el siguiente tap.

## Anti-Patrones

- NO usar `onClick` para activar efectos visuales (genera delay de 300ms en algunos navegadores antiguos).
- NO desactivar el efecto magnético en móvil si el hardware es capaz de renderizarlo; solo optimizar su activación.

---

*PRP pendiente aprobación. No se ha modificado código.*
