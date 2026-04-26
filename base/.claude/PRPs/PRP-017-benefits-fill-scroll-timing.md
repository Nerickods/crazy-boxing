# PRP-017: BenefitsList — Optimización de Sincronización de Scroll Fill

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-27
> **Proyecto**: KIA Intelligence

---

## Objetivo

Ajustar la sincronización del efecto "fill" (llenado de color) en las tarjetas de `BenefitsList.tsx` para que alcancen el 100% de visibilidad más rápido durante el scroll, asegurando que estén completamente coloridas cuando el usuario las tiene en foco central (según la captura compartida).

## Por Qué

| Problema | Solución |
|----------|----------|
| Las tarjetas se quedan al ~90% de su llenado cuando están en el centro del viewport, perdiendo impacto visual. | Adelantar el punto de finalización (0% clip) en el rango de scroll para que el impacto cromático sea total al estar en foco. |

**Valor de negocio**: Mejora la percepción de "Resultado Tangible" (branding) y asegura que el mensaje visual sea completo en el momento de mayor atención del usuario.

---

## Qué

### Criterios de Éxito
- [ ] Las tarjetas alcanzan el 100% de color (fill) antes de llegar al punto central del scroll de la sección.
- [ ] La transición de color es fluida y no se siente brusca.
- [ ] El comportamiento es consistente en desktop (basado en `sectionProgress`).
- [ ] El efecto de "vignette" y glow se sincroniza con el llenado total.

### Comportamiento Esperado (Happy Path)
1. El usuario hace scroll hacia la sección "Resultados Tangibles".
2. Las tarjetas aparecen inicialmente con un estado "Inactivo" (vidrio traslúcido).
3. Conforme entran en el viewport, el color empieza a subir desde abajo.
4. **Al llegar a la posición central de la captura compartida, la tarjeta ya debe estar al 100% de color.**
5. El color se mantiene mientras la tarjeta está en el área de lectura principal.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` (Líneas 178-187: lógica de `useTransform`).
- Captura de pantalla de referencia (muestra ~90% fill en posición central).

### Análisis de Realidad Actual
En la versión actual:
```tsx
const desktopRange = [0.25, 0.55, 0.95];
const fillLevel = useTransform(activeProgress, desktopRange, [100, 0, 0]);
```
- A `progress = 0.55` llega al 100% de fill.
- Si en la foto está al 90%, es que el scroll está cerca de `0.52`.
- **Propuesta**: Cambiar el rango a `[0.2, 0.45, 0.95]` para que complete el llenado mucho antes.

---

## Blueprint (Assembly Line)

### Fase 1: Calibración de Rangos y Testing Visual
**Objetivo**: Ajustar `desktopRange` y opcionalmente `mobileRange` para que el llenado sea reactivo y rápido.
**Validación**:
- Probar con valores `[0.2, 0.45, 0.95]`.
- Verificar que el `opacity` y `glowOpacity` (líneas 191-196) sigan teniendo sentido con el nuevo timing.

### Fase 2: Refinamiento de Animación (Framer Motion)
**Objetivo**: Asegurar que no haya saltos visuales y que el shader `Warp` se vea nítido.
**Validación**: El `fillLevel` debe fluir sin tirones.

### Fase 3: Verificación UI
**Objetivo**: Confirmar que en Desktop y Mobile el llenado se completa en el lugar correcto.
**Validación**: Screenshot manual o visual confirmando el 100% fill en el centro.

---

## 🧠 Aprendizajes (Self-Annealing)

*(Por completar tras la ejecución)*

---

## Gotchas
- Un llenado demasiado rápido puede verse brusco. Hay que encontrar el balance entre "rápido" e "impactante".
- El `sectionProgress` depende de la altura total de la sección. Si la sección cambia, el timing se desplaza ligeramente.

---

*PRP pendiente de aprobación. No se ha modificado código.*
