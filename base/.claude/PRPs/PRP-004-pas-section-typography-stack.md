# PRP-004: PasSection Typography Stack (Persistent Focus)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-25
> **Proyecto**: landing-linkedin

---

## Objetivo

Evolucionar el flujo PAS hacia un sistema de "Pila Tipográfica Persistente". A diferencia del flujo anterior donde los textos desaparecían, ahora el título previo se desplazará hacia arriba y reducirá su opacidad (quedando "sombreado") pero permanecerá visible y legible mientras el nuevo título toma el centro. También se optimizará el tamaño de la tipografía para un look más refinado y menos invasivo.

## Por Qué

| Problema | Solución |
|----------|----------|
| El texto desaparece por completo, lo que puede romper el hilo conductor del mensaje PAS. | Mantener el texto previo con opacidad reducida (`~0.3`) para servir de contexto visual. |
| El tamaño de letra actual (`text-7xl`) puede ser demasiado grande para algunos viewports o estilos de marca. | Reducir el tamaño de fuente (`text-3xl` a `text-5xl`) para una estética más sofisticada y profesional. |

**Valor de negocio**: Refuerza la narrativa de "acumulación de problemas" (Agitación) al mantener los puntos anteriores visibles, creando una sensación de peso emocional acumulativo antes de la solución.

## Qué

### Criterios de Éxito
- [ ] Los títulos antiguos permanecen visibles al 30% de opacidad sobre el título activo.
- [ ] La tipografía se reduce para mejorar la composición visual.
- [ ] Movimiento vertical fluido donde los textos se apilan en la parte superior sin colisionar visualmente de forma caótica.
- [ ] El efecto de desenfoque se mantiene para la transición, pero desaparece al quedar en estado "sombreado".

### Comportamiento Esperado
1. El usuario scrollea y aparece el Título 1 en el centro (100% opacidad).
2. Al seguir scrolleando, el Título 1 sube ligeramente y baja a 30% de opacidad.
3. Simultáneamente, el Título 2 entra al centro (100% opacidad).
4. El Título 1 se mantiene arriba, sombreado, mientras leemos el 2. El proceso se repite.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx` - Implementación actual (Vertical Flow).
- Estilo: "Sticky Scrolling Headlines" (común en landings premium de SaaS).

### Arquitectura Propuesta
Ajuste de los componentes `ScrollTitleFlow` y refinamiento de la escala tipográfica en el stack.

---

## Blueprint (Assembly Line)

### Fase 1: Reducción de Escala Tipográfica
**Objetivo**: Ajustar el tamaño de fuente y padding para un diseño más equilibrado.
**Validación**: El texto se ve premium y no ocupa toda la pantalla de forma agresiva.

### Fase 2: Lógica de Persistencia (Opacity Stack)
**Objetivo**: Modificar los rangos de `useTransform` para que la opacidad mínima sea `0.3` en lugar de `0`.
**Validación**: Los títulos anteriores son visibles pero no compiten por la atención.

### Fase 3: Ajuste de Offsets Verticales
**Objetivo**: Asegurar que los títulos "sombreados" tengan un `y` offset que los mantenga legibles arriba del centro.
**Validación**: No hay solapamiento de textos que impida la lectura.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] El usuario confirma que la "Pila Tipográfica" se siente perfecta.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

---

## Gotchas

- [ ] Si hay muchos títulos, el espacio superior puede llenarse. Limitar la persistencia a los últimos 2-3 si es necesario (en este caso son 4, debería estar bien).
- [ ] El `z-index` es crítico para que el nuevo texto siempre pase "sobre" o "debajo" del sombreado según el efecto deseado.

---

*PRP pendiente aprobación. No se ha modificado código.*
