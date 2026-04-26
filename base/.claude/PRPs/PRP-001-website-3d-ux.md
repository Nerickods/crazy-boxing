# PRP-001: Mejora de UI/UX Scroll-Fade (Sin Video)

## 1. El Problema / Oportunidad
El usuario desea incorporar un efecto inmersivo en las dos primeras secciones después del Hero (`PasSection` y `BentoEcosystem`). Se busca replicar la calidad cinemática del skill `website-3d` (donde el contenido se mueve y desvanece al scrollear hacia la parte superior) pero adaptado a secciones basadas puramente en UI sin video de fondo.

## 2. La Solución Técnica (Blueprint)
En lugar de extraer frames de video y dibujarlos en un canvas, usaremos animaciones aceleradas por GPU directamente sobre el DOM mediante `framer-motion`.

### 2.1 Hooks Core
- `useScroll`: Rastreará la posición del scroll relativo a cada sección.
  - `target`: Referencia a la sección.
  - `offset`: `["start start", "end start"]` (La animación inicia cuando el top del contenedor toca el top de la pantalla, y termina cuando el bottom del contenedor toca el top de la pantalla).
- `useTransform`: Mapeará el progreso (0 a 1) a valores de CSS.
  - `opacity`: `[1, 0]` para desvanecer el contenido.
  - `y`: `["0%", "50px"]` o similar para un sutil parallax descendente.

### 2.2 Fases de la Implementación
**Fase 1: Preparación del Entorno**
- Mapeado del estado actual de los componentes (Ya completado: leídos `PasSection.tsx` y `BentoEcosystem.tsx`).

**Fase 2: Implementación en PasSection**
- Convertir a Client Component.
- Añadir ref y envolver contenido en `motion.div`.

**Fase 3: Implementación en BentoEcosystem**
- Reutilizar lógica de scroll, asegurando que los tooltips y transformaciones hover sigan funcionando.

## 3. Aprendizajes
- **Ejecución Limpia (Framer Motion)**: La implementación mediante `framer-motion` (`useScroll` y `useTransform`) se integró exitosamente combinada con `"use client"` sin afectar el tipado estricto del proyecto (`npm run typecheck` con 0 errores). Esto confirma que el patrón Scroll-Fade con GPU-acceleration y offsets ("start start", "end start") es altamente confiable y aplicable como drop-in en componentes existentes.
