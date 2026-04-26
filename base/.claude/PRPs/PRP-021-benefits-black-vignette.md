# PRP-021: BenefitsList — Cinematic Black Atmospheric Vignette

## Objetivo
Replicar el efecto de "Luz Atmosférica" de la `PasSection` en la entrada de `BenefitsList`, pero utilizando el color **negro** para crear un degradado de profundidad y una transición suave (vignette) desde la sección anterior.

## Por Qué (Valor de Negocio)
- **Coherencia de Diseño**: Establece un lenguaje visual común entre secciones críticas.
- **Enfoque en el Contenido**: La sombra superior (vignette) ayuda a centrar la mirada en el título y las tarjetas a medida que se revelan.
- **Transición Premium**: Suaviza el cambio entre el background de la sección anterior y el patrón de "Cortina Vertical" de BenefitsList.

## Criterios de Éxito
- [ ] **Vignette Superior**: Un degradado negro en la parte de arriba del contenedor sticky.
- [ ] **Sincronización de Opacidad**: El efecto es más fuerte al entrar (`progress 0.0`) y se desvanece gradualmente hasta desaparecer en el punto de bloqueo (`progress 0.25`).
- [ ] **Profundidad Atmosférica**: Uso de ruido sutil y capas de degradado para evitar que parezca una simple caja negra.

## Comportamiento Esperado (Happy Path)
1. Al empezar a scrollear hacia "Resultados Tangibles", la parte superior de la sección tiene una sombra profunda (vignette negro).
2. A medida que la sección sube y el título entra, la sombra se aclara dinámicamente.
3. Al llegar al sticky lock (`top-0`), la sombra ha desaparecido por completo, dejando el fondo limpio y el brillo de la Tarjeta 1 al máximo.

## Contexto Técnico
- **Archivo**: `src/features/landing-page/components/BenefitsList.tsx`
- **Lógica de Animación**:
  ```typescript
  const vignetteOpacity = useTransform(sectionProgress, [0, 0.25], [1, 0]);
  ```
- **Estructura propuesta**:
  - Insertar un `motion.div` al inicio del `Sticky Container`.
  - Usar un `radial-gradient` o `linear-gradient` negro hacia transparente.

## Blueprint de Fases

### Fase 1: Creación del Componente Vignette
- Implementar la estructura de capas (Degradado principal + Ruido de grano) similar a `PasSection`.

### Fase 2: Integración de la Lógica de Scroll
- Vincular la opacidad al `sectionProgress` (rango `[0, 0.25]`).

### Fase 3: Pulido Visual
- Ajustar la altura (`vh`) y la suavidad del degradado para un "feeling" premium.

---

## Aprendizajes (Auto-Blindaje)
- *A completar tras la implementación*
