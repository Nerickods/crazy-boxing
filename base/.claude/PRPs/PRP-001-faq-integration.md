# PRP-001: Integración de Base UI Accordion en FAQs

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-17
> **Proyecto**: landing-linkedin

---

## Objetivo

Migrar la sección de Preguntas Frecuentes (FAQs) de una implementación manual de estado a un sistema robusto y accesible basado en `@base-ui/react/accordion`, mejorando la mantenibilidad y la experiencia de usuario (UX).

## Por Qué

| Problema | Solución |
|----------|----------|
| Implementación manual de acordeón con lógica de estado ad-hoc en el componente de UI. | Uso de un componente primitivo especializado (`Base UI`) que maneja accesibilidad, estados y transiciones nativamente. |
| Dependencia de iconos externos (`material-symbols-outlined`) que pueden causar inconsistencias visuales. | Unificación con `lucide-react` para iconos vectoriales limpios y consistentes. |

**Valor de negocio**: Mejora la percepción de calidad "premium" del sitio, asegura accesibilidad (A11y) y facilita la expansión futura de la sección de soporte.

## Qué

### Criterios de Éxito
- [ ] Nuevo componente primitivo `coss-accordion.tsx` instalado en `src/components/ui/`.
- [ ] Dependencias `@base-ui/react` y `lucide-react` instaladas y configuradas.
- [ ] Sección de FAQs refactorizada para usar el nuevo acordeón sin perder el estilo visual actual.
- [ ] Soporte para apertura múltiple o simple de acordeones según configuración.
- [ ] Transiciones de apertura/cierre fluidas y suaves.

### Comportamiento Esperado
El usuario entra a la sección de FAQs. Al hacer clic en una pregunta, el acordeón se despliega suavemente mostrando la respuesta. El icono de flecha rota 180 grados para indicar el estado abierto. La altura del panel se anima automáticamente.

---

## Contexto

### Referencias
- `src/features/landing-page/components/FaqAccordion.tsx` - Componente actual a refactorizar.
- `src/components/ui/` - Directorio destino para la nueva primitiva.
- [Base UI Accordion Docs](https://base-ui.com/react/components/accordion) - Referencia de API.

### Arquitectura Propuesta (Feature-First)
```
src/
├── components/
│   └── ui/
│       └── coss-accordion.tsx   # [NUEVO] Primitiva Base UI
└── features/
    └── landing-page/
        └── components/
            └── FaqAccordion.tsx # [MODIFICAR] Implementación final
```

---

## Blueprint (Assembly Line)

### Fase 1: Infraestructura y Primitiva
**Objetivo**: Instalar dependencias y crear el componente base.
**Validación**: El componente `Accordion` es importable y no tiene errores de tipos.

### Fase 2: Refactorización de FAQs
**Objetivo**: Reemplazar la lógica de estado manual en `FaqAccordion.tsx` por la nueva primitiva.
**Validación**: Las preguntas se abren y cierran correctamente manteniendo el diseño "glassmorphism" actual.

### Fase 3: Pulido y Estilos
**Objetivo**: Asegurar que las animaciones de Base UI coincidan con la estética premium del proyecto.
**Validación**: Screenshot visual confirma que no hay regresiones de diseño.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-17]: Transiciones en Base UI
- **Nota**: Base UI usa variables CSS para la altura del panel (`--accordion-panel-height`). Es crítico asegurar que el CSS de Tailwind soporte estas transiciones en el contenedor del panel.

---

## Gotchas
- [ ] Base UI requiere React 18+ o 19. Verificar compatibilidad en `package.json`.
- [ ] El actual `FaqAccordion.tsx` usa `material-symbols-outlined`, hay que remover esta dependencia visual en favor de Lucide.

## Anti-Patrones
- NO duplicar lógica de estado si `Accordion` ya la provee.
- NO mezclar estilos de `material-symbols` con `lucide-react`.

---

*PRP pendiente aprobación. No se ha modificado código.*
