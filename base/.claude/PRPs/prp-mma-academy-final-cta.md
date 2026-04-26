# PRP-004: MMA Academy Final CTA & Footer V2

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-19
> **Proyecto**: KIA Intelligence

---

## Objetivo

Extraer e implementar el diseño "NEXUS.AI Final CTA & Footer V2" del proyecto de Stitch (`projects/17882721490400620635` / screen `1258198497995849614`), integrándolo como el cierre persuasivo para la ruta `/casostudy/mma-academy` y adaptándolo rigurosamente al branding oficial oscuro y premium del proyecto.

## Por Qué

| Problema | Solución |
|----------|----------|
| La parte final del caso de estudio actual (el cierre/venta) usa un CTA genérico y el footer estándar que rompen la "Inmersión Cinemática" lograda por el rediseño anterior. | Implementar un "Super Footer / Final CTA" importado de Stitch que unifique estética premium, el botón maestro de conversión (`EnrollmentModal`) y asimetría visual. |

**Valor de negocio**: Evitar fugas de leads en la parte más crítica del embudo (el final de la lectura del caso) con un cierre de alta autoridad que mantenga la percepción de valor ininterrumpida.

## Qué

### Criterios de Éxito
- [ ] Recuperación exitosa del código HTML de la screen `1258198497995849614` vía Stitch MCP.
- [ ] Refactorización del código a un componente React colocalizado en `src/features/portfolio/components/StitchMmaFinalCta.tsx` (o similar).
- [ ] Mapeo de estilos riguroso que elimine grumosidades de herramientas de IA: usando variables del ecosistema KIA (`primary_fixed`, glows via `cyan` y `emerald`).
- [ ] Integración del botón principal con el hook del sistema para abrir `EnrollmentModal`.
- [ ] Reemplazo del actual `StitchMmaResultsCta` y `<Footer />` en `page.tsx`.

### Comportamiento Esperado
El usuario termina de scrollear el "Process Timeline", la UI transiciona mediante light leaks o fondos glassmórficos a un bloque final contundente. El CTA tiene interacciones de hover activas y dispara el modal global de conversión. El layout debe sostener el tema "Glassmorphism & Darkness".

---

## Contexto

### Referencias
- `src/app/(main)/casostudy/mma-academy/page.tsx` - Archivo donde inyectar el código.
- `src/features/landing-page/components/Footer.tsx` y `src/features/portfolio/components/StitchMmaResultsCta.tsx` - Lo que vamos a reemplazar.
- `.claude/skills/react-components/SKILL.md` - Procedimiento para extracción y limpieza de HTML a React.

### Arquitectura Propuesta (Feature-First)
```
src/features/portfolio/
├── components/
│   ├── StitchMmaFinalCta.tsx      # El nuevo componente super-footer
│   └── (otros componentes de la feature)
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Extracción del Diseño Stitch
**Objetivo**: Obtener el código estático y el blueprint del diseño.
**Validación**: Archivo HTML recuperado y analizado, revisando el Tailwind config embebido y extrayendo sus peculiaridades para el posterior refactor.

### Fase 2: Componentización e Inyección de Branding
**Objetivo**: Traducir el HTML extraído a JSX modular y limpio.
**Validación**: Componente React funcional. Classes de Tailwind mapeadas a los colores globales (p.ej eliminando hexágonos hardcodeados a favor de clases utility).

### Fase 3: Integración Operativa
**Objetivo**: Ensamblar el nuevo bloque de CTA y Footer en Next.js.
**Validación**: La ruta `/casostudy/mma-academy` compila exitosamente, ya no muestra el footer viejo sino el nuevo diseño y el botón activa eficientemente el Modal de Agendamiento.

### Fase 4: Validación Visual y Responsive
**Objetivo**: Asegurar consistencia cross-device (Bucle Agéntico Chrome).
**Validación**: 
- [ ] Revisar anchos y paddings en Mobile (390px).
- [ ] Revisión asimetría y jerarquía en Desktop (1280px+).

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.
> El conocimiento persiste para futuros PRPs. El mismo error NUNCA ocurre dos veces.

### [YYYY-MM-DD]: [Título Libre]
- **Error**: [Pendiente]
- **Fix**: [Pendiente]
- **Aplicar en**: [Pendiente]

---

## Gotchas

- [ ] Asegurar aislar los estilos de Stitch para que no colisionen o sobrescriban clases base `globals.css` en Next.js. Si aplican variables `--md-sys-color-primary`, mapearlas con las nuestras si es necesario.
- [ ] No usar "border 1px solid" como estipula el North Star de "Cinematic Precision". Traducirlo a Surface changes o "Ghost borders" de muy baja opacidad.

## Anti-Patrones

- NO añadir código espagueti de animaciones complejas en la primera pasada; focus sobre layout e inputs clave.
- NO obviar que la página de MMA está montada encima de un *GlassRefractionBackground*, por lo que los elementos del background de este nuevo footer deben reaccionar correctamente a transparencias y blurs subyacentes.

---

*PRP pendiente aprobación. No se ha modificado código.*
