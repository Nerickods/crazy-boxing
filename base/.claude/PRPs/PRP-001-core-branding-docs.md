# PRP-001: Core Branding & Identity Docs

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-21
> **Proyecto**: landing-linkedin

---

## Objetivo

Crear un directorio `.docs` centralizado que actúe como la "fuente de la verdad" inmutable para la idea principal del negocio, la propuesta de valor y las guías de marca (branding, tonos, colores, tipografía). Esto asegurará que tanto los desarrolladores como la IA mantengan la consistencia visual y conceptual en todas las iteraciones del proyecto.

## Por Qué

| Problema | Solución |
|----------|----------|
| Pérdida de contexto o desviación de la idea original en sesiones largas con IA. | Un documento estático y referenciable que ancle la idea del negocio. |
| Inconsistencias visuales (colores, espaciados, tipografías) al generar nuevos componentes. | Brand Guidelines estrictas que definan el "Apple-style" o "Premium feel" esperado. |
| Onboarding lento para nuevos agentes/desarrolladores. | Un `BUSINESS_LOGIC.md` claro que explique de qué va el SaaS y su modelo. |

**Valor de negocio**: Reduce el tiempo de corrección por "alucinaciones de diseño" o desviaciones del producto. Asegura que la landing page y la app mantengan una estética de alta conversión (Premium/Apple-style).

## Qué

### Criterios de Éxito
- [ ] Existe un directorio `.docs/` en la raíz del proyecto.
- [ ] Se incluye `.docs/BUSINESS_LOGIC.md` con el pitch del producto, ICP (Ideal Customer Profile) y features core.
- [ ] Se incluye `.docs/BRANDING.md` con paleta de colores (Tailwind), tipografías, tono de voz (copywriting) y assets visuales.
- [ ] Se referencia este directorio dentro de `CLAUDE.md` o el base prompt para que la IA lo lea proactivamente.

### Comportamiento Esperado
Cualquier prompt futuro a la IA que implique cambios de diseño o redacción de copys referenciará automáticamente (o se le pedirá que referencie) los archivos en `.docs/` para no romper la estética ni el mensaje de la marca.

---

## Contexto

### Referencias
- `README.md` actual (Next.js 16 + Supabase).
- Skill `website-3d` (Apunta a animaciones "Apple-style", copy persuasivo).
- Archivos `.md` de contexto base de SaaS Factory.

### Arquitectura Propuesta (Documentación)
```
[root]/
├── .docs/
│   ├── BUSINESS_LOGIC.md    # Idea central, modelo de negocio, features.
│   ├── BRANDING.md          # Colores, tipografías, componentes UI root, tono de voz.
│   └── COPYWRITING.md       # (Opcional) Frameworks de ventas (PAS/AIDA), slogans.
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES.

### Fase 1: Creación de Estructura y Business Logic
**Objetivo**: Inferir y redactar el `BUSINESS_LOGIC.md` basado en el contexto actual de `landing-linkedin` (Landing de alta conversión para coaches/agencias vía LinkedIn + Lead Management con IA).
**Validación**: El archivo existe y describe con precisión el SaaS.

### Fase 2: Definición de Brand Guidelines
**Objetivo**: Sintetizar el enfoque visual (Glassmorphism, Dark Mode, Inter/Outfit fonts) en un `BRANDING.md` concreto y aplicable.
**Validación**: Contiene paleta de colores Tailwind (HEX/HSL), reglas de espaciado y directrices UI.

### Fase 3: Integración con el Sistema
**Objetivo**: Asegurar que esta documentación sea descubrible por SaaS Factory.
**Validación**: Actualizar los system prompts relevantes (ej. `CLAUDE.md`, si es prudente) o dejar registro en la memoria del proyecto para que la IA lea `.docs/` al iniciar.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### [2026-03-21]: Preservación de Contexto Base
- **Error**: Asumir el diseño web globalmente sin guías previas lleva a UIs genéricas.
- **Fix**: Centralizar el branding ANTES de escalar componetización (Feature-First).
- **Aplicar en**: Setup inicial de todos los futuros SaaS.

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] Las instrucciones en `.docs` deben ser directivas para la IA (ej. "Usa bg-slate-900", no "El fondo es oscuro"), actuando como rulesets.
- [ ] No duplicar información técnica que ya existe en `CLAUDE.md`, aquí **solo va negocio y marca**.

## Anti-Patrones

- NO llenar los docs de descripciones vagas sin ejemplos concretos de código (ej. variables CSS a usar).
- NO usar múltiples fuentes de la verdad para el diseño (ej. tener `DESIGN.md` en otra capeta).

---

*PRP pendiente aprobación. No se ha modificado código.*
