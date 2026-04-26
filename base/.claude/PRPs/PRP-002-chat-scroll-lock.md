# PRP-002: Robust Scroll Locking & Anti-Chaining (Chat UI)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence Landing

---

## Objetivo

Robustecer la lógica de bloqueo de scroll de la página de aterrizaje cuando el chatbot (tanto \`ChatDrawer\` como \`ChatWidget\`) está abierto, impidiendo específicamente el comportamiento de "scroll chaining" (propagación del gesto de desplazamiento hacia la página trasera al llegar a los límites del historial de mensajes del chat).

## Por Qué

| Problema | Solución |
|----------|----------|
| Cuando el usuario explora el historial de chat y llega al tope o fondo de la lista, el gesto en pantalla arrastra inadvertidamente la *landing page* de fondo (comportamiento de _overscroll_ nativo del navegador), quebrando la inmersión de la experiencia visual y generando distracción. | Aislar completamente el contenedor de mensajes implementando retención de overscroll y reforzando las mecánicas pasivas del lock principal de la aplicación. |

**Valor de negocio**: Evita que se pierda el foco de conversión dentro del Chatbot, proveyendo una UI "State of the Art" que se simula comportarse estrictamente nativa, especialmente ante las rigurosas físicas de deslizamiento de iOS Safari.

## Qué

### Criterios de Éxito
- [ ] Escrollear intensamente (swipe) hacia arriba o abajo en el historial de chat NO debe arrastrar la página de fondo bajo ninguna circunstancia.
- [ ] La barra de desplazamiento no debe causar comportamientos anómalos o *layout shifts* en la ventana principal.
- [ ] El scroll del historial debe mantener su suavidad.

### Comportamiento Esperado
Cuando el contenedor lateral (\`ChatDrawer\`) o el modal del \`ChatWidget\` están activos, la interactividad de deslizamiento está contenida un 100% dentro del historial de mensajes. El body se encuentra bloqueado semánticamente (vía `overflow: hidden`) y los motores de composición (CSS) interceptan la fuga de gestos gracias a las propiedades CSS \`overscroll-behavior\`.

---

## Contexto

### Referencias
- Componente \`src/features/chat/components/ChatDrawer.tsx\` - Target primario
- Componente \`src/features/chat/components/ChatWidget.tsx\` - Target secundario
- Utilidad \`src/shared/lib/scroll-lock.ts\` - Lógica global actual de bloqueo
- Documentación Tailwind: clases \`overscroll-contain\` y \`overscroll-none\`

### Arquitectura Propuesta (Ajuste Lógico)
La intercepción se realizará combinando la capacidad estructural existente con herramientas de detención nativas de CSS3 para prevenir cadenas de scroll (Scroll Chaining).

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Prevención de CSS Scroll Chaining
**Objetivo**: Implementar propiedades \`overscroll-contain\` o \`overscroll-none\` a los contenedores de los historiales de los mensajes en ambos componentes visuales (Drawer y Widget) para suprimir nativamente que los gestos se transfieran al DOM subyacente.
**Validación**: Presencia de la clase de Tailwind en los \`div\` apuntados con \`ref={scrollRef}\`.

### Fase 2: Control Pasivo en Backdrops
**Objetivo**: Prevenir que gestos accidentales en el área oscura (backdrop de desenfoque de los modales) desplacen el viewport aplicando \`touch-action: none\`.
**Validación**: Swipe vertical sobre las áreas opacas fuera del historial ya no desencadenan ninguna física de Safari/Chrome mobile.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando end-to-end sin regresiones.
**Validación**:
- [ ] \`npm run typecheck\` pasa.
- [ ] Simulador Chrome/Lighthouse Device Mode con Throttling refleja comportamiento nativo contenido.
- [ ] Criterios de éxito cumplidos en el PRP.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### [2026-04-11]: Scroll Chaining en Modales
- **Error**: El scroll-lock general (\`overflow: hidden\` en el body) no es suficiente porque la física del motor del navegador arrastra contenedores hermanos cuando el hijo agota su rango de scroll.
- **Fix**: Requerir CSS estático \`overscroll-behavior: contain\` a nivel nodo hijo.
- **Aplicar en**: Futuros modales, popovers de navegación o galerías donde el usuario haga gestos intensos dentro de microcomponentes.

---

## Gotchas

- [ ] iOS Safari a veces ignora \`overscroll-behavior\` en iframes o ciertas condiciones DOM de \`position: fixed\`, por lo que añadir \`touch-action: none\` al \`backdrop\` complementa la resistencia del layout ante swipes fallidos.
- [ ] Modificar globalmente el \`src/shared/lib/scroll-lock.ts\` puede ser redundante e invasivo. La mitigación pasiva sobre los componentes UI de chat es segura y directamente apuntada a la interfaz.

## Anti-Patrones

- NO añadir listeners extensivos en JavaScript (`e.preventDefault()` en `touchmove`) a nivel de ventana que destruyan el rendimiento a menos de que sea la medida final ante fallos CSS (mantener React libre de cálculos inútiles).

---

*PRP pendiente aprobación. No se ha modificado código.*
