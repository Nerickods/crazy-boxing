# PRP-003: Sentinel Logic Implementation

> **Estado**: COMPLETADO
> **Fecha**: 2026-01-28
> **Proyecto**: MMA1

---

## Objetivo

Implementar la lógica "Sentinel" proporcionada por el usuario (verificación estricta de email + loop manual de herramientas), **conservando la capacidad de editar el Prompt desde el Admin Dashboard**.

## Por Qué

| Problema | Solución |
|----------|----------|
| Lógica actual "Vercel AI SDK" es demasiado flexible/impredecible | Implementar "Sentinel Pattern" (Loop manual estricto) |
| Usuario quiere reglas duras (Sunday Lockdown, Email Check) | Inyectar estas reglas via System Prompt + Tools separadas |
| Riesgo de perder control desde Admin | Inyectar el prompt de la BD en el servicio Sentinel |

## Qué

### Criterios de Éxito
- [ ] Chat funciona usando la lógica del archivo `openAiservice.ts` (Loop manual).
- [ ] El System Prompt NO está hardcodeado; se lee de la tabla `agents`.
- [ ] La tabla `agents` se actualiza con el nuevo "Sentinel Prompt".
- [ ] Tool `register_enrollment` escribe en `enrollments` (mapeada internamente).
- [ ] Tool `check_email_exists` verifica duplicados.

### Arquitectura Híbrida

1.  **`src/app/api/chat/route.ts`**:
    -   Recibe request.
    -   Lee `system_prompt` de Supabase (Admin Control).
    -   Llama a `openAiService.processChat(messages, systemPrompt)`.
    -   Devuelve stream/respuesta.

2.  **`logic/openAiservice.ts`**:
    -   Adopta la lógica del loop `while` user-provided.
    -   Reemplaza el `getSystemPrompt` hardcodeado por el argumento recibido.
    -   Usa `openai` client (OpenRouter).

3.  **`logic/leadservice.ts`**:
    -   Renombramos a `enrollmentService` o mapeamos métodos para usar `enrollments`.

## Blueprint (Assembly Line)

### Fase 1: Backend Services Refactor
**Objetivo**: Preparar la capa lógica.
- Adaptar `logic/leadservice.ts` para usar tabla `enrollments` (que ya existe y limpiamos).
- Adaptar `logic/openAiservice.ts` para aceptar `systemPrompt` dinámico.

### Fase 2: Database Migration (Prompt)
**Objetivo**: Actualizar la "mente" del agente.
- Hacer Update en tabla `agents` con el "Sentinel System Prompt" completo (incluyendo reglas de Domingo y formato ISO).

### Fase 3: API Route Integration
**Objetivo**: Conectar el cerebro con la boca.
- Modificar `src/app/api/chat/route.ts` para usar el nuevo servicio en lugar de `streamText` directo.
- Asegurar manejo de cookies/visitor_id.

### Fase 4: Validación
**Objetivo**: Verificar que obedece las reglas.
- Test manual: Intentar registrar email duplicado.
- Test manual: Intentar registrar en Domingo.
- Test manual: Cambiar prompt en Admin y ver efecto.

---

## 🧠 Aprendizajes (Self-Annealing)

> Espacio para documentar errores durante la implementación.

---

*PRP pendiente aprobación.*
