# PRP-002: Caso de Estudio - MMA Academy Landing

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-17
> **Proyecto**: landing-linkedin

---

## Objetivo

Crear una subpágina dedicada al caso de estudio "MMA Academy Landing" que funcione como prueba de autoridad visual y técnica, integrando el diseño premium "Liquid Glass" y narrando la transformación digital de la academia.

## Por Qué

| Problema | Solución |
|----------|----------|
| La academia MMA tenía un sitio básico que no convertía visitantes en estudiantes inscritos. | Landing page moderna con flujo de conversión optimizado, métricas Lighthouse de 95+ y diseño UI/UX premium. |

**Valor de negocio**: Sirve como activo de venta para cerrar nuevos clientes demostrando capacidades de diseño full-stack y optimización de conversión.

## Qué

### Criterios de Éxito
- [ ] Nueva ruta funcional en `/(main)/casos/mma-academy`.
- [ ] Estructura de componentes `CaseStudyHero`, `CaseStudyProcess`, y `CaseStudyResults`.
- [ ] Implementación de `GlassRefractionBackground` consistente con la sección `/services`.
- [ ] Animaciones de entrada fluidas usando `Framer Motion`.
- [ ] Diseño responsive optimizado para dispositivos móviles.

### Comportamiento Esperado
El usuario navega a la página del caso de estudio. Se recibe con un Hero impactante. Al hacer scroll, se revela el problema y la solución mediante una cuadrícula de diseño limpio. El proceso de 5 pasos se visualiza de forma secuencial y finalmente se muestran las métricas de éxito (performance, diseño, responsive).

---

## Contexto

### Referencias
- `src/features/services/page.tsx` - Referencia para el fondo y la estructura de layout.
- `src/features/landing-page/components/Header.tsx` - Navegación global.
- `src/components/ui/glass-refraction-background.tsx` - Componente de fondo compartido.

### Arquitectura Propuesta (Feature-First)
```
src/features/portfolio/
├── components/
│   ├── CaseStudyHero.tsx
│   ├── CaseStudySection.tsx
│   ├── CaseStudyProcess.tsx
│   └── CaseStudyResults.tsx
├── data/
│   └── mma-academy.ts
└── types/
    └── index.ts
```

---

## Blueprint (Assembly Line)

### Fase 1: Estructura de Feature "Portfolio"
**Objetivo**: Inicializar el directorio de la feature y definir los tipos/datos del caso de estudio.
**Validación**: Archivos de esquema y datos creados.

### Fase 2: Layout Base y Navegación
**Objetivo**: Crear la ruta en el App Router e integrar el fondo y el Header.
**Validación**: Página accesible con fondo refractivo funcional.

### Fase 3: Componentes de Narrativa (Hero, Grid, Process)
**Objetivo**: Construir las secciones que cuentan la historia del proyecto (Problema → Solución → Proceso).
**Validación**: Contenido visualmente alineado con los datos del MMA Academy.

### Fase 4: Métricas y Pulido Final
**Objetivo**: Implementar la sección de resultados con barras de progreso o indicadores de métricas Lighthouse y animaciones de cierre.
**Validación**: `npm run typecheck` y check visual con screenshots.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-17]: Coherencia de Fondo
- **Nota**: El componente `GlassRefractionBackground` debe envolver todo el `main` para que los efectos de partículas y refracción sean consistentes durante el scroll.

---

## Gotchas
- [ ] Asegurar que las imágenes generadas para el placeholder tengan una relación de aspecto adecuada para el Hero (16:9).
- [ ] Verificar que los gradientes de la marca (emerald/white) se apliquen correctly en los iconos de Lucide.

## Anti-Patrones
- NO crear un layout separado si se puede heredar de `(main)/layout.tsx`.
- NO usar componentes de `landing-page` directamente si no son compartidos (usar `shared` o copiar a `portfolio`).

---

*PRP pendiente aprobación. No se ha modificado código.*
