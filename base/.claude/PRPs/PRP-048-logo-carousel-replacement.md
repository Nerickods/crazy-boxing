# PRP-048: Modernizado de Carrusel de Logos (Infinite Slider)

Este PRP detalla la sustitución del carrusel de logos actual en `AuthorityGuide.tsx` por una implementación basada en `InfiniteSlider` de ibelick, optimizada para rendimiento y estética mediante `framer-motion`.

## User Review Required

> [!IMPORTANT]
> Se instalará la dependencia `react-use-measure` para el cálculo dinámico del ancho del carrusel.
> Se mantendrán los logos de **Notebook** y **GitHub** como se solicitó, además de integrar los nuevos logos sugeridos por el usuario.

## Proposed Changes

### [Infraestructura & Dependencias]

#### [MODIFY] [package.json](file:///wsl.localhost/Ubuntu/home/nerick_ods/solutions/landing-linkedin/package.json)
- Añadir `react-use-measure`.

---

### [Componentes Compartidos]

#### [NEW] [infinite-slider.tsx](file:///wsl.localhost/Ubuntu/home/nerick_ods/solutions/landing-linkedin/src/components/ui/infinite-slider.tsx)
- Implementación base del slider infinito usando `framer-motion` y `react-use-measure`.

#### [NEW] [logo-cloud.tsx](file:///wsl.localhost/Ubuntu/home/nerick_ods/solutions/landing-linkedin/src/components/ui/logo-cloud.tsx)
- Wrapper para el `InfiniteSlider` configurado específicamente para mostrar nubes de logos con máscaras de degradado.

---

### [Landing Feature]

#### [MODIFY] [AuthorityGuide.tsx](file:///wsl.localhost/Ubuntu/home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/AuthorityGuide.tsx)
- Reemplazar `AnimatedCarousel` por `LogoCloud`.
- Actualizar la lista de logos para incluir:
  - NVIDIA
  - Supabase
  - OpenAI
  - Turso
  - Vercel
  - GitHub (Preservado)
  - Claude AI
  - Clerk
  - NotebookLM (Preservado)

## Open Questions

- ¿Deseas que el carrusel mantenga el título actual ("El Arsenal Tecnológico...") o usamos el del demo ("Trusted by experts...")? Por defecto mantendré el actual para no afectar el copy de autoridad.

## Verification Plan

### Automated Tests
- Ejecutar `npm run dev` y verificar que no haya errores de compilación.
- Validar visualmente el scroll infinito del nuevo componente.

### Manual Verification
- Comprobar que el hover reduce la velocidad del slider como se especifica en el componente de ibelick.
- Verificar que las máscaras de degradado lateral funcionan correctamente en Dark Mode.
