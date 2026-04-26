# PRP-006: Module Cards Cloning & Adaptation

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-22
> **Proyecto**: AI Sales Infra

---

## Objetivo

Poblar las secciones de diferenciadores (tarjetas) de los 3 módulos restantes (`Landing`, `Dashboard`, `Conectividad`) clonando la estructura de `Vendedor IA` pero adaptando el copy y los íconos según la propuesta de valor de cada uno definida en `.docs`.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las subpáginas de módulos actuales (excepto Vendedor IA) se ven vacías o incompletas sin sus diferenciadores técnicos. | Inyectar 6 tarjetas de valor por módulo en el data layer central para estandarizar la experiencia premium. |

**Valor de negocio**: Refuerza la autoridad del sistema al mostrar especialización técnica en cada área y mejora el SEO y la permanencia del usuario en las subpáginas.

## Qué

### Criterios de Éxito
- [ ] Módulo `Landing` tiene 6 tarjetas con copy persuasivo (PAS/Glassmorphism).
- [ ] Módulo `Dashboard` tiene 6 tarjetas enfocadas en visibilidad y control.
- [ ] Módulo `Conectividad` tiene 6 tarjetas detallando integraciones (WhatsApp, Slack, etc).
- [ ] Todos los módulos usan íconos de Lucide coherentes con su funcionalidad.
- [ ] El diseño se mantiene pixel-perfect y responsive en todas las páginas.

### Comportamiento Esperado
1. El usuario navega a `/modulos/landing`.
2. Ve el hero y luego una sección de 6 tarjetas que explican por qué la landing de la fábrica es superior.
3. Repite la experiencia consistente en los otros módulos.

---

## Contexto

### Referencias
- `src/shared/lib/modulos-data.ts` - Fuente de verdad de los datos.
- `.docs/BUSINESS_LOGIC.md` - Lógica de negocio.
- `.docs/COPYWRITING.md` - Tono y frameworks.

---

## Blueprint (Assembly Line)

### Fase 1: Redacción de Copy y Selección de Íconos
**Objetivo**: Definir la matriz de datos para los 18 nuevos diferenciadores (6 por módulo).
**Validación**: Lista de objetos `Differentiator` lista en este PRP.

### Fase 2: Actualización de Data Layer
**Objetivo**: Inyectar los datos en `src/shared/lib/modulos-data.ts`.
**Validación**: [x] Archivo guardado y sin errores de linting.

### Fase 3: Validación Final
**Objetivo**: Páginas renderizando correctamente.
**Validación**:
- [x] `npm run typecheck` pasa.
- [x] Navegación manual por los 4 módulos muestra las tarjetas.

---

## 🧠 Matriz de Datos Propuesta

### Landing de Alta Conversión
1. **Copywriting Persuasivo (PAS)**: Icon: `MessageSquare`. Tags: `Ventas`, `Copy`.
2. **Diseño Premium Apple-Style**: Icon: `LayoutGrid`. Tags: `UI/UX`, `Elite`.
3. **Glassmorphism Visuals**: Icon: `Zap`. Tags: `Moderno`, `Wow`.
4. **Carga Ultra-Rápida**: Icon: `Zap`. Tags: `Performance`, `Next.js`.
5. **Micro-Animaciones Guía**: Icon: `CheckCircle2`. Tags: `Interacción`, `Framer`.
6. **Mobile First Dinámico**: Icon: `Globe2`. Tags: `Responsive`, `iOs`.

### Dashboard CRM
1. **Visibilidad Anti-"Black Box"**: Icon: `BarChart3`. Tags: `Control`, `Transparencia`.
2. **Seguimiento de Leads HT**: Icon: `MessageSquare`. Tags: `CRM`, `Real-time`.
3. **Métricas de Conversión**: Icon: `BarChart3`. Tags: `Data`, `ROI`.
4. **Alertas Inteligentes**: Icon: `Zap`. Tags: `Notificaciones`, `Leads`.
5. **Panel de Gestión CEO**: Icon: `LayoutGrid`. Tags: `Simplicidad`, `Control`.
6. **Exportación de Audiencias**: Icon: `Globe2`. Tags: `Propiedad`, `Datos`.

### Conectividad Total
1. **Integración WhatsApp Nativa**: Icon: `MessageSquare`. Tags: `Canal`, `Ventas`.
2. **Slack & Discord Sync**: Icon: `Zap`. Tags: `Equipo`, `Alertas`.
3. **Google Calendar Automático**: Icon: `CheckCircle2`. Tags: `Agenda`, `IA`.
4. **Webhooks de Alta Escalada**: Icon: `Globe2`. Tags: `Interconexión`, `API`.
5. **Workflows Sin Código**: Icon: `LayoutGrid`. Tags: `Automatización`, `Ops`.
6. **Sincronización Multi-Plataforma**: Icon: `BarChart3`. Tags: `Sincronía`, `Cloud`.

---

*PRP pendiente de aprobación.*
