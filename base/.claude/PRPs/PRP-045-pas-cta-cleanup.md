# PRP-045: Despeje de CTA y Ajuste de Widget (Clean-Up)

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-05
> **Proyecto**: KIA Intelligence

---

## Objetivo

Despejar visualmente la sección final de `PasSection` eliminando elementos redundantes, corrigiendo el solapamiento entre el logo y el título, y ajustando las dimensiones del orbe y del widget de chat para una experiencia premium en dispositivos móviles.

## Por Qué

| Problema | Solución |
|----------|----------|
| El CTA está "amontonado": el botón inferior compite con el Orbe pulsante. | Eliminar el botón secundario y dejar el Orbe como único disparador de alta fidelidad. |
| Solapamiento visual: El logo KIA Intelligence queda detrás del título "TU PUENTE DIRECTO...". | Ajustar los keyframes de scroll para que el logo suba más alto y más rápido antes de que el título sea 100% visible. |
| El Orbe es demasiado grande en mobile (`size={100}`). | Hacer el tamaño del Orbe responsivo (`size={70}` en mobile, `{110}` en desktop). |
| El widget de chat ocupa demasiado espacio vertical en relación a su contenido inicial. | Refinar las dimensiones del `ChatWidget` en mobile. |

**Valor de negocio**: Mejora drástica en la estética móvil y la claridad del mensaje de conversión.

## Qué

### Criterios de Éxito
- [ ] Botón "Hablar con el sistema" eliminado de `PasSection.tsx`.
- [ ] Orbe pulsante responsivo (más pequeño en mobile).
- [ ] No hay solapamiento entre el logo de marca ascendente y el título del CTA.
- [ ] El `ChatWidget` tiene dimensiones más equilibradas en móviles.
- [ ] El sistema sigue funcionando con `setOpen(true)` desde el Orbe.

### Comportamiento Esperado
Al llegar al final del scroll:
1. El logo sube rápidamente a la cabecera (y: -300px o similar).
2. El título aparece con limpieza absoluta, sin elementos detrás.
3. El Orbe aparece con un tamaño equilibrado en móvil.
4. Al abrir el chat, la ventana tiene un tamaño optimizado.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx`
- `src/features/chat/components/ChatWidget.tsx`
- La imagen compartida por el usuario (overlapping + clutter).

---

## Blueprint (Assembly Line)

### Fase 1: Limpieza de PasSection
**Objetivo**: Eliminar el botón redundante y ajustar el tamaño del Orbe.
**Validación**: Revisión de código.

### Fase 2: Corrección de Solapamiento (Timing)
**Objetivo**: Ajustar `y` y `opacity` de `LogoBrandFlow` y del CTA container para que no coexistan en el mismo espacio Z/Y de forma desordenada.
**Validación**: Análisis de rangos de scroll (0.88 -> 0.96).

### Fase 3: Ajuste de Dimensiones del Widget
**Objetivo**: Modificar las clases de ancho/alto en `ChatWidget.tsx` para mobile.
**Validación**:
- [ ] `npm run typecheck` pasa.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### [2026-04-05]: Inicialización del PRP-045
- Planificación de limpieza visual de CTA y ajuste de widget.

---

## Gotchas

- **Logo Final Position**: Si subimos demasiado el logo (`y: -400`), podría salirse de la zona sticky. Debemos validar el límite superior.
- **Orb Text**: Si el Orbe es muy pequeño, el texto rotativo (`KIA INTELLIGENCE...`) podría volverse ilegible. El límite inferior debería ser `size={70}`.

---

*PRP completado y verificado con typecheck.*
