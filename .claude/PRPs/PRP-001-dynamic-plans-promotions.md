# PRP-001: Dynamic Plans & Promotions Management

> **Estado**: PENDIENTE
> **Fecha**: 2026-01-27
> **Proyecto**: Blackbird House MMA

---

## Objetivo

Implementar un sistema dinámico para gestionar Planes y Promociones desde el Panel de Administración, permitiendo actualizaciones en tiempo real en la Landing Page sin necesidad de deploy.

## Por Qué

| Problema | Solución |
|----------|----------|
| Cambiar precios o textos requiere editar código y redeploy | Panel admin para editar DB en tiempo real |
| Promociones temporales dependen de disponibilidad de desarrollador | Marketing puede activar/desactivar promos al instante |
| Datos hardcodeados en `plans.ts` difícil de mantener | Base de datos centralizada como fuente de verdad |

**Valor de negocio**: Agilidad operativa para estrategias de marketing y pricing. Reducción de dependencia técnica.

## Qué

### Criterios de Éxito
- [ ] Admin Dashboard tiene pestañas "Planes" y "Promociones".
- [ ] CRUD funcional para Planes (Crear, Leer, Actualizar, Borrar).
- [ ] CRUD funcional para Promociones.
- [ ] Landing Page consume datos de Supabase en lugar de `plans.ts`.
- [ ] Tiempos de carga optimizados (cache/revalidate).

### Comportamiento Esperado
1.  **Admin Login** → Dashboard.
2.  **Tabs**: Nuevas opciones "Planes" y "Promociones".
3.  **Edición**: Formulario para editar precios, textos, features.
4.  **Landing**: El usuario visita la home y ve los precios actualizados de la DB.

---

## Contexto

### Referencias
- `src/features/plans/data/plans.ts`: Estructura actual de datos.
- `src/app/admin/`: Estructura existente (folders plans/promotions detectados).
- `mcp.json`: Configuración Supabase lista.

### Arquitectura Propuesta (Feature-First)

**Backend (Supabase)**
- Tabla `plans` (Nueva)
- Tabla `promotions` (Existente - Validar/Migrar)

**Frontend**
- `src/features/plans/services/plansService.ts`: Fetching from DB.
- `src/features/plans/services/promotionsService.ts`: Fetching from DB.
- `src/app/admin/plans/page.tsx`: UI Admin (o componente reutilizable).
- `src/features/plans/hooks/usePlans.ts`: Hook para consumo.

### Modelo de Datos

#### Tabla `plans` (Nueva)
```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE, -- ej: 'mensual', 'anual' para mapeo UI
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  highlight BOOLEAN DEFAULT false,
  is_popular BOOLEAN DEFAULT false,
  savings TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
```

#### Tabla `promotions` (Existente - Validación)
Confirmar que soporte `gradient` y `backgroundImage` como tiene el hardcode actual.

---

## Blueprint (Assembly Line)

### Fase 1: Infraestructura de Datos
**Objetivo**: Bases de datos listas y populadas con datos actuales.
**Validación**:
- Tabla `plans` creada con RLS.
- Tabla `promotions` validada.
- Script de migración ejecutado (importar datos de `plans.ts` a DB).
- `list_tables` muestra ambas tablas con registros.

### Fase 2: Capa de Servicios y Hooks
**Objetivo**: Frontend capaz de leer/escribir a la DB.
**Validación**:
- `plansService.ts` implementado (get, create, update, delete).
- `promotionsService.ts` implementado.
- Tests unitarios o manuales de fetch.

### Fase 3: Integración en Landing Page
**Objetivo**: Home page consume datos reales.
**Validación**:
- Reemplazar uso de `PLANS` constante por data asíncrona en `PlansSection.tsx`.
- Verificar renderizado correcto en servidor/cliente.

### Fase 4: Admin Dashboard UI
**Objetivo**: Interfaz de gestión.
**Validación**:
- Implementar UI en `src/app/admin/plans` y `src/app/admin/promotions`.
- Formularios de edición conectados a services.
- Feedback visual (toasts) al guardar.

### Fase 5: Validación Final
**Objetivo**: Sistema End-to-End.
**Validación**:
- Cambiar un precio en Admin -> Verlo reflejado en Landing (tras revalidate).
- Verificar mobile responsiveness.

---

## 🧠 Aprendizajes (Self-Annealing)

### [2026-01-27]: Inicialización
- **Nota**: Se detectó estructura en `src/app/admin` (plans/promotions), se aprovechará.
