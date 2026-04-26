# PRP-047: Componente Sign Up Animado

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-05
> **Proyecto**: KIA Intelligence

---

## Objetivo

Integrar un nuevo componente de Sign Up avanzado y animado (`AuthComponent`) dentro de la arquitectura de la aplicación, utilizando la estructura de shadcn/ui, Tailwind CSS y TypeScript.

## Por Qué

| Problema | Solución |
|----------|----------|
| El onboarding no destaca visualmente y la retención inicial puede decaer. | Un formulario interactivo, con feedback visual de progreso, animaciones (framer-motion) y glassmorphism. |

**Valor de negocio**: Aumentar la conversión de visitantes a usuarios registrados al proveer una "Experiencia Mágica" y altamente estética (premium) desde el momento de registro, en completa alineación con la directiva "The Invisible Stack".

## Qué

### Criterios de Éxito
- [ ] Validar y documentar la correcta estructura del proyecto (ya cuenta con shadcn, TS y Tailwind).
- [ ] Instalar e integrar dependencias faltantes: `canvas-confetti`, `@types/canvas-confetti`, `class-variance-authority`.
- [ ] Crear el archivo `src/components/ui/sign-up.tsx` e inyectar el código especificado.
- [ ] Crear una página de despliegue para la demo (`src/app/(auth)/sign-up/page.tsx` por defecto, o integrarlo donde corresponda).
- [ ] Ajustar imágenes / logos genéricos (Unsplash para assets si es necesario, o lucide-react icons).

### Comportamiento Esperado
El usuario navegará a la página de registro. Verá un fondo animado ("GradientBackground") y un workflow en pasos (Email -> Password -> Confirm Password). Cada paso tendrá validación local. Al completar, el modal mostrará un progreso simulado terminando con el lanzamiento de Confetti.

---

## Contexto

### Referencias
- El proyecto ya utiliza `src/components/ui` por los alias de shadcn (`components.json` validado).
- Stack y librerías actuales: `framer-motion` y `lucide-react` ya instalados; `clsx` y `tailwind-merge` presentes en `src/lib/utils.ts`.

### Arquitectura Propuesta (Feature-First / UI)
```
src/
├── components/
│   └── ui/
│       └── sign-up.tsx        # Componente que encapsula todo (AuthComponent)
├── app/
│   └── (auth)/
│       └── sign-up/
│           └── page.tsx       # Interfaz que renderiza CustomAuthDemo
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Entorno y Dependencias
**Objetivo**: Asegurar el entorno con dependencias externas requeridas para el componente.
**Validación**: Las librerías `canvas-confetti` y `class-variance-authority` existen en el `package.json` y se resuelven en TS.

### Fase 2: Inserción y Refactor del Componente
**Objetivo**: Ubicar el componente base provisto dentro de la estructura general (`src/components/ui/sign-up.tsx`) y validar compilación básica.
**Validación**: Archivo TSX renderiza sin errores de lint ni dependencias caídas, y hace uso interno de `cn()` e íconos.

### Fase 3: Integración a Página (Demo/Ruta)
**Objetivo**: Exponer el flujo de signUp en la ruta correspondiente (ej. `/sign-up`), sirviendo el `AuthComponent` con un Logo acorde (KIA de ser pertinente) e integrado a la estética dark.
**Validación**: La ruta `/sign-up` carga y permite iterar el happy-path del registro con confetti final.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso sin alertas de componentes perdidos.
- [ ] Flow de pasos animado transiciona en navegador correctamente.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [YYYY-MM-DD]: [Título del aprendizaje]
- **Error**: 
- **Fix**: 
- **Aplicar en**: 

---

## Gotchas

- [ ] `canvas-confetti` a veces necesita validación y lazy load si hay problemas de rehidratación en SSR (Next.js).
- [ ] CSS Inline injection dentro del componente (`<style>`) debe comportarse bien usando Next.js.
- [ ] `lucide-react` íconos provistos en el raw pueden requerir ajustes de tamaño basados en los global configs.

## Anti-Patrones

- NO crear dependencias circulares.
- NO omitir el uso de `cn` para mesclar clases personalizadas de Tailwind que puedan colisionar con default shadcn/ui.
- NO obviar los types en funciones internas del payload provisto.

---

*PRP pendiente aprobación. No se ha modificado código.*
