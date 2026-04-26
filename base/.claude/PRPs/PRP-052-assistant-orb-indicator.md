# PRP-052: Indicador Neuronal (Orb) en el Último Mensaje

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence

---

## Objetivo

Implementar el círculo de colores rotatorio (`PulsingOrb` sin texto paramétrico) de manera creativa en el `ChatDrawer`, posicionándolo exclusivamente como avatar dinámico en el **último mensaje emitido por el asistente**. 

## Por Qué

| Problema | Solución |
|----------|----------|
| Las interacciones del chat pueden percibirse frías, perdiendo el anclaje de "inteligencia activa". | Incorporar el `PulsingOrb` vivo de forma que "salte" al último mensaje, estableciendo una conexión visual que da un "latido" al sistema en tiempo real. |

**Valor de negocio**: Refuerza The Invisible Stack. El usuario siente que realmente tiene algo neuronal operando del otro lado y no un simple formulario disfrazado.

## Qué

### Criterios de Éxito
- [ ] El `PulsingOrb` (`size={28}`, `showText={false}`) se renderiza a la izquierda de la burbuja del último mensaje donde `role === 'assistant'`.
- [ ] Ocultar o colapsar el Orbe en los mensajes antiguos (o poner un ícono sutil) para que la interfaz se mantenga minimalista.
- [ ] Flujo impecable en responsive (no desborda el input o la caja).
- [ ] Si `isLoading` es true e inyectamos el loader state, el Orbe también o puede en su lugar vibrar junto al "Neural Processing".

### Comportamiento Esperado
1. Abre el panel → Sale mensaje de "Qué tal, caballero?". A la izquierda de la burbuja, palpita el `PulsingOrb`.
2. El usuario contesta.
3. El Asistente contesta. El Orbe se dibuja *solamente* en el nuevo mensaje de respuesta, como una presencia viva que sigue "la punta" del flujo conversacional.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PulsingOrb.tsx` - El componente de *shaders* activo.
- `src/features/chat/components/ChatDrawer.tsx` - Donde se mapea el `messages.map()`.

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Extracción Lógica & Import
**Objetivo**: Conectar el SDK del orb al `ChatDrawer`. Identificar cuál de todos los items en `messages` es el último del rol *assistant*.
**Validación**: Variables calculadas correctamente y component `import` sin fallas.

### Fase 2: Rediseño del Message Bubble Layout
**Objetivo**: Crear espacio para que el Orb viva a un lado de la burbuja y ajustar Tailwind flex layouts (`gap`, alineación).
**Validación**: Animaciones de spring se combinan bien con layout de avatars.

### Fase N: Validación Final
**Objetivo**: Sistema funcionando end-to-end con alta fidelidad gráfica.
**Validación**:
- [ ] Preview manual en la estructura del drawer.
- [ ] El scroll no brinca cuando el orb se añade.

---

## Gotchas

- [ ] Cargar Shaders dentro del Flexbox puede necesitar `shrink-0` para no destrozar el ancho relativo con Tailwind.

*PRP pendiente aprobación. No se ha modificado código.*
