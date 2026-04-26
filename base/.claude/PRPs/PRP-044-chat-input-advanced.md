# PRP-044: Advanced Chat Input with Attachments

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-15
> **Proyecto**: KIA Intelligence

---

## Objetivo

Actualizar la interfaz de entrada del chat assistant a un sistema avanzado de "Prompt Input" que soporte entrada multi-línea auto-ajustable, estados de carga visuales y la capacidad de adjuntar archivos para interacciones multi-modales.

## Por Qué

| Problema | Solución |
|----------|----------|
| El input actual es de una sola línea, limitando prompts complejos. | Textarea con auto-size que se expande según el contenido. |
| No hay soporte visual para adjuntar archivos/imágenes. | Sistema de adjuntos con previsualización y eliminación. |
| La retroalimentación de "procesamiento" es externa al input. | Integración de botones de acción con estados `isLoading` y Tooltips. |

**Valor de negocio**: Mejora drástica en la UX del asistente de élite, permitiendo a los usuarios enviar capturas de sus procesos o documentos para auditorías técnicas rápidas, aumentando el valor percibido del servicio.

## Qué

### Criterios de Éxito
- [ ] Renderizado del componente `PromptInput` en el Footer del `ChatWidget`.
- [ ] Textarea que aumenta su altura automáticamente hasta un máximo de 240px.
- [ ] Funcionalidad de adjuntar archivos (UI local) operativa.
- [ ] Los tooltips se muestran correctamente en los botones de acción.
- [ ] El envío de mensajes (Enter o Click) limpia el estado local (texto y archivos).

### Comportamiento Esperado
1. El usuario abre el asistente KIA.
2. Escribe una consulta extensa; el input se expande suavemente.
3. Hace clic en el icono de clip, selecciona un archivo; se muestra una "píldora" con el nombre del archivo sobre el input.
4. Presiona Enter; se inicia el procesamiento neuronal (botón cambia a stop square), el input se limpia y los archivos se "envían".

---

## Contexto

### Referencias
- `src/features/chat/components/ChatWidget.tsx` - Ubicación actual del formulario de chat.
- `src/features/chat/hooks/useChatStream.ts` - Hook que maneja el envío a Vercel AI SDK.
- [Vercel AI SDK Attachments](https://sdk.vercel.ai/docs/foundations/attachments) - Referencia para envío multi-modal.

### Arquitectura Propuesta (SaaS Factory Standard)
```
src/
├── components/ui/             # Componentes base (shadcn)
│   ├── prompt-input.tsx      # [NUEVO]
│   ├── textarea.tsx          # [NUEVO]
│   └── tooltip.tsx           # [NUEVO]
└── features/chat/
    └── components/
        └── ChatWidget.tsx    # [MODIFICAR] - Integración
```

---

## Blueprint (Assembly Line)

### Fase 1: Infraestructura de Componentes
**Objetivo**: Instalar dependencias y registrar los componentes base de UI en el sistema.
**Validación**: Presencia de `textarea.tsx`, `tooltip.tsx`, `button.tsx` y `prompt-input.tsx` en `src/components/ui`.

### Fase 2: Integración en ChatWidget
**Objetivo**: Reemplazar el `form` nativo por el nuevo `PromptInput` y manejar el estado de archivos.
**Validación**: Visualización correcta del nuevo input en la landing page mediante Playwright screenshot.

### Fase 3: Conectividad Multi-modal (Contexto Requerido)
**Objetivo**: Asegurar que los archivos se envíen al backend a través de `useChatStream`.
**Validación**: El log del backend muestra la recepción de `experimental_attachments`.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-15]: Preparación del Sistema
- **Error**: N/A (Fase de planificación)
- **Fix**: N/A
- **Aplicar en**: N/A

---

## Gotchas
- [ ] `TooltipProvider` debe estar presente (ya incluido en el componente `PromptInput`).
- [ ] El scroll del `ChatWidget` debe ajustarse cuando el input crece de tamaño.

## Anti-Patrones
- NO usar `input` nativo si la lógica de negocio requiere descripciones detalladas.
- NO omitir el estado de deshabilitado mientras la IA está respondiendo (`isLoading`).

---

*PRP pendiente aprobación. No se ha modificado código.*
