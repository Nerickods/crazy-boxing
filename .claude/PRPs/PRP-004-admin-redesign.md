# PRP-004: Admin Dashboard Redesign - Blackbird Edition

> **Estado**: PENDIENTE
> **Fecha**: 2026-01-27
> **Proyecto**: MMA (Blackbird)

---

## Objetivo

Rediseñar el Admin Dashboard completo (Layout, Dashboard, Planes, Promociones, Conversaciones, Analíticas, Configuración) adoptando el sistema de diseño **"Liquid Glass" / "Dark Luxury"**. El objetivo es crear una experiencia visual premium, fluida e intuitiva, con soporte para modos Claro/Oscuro y animaciones de alta calidad, acorde al branding de la Landing Page.

## Por Qué

| Problema | Solución |
|----------|----------|
| Diseño actual genérico o inconsistente con landing | Implementar "Liquid Glass" (Blackbird DNA) para consistencia total de marca |
| UX rígida o poco atractiva | Añadir fluidez, micro-animaciones y glassmorphism para sensación premium |
| Falta de personalización visual | Implementar toggle Dark/Light mode con paletas de color armoniosas |

**Valor de negocio**: Refuerza la identidad de marca premium, mejora la satisfacción del administrador y la percepción de calidad del software.

## Qué

### Criterios de Éxito
- [ ] Implementación fiel de "Liquid Glass" (glassmorphism evolucionado, blur, gradientes sutiles).
- [ ] Navegación fluida y responsive en todas las secciones.
- [ ] Modo Oscuro (Default) y Claro funcionando correctamente.
- [ ] Componentes consistentes: Cards, Tablas, Botones, Inputs con estética "glass".
- [ ] Animaciones de entrada y transiciones suaves entre páginas.

### Comportamiento Esperado
- **Global**: Fondo con gradientes sutiles o "Aurora effect" animado en el contenedor principal. Sidebar flotante con efecto glass.
- **Dashboard**: Cards de métricas con efecto glass, gráficos integrados con colores neón suaves (purple/cyan).
- **Sub-secciones**: Tablas y formularios rediseñados con el mismo lenguaje visual.
- **Interacción**: Hover effects con "glow", transiciones suaves al cambiar de ruta.

---

## Contexto

### Referencias
- **Design System**: `.claude/design-systems/liquid-glass/liquid-glass.md`
- **Landing Page**: Referencia visual actual del proyecto (Dark Luxury).

### Arquitectura Propuesta (Redesign In-Place)
Se modificarán los componentes existentes en `src/app/admin` y `src/features/` para adoptar los nuevos estilos.

```
src/
├── app/admin/
│   ├── layout.tsx           # Layout principal con Sidebar Glass y Fondo Animado
│   ├── page.tsx             # Dashboard Home (Metrics)
│   ├── plans/               # Rediseño visual
│   ├── promotions/          # Rediseño visual
│   ├── conversations/       # Rediseño visual (Chat interface)
│   ├── analytics/           # Rediseño visual (Charts)
│   └── settings/            # Rediseño visual (Forms)
```

---

## Blueprint (Assembly Line)

### Fase 1: Fundamentos Visuales & Layout
**Objetivo**: Establecer lienzo base, sidebar y navegación con estilo Liquid Glass.
**Validación**:
- Fondo animado (Aurora/Fluid) implementado en Layout.
- Sidebar con glassmorphism y navegación activa funcionando.
- Modo Dark/Light toggle implementado.

### Fase 2: Dashboard & Analíticas
**Objetivo**: Rediseñar la vista principal y gráficos.
**Validación**:
- Cards de métricas con estilo glass.
- Gráficos (si existen) estilizados acordes al tema.

### Fase 3: Gestión de Contenido (Planes y Promociones)
**Objetivo**: Estilizar tablas y formularios de gestión.
**Validación**:
- Tablas glassmorphism (encabezados transparentes, filas hover).
- Formularios de edición con inputs estilo glass.

### Fase 4: Conversaciones & Configuración
**Objetivo**: Rediseñar chat y settings.
**Validación**:
- Chat interface visualmente integrada (burbujas glass, input moderno).
- Panel de configuración consistente.

### Fase 5: Validación Final
**Objetivo**: Pulido y consistencia.
**Validación**:
- [ ] `npm run build` exitoso.
- [ ] Navegación completa sin saltos visuales.
- [ ] Screenshots de Chrome DevTools confirman estética "Liquid Glass".

---

## Gotchas

- **Performance**: Cuidado con exceso de `backdrop-filter` en pantallas grandes. Usar `will-change` si es necesario o reducir blur en contenedores muy grandes.
- **Accesibilidad**: Asegurar contraste suficiente en textos sobre fondos glass semi-transparentes.
- **Tema Claro**: Asegurar que los colores "glass" funcionen sobre fondos claros (usar `bg-black/5` o similares para contraste inverso).
