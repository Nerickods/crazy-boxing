# PRP-020: Animated Logo Carousel Integration

> **Estado**: APROBADO
> **Fecha**: 2026-04-06
> **Proyecto**: KIA Intelligence

---

## Objetivo

Integrar un componente animado de tipo "Logo Carousel" al final de la sección `ProcessSection.tsx` para mostrar visualmente las herramientas tecnológicas ("The Invisible Stack") empleadas en el negocio.

## Por Qué

| Problema | Solución |
|----------|----------|
| Falta de tangibilidad en la promesa de "infraestructura robusta" del paso 2 del proceso. | Exponer los logos reconocibles del stack tecnológico que usamos (React, Supabase, Vercel, Next.js) aporta credibilidad técnica inmediata. |

**Valor de negocio**: Refuerza la autoridad de la oferta aumentando la confianza del usuario mediante social proof "técnico" y validando visualmente qué tecnologías robustas lo respaldan.

## Qué

### Criterios de Éxito
- [ ] Dependencias necesarias instaladas (`@radix-ui/react-avatar`, `lucide-react`, `embla-carousel-react`, `@radix-ui/react-slot`, `class-variance-authority`, `motion`).
- [ ] Componentes base añadidos en la carpeta por defecto de shadcn (`src/components/ui/`): `avatar.tsx`, `carousel.tsx`, `button.tsx`, `card.tsx`, `text-roll.tsx`, y `logo-carousel.tsx`.
- [ ] Renderizado sin errores del elemento tipo demo al final de `ProcessSection.tsx`.
- [ ] Los assets de las imágenes (usando SVGs provistos como cdn.worldvectorlogo) están adaptados mediante Tailwind filters al entorno "Dark-first" puro (`dark:brightness-0 dark:invert`).

### Comportamiento Esperado
Tras pasar las tres fases de la línea de tiempo en la sección "Process", el usuario verá desplazándose bajo ellas un Infinite Scroll Carousel ("Powering the Web", o adaptado a "Powered by the Invisible Stack"). Este carrusel se moverá automáticamente usando `embla-carousel`.

---

## Contexto

### Referencias
- *Path de Componentes UI:* El proyecto usa `src/components/ui/` tal como define su ruta `components.json`. Sigue el standard Shadcn perfectamente (no hay que crear carpetas extrañas).
- Archivo destino: `src/features/landing-page/components/ProcessSection.tsx`.

### Arquitectura Propuesta (Feature-First)
```
src/components/ui/
├── avatar.tsx          [NUEVO]
├── button.tsx          [NUEVO]
├── card.tsx            [NUEVO]
├── carousel.tsx        [NUEVO]
├── text-roll.tsx       [NUEVO]
└── logo-carousel.tsx   [NUEVO]
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase

### Fase 1: Instalación de Dependencias
**Objetivo**: Instalar NPM utilities para animaciones y UI primitives.
**Validación**: NPM culmina exitoso y actualiza `package.json`.

### Fase 2: Implementación de UI Components Módulo
**Objetivo**: Insertar en `src/components/ui/` el código provisto de Avatars, Buttons, Cards, Carousel general y Text Roll.
**Validación**: Archivos creados, formateados y comprobados sintácticamente en Typescript.

### Fase 3: Integración en ProcessSection.tsx
**Objetivo**: Importar renderizar `AnimatedCarousel` a la sección del timeline actual, ajustando títulos.
**Validación**: Montaje correcto a nivel interfaz sin corromper el layout responsivo previo del `Timeline`.

### Fase N: Validación Final
**Objetivo**: UI renderizado fluido.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Animaciones y scroll infinito `autoPlay` son exitosos bajo `framer-motion` y `embla-carousel`.
- [ ] Adaptación de opacidades y paleta de colores cyan combinan correctamente.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-06]: Pendiente inicialización
- **Error**: N/A
- **Fix**: N/A
- **Aplicar en**: N/A

---

## Gotchas

- [ ] Hay que asegurar que el uso de `use client` acompañe a `embla-carousel` y `motion` donde sea apropiado para que Next.js no genere conflictos con SSR.
- [ ] Asegurar que el filtro `brightness-0 invert` haga resaltar un tono unificado que respete el dark mode (sabiendo que toda la landing ya es dark).

## Anti-Patrones

- NO generar un CSS manual si ya lo abarca la utilidad de Tailwind CSS (`filter`, `invert`, etc).
- NO alterar dependencias que ya existan ni sobrescribir archivos Shadcn a menos que sea en pro de la actualización misma.

---

*PRP pendiente aprobación. No se ha modificado código.*
