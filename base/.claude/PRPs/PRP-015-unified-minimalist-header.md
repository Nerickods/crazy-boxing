# PRP-015: Unified Minimalist Navigation (Mobile-to-Desktop Port)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-03
> **Proyecto**: KIA Intelligence

---

## Objetivo

Replicar el diseño minimalista del header móvil en la versión de escritorio, eliminando la navegación horizontal tradicional en favor de un sistema unificado basado en un drawer lateral (Global Menu). Esto busca una estética más limpia, cinematográfica y coherente con el posicionamiento de "Élite" de la marca.

## Por Qué

| Problema | Solución |
|----------|----------|
| La navegación de escritorio actual es genérica y rompe el minimalismo "Apple-style" que define la marca en móvil. | Aplicar el patrón de "Menú de Hamburguesa Premium" en desktop, ocultando los enlaces secundarios tras una interacción consciente. |

**Valor de negocio**: Refuerza la identidad visual premium (minimalismo sofisticado), mejora el enfoque del usuario en el CTA principal (IA Chat/Enroll) y reduce el ruido visual en la landing page.

## Qué

### Criterios de Éxito
- [ ] Eliminación total de los links `lg:flex` de navegación horizontal en el header.
- [ ] El botón de menú lateral debe ser el único punto de navegación secundaria en todos los viewports.
- [ ] Implementación de un drawer lateral con efecto glassmorphism (fondo `white/5` + `backdrop-blur-md`) que se sienta nativo en desktop.
- [ ] Sincronización perfecta con el logo morphing (Chat Orb) ya existente.
- [ ] Responsive Design: Ajustar el ancho del drawer en desktop para que no ocupe toda la pantalla (ej. `w-[400px]` fijo o similar).

### Comportamiento Esperado (Happy Path)
1. El usuario navega en escritorio.
2. Ve un header ultra-minimalista con el Logo/Chat Orb a la izquierda y un botón de "Menú" estilizado a la derecha.
3. Al hacer clic en el botón, se despliega un drawer lateral desde la derecha con un blur profundo sobre el contenido principal.
4. El drawer contiene los enlaces de navegación (`Servicios`, `Solución`, `Proceso`) en formato vertical grande y estilizado, y el CTA principal (`HeroButtonExpendable`) al pie.
5. El usuario puede cerrar el menú haciendo clic en el icono "X", en el backdrop, o seleccionando un enlace.

---

## Contexto

### Referencias
- `src/features/landing-page/components/Header.tsx` - Contiene la lógica actual de scroll y morphing.
- `src/features/landing-page/components/MobileMenu.tsx` - Base del drawer que se portará a desktop.
- `src/features/services/components/ui/HeroButtonExpendable.tsx` - CTA que debe estar presente en el menú.

### Arquitectura Propuesta (Refactor)
```
src/features/landing-page/components/
├── Header.tsx           # Se limpiará la nav desktop
├── NavigationDrawer.tsx # Refactor de MobileMenu para uso global (desktop/mobile)
└── MobileMenu.tsx      # DELETED (reemplazado por NavigationDrawer)
```

---

## Blueprint (Assembly Line)

### Fase 1: Limpieza y Preparación
**Objetivo**: Eliminar la navegación antigua y preparar el Header para el nuevo patrón.
**Validación**:
- Los links horizontales ya no son visibles en ninguna resolución.
- El botón de menú es visible y funcional en desktop.

### Fase 2: Refactor del Menú Global (NavigationDrawer)
**Objetivo**: Transformar el componente `MobileMenu` en un `NavigationDrawer` agnóstico al dispositivo.
**Validación**:
- El drawer se abre correctamente en desktop (resoluciones > 1024px).
- El ancho del drawer es consistente y estético en pantallas grandes.
- Los efectos de blur y glassmorphism funcionan en desktop.

### Fase 3: Pulido Visual y Animaciones
**Objetivo**: Ajustar las micro-animaciones (Framer Motion) para que se sientan "pesadas" y premium en pantallas grandes.
**Validación**:
- Transiciones suaves y consistentes con el resto de la página.
- El Backdrop bloquea la interacción correctamente.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end sin regresiones.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Navegación funciona en todas las secciones (solución, servicios, proceso, faq)
- [ ] Criterios de éxito cumplidos

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

---

## Gotchas

- [ ] Las anclas de scroll (`#proceso`, etc.) deben cerrar el menú automáticamente para evitar que el drawer bloquee la visualización tras el salto.
- [ ] El `Z-INDEX` del drawer debe estar por encima del Widget de Chat para evitar solapamientos visuales extraños.

## Anti-Patrones

- NO añadir backdrops opacos pesados; usar `bg-black/20` + `backdrop-blur-xl` para sensación de profundidad.
- NO usar componentes separados para móvil y desktop si el diseño es idéntico.

---

*PRP pendiente aprobación. No se ha modificado código.*
