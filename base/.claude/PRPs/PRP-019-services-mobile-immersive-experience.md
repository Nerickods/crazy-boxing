# PRP-019: Experiencia Inmersiva de Servicios Mobile

> **Estado**: APROBADO
> **Fecha**: 2026-04-02
> **Proyecto**: Kia Intelligence

---

## Objetivo

Transformar la sección `BenefitsList` en una experiencia de usuario de élite en dispositivos móviles, incorporando tres mejoras coordinadas:
1. **Subir las tarjetas** para que no queden ocultas por la barra de proceso flotante.
2. **Progress Bar Fluida**: Mantener la estetica actual pero sincronizar el avance con el scroll real del componente (no solo saltos por seccion) para un movimiento 1:1 con la progresion.
3. **Header Dinamico**: Al entrar completamente a la seccion de servicios, el header vuelve a su estado "Hero" (transparente, sin blur). Al salir de ella hacia la siguiente seccion, vuelve a su estado glassmorphic/compacto.
ntinuidad visual cinematográfica.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las 3 tarjetas quedan tapadas por la barra de proceso flotante al entrar a la sección | Ajustar `padding-bottom` de `.fx-content` en mobile para crear espacio suficiente |
| No hay feedback visual de dónde se encuentra el usuario en la sección (0-100%) | Rediseñar la barra de progreso con porcentaje animado + nombre de tarjeta activa |
| Al scrollear desde el Hero al BenefitsList hay un quiebre visual brusco | Replicar el efecto de header transparente/glassmorphic unificado que se funde con el cinematic scroll |

**Valor de negocio**: Experiencia premium que refleja el nivel de la marca KIA Intelligence; reduce el abandono en mobile y aumenta la percepción de calidad en el primer scroll.

## Qué

### Criterios de Éxito
- [ ] Las 3 tarjetas son completamente visibles en iPhone 12/13/14 (390x844) sin ser tapadas por la barra de progreso
- [ ] La barra de progress muestra `0% → 100%` con animación suave al scrollear entre las 3 secciones
- [ ] El nombre de la tarjeta activa se muestra en la progress bar (ej: "Landing · 01/03")
- [ ] Al entrar a la sección de servicios, el header glassmorphic persiste con la misma transparencia que en el Hero
- [ ] Sin regresión en desktop (layout >900px sin cambios)

### Comportamiento Esperado (Happy Path)

1. Usuario llega al Hero → ve el header KIA Intelligence transparente
2. Scrollea hacia abajo → al primer `px` que toca la sección `#benefits-scroll-fx`, el header **no cambia**, mantiene transparencia total (glassmorphic)
3. Las primeras 3 tarjetas de "Landing de Alta Conversión" son visibles por completo
4. En la esquina inferior derecha (mobile) aparece una **mini progress bar circular o lineal** que muestra: `░░░ 33%` con el texto "LANDING · 01/03" debajo
5. Al scrollear a la segunda sección (agente-ia), la barra salta a 66%, muestra "AGENTE IA · 02/03"
6. Al scrollear a la tercera (dashboard-crm), llega a 100%, muestra "DASHBOARD · 03/03"

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` — componente principal a modificar
- `src/shared/components/ui/full-screen-scroll-fx.tsx` — contiene CSS crítico de layout y progress bar
- `src/features/landing-page/components/Header.tsx` — patrón de glassmorphic header a replicar
- `.fx-progress`, `.fx-progress-fill` — selectores CSS actuales de la barra

### Estado Actual (Findings)
1. **Cards tapadas**: `padding-bottom: 40px` en mobile no deja suficiente espacio para la barra de progreso y el `fx-footer`. Las tarjetas de la tercera sección quedan visualmente cubiertas.
2. **Progress Bar básica**: Actualmente es una línea horizontal de `200px` en el footer central con `01/03` y `03/03`. Sin porcentaje, sin nombre de sección, sin posición mobile adecuada.
3. **Header**: `Header.tsx` usa `isScrolled` que se activa con `window.scrollY > 20`. Al entrar a `BenefitsList` el usuario ya ha hecho scroll y el header está en estado compactado con blur. No hay lógica que diferencie "estoy en la sección de servicios".

### Arquitectura (no se crea nueva feature, se mejoran componentes existentes)
```
src/features/landing-page/components/
└── BenefitsList.tsx         [MODIFY] — añade sectionNames para progress bar

src/shared/components/ui/
└── full-screen-scroll-fx.tsx [MODIFY] — rediseña progress bar y ajusta CSS mobile

src/features/landing-page/components/
└── Header.tsx               [MODIFY] — añade detección de sección #benefits-scroll-fx
                                        para forzar modo glassmorphic-transparente
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase.

### Fase 1: Ajuste de Cards (Subir tarjetas en mobile)
**Objetivo**: Que las 3 tarjetas sean completamente visibles sin ser cubiertas por el footer/progress bar en mobile.
**Cambios**: 
- Reducir `content-top` padding en mobile de `260px` a `200px`.
- Agregar `padding-bottom: 100px` en `.fx-content` mobile para dejar espacio al footer.
- Reducir margen superior del `FeatureGrid` (`mt-8`) a `mt-4` en mobile.
**Validación**: Las 3 tarjetas entran en el viewport 390x844 sin scroll interno.

### Fase 2: Progress Bar Fluida
**Objetivo**: Sincronizar el avance de la barra con el scroll real (0-1) del componente.
**Cambios**:
- En `FullScreenScrollFX`: Usar `self.progress` del ScrollTrigger para actualizar `progressFillRef.current.style.width` de forma continua.
- Eliminar cualquier indicativo de porcentaje literal (%), mantener solo la linea con glow.
**Validación**: La barra avanza suavemente con cada pixel de scroll, no solo al cambiar de seccion.

### Fase 3: Header Situacional (Hero Mirror)
**Objetivo**: Replicar la transparencia del Hero UNICAMENTE mientras se esta en la seccion de servicios.
**Cambios en `Header.tsx`**:
- Usar `IntersectionObserver` para detectar entrada/salida de `#benefits-scroll-fx`.
- Si se esta dentro, forzar estilos de transparencia total.
- Al avanzar a la siguiente seccion (salida inferior), restaurar el glassmorphism.
**Validación**: Header transparente en Hero, compacto en transicion, transparente en Servicios, compacto en el resto.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end sin regresiones.
**Validación**:
- [ ] `npm run typecheck` pasa sin errores
- [ ] `npm run build` exitoso
- [ ] Commit pushed a `feature/ai-chatbot-admin`
- [ ] Criterios de éxito cumplidos (confirmar con el usuario)

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-04-02: Browser subagent cancelado por el usuario
- **Error**: Intentar tomar screenshots automáticamente con browser subagent genera fricción.
- **Fix**: Entregar cambios y pedir feedback manual al usuario.
- **Aplicar en**: Todos los PRPs de este proyecto. No usar browser subagent sin confirmación explícita.

---

## Gotchas

- [ ] `IntersectionObserver` debe tener `threshold: 0` para detectar el primer pixel de entrada a la sección
- [ ] El `isScrolled` del header usa `window.scrollY > 20` — al entrar a services el usuario ya tiene scrollY alto, hay que añadir condición adicional (no reemplazar la existente)
- [ ] `fx-footer` esta en el flujo del grid (`grid-column: 1/13`) — moverlo a `fixed bottom` en mobile requiere usar `position: fixed` con media query, sin romper el layout desktop
- [ ] `showProgress` es un boolean prop en `FullScreenScrollFX` — hay que preservar backward compatibility
- [ ] El `padding: 260px 1rem 40px` actual en `.fx-content` mobile tiene top muy alto (por el overlap del header). Al bajarlo, verificar que el header no cube el título de sección

## Anti-Patrones

- NO crear un nuevo componente Progress Bar si se puede extender el existente
- NO usar `setState` en cada frame del scroll (usar refs + directo al DOM para performance)
- NO romper el layout desktop al mover la progress bar en mobile

---

*PRP aprobado. Listo para ejecutar vía bucle agéntico por fases.*
