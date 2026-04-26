# PRP-054: Expandable Accordion Cards — Benefits Section

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Replicar el comportamiento de las "tarjetas desplegables" (accordion/expandables) del componente `WhyAndTeam.tsx` del proyecto alterno, e implementarlo en las tarjetas de beneficios (`FeatureCard`) de nuestra Landing Page en `src/features/landing-page/components/BenefitsList.tsx`. El resultado final debe ser un diseño premium donde la descripción de cada beneficio está oculta en un estado contraído inicial y se desliza con una fluida animación de Framer Motion al hacer clic.

## Por Qué

| Problema | Solución |
|----------|----------|
| Exceso de carga cognitiva por tener todos los textos de beneficios completamente visibles (wall of text) simultáneamente. | Diseño de "progressive disclosure" donde solo los iconos y títulos están expuestos; los detalles se expanden a demanda. |
| Sensación estática de la interfaz que no incentiva el engagement directo sobre los items de contenido. | Tarjetas interactivas con glow y rotación de chevrons, que responden al clic y se expanden con físicas de Framer Motion. |

**Valor de negocio**: Al reducir el "ruido visual" se mejora el scanning del usuario sobre los pilares del servicio. Las interacciones de clic incentivan micro-compromisos y elevan la percepción de un software tecnológicamente superior y premium, aumentando la retención en esta sección crítica de la página.

## Qué

### Criterios de Éxito
- [ ] `FeatureGrid` gestiona de forma interactiva qué tarjeta está seleccionada mediante estado (`expandedId`) garantizando que operen como un acordeón (opcionalmente una abierta a la vez).
- [ ] Cada `FeatureCard` expone una cabecera siempre visible (Icono + Título + Etiqueta PRO + Chevron).
- [ ] Cada `FeatureCard` utiliza `<AnimatePresence>` y `<motion.div>` de `framer-motion` para transicionar de `height: 0` a `height: "auto"`.
- [ ] La UI incluye rotación de un `<ChevronRight size={20} />` al expandirse.
- [ ] El Glassmorphism se intensifica al expandirse (ej. bordes `accent-cyan/40` estáticos para el ítem activo).
- [ ] La paleta de KIA (Cyan y Emerald) es respetada estrictamente (se abandona el tema Sky de `WhyAndTeam.tsx`).
- [ ] El redimensionado vertical interactivo no rompe el `ScrollTrigger` de `FullScreenScrollFX` (puede que las tarjetas requieran hacer scroll interno nativo si crecen demasiado en móvil).

### Comportamiento Esperado
1. El usuario interactúa con la lista de Beneficios haciendo scroll.
2. Todas las tarjetas muestran en un panel cerrado (shrink): Icono + Nombre del beneficio + Un "Chevron" apuntando a la derecha.
3. El usuario hace click sobre la tarjeta "Multi-Agent System".
4. El Chevron rota 90°. El borde de la tarjeta se enciende progresivamente con cyan/emerald. El contenido descriptivo desciende fluidamente.
5. Si el usuario toca otra tarjeta, la anterior se contrae y la nueva se expande de manera coordinada.

---

## Contexto

### Referencias
- Patrón original a emular: `\\wsl.localhost\Ubuntu\home\nerick_ods\crazy\src\features\experience\components\WhyAndTeam.tsx` (Componente: `JourneyStageItem`).
- Archivos a modificar: `src/features/landing-page/components/BenefitsList.tsx` (Componentes `FeatureCard` y `FeatureGrid`).

### Arquitectura Propuesta (Feature-First)

**1. Estado de Acordeón en `FeatureGrid`**
```tsx
function FeatureGrid({ modulo, limit = 6 }: { modulo: Modulo, limit?: number }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const toggleCard = (title: string) => {
    setExpandedId(current => current === title ? null : title);
  };
  
  return (
    <div className="...">
      {modulo.differentiators.slice(0, limit).map((item, i) => (
        <FeatureCard 
          key={i} 
          item={item}
          isExpanded={expandedId === item.title}
          onToggle={() => toggleCard(item.title)}
        />
      ))}
    </div>
  );
}
```

**2. Componente de Animación en `FeatureCard`**
Adoptamos `<AnimatePresence>` para gestionar la salida del DOM animada y combinamos los bordes activos condicionales siguiendo el patrón:
```tsx
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
>
  <p className="..."> {item.description} </p>
</motion.div>
```

---

## Blueprint (Assembly Line)

### Fase 1: Estado y Configuración Base
**Objetivo**: Modificar `FeatureGrid` para inyectar `isExpanded` y `onToggle` en el renderizado de `FeatureCard`. Importar los iconos clave de `lucide-react` (como `ChevronRight`) y de `framer-motion` (`motion`, `AnimatePresence`).
**Validación**: Las cards de Features se re-renderizan sin romper al clickearlas, pasando correctamente el booleano `isExpanded`.

### Fase 2: Layout y Framer Motion en FeatureCard
**Objetivo**: Separar y estructurar el JSX del `FeatureCard` en una zona de `Header` (el botón/trigger principal) y la zona de expansión (`AnimatePresence`). Colocar rotación CSS/Motion en el chevron. Modificar clases Tailwind para intensificar los contrastes de los bordes y brillos cyan al estado de `isExpanded === true`.
**Validación**: Al dar clic sobre una tarjeta vacía de detalles, la altura muta suavemente.

### Fase 3: Validación de GSAP y Scroll
**Objetivo**: Asegurar que la mutación de altura dinámica no entra en conflicto destructivo con el pined/ScrollTrigger de `FullScreenScrollFX`. En caso de que se desborde visualmente por abrir varias tarjetas simultáneamente en mobile, asegurar el overflow vertical u obligar el autocierre estricto.
**Validación**: Pruebas manuales simulando lectura progresiva sin bugs visuales en dispositivos móviles y de escritorio.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

*(Espacio en blanco, se actualizará tras la fase de desarrollo)*

---

## Gotchas

- [ ] **Alerta GSAP:** Ampliar dinámicamente el contenido dentro de una sección `pinned` en GSAP puede requerir un `ScrollTrigger.refresh()` si la altura excede el viewport, aunque nuestra `.fx-fixed` (la caja principal pineada) suele tener `overflow-y-auto` interno. Testear esta restricción vertical es mandatario.
- [ ] **Accesibilidad:** Mantener el Header como interactuable mediante un wrapper botón o aplicando roles adecuados para permitir la navegación por teclado.

## Anti-Patrones

- NO omitir las configuraciones precisas de easing `transition={{ duration: 0.3, ease: "easeInOut" }}` observadas en `WhyAndTeam.tsx`. Es crucial para la percepción de rapidez pero con solidez.
- NO copiar ciegamente paletas de branding (ej: colores "sky" no existen en este branch con branding "emerald/cyan").

---

*PRP pendiente aprobación. No se ha modificado código.*
