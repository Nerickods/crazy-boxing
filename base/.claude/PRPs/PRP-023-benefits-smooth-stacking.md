# PRP-023: Transiciones Fluidas en BenefitsList (Anti-Stacking Logic)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-27
> **Proyecto**: KIA Intelligence

---

## Objetivo

Corregir el error de UX/UI en la sección `BenefitsList` donde las tarjetas semi-transparentes se amontonan visualmente durante el scroll. El objetivo es implementar un ciclo de vida de opacidad para cada tarjeta, asegurando que solo una tarjeta (o la transición entre dos) sea visible en cualquier momento dado.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las tarjetas actuales se quedan fijas y visibles una vez "reveladas". Al ser semi-transparentes (`backdrop-blur`), las capas de texto y colores de las tarjetas inferiores se traslapan con las superiores, creando ruido visual. | Implementar una lógica de `opacity` dinámica que desvanezca la tarjeta anterior (Index N-1) a medida que la tarjeta actual (Index N) se revela. |

**Valor de negocio**: Mejora drástica en la legibilidad y la percepción de calidad "premium" del sitio. Evita la confusión del usuario al leer beneficios encimados.

## Qué

### Criterios de Éxito
- [ ] Solo una tarjeta es 100% opaca en el centro de su rango de scroll.
- [ ] La tarjeta anterior (N-1) llega a `opacity: 0` cuando la siguiente (N) llega a `opacity: 1`.
- [ ] El efecto de "revelado" por `clip-path` se sincroniza con el desvanecimiento de la capa inferior.
- [ ] No hay traslape de textos legibles entre tarjetas diferentes.

### Comportamiento Esperado
A medida que el usuario hace scroll:
1. Aparece el Beneficio 1 (Reveal).
2. Al seguir scrolleando, el Beneficio 1 se desvanece suavemente mientras el Beneficio 2 se "revela" por encima.
3. El proceso se repite para el Beneficio 3.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx`: Lógica de `CardBenefit`.
- `framer-motion`: Uso de `useTransform` con rangos escalonados.

### Arquitectura Propuesta
Modificar `CardBenefit` para aceptar un rango extendido de opacidad:
- `entry`: [fillStart, fillEnd] -> Opacity [0, 1]
- `exit`: [nextFillStart, nextFillEnd] -> Opacity [1, 0]

---

## Blueprint (Assembly Line)

### Fase 1: Mapeo de Rangos Dinámicos
**Objetivo**: Calcular matemáticamente los puntos de salida para cada tarjeta basados en el `index` y `total`.
**Validación**: Cada tarjeta debe saber cuándo debe empezar a desaparecer.

### Fase 2: Implementación de Opacidad Escalonada
**Objetivo**: Aplicar `useTransform` a la opacidad del contenedor principal de la tarjeta.
**Validación**: Al scrollear, la tarjeta anterior debe ser invisible cuando la actual ocupe el espacio.

### Fase 3: Refinamiento de Z-Index y Performance
**Objetivo**: Asegurar que la tarjeta activa siempre esté por encima y que no haya saltos visuales.
**Validación**:
- [ ] `npm run typecheck`
- [ ] Verificación visual manual de que no hay "ghosting" de beneficios anteriores.

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-03-27: Transparencia vs Stacking
- **Error**: El uso de `backdrop-blur` en elementos apilados multiplica el ruido visual si no se maneja el ciclo de vida de salida.
- **Fix**: Sincronizar la salida de la capa N con la entrada de la capa N+1.

---

*PRP pendiente aprobación. No se ha modificado código.*
