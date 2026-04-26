# PRP-001: Optimización de Imágenes en BenefitsList

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-21
> **Proyecto**: Kia Intelligence

---

## Objetivo

Maximizar el área visible de las imágenes en las pestañas "Agente IA" (pestaña 2) y "Dashboard CRM" (pestaña 3) del componente `BenefitsList.tsx`, eliminando márgenes negros excesivos sin recortar el contenido original.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las capturas de pantalla del Agente IA y Dashboard aparecen pequeñas debido a un padding excesivo (`md:p-20 lg:p-24`), dejando demasiado espacio negro desperdiciado. | Reducir drásticamente el padding de los contenedores manteniendo `object-contain` para que la imagen aproveche todo el viewport disponible sin perder integridad. |

**Valor de negocio**: Mejora drástica del impacto visual y la legibilidad de las pruebas sociales (screenshots), permitiendo que el usuario aprecie los detalles del software sin esfuerzo.

## Qué

### Criterios de Éxito
- [ ] Imágenes en pestañas 2 y 3 ampliadas al menos un 40% respecto al tamaño actual.
- [ ] La imagen se muestra completa (sin recortes en los bordes) en desktop y mobile.
- [ ] Los drop-shadows y efectos atmosféricos se mantienen degradados suavemente.
- [ ] Verificación visual exitosa mediante screenshot en varios viewports.

### Comportamiento Esperado
Al navegar a las secciones "Vendedor IA 24/7" y "Dashboard CRM" en el scroll vertical de beneficios, las imágenes de fondo deben ocupar la mayor parte de la pantalla, dejando solo el margen necesario para que no toquen los bordes del viewport o las tarjetas de texto si están visibles.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` - Componente objetivo.
- `public/benefit/` - Almacén de activos visuales.

### Arquitectura Propuesta (Feature-First)
No se requiere cambio de arquitectura, solo ajustes en las clases de Tailwind dentro de `BenefitsList.tsx`.

---

## Blueprint (Assembly Line)

### Fase 1: Ajuste de Layout y Padding
**Objetivo**: Reducir el padding restrictivo en los contenedores de imagen de las secciones 2 y 3.
**Validación**: Inspección de código y preview local.

### Fase 2: Optimización de Object-Fit y Escala
**Objetivo**: Asegurar que las imágenes utilicen `object-contain` eficazmente y evaluar si `scale` de Framer Motion necesita ajustes.
**Validación**: Prueba de responsividad en Chrome DevTools.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando con impacto visual optimizado.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Screenshot de Playwright confirma que no hay márgenes negros excesivos.
- [ ] Imagen completa visible en mobile.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-21]: Optimización de Screenshots en Viewports Altura-Compacta
- **Error**: N/A (A documentar post-implementación)
- **Fix**: N/A
- **Aplicar en**: N/A

---

## Gotchas

- [ ] Las imágenes tienen diferentes relaciones de aspecto; `object-contain` es vital para no "romper" la UI.
- [ ] El padding no puede ser `0` totalmente para evitar que el drop-shadow se corte en los bordes.

## Anti-Patrones

- NO usar `object-cover` ya que recortaría información crítica de la interfaz del software que el usuario quiere ver.
- NO aumentar el padding en mobile, ya que el espacio es aún más crítico.

---

*PRP pendiente aprobación. No se ha modificado código.*
