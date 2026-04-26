# Product Requirements Proposal (PRP) - Benefits Carousel

## 1. Contexto y Metadatos
- **Propósito**: Integrar y replicar el impacto visual del `HeroInfiniteCarousel` (Doble Carrusel Infinito) inyectándolo en la primera pestaña del `BenefitsList.tsx` ("Landing de Alta Conversión").
- **Archivos Core Afectados**: 
  - `src/features/landing-page/components/BenefitsList.tsx`
  - `src/shared/components/ui/hero-infinite-carousel.tsx`
- **Estado**: Propuesta a revisión (Esperando luz verde).

## 2. Objetivo Principal
Aprovechar el componente `HeroInfiniteCarousel` ya desarrollado y portarlo como *Fondo Condicional Dinámico* (Background Render) para la primera pestaña del macro-componente `BenefitsList` (gestionado bajo la pista de `FullScreenScrollFX`), sin romper sus transiciones de crossfade ni opacar la legibilidad de las tarjetas modulares (Glassmorphism de las `FeatureCard`).

---

## 3. Blueprint & Estrategia de Implementación

### Fase 1: Enriquecimiento del Carrusel Activo (Reusabilidad)
Actualmente, `HeroInfiniteCarousel` es un componente ciego/agnóstico de React; su control fue orquestado a través de inyección directa al modelo del DOM usando una `Ref` en el `LuminaSlider`. 
En `BenefitsList.tsx`, el motor *FullScreenScrollFX* inyecta el `active` loop vía props de Render `(active: boolean) => ...`.

- **Solución Propuesta**: Añadir un prop nativo a `HeroInfiniteCarousel`: `isActive?: boolean`. 
- Si se inyecta `isActive`, el componente regulará automáticamente sus *Inline Styles* Reactivos (`opacity: isActive ? 1 : 0`). Si no, funcionará de acuerdo a su `ref` clásico para el Lumina Slider, logrando un patrón de reusabilidad 100% puro.

### Fase 2: Inyección de Capas en `BenefitsList.tsx`
Modificaremos la propiedad `renderBackground` de la pestaña `"lander-apple"` en la definición de `cinematicSections`:

```tsx
// Lógica Híbrida Propuesta
renderBackground: (active: boolean) => (
  <div className="absolute inset-0 z-0 bg-black pointer-events-none">
     <ShaderBackground speed={active ? undefined : 0} />
     <HeroInfiniteCarousel isActive={active} />
  </div>
)
```

### Fase 3: Ajuste de Contraste Creado (Z-Index y Legibilidad)
Puesto que las `FeatureCard` tienen un efecto cristal oscuro translúcido (`backdrop-blur-md`, texturas de borde flourescentes), sobreponer el listado dinámico del carrusel directamente detrás podría generar estática visual (el texto compitiendo con las imágenes que corren infinitamente en el fondo).
- Añadiremos un tinte superpuesto `bg-black/60` a la inyección (ajustado en `BenefitsList.tsx`) para sepultar suavemente el brillo de las pantallas del carrusel en favor de la jerarquía frontal.

---

## 4. Riesgos Previstos & Medidas Preventivas (Gotchas)

1. **Colisión de Transiciones CSS:**
   - Podría existir una colisión entre el desvanecimiento cruzado nativo de `FullScreenScrollFX` (que funde la escena en ~1000ms) y la transición de `opacity` del componente (`transition: "opacity 2.5s"`). Sincronizaremos localmente estas velocidades limitando la transición del `opacity` al prop reactivo si es manejado por state, para que se apaguen de forma acompasada.
2. **Polución de Performance (GPU)**:
   - Que `FullScreenScrollFX` mantenga renderizando múltiples carruseles en la primera ventana al hacer scroll a la tercera podría disparar el CPU.
   - *Solución*: Ocultarlo verdaderamente al bajar el `isActive` o apagar `framer-motion` temporalmente asegurándose de delegar las optimizaciones de ocultamiento con CSS Puro al motor interno.

---

## 5. Criterios de Aceptación (DoD)
- ✅ El **LuminaSlider (Hero Principal)** funciona perfectamente sin regresiones de nuestro commit `retoque` gracias a la reusabilidad agnóstica de ref y al prop opcional.
- ✅ La Pestaña 1 de `BenefitsList` expone las imágenes de la industria del software desplazándose en el carrusel de fondo mientras la experiencia sub-scroll ocurre.
- ✅ Al realizar un "scroll" vertical hacia la pestaña 2 ("Vendedor IA"), el carrusel desaparece orgánicamente con un fundido a negro y se presenta la imagen panorámica de la Vendedora/IA.

## Solicitud de Acción
Revisa la lógica y riesgos de esta estrategia. ¿Estás de acuerdo con el paso general? Si lo apruebas, dime "procede/ejecuta" y activaré el paso 1 que muta el componente e introduce la inyección.
