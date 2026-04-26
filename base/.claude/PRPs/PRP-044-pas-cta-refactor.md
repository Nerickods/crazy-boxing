# PRP-044: Refactorización CTA PasSection (Copy + Chatbot Fix)

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-05
> **Proyecto**: KIA Intelligence

---

## Objetivo

Actualizar la narrativa final de la `PasSection` con el nuevo copy de autoridad proporcionado por el usuario y reemplazar el botón genérico de contacto por una integración directa con el chatbot, utilizando el componente de marca `PulsingOrb` como disparador visual de alta fidelidad.

## Por Qué

| Problema | Solución |
|----------|----------|
| El copy actual era genérico y no conectaba con la propuesta de valor basada en "demostración con el ejemplo". | Actualizar el copy a una narrativa de autoridad directa y friccionar menos el contacto vinculándolo inmediatamente con "Hablar con el sistema". |
| El botón de CTA usaba una lógica de scroll hacky para buscar el widget flotante. | Integrar el disparador del chatbot directamente en el componente usando el `useChatStore`, ofreciendo una interacción integrada y moderna. |

**Valor de negocio**: Mejora la conversión directa mediante un asistente de IA (dogfooding de nuestro propio servicio).

## Qué

### Criterios de Éxito
- [ ] El título principal es: `Tu puente directo a la IA`.
- [ ] El cuerpo del texto sigue exactamente el copy solicitado ("¿Cansado de agencias...?").
- [ ] El botón genérico es reemplazado por un bloque interactivo que incluye el `PulsingOrb`.
- [ ] El clic en cualquier parte del nuevo CTA abre el chatbot instantáneamente vía `useChatStore`.
- [ ] Se mantiene el responsive y la sincronización de ascenso implementada en el PRP-043.

### Comportamiento Esperado
Al llegar al CTA final:
1. El usuario ve el nuevo mensaje de autoridad.
2. Debajo, aparece un disparador visual (Orb pulsante con texto rotativo) junto a un botón estilizado.
3. Al hacer clic (en el icono o el botón), el chatbot se abre para iniciar la conversación.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Destino de los cambios.
- `src/features/landing-page/components/PulsingOrb.tsx` - Componente visual a integrar.
- `src/features/chat/store/chatStore.ts` - Manejo de estado del chatbot (`setOpen`).

### Arquitectura Propuesta
Modificaciones en `PasSection.tsx`:
- Importar `PulsingOrb` y `useChatStore`.
- Actualizar el contenido de `h2` y `p`.
- Cambiar la lógica del `button` y su estilo.

---

## Blueprint (Assembly Line)

### Fase 1: Actualización de Copy
**Objetivo**: Cambiar el texto estático dentro del componente.
**Validación**: Revisión visual del código.

### Fase 2: Integración de Chatbot Trigger
**Objetivo**: Reemplazar la lógica de `window.scrollTo` por el dispatcher de `useChatStore`. Integrar `PulsingOrb` en la UI del CTA.
**Validación**: El clic debe llamar a `setOpen(true)`.

### Fase 3: Pulido Visual
**Objetivo**: Asegurar que el Orb y el botón estén alineados y sigan la estética de la landing (vidrio, brillos cyan).
**Validación**:
- [ ] `npm run typecheck` pasa.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### [2026-04-05]: Inicialización del PRP-044
- Planificación de refactorización de copy y chatbot trigger.

---

## Gotchas

- **Z-Index**: El `PulsingOrb` tiene sus propios estilos de posicionamiento; debe ser forzado a una posición relativa/estática dentro del flujo del CTA.
- **Scroll Hijacking**: No queremos que el scroll se interrumpa, solo que el botón abra el overlay del chat.

---

*PRP completado y verificado con typecheck.*
