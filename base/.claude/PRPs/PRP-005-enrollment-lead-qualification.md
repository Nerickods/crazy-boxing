# PRP-005: Cualificación de Leads en EnrollmentModal

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-14
> **Proyecto**: KIA Intelligence

---

## Objetivo

Añadir dos campos opcionales al formulario de inscripción para mejorar la cualificación de los prospectos antes del contacto 1:1. Esto permitirá al arquitecto (Nerick) llegar a la sesión con un contexto claro sobre el nicho y el dolor principal del cliente.

## Por Qué

| Problema | Solución |
|----------|----------|
| Actualmente solo conocemos el nombre, email y tamaño de la empresa, lo cual es insuficiente para personalizar la propuesta de valor inicial. | Capturar "industria/nicho" y "problema más grave" para filtrar la viabilidad del proyecto antes de la llamada. |

**Valor de negocio**: Ahorro de tiempo en llamadas no cualificadas y aumento del estatus de "Autor" al pedir información más profunda y específica.

## Qué

### Criterios de Éxito
- [ ] Base de Datos actualizada con columnas `industry` y `primary_pain_point` en la tabla `enrollments`.
- [ ] UI del modal actualizada con un nuevo input y una nueva área de texto.
- [ ] Campos marcados como opcionales para no reducir drásticamente la conversión de los leads más "tímidos".
- [ ] Sincronización exitosa de los nuevos datos hacia Supabase.

### Comportamiento Esperado
El usuario abre el modal, completa sus datos básicos y opcionalmente nos cuenta a qué se dedica y cuál es su mayor cuello de botella actual.

---

## Contextos

### Referencias
- `src/features/services/components/ui/EnrollmentModal.tsx` -> Componente a modificar.
- `Supabase Public Schema` -> Tabla `enrollments`.

### Arquitectura Propuesta (Full-Stack)

#### 1. Backend (PostgreSQL via Supabase MCP)
```sql
ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS primary_pain_point text;
```

#### 2. Frontend (React)
- Añadir estados de captura o extraer de `FormData` los nuevos campos: `industry` y `primary_pain_point`.
- Renderizar los componentes visuales respetando el diseño actual de inputs con borders sutiles y fondo oscuro.

---

## Blueprint (Assembly Line)

### Fase 1: Migración de Base de Datos
**Objetivo**: Asegurar que la tabla puede recibir los nuevos campos.
**Validación**: `list_tables` confirma la existencia de las columnas.

### Fase 2: Actualización de UI y Lógica de Envío
**Objetivo**: Implementar los campos en el JSX y actualizar la función `handleSubmit`.
**Validación**: El formulario envía correctamente los datos (ver en logs de Supabase).

### Fase 3: Validación Final
**Objetivo**: Formulario funcional y estéticamente perfecto.
**Validación**:
- [ ] `npm run build` exitoso.
- [ ] Campos visibles y funcionales en responsive.

---

## Gotchas

- [ ] Las columnas deben ser `text` para permitir descripciones largas en el pain point.
- [ ] Mantener el diseño "Premium" (`bg-black/40`, `border-white/10`).

---

*PRP pendiente aprobación.*
