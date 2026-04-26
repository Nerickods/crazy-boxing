# PRP-009: Fixes de Estabilidad & Hero Title Scroll Animation

Este plan aborda errores críticos de consola que afectan la limpieza del proyecto y la hidratación de React, además de añadir una mejora estética al Hero.

## User Review Required

> [!IMPORTANT]
> Se modificará el comportamiento del título principal para que se desplace lateralmente con el scroll, similar al efecto de "texto infinito" o "marquee scroll" detectado en otros elementos.

## Proposed Changes

### [Component: Shared UI & Features]

#### [MODIFY] [ShaderBackground.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/ShaderBackground.tsx)
- Corregir el pasaje de `backgroundColor` al componente `MeshGradient`. Si la librería lo pasa al DOM, intentaremos usar el atributo en minúsculas `backgroundcolor` o pasarlo vía `style` si es compatible.

#### [MODIFY] [PulsingExperience.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/PulsingExperience.tsx)
- Cambiar `spotsPerColor` por `spotspercolor` para satisfacer la advertencia de React sobre atributos personalizados en elementos DOM, o envolver el componente para filtrar la prop si es interna.

#### [MODIFY] [Header.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/Header.tsx)
- Refactorizar las partículas del logo para usar un `useEffect`. Generaremos las posiciones aleatorias solo en el cliente para evitar el `Hydration Mismatch`.

#### [MODIFY] [ScrollExpandMedia.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/shared/components/ui/scroll-expansion-hero.tsx)
- Revisar la importación dinámica de `LuminaSlider`. Intentar cambiar el alias `@/` por una ruta relativa para mejorar la resolución de chunks en Turbopack.

#### [MODIFY] [HeroSection.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/HeroSection.tsx)
- Dividir el `h1` en dos líneas.
- Usar `useScroll` de `framer-motion` para obtener el progreso del scroll.
- Aplicar `useTransform` para mover la primera línea a la izquierda y la segunda a la derecha a medida que el usuario baja.

## Verification Plan

### Automated Tests
- `npm run typecheck`: Ejecutar para asegurar que no hay errores de tipos tras los cambios.
- `npm run dev`: Iniciar el servidor y verificar que los errores de consola específicos hayan desaparecido.

### Manual Verification
1. **Consola**: Abrir DevTools y confirmar que no aparecen las advertencias de "React does not recognize...".
2. **Scroll Hero**: Verificar que el título principal se desplace lateralmente de forma fluida al scrollear.
3. **Hidratación**: Recargar la página varias veces y confirmar que no hay errores de desajuste de contenido (SSR vs Client) en el Header.
4. **Lumina Slider**: Confirmar que el slider carga correctamente sin errores de "ChunkLoadError".

## Verification Plan

### Automated Tests
- `npm run typecheck` para asegurar integridad de tipos.
- Verificación manual de la consola para asegurar la desaparición de los errores de "React does not recognize the ... prop".

### Manual Verification
- Scroll en el Hero para validar la animación del título.
- Recarga de página para validar que no haya errores de hidratación.
