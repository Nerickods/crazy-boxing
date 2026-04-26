# PRP-001: Elegant Case Study (Project Spotlight)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-17
> **Proyecto**: KIA Intelligence

---

## Objetivo

Implementar una sección de "Caso de Estudio" (Project Spotlight) debajo de la sección de beneficios, diseñada para mostrar un proyecto integral que combine los tres pilares del servicio: Landing Page, Agente IA y Dashboard CRM. Esta sección servirá como prueba social tangible ante la falta de testimonios tradicionales.

## Por Qué

| Problema | Solución |
|----------|----------|
| Falta de testimonios directos al ser un servicio nuevo/exclusivo. | Mostrar un proyecto real "unificado" que demuestre la capacidad técnica y operativa. |
| Los usuarios pueden no entender cómo se conectan los 3 pilares. | Una experiencia visual que guíe al usuario a través de la Landing, el Agente y el Dashboard de un mismo cliente. |

**Valor de negocio**: Aumenta la confianza del prospecto (social proof) y clarifica el entregable final mediante una demostración visual premium.

## Qué

### Criterios de Éxito
- [ ] Sección integrada debajo de `BenefitsList` en `src/app/page.tsx`.
- [ ] Visualización de 3 fases/conceptos para un solo proyecto:
    1. **Estructura de Autoridad (Landing)**
    2. **Cerebro Autónomo (Agente IA)**
    3. **Control Total (Dashboard CRM)**
- [ ] Diseño 100% responsive con transiciones suaves entre fases.
- [ ] Estéticamente alineado con el stack (Cyan/Emerald/Black) y efectos de glassmorphism.
- [ ] Uso de placeholders visuales de alta calidad / `generate_image`.

### Comportamiento Esperado (Happy Path)
1. El usuario hace scroll después de la lista de beneficios.
2. Aparece la sección "Project Spotlight" con un título de autoridad.
3. Se muestra el primer pilar (Landing) con una imagen de mockup y descripción.
4. El usuario puede alternar (via tabs o scroll interno) al segundo pilar (Agente IA) y al tercero (Dashboard).
5. Cada transición actualiza la imagen y el texto descriptivo con animaciones fluidas.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` - Por el uso de `FullScreenScrollFX` y estilos de tarjetas.
- `src/features/portfolio/components/CaseStudyResults.tsx` - Por la estética de grid y gradientes.
- `src/features/landing-page/components/PasSection.tsx` - Por el manejo de scroll-driven animations.

### Arquitectura Propuesta (Feature-First)
```
src/features/landing-page/
├── components/
│   ├── ElegantCaseStudy.tsx       # Componente principal
│   └── CaseStudyPillar.tsx        # Sub-componente para cada pilar
```

---

## Blueprint (Assembly Line)

### Fase 1: Estructura y Datos
**Objetivo**: Crear el componente base con mock data para los 3 pilares.
**Validación**: El componente renderiza el texto correcto para cada pilar sin errores.

### Fase 2: Diseño Visual y Animaciones
**Objetivo**: Implementar el layout premium (Imagen + Info) y las transiciones (Framer Motion).
**Validación**: Las transiciones entre los 3 conceptos son fluidas y visualmente atractivas.

### Fase 3: Integración y Responsividad
**Objetivo**: Insertar en `page.tsx` y ajustar para dispositivos móviles.
**Validación**: La sección se ve perfecta en desktop y mobile, manteniendo la legibilidad.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Verificación visual del "Project Spotlight" fluyendo correctamente en el scroll general.

---

## 🧠 Aprendizajes (Self-Annealing)

### [2026-04-17]: Diseño de Transiciones de "Ojos"
- **Nota**: Al ser un Project Spotlight, es vital que el usuario no se pierda. Usaremos indicadores visuales claros (dots o mini-tabs) para mostrar el progreso entre los 3 pilares.

---

## Gotchas
- [ ] La sección debe tener una altura controlada para no romper el flujo de `BenefitsList` que usa scroll full screen.
- [ ] Asegurar que los placeholders de imágenes mantengan el aspecto premium (vibrantes, no genéricos).

## Anti-Patrones
- NO usar un carousel estándar de librería externa; construirlo con `framer-motion` para control total del diseño.
- NO saturar de texto; usar bullets y frases cortas de impacto.

---

*PRP pendiente aprobación. No se ha modificado código.*
