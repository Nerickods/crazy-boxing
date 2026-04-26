# PRP: Experiencia Storytelling "Story Scroll" para PAS y Ecosistema

> **Estado**: PENDIENTE DE APROBACIÓN
> **Fecha**: 2026-03-21

---

## 🎯 Objetivo

Implementar una experiencia inmersiva "Story Scroll" inspirada en navegaciones cinemáticas (tipo Morningside.ai) **únicamente en las dos primeras secciones después del Hero**: `PasSection.tsx` y `BentoEcosystem.tsx`. El contenido (textos, tarjetas) se reorganizará y animará basándose en la posición exacta del scroll, guiando al usuario secuencialmente por los puntos de dolor y la solución. **El Hero se mantendrá intacto.**

## 💡 Por Qué

| Problema | Solución |
|----------|----------|
| El formato estático permite que el usuario haga scroll rápido (skim) y se pierda el mensaje crítico (los puntos de dolor y el valor de la solución). | Un scroll narrativo (sticky scroll) atrapa al usuario suavemente, obligándolo a consumir el pitch de ventas (Missing Leads -> Black Box -> Tech Mutation) en el ritmo correcto. |

**Valor de negocio**: Aumentar el "Time on Site" y asegurar la comprensión de la propuesta de valor, lo que impacta directamente en una mayor tasa de conversión. Destacar los títulos y dolores aumenta la resonancia emocional.

## ✅ Criterios de Éxito

- [ ] `HeroSection.tsx` permanece 100% sin modificaciones.
- [ ] `PasSection.tsx` y `BentoEcosystem.tsx` utilizan contenedores con altura extendida (ej. `h-[400vh]`) y elementos `sticky h-screen` para retener la vista.
- [ ] Los títulos se destacan visualmente durante la transición.
- [ ] El contenido (texto y tarjetas de dolor/solución) entra, se mantiene visible y sale de forma fluida y matemática basada en el `scrollYProgress`.
- [ ] La experiencia es fluida (60fps) usando `framer-motion` (`useScroll`, `useTransform` con transformaciones CSS de GPU).
- [ ] El diseño sigue viéndose Premium y funciona correctamente en dispositivos móviles (evitando solapamientos o elementos fuera de pantalla).

## 🎭 Comportamiento Esperado

1. El usuario hace scroll y pasa el Hero.
2. La sección PAS hace "snap" (se vuelve sticky). El fondo/contexto se estabiliza.
3. El título destacado ("Tu negocio factura, pero tu tiempo se agota...") aparece.
4. Al hacer scroll hacia abajo, entra progresivamente la Tarjeta 1 (Problema: Missing Leads) y se posiciona en pantalla.
5. Más scroll -> La Tarjeta 1 se desvanece/desplaza y entra la Tarjeta 2 (Agitación: Black Box).
6. Más scroll -> La Tarjeta 2 se desvanece y entra la Tarjeta 3 (Solución: Tech Mutation).
7. Fin de la sección PAS. El sticky se libera suavemente.
8. La sección del Ecosistema entra, también como una vista pegajosa, y el grid de módulos se revela de forma escalonada (estilo cascada dinámica) a medida que el usuario scrollea.
9. Se reanuda el scroll normal para el resto de la página.

## 🏗️ Contexto y Arquitectura

- **Archivos Core Modificados**: 
  - `src/features/landing-page/components/PasSection.tsx`
  - `src/features/landing-page/components/BentoEcosystem.tsx`
- **Herramientas Core**: `framer-motion` (react hooks de navegación).
- No se introducen nuevas librerías. Se trabajará manipulando `opacity`, `y` (translateY), y `scale`.

---

## 🗺️ Blueprint (Assembly Line)

### Fase 1: Arquitectura Base Sticky en PAS
Aislar el contenedor de `PasSection`. Convertir la sección en un contenedor de altura extendida (e.g., `h-[400vh]`) con un hijo `sticky top-0 h-screen overflow-hidden`. Preparar el hook `useScroll` acoplado al ref del contenedor.

### Fase 2: Coreografía Matemática PAS
Mapear los rangos numéricos de `useTransform` (ej. `[0, 0.2]`, `[0.3, 0.5]`, etc.) para animar consecutivamente:
1. El Título principal (Entrada y Salida).
2. Tarjeta 1: Missing Leads.
3. Tarjeta 2: Black Box.
4. Tarjeta 3: Tech Mutation.
Asegurar que no haya solapamiento indeseado entre tarjetas.

### Fase 3: Arquitectura y Scroll Reveal en Ecosistema
Aplicar un modelo similar (o de cascada progresiva) a `BentoEcosystem.tsx`. Hacer que el grid ("The Invisible Stack") se revele reaccionando a la posición del scroll, destacando el titular inicial y luego haciendo aparecer cada carta.

### Fase 4: Optimización Responsiva y Pulido
Ajustar los tamaños y rangos de animación en CSS/Tailwind para móviles (`md:`, `lg:`). Revisar rendimiento (añadir `will-change: transform, opacity`) y probar la transición exacta al soltar la sección Hero.

---

## 🧠 Aprendizajes (Auto-Blindaje)
*(Se completará durante la ejecución si hay fallos matemáticos o visuales).*

## ⚠️ Gotchas
- El cálculo de `useTransform` debe dejar márgenes de seguridad para que la asimilación del texto sea cómoda (hold time).
- En móvil, un offset en Y muy grande puede empujar contenido fuera del DOM visible. Modularemos desplazamientos cortos o desvanecimientos.

## 🚫 Anti-Patrones
- No forzar la barra de desplazamiento del SO (no `overflow: hidden` en el body global).
- No utilizar timeouts `setTimeout`; TODO debe ser completamente síncrono y dependiente de `scrollYProgress`.
