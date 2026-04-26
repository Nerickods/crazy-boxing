# PRP-029: GSAP-BenefitsList Critical Bugfixes

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-30
> **Proyecto**: KIA Intelligence

---

## Objetivo

Corregir dos errores críticos de experiencia de usuario y lógica en la sección `BenefitsList`:
1.  **Eliminar el bloque "fin"**: Un espacio de `100vh` innecesario al final del componente.
2.  **Restaurar contenido en secciones 2 y 3**: Corregir la captura de referencias de palabras y descripciones que actualmente fallan para los índices superiores a 0.

## Por Qué

| Problema | Solución |
|----------|----------|
| Bloque "fin" rompe la fluidez visual de la landing page. | Eliminar el nodo `.fx-end` y ajustar la altura del contenedor principal para que termine exactamente al finalizar la última sección de scroll. |
| Contenido invisible en secciones 2 y 3. | Refactorizar la lógica de `WordsCollector` y el manejo de `tempWordBucket` para evitar colisiones de renderizado y asegurar que cada sección pueble sus `wordRefs` de forma independiente y determinista. |

---

## Contexto

### Síntomas Detectados
- Al llegar al final de las 3 secciones de beneficios, aparece una pantalla negra con el texto "fin".
- Al cambiar a la sección "Agente IA" o "Dashboard", el título y la descripción no aparecen o no se animan.

### Causa Raíz Probable
- **Race Condition**: `WordsCollector` utiliza un ref compartido (`tempWordBucket`) que se limpia indiscriminadamente en el map. Si el renderizado de múltiples secciones ocurre en lotes, la limpieza de uno puede ocurrir antes de que el anterior sea capturado.
- **Structural Debt**: `.fx-end` fue dejado como un placeholder durante el desarrollo inicial del componente genérico.

---

## Blueprint (Bucle Agéntico)

### FASE 1: Diagnóstico de Refs
**Objetivo**: Confirmar que los arrays de `wordRefs.current` están vacíos para los índices 1 y 2.
**Acción**: Mapear el estado de los refs durante el montaje.

### FASE 2: Refactor de Captura de Contenido
**Objetivo**: Implementar un sistema de captura de refs por sección sin depender de un bucket temporal compartido.
**Acción**: Usar una técnica de `ref callback` directa o un `useEffect` local por sección si es necesario.

### FASE 3: Limpieza de Layout (Eliminar "Fin")
**Objetivo**: Eliminar el div `.fx-end` y recalcular el padding/height del ScrollTrigger para que el snap sea perfecto.
**Acción**: Eliminar `.fx-end` y ajustar `fx-fixed-section`'s height.

### FASE 4: Validación Final
- [ ] Título y descripción visibles en las 3 secciones.
- [ ] Scroll fluye directo al Footer sin el bloque "fin".
- [ ] No hay errores de tipo en la compilación.

---

## Gotchas
- [ ] Asegurarse de que `gsap.delayedCall` y las animaciones de salida no intenten acceder a refs nulos.
- [ ] El `Refresh` de ScrollTrigger debe ocurrir después de eliminar el bloque para recalcular el final de la zona de pin.

---

*PRP pendiente aprobación por Nerick Segoviano (Bucle Agéntico activado).*
