# PRP-001: Reestructuración del Header e Integración del Chatbot UI

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-25
> **Proyecto**: crazy

---

## Objetivo

Replicar de forma exacta la UI/UX del header y el módulo de chatbot desde el proyecto `landing-linkedin` hacia `crazy`. Esto incluye refactorizar el header hacia un "Tripartite Layout" (botón del chatbot a la izquierda, logo centrado, menú hamburguesa a la derecha) y migrar toda la lógica del chatbot y sus animaciones (PulsingOrb).

## Por Qué

| Problema | Solución |
|----------|----------|
| El header actual del proyecto `crazy` tiene una navegación tradicional que sobrecarga la vista (especialmente en móvil) y carece de un canal conversacional inmediato. | Adoptar el estándar visual de `landing-linkedin`, ocultando la navegación en un cajón (Navigation Drawer) y exponiendo permanentemente el asistente inteligente en la esquina superior izquierda. |

**Valor de negocio**: Se incrementa la retención y la conversión al proveer a los visitantes de un agente interactivo 24/7 de forma inmersiva, a la vez que se estandariza el diseño premium en todo el ecosistema de la marca.

## Qué

### Criterios de Éxito
- [ ] La carpeta `src/features/chat` (incluyendo components, hooks, services, store, types) ha sido migrada desde `landing-linkedin` a `crazy`.
- [ ] El componente `Header.tsx` en `crazy` ha sido refactorizado para utilizar un Grid de 3 columnas (Tripartite Layout).
- [ ] El isotipo/logo (FaFistRaised o Logo Isotype de crazy) se encuentra perfectamente centrado en el Header.
- [ ] La navegación de escritorio actual (`INICIO`, `MISIÓN`, `PROGRAMA`, etc.) se ha movido al componente `NavigationDrawer` (accedido vía menú hamburguesa a la derecha).
- [ ] El botón animado del chatbot (`PulsingOrb`) se encuentra en la parte superior izquierda del Header.
- [ ] El drawer del chat se despliega correctamente al interactuar con el botón del chatbot.

### Comportamiento Esperado
1. Al cargar la página principal de `crazy`, el usuario verá un header minimalista.
2. Lado Izquierdo: Un orbe animado y dinámico (Chatbot). Al hacer clic, se abre el `ChatDrawer`.
3. Centro: El logo oficial de CRAZY BOXING.
4. Lado Derecho: Un icono de menú hamburguesa que, al pulsarlo, despliega el `NavigationDrawer` con todos los enlaces de anclaje (inicio, programa, etc.) y la llamada a la acción ("Clase Gratis").
5. Al scrollear, el header transiciona con un efecto blur/glassmorphism reduciendo su altura, sin recargas de layout bruscas.

---

## Contexto

### Referencias
- Origen a replicar: `/home/nerick_ods/solutions/landing-linkedin`
- Destino de implementación: `/home/nerick_ods/crazy`
- Patrón a seguir: `landing-linkedin/src/features/landing-page/components/Header.tsx`

### Arquitectura Propuesta (Feature-First)
```text
src/
├── components/
│   ├── Header.tsx              (Refactorizado)
│   ├── NavigationDrawer.tsx    (Nuevo port)
│   ├── PulsingOrb.tsx          (Nuevo port)
├── features/
│   └── chat/                   (Migración completa desde landing-linkedin)
│       ├── components/         (ChatDrawer, etc.)
│       ├── store/              (useChatStore)
│       ├── types/
│       ├── utils/
│       └── services/
```

### Modelo de Datos (dependencia para el chatbot)
*Se asume que la migración implicará conectar o crear las tablas correspondientes en Supabase para `chat_sessions` y `chat_messages` si aún no existen en el entorno de `crazy`, o el frontend deberá estar preparado para ello.*

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Portabilidad del Módulo Chatbot (Lógica de Negocio y Estado)
**Objetivo**: Migrar y adaptar toda la carpeta `src/features/chat` (store, tipos, utilidades y hooks) desde `landing-linkedin` hacia `crazy`.
**Validación**: `useChatStore` está disponible sin errores de compilación y los tipos de datos están resueltos.

### Fase 2: Portabilidad de Componentes Base (PulsingOrb y ChatDrawer)
**Objetivo**: Copiar e integrar los componentes visuales del chatbot (`ChatDrawer`, `PulsingOrb`, etc.) al proyecto `crazy`.
**Validación**: Los componentes pueden ser renderizados en el proyecto destino sin dependencias faltantes ni errores de Tailwind.

### Fase 3: Refactorización Estructural del Header
**Objetivo**: Reescribir `src/components/Header.tsx` en `crazy` para implementar el Tripartite Layout, integrando el orbe del chatbot a la izquierda, el logo al centro, y el gatillo del menú hamburguesa a la derecha.
**Validación**: El header refleja exactamente la disposición visual esperada (Desktop y Mobile).

### Fase 4: Implementación del Navigation Drawer y Redirecciones
**Objetivo**: Migrar toda la lógica de navegación actual (enlaces e invocación a `scrollToSection`) de `Header.tsx` al nuevo componente `NavigationDrawer.tsx`.
**Validación**: El usuario puede navegar correctamente entre secciones de la página desde el menú lateral sin ver los enlaces saturando el Header.

### Fase 5: Validación Final y Orquestación Global
**Objetivo**: Integrar el orquestador global (GlobalChatOrchestrator si aplica), probar interacciones cruzadas y asegurar que el sistema compila y funciona end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa sin errores.
- [ ] `npm run build` es exitoso.
- [ ] Interacciones de abrir menú y abrir chatbot son independientes y fluidas.
- [ ] Criterios de éxito cumplidos.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### [YYYY-MM-DD]: [Título del aprendizaje]
- **Error**: [Qué falló]
- **Fix**: [Cómo se arregló]
- **Aplicar en**: [Dónde más aplica este conocimiento]

---

## Gotchas

- [ ] Asegurar que el estado global de zustand para el chatbot no colisione con el entorno destino.
- [ ] La función `scrollToSection` del proyecto destino (`crazy`) debe ser inyectada correctamente en el `NavigationDrawer` traído del otro proyecto.
- [ ] Asegurarse de adaptar la importación de iconos o tipografías (como el logo `FaFistRaised` de react-icons vs una imagen normal) a la estructura del nuevo Header.

## Anti-Patrones

- NO intentar implementar toda la lógica visual sin migrar primero el State (`useChatStore`).
- NO ignorar los errores de importación al portar los archivos; corregir las rutas absolutas (`@/...`) según correspondan al alias de Next.js en `crazy`.
- NO dejar código muerto o comentado del viejo Header.
