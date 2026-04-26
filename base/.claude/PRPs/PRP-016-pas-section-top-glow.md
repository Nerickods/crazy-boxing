# PRP-016: PasSection — Top Morningside Glow Effect

## Objetivo

Añadir un efecto de gradiente superior en la `PasSection` que emule el fondo oscuro teal/verde de la referencia Morningside: un glow suave radial desde el top-center de la sección que se difumina hacia negro, creando profundidad y transición visual premium desde el HeroSection.

## Por qué

Actualmente la `PasSection` tiene `bg-black` puro. El paso del `HeroSection` (que sí tiene mesh gradient con colores teal/emerald) al negro absoluto se siente brusco y sin cohesión. La referencia de Morningside muestra cómo este tipo de fondo oscuro-pero-con-glow superior mantiene la atmósfera premium del brand, da continuidad al storytelling, y hace que el texto blanco resalte mucho más al tener una base atmosférica.

---

## Contexto de Código

**Archivo principal**: `src/features/landing-page/components/PasSection.tsx`

### Background actual
```tsx
// bg-black en la sección
<section className="relative h-[800vh] bg-black z-10 ...">

// Dynamic Glow (centrado, se anima con scroll)
<motion.div className="fixed inset-0 ...">
  <div className="...radial-gradient(circle_at_center...)" />
  <div className="...noise.svg..." />
</motion.div>

// Bottom Atmospheric Gradient (visible solo al final)
<motion.div style={{ opacity: useTransform([0.89, 0.96], [0, 1]) }}>
  // Gradiente verde desde el bottom
</motion.div>
```

### Análisis de la referencia Morningside
El efecto de la foto tiene:
- Fondo base: `#0a1a16` (negro con tinte verde muy oscuro) o `#000d0a`
- Glow superior: radial-gradient desde `top center`, color `rgba(6, 78, 59, 0.7)` (verde esmeralda muy oscuro) transitando a transparent ~60% de la altura
- El glow no es brillante — es atmosférico, más "niebla verde" que "neón"
- Paleta KIA: adaptar a `rgba(6, 182, 212, 0.12)` (cyan) + `rgba(16, 185, 129, 0.18)` (emerald) para mantener la identidad

---

## Criterios de Éxito

1. **Continuidad visual**: El inicio de `PasSection` no se siente como un corte abrupto, sino como una extensión atmosférica del HeroSection.
2. **Efecto Morningside**: Glow radial desde top-center visible y suave, nunca dominante sobre el texto.
3. **Compatibilidad con scroll**: El glow superior es **estático** (no se anima con el scroll). Es la base permanente del fondo.
4. **No contamina el fondo negro**: El efecto se ve solo en el top 40-50% del viewport, dejando el negro puro en los laterales y el centro inferior.
5. **Paleta KIA**: Usa cyan/emerald de la marca, no verde puro de Morningside.

---

## Referencia Visual

```
┌─────────────────────────────────────────────────────┐
│    ░░░░░░▓▓▓▓▓▓▓████████▓▓▓▓░░░░░░░░░               │
│  ░░░  [glow teal/emerald radial desde arriba]  ░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                  [texto white]                       │
│                                                      │
│                                                      │
│  [negro puro en la parte baja]                       │
└─────────────────────────────────────────────────────┘
```

---

## Comportamiento Esperado — Happy Path

```
[PasSection entra al viewport]
  → El usuario ve un fondo quasi-negro con un halo de luz
    teal-emerald muy suave emanando desde el top-center.
  → El efecto es constante durante toda la sección.
  → Complementa (no compite) con el Dynamic Glow scroll-driven.

[Progreso scroll 0 → 1]
  → El efecto top glow permanece estático como base ambiental.
  → El Dynamic Glow central sigue animándose encima de él.
  → Al final, el Bottom Gradient verde emerge desde abajo.
  → Resultado: la sección tiene "atmósfera viva" de arriba abajo.
```

---

## Blueprint de Fases

### Fase 1 — Implementar el Top Glow Estático

**Objetivo**: Añadir la capa de glow superior a la sección.

- Técnica: Dos capas CSS puras (no Framer Motion) pintadas en una posición `absolute` dentro del `sticky div`.
- **Capa A** (glow principal): `radial-gradient(ellipse 120% 60% at 50% 0%, rgba(6,182,212,0.12), rgba(16,185,129,0.08), transparent)` → cubre el top 60% del viewport con luz teal/emerald muy tenue.
- **Capa B** (intensificador central): `radial-gradient(circle 40% at 50% -10%, rgba(16,185,129,0.08), transparent)` → punto focal más pequeño justo desde el borde superior.
- Ambas capas con `pointer-events-none z-0` para no interferir con el scroll.

### Fase 2 — Ruido de Textura (opcional, si mejora la calidad)

**Objetivo**: Añadir la misma textura de ruido que existe en el Dynamic Glow al top glow.

- Usar una capa de ruido con `mix-blend-overlay` y `opacity-5` superpuesta al top glow.
- Evita el efecto "plástico" que tienen los gradients CSS puros.
- Solo implementar si la Fase 1 ya no se ve premium por sí sola.

### Fase 3 — Ajuste de Paleta y Validación Visual

**Objetivo**: Verificar que el efecto respeta la identidad visual de KIA Intelligence.

- Confirmar que el cyan (#06b6d4) y el emerald (#10b981) son los colores dominantes del glow.
- Asegurar que el texto blanco del primer item ("Tu tiempo se agota...") tenga suficiente contraste.
- Ajustar opacidades si hace falta (el efecto debe ser "niebla" no "floodlight").

---

## Restricciones

- **Solo CSS / Tailwind** — no agregar dependencias nuevas.
- **No animado con scroll** — el glow es estático (base ambiental).
- **No afectar el z-index** del contenido de texto ni del Logo reveal.
- **Posición absoluta, no fixed** — el glow viaja con el sticky viewport como parte de la sección, no del global fixed layer.
- Mantener compatibilidad con el `Dynamic Glow` ya animado (son capas distintas).

---

## Referencias

- `PasSection.tsx` líneas 42–68 (sección y background layers existentes)
- Paleta: `BUSINESS_LOGIC.md` sección Branding
- Foto referencia: Morningside hero section (fondo verde-oscuro top-center)
- Técnica: `radial-gradient` CSS con forma `ellipse` para glow más horizontal que vertical

---

## Aprendizajes (Post-implementación)

*(Se completan durante la ejecución)*
