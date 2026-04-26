# PRP-025: Integrated Sticky Scroll CTA & Footer (Morningside Style)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-29
> **Proyecto**: KIA Intelligence

---

## Objetivo

Recrear la experiencia cinemática de cierre de la subpágina `/services` en la página principal (`/`). Esto implica fusionar las secciones de `GuaranteeCta` y `Footer` en un único componente de scroll pegajoso (`LandingCta.tsx`) que utilice transiciones de opacidad, escala y revelado de fondo "Glassmorphism" para un acabado ultra-premium.

## Por Qué

| Problema | Solución |
|----------|----------|
| El cierre actual de la landing principal es estático y pierde el "wow factor" cinemático del resto del sitio. | Implementar un cierre impulsado por scroll (`h-[250vh]`) que mantenga al usuario enganchado hasta el último píxel. |
| Fragmentación entre el mensaje de garantía, el CTA final y el footer. | Integrar los tres elementos en una sola narrativa visual fluida que culmina en un footer flotante tipo "glass card". |

**Valor de negocio**: Aumentar la retención visual en el cierre de la página y elevar la percepción de marca como una entidad de "élite tecnológica", alineado con los precios de 2 proyectos/mes.

## Qué

### Criterios de Éxito
- [ ] Reproducción exacta de la física de scroll de `ServicesCta.tsx`.
- [ ] Integración del copy de garantía y CTA de la página principal en las fases de animación.
- [ ] Transición suave del fondo (`#0a0a0c`) a transparente para revelar el `GlassRefractionBackground`.
- [ ] El footer debe aparecer al final del scroll con el efecto de elevación (y: 100 -> 0).

### Comportamiento Esperado (Happy Path)
1. El usuario llega al final de la landing. El fondo se vuelve negro sólido.
2. Fase 1: Revelado de la Garantía de Control Total.
3. Fase 2: Revelado del mensaje de urgencia ("Deja de ser un espectador...").
4. Fase 3: Aparición del botón CTA centralizado.
5. Fase 4: El fondo negro se desvanece, el footer de "glass" se eleva y se integra al pie de la página sobre el fondo de refracción.

---

## Contexto

### Referencias
- `src/features/services/components/ServicesCta.tsx` - Fuente de la lógica de scroll.
- `src/features/landing-page/components/GuaranteeCta.tsx` - Fuente del copy y assets actuales.
- `src/features/landing-page/components/Footer.tsx` - Fuente de la estructura del footer.

### Arquitectura Propuesta (Feature-First)
```
src/features/landing-page/
├── components/
│   ├── LandingCta.tsx (NUEVO - Reemplaza a GuaranteeCta y Footer)
│   └── ...
```

---

## Blueprint (Assembly Line)

### Fase 1: Creación del Componente Base
**Objetivo**: Crear `LandingCta.tsx` clonando la estructura técnica de `ServicesCta.tsx` pero adaptando los identificadores y el copy inicial.
**Validación**: El componente compila y se puede importar en `page.tsx`.

### Fase 2: Adaptación de Copy y Fases
**Objetivo**: Mapear el contenido de `GuaranteeCta.tsx` a las 3-4 fases de la animación de scroll.
- Fase 1: Garantía.
- Fase 2: Urgencia.
- Fase 3: Botón.
**Validación**: El texto es legible y las transiciones coinciden con el ritmo del scroll.

### Fase 3: Integración del Footer
**Objetivo**: Portar la estructura del footer existente al interior del componente dinámico, asegurando que use los mismos tokens de color y desenfoque.
**Validación**: El footer aparece correctamente al llegar al final del scroll (1.0 progress).

### Fase 4: Refinamiento Visual y Limpieza
**Objetivo**: Eliminar `GuaranteeCta.tsx` y `Footer.tsx` de `src/app/page.tsx` y ajustar z-index si hay colisiones con `GlassRefractionBackground`.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] La experiencia de usuario es fluida en desktop y mobile.
- [ ] El cierre de la página es consistente con el resto del branding.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.

### [2025-01-09]: Usar npm run dev, no next dev
- **Error**: Puerto hardcodeado causa conflictos.
- **Fix**: Siempre usar `npm run dev` (auto-detecta puerto).

---

## Gotchas
- El `scrollYProgress` depende de la altura del contenedor (`h-[250vh]`). Ajustar este valor si el copy es muy largo en mobile.
- Asegurar que `HeroButtonExpendable` o el botón similar usado en la landing principal sea compatible con la nueva posición.

---

*PRP pendiente aprobación. No se ha modificado código.*
