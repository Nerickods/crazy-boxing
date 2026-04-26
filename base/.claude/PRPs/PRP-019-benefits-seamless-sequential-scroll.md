# PRP-019: BenefitsList — Seamless Sequential Scroll Logic

## Objetivo
Implementar una lógica de scroll "sin costuras" (seamless) donde las tarjetas de beneficios se carguen de forma estrictamente secuencial y continua. El objetivo es que la carga de una tarjeta empiece exactamente en el punto donde la anterior termina, eliminando cualquier "tiempo muerto" o "plateau" visual durante el desplazamiento.

## Por Qué (Valor de Negocio)
- **Fluidez Cinemática**: Mejora la experiencia de usuario imitando la precisión de los sitios de producto de Apple.
- **Feedback Visual Directo**: El usuario siente que tiene control total sobre el avance del contenido; cada píxel de scroll se traduce en avance de animación.
- **Engagement Ininterrumpido**: Mantiene al usuario enganchado en el flujo narrativo sin distracciones por pausas innecesarias.

## Criterios de Éxito
- [ ] **Carga Continua**: El 100% del rango de la sección (`sectionProgress` 0 a 1) está mapeado a cambios visuales.
- [ ] **Sincronización Perfecta**: La tarjeta `N+1` comienza su animación de `fillLevel` exactamente cuando la tarjeta `N` alcanza el 100%.
- [ ] **Transición Progresiva**: El `glowOpacity` y el `mask` (clip-path) operan en el mismo rango de tiempo para evitar inconsistencias visuales.
- [ ] **Mobile & Desktop**: La lógica debe ser robusta para ambas vistas (ajustando solo los rangos si es necesario).

## Comportamiento Esperado (Happy Path)
1. El usuario entra en la sección "Resultados Tangibles".
2. **Scroll 0% - 33.3%**: La Tarjeta 1 se llena progresivamente de 0% a 100%.
3. **Scroll 33.3% - 66.6%**: La Tarjeta 2 se llena de 0% a 100%.
4. **Scroll 66.6% - 100%**: La Tarjeta 3 se llena de 0% a 100%.

## Contexto Técnico
- **Archivo**: `src/features/landing-page/components/BenefitsList.tsx`
- **Variable Clave**: `sectionProgress` (proviene del `useScroll` del contenedor padre `sectionRef`).
- **Lógica de Mapeo**:
  ```typescript
  // Para 3 beneficios
  const duration = 1 / 3; // 0.333
  const fillStart = index * duration;
  const fillEnd = (index + 1) * duration;
  ```

## Blueprint de Fases

### Fase 1: Recalibración Matemática de Rangos
- Eliminar los offsets manuales y el "buffer" entre tarjetas.
- Implementar el cálculo dinámico basado en el número de beneficios.

### Fase 2: Sincronización de Efectos Atmosféricos
- Ajustar `glowOpacity` para que siga el mismo `fillStart`/`fillEnd`.
- Asegurar que el `zIndex` no cause problemas de oclusión durante el solapamiento de rangos (aunque sean contiguos).

### Fase 3: Validación Visual y Ajuste de Curva
- Probar la fluidez con `framer-motion`.
- Si el avance lineal se siente muy "mecánico", implementar una curva suave (easing) dentro de cada tramo sin romper la continuidad.

---

## Aprendizajes (Auto-Blindaje)
- *A completar tras la implementación*
