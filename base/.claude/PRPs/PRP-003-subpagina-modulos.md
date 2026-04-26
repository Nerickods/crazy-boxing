# PRP-003: Subpáginas de Módulos - Navegación Clickable

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-20
> **Proyecto**: Landing LinkedIn

---

## Objetivo

Transformar los módulos de la sección BentoEcosystem en tarjetas interactivas clickeables con efectos hover premium. Al hacer click en un módulo, navegar a una subpágina dedicada (`/modulos/[slug]`) que muestre sus diferenciadores en formato BentoGrid, manteniendo consistencia visual con la landing principal.

## Por Qué

| Problema | Solución |
|----------|----------|
| Los usuarios no pueden explorar a profundidad cada módulo del ecosistema desde la landing. | Tarjetas clickeables que llevan a subpáginas detalladas con más información y diferenciadores. |
| Falta de interactividad en la presentación de los módulos. | Efectos hover premium y navegación fluida que aumenta el engagement. |
| Los diferenciadores del Vendedor IA están acoplados a la landing principal. | Subpáginas modulares donde cada módulo tiene su propio espacio y diferenciadores. |

**Valor de negocio**: Incrementar el tiempo en sitio al permitir exploración profunda de cada módulo, mejorar la percepción de valor al mostrar diferenciadores específicos, y crear arquitectura escalable para futuros módulos.

## Qué

### Criterios de Éxito
- [x] Los 4 módulos (Vendedor IA, Landing, Dashboard, Conectividad) son clickeables con efectos hover visibles
- [x] Click en Módulo 1 redirige a `/modulos/vendedor-ia` con diseño consistente
- [x] La subpágina `/modulos/vendedor-ia` muestra los diferenciadores actuales en BentoGrid
- [x] Navegación "back" funcional para retornar a la landing
- [x] Animaciones suaves en transiciones y efectos hover
- [x] Layout responsive que funciona en mobile, tablet y desktop
- [x] Todos los módulos aplican el mismo patrón visual (clickable + hover)

### Comportamiento Esperado

**Flujo Principal (Happy Path):**
1. Usuario llega a la landing y hace scroll hasta la sección "Ecosistema de Élite"
2. Al pasar el cursor sobre cualquier módulo, aparece efecto hover (escala sutil, brillo, indicador de clickeable)
3. Usuario hace click en "Módulo 01: Vendedor IA 24/7"
4. Navegación suave a `/modulos/vendedor-ia`
5. Subpágina carga con:
   - Header consistente con la landing
   - Hero del módulo con título y descripción
   - BentoGrid con los 6 diferenciadores actuales
   - CTA para volver a la landing principal
6. Usuario puede navegar back para explorar otros módulos

**Estados de Hover:**
- Escala sutil (scale-105) en la tarjeta completa
- Indicador visual de "clickable" (cursor pointer)
- Overlay de brillo o gradiente sutil
- Opcional: icono de "flecha" o "explorar" que aparece

---

## Contexto

### Referencias
- `src/features/landing-page/components/BentoEcosystem.tsx` - Componente actual de módulos (líneas 64-120)
- `src/components/ui/bento-grid.tsx` - Componente de grid reutilizable
- `src/app/page.tsx` - Landing page actual
- `src/app/layout.tsx` - Layout raíz
- PRP-002: Diferenciadores Vendedor IA - Contiene los datos de diferenciadores actuales

### Arquitectura Propuesta (Feature-First)

```
src/
├── app/
│   ├── (main)/
│   │   └── modulos/
│   │       └── [slug]/
│   │           └── page.tsx          # Página dinámica de módulo
│   ├── page.tsx                      # Landing (existente)
│   └── layout.tsx                    # Root layout (existente)
│
├── features/
│   ├── landing-page/
│   │   └── components/
│   │       └── BentoEcosystem.tsx      # Modificar para clickable + hover
│   │
│   └── modulo-page/                   # Nueva feature
│       ├── components/
│       │   ├── ModuloHeader.tsx      # Header específico de módulo
│       │   ├── ModuloHero.tsx        # Hero con info del módulo
│       │   └── ModuloDifferentiators.tsx # BentoGrid de diferenciadores
│       ├── hooks/
│       │   └── useModuloData.ts      # Hook para obtener datos por slug
│       └── types/
│           └── modulo.types.ts       # Tipos de módulo
│
└── shared/
    └── lib/
        └── modulos-data.ts           # Datos centralizados de módulos
```

### Modelo de Datos (Centralizado)

```typescript
// src/shared/lib/modulos-data.ts

export interface Modulo {
  id: string;
  slug: string;
  moduleNumber: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  tags: string[];
  differentiators: Differentiator[];
}

export interface Differentiator {
  title: string;
  description: string;
  icon: string;
  tags: string[];
  status: string;
}

export const modulos: Modulo[] = [
  {
    id: "vendedor-ia",
    slug: "vendedor-ia",
    moduleNumber: "01",
    title: "Vendedor IA 24/7",
    shortDescription: "Chatbot entrenado que califica prospectos y agenda citas mientras duermes.",
    fullDescription: "Un asistente virtual inteligente que nunca duerme...",
    differentiators: [
      // Los 6 diferenciadores actuales
    ]
  },
  // Módulos 02, 03, 04...
];
```

### Estructura de Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing principal con módulos clickeables |
| `/modulos/vendedor-ia` | Subpágina del Módulo 01 |
| `/modulos/landing` | Subpágina del Módulo 02 (placeholder) |
| `/modulos/dashboard` | Subpágina del Módulo 03 (placeholder) |
| `/modulos/conectividad` | Subpágina del Módulo 04 (placeholder) |

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Refactor de BentoEcosystem - Tarjetas Clickeables
**Objetivo**: Transformar los módulos existentes en tarjetas interactivas con efectos hover y navegación
**Validación**:
- Los 4 módulos muestran efecto hover al pasar cursor
- Cada módulo tiene cursor pointer y feedback visual de clickeable
- Click en Módulo 01 navega a `/modulos/vendedor-ia`

### Fase 2: Setup de Ruta Dinámica y Estructura
**Objetivo**: Crear la estructura de carpetas para la feature de subpáginas de módulos
**Validación**:
- Ruta `/modulos/vendedor-ia` responde sin errores
- Layout base renderiza con Header consistente
- Estructura de carpetas sigue Feature-First

### Fase 3: Datos Centralizados y Hook
**Objetivo**: Extraer datos de módulos a archivo compartido y crear hook para consumo
**Validación**:
- Datos de módulos centralizados en `shared/lib/modulos-data.ts`
- Hook `useModuloData` retorna datos correctos por slug
- TypeScript types definidos y exportados

### Fase 4: Componentes de Subpágina
**Objetivo**: Crear componentes específicos para la subpágina de módulo (Hero, Diferenciadores)
**Validación**:
- `ModuloHero` muestra título, número y descripción del módulo
- `ModuloDifferentiators` renderiza BentoGrid con los 6 items
- Estilos consistentes con la landing (glass, gradientes, tipografía)

### Fase 5: Integración y Navegación Back
**Objetivo**: Integrar todo en la página dinámica y agregar navegación de retorno
**Validación**:
- Página `/modulos/vendedor-ia` carga y muestra contenido completo
- Botón "Volver" funciona correctamente
- Animaciones de transición suaves

### Fase 6: Responsive y Polishing
**Objetivo**: Asegurar que todo funcione en todos los tamaños de pantalla y aplicar detalles visuales
**Validación**:
- Mobile: tarjetas se apilan correctamente
- Tablet: grid de 2 columnas
- Desktop: layout de 12 columnas como en landing

### Fase N: Validación Final
**Objetivo**: Sistema funcionando end-to-end
**Validación**:
- [x] `npm run typecheck` pasa (via `npm run build`)
- [x] `npm run build` exitoso
- [x] Playwright screenshot confirma UI en `/modulos/vendedor-ia`
- [x] Navegación clic → subpágina → back funciona
- [x] Criterios de éxito cumplidos

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-03-20]: Server/Client Component Icon Serialization
- **Error**: Al pasar datos de Server Component a Client Component, los iconos (funciones/componentes) causaron error de hidratación: "Functions cannot be passed directly to Client Components"
- **Fix**: Usar strings para los nombres de iconos en los datos (`icon: "CheckCircle2"`), luego mapear a componentes reales en el Client Component usando un `iconMap: Record<IconName, LucideIcon>`
- **Aplicar en**: Cualquier feature que pase datos de server a client con iconos dinámicos

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### [YYYY-MM-DD]: [Título del aprendizaje]
- **Error**: [Qué falló]
- **Fix**: [Cómo se arregló]
- **Aplicar en**: [Dónde más aplica este conocimiento]

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] **Next.js App Router**: Usar parámetros dinámicos `[slug]` correctamente con generateStaticParams para SEO
- [ ] **Hydration**: Asegurar que los efectos hover no causen hydration mismatch (usar "use client" donde aplique)
- [ ] **Tailwind glass**: Mantener consistencia con clase `glass` existente en la landing
- [ ] **Tipografía**: Usar `font-display` para títulos y `font-sans` para cuerpo (consistente con landing)
- [ ] **Iconos**: Los diferenciadores usan Lucide React, mantener mismo patrón
- [ ] **Z-index**: Verificar que overlays hover no se superpongan incorrectamente

## Anti-Patrones

- NO hardcodear datos de módulos en componentes - usar archivo centralizado
- NO crear un layout separado si el existente funciona - reusar `(main)/layout.tsx`
- NO ignorar validación de TypeScript en generateStaticParams
- NO usar `<a>` para navegación interna - usar `next/link`
- NO duplicar estilos de glass/gradiente - crear utilidades compartidas si es necesario

---

*PRP pendiente aprobación. No se ha modificado código.*
