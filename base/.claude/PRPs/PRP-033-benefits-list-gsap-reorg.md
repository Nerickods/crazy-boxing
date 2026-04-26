# PRP-033: Reorganización de BenefitsList con GSAP Scroll FX

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-31
> **Proyecto**: KIA Intelligence

---

## Objetivo

Reemplazar el motor de scroll actual en `BenefitsList.tsx` por una implementación avanzada de `FullScreenScrollFX` basada en GSAP. El objetivo es lograr una transición de texto enmascarado ("word-mask slide") y un control de pistas laterales (left/right labels) manteniendo el contenido del Feature Grid actual.

## Por Qué

| Problema | Soluciones |
|----------|------------|
| El efecto de scroll actual es limitado en interactividad de texto. | Motor GSAP con animación de palabras individuales y pistas de navegación sincronizadas. |
| Falta de énfasis visual en los títulos de cada sección. | Efecto de "masking" y "stagger" en las palabras para un look premium estilo Apple. |

**Valor de negocio**: Mejora la percepción de "tecnología de élite" de la landing page, aumentando el tiempo de retención y la conversión de leads mediante una experiencia visual superior.

## Qué

### Criterios de Éxito
- [ ] Implementación pixel-perfect del componente `FullScreenScrollFX` proporcionado.
- [ ] Animación de "word reveal" funcionando correctamente en los títulos.
- [ ] Integración del `FeatureGrid` existente dentro del nuevo layout (debajo del título central).
- [ ] Navegación fluida entre las 3 secciones (Lander, Agente IA, Dashboard).
- [ ] Responsividad total (layout vertical en móvil).

### Comportamiento Esperado
1. Al hacer scroll, la sección se bloquea ("pinning") mediante GSAP ScrollTrigger.
2. Los títulos centrales se animan con un efecto de máscara (las palabras suben/bajan).
3. Las etiquetas laterales se sincronizan con la sección activa.
4. El contenido (Feature Grid) aparece con un suave "fade-in" al llegar a cada sección.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` - Componente actual.
- `src/shared/components/ui/full-screen-scroll-fx.tsx` - Ubicación del motor.
- [GSAP Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) - Referencia de animaciones.

### Arquitectura Propuesta
```
src/
├── features/landing-page/components/
│   └── BenefitsList.tsx        # Adaptado al nuevo FullScreenScrollFX
└── shared/components/ui/
    └── full-screen-scroll-fx.tsx # Nuevo componente core (GSAP)
```

---

## Blueprint (Assembly Line)

### Fase 1: Integración del Core FX
**Objetivo**: Instalar dependencias (si faltan) y configurar el nuevo `full-screen-scroll-fx.tsx`.
**Validación**: El componente compila y renderiza en una página de prueba o demo.

### Fase 2: Adaptación de Datos y Contenido
**Objetivo**: Mapear los datos de `modulos-data` al formato `sections` requerido y habilitar el campo `content` en el nuevo componente para renderizar el `FeatureGrid`.
**Validación**: Los títulos y etiquetas de KIA Intelligence aparecen correctamente.

### Fase 3: Refinamiento Estético y Mobile
**Objetivo**: Ajustar los colores (Cyan/Emerald) y asegurar que el `FeatureGrid` sea legible en todas las resoluciones.
**Validación**: `npm run typecheck` exitoso y prueba visual satisfactoria.

---

## Gotchas

- [ ] **styled-jsx**: El snippet usa `style jsx`. Debemos asegurar que el proyecto lo soporte o convertir los estilos críticos a Tailwind si hay conflictos de SSR.
- [ ] **Content Injection**: El componente proporcionado no tiene un slot de `content` por defecto. Debemos extender la interfaz `Section` e inyectar el grid en la zona central.

---

*PRP completado. Implementación basada en el motor GSAP del usuario.*

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-03-31: Integración de Content Slots en Scroll FX
- **Error**: El componente base del usuario no tenía un slot para contenido complejo (`FeatureGrid`), lo que causaba que solo se mostraran texto y etiquetas.
- **Fix**: Se extendió la interfaz `Section` con `content?: ReactNode` y se inyectó un contenedor `fx-featured-content` en el JSX del motor de scroll.
- **Aplicar en**: Futuras integraciones de componentes de terceros que necesiten portales de contenido reactivo.
