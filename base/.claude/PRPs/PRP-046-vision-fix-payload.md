# PRP-046: Fix Vision Implementation and Payload Sync

Este PRP aplica el **Protocolo Bucle Agéntico** para resolver el fallo de comunicación donde el asistente no "ve" las imágenes a pesar de estar adjuntas en la UI.

## Fases del Bucle Agéntico

### Fase 1: Mapeo de Mensajería y Payload (DEBUG)
**Objetivo**: Identificar si las imágenes se pierden en el Hook del SDK o en la recepción del Backend.

- **Actividad 1.1**: Inyectar logs detallados en `useChatStream.ts` para ver qué está recibiendo `sdkSendMessage`.
- **Actividad 1.2**: Inyectar logs en `src/app/api/chat/route.ts` para ver el objeto `messages` tal cual llega de la red.
- **Resultado esperado**: Saber si el array `experimental_attachments` existe en el request body.

### Fase 2: Corrección del Pipeline de Envío
**Objetivo**: Asegurar que los adjuntos viajen en el formato que el SDK espera.

- **Opción A (Si los logs muestran vacío)**: Revertir al patrón original de `files` en lugar de `experimental_attachments` (posible firma personalizada del SDK en este proyecto).
- **Opción B (Si los logs muestran Blob URLs pero el backend no los procesa)**: Reconvertir a Base64 pero asegurando que se inyecte correctamente en el objeto `Message` antes de que el streaming comience.

### Fase 3: Estabilización de la UI y Feedback Visual
**Objetivo**: Que el usuario vea la imagen en la burbuja una vez enviada.

- **Actividad 3.1**: Debuggear el componente `ChatDrawer.tsx` para confirmar si `m.experimental_attachments` persiste en el historial después del envío.

---

## User Review Required

> [!IMPORTANT]
> Sospecho que el SDK (`ai` v6.0.x) en este proyecto tiene una implementación de `sendMessage` que NO mapea automáticamente `experimental_attachments` a menos que se use el nombre de campo específico que usaba el código original (`files`). 

> [!WARNING]
> La Phase 1 requerirá que envíes un archivo de nuevo para que los logs se generen en tu servidor y yo pueda "mapear el contexto real".

## Plan de Verificación

1. **Logs de Frontend**: Verificar en consola del navegador la estructura del payload.
2. **Logs de Backend**: Verificar en la terminal del servidor el JSON de entrada.
3. **Prueba End-to-End**: Enviar captura de pantalla y recibir análisis técnico de KIA Intelligence.
