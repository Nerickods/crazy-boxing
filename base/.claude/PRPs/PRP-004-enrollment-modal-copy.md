# PRP-004: Actualización de Copy en EnrollmentModal (Escasez y Urgencia)

> **Estado**: APROBADO
> **Fecha**: 2026-04-14
> **Proyecto**: KIA Intelligence

---

## Objetivo

Reemplazar el copy de infraestructura técnica en la sección izquierda del `EnrollmentModal` ("Telemetría y Control Absoluto", "Núcleo Cognitivo de Alta Disponibilidad") por mensajes anclados firmemente en escasez (solo 2 proyectos por mes) y urgencia (garantía de congelamiento de precio).

## Por Qué

| Problema | Solución |
|----------|----------|
| El copy actual del modal es descriptivo (se enfoca en los "fierros"), lo cual no incentiva que el usuario tome acción de manera inmediata. | Cambiar el enfoque final de conversión a persuasión pura: por qué debe enviar el formulario HOY y no mañana. |

**Valor de negocio**: Maximizar la tasa de conversión en el popup de cierre. Al recordar la limitación física (artesanal/solo developer) y el inminente aumento del 30% el 1 de Mayo, logramos que el prospecto concrete la acción.

## Qué

### Criterios de Éxito
- [ ] Transmitir explícitamente el límite: "2 proyectos/mes" (Calidad de autor, no agencia masiva).
- [ ] Transmitir la "Garantía de Congelamiento" (evitar aumento programado del 30%).
- [ ] Respetar la estructura visual actual de dos ítems (Títulos cortos e impactantes + bajada de 1-2 líneas máximo).
- [ ] Proponer íconos nuevos de Lucide que combinen mejor con escasez/protección, en lugar de `BarChart3` y `Globe2`.

### Comportamiento Esperado
Cuando el usuario abra el modal, en lugar de leer "Telemetría y..." leerá advertencias sobre la exclusividad del servicio y su protección financiera.

---

## Contexto

### Referencias
- `BUSINESS_LOGIC.md` -> La exclusividad y cupos limitados, y la garantía del precio congelado por el aumento de Mayo.
- `src/features/services/components/ui/EnrollmentModal.tsx` -> El modal actual.

---

## Blueprint (Assembly Line)

### Fase 1: Generación y Selección de Copy (NotebookLM)
**Objetivo**: Generar 3 opciones contundentes cruzando `BUSINESS_LOGIC` con el curso de Copywriting en NotebookLM.
**Validación**: Selección humana o análisis de NotebookLM del mejor abordaje asertivo y coercitivo (ético).

### Fase 2: Implementación Estructural
**Objetivo**: Modificar los textos y cambiar de íconos en el componente.
**Validación**: Verificar visualmente el largo de las nuevas características para asegurar que el diseño sea perfecto tanto en móvil como en desktop.

### Fase N: Validación Final
**Objetivo**: Modal funcional y persuasivo end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] Diseño en pantalla no roto
- [ ] Flujo completo validado

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-14]: Inicialización
- **Error**: N/D
- **Fix**: N/D
- **Aplicar en**: N/D

---

## Gotchas

- [ ] Cuidar el length del texto: La bajada actual es de ~15 palabras. El nuevo copy debe ser conciso.
- [ ] Mantener el tono sofisticado pero directo. No parecer desesperados.
