# PRP-015: Análisis Masivo de Conversaciones e Interfaz de Historial

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-01
> **Proyecto**: KIA Intelligence

---

## Objetivo

Implementar un sistema de análisis por lotes para conversaciones de IA que permita al administrador procesar todas las interacciones pendientes con un solo clic, permitiendo diferenciar visualmente entre sesiones nuevas y procesadas mediante filtros y resúmenes automáticos en la interfaz.

## Por Qué

| Problema | Solución |
|----------|----------|
| Análisis manual uno a uno es lento e ineficiente para el escalado. | Botón "Analizar Pendientes" en el Resumen del Ecosistema que procesa todo vía IA. |
| Imposibilidad de distinguir conversaciones leídas/atendidas de las nuevas. | Implementación de estado `is_processed` y filtros de navegación ("Pendientes", "Procesados"). |
| Falta de contexto rápido en la lista de conversaciones. | Previsualización de `summary` generado por IA directamente en las tarjetas de la lista. |

**Valor de negocio**: Ahorro masivo de tiempo operativo para Nerick Segoviano (Operador). Permite identificar leads de alta calidad en segundos sin entrar en cada chat.

## Qué

### Criterios de Éxito
- [ ] Columna `is_processed` añadida a `chat_sessions`.
- [ ] Nuevo método `analyzeAllUnprocessed` en `analysisService` que procese sesiones de forma concurrente (o secuencial controlada).
- [ ] Botón funcional en `AdminDashboard` con feedback visual de progreso.
- [ ] Filtros funcionales en `/admin/conversations` (Todos, Pendientes, Procesados).
- [ ] Tarjetas de conversación muestran el resumen de la IA si está disponible.

### Comportamiento Esperado
1. El administrador entra al **Resumen del Ecosistema**.
2. Ve una alerta/botón: "X conversaciones pendientes de análisis".
3. Al pulsar **"Analizar Todo"**, el sistema itera sobre las sesiones sin `analyzed_at` o con `is_processed = false`, genera los resúmenes vía Gemini y actualiza la BD.
4. En **Conversaciones IA**, el admin puede filtrar por "Pendientes" para ver solo lo nuevo. Las ya analizadas muestran un badge "PROCESADO" y su resumen ejecutivo.

---

## Contexto

### Referencias
- `src/features/chat/services/analysisService.ts` - Lógica actual de Gemini.
- `src/app/admin/conversations/page.tsx` - Vista de lista actual.
- `src/app/admin/page.tsx` - Dashboard principal.

### Arquitectura Propuesta (Feature-First)
```
src/features/chat/
├── services/
│   └── analysisService.ts  # Extender con analyzeAllUnprocessed
├── actions/
│   └── analysisActions.ts  # Server Action para el proceso por lotes
└── components/
    └── BulkAnalysisButton.tsx # Componente interactivo para el Dashboard
```

### Modelo de Datos (Migración)
```sql
-- Agregar flag de procesamiento
ALTER TABLE chat_sessions 
ADD COLUMN is_processed BOOLEAN DEFAULT false;

-- Índice para optimizar filtrado
CREATE INDEX idx_chat_sessions_processed ON chat_sessions(is_processed);
```

---

## Blueprint (Assembly Line)

### Fase 1: Infraestructura de Datos
**Objetivo**: Preparar la base de datos para el seguimiento de estados.
**Validación**: Columna `is_processed` visible en Supabase y accesible desde el cliente.

### Fase 2: Lógica de Procesamiento Masivo
**Objetivo**: Crear el servicio y la Server Action para análisis concurrente.
**Validación**: Test unitario o script que procese 3 conversaciones de prueba exitosamente.

### Fase 3: Interfaz de Dashboard (Resumen)
**Objetivo**: Inyectar el `BulkAnalysisButton` en la sección de "Sistema Health / Quick Actions".
**Validación**: El botón muestra el conteo real de pendientes y responde al click.

### Fase 4: Refactor de Lista de Conversaciones
**Objetivo**: Implementar filtros de estado y visualización de resúmenes.
**Validación**: Los filtros actualizan la URL/Estado y muestran las sesiones correctas.

### Fase 5: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Análisis de 5+ conversaciones simultáneas no agota el rate limit de OpenRouter.
- [ ] Criterios de éxito cumplidos.

---

## Gotchas

- [ ] **Rate Limiting**: El análisis masivo de muchas conversaciones podría golpear límites de OpenRouter/Gemini. Implementar un procesamiento secuencial coordinado.
- [ ] **Timeout**: Server Actions tienen un límite de tiempo. Si hay muchas conversaciones, procesar en batches o usar una arquitectura asíncrona.

## Anti-Patrones

- NO añadir el botón de análisis a la vista de cliente (solo admin).
- NO duplicar la lógica de análisis (reutilizar `analyzeSession` existente).

---

*PRP pendiente aprobación. No se ha modificado código.*
