# PRP-013: Pulsing Experience Color Harmonization

Sustituir los tonos naranja del círculo pulsante (`PulsingBorder`) por la paleta de verdes azulados (Teal/Emerald) utilizada en el resto del Hero para lograr una cohesión visual total.

## 🎯 Objetivo
Eliminar la discordancia visual del color naranja en el componente fijo de la interfaz y unificarlo con el diseño "SaaS de Élite" basado en cianes y esmeraldas.

## 🏗️ Cambios Propuestos

### 1. PulsingExperience Component
- **Archivo**: `src/features/landing-page/components/PulsingExperience.tsx`
- **Cambio**: 
    - Eliminar `#f97316`, `#FFD700` y `#FF6B35` de la lista de colores en el componente `PulsingBorder`.
    - Añadir los colores del Golden Path: `#00f2ff`, `#06b6d4`, `#10b981`, `#34d399`.
    - Ajustar la `intensity` o `speed` si es necesario para mantener el dinamismo sin el naranja.

## 🧪 Plan de Verificación
- **Visual**: Confirmar que el círculo pulsante ahora vibra en tonos cian/esmeralda, complementando el fondo de shaders.
- **Cohesión**: Verificar que no queden rastros de naranja en el elemento fijo al navegar por la página.

---
*Propuesto por el Agente SaaS Factory para armonización visual.*
