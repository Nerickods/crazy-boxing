# PRP-004: Transparency Conversion Engine

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-23
> **Proyecto**: KIA Intelligence — Landing LinkedIn

---

## Objetivo

Reemplazar el componente genérico `TransparencyConsolidation.tsx` por una sección de conversión de alta fidelidad que use los 5 argumentos de cierre del `GRAN-SLAM-OFFER.md` (objeciones, garantía, urgencia, proceso, comparativa de valor) organizados en un flujo narrativo capaz de llevar al visitante desde la duda hasta la decisión de agendar una llamada de auditoría.

---

## Por Qué

| Problema actual | Solución propuesta |
|-----------------|-------------------|
| La sección actual es un "roadmap de precios" pasivo — informa pero no persuade | Convertirla en un **motor de cierre** con narrativa progresiva: objeción → respuesta → prueba → CTA |
| El visitante llega con 5 objeciones reales y la sección actual no aborda ninguna | Cada módulo derriba una objeción con el lenguaje exacto del GRAN-SLAM-OFFER |
| El CTA final ("La Garantía de Bloqueo") es débil — sin urgencia visual ni acción clara | CTA final de alta tensión: escasez (2 cupos/mes) + urgencia precio (1 Mayo 2026) + botón primario luminoso |
| La arquitectura visual no sigue el estándar glassmorphism premium de la landing | Diseño dark glassmorphism con tokens: `accent-cyan`, `backdrop-blur`, `border-white/10`, `font-display` |

**Valor de negocio**: Esta sección es el último touchpoint antes del CTA final. Una sección de cierre bien ejecutada puede doblar la tasa de conversión de `/precios` a llamadas de auditoría agendadas.

---

## Qué

### Criterios de Éxito

- [ ] Las 5 objeciones del GRAN-SLAM-OFFER están respondidas visualmente en la sección
- [ ] El proceso de 3 fases (Auditoría → Construcción → Traspaso) está comunicado con claridad
- [ ] La comparativa de valor ($1,900 vs $1,500-3,000/mes de vendedor humano) es visible y comprendida
- [ ] La urgencia (2 cupos/mes + subida 30% el 1 mayo 2026) está comunicada con peso visual
- [ ] La Garantía de Funcionamiento tiene su propio módulo destacado
- [ ] El CTA final "Agendar Auditoría" está presente, visible, usa el `RippleButton` primario existente
- [ ] `npm run typecheck` pasa limpio
- [ ] `npm run build` pasa limpio
- [ ] La sección es totalmente responsiva (mobile-first)

### Comportamiento Esperado (Happy Path)

El visitante baja por `/precios` después de ver las 3 cards de precios y entra en esta sección. La narrativa lo guía en este orden:

1. **Hook de apertura** — frase de autoridad: *"No estamos vendiendo software. Estamos entregando el sistema que trabaja en tu lugar."*
2. **Módulo de Proceso** — Las 3 fases (Día 1 Auditoría → Días 2-14 Construcción → Día 15 Traspaso) como timeline glassmorphism. Comunica cuánto tiempo real se le pide al cliente: solo 3 sesiones.
3. **Módulo de Comparativa de Valor** — Card comparativa: $1,900 único vs $1,500-3,000/mes de vendedor humano ($18k-36k/año). Impacto matemático directo.
4. **Módulo de Objeciones** — Acordeón o grid de 5 bloques. Objeción en voz del cliente + respuesta directa de Nerick (copy verbatim del GRAN-SLAM-OFFER).
5. **Módulo de Garantía** — Card prominente: Garantía de Funcionamiento 30 días con soporte directo. Comunica que no es código entregado y olvidado.
6. **Módulo de Urgencia + Escasez** — Cierre definitivo: 2 cupos/mes (límite real) + incremento 30% confirmado el 1 de Mayo de 2026. Visual de alta tensión.
7. **CTA Final** — Botón primario full-width con glow: *"Agendar mi Auditoría Gratuita"* + nota de pie: *"Sin compromiso. La Auditoría es gratuita y sin presión."*

---

## Contexto

### Referencias de código existente

- `src/features/pricing/components/TransparencyConsolidation.tsx` — Componente a **reemplazar** completamente
- `src/features/pricing/components/PricingSection.tsx` — Patrón con `motion` + badge + glassmorphism → replicar estilo
- `src/components/ui/animated-glassy-pricing.tsx` — Tokens visuales y patrones de card glass a reutilizar
- `src/features/landing-page/components/ProcessSection.tsx` — Patrón de timeline de fases (Fase 01, 02, 03)
- `src/features/services/components/ServicesCta.tsx` — Patrón de CTA con botón primario
- `src/app/(main)/precios/page.tsx` — El import permanece igual → NO requiere cambio en page.tsx

### Arquitectura de la Feature (sin cambios de ruta)

```
src/features/pricing/components/
├── PricingSection.tsx             ✅ completado en PRP-003
└── TransparencyConsolidation.tsx  ⬅️ REESCRITURA COMPLETA in-place
```

El export nombrado `TransparencyConsolidation` se mantiene. No se crean rutas ni features nuevas.

### Datos del GRAN-SLAM-OFFER a usar (fuente de verdad)

**5 Objeciones + Respuestas:**

```
1. "Es muy caro / no tengo presupuesto"
   → "Un vendedor humano cuesta $1,500–$3,000/mes. La pregunta no es si puedes pagarlo;
      es cuántos leads estás perdiendo cada semana."

2. "No tengo tiempo ahora"
   → "Solo necesitas 3 sesiones en 15 días: Día 1, Día 2 y Día 15.
      El resto lo construyo yo."

3. "Lo pienso y te digo"
   → "El precio sube un 30% el 1 de Mayo de 2026.
      Al registrarte ahora, congelas la tarifa actual."

4. "Ya lo intenté antes y no funcionó"
   → "Los chatbots genéricos fallan porque no están entrenados con la lógica de tu negocio.
      Aquí construimos desde tu proceso real."

5. "No sé si esto sirve para mi caso"
   → "Por eso existe la Auditoría. En los primeros 3 días diagnosticamos si tu negocio puede
      escalar con este sistema. Si no, te lo decimos antes de que inviertas un peso."
```

**Proceso de 3 fases:**

```
Fase 1 — Auditoría (Día 1): Diagnóstico profundo, mapa de fugas, plan de implementación.
Fase 2 — Construcción (Días 2–14): Sprint completo. Solo el desarrollador trabaja.
Fase 3 — Traspaso (Día 15): Entrega del ecosistema + inicio Garantía de Funcionamiento 30 días.
```

**Comparativa de valor:**

```
Sistema KIA Premium: $1,900 USD único
Vendedor humano: $1,500–$3,000/mes → $18,000–$36,000/año
Mantenimiento infraestructura KIA: <$1 USD/mes
```

**Garantía:**

```
30 días de soporte técnico directo con Nerick Segoviano.
Si algo no funciona como acordamos, se corrige.
El cliente no queda solo con un sistema que no entiende.
```

**Urgencia/escasez:**

```
- 2 proyectos por mes (límite real operativo, no artificial)
- Incremento del 30% confirmado: 1 de Mayo de 2026
- Al registrarse ahora, el precio queda congelado de por vida para ese proyecto
```

### Tokens de diseño a respetar (BRANDING.md)

```
Fondo: dark mode absoluto (slate-900 a black)
Texto principal: text-slate-100
Acento: text-accent-cyan / border-accent-cyan / shadow-accent-cyan
Glass cards: bg-white/[0.05-0.08] + backdrop-blur-[14-18px] + border-white/[0.10-0.12]
Tipografía títulos: font-display font-light tracking-tight
Tipografía cuerpo: font-sans
Animaciones: framer-motion whileInView, once:true, opacity+y
```

---

## Blueprint (Assembly Line)

> Solo fases. Las subtareas se generan al entrar a cada fase con el bucle agéntico.

### Fase 1: Estructura de Datos + Copy
**Objetivo**: Definir todas las constantes de contenido del componente (objeciones, proceso, comparativa) separadas de la UI. Copy verbatim del GRAN-SLAM-OFFER integrado correctamente como strings JSX.
**Validación**: El componente renderiza los datos en el orden correcto sin errores de TypeScript.

### Fase 2: UI Premium — Módulos Glassmorphism
**Objetivo**: Implementar el diseño visual de cada módulo. Hook apertura, Process Timeline, Value Comparison Card, Objections Grid, Guarantee Card. Estándar glass/dark de BRANDING.md.
**Validación**: Visual alineado con `PricingSection.tsx`. Sin Tailwind 4. `typecheck` limpio.

### Fase 3: Módulo de Urgencia + CTA Final
**Objetivo**: Construir el cierre — bloque de escasez con tensión visual máxima + botón CTA con glow primario + nota de pie que neutraliza el miedo al compromiso.
**Validación**: El CTA usa `RippleButton`. Urgencia visualmente diferenciada del resto de la sección.

### Fase 4: Responsividad + Animaciones
**Objetivo**: Todos los módulos totalmente responsivos (mobile 375px / desktop 1280px). Animaciones `framer-motion whileInView` en cada módulo para entry progresivo al scroll.
**Validación**: Sin overflow horizontal. Inspección visual confirmada.

### Fase 5: Validación Final
**Objetivo**: Motor de cierre funcionando end-to-end en `/precios`.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso (`/precios` sigue siendo `○ Static`)
- [ ] Todos los criterios de éxito cumplidos
- [ ] Export nombrado `TransparencyConsolidation` intacto

---

## Gotchas

- [ ] **Tailwind 3**: No usar `@import "tailwindcss"` ni sintaxis de Tailwind 4
- [ ] **Export nombrado**: DEBE ser `export function TransparencyConsolidation()` — no default export
- [ ] **`"use client"`**: Framer-motion requiere la directiva en la primera línea
- [ ] **Botón CTA**: Usar `RippleButton` de `src/components/ui/multi-type-ripple-buttons.tsx`
- [ ] **Markdown en JSX**: El copy del GRAN-SLAM-OFFER usa `**negrita**` → convertir a `<strong>` o spans con clases, no copiar markdown crudo
- [ ] **`EnrollmentModal`**: Verificar si existe en el codebase antes de integrar. Si no, usar `href` a WhatsApp o calendly como fallback

## Anti-Patrones

- NO crear nuevas rutas o features — todo va en `TransparencyConsolidation.tsx`
- NO ignorar errores de TypeScript
- NO copiar el roadmap de 3 cards del componente actual — arquitectura visual completamente nueva
- NO usar colores hardcodeados — solo tokens de `tailwind.config.ts`
- NO omitir animaciones `framer-motion` — estándar de la landing

---

## Aprendizajes (Self-Annealing)

> Esta sección se completa durante la implementación con los errores y fixes encontrados.

---

*PRP pendiente aprobación. No se ha modificado código.*
