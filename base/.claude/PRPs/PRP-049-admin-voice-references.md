# PRP-049: Gestión de Referencias de Voz (Admin Settings)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-05
> **Proyecto**: KIA Intelligence

---

## Objetivo

Agregar una sección en la ruta `/admin/settings` que permita subir, gestionar y activar "Referencias de Voz" que alimentarán a los agentes de IA (LinkedIn Neural Strategist, Post Generator) para mimetizar perfectamente la forma de escribir del usuario.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las respuestas de las IAs pueden sonar genéricas a pesar de los buenos prompts. | Agregar "Few-Shot Examples" reales del estilo de redacción del usuario. |
| No había forma visual de inyectar o actualizar el tono de voz de IA sin tocar código. | Interfaz en `/admin/settings` conectada directamente a la BD y al prompt de IA. |

**Valor de negocio**: Aumenta drásticamente la calidad y personalización de la inteligencia artificial de la fábrica. Un output que suene 100% como Nerick aumenta la confianza de los clientes en que el ecosistema genera "copy élite". Reduce los tiempos de edición posteriores a la generación por parte del usuario.

## Qué

### Criterios de Éxito
- [ ] La ruta `/admin/settings` es accesible y renderiza un gestor UI de "Voice References".
- [ ] El administrador puede agregar nuevos fragmentos de texto (referencias de voz).
- [ ] El administrador puede activar/desactivar referencias (máximo recomendado ~3 activas al mismo tiempo, el límite de query ya existe en `admin-chat`).
- [ ] El administrador puede borrar referencias antiguas.
- [ ] El endpoint `api/generate-post/route.ts` incorpora las referencias de voz activas en el context prompt (tal como ya lo hace `admin-chat/route.ts`).

### Comportamiento Esperado
1. El usuario navega a `/admin/settings`.
2. Ve una lista de las "Referencias de Voz" actuales.
3. Mediante un campo de texto amplio (*textarea*), agrega un nuevo post o estilo de escritura. Lo guarda.
4. Puede marcar con un switch de "Activo" cuáles quiero usar como filtro hoy.
5. Al generar un contenido en `/admin/linkedin` o usar el chatbot en `/admin`, la IA cargará las referencias activas como la "regla de oro de estilo".

---

## Contexto

### Referencias
- `src/app/api/admin-chat/route.ts` - *Ya contiene la lógica base de inyección prompt: consulta `admin_voice_references` donde `is_active = true`.*
- `src/app/api/generate-post/route.ts` - *Falta agregarle la consulta a la BD para equiparar la calidad con el admin-chat.*
- `src/app/admin/layout.tsx` - *Ya tiene el link configurado hacia `/admin/settings`.*

### Arquitectura Propuesta (Feature-First)
Crearemos acciones de servidor centralizadas y la UI en la subcarpeta features de admin:

```
src/
├── app/
│   └── admin/
│       └── settings/
│           └── page.tsx                 # Contenedor SSR (Data Fetching)
├── features/
│   └── admin-settings/                  # (Nueva feature o dentro de admin-linkedin)
│       ├── components/
│       │   └── VoiceReferencesManager.tsx # Client Component (UI, Forms, Toggles)
│       └── actions/
│           └── voiceActions.ts          # Server Actions (CRUD supabase)
```

*(Nota: utilizaremos la carpeta `src/features/admin-linkedin` o si lo consideramos más global, `src/features/admin`)*

### Modelo de Datos (Existente / Validar)
La tabla `admin_voice_references` ya parece estar creada según el payload utilizado en `admin-chat`. Su estructura es:
```sql
CREATE TABLE admin_voice_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false
);

ALTER TABLE admin_voice_references ENABLE ROW LEVEL SECURITY;
```

---

## Blueprint (Assembly Line)

### Fase 1: Creación del UI Handler y Server Actions
**Objetivo**: Implementar la lógica CRUD usando Server Actions y preparar la página de Settings conectada a la base de datos Supabase.
**Validación**: Server Actions compilan y están implementadas.

### Fase 2: Implementación de la Interfaz Visual (VoiceReferencesManager)
**Objetivo**: Construir la página `/admin/settings` con el componente que lista, elimina y cambia el status de activación de cada Voice Reference.
**Validación**: Navegar a `/admin/settings` renderiza sin errores de hidratación y permite guardar un bloque de texto que se refleja en BD.

### Fase 3: Integración en Generadores de IA (`generate-post`)
**Objetivo**: Actualizar los route handlers (como `generate-post/route.ts`) que aún no utilizan la base de referencias, para que también la consulten, unificando la voz en toda la plataforma.
**Validación**: Pedir a la IA un post y constatar a través de dev tools o logs que el prompt final incluyó las Voice References inyectadas y activas.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end (CRUD + Inyección Prompt).
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Se agregan y eliminan referencias desde la UI correctamente.
- [ ] El framework reacciona a los cambios en vivo en los prompts de IA.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-05]: Server Actions Data Fetching
- **Error**: TBD
- **Fix**: TBD

---

## Gotchas

- [ ] Asegurarse de que la tabla `admin_voice_references` existe efectivamente y que nuestro RLS (o Admin Client) nos permite insertar y borrar de la misma.
- [ ] En Next.js `Server Actions` que realicen fetch, debemos usar `revalidatePath('/admin/settings')` para actualizar la vista sin refrescar manualmente.
- [ ] El textarea para la creación de referencias debe ser suficientemente grande y permitir saltos de línea sin escapar texto de manera extraña.

## Anti-Patrones

- NO crear API routes (`/api/settings/...`) para el CRUD, usar `Server Actions` directo desde la feature folder.
- NO mezclar componentes de cliente (`"use client"`) con llamadas iniciales a la DB; usar la página `page.tsx` (SSR) para inyectar la data inicial en `VoiceReferencesManager`.
