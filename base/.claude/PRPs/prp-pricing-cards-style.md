# Product Requirements Proposal (PRP) - Replicación de Estilo "Warp Glassmorphism" en Tarjetas de Precios

## 1. Contexto Metadatos
- **Fecha**: [Current Date]
- **Objetivo**: Estandarizar la estética de las tarjetas de la subpágina `/precios/`, replicando exactamente el estilo rico (Fondo animado WebGL `Warp` + Overlay Glassmorphic reactivo al hover) utilizado en `/modulos/` (`ModuloDifferentiators.tsx`).
- **Estado**: Draft / Aprobado
- **Autor**: Antigravity

## 2. Mapa de Estilos (Specs a Replicar)

En `/modulos/[slug]`, el estilo élite base que usamos para las tarjetas es el siguiente stack de capas (Layering Pattern):

1. **Outer Container**: 
   `relative group overflow-hidden rounded-3xl`
2. **WebGL Background Layer (`<Warp />`)**: 
   Fondo animado que reacciona iluminándose en el hover.
   `absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-700`
3. **Glass Content Overlay**:
   Contenedor superior que hace el blur oscuro, aclarándose sutilmente al poner el ratón.
   `relative z-10 p-8 h-full flex flex-col bg-black/70 backdrop-blur-md border border-white/10 group-hover:bg-black/40 group-hover:border-white/30 transition-all duration-500`
4. **Typography Effects**: 
   Añadido de text-shadow sutil a los párrafos y títulos para sobrevivir la lectura contra el fondo animado.
   - Headers: `drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`
   - Texto normal: `drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]`

## 3. Plan de Implementación en `/precios` (`PricingSection.tsx`)

### Fase 1: Extracción del Motor de Shaders (The WebGL Config)
En `PricingSection.tsx` existen al menos 4 "tarjetas" o bloques interactivos principales:
1. Qué incluye (Features)
2. Acceso a Actualizaciones (Switch 1)
3. Licencia de por Vida (Switch 2)
4. Caja Principal de Precios y CTA (Adquirir Ahora)

Vamos a configurar un map dinámico de `configs` (parecido al de `ModuloDifferentiators`) pero utilizando la identidad gráfica acentuada del Checkout (por ejemplo, tonos *Cyan*, *Emerald*, y *Purple* o simplemente la paleta `accent-cyan` como base de Hue: 190).

### Fase 2: Refactorización Estructural de los `TimelineContent`
Actualmente, `PricingSection.tsx` estiliza sus tarjetas directamente pasándole las clases físicas a `TimelineContent as="div"`.
El refactor convertirá la estructura actual a la siguiente para cada uno de los 4 bloques:

```tsx
<TimelineContent
  as="div"
  animationNum={X}
  timelineRef={pricingRef}
  customVariants={revealVariants}
  className="relative group overflow-hidden rounded-3xl w-full"
>
  {/* Fondo WebGL */}
  <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
    <Warp {...shaderConfig} />
  </div>

  {/* Contenido Glassmorphic */}
  <div className="relative z-10 p-8 h-full flex flex-col bg-black/70 backdrop-blur-md border border-white/10 group-hover:bg-black/40 group-hover:border-white/30 transition-all duration-500">
     {/* Textos y Componentes Originales, integrando drop-shadow*/}
  </div>
</TimelineContent>
```

### Fase 3: Ajuste Fino de Contraste y Transparencias
  - Las tarjetas de switches internas de `PricingSection.tsx` ya contaban con esquemas como `bg-white/[0.02]` que chocarán con el nuevo sistema. Limpiaremos estrictamente los paddings, bordes y fondos preexistentes en los contenedores padres y los delegaremos al Overlay `#3` listado previamente.
  - Asegurar que el botón de `Adquirir ahora` siga acaparando la jerarquía más alta mediante uso inteligente de blur e iluminaciones CSS trasfondos.

---

## 4. Criterios de Aceptación (DoD)
1. ✅ Todas las 4 tarjetas listadas en `/precios` deben tener su propio patrón de shader animado `Warp` visible en reposo y brillante al `hover`.
2. ✅ La legibilidad no debe verse comprometida. El `bg-black/70 backdrop-blur-md` actuará de amortiguador efectivo.
3. ✅ El CSS existente conflictivo (`bg-white/[0.02]`, border preexistente) debe refactorizarse en favor del styling unificado extraído de `ModuloDifferentiators`.

## Solicitud de Acción
> [!IMPORTANT]
> El PRP documenta las clases exactas de `/modulos` en el apartado #2 y aplica esa lógica técnica en las tarjetas de Pricing #3. Si el enfoque técnico es el deseado, aprueba el plan ('procede' o 'ejecuta') y haré el refactor real en el archivo fuente de pricing.
