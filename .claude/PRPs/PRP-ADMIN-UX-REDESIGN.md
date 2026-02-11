# PRP-ADMIN-UX-REDESIGN: Rediseño Dashboard Admin "Yellow/Red Authority"

> **Estado**: PENDIENTE
> **Fecha**: 2026-01-27
> **Proyecto**: MMA SaaS Factory

---

## Objetivo

Transformar el Dashboard Administrativo en una interfaz intuitiva, minimalista y de alta autoridad, utilizando la paleta de colores del branding (Amarillo y Rojo) y efectos visuales "wow" en modos Claro y Oscuro, asegurando una experiencia de usuario premium y fluida.

## Por Qué

| Problema | Solución |
|----------|----------|
| **Inconsistencia de Marca** | Reemplazar tonos genéricos (púrpura/azul) con el branding oficial (Amarillo/Rojo) para reforzar identidad. |
| **UX Genérica** | Implementar micro-interacciones, transiciones suaves y layouts intuitivos para reducir carga cognitiva. |
| **Modo Claro "Duro"** | Diseñar un modo claro minimalista y limpio que no canse la vista y mantenga la elegancia. |
| **Falta de "Autoridad"** | Estética profesional y robusta que transmita control y poder al administrador. |

**Valor de negocio**: Aumentar la eficiencia operativa del administrador al hacer la información más accesible y la navegación más placentera, reduciendo errores y tiempos de gestión.

## Qué

### Criterios de Éxito
- [ ] **Branding**: La interfaz se siente "nativa" de la marca (Amarillo/Rojo) sin ser estridente.
- [ ] **Modo Claro/Oscuro**: Ambos modos son legibles, accesibles y estéticamente armoniosos.
- [ ] **Accesibilidad**: Contraste adecuado y navegación clara.
- [ ] **Factor Wow**: Animaciones sutiles pero impactantes (hover, transitions, loaders).
- [ ] **Responsiveness**: Funciona perfectamente en desktop y tablets.

### Comportamiento Esperado (Happy Path)
1.  **Login**: Entrada impactante con feedback visual claro.
2.  **Navegación**: Sidebar intuitivo que colapsa/expande o resalta claramente la sección actual.
3.  **Dashboard**: Vista de pájaro inmediata de métricas críticas con gráficos estilizados.
4.  **Gestión**: Tablas y listas (Planes, Promos) limpias, con acciones rápidas y claras.
5.  **Feedback**: Alertas y notificaciones integradas en el diseño, no intrusivas pero visibles.

### Áreas de Enfoque
- **Colores**:
    - **Primario**: Amarillo (Energía, Atención) - `amber-400`/`amber-500`
    - **Secundario**: Rojo (Acción, Potencia) - `red-500`/`red-600`
    - **Neutros**: Slate/Gray para fondos y textos.
- **Estilo**: "Glassmorphism" refinado, bordes sutiles, sombras suaves en Light Mode, brillos en Dark Mode.

---

## Contexto

### Referencias Existentes
- `src/app/admin/layout.tsx`: Layout actual con sidebar fijo.
- `src/app/admin/page.tsx`: Dashboard principal con widgets.
- `src/features/**`: Componentes específicos de cada sección.

### Arquitectura Feature-First Afectada
- `src/app/admin/**` (Layout y Pages)
- `src/app/(auth)/login/**` (Login Page)
- `src/shared/components/**` (Componentes UI reutilizables si se crean nuevos)

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Foundation & Layout (Branding Injection)
**Objetivo**: Establecer las bases visuales (colores, tipografía, estructura base) y rediseñar el contenedor principal (`layout.tsx`) y el Sidebar.
**Validación**:
- [ ] Sidebar usa colores de marca y tiene estados hover/active "wow".
- [ ] Backgrounds (Claro/Oscuro) implementados correctamente con el nuevo branding.
- [ ] Navegación fluida entre secciones vacías/existentes.
- [ ] Screenshot en DevTools muestra la nueva identidad visual.

### Fase 2: Dashboard Home (The Cockpit)
**Objetivo**: Rediseñar la página principal (`/admin`) para que sea un panel de control de alto impacto visual y utilidad.
**Validación**:
- [ ] Widgets de estadísticas rediseñados (minimalistas, claros).
- [ ] Gráficos o listas visuales usan la nueva paleta.
- [ ] Animaciones de entrada de datos.
- [ ] Responsive check.

### Fase 3: Core Features UI (Plans & Promotions)
**Objetivo**: Aplicar el nuevo lenguaje de diseño a las secciones de gestión operativa (`/admin/plans`, `/admin/promotions`).
**Validación**:
- [ ] Listas de items (planes/promos) legibles y estéticas.
- [ ] Formularios de edición/creación intuitivos.
- [ ] Feedback visual en acciones (guardar, borrar).

### Fase 4: Communications & Analytics UI
**Objetivo**: Rediseñar las secciones densas en datos (`/admin/conversations`, `/admin/analytics`).
**Validación**:
- [ ] Chat interface (si existe) mejorada visualmente.
- [ ] Gráficos de analíticas consistentes con el branding.
- [ ] Legibilidad mejorada en tablas de datos densas.

### Fase 5: Login & Settings (The Gate & Control)
**Objetivo**: Rediseñar la experiencia de entrada (`/login`) y la configuración (`/admin/settings`).
**Validación**:
- [ ] Login page con alto impacto visual ("Wow effect").
- [ ] Settings page organizada y limpia.
- [ ] Transición Login -> Admin suave.

### Fase 6: Validación Final & Polish
**Objetivo**: Asegurar consistencia, performance y corrección de detalles finos (pixel-perfect).
**Validación**:
- [ ] Verificación completa Light/Dark mode.
- [ ] `npm run lint` y `typecheck` sin errores.
- [ ] Navegación completa sin saltos visuales extraños.
- [ ] Aprobación visual final.

---

## 🧠 Aprendizajes (Self-Annealing)

*(Se llenará durante la ejecución)*

---

## Gotchas

- [ ] **Contraste**: El amarillo sobre blanco puede ser difícil de leer. Usar tonos ámbar oscuros para texto o fondos oscuros para texto amarillo.
- [ ] **Fatiga Visual**: El rojo es intenso. Usarlo solo para acciones principales o alertas, no para grandes superficies de fondo.
- [ ] **Accesibilidad**: Asegurar que los inputs y textos cumplan WCAG, especialmente en el modo claro minimalista.
