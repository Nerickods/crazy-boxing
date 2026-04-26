# PRP-006: Reestructuración de Copy en ProcessSection

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-14
> **Proyecto**: KIA Intelligence

---

## Objetivo

Actualizar el copy de la sección de Proceso (`ProcessSection.tsx`) para alinear su tono con la narrativa de "Arquitectura de Autor" establecida en la sección anterior (PAS) y el modal de inscripción. El objetivo es mantener una voz autoritaria, madura, agresiva y elegante, enfocándonos en el "Beneficio del Beneficio".

## Por Qué

| Problema | Solución |
|----------|----------|
| El copy actual de las 3 fases informa pero no persuade al nivel de un servicio High-Ticket. El tono se siente ligeramente corporativo ("Dejamos de suponer y empezamos a medir"). | Inyectar un copy clínico, autoritario y exclusivo validado por nuestro cuaderno de NotebookLM para elevar el valor percibido del servicio. |

**Valor de negocio**: Continuidad narrativa perfecta. El usuario entra con dolor desde el PAS y encuentra una solución explicada por un "cirujano de negocios" en el Proceso, lo que aumenta la intención de compra y cualifica mejor al visitante (aleja a los que buscan "soluciones baratas y rápidas").

## Qué

### Criterios de Éxito
- [x] Fase 01 actualizada: Título y Párrafo principal.
- [ ] Fase 01: Actualizar entregables a "Sincronía Arquitectónica Definitiva" (Sesión 1:1).
- [x] Fase 02 actualizada: Título, Párrafo principal, Beneficio y Entregables alineados con el "Stack Invisible" y aniquilación de dependencias.
- [x] Fase 03 actualizada: Título, Párrafo principal, Beneficio y Entregables alineados con el "Traspaso de Poder" y el síndrome del rehén.
- [ ] Mantener la estructura y formato visual del componente Timeline intactos, modificando únicamente el contenido textual JSX.

### Comportamiento Esperado
El usuario hace scroll y lee un enfoque quirúrgico y exclusivo sobre cómo se transforma su empresa. Se exponen verbos fuertes ("Aniquilamos", "Disecciono") que proyectan la autoridad del arquitecto.

---

## Contexto

### Referencias
- `src/features/landing-page/components/ProcessSection.tsx` - Archivo destino.
- Copy validado por `NotebookLM` apoyado en los fundamentos de Copywriting (Ana Raventós).

### Arquitectura Propuesta (Feature-First)
Modificación in situ del array `data` (componente visual iterativo) de TypeScript en `ProcessSection.tsx`.

---

## Blueprint (Assembly Line)

### Fase 1: Inyección de Copy
**Objetivo**: Reemplazar los textos hardcodeados de las fases 1, 2 y 3.
**Validación**: Revisar estáticamente el componente JSX y comprobar coherencia tag/class.

### Fase 2: Ajuste de UI (si fuera necesario)
**Objetivo**: Garantizar que los nuevos textos encajan perfectamente sin romper el contenedor de Timeline, ajustando interlineados o tamaños si el exceso de texto causa bordes desalineados.
**Validación**: Todo sigue luciendo balanceado y sin overflows visuales.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando end-to-end con nuevo copy
**Validación**:
- [ ] `npm run typecheck` pasa sin warning.
- [ ] Construcción sin errores.
- [ ] El copy refleja fielmente el estilo de "Arquitectura de Autor".

---

*PRP pendiente aprobación.*
