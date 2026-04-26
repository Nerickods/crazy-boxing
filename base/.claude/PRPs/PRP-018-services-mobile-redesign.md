# PRP-018: Rediseño Mobile Sección Servicios (BenefitsList)

Este PRP detalla los ajustes necesarios para optimizar la visualización móvil de la sección "Nuestros Servicios" (`BenefitsList`), basándonos en el análisis de las capturas compartidas por el usuario.

## User Review Required

> [!IMPORTANT]
> Se reducirá el número de tarjetas visibles de 4 a 3 por "slide" en móvil. Esto garantiza que el usuario pueda ver el contenido completo sin necesidad de scroll excesivo dentro de una sección fija.

> [!WARNING]
> Existe un solapamiento visual entre el header "KIA Intelligence Services" y los títulos de cada sección ("LANDING DE ALTA CONVERSIÓN", etc.). Se propone independizar el header o reducir su tamaño en móvil.

## Proposed Changes

### [Component] Landing Page Sections

---

#### [MODIFY] [BenefitsList.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/BenefitsList.tsx)
- Ajustar el `limit` en el effect de `768px` de `4` a `3`.
- Reducir el tamaño del texto "KIA Intelligence Services" en el header para ahorrar espacio vertical en dispositivos pequeños.

#### [MODIFY] [full-screen-scroll-fx.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/shared/components/ui/full-screen-scroll-fx.tsx)
- Incrementar el `padding-top` en `.fx-content` móvil para empujar los títulos hacia abajo, alejándolos del header fijo.
- Ajustar el `clamp` de `.fx-featured-title` en móvil para que el texto sea ligeramente más pequeño y no ocupe múltiples líneas de forma agresiva.
- Revisar la clase `.fx-header` en móvil para asegurar que no colisione con el área de contenido.

#### [MODIFY] [BenefitsList.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/BenefitsList.tsx#L14-L53) (FeatureCard)
- Ajustar márgenes internos y tamaños de fuente para que la descripción se sienta más aireada.

## Open Questions

- ¿Prefieres que el header "KIA Intelligence Services" desaparezca tras el primer slide en móvil para dejar más aire, o que permanezca siempre visible aunque sea más pequeño?
- Actualmente el "Dashboard CRM" tiene 6 diferenciadores. Al bajar el límite a 3, ¿se perderían los últimos 3 en móvil o prefieres que habilitemos un scroll interno? (Recomendación: mantener solo los 3 más importantes para máxima velocidad de lectura).

## Verification Plan

### Manual Verification
- Usar el `browser_subagent` para capturar screenshots en viewport móvil (390x844 - iPhone 12/13/14).
- Validar visualmente que:
  1. Solo aparezcan 3 tarjetas.
  2. Los títulos no se pisen con el header.
  3. El copy de las tarjetas sea legible y no esté "amontonado".
