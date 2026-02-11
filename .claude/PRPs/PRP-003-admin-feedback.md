# PRP-003: Admin Feedback Implementation (Dynamic & UI Polish)

> **Estado**: COMPLETADO
> **Fecha**: 2026-01-29
> **Proyecto**: Blackbird House

---

## Objetivo

Refinar el Dashboard de Admin basándose en feedback directo: convertir la sección de Disciplinas en un sistema CRUD dinámico, arreglar la trazabilidad de formularios web, añadir alertas de nuevos registros y renovar la UI para soportar un modo claro legible y un modo oscuro "vibrante" (Naranja/Negro).

## Por Qué

| Problema | Solución |
|----------|----------|
| **Disciplinas Estáticas**: Admin no puede editar horarios sin tocar código. | **Tabla `class_schedule`**: CRUD completo en Admin y fetch dinámico en Landing. |
| **Web Leads Vacíos**: Leads de la web no aparecen en la tabla. | **Fix `EnrollForm`**: Asegurar que `source: 'landing_form'` se guarde correctamente. |
| **Sin Alertas**: Admin no sabe si hay nuevos inscritos al entrar. | **Widget Notificaciones**: Alerta visual en `/admin` dashboard principal. |
| **UI Ilegible**: Modo claro roto y colores "aburridos". | **Vibrant Orange UI**: Rediseño de paleta con alto contraste y acentos naranja neón. |

## Qué

### Criterios de Éxito
1.  **Disciplinas Dinámicas**:
    - [ ] Landing page carga horarios desde Supabase via Server Components.
    - [ ] Admin puede Editar/Crear/Borrar clases en `/admin/disciplines`.
2.  **Inscripciones Web Visibles**:
    - [ ] Formulario de Landing guarda leads en `enrollments` con data correcta.
    - [ ] Tabla de Enrollments muestra leads web correctamente.
3.  **Alertas de Dashboard**:
    - [ ] Widget en `/admin` muestra "X Nuevas Inscripciones".
4.  **UI Premium**:
    - [ ] Modo Claro totalmente legible (fondo blanco/gris, texto negro).
    - [ ] Modo Oscuro mantiene estética "Blackbird" pero más vibrante.
    - [ ] Uso consistente de variables CSS `--primary` (Orange).

---

## Contexto

### Referencias
- `src/features/enrollment/components/EnrollForm.tsx`: Lógica de envío actual.
- `src/features/training/components/TrainingProgramSection.tsx`: Consumidor actual de `SCHEDULE_DATA`.
- `SCHEDULE_DATA`: Estructura de datos a migrar.

### Modelo de Datos Nuevo

```sql
create table public.class_schedule (
  id uuid primary key default gen_random_uuid(),
  discipline text not null, -- 'Boxeo', 'MMA', etc.
  type text not null,       -- 'boxing', 'mma' (fk logical)
  day text not null,        -- 'Lunes', ...
  time text not null,       -- '08:30'
  duration text default '60 min',
  instructor text not null,
  level text default 'General',
  spots integer default 20,
  created_at timestamptz default now()
);

alter table public.class_schedule enable row level security;
create policy "Public read access" on public.class_schedule for select using (true);
create policy "Admin write access" on public.class_schedule for all using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);
```

---

## Blueprint (Assembly Line)

### Fase 1: Disciplinas Dinámicas (CRUD & Migration)
**Objetivo**: Reemplazar constante con DB.
**Pasos**:
1.  Crear migración Supabase (`class_schedule`).
2.  Script para migrar datos de `SCHEDULE_DATA` a DB.
3.  Actualizar servicios de Training (`getSchedule`).
4.  Refactorizar Landing Page para usar data dinámica.
5.  Implementar Admin UI para editar filas (Editable Table).

### Fase 2: Fix Inscripciones Web
**Objetivo**: Asegurar data integrity.
**Pasos**:
1.  Auditar `enrollmentService.registerFromWeb`.
2.  Corregir llamada a Supabase si falta campos.
3.  Validar en UI de Admin.

### Fase 3: Dashboard Alerts
**Objetivo**: Visibilidad inmediata.
**Pasos**:
1.  Crear componente `StatsCards` en `/admin/page.tsx`.
2.  Fetch count de `enrollments` donde `status = 'new'`.

### Fase 4: UI/UX Renovation
**Objetivo**: "Make it Pop".
**Pasos**:
1.  Definir paleta: Orange (`#ff6b00` a `#ff8800`) + Deep Black / White.
2.  Aplicar clases de Tailwind `dark:` y `light:` correctas en Sidebar y Layout.
3.  Revisar contraste en inputs y tablas.

---

## 🧠 Aprendizajes (Self-Annealing)

- **Prevención**: Al migrar a DB, el orden de los días ('Lunes', 'Martes') se pierde sise ordena alfabéticamente. Necesitamos un mapa de ordenamiento o columa `day_order`. *Solución: Mapa en cliente por ahora o enum en DB.*

---
