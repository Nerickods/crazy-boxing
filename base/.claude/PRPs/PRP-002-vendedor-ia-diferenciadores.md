# PRP-002: Diferenciadores Vendedor IA (BentoGrid)

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-19
> **Proyecto**: Landing LinkedIn

---

## Objetivo

Integrar un componente visual de alta conversión (`BentoGrid`) directamente debajo de la sección "Módulo 1: Vendedor IA 24/7" para destacar visualmente los diferenciadores clave de nuestros chatbots vs la competencia.

## Por Qué

| Problema | Solución |
|----------|----------|
| Los usuarios pueden no entender visualmente la diferencia entre un chatbot tradicional y nuestro sistema de IA. | Un BentoGrid interactivo que ilustra características técnicas como Analytics, Task Manager y Global Network. |

**Valor de negocio**: Aumentar el tiempo en página y la percepción de valor tecnológico a través de micro-interacciones premium, incrementando la probabilidad de conversión de visitantes a leads.

## Qué

### Criterios de Éxito
- [x] El componente `BentoGrid` es responsivo y se ve perfecto en mobile, tablet y desktop.
- [x] Los estilos de Tailwind y la utilidad `cn` (shadcn) están correctamente configurados.
- [x] Se instalan correctamente dependencias necesarias (`lucide-react`, `clsx`, `tailwind-merge`).
- [x] Las imágenes o iconos se renderizan correctamente.
- [x] El componente se inserta fluidamente debajo de la sección de Vendedor IA en `BentoEcosystem.tsx`.

### Comportamiento Esperado
Los usuarios harán scroll hasta el "Módulo 1: Vendedor IA 24/7" y justo debajo verán una cuadrícula interactiva. Al pasar el cursor, las tarjetas tendrán efectos sutiles de gradiente, sombras e iconos para demostrar las capacidades del Módulo 1.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BentoEcosystem.tsx` - Archivo actual donde reside el Módulo 1.
- `bento-grid.tsx` provisto por el usuario.

### Arquitectura Propuesta (Feature-First)
El componente base de UI se alojará en la carpeta compartida de UI (estándar de shadcn).
```
src/
├── components/
│   └── ui/
│       └── bento-grid.tsx       # Componente genérico aislado
└── features/
    └── landing-page/
        └── components/
            └── BentoEcosystem.tsx # Consumidor de bento-grid.tsx
```

---

## Blueprint (Assembly Line)

### Fase 1: Setup e Instalación
**Objetivo**: Instalar dependencias requeridas (`lucide-react`, `clsx`, `tailwind-merge`) y crear el helper `utils.ts` si no existe.
**Validación**: `npm list lucide-react` confirma la instalación, no hay errores TS en el entorno.

### Fase 2: Integración de Componente Base
**Objetivo**: Crear `src/components/ui/bento-grid.tsx` y adaptarlo al stack del proyecto.
**Validación**: El componente compila correctamente sin errores de linting.

### Fase 3: Integración en Pantalla
**Objetivo**: Modificar `src/features/landing-page/components/BentoEcosystem.tsx` para importar y colocar el `BentoGrid` con datos de muestra debajo del contenido de Vendedor IA.
**Validación**: `npm run typecheck` y renderizado correcto en Next.js.

### Fase N: Validación Final
**Objetivo**: Sistema funcionando end-to-end
**Validación**:
- [x] `npm run typecheck` pasa (via `npm run build`)
- [x] `npm run build` exitoso
- [x] Criterios de éxito cumplidos

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] Verificar la existencia de `src/lib/utils.ts` provista usualmente por shadcn. Si no existe, crearla para que funcione la función genérica `cn()`.
- [ ] El grid debe coexistir dentro del contenedor existente de `BentoEcosystem.tsx`, cuidando el `z-index` y bordes.

## Anti-Patrones

- NO crear el componente `bento-grid.tsx` dentro de `features/landing-page/components` sino en `components/ui/` por ser un patrón reutilizable.
- NO omitir las configuraciones oscuras/claras del componente original si afectan el fondo oscuro (`bg-[#0a0a0c]`) de nuestra landing.

---

*PRP pendiente aprobación. No se ha modificado código.*
