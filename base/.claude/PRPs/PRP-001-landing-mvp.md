# PRP-001: Landing Page B2B IA (MVP)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-19
> **Proyecto**: SaaS Factory V3 - Landing LinkedIn

---

## Objetivo

Construir e implementar el MVP de la Landing Page para la "Infraestructura de Ventas con IA", utilizando la UI generada por Stitch MCP y asegurando una arquitectura Feature-First.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las agencias B2B y negocios locales pierden leads por procesos manuales lentos. | Un ecosistema automatizado (Landing + Chatbot + CRM) creado en 15 días. |

**Valor de negocio**: Capturar prospectos calificados automáticamente, reduciendo fricción y demostrando alta autoridad tecnológica mediante un diseño "Premium" oscuro.

## Qué

### Criterios de Éxito
- [ ] La Landing Page refleja de manera fiel (pixel-perfect) el diseño "Bento Box" / Dark Theme generado por Stitch.
- [ ] Componentización modular en `src/features/landing-page/components/`.
- [ ] Responsiveness asegurada en Desktop y Mobile.
- [ ] Testing visual sin errores y 0 warnings en `npm run lint` / `typecheck`.

### Comportamiento Esperado
Usuario entra a la landing -> Navega fluido por las secciones (Hero, Problema, Ecosistema Bento, Historia, Beneficios, FAQ, Garantía) -> Hace click en CTA -> Es dirigido a un placeholder de espera (lista de espera).

---

## Contexto

### Referencias
- `stitch_ui_prompt_plan.md` - Lógica de diseño base.
- Proyecto Stitch: `NEXUS.AI Landing Page - AI Sales Infrastructure`.

### Arquitectura Propuesta (Feature-First)
```
src/features/landing-page/
├── components/
│   ├── HeroSection.tsx
│   ├── PasSection.tsx
│   ├── BentoEcosystem.tsx
│   ├── AuthorityGuide.tsx
│   ├── BenefitsList.tsx
│   ├── FaqAccordion.tsx
│   └── GuaranteeCta.tsx
├── data/
│   └── landingData.ts
└── types/
    └── landing.ts
```

---

## Blueprint (Assembly Line - Bucle Agéntico)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar).

### Fase 1: Extracción y Preparación de Assets (Stitch)
**Objetivo**: Descargar el HTML/CSS y Assets generados por Stitch usando la skill `react-components` (`fetch-stitch.sh`). Mapear los tokens de diseño.
**Validación**: Archivos `.stitch/designs/landing.html` y `.png` existen localmente.

### Fase 2: Configuración del Design System Base
**Objetivo**: Integrar los tokens de diseño (Dark theme, colores cyan/neón, Space Grotesk/Inter) en `tailwind.config.ts` y fuentes globales.
**Validación**: Clases utilitarias de Tailwind reflejan el diseño de Stitch correctamente.

### Fase 3: Componentización (Feature-First)
**Objetivo**: Traducir el HTML de Stitch a componentes React modulares en `src/features/landing-page/components/`. Separar la data estática a `data/landingData.ts`.
**Validación**: Todos los componentes renderizan sin errores de TypeScript y la data está correctamente tipada.

### Fase 4: Ensamblaje y Pulido (MVP)
**Objetivo**: Unir los componentes en la página principal (`app/page.tsx` o similar). Ajustar animaciones (glassmorphism/hover states) y verificar responsiveness.
**Validación**: `npm run dev` carga la página completa de forma idéntica al diseño aprobado.

### Fase 5: Validación Final
**Objetivo**: Sistema funcionando end-to-end bajo los estándares de la fábrica.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Criterios de éxito cumplidos

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.
> El conocimiento persiste para futuros PRPs. El mismo error NUNCA ocurre dos veces.

### [2026-03-19]: Error de entorno con Next.js 16
- **Error**: `npm install` y `npm run build` fallan en WSL por "Unsupported engine" debido a que Node es `v18.20.8` y Next.js 16 exige `>=20.9.0`.
- **Fix**: Se detuvo el build y se documentó para el usuario. Es mandatorio actualizar la versión de Node en el entorno WSL con nvm.
- **Aplicar en**: Futuros comandos de build para Next.js 16.

---

## Gotchas

- [ ] Asegurar que el HTML exportado de Stitch no traiga clases CSS conflictivas o harcodeadas en estilos en línea que rompan Tailwind.
- [ ] Extraer iconos y SVG a archivos o componentes separados para mantener limpios los componentes principales de UI.

## Anti-Patrones

- NO crear un solo archivo "monstruo" con toda la landing.
- NO ignorar errores de TypeScript generados en la traducción de HTML a TSX.
- NO hardcodear el texto dentro de los componentes (usar `landingData.ts`).

---

*PRP pendiente aprobación del Operador Humano.*
