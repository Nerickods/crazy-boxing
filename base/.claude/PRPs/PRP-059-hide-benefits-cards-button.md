# PRP-059: Botón para Ocultar/Mostrar Tarjetas de Beneficios

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-12
> **Proyecto**: KIA Intelligence

---

## Objetivo

Implementar un botón flotante ("Toggle View") en la sección de Beneficios que permita al usuario ocultar temporalmente las tarjetas de características (`FeatureGrid`), otorgando una vista clara y sin obstrucciones de las imágenes de fondo cinematográficas y los efectos visuales.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las tarjetas de beneficios, aunque estéticas, tapan gran parte de los fondos de alta calidad (`ShaderBackground` y fotos de Unsplash). | Un botón sutil permite alternar la visibilidad de las tarjetas, mostrando el fondo completo. |

**Valor de negocio**: Aumenta la interacción del usuario al darle control sobre la interfaz, y resalta la calidad premium (Apple-Style) del diseño y los fondos sin sacrificar el contenido. Potencia el "Efecto WOW" del apartado visual.

## Qué

### Criterios de Éxito
- [ ] Debe existir un botón flotante y sutil (posiblemente con icono de ojo) en la sección `BenefitsList`.
- [ ] Al hacer clic, las tarjetas (`FeatureGrid`) deben desaparecer mediante una transición suave (Fade out).
- [ ] Al volver a hacer clic, las tarjetas deben reaparecer con la misma suavidad (Fade in).
- [ ] Opcional: El medidor de progreso vertical debe permanecer visible o tener una opacidad reducida para no romper la navegación.
- [ ] El botón de ocultar debe verse bien y ser accesible tanto en Desktop como en Mobile.

### Comportamiento Esperado
El usuario entra a la sección de beneficios y avanza (scrolling). Nota que los fondos cambian y le llaman la atención. Localiza un pequeño botón translúcido parecido a un "View Background" o icono de ojo (`EyeOff`). Al pulsarlo, las tarjetas se desvanecen suavemente, dejando la imagen entera visible. El usuario puede seguir scrolleando para ver los demás fondos "limpios". Al pulsar de nuevo, la UI reaparece fluidamente con Framer Motion o transiciones de Tailwind.

---

## Contexto

### Referencias
- Componente actual: `src/features/landing-page/components/BenefitsList.tsx`
- Contenedor de animaciones: `Framer Motion` (ya instalado y utilizado en `FeatureCard`).
- Efecto de ScrollyTelling: `FullScreenScrollFX`.

### Arquitectura Propuesta (Modificación en Componente)

1. **Estado Local**: Añadir `const [isCardsVisible, setIsCardsVisible] = useState(true);` dentro de `BenefitsList`.
2. **Botón Flotante (Toggle Button)**: Añadir un `<button>` superpuesto (`absolute` o `fixed` relativo a la sección), estilizado con glassmorphism, encima de `FullScreenScrollFX` o como hijo (`z-index` elevado).
3. **Condicional de Renderizado en Cinematic Sections**:
    En la definición del `content` de `cinematicSections`, envolver el `FeatureGrid` en un componente animado.
    Por ejemplo:
    ```tsx
    <motion.div
      initial={false}
      animate={{ opacity: isCardsVisible ? 1 : 0, scale: isCardsVisible ? 1 : 0.95 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={cn("w-full transition-all duration-500", !isCardsVisible && "pointer-events-none")}
    >
      <FeatureGrid modulo={landingModule} limit={limit} />
    </motion.div>
    ```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Declaración de Estado y Botón Flotante
**Objetivo**: Implementar el estado en `BenefitsList` y el botón flotante en la UI.
**Validación**: El componente `BenefitsList.tsx` compila correctamente. Al hacer clic en el botón se actualiza el estado `isCardsVisible` comprobable por React DevTools o un `console.log`. El botón se posiciona sutilmente sin estorbar las tarjetas ni el progress bar.

### Fase 2: Implementación de Transición (Ocultar/Mostrar) en `FeatureGrid`
**Objetivo**: Conectar el estado `isCardsVisible` al renderizado de las tarjetas dentro de los `cinematicSections` para que se oculten fluidamente, deshabilitando sus interacciones.
**Validación**: Al hacer clic en el botón, las tarjetas hacen un "fade out" sin que la página parpadee ni haya errores de scroll en `FullScreenScrollFX`.

### Fase 3: Refinamiento de Animaciones y Validación UX
**Objetivo**: Asegurarse de que cuando las tarjetas están ocultas, el texto secundario (progress bar, etiquetas) o bien se adapta u oculta, y probar en mobile/desktop.
**Validación**: 
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] El botón flotante es visible, entendible y accesible en dispositivos móviles.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [YYYY-MM-DD]: Pendiente
- **Error**: -
- **Fix**: -
- **Aplicar en**: -

---

## Gotchas

- [ ] `FullScreenScrollFX` requiere re-evaluar la altura (`100vh`). Asegurarnos de que el `Fade Out` se haga sin modificar la altura de la página (no usar condicionales `if (!isCardsVisible) return null` porque podría romper el layout de scroll dinámico, usar opacidad).
- [ ] Los punteros (hover/clic) de las tarjetas no deben interponerse cuando son invisibles (`pointer-events-none`).
- [ ] Cuidado con el `z-index`: El botón de alternar visibilidad debe estar encima (z-50) del grid de tarjetas.

## Anti-Patrones

- NO usar estados globales (`Zustand`) para ésto ya que el estado del botón solo aplica a la vista local de los Beneficios.
- NO hacer renderizado condicional absoluto que destroce el DOM perdiendo la cache o el scroll actual. Usar transiciones CSS u animaciones de opacidad (Framer Motion).

---

*PRP pendiente aprobación. No se ha modificado código.*
