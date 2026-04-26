# PRP-011: Preservación de Texto como Título de Cierre

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-22
> **Proyecto**: landing-linkedin

---

## Objetivo

Transformar el texto de la Fase 2 (Urgencia/Core) en un título persistente que se posicione sobre el CTA final al terminar el scroll, en lugar de desvanecerse.

## Por Qué

| Problema | Solución |
|----------|----------|
| Pérdida de contexto: al desvanecerse el texto antes del CTA, se pierde la conexión emocional del mensaje ("Deja de ser un espectador"). | Reposicionamiento dinámico: el texto subirá hacia el tercio superior de la pantalla mientras el CTA aparece en el centro, creando una composición jerárquica clara. |

**Valor de negocio**: Mejora la tasa de conversión al mantener el mensaje persuasivo visible en el momento de la decisión (CTA).

## Qué

### Criterios de Éxito
- [ ] El texto de Fase 2 permanece visible (opacidad >= 0.6) al final del scroll.
- [ ] El texto se desplaza hacia arriba (`y` negativo) para no colisionar con el botón de CTA.
- [ ] La transición es fluida y sincronizada con la aparición del CTA y el Footer.

### Comportamiento Esperado
Al llegar al 88% del scroll, el texto central comenzará a subir y encogerse levemente, posicionándose como un encabezado "Cinemático" justo antes de que el botón de acción alcance su posición final.

---

## Contexto

### Referencias
- `src/features/landing-page/components/LandingCta.tsx`
- `src/features/services/components/ServicesCta.tsx`

---

## Blueprint (Assembly Line)

### Fase 1: Ajuste de Interpolación
**Objetivo**: Modificar `text2Opacity`, `text2Y` y `text2Scale`.
**Validación**: El texto termina en la posición deseada sin tapar el botón.

### Fase 2: Refinamiento de Estilo
**Objetivo**: Asegurar que la escala reducida mantenga la legibilidad.
**Validación**: Visual check en diferentes viewports.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-04-22: Transiciones de Estado en Scroll
- **Concepto**: Los elementos no siempre necesitan "morir" para dar paso a otros. Pueden "evolucionar" su rol dentro de la composición (de protagonista a título).

---

*PRP pendiente aprobación.*
