# PRP-016: Mobile Header Redesign - Morningside Style

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-02
> **Proyecto**: KIA Intelligence

---

## Objetivo

Rediseñar el Header para dispositivos móviles siguiendo la estética de Morningside.ai: invisibilidad total al inicio, transición dinámica al scrollear (ocultando el nombre del proyecto pero manteniendo el logo), y reemplazo del botón "Login" por un menú lateral funcional con accesos específicos.

## Por Qué

| Problema | Solución |
|----------|----------|
| El header actual ocupa espacio visual constante y tiene un botón "Login" innecesario para el usuario final. | Un header invisible permite una experiencia "cinemática" en el Hero, y el menú compacto prioriza la conversión (CTA) y servicios. |

**Valor de negocio**: Mejora la percepción de marca y profesionalismo (estilo Apple/élite), reduce distracciones y facilita la navegación móvil hacia los servicios.

## Qué

### Criterios de Éxito
- [ ] Header 100% transparente y sin bordes al cargar la página (scroll = 0).
- [ ] Al scrollear (> 50px), el header muestra fondo (glassmorphism) y borde sutil.
- [ ] El nombre "KIA Intelligence" desaparece en móvil al scrollear, dejando solo el logo.
- [ ] Botón "Login" eliminado.
- [ ] Icono de menú (hamburger) funcional en la esquina superior derecha.
- [ ] Menú lateral/drawer con links a `/services` y un botón de CTA con la lógica de "Lista de espera".

### Comportamiento Esperado
1. **Carga**: Usuario ve el Hero sin obstrucciones del header (solo el logo flotando sutilmente).
2. **Scroll**: El header adquiere un fondo semi-transparente. El texto "KIA Intelligence" se desvanece suavemente.
3. **Interacción**: Al pulsar el menú, se despliega un drawer desde la derecha con los links y el CTA destacado.

---

## Contexto

### Referencias
- `src/features/landing-page/components/Header.tsx` - Archivo actual a modificar.
- `src/features/landing-page/components/GuaranteeCta.tsx` - Referencia para la lógica del CTA final.
- Estética Morningside.ai: [Imagen compartida por el usuario]

### Arquitectura Propuesta (Feature-First)
```
src/features/landing-page/components/
├── Header.tsx           # Modificación de lógica de scroll y logo
└── MobileMenu.tsx      # [NUEVO] Componente del drawer de navegación
```

---

## Blueprint (Assembly Line)

### Fase 1: Lógica de Scroll e Invisibilidad
**Objetivo**: Implementar el estado de scroll y los estilos dinámicos del header.
**Validación**: El header debe ser invisible en el top y aparecer con fondo al scrollear.

### Fase 2: Rediseño del Logo y Remoción de Login
**Objetivo**: Ajustar el comportamiento del logo para ocultar el nombre en mobile y quitar el botón de Login.
**Validación**: El nombre "Intelligence" debe desaparecer suavemente al bajar en móvil.

### Fase 3: Componente de Menú Móvil
**Objetivo**: Crear el componente `MobileMenu` usando `framer-motion` (o `radix`) con los links solicitados.
**Validación**: El menú debe abrirse/cerrarse correctamente y contener el link a `/services` y el CTA.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end con fluidez.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Playwright screenshot confirma la invisibilidad inicial y el estado scrolleado.
- [ ] Navegación del menú funciona.

---

## Gotchas
- El logo está envuelto en un `Link`. Debemos asegurar que el área de click sea coherente incluso cuando el nombre se oculte.
- El efecto "invisibilidad" no debe romper la accesibilidad ni la interacción con elementos del Hero.

## Anti-Patrones
- No duplicar el código del Header completo; usar composición de componentes.
- No usar variables de estado globales si le scroll puede manejarse localmente en el Header.

---

*PRP pendiente aprobación. No se ha modificado código.*
