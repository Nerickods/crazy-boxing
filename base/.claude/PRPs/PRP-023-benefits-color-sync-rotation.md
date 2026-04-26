# PRP-023: Benefits Card — Dashboard Color Sync & Rotation

## Objetivo
Sincronizar la paleta de colores de la sección `BenefitsList` con la identidad visual del módulo de Dashboard ("Métricas de Conversión") y realizar una rotación de colores para mantener la coherencia cromática eliminando el tono morado.

## Por Qué (Valor de Negocio)
- **Coherencia de Producto**: Al usar los mismos colores que el dashboard real, creamos una conexión subconsciente entre la promesa de la landing y el producto final.
- **Refinamiento Estético**: El usuario prefiere una transición que evite el morado (que puede sentirse fuera de lugar con el nuevo fondo Emerald) y se mantenga en la gama de Cyan/Esmeralda/Azul Profundo.
- **Psicología del Color**: Los tonos extraídos representan "Data" y "Confianza", reforzando el mensaje de los beneficios.

## Criterios de Éxito
- [ ] **Nueva Tarjeta 1**: Colores extraídos del shader de "Métricas de Conversión" (Base HSL 150, Index 2).
- [ ] **Rotación Card 1 -> Card 2**: La Tarjeta 2 hereda los colores que tenía la Tarjeta 1 anteriormente.
- [ ] **Rotación Card 2 -> Card 3**: La Tarjeta 3 hereda los colores que tenía la Tarjeta 2 anteriormente.
- [ ] **Eliminación del Morado**: El color morado actual de la Tarjeta 3 desaparece por completo.

## Mapeo de Colores Exactos
1. **Tarjeta 1 (Dashboard Custom)**:
   - `colors: ["hsl(170, 100%, 25%)", "hsl(200, 100%, 60%)", "hsl(230, 90%, 30%)", "hsl(180, 100%, 70%)"]`
   - `glow: "rgba(6, 182, 212, 0.35)"`
2. **Tarjeta 2 (Antigua 1)**:
   - `colors: ["hsl(190, 100%, 30%)", "hsl(210, 100%, 65%)", "hsl(180, 95%, 45%)", "hsl(200, 100%, 75%)"]`
   - `glow: "rgba(6, 182, 212, 0.35)"`
3. **Tarjeta 3 (Antigua 2)**:
   - `colors: ["hsl(150, 100%, 35%)", "hsl(170, 100%, 70%)", "hsl(140, 95%, 52%)", "hsl(160, 100%, 80%)"]`
   - `glow: "rgba(16, 185, 129, 0.35)"`

## Blueprint de Fases

### Fase 1: Extracción y Validación
- Confirmar los valores HSL en `ModuloDifferentiators.tsx`.

### Fase 2: Implementación en BenefitsList
- Actualizar el array `BENEFITS` con la nueva configuración de `shaderConfig` y `glow`.

### Fase 3: Verificación Visual
- Comprobar que el degradado se siente fluido al scrollear.

---

## Aprendizajes (Auto-Blindaje)
- *A completar tras la implementación*
