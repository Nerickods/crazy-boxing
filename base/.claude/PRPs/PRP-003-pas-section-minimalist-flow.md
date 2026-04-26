# PRP-003: PasSection Minimalist Flow (Cinematic Titles)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-25
> **Proyecto**: landing-linkedin

---

## Objetivo

Transformar la sección PAS en una experiencia minimalista y cinemática. Se eliminarán las descripciones detalladas para centrar la atención en el Título y el Icono, implementando un flujo de scroll donde los textos se desplazan verticalmente y se desvanecen de forma elegante, eliminando cualquier distracción visual como indicadores de progreso o bordes de tarjetas pesados.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las descripciones largas pueden diluir el impacto visual del mensaje principal en una landing de alta conversión. | Eliminar `description` y dejar solo el `icon` + `title` para un impacto tipo "punchline". |
| Los indicadores de progreso (puntos) y el estilo de tarjetas estáticas rompen la inmersión cinemática. | Eliminar indicadores y usar un flujo de "desplazamiento vertical infinito" (parallax/focus reveal) donde un título empuja al otro hacia arriba. |

**Valor de negocio**: Aumenta la velocidad de lectura y el impacto emocional del "dolor" (PAS), guiando al usuario rápidamente hacia la solución sin fricción cognitiva.

## Qué

### Criterios de Éxito
- [ ] Eliminación total de descripciones y puntos de progreso.
- [ ] Efecto "Vertical Flow": el título actual sube y se opaca al salir, mientras el siguiente sube y gana nitidez al entrar.
- [ ] Enfoque tipográfico: el texto es el protagonista absoluto.
- [ ] Transiciones ultra-fluidas con `framer-motion` (physics-based).

### Comportamiento Esperado
1. El usuario entra y ve el Logo Intro.
2. Al scrollear, el primer Título + Icono aparece en el centro.
3. Al seguir scrolleando, el Título 1 sube (negative Y) y baja opacidad a 0.
4. Simultáneamente, el Título 2 sube desde abajo (positive Y) hacia el centro y sube opacidad a 1.
5. El proceso se repite hasta llegar al CTA final.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Base actual a simplificar.
- Estilo: Apple "Statement" scroll (ej: tipografía gigante que fluye).

### Arquitectura Propuesta
Refactorización del componente `ScrollTextItem` para convertirlo en `ScrollTitleFlow`.

---

## Blueprint (Assembly Line)

### Fase 1: Limpieza de Contenido
**Objetivo**: Eliminar `description` y el componente de puntos de progreso. Simplificar el objeto `items`.
**Validación**: Solo Icono + Título aparecen en el código y en pantalla.

### Fase 2: Lógica de "Vertical Flow"
**Objetivo**: Ajustar los `useTransform` de `y` y `opacity` para que el movimiento sea puramente vertical (entrada desde abajo, salida hacia arriba).
**Validación**: Los títulos no se "apilan", sino que fluyen uno tras otro.

### Fase 3: Ajustes Estéticos (Glass Removal)
**Objetivo**: Eliminar los bordes y fondos de tarjeta para dejar el texto "flotando" sobre el fondo dinámico.
**Validación**: Look & Feel mucho más limpio y cinemático.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] El usuario confirma que el flujo es "perfecto y minimalista".

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

---

## Gotchas

- [ ] Sin descripción, el `items.map` debe estar bien centrado verticalmente para no dejar mucho espacio vacío.
- [ ] La velocidad del scroll debe ser coherente con el tiempo de lectura del título.

---

*PRP pendiente aprobación. No se ha modificado código.*
