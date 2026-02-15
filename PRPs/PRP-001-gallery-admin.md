# PRP-001: Gestión de Galería de Instalaciones desde Admin Panel

> **Estado**: PENDIENTE
> **Fecha**: 2026-02-15
> **Proyecto**: Crazy Boxing

---

## Objetivo

Permitir al administrador **agregar, eliminar y reordenar fotos** de la galería de instalaciones ("THE BATTLEGROUND") directamente desde el panel de administración, eliminando la dependencia de imágenes hardcodeadas en el código.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las fotos de la galería están hardcodeadas en `FacilitiesSection.tsx` (4 imágenes estáticas repetidas ×4 = ~30 placeholders) | CRUD completo de imágenes desde `/admin/gallery` con upload a Supabase Storage |
| El dueño del gimnasio no puede actualizar la galería sin intervención técnica | Interfaz drag-and-drop intuitiva en el admin panel |

**Valor de negocio**: Autonomía total del cliente para mantener la galería actualizada con fotos reales, mejorando la conversión de la landing al mostrar contenido fresco y auténtico.

## Qué

### Criterios de Éxito
- [ ] Admin puede subir fotos desde `/admin/gallery` (drag & drop + click)
- [ ] Admin puede eliminar fotos individuales con confirmación
- [ ] Admin puede reordenar fotos (drag & drop o flechas up/down)
- [ ] Las fotos se almacenan en Supabase Storage (bucket `gallery`)
- [ ] `FacilitiesSection.tsx` carga las fotos dinámicamente desde la BD
- [ ] La sección "THE BATTLEGROUND" muestra las fotos reales en el lightbox
- [ ] Las imágenes se optimizan automáticamente (compresión client-side antes del upload)
- [ ] `npm run build` pasa sin errores

### Comportamiento Esperado

**Admin Panel (`/admin/gallery`)**:
1. El admin navega a "Galería" en el sidebar
2. Ve un grid de thumbnails con las fotos actuales
3. Puede hacer click en "Subir fotos" → Selector de archivos (múltiples) o drag & drop
4. Las fotos se comprimen en el navegador (max 1200px width, WebP si es posible)
5. Se suben a Supabase Storage y se registra en tabla `gallery_images`
6. Puede eliminar fotos con confirmación
7. Puede reordenar fotos con flechas ↑↓
8. Cambios visibles inmediatamente en la landing

**Landing Page (FacilitiesSection)**:
1. Al cargar la sección, se consulta `gallery_images` ordenada por `display_order`
2. El lightbox "Explorar Galería" muestra las fotos reales en vez de los placeholders
3. El contador muestra `{N} Fotografías HD` dinámicamente

---

## Contexto

### Estado Actual Investigado

**`FacilitiesSection.tsx`** (519 líneas):
- Galería hardcodeada: 4 objetos `Facility` con 1 imagen cada uno
- `fullGallery`: se crean ~30 items repitiendo las 4 imágenes base
- Lightbox funcional con navegación prev/next y thumbnails
- Imágenes en `/public/images/facilities/{octagono,sacos,tatami,pesas}/`

**Admin Panel**:
- Auth guard en `layout.tsx` (verifica rol `admin` en tabla `profiles`)
- Sidebar con 8 links actuales en `AdminSidebar.tsx`
- Patrón CRUD referencia: `admin/hours/page.tsx` → usa `hoursService`
- Service pattern: `hoursService.ts` → usa `createClient()` de Supabase

**Supabase**:
- **No hay Storage buckets** configurados aún
- 11 tablas existentes, todas con RLS habilitado ✅
- No existe tabla `gallery_images`

### Referencias
- `src/app/admin/hours/page.tsx` → Patrón CRUD a replicar
- `src/features/facilities/services/hoursService.ts` → Patrón de servicio
- `src/app/admin/components/AdminSidebar.tsx` → Navegación a extender

### Arquitectura Propuesta (Feature-First)

```
src/features/facilities/
├── components/
│   └── FacilitiesSection.tsx     [MODIFY] - Consumir datos dinámicos
├── services/
│   ├── hoursService.ts           [EXISTENTE]
│   └── galleryService.ts         [NEW] - CRUD para gallery_images + Storage
└── types/
    └── gallery.ts                [NEW] - Tipos GalleryImage

src/app/admin/
├── gallery/
│   └── page.tsx                  [NEW] - Admin page para gestión de galería
└── components/
    └── AdminSidebar.tsx          [MODIFY] - Agregar link "Galería"
```

### Modelo de Datos

```sql
-- Supabase Storage bucket
-- Bucket: gallery (público para lectura)

-- Tabla de registro de imágenes
CREATE TABLE gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Lectura pública (landing page)
CREATE POLICY "Public can read active gallery images"
    ON gallery_images FOR SELECT
    USING (is_active = true);

-- Admin CRUD (autenticado + rol admin)
CREATE POLICY "Admins can manage gallery images"
    ON gallery_images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo FASES definidas. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Infraestructura de Datos
**Objetivo**: Crear el bucket de Storage y la tabla `gallery_images` con RLS
**Validación**: Tabla existe, RLS habilitado, bucket accesible

### Fase 2: Service Layer
**Objetivo**: Crear `galleryService.ts` con operaciones CRUD + upload/delete de Storage
**Validación**: Servicio funcional con TypeScript sin errores

### Fase 3: Admin Page
**Objetivo**: Crear `/admin/gallery` con UI de gestión (upload, delete, reorder) + link en sidebar
**Validación**: Página carga, se pueden subir/eliminar/reordenar fotos

### Fase 4: Integrar Landing Page
**Objetivo**: Modificar `FacilitiesSection.tsx` para consumir datos dinámicos de `gallery_images`
**Validación**: Galería lightbox muestra fotos de Supabase en lugar de hardcoded

### Fase 5: Validación Final
**Objetivo**: Sistema funcionando end-to-end
**Validación**:
- [ ] `npm run build` exitoso
- [ ] Admin puede subir, eliminar, reordenar fotos
- [ ] Landing page muestra galería dinámica
- [ ] Imágenes se cargan correctamente desde Supabase Storage
- [ ] RLS funciona (solo admins pueden modificar)

---

## 🧠 Aprendizajes (Self-Annealing)

> Esta sección CRECE con cada error encontrado durante la implementación.

_(vacío — se llena durante ejecución)_

---

## Gotchas

- [ ] Supabase Storage requiere crear el bucket manualmente o via migration → Usar Supabase MCP `apply_migration`
- [ ] Las imágenes deben ser públicas para la landing page → Bucket con `public: true`
- [ ] Compresión client-side necesaria para no sobrecargar Storage → Usar Canvas API
- [ ] El componente `FacilitiesSection` recibe `gymHours` como props desde server component → Necesitamos hacer lo mismo con `galleryImages` o usar client-side fetch
- [ ] `next/image` no soporta hosts externos sin configurar `next.config.ts` → Agregar dominio de Supabase

## Anti-Patrones

- NO crear nuevos patrones si los existentes funcionan → Replicar patrón de `hoursService`
- NO ignorar errores de TypeScript
- NO hardcodear URLs de storage
- NO omitir RLS en la tabla

---

*PRP pendiente aprobación. No se ha modificado código.*
