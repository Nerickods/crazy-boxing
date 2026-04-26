# PRP-001: Nuevo Hero con Scroll Expansion

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-20
> **Proyecto**: landing-linkedin

---

## Objetivo

Implementar un nuevo Hero component con efecto de expansión al hacer scroll, clonado del proyecto `landing-page`, integrando animaciones avanzadas (Framer Motion, Three.js) y manteniendo el copy actual del proyecto `landing-linkedin`.

## Por Qué

| Problema | Solución |
|----------|----------|
| Hero actual es estático y poco impactante visualmente. | Implementar un "Scroll Expansion Hero" con sliders 3D (Lumina) para una primera impresión premium. |

**Valor de negocio**: Aumento en la retención del usuario (bounce rate) y percepción de marca de alta gama (infraestructura de élite).

## Qué

### Criterios de Éxito
- [ ] El Hero se expande suavemente al hacer scroll.
- [ ] Se mantiene el copy exacto: "Infraestructura de Ventas con IA: Escala en Piloto Automático."
- [ ] Los botones tienen el efecto "Liquid" y "Glow".
- [ ] El slider "Lumina" funciona correctamente con Three.js.

### Comportamiento Esperado
1. Al cargar la página, el Hero muestra un título dividido con una caja de contenido pequeña en el centro.
2. Al hacer scroll (o usar la rueda del ratón), la caja central se expande hasta cubrir todo el viewport.
3. Una vez expandido, se activa el slider Lumina con transiciones de cristal.
4. El contenido (copy y CTAs) aparece con animaciones de Framer Motion.

---

## Contexto

### Referencias
- `/home/nerick_ods/solutions/landing-page/src/features/landing/components/HeroSection.tsx` - Fuente original.
- `/home/nerick_ods/solutions/landing-page/src/shared/components/ui/scroll-expansion-hero.tsx` - Lógica de scroll.

### Arquitectura Propuesta (Feature-First)
```
src/
├── shared/
│   ├── components/
│   │   ├── LiquidButton.tsx
│   │   ├── GlassCard.tsx
│   │   └── ui/
│   │       ├── scroll-expansion-hero.tsx
│   │       └── lumina-slider.tsx
└── features/
    └── landing-page/
        └── components/
            └── HeroSection.tsx (Actualizado)
```

---

## Blueprint (Assembly Line)

### Fase 1: Sync de Infraestructura
**Objetivo**: Instalar dependencias necesarias (`three`, `gsap`, `framer-motion`) y sincronizar `tailwind.config.ts` para soportar los nuevos estilos.
**Validación**: `npm run dev` inicia sin errores de compilación de Tailwind.

### Fase 2: Clonado de Componentes
**Objetivo**: Traer los componentes base (`LiquidButton`, `GlassCard`, `ScrollExpandMedia`, `LuminaSlider`) del proyecto fuente.
**Validación**: Los archivos existen en `src/shared/components/` y compilan.

### Fase 3: Implementación del Hero
**Objetivo**: Actualizar `src/features/landing-page/components/HeroSection.tsx` con la nueva estructura, inyectando el copy original.
**Validación**: El componente se renderiza en la home.

### Fase 4: Validación Final
**Objetivo**: Sistema funcionando end-to-end con scroll expansion.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] Scroll expansion funciona fluido
- [ ] Copy verificado: "Infraestructura de Ventas con IA..."
- [ ] Visualmente premium y alineado con `landing-page`.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-03-20]: Requerimientos de Three.js
- **Error**: El LuminaSlider puede fallar si las texturas no se encuentran o si Three.js no está instalado.
- **Fix**: Asegurar que las rutas de imágenes en `LuminaSlider` existan o usar placeholders válidos.
- **Aplicar en**: Futuras integraciones de sliders 3D.

---

## Gotchas
- [ ] `LuminaSlider` usa texturas específicas. Debemos asegurar que las imágenes existan o usar las del proyecto original si son accesibles vía URL.
- [ ] `gsap` y `three` deben estar en `dependencies`.

---

*PRP pendiente aprobación. No se ha modificado código.*
