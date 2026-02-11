# PRP-002: Admin Dashboard Expansion (Disciplines & Enrollments)

> **Estado**: COMPLETADO
> **Fecha**: 2026-01-29
> **Proyecto**: Blackbird House

---

## Objetivo

Implementar dos nuevas secciones en el Dashboard de Admin: una visualización detallada de **Disciplinas y Horarios** (simétrica a la landing) y un gestor de **Enrollments** (inscripciones) con trazabilidad completa de orígenes (Landing/Chat) y redirección inteligente a conversaciones.

## Por Qué

| Problema | Solución |
|----------|----------|
| Admin no tiene visibilidad centralizada de los horarios actuales | Tab "Disciplinas" espejo de la landing page |
| Leads mezclados sin contexto de origen | Tab "Inscripciones" con campo `source` claro |
| Difícil auditar qué habló la IA con un lead inscrito | Link directo a `/admin/conversations/[id]` desde el enrollment |

**Valor de negocio**: Reducción drástica del tiempo de gestión de leads y validación rápida de la consistencia de horarios mostrados a clientes.

## Qué

### Criterios de Éxito
- [ ] Tab **Disciplinas** muestra card por cada clase del `SCHEDULE_DATA` con entrenador asociado.
- [ ] Tab **Inscripciones** lista registros de la tabla `enrollments`.
- [ ] Columna "Origen" distingue visualmente entre `landing_form` y `chat_agent`.
- [ ] Si origen es `chat_agent`, botón "Ver Chat" redirige a la conversación exacta.
- [ ] UX Premium siguiendo el estándar "Liquid Glass" (Blurred backgrounds, gradients).

### Comportamiento Esperado

#### Tab Disciplinas
1.  Admin entra a `/admin`.
2.  Click en tab "Disciplinas".
3.  Ve grid/lista de horarios agrupados por día o disciplina.
4.  Visualiza cards con: Disciplina, Entrenador, Hora, Nivel.

#### Tab Enrollments
1.  Admin entra a `/admin`.
2.  Click en tab "Inscripciones".
3.  Ve tabla ordenada por fecha (más reciente primero).
4.  Fila muestra: Nombre, Correo, Horario Preferido, Status, Origen.
5.  Click en icono de chat (si existe) → abre nueva pestaña con la conversación.

---

## Contexto

### Referencias
- `src/features/training/components/TrainingProgramSection.tsx`: Fuente de verdad actual de horarios.
- `src/shared/constants/training-data.ts`: Constantes de datos (`SCHEDULE_DATA`).
- `src/features/enrollment/services/enrollmentServerService.ts`: Lógica de insert que incluye `metadata: { conversation_id }`.

### Arquitectura Propuesta (Feature-First)

Vamos a extender `src/features/admin` y `src/features/enrollment`.

```
src/features/admin/
├── components/
│   ├── AdminTabs.tsx             # (Conceptualmente, o actualizar layout)
│   ├── DisciplinesTab.tsx        # [NUEVO] Visualizador de horarios
│   └── EnrollmentsTab.tsx        # [NUEVO] Tabla de inscripciones
├── hooks/
│   └── useEnrollments.ts         # [NUEVO] Fetch con React Query/SWR o useEffect
└── types/
    └── admin.types.ts            # Extension de tipos
```

### Modelo de Datos
Solo lectura de tablas existentes.
- `enrollments`: leer `metadata->>conversation_id`.
- `SCHEDULE_DATA`: constante hardcodeada (fase 1).

---

## Blueprint (Assembly Line)

### Fase 1: Tab Disciplinas (Read-Only Mirror)
**Objetivo**: Visualizar `SCHEDULE_DATA` en el admin sin romper estilos.
**Validación**:
- Grid renderiza todos los items de `SCHEDULE_DATA`.
- Entrenadores coinciden con los datos.
- Estética consistente con Dark Mode del admin.

### Fase 2: Tab Enrollments (Smart Traceability)
**Objetivo**: Tabla conectada a Supabase con lógica de redirección.
**Validación**:
- Fetch de `enrollments` funciona.
- Click en "Ver Chat" navega a `/admin/conversations/[uuid]`.
- Manejo de casos donde no hay `conversation_id`.

### Fase 3: Integración y Polish
**Objetivo**: Unificar navegación y pulir UI.
**Validación**:
- Animaciones de cambio de tab suaves (`framer-motion`).
- Responsive check.
- `npm run typecheck` limpio.

---

## 🧠 Aprendizajes (Self-Annealing)

### [2026-01-29]: Metadata JSONB Access
- **Prevención**: Recordar que Supabase devuelve `metadata` como JSON. Al tipar, asegurar que `conversation_id` es accesible.
- **Tip**: Usar un Type Guard o interfaz explicita `EnrollmentMetadata`.

---

## Gotchas

- [ ] `SCHEDULE_DATA` es un archivo cliente/server safe, pero importar iconos de `react-icons` en componentes cliente es pesado si no se hace bien.
- [ ] La tabla `enrollments` usa snake_case en DB, asegurar mapping a camelCase si se usa en frontend (o mantener convención consistente).
- [ ] Redirección a conversación debe validar que la conversación exista para evitar 404s (opcionalmente).
