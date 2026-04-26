# PRP-016: BenefitsList — Apple-Style High-Impact Scroll Fill

## Objetivo
Implementar una experiencia de scroll "cinemática" donde las tarjetas de beneficios se "cargan" de color progresivamente mientras el usuario desciende, imitando el estilo de revelado de producto de Apple.

## Por Qué (Valor)
- **Engagement**: Retiene al usuario mediante una interacción reactiva al scroll.
- **Storytelling**: Guía la vista del usuario a través de los beneficios de forma secuencial (mobile) o panorámica (desktop).
- **Premium Feel**: Eleva la percepción de calidad del sitio mediante micro-animaciones coordinadas.

## Criterios de Éxito
- [ ] Las tarjetas comienzan con el fondo oscuro natural de la landing.
- [ ] Al hacer scroll, un "relleno" o "capa" de color (Cyan/Emerald/Violet) cubre la tarjeta proporcionalmente al avance.
- [ ] **Desktop**: Las 3 tarjetas se cargan al mismo tiempo mientras se recorre la sección.
- [ ] **Mobile**: Cada tarjeta se carga una por una cuando llega al centro de la pantalla.
- [ ] Transición fluida (sin saltos) y alto contraste legible.

## Comportamiento Esperado
1. El usuario llega a la sección `BenefitsList`.
2. Las tarjetas tienen su diseño base (grisáceo/oscuro).
3. Conforme el scroll baja:
   - Una máscara o gradiente de color se expande dentro de cada tarjeta (efecto "llenado").
   - Los textos y bordes ganan brillo.
4. Al salir de la sección por abajo, las tarjetas terminan 100% cargadas.

## Contexto Técnico
- **Framework**: `framer-motion` (ya integrado).
- **Componente**: `src/features/landing-page/components/BenefitsList.tsx`.
- **Estrategia**:
  - `useScroll` con `offset: ["start end", "end start"]` para Desktop (sección completa).
  - `useScroll` individual por cada `CardBenefit` con `offset: ["start center", "end center"]` para Mobile.
  - El "llenado" se hará mediante una capa absoluta con `clip-path: inset(0 0 100% 0)` que se transforma a `inset(0 0 0% 0)`.

## Blueprint de Fases

### Fase 1: Arquitectura de Doble Capa
- Modificar `CardBenefit` para tener una capa "Base" (vacía/oscura) y una capa "Active" (relleno con color).
- Implementar la detección de dispositivo (Mobile vs Desktop) para elegir la fuente del progreso.

### Fase 2: Lógica de Scroll "Fill"
- Mapear el `scrollYProgress` al `clip-path` de la capa "Active".
- Coordinar el brillo del borde y el texto con el mismo progreso.

### Fase 3: Polish y Sincronización
- Ajustar offsets para que el efecto ocurra en la "sweet spot" del viewport (donde el usuario está mirando).
- Asegurar aislamiento visual (no afectar Header/Footer).

### Fase 4: Validación
- Pruebas de suavidad en móviles.
- Validación visual pixel-perfect.

---

## Aprendizajes (Auto-Blindaje)
- *Para completar post-implementación*
