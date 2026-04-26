# PRP-007: Reestructuración de Copy en AuthorityGuide

> **Estado**: PENDIENTE
> **Fecha**: 2024-05-14
> **Proyecto**: landing-linkedin

---

## Objetivo

Actualizar la sección `AuthorityGuide` (Carrusel tecnológico e Historia del Fundador) para eliminar el lenguaje de "agencia genérica y negocios locales", reemplazándolo por una narrativa de "Arquitectura de Autor" orientada a CEOs, justificando el modelo high-ticket (solo 2 proyectos por mes).

## Por Qué

| Problema | Solución |
|----------|----------|
| El copy actual ("herramientas para desarrollos a medida", "negocios locales", "empleo agotador") disminuye el estatus de la oferta y choca con el tono agresivo/premium de las secciones anteriores. | Inyectar un tono clínico y de autoridad que posicione la tecnología como un "Arsenal" y al fundador como el "Arquitecto" que resuelve la asfixia operativa. |

**Valor de negocio**: Aumentar la credibilidad técnica y justificar la escasez extrema (2 proyectos/mes), filtrando curiosos y atrayendo clientes de alto valor (CEOs) preparados para una inversión High-Ticket.

## Qué

### Criterios de Éxito
- [ ] Título del carrusel tecnológico actualizado para sonar como un ecosistema de élite.
- [ ] Título de la historia del fundador actualizado para apuntar al dolor del CEO.
- [ ] Párrafo fundacional actualizado para justificar la escasez (2 clientes/mes) y el rol de Arquitecto.

### Comportamiento Esperado
El componente `AuthorityGuide.tsx` será actualizado internamente (JSX) sin alterar su estructura HTML, animaciones ni responsiveness. Los textos serán reemplazados por el copy maestro validado.

---

## Contexto

### Referencias
- `src/features/landing-page/components/AuthorityGuide.tsx`
- Tono: "Arquitectura de Autor" (establecido en `ProcessSection.tsx` y `EnrollmentModal.tsx`).

### Análisis NotebookLM (Copy Propuesto)

Basado en nuestro framework de Copywriting de élite, se propone sustituir los elementos actuales por los siguientes:

**1. Título del Carrusel Tecnológico**
*   *Actual:* "Herramientas que usamos para nuestros desarrollos personalizados a medida"
*   **Propuesta Principal:** "El Arsenal Tecnológico que Destruye tu Dependencia de Agencias"
*   *(Alternativa:* "Ingeniería de Élite: El Motor detrás de tu Stack Invisible")

**2. Título de la Historia del Fundador**
*   *Actual:* "De trabajar 6 días a la semana a democratizar la IA."
*   **Propuesta Principal:** "El Arquitecto detrás de tu Independencia Operativa."
*   *(Alternativa:* "El fin del software tradicional: Por qué diseño ecosistemas para la élite.")

**3. Párrafo de la Historia del Fundador (Master Copy)**
*   *Actual:* Se enfoca en el pasado laboral agotador y negocios locales.
*   **Propuesta Definitiva:** "He visto de primera mano cómo empresas que facturan cientos de miles se asfixian lentamente, convertidas en rehenes de agencias lentas y procesos manuales. A mis 20 años tuve una revelación absoluta: el desarrollo de software tradicional ha muerto; la tecnología de élite hoy debe ser totalmente invisible. Como tu arquitecto personal, mi única misión es orquestar el ecosistema autónomo que absorba el peso de tu operación diaria. Yo resuelvo la complejidad técnica más extrema para que tú recuperes el control total de tu tiempo y tu empresa. Este nivel de rigor y trabajo hecho a mano es la razón por la que limito mi acceso a solo 2 CEOs al mes."

---

## Blueprint (Assembly Line)

### Fase 1: Inyección de Copy de Autoridad
**Objetivo**: Reemplazar textos estáticos en `AuthorityGuide.tsx`.
**Validación**: Revisión de código confirmando la inclusión del "Master Copy".

### Fase 2: Validación Visual y Responsive
**Objetivo**: Asegurar que las nuevas cadenas de texto se adapten al layout de 2 columnas y al mobile.
**Validación**: Revisión visual simulada (y typecheck).

---

## Gotchas

- Mantener la sintaxis de spans coloreados si es aplicable, cuidando no romper el renderizado JSX.

---

*PRP pendiente aprobación. No se ha modificado código.*
