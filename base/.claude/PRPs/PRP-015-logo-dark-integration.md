# PRP-015: LogoBrandFlow — Integración Premium con Fondo Oscuro

## Objetivo

Transformar el reveal del logo en `PasSection.tsx` de una imagen flotante con borde fino a una **integración cinematográfica** donde el logo parece surgir del propio fondo oscuro, eliminando todo rastro de "foto sobre pantalla" mediante composición por capas, masking por gradiente, glow atmosférico y efecto de profundidad.

## Por qué

El logo de KIA Intelligence actualmente se renderiza con un simple `border border-white/10` y un `shadow` de cyan suave. En pantalla negra, el borde rectangular delata que es una imagen ajena — rompe la inmersión. El usuario no siente que la marca "emerge" del ambiente; sino que aparece pegada encima. Un reveal donde el logo parece nacer de la oscuridad eleva inmediatamente la percepción de marca premium y prolonga el impacto emocional justo antes del CTA.

---

## Contexto de Código

**Archivo principal**: `src/features/landing-page/components/PasSection.tsx`

### Componente actual — `LogoBrandFlow` (líneas 209–255)

```tsx
function LogoBrandFlow({ progress }) {
  // Keyframes de opacidad, y, scale con useTransform
  return (
    <motion.div style={{ opacity, y, scale }} className="flex flex-col items-center gap-3">
      {/* Contenedor actual */}
      <div className="relative size-20 md:size-24 rounded-none overflow-hidden border border-white/10 shadow-[...]">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
      </div>
      <p>KIA · Intelligence</p>
    </motion.div>
  );
}
```

### Estado del logo — `/public/logo.png`
- Tamaño: ~30KB (logo-new.png y logo.png son idénticos)
- Sin información del fondo del logo (posiblemente tiene fondo blanco o transparente)
- Si el logo tiene fondo blanco: necesita `mix-blend-mode: screen` o `lighten` para fundirse con negro
- Si el logo tiene fondo transparente: el trabajo es principalmente glow + depth layers

### Paleta de marca (de BUSINESS_LOGIC.md)
```
Cyan principal:   #06b6d4 / #00f2ff
Emerald acento:   #10b981 / #34d399
Fondo:            #000000 (negro absoluto)
Gradiente hero:   linear-gradient(135deg, #00f2ff 0%, #06b6d4 30%, #10b981 70%, #34d399 100%)
```

---

## Criterios de Éxito

1. **No border visible**: El logo no debe mostrar ningún borde rectangular ni caja contenedora.
2. **Fusión con negro**: La imagen se percibe como emergiendo del fondo oscuro, no superpuesta.
3. **Glow atmosférico multi-capa**: Un halo de luz cyan/emerald irradia debajo y alrededor del logo con sutileza premium (no neón barato).
4. **Reveal scroll-driven**: El glow y la integración se acentúan conforme avanza el scroll (scroll progress → glow intensity).
5. **Detalles realzados**: El logo tiene mayor contraste y claridad interna que en el fondo blanco original.
6. **Performance**: Solo `transform` + `opacity` en animaciones. Sin layout recalculation.

---

## Comportamiento Esperado — Happy Path

```
[scroll 0.72]  LogoBrandFlow empieza a aparecer desde abajo
               → Opacidad 0→1, glow de 0→suave
               → El logo se ve oscuro, casi como si fuera humo/silueta

[scroll 0.78]  Logo totalmente visible en el centro
               → Glow atmosférico plenamente activo
               → "KIA" con gradiente cyan-emerald pulsando suavemente
               → Zero borde rectangular visible

[scroll 0.80]  Comienza ascenso al área superior (encima del CTA)
               → El glow sigue al logo durante el ascenso

[scroll 0.87–0.95]  Logo estabilizado arriba, CTA emergiendo debajo
               → El glow del logo y el gradiente del fondo se "tocan"
               → Composición final: logo integrado arriba + CTA abajo = bloque visual unificado
```

---

## Técnicas de Integración — Stack de Capas

La integración oscura premium se logra combinando estas capas (de atrás hacia adelante):

### Capa 1: Glow Atmosférico Difuso (detrás del logo)
```
- Un div absoluto de ~200×200px con un radial-gradient muy suave
- Color: rgba(0,242,255,0.15) en el centro → transparent en los bordes
- blur-3xl (48px de desenfoque)
- Se anima con scroll: opacidad 0→0.6 al aparecer
```

### Capa 2: Vignette de Fundición (máscara de bordes)
```
- El contenedor del logo usa mask-image con radial-gradient
- mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%)
- Esto vignettea los bordes de la imagen haciéndola desaparecer en los extremos
- Si el logo tiene fondo blanco: mix-blend-mode: screen o lighten + brightness-200
```

### Capa 3: Ring de Luz (border glow)
```
- Reemplaza border por ring animado + box-shadow
- NO usa border, usa outline/ring con blur
- box-shadow: 0 0 30px rgba(0,242,255,0.3), inset 0 0 20px rgba(0,242,255,0.1)
- Crea efecto de "luz emanando desde el logo"
```

### Capa 4: Partículas de Luz (opcional, sin JS extra)
```
- 3-4 pseudo-elementos / divs con animación CSS pure
- Puntos de luz que orbitan o flotan cerca del logo
- solo si no impacta performance
```

### Capa 5: Tipografía Mejorada (brand name)
```
- "KIA" con gradiente ya implementado → mantener
- "Intelligence" elevar contrast: text-white/80 en lugar de text-slate-300
- Añadir letra-spacing más amplio y tracking para sensación de élite
- Micro-separador: línea horizontal de 1px con gradiente fade-in
```

---

## Blueprint de Fases

### Fase 1 — Diagnóstico Visual del Logo

**Objetivo**: Determinar si `logo.png` tiene fondo blanco o transparente, para elegir la vía de composición correcta.

- Inspeccionar el archivo `/public/logo.png` visualmente o vía metadata
- Si fondo **blanco**: la integración usa `mix-blend-mode: screen` + `brightness-[2]` + masking
- Si fondo **transparente**: la integración usa glow layers + depth shadows únicamente
- Elegir la técnica de composición correcta antes de codificar

### Fase 2 — Refactorizar el Contenedor del Logo

**Objetivo**: Eliminar el borde rectangular y aplicar masking + composición.

- Refactorizar `LogoBrandFlow` para usar las capas descritas arriba
- Implementar `mask-image` radial para vignette
- Implement `mix-blend-mode` correcto según diagnóstico de Fase 1
- Remover `border border-white/10` y `overflow-hidden rounded-none`
- Añadir glow atmosférico scroll-driven (Capa 1)

### Fase 3 — Glow Multi-Capa Scroll-Driven

**Objetivo**: El glow se intensifica con el scroll progress, sincronizado con keyframes existentes.

- Usar `useTransform` para animar la opacidad del glow con `smoothProgress`
- Rango `[0.72, 0.80, 0.87, 0.95]` → glow `[0, 0.6, 0.4, 0.2]` (fade al salir)
- Implementar ring de luz con box-shadow animado via CSS custom property o inline style
- Validar que no cause layout recalc (solo opacity/transform)

### Fase 4 — Pulir Tipografía y Composición Final

**Objetivo**: La sección de texto del brand name se ve premium e integrada.

- Mejorar "Intelligence" tracking y contraste
- Añadir micro-separador entre logo e texto (1px line gradient)
- Validar que la composición final (logo arriba + CTA abajo) forma un bloque visual cohesivo
- Snapshot visual antes/después

---

## Restricciones

- NO cambiar keyframes de movimiento (`y`, scroll timing) del PRP-003 ya implementado
- NO agregar dependencias nuevas — solo CSS, Framer Motion (`useTransform`) ya disponibles
- Solo animar `transform`, `opacity`, y propiedades que no causen layout recalc
- El logo path sigue siendo `/logo.png` (no crear variantes)
- Mantener compatibilidad mobile-first (`size-20 md:size-24`)

---

## Referencias

- `PasSection.tsx` líneas 205–255 (`LogoBrandFlow`)
- `PRP-003-pas-section-logo-reveal.md` (timing del reveal, ya implementado)
- Paleta: `BUSINESS_LOGIC.md` sección Branding
- Técnica mix-blend-mode: MDN Web Docs `mix-blend-mode: screen`
- Técnica mask-image: MDN Web Docs `mask-image` + `mask-composite`

---

## Aprendizajes (Post-implementación)

*(Se completan durante la ejecución)*
