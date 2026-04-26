# PRP-021: Professional Smooth Logo Carousel (Marquee)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-06
> **Proyecto**: KIA Intelligence

---

## Objetivo

Refactorizar la lógica de animación del `AnimatedCarousel` para reemplazar el salto abrupto entre logos (paginación por intervalos) por un deslizamiento continuo, suave e infinito (efecto Marquee profesional).

## Por Qué

| Problema | Solución |
|----------|----------|
| El salto "slide by slide" con `setInterval` hace que el carrusel de logos luzca brusco, amateur y se reinicie de golpe al llegar al final. | Implementación de un scroll lineal y continuo (auto-scroll) con `loop: true`, creando un efecto premium de ticker infinito. |

**Valor de negocio**: Mantiene la inmersión del usuario y el estándar "Apple-style" exigido por la marca, asegurando que la presentación de la infraestructura del "Invisible Stack" se perciba como una maquinaria perfectamente engrasada y de alta calidad.

## Qué

### Criterios de Éxito
- [ ] El carrusel se desplaza de manera constante (sin pausas entre logos).
- [ ] Efecto infinito: al llegar a los últimos logos, se conectan sin saltos visuales con los primeros.
- [ ] Integración del plugin `embla-carousel-auto-scroll` para mantener la coherencia con la arquitectura Shadcn UI existente, o uso de CSS/Framer Motion nativo.

### Comportamiento Esperado
Los logos de las tecnologías fluyen suavemente de derecha a izquierda de manera ininterrumpida a una velocidad constante (marquee). El usuario puede mirar los logos sin interrupciones bruscas.

---

## Contexto

### Referencias
- `src/components/ui/logo-carousel.tsx` actual cuenta con una lógica manual de `setInterval` que ejecuta `api.scrollNext()`.
- La base de datos es React 19 + Next.js 16 con `components/ui/carousel.tsx` basado en **Embla Carousel**.

### Arquitectura Propuesta (Feature-First)
Mantendremos el `Carousel` de Shadcn, pero aprovecharemos el sistema de plugins de Embla para inyectar `AutoScroll` y la opción `loop: true`.

```tsx
// Lógica a reemplazar:
// const timer = setTimeout(() => api.scrollNext(), interval);

// Lógica nueva:
import AutoScroll from "embla-carousel-auto-scroll"
<Carousel 
  opts={{ loop: true, dragFree: true }} 
  plugins={[AutoScroll({ speed: 1, playOnInit: true })]}
>
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase

### Fase 1: Instalación de Motor de Scroll Continuo
**Objetivo**: Instalar el plugin de Embla Carousel diseñado para scroll ininterrumpido.
**Validación**: `npm install embla-carousel-auto-scroll` ejecutado con éxito.

### Fase 2: Refactorización de Logo Carousel
**Objetivo**: Eliminar los hooks manuales (`useEffect` con `setTimeout`) y sustituirlos por la inyección directa del plugin en el wrapper `<Carousel>`.
**Validación**: Código limpio sin control de estado manual errático. Embla asume el control del motor de físicas.

### Fase N: Validación Final
**Objetivo**: Verificación sintáctica y visual de fluidez.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] El deslizamiento es constante (no hay paradas ni "snapping" brusco).
- [ ] Inclusión de `pointer-events-none` o `dragFree` para evitar que las interacciones accidentales frenen de golpe la animación (opcional, dependiendo de si se desea interacción).

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-06]: Pendiente inicialización
- **Error**: Carruseles de logos "a saltitos" con `setInterval` arruinan la percepción de diseño premium.
- **Fix**: Usar siempre un enfoque Marquee continuo (Embla AutoScroll o Framer Motion) para listas de clientes o stacks tecnológicos.
- **Aplicar en**: Todo componente futuro de "Trusted By" o "Powered By".

---

## Gotchas

- [ ] Si los ítems no son suficientes para llenar la pantalla en monitores ultrawide, `loop: true` puede presentar fallas visuales. Solución: Duplicar programáticamente el array de logos internamente (`[...logos, ...logos]`).

## Anti-Patrones

- NO usar `setInterval` para animaciones de UI fluidas en React; compite contra el ciclo de renderizado y el motor de refresh (60hz/120hz), causando jank (tirones).

---

*PRP pendiente aprobación. No se ha modificado código.*
