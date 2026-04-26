# PRP-002: Gestión Dinámica de Imágenes en BenefitsList (Admin -> Frontend)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-21
> **Proyecto**: Kia Intelligence

---

## Objetivo

Desarrollar un flujo integrado (end-to-end) que permita, desde el panel de administración, subir, almacenar y actualizar las imágenes que corresponden a la Pestaña 2 ("Vendedor IA") y Pestaña 3 ("Dashboard CRM") del componente frontend `BenefitsList`, eliminando la necesidad de cambiar los assets directamente en el código base.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las imágenes clave de la landing (pruebas sociales de la IA y el Dashboard) están hardcodeadas en `BenefitsList.tsx`. | Proveer un pequeño módulo en el panel de `Settings` que guarde estas imágenes en `Supabase Storage` y persista sus referencias en una tabla para lectura en el frontend. |

**Valor de negocio (Enfoque 80/20)**: Le otorga control absoluto al usuario/cliente final sobre los "héroes visuales" más importantes de su embudo, sin intervenir el sistema de despliegue ni código interno, enfocándonos solo en las dos pestañas que más lo necesitan.

## Qué

### Criterios de Éxito
- [ ] Creación de Bucket de Storage (`landing_assets`) en Supabase accesible públicamente.
- [ ] Creación de la tabla `landing_config` en PostgreSQL para registrar la URL actual de cada pestaña.
- [ ] Componente `DynamicImageUploader` agregado en `/admin/settings` capaz de subir archivos y guardar la persistencia.
- [ ] `BenefitsList.tsx` refactorizado para cargar (idealmente desde `page.tsx` o vía un Server Action rápido) la configuración en tiempo real y mostrar las nuevas imágenes si existen.

### Comportamiento Esperado
1. El usuario administrador entra a `/admin/settings`.
2. Observa una nueva sección: "Activos de Landing Page".
3. Visualiza el estado actual de la Pestaña 2 y Pestaña 3.
4. Selecciona un archivo local y hace clic en "Actualizar".
5. El sistema sube a Supabase Storage y actualiza la base de datos de manera transparente.
6. El frontend inmediatamente pasa a reflejar las nuevas imágenes sin necesidad de recompilaciones.

---

## Contexto

### Referencias
- Archivo Frontend: `src/features/landing-page/components/BenefitsList.tsx`
- Archivo Admin: `src/app/admin/settings/page.tsx`
- DB: `@supabase/ssr` para el Server Client.
- Skill Guía: `.claude/skills/supabase/SKILL.md`

### Arquitectura Propuesta (Feature-First)
```
src/features/admin/
├── components/
│   └── LandingAssetsManager.tsx  <-- Nuevo subcomponente en settings
├── actions/
│   └── landing-config-actions.ts <-- Logica de actualizacion y lectura db
```

### Modelo de Datos

```sql
-- Gestión de key/values dinámicos para la web
CREATE TABLE landing_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE landing_config ENABLE ROW LEVEL SECURITY;

-- Lectura pública para la landing, escritura solo admin
CREATE POLICY "Public Read Config" ON landing_config FOR SELECT USING (true);
CREATE POLICY "Admin Write Config" ON landing_config FOR INSERT/UPDATE/DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Config inicial (fallback actual)
INSERT INTO landing_config (key, value) VALUES 
('benefits_tab_2_image', '/benefit/WhatsApp Image 2026-04-20 at 10.29.02 PM.jpeg'),
('benefits_tab_3_image', '/benefit/WhatsApp Image 2026-04-20 at 9.59.49 PM.jpeg');
```

---

## Blueprint (Assembly Line)

### Fase 1: Infraestructura Supabase (Storage & DB)
**Objetivo**: Crear la tabla fundamental `landing_config` y un bucket público de Storage (`landing_assets`) en Supabase MCP y RLS asegurado.
**Validación**: Obtener respuesta exitosa en MCP de Supabase al enviar comandos SQL.

### Fase 2: Backend de Lectura / Escritura (Server Actions)
**Objetivo**: Programar los _Server Actions_ que leerán la configuración de la tabla para suministrarla al frontend, y las que permitirán la actualización autenticada desde el Admin.
**Validación**: Tipos correctos inferidos sin errores TypeScript.

### Fase 3: Integración Frontend
**Objetivo**: Integrar la configuración leída al componente de la landing respectivo para que sobreescriba a la predeterminada; incluir la inyección de estas propieades.
**Validación**: Las imágenes renderizan correctamente en la Landing usando Server Component Injections/Hooks.

### Fase 4: Integración UI de Admin
**Objetivo**: Fabricar y ubicar un pequeño módulo Uploader en la página`/admin/settings` con feedback en tiempo real.
**Validación**: Subir una imagen mediante entorno dev/local y confirmarla visualmente en la landing principal.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-21]: Inyección Dinámica al componente Client 
- **Error**: N/A
- **Fix**: N/A
- **Aplicar en**: N/A

---

## Gotchas

- [ ] `BenefitsList.tsx` está envuelto en `"use client"`. Requiere inyección desde un entorno asíncrono como `page.tsx` (padre) usando Server Actions, o un Hook interno de Supabase para evitar saltos. SSR con inyección es la solución superior de performance.
- [ ] Subir archivos desde Server Actions exige serializar a `FormData` (el cliente Supabase recibe File object pero en Server Actions debe resolverse con Buffer/Files).

## Anti-Patrones

- NO añadir configuraciones estáticas engorrosas fuera de nuestra única fuente de verdad (Supabase DDBB / Storage).
- NO usar componentes extra-pesados para una subida de imagen básica (solo se usarán componentes modulares de `@components/ui` existentes si se puede).

---

*PRP pendiente de aprobación. No se ha modificado código.*
