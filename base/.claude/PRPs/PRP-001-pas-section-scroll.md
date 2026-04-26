# PRP-001: Overhaul PasSection with Morningside AI Scroll Effect

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-25
> **Proyecto**: landing-linkedin

---

## Objetivo

Reemplazar la sección estática actual `PasSection.tsx` por una experiencia inmersiva de scroll-driven "sticky stack" donde los bloques de texto se apilan y el fondo transiciona a un degradado brillante, inspirada en [Morningside AI](https://www.morningside.ai/).

## Por Qué

| Problema | Solución |
|----------|----------|
| La sección actual es estática y poco atractiva visualmente. | Un efecto de scroll dinámico aumenta el tiempo de retención y transmite vanguardia tecnológica. |

**Valor de negocio**: Refuerza el posicionamiento de "infraestructura de ventas de élite" mediante una interfaz pixel-perfect y animaciones fluidas.

## Qué

### Criterios de Éxito
- [ ] Implementación de `position: sticky` que apile 4 bloques de texto centralmente.
- [ ] Control de opacidad fluido basado en el progreso del scroll (0% a 100%).
- [ ] Transición de fondo de negro sólido (`#000`) a degradado vibrante (`accent-cyan` variants).
- [ ] Responsividad total (ajuste de tamaños de fuente y espaciado en mobile).
- [ ] Rendimiento óptimo (60fps) usando Framer Motion.

### Comportamiento Esperado (Happy Path)
1. El usuario entra a la sección (fondo oscuro).
2. Al hacer scroll, los logos iniciales se desvanecen.
3. El primer bloque ("Problema") aparece y se queda fijo.
4. Al seguir bajando, el segundo bloque ("Agitación") aparece debajo del primero y se une a la pila fija.
5. Se repite para el tercer y cuarto bloque.
6. A mitad del proceso, el fondo comienza a iluminarse con un degradado.
7. Al final, toda la pila se desplaza para revelar el CTA final.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Archivo actual a modificar.
- [Morningside AI](https://www.morningside.ai/) - Referencia visual y funcional.
- Hooks de Framer Motion: `useScroll`, `useTransform`, `useSpring`.

### Arquitectura Propuesta (Feature-First)
Se mantendrá dentro de la feature existente pero se refactorizará el componente:
```
src/features/landing-page/components/
├── PasSection.tsx (Refactorizado)
└── ScrollTextItem.tsx (Nuevo sub-componente opcional)
```

---

## Blueprint (Assembly Line)

### Fase 1: Mapeo y Estructura Base
**Objetivo**: Establecer el contenedor con altura extendida (`400vh`+) y los elementos `sticky`.
**Validación**: Los elementos se mantienen fijos en pantalla mientras se desplaza el scroll nativo.

### Fase 2: Implementación de Animación de Scroll
**Objetivo**: Vincular el progreso del scroll a la opacidad de cada bloque de texto usando Framer Motion.
**Validación**: Los textos aparecen secuencialmente en los umbrales definidos (0.2, 0.4, 0.6, 0.8).

### Fase 3: Efectos de Fondo y Pulido Visual
**Objetivo**: Implementar la capa de transicion de fondo (Background Fade) y el degradado.
**Validación**: El fondo cambia suavemente de negro a color de IA al llegar al final del scroll.

### Fase 4: Validación Final y Mobile
**Objetivo**: Asegurar que la experiencia es premium en todas las resoluciones.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Playwright confirma la visibilidad de los 4 bloques al final del scroll.

---

## 🧠 Aprendizajes

*(Se completará durante la ejecución)*

---

## Gotchas
- El uso de `sticky` requiere que ningún contenedor padre tenga `overflow: hidden` excepto el raíz si es necesario.
- Framer Motion `useScroll` puede necesitar el `target` ref del contenedor para mayor precisión.

## Anti-Patrones
- No usar `useEffect` con listeners manuales de scroll si Framer Motion puede manejarlo de forma declarativa.
- Evitar layouts complejos que rompan el centrado vertical del "stack".

---

*PRP pendiente aprobación. No se ha modificado código.*
