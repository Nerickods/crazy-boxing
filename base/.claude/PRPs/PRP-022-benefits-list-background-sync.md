# PRP-022: Sincronización de Fondo BenefitsList (Emerald Glass Interface)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-27
> **Proyecto**: KIA Intelligence

---

## Objetivo

Transformar las tarjetas de la sección `BenefitsList` para que compartan la misma identidad visual del fondo general (`GlassRefractionBackground`), permitiendo que los blobs dinámicos de color esmeralda y los efectos de refracción sean visibles a través de las tarjetas, manteniendo la lógica de revelado por scroll y los efectos de shader internos.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las tarjetas de `BenefitsList` tienen fondos HSL propios que se sienten desconectados del fondo esmeralda profundo de la landing. | Implementar transparencia real con `backdrop-blur` y refactorizar los shaders locales para que utilicen la paleta esmeralda/teal de la marca, integrándose orgánicamente. |

**Valor de negocio**: Refuerza la identidad visual de "élite" y "tecnología invisible", mejorando la inmersión del usuario mediante una estética de vidrio premium (glassmorphism) que reacciona al fondo dinámico.

## Qué

### Criterios de Éxito
- [ ] La sección `BenefitsList` debe ser transparente para mostrar el `GlassRefractionBackground` fijo.
- [ ] Las tarjetas de beneficios deben usar `bg-black/20` o similar con `backdrop-blur-xl`.
- [ ] Los shaders `Warp` de cada tarjeta deben usar la paleta esmeralda oficial (#10b981, #064e3b, #059669).
- [ ] El efecto de "revelado circular/lineal" por scroll (`clip-path`) debe mantenerse intacto.
- [ ] El shader debe aplicarse con una opacidad reducida o `mix-blend-mode: screen/overlay` para no tapar completamente el fondo general.

### Comportamiento Esperado
Al hacer scroll hacia `BenefitsList`, el usuario ve cómo las tarjetas se rellenan (reveal) sobre el fondo de blobs esmeralda que ya vienen del hero. Las tarjetas se sienten como cristales flotantes que refractan el fondo central del sitio.

---

## Contexto

### Referencias
- `src/components/ui/glass-refraction-background.tsx`: Fuente de los blobs y strips de vidrio.
- `src/features/landing-page/components/BenefitsList.tsx`: Componente a modificar.
- `BUSINESS_LOGIC.md`: Paleta de colores Emerald/Teal.

### Arquitectura Propuesta (Modificación)
Se modificará el componente `CardBenefit` dentro de `BenefitsList.tsx` para:
1. Eliminar el background negro sólido de la sección.
2. Ajustar el `Warp` shader para ser sutil.
3. Fortalecer el efecto de vidrio (glassmorphism).

---

## Blueprint (Assembly Line)

> IMPORTANTE: Implementación via `bucle-agentico` por fases con mapeo de contexto JIT.

### Fase 1: Transparencia de Capas e Inmersión del Fondo
**Objetivo**: Asegurar que la sección sea transparente para mostrar el `GlassRefractionBackground` de fondo. Ajustar `z-index` y opacidades base.
**Validación**: Al scrollear sobre `BenefitsList`, los blobs esmeralda del fondo dinámico deben ser visibles detrás de las tarjetas.

### Fase 2: Sincronización de Paleta Teal/Emerald
**Objetivo**: Actualizar la configuración de colores en `BENEFITS` para usar HSLs alineados con la marca (#06b6d4, #10b981).
**Validación**: Los shaders de cada tarjeta deben tener una transición de color suave dentro de la gama esmeralda.

### Fase 3: Refinamiento de Glassmorphism (Efecto Vidrio)
**Objetivo**: Aplicar `backdrop-blur-xl`, `mix-blend-mode` (opcional) y bordes de alta definición (`border-white/15`) para maximizar el realismo del cristal.
**Validación**: Las tarjetas deben mostrar una refracción clara del fondo mientras mantienen el glow de acento.

### Fase 4: Validación Final y Performance
**Objetivo**: Confirmar que no hay regresiones en el sistema de scroll y que la performance (FPS) se mantiene estable.
**Validación**:
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Screenshot de Playwright confirma el look-and-feel premium.

---

## 🧠 Aprendizajes (Self-Annealing)

*(Se completará durante la ejecución)*

---

## Gotchas
- [ ] El shader `Warp` puede consumir muchos recursos si tiene muchas iteraciones; mantener bajo 10 si es posible.
- [ ] El `backdrop-blur` en grandes superficies puede provocar lag en navegadores no integrados (Safari/Mobile).

## Anti-Patrones
- NO usar `bg-black/80` (es demasiado opaco).
- NO mezclar colores azules eléctricos de la configuración anterior.

---

*PRP pendiente aprobación. No se ha modificado código.*
