# PRP-017: Vercel Deployment & Env Sync

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-02
> **Proyecto**: KIA Intelligence
> **Vercel Project ID**: `prj_nv4SslbWI6QvuO4CSw6IoprWzvGs`

---

## Objetivo

Preparar y ejecutar el despliegue de la aplicación en Vercel, asegurando que todas las variables de entorno locales estén sincronizadas y que el build de producción sea exitoso.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las variables de entorno en `.env.local` no se suben a Git y deben estar en Vercel para que la app funcione en producción. | Sincronización automatizada vía Vercel CLI y validación de build previa al despliegue. |

**Valor de negocio**: Disponibilidad pública de la landing page con todas las funcionalidades de IA (Chatbot) y base de datos operativas.

## Qué

### Criterios de Éxito
- [ ] Build local (`npm run build`) completado sin errores.
- [ ] Variables de entorno (`SUPABASE`, `OPENROUTER`) cargadas en el proyecto Vercel.
- [ ] Proyecto vinculado correctamente al ID `prj_nv4SslbWI6QvuO4CSw6IoprWzvGs`.
- [ ] Despliegue de producción exitoso.

### Comportamiento Esperado
1. Sincronización de secretos desde `.env.local` a Vercel Dashboard.
2. Validación de consistencia de tipos y dependencias.
3. Ejecución del comando de deploy.

---

## Contexto

### Referencias
- `.env.local` - Fuente de verdad de las variables.
- `package.json` - Scripts de build.

### Blueprint (Assembly Line)

### Fase 1: Validación de Build Local
**Objetivo**: Asegurar que los cambios recientes (Header, Hero) no rompen el build de Next.js.
**Validación**: `npm run build` exitoso en el entorno local.

### Fase 2: Sincronización de Variables (Vercel CLI)
**Objetivo**: Cargar los secretos de `.env.local` usando `npx vercel env add`.
**Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`
**Validación**: Confirmación de carga en el proyecto `prj_nv4SslbWI6QvuO4CSw6IoprWzvGs`.

### Fase 3: Despliegue Final
**Objetivo**: Ejecutar `npx vercel --prod` para poner la página en vivo.
**Validación**: URL de producción operativa.

---

## Gotchas
- El build de Next.js 16 con React 19 puede ser sensible a tipos; el `typecheck` previo es fundamental.
- Las variables de Supabase deben estar configuradas como "Production" en Vercel.

---

*PRP pendiente aprobación. No se han subido secretos a Vercel.*
