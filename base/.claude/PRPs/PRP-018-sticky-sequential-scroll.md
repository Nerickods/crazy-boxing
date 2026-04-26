# PRP-018.2: Cinematic Layered Transitions (The "Paint-Over" Effect)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-27
> **Proyecto**: KIA Intelligence

---

## Objetivo

Eliminar el "salto brusco" (swap) entre beneficios y reemplazarlo por una transición por capas donde el nuevo beneficio se "pinta" gradualmente sobre el anterior dentro de la misma tarjeta física.

## Por Qué

| Problema | Solución |
|----------|----------|
| `AnimatePresence` provoca un desvanecimiento instantáneo del contenido anterior, dejando un vacío visual mientras el nuevo se llena. | Mantener el beneficio anterior como "Fondo" (capa base) y pintar el nuevo beneficio como "Frente" (capa activa). |
| La primera tarjeta no se sincroniza con su llegada al centro. | Ajustar los offsets de scroll para que el llenado inicial coincida con el centrado del sticky. |

---

## Qué (Specs Técnicas)

### 1. Sistema de Doble Capa en `CardBenefit`
Modificaremos el componente para renderizar dos instancias de contenido:
- **Base Layer (z-10)**: Muestra `BENEFITS[previousIndex]` completamente lleno (`inset 0%`).
- **Active Layer (z-20)**: Muestra `BENEFITS[activeIndex]` con el `clipPath` animado (`inset 100% -> 0%`).

### 2. Gestión de Estados Persistentes
Usaremos un `useEffect` en `BenefitsList` o `CardBenefit` para capturar el `previousIndex` antes del cambio oficial, asegurando que siempre haya contenido bajo la capa que se está pintando.

### 3. Sincronización de Contenido
- El texto de la **Base Layer** se quedará estático.
- El texto de la **Active Layer** entrará con su animación habitual.
- Al final de la carga (100%), lo que era la **Active Layer** pasa a ser la nueva **Base Layer** para el siguiente tramo.

---

## Blueprint (Assembly Line)

### Fase 1: Refactor de Estructura de Capas
**Objetivo**: Permitir que `CardBenefit` acepte un `previousBenefit` opcional.
**Validación**: Ver dos sháders encimados (uno recortado, uno lleno).

### Fase 2: Lógica de Persistencia de "Fondo"
**Objetivo**: En `BenefitsList`, mantener el rastro del beneficio anterior.

### Fase 3: Calibración de Entrada Initial
**Objetivo**: Ajustar el primer tramo (0-0.33) para que la tarjeta empiece a cargarse antes de llegar al centro absoluto.

---

## Gotchas
- El performance: Cargar dos Shaders `Warp` simultáneamente puede ser pesado. Hay que optimizar el renderizado condicional.
- Animación de salida: No necesitaremos `exit` en `AnimatePresence` para la capa base, solo para la activa si fuera necesario.
