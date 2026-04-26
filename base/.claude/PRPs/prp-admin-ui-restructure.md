# PRP-001: Reestructuración Premium de UI en Panel Admin (Gradient Mesh)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-20
> **Proyecto**: KIA Intelligence (SaaS Factory)

---

## Objetivo

Rediseñar y reestructurar de manera integral la interfaz de usuario del panel de administrador (`/admin`) utilizando el sistema **Gradient Mesh** para otorgarle un aspecto altamente premium, moderno y fluido ("Cinematic Precision"), manteniendo la coherencia con el branding técnico de la marca.

## Por Qué

| Problema | Solución |
|----------|----------|
| El panel administrador actual tiene un diseño funcional pero plano o genérico. | Integrar un fondo orgánico con Mesh Gradients que aporte una estética "Stripe/Linear" premium. |
| Interfaz estática carente de feedback visual dinámico. | Añadir micro-animaciones, "glassmorphism" elegante y bordes luminosos a Sidebar y Cards. |

**Valor de negocio**: Reforzar la percepción de valor de "KIA Intelligence". Un panel premium genera mayor confianza en la herramienta y una experiencia de usuario enriquecida que se alinea con la precisión y el nivel "High-End" de la IA ofrecida.

## Qué

### Criterios de Éxito
- [ ] El fondo global del Layout Admin (`src/app/admin/layout.tsx`) implementa _Gradient Mesh_ oscuro con acentos Cyan, Emerald y Purple (Estilo Aurora Tech).
- [ ] La Sidebar y los componentes modales emplean contenedores de cristal (Glassmorphism) con `backdrop-blur` adaptados al nuevo fondo.
- [ ] Tarjetas de estadísticas (`StatCard`) y tablas (`page.tsx` + pestañas) implementan hover states prémium (e.g., bordes que se iluminan suavemente, sutil escalado).
- [ ] Alto rendimiento sin scroll horizontal causado por blobs (`overflow-hidden`).

### Comportamiento Esperado
El administrador ingresa a `/admin` y es recibido por un dashboard envolvente. El fondo mantiene una aurora oscura que se fusiona fluidamente. Los elementos superpuestos (como las tablas y navegación) descansan sobre paneles translúcidos sin perder legibilidad. Todas las rutas de `/admin` mantienen consistentemente la misma directriz visual.

---

## Contexto

### Referencias
- `src/app/admin/layout.tsx`: Layout principal de rutas admin.
- `src/app/admin/page.tsx`: Dashboard / Resumen del ecosistema.
- `.claude/design-systems/gradient-mesh/gradient-mesh.md`: Reglas del sistema de fondos orgánicos (Blur de 128px-150px, múltiples capas radiales).

### Arquitectura Propuesta (Feature-First)
No se requieren cambios a la estructura de archivos, sino un re-diseño centralizado de los Wrappers en las rutas actuales.
```
src/app/admin/
├── layout.tsx         # Inyección de Gradient Mesh (Background layer)
├── page.tsx           # Ajuste a Container de Glass Puro (StatCards y Tabla)
├── leads/             ...
├── conversations/     ...
├── linkedin/          ...
└── settings/          ...
```

### Branding & Paleta Sugerida (Basado en Proyecto)
Se adaptará la variante **Aurora / Northern Lights (Tech Mode)** de `gradient-mesh.md` con los colores propios de KIA:
- Base: `bg-slate-950` o `#050505`
- Mesh Blobs: `bg-accent-cyan` (#00f2ff), `emerald-500` (`#10b981`), y oscuros de `purple-500/fuchsia-500`.

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Gradient Mesh Base en Layout
**Objetivo**: Establecer el fondo dinámico de Aurora/Mesh en `layout.tsx` de forma global para todo el panel admin, garantizando que el `z-index` de los difuminados esté por detrás del contenido principal.
**Validación**: Fondo renderizado correctamente en desktop y mobile sin causar excesivo ruido visual.

### Fase 2: Sidebar y Navegación Premium (Glassmorphism)
**Objetivo**: Ajustar el dashboard lateral (`aside`) para que emplee opacidades ligeras (`bg-[#0a0a0a]/30`) con un `backdrop-blur` elegante, acentuando los submenús activos.
**Validación**: Navegación visible, contrastada, botones perfectamente legibles y responsivos.

### Fase 3: Glass UI en Dashboard Principal (Cards y Tablas)
**Objetivo**: Transformar `StatCard`, tablas de `Últimos Leads` y utilidades interactivas a tarjetas de cristal (`bg-white/5 backdrop-blur-md border border-white/10`).
**Validación**: Las cards lucen estilo "Linear/Stripe" y responden sutilmente a acciones del mouse (hover, transitions).

### Fase 4: Expansión y Validación Secundaria
**Objetivo**: Refactorizar subrutas como `/admin/leads` o `/admin/conversations` para acatar la nueva regla "Glass" centralizada y verificar responsiveness end-to-end.
**Validación**: Pruebas en diferentes viewports. Verificación de performance sin degradación excesiva (FPS).

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)
*(Se documentarán durante el bucle de ejecución, al momento de ser descubiertos).*

---

## Gotchas

- [ ] **Performance de Blurs**: Múltiples blur de alto calibre (`blur-[150px]`) pueden ralentizar Chrome o móviles. Mantener blobs amplios en rangos seguros.
- [ ] **Legibilidad**: El panel de admin exhibe datos precisos; el cristal esmerilado detrás de la letra debe proveer suficiente constante de contraste oscuro (`bg-black/40` o sombras de texto).

## Anti-Patrones

- NO añadir dependencias Javascript / Animaciones costosas innecesarias (usar animaciones CSS nativas).
- NO alterar la protección del panel (ej., modificar `proxy.requireAdmin()`).
- NO perder la temática original preconstruida sino potenciarla (KISS & DRY).
