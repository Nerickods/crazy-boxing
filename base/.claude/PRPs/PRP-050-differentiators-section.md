# PRP-050: Why Me — Sección de Diferenciadores de Valor

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-23
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Construir una nueva sección React `WhyMeSection.tsx` que se inserte inmediatamente después de `PasSection` en `page.tsx`, presentando las **5 Razones Diferenciadores** (Bloques 2.1 y 2.2 del GRAN-SLAM-OFFER.md) con un diseño gradient-mesh de élite que mantenga el ritmo narrativo de la landing y refuerce la conversión antes de que el usuario llegue al proceso.

---

## Por Qué

| Problema | Solución |
|----------|----------|
| El usuario termina PasSection agitado (siente el dolor), pero la siguiente sección (ProcessSection) salta directo al "cómo" sin validar por qué KIA Intelligence es la opción superior frente a alternativas. | Una sección de diferenciadores cierra el gap persuasivo: responde "¿por qué tú y no otro?" justo cuando el prospecto está más receptivo, antes de mostrar el proceso. |
| El copy de los diferenciadores existe en el documento GRAN-SLAM-OFFER.md pero no está expuesto en la landing. | Traducir ese contenido diferenciador a UI de alta conversión con el sistema visual del proyecto. |

**Valor de negocio**: Este es el punto de mayor pérdida de conversión en cualquier funnel de alto ticket. El prospecto emocionalmente activado por PasSection necesita una razón racional para seguir. Esta sección provee esa justificación y filtra leads no cualificados antes de que lleguen al CTA.

---

## Qué

### Criterios de Éxito
- [ ] Componente `WhyMeSection.tsx` renderizado en `page.tsx` inmediatamente después de `<PasSection />`
- [ ] Las 5 razones del bloque 2.2 del GRAN-SLAM-OFFER están representadas visualmente con cards gradient-mesh individuales
- [ ] La frase de posicionamiento del bloque 2.1 aparece como headline de la sección
- [ ] El fondo usa la técnica blob-blur del design system `gradient-mesh` con colores de marca (cyan/emerald en tonos KIA)
- [ ] Framer Motion: entrada staggered de las cards al scroll (viewport intersection)
- [ ] Totalmente responsivo: grid de 1 col mobile → 2 col md → variable desktop
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso

### Comportamiento Esperado (Happy Path)

1. El usuario termina de scrollear `PasSection` y entra en la nueva sección.
2. Ve un headline de posicionamiento potente (Bloque 2.1) sobre un fondo gradient-mesh dark con blobs cyan/emerald animados sutilmente.
3. Debajo aparecen 5 cards glassmorphism, cada una representando una razón diferenciadora (Bloque 2.2), con ícono, título y descripción concisa.
4. Las cards se revelan en stagger al entrar al viewport.
5. Al fondo de la sección hay una micro-CTA que refuerza la escasez ("2 socios/mes").
6. La transición visual al `ProcessSection` es suave y coherente.

---

## Contexto

### Referencias de Contenido

- **Frase de posicionamiento (2.1):**
  > "Ayudo a dueños de negocios locales y fundadores de agencias B2B **a** convertir su proceso de ventas en un sistema autónomo de élite que captura, califica y agenda prospectos en piloto automático **sin** necesitar programadores, agencias caras ni meses de desarrollo."

- **5 Razones (2.2) — GRAN-SLAM-OFFER.md:**
  1. **El Stack Invisible** — $1/mes de mantenimiento vs agencias con cuotas recurrentes.
  2. **15 días, no 3 meses** — Sprint cerrado vs meses de burocracia de agencias.
  3. **Desarrollo 1:1 artesanal (2 socios/mes)** — Atención directa de Nerick Segoviano. Sin producción en masa.
  4. **Arquitectura Modular y Escalable** — Empieza con Landing (Básico) y escala a ecosistema completo sin reconstruir nada.
  5. **Garantía de Funcionamiento** — 30 días de soporte técnico directo post-entrega. Sin desaparecer.

### Referencias de Código

- `src/features/landing-page/components/PasSection.tsx` — Patrón de atmosfera (glow top, bottom emerald, VerticalFolds). Respetarlo para consistencia visual.
- `src/features/landing-page/components/AuthorityGuide.tsx` — Ejemplo de glassmorphism `bg-white/5 backdrop-blur border border-white/10` en cards.
- `src/features/landing-page/components/BenefitsList.tsx` — Patrón de tabs/cards con íconos Lucide.
- `.claude/design-systems/gradient-mesh/gradient-mesh.md` — Técnica de blob-blur con Tailwind.
- `tailwind.config.ts` — Animaciones existentes: `animate-gradient-flow`, `animate-aurora`, `animate-pulse-slow`.

### Paleta de Color para los Blobs (del branding KIA)

```
Blob 1 (top-left):   bg-emerald-500   blur-[150px] opacity-[0.12]
Blob 2 (top-right):  bg-cyan-500      blur-[128px] opacity-[0.10]
Blob 3 (bottom):     bg-teal-600      blur-[150px] opacity-[0.08]
Base:                bg-black (sin cambio, consistente con el resto de la landing)
```

> Mantener opacidades bajas (0.08–0.15) para no competir con el contenido. El efecto debe ser sutil y atmosférico, no llamativo.

### Arquitectura Propuesta

```
src/features/landing-page/components/
└── WhyMeSection.tsx    ← [NUEVO] Componente principal (self-contained)
```

**No se necesita:** hooks separados, store, ni servicios. El contenido es estático. Toda la lógica vive en el componente.

**Estructura interna del componente:**

```tsx
// Constante de datos arriba del componente
const DIFFERENTIATORS = [
  { icon: DollarSign, label: "Stack Invisible", ... },
  { icon: Zap, label: "15 Días", ... },
  { icon: User, label: "1:1 Artesanal", ... },
  { icon: Layers, label: "Modular y Escalable", ... },
  { icon: ShieldCheck, label: "Garantía de Funcionamiento", ... },
]

export function WhyMeSection() {
  return (
    <section> 
      {/* Gradient Mesh Background (blob-blur) */}
      {/* Headline: Bloque 2.1 */}
      {/* Grid de 5 cards: Bloque 2.2 */}
      {/* Micro-CTA de escasez */}
    </section>
  )
}

// Subcomponente interno:
function DifferentiatorCard({ icon, label, description, index }) { ... }
```

### Modelo de Datos

No aplica (contenido estático, no requiere BD ni Supabase).

### Layout del Grid de Cards

```
Mobile (1 col):
[ Card 1 ]
[ Card 2 ]
[ Card 3 ]
[ Card 4 ]
[ Card 5 ]

Tablet md (2 col):
[ Card 1 ] [ Card 2 ]
[ Card 3 ] [ Card 4 ]
[ Card 5 ]  ← centrada

Desktop lg (el card 5 va centrado o se usa grid-cols-3 primeros 3 + 2 col últimos):
[ Card 1 ] [ Card 2 ] [ Card 3 ]
     [ Card 4 ]  [ Card 5 ]
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Crear `WhyMeSection.tsx`
**Objetivo**: Componente funcional completo con el fondo gradient-mesh, el headline de posicionamiento (2.1), las 5 cards diferenciadores (2.2) con animación stagger Framer Motion, y la micro-CTA de escasez.
**Validación**: El componente compila sin errores de TypeScript. Las cards se renderizan con el contenido correcto.

### Fase 2: Integrar en `page.tsx`
**Objetivo**: Importar y colocar `<WhyMeSection />` en `page.tsx` inmediatamente después de `<PasSection />` y antes de `<ProcessSection />`.
**Validación**: El orden de secciones es correcto al visualizar la landing. No hay errores de compilación.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando end-to-end, sin regresiones en secciones existentes.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] La sección aparece visualmente entre PasSection y ProcessSection
- [ ] Responsividad correcta en mobile (1 col) y desktop (2-3 col)
- [ ] El gradient-mesh es visible y atmosférico sin distraer del contenido

---

## 🧠 Aprendizajes (Self-Annealing)

> Esta sección CRECE con cada error encontrado durante la implementación.

*(Vacío — pendiente implementación)*

---

## Gotchas

- [ ] **Framer Motion `useInView` en Server vs Client**: El componente debe tener `'use client'` al tope porque usa hooks de Framer Motion. Si no, Next.js lanzará error de hidratación.
- [ ] **Blur pesado en mobile**: Los blobs con `blur-[150px]` pueden ser costosos en GPU mobile. Aplicar `hidden md:block` o reducir el blur a `blur-[80px]` en mobile con clases responsivas.
- [ ] **Consistencia de `z-index`**: El fondo gradient-mesh debe ser `pointer-events-none` y `z-0`. Las cards deben ser `relative z-10`.
- [ ] **Tailwind `animate-blob`**: Este preset NO existe en el `tailwind.config.ts` actual. No usar. En su lugar, usar CSS `@keyframes` inline en `style` props o simplemente blobs estáticos con `animate-pulse-slow` (que sí existe).
- [ ] **`overflow-hidden` en la sección contenedora**: Es crítico para que los blobs no generen scroll horizontal.

## Anti-Patrones

- NO crear un archivo de datos separado para los diferenciadores (YAGNI — el contenido es estático y pertenece al componente)
- NO usar `any` en TypeScript para los props de las cards
- NO olvidar el `id` de la sección para posibles links de navegación
- NO romper el ritmo visual existente con colores fuera de la paleta cyan/emerald

---

*PRP pendiente aprobación. No se ha modificado código.*
