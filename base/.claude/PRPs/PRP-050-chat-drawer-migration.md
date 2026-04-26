# PRP-050: Chat Drawer Migration (NavigationDrawer Pattern)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence

---

## Objetivo

Replicar el comportamiento, animaciones y estructura visual del componente `NavigationDrawer` en el Chatbot, transformando el actual pop-up flotante (`ChatWidget`) en un subpanel lateral profesional (Chat Drawer) deslizable y de altura completa.

## Por Qué

| Problema | Solución |
|----------|----------|
| El chatbot actual se comporta como un "widget" o "burbuja emergente", lo cual se siente informal y menos integrado con la estética *Apple-Style* de KIA Intelligence. | Transformarlo en un panel deslizante (Drawer) unifica la UI, ofreciendo mayor espacio vertical, mejor experiencia móvil y eliminando la sensación de "widget genérico". |

**Valor de negocio**: Refuerza el posicionamiento "Premium/Elite" (el usuario interactúa con un terminal/workstation integrado, no con una burbuja de chat flotante). Reduce fricción en móviles al integrar lock-scroll y maximizar el área de lectura.

## Qué

### Criterios de Éxito
- [ ] El Chat IA se abre deslizando desde la derecha (igual a `NavigationDrawer`).
- [ ] Cuenta con Backdrop blur de fondo oscuro idéntico (`#000/40 backdrop-blur-md`).
- [ ] En móvil ocupa el 85%-100% del ancho, en escritorio `420px`.
- [ ] Integra `lockScroll` al estar abierto para no mover el fondo de la landing page.
- [ ] La UI interior mantiene la estética (Neon Cyan/Emerald) y toda la funcionalidad actual del `ChatWidget`.
- [ ] Al dar clic en el Orbe (ya sea flotante o en el Header), dispara la apertura del nuevo Drawer en lugar del widget flotante.

### Comportamiento Esperado
1. El usuario hace clic en el Orbe Pulsante (Hero o Header).
2. Se activa el scroll-lock de la página principal.
3. Aparece un backdrop (fundido) sobre toda la pantalla interactuable para cerrar al clic.
4. El panel de chat se desliza (`x: '100%' -> 0`) desde el margen derecho con efecto `spring` de Framer Motion.
5. El chat ocupa la altura completa (`top-0 bottom-0`).
6. En la base, el input box está fijado. El área de mensajes es escroleable utilizando `custom-scrollbar`.

---

## Contexto

### Referencias
- Componente Base Existente: `src/features/landing-page/components/NavigationDrawer.tsx`.
- Componente a Refactorizar: `src/features/chat/components/ChatWidget.tsx` (que pasará a ser o ser reemplazado por `ChatDrawer.tsx`).
- Store global: `src/features/chat/store/chatStore.ts` (ya contiene `isOpen` / `setOpen`).

### Arquitectura Propuesta (Feature-First)
El chat actual utiliza `isOpen` del store para montar el `ChatWidget`. 

1. **Nuevo Componente `ChatDrawer.tsx`**:
   - Reemplazará a `ChatWidget.tsx` en el orquestador global o layout.
   - Heredará la envolvente de `NavigationDrawer` (motion divs, backdrop, z-index 60 y 70).
   - Inyectará la UI del chat (Header con título "KIA Assistant", lista de mensajes y footer input) en la estructura Flexbox.
2. **GlobalChatOrchestrator / Layout**:
   - Se debe limpiar cualquier lógica antigua relacionada con el posicionamiento estricto top-20 vs bottom-28 de la burbuja (estado `hasMorphedToHeader` se ignorará para la posición del chat en sí, ya que el Drawer siempre sale de la derecha).

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Creación del `ChatDrawer` (UI Foundation)
**Objetivo**: Crear el componente `ChatDrawer.tsx` fusionando el dom layout de `NavigationDrawer` y el chat UI de `ChatWidget`.
**Validación**: El componente compila y renderiza en pantalla simulando la estructura del Drawer.

### Fase 2: Conexión de Estado Global y Animaciones
**Objetivo**: Enlazar los estados `isOpen`, `lockScroll/unlockScroll`, `messages` y el handler de submit HTTP de la API de IA al nuevo `ChatDrawer`.
**Validación**: Al abrirse (ej: disparado desde el Store `setOpen(true)`), se frena el layout (scroll-locked), se monta por el lado derecho sin janks y envía mensajes correctamente a `/api/chat`.

### Fase 3: Transición al Nuevo Componente y Cleanup
**Objetivo**: Reemplazar la instancia antigua del `ChatWidget` flotante en el Root Layout o App por el nuevo `ChatDrawer` y eliminar lógica de reflow/reposicionamiento flotante obsoleto.
**Validación**: 
- [ ] No restan bugs residuales de transformaciones en Z.
- [ ] Orbe del Navbar abre ahora el Drawer IA deslizable de height total.
- [ ] `npm run typecheck` y `npm run build` exitosos.
- [ ] UI visualmente pixel perfect a lo planteado.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Se documentarán gotchas específicos durante la implementación. (Ej. iOS Keyboard pushing content on 100vh drawers).

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] **Teclado en Mobile (100vh):** Cuando el teclado se abre en iOS/Android, el viewport height `100vh` falla y corta el panel o lo sube de más si usamos absolute bottom. Necesitamos usar height dinámico (DVH) o el input flex de fondo para asegurar que es visualizable siempre.
- [ ] **Framer Motion + Layout shifts:** En móviles, evite repaints de ancho real. Usar `transform: translate3d` siempre en las animaciones de panel.
- [ ] **Scroll Lock conflictivo:** Revisar que el Scroll-Lock de este Drawer no conflicto si se invoca con el NavigationDrawer abierto en paralelos. (Generalmente se asume uno a la vez).

## Anti-Patrones

- NO usar un Wrapper distinto (Ej: Headless UI o Radix Dialog). Mantener sincronía de Framer Motion del Drawer para reutilizar componentes y pesos de librerías.
- NO duplicar llamadas a la API o lógica de hooks de Chat; abstraer o trasladar lo que ya existe íntegro.
- NO cambiar el branding, persistir con colores Accent Cyan y glassmorphism en el Drawer.

---

*PRP pendiente aprobación. No se ha modificado código.*
