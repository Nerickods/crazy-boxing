# PRP-038: Admin LinkedIn Content Strategist (Bot Segregation)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-04
> **Proyecto**: KIA Intelligence

---

## Objetivo

Separar la lógica del chatbot asistente de la landing page (orientado a cualificación de leads), creando un **Asistente de Estrategia LinkedIn** exclusivo para el panel de administrador. Este asistente actuará como un estratega senior experto en "B2B Direct Response Copywriting", capaz de leer `BUSINESS_LOGIC.md` y acceder a la base de datos de referencias de voz para generar posts de altísima conversión, cero contenido corporativo aburrido, usando estructuras probadas.

## Por Qué

| Problema | Solución |
|----------|----------|
| El panel de administración utiliza el mismo ChatWidget que la landing page. | Crear un componente y estado completamente aislado (`AdminChatWidget` + `adminChatStore`) exclusivo para tareas internas. |
| La redacción de contenido es inconsistente y carece de contexto estratégico a fondo del modelo de negocio. | Integramos herramientas (Tool Calling) en el backend que permitan al asistente inyectar dinámicamente referencias de voz desde Supabase y lineamientos desde `BUSINESS_LOGIC.md`. |
| Las IAs suelen escribir contenido corporativo "slop" (demasiados emojis, palabras como "transforma", "revoluciona"). | Prompting estricto anti-slop, priorizando formato ligero, párrafos de 1-3 líneas, y lectura estilo "Amiga María". |

**Valor de negocio**: Optimización extrema del embudo de contenido B2B. Ahorro masivo de tiempo en la validación y creación de posts de autoridad.

## Qué

### Criterios de Éxito
- [ ] La UI del panel admin utiliza `AdminChatWidget` y `adminChatStore.ts`, aislado por completo de la lógica de clientes.
- [ ] El endpoint de la API (`/api/admin-chat` o extensión de `/api/generate-post`) usa Vercel AI SDK Core con **Tools integradas**.
- [ ] El asistente tiene una Tool para hacer query a Supabase (`admin_voice_references`) y buscar referencias de voz del usuario.
- [ ] El asistente tiene una Tool o contexto inyectado capaz de asimilar las directrices de `BUSINESS_LOGIC.md`.
- [ ] El contenido generado respeta estrictamente reglas anti-AI slop: lenguaje asertivo, directo, estructura ligera.

### Comportamiento Esperado
El administrador hace click en el botón del chat dentro del dashboard. Observa un branding y título adaptado ("LinkedIn Neural Strategist"). Al pedir "Redacta un post sobre nuestro proceso de automatización para clínicas", el asistente automáticamente decide buscar las "referencias de voz" activas del administrador, leer su posicionamiento en `BUSINESS_LOGIC.md`, y responde directamente con el texto del post siguiendo estructuras persuasivas (AIDA/PAS), de fácil lectura, sin adornos corporativos inútiles.

---

## Contexto

### Referencias
- `src/features/chat/components/ChatWidget.tsx` - Base estructural para clonar y adaptar la UI.
- `src/app/api/generate-post/route.ts` - Contiene la base del context injection y promting para copy, pero el nuevo chat usará IA SDK Tools con streamText para más autonomía y conversaciones iterativas.
- `BUSINESS_LOGIC.md` - Fuente de verdad a inyectar en el agente.

### Arquitectura Propuesta (Feature-First)
```text
src/features/admin-chat/
├── components/
│   └── AdminChatWidget.tsx    (UI de chat mejorada, sin floating bubble si se desea, o persistente en Admin)
├── store/
│   └── adminChatStore.ts      (Zustand store aislado, maneja api calls a /api/admin-chat)
├── api/
│   └── route.ts               (En src/app/api/admin-chat/route.ts. Maneja streamText y Tool calling)
└── types/
    └── index.ts
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar).

### Fase 1: Arquitectura de Estado y UI Segregada
**Objetivo**: Desacoplar por completo el Chat de Admin del Chat de Landing Page, eliminando el riesgo de contaminación de estado.
**Validación**:
- Existe `adminChatStore.ts` y gestiona su propio `sessionId` y array de `messages`.
- `AdminChatWidget.tsx` montado en el layout del Admin (`src/app/admin/layout.tsx` o similar), con diseño de "Strategist" (botón distinto o integrado en UI central).

### Fase 2: Infrastructure de Backend & Vercel AI Tools
**Objetivo**: Implementar el endpoint inteligente para el admin (`/api/admin-chat/route.ts`), dotando a la IA de herramientas para recuperar datos vivos sin intervención manual.
**Validación**:
- El endpoint implementa `streamText` de `ai`.
- Inyecta `system prompt` con reglas de "Anti-Corporate Slop", Copywriting de respuesta directa, reglas visuales (párrafos cortos) y estilo "Amiga María".
- Incluye `tools` object: `getVoiceReferences` (query a Supabase a la tabla `admin_voice_references`) y `getBusinessLogic` (leer/parsear highlights del `BUSINESS_LOGIC.md`).

### Fase 3: Integración y Refinamiento del Bucle Estratégico
**Objetivo**: Conectar el frontend con el backend y asegurar que las tools se disparen automáticamente y rendericen correctamente el streaming en el componente.
**Validación**:
- El bot invoca invisiblemente herramientas y el usuario solo ve el resultado (el contenido final de LinkedIn).
- Criterios de éxito UI validados (Loader de "Buscando referencias", "Leyendo estructura de copy", etc.).
- Pruebas reales de redacción, validando que el tono coincida con la marca (Elitista, Minimalista, Tecnológico).

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-04]: Tool Execution Overhead
- **Prevención**: Para evitar que la LLM llame iterativamente a `BUSINESS_LOGIC.md` en cada mensaje, será prudente inyectar el conocimiento core del negocio directamente en el `system` prompt inicial y reservar las Tools solo para la base de datos o queries específicas si la documentación crece mucho; o bien inyectarlo bajo demanda usando un hook `onStart`.

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] Vercel AI SDK 6.0 Tools con OpenRouter pueden requerir soporte explícito dependiendo de los modelos (ej. recomendar encarecidamente usar `anthropic/claude-3-5-sonnet` o `openai/gpt-4o` para uso correcto de Tools).
- [ ] Ojo con parsear todo `BUSINESS_LOGIC.md`. Podría hacer saltar los límites de tokens o alargar la latencia. Tal vez deberíamos extraer un "Resumen de Copywriting" al instanciar el servidor.
- [ ] Separar la tabla `admin_voice_references` es clave, asegurarnos de que tengan RLS de solo Admin.

## Anti-Patrones

- NO usar `any` en definir los retornos de las tools en `@ai-sdk`.
- NO llamar a la DB sin confirmar que la request la hace un usuario autenticado y con rol de Admin verificable desde el session middleware o Supabase server client.
- NO construir un "Generador Mágico", debe ser iterativo: "Dame ideas -> Ahora haz la 3 en formato PAS".

---

*PRP pendiente aprobación. No se ha modificado código.*
