# PRP-001: Mobile Carousel Image Visibility Fix

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-20
> **Proyecto**: KIA Intelligence

---

## Objetivo

Garantizar que las imágenes dentro del componente `HeroInfiniteCarousel` se muestren completas (no recortadas) en la vista móvil (vertical/portrait), manteniendo un ratio de aspecto óptimo y fluidez en la animación infinita.

## Por Qué

| Problema | Solución |
|----------|----------|
| En dispositivos móviles, la altura del row del carrusel ("h-1/2" del Hero) combinada con el "clamp(280px...)" fuerza un aspecto vertical. Debido a esto y al uso de "object-cover", las imágenes anchas se recortan drásticamente a los lados. | Ajustar la lógica de proporciones del contenedor de imagen (`InfiniteCarouselRow`) en versiones móviles para utilizar anchos relativos o un aspect-ratio, lo que permitirá a las imágenes desplegarse completamente. |

**Valor de negocio**: Mejorar drásticamente la primera impresión visual en dispositivos móviles (la mayor parte del tráfico) al asegurar que el mock-up del producto o imagen de marketing se visualice íntegro y profesional.

## Qué

### Criterios de Éxito
- [ ] Las imágenes ya no se verán cortadas a los lados significativamente en tamaños de pantalla menores a 768px.
- [ ] La animación ("marquee") mantiene su sincronización y continuidad (loop perfecto sin saltos visuales) después del ajuste de anchos.
- [ ] Se mantiene el impacto visual ("object-cover") en desktop intacto.

### Comportamiento Esperado
Al visitar la Landing Page desde un teléfono celular (ej. 375px o 414px de ancho), cada fotografía dentro del carrusel tomará un ancho proporcional adecuado respecto al view (por ejemplo `80vw` o un clamp ajustado a mobile `clamp(300px, 80vw, 500px)`), respetando la orientación horizontal original o evitando recortes severos. 

---

## Contexto

### Referencias
- Componente base afectado: `src/shared/components/ui/infinite-carousel-row.tsx`
- Componente padre: `src/shared/components/ui/hero-infinite-carousel.tsx`

### Arquitectura Propuesta (Feature-First)
La corrección se aplicará in situ sobre el componente ui compartido. Mantendremos el mismo esquema, pero evolucionaremos las clases y estilos inline:

*   Modificación de la clase Tailwind para usar un media query (como `w-[70vw] md:w-[33vw]`).
*   Ajuste en la propiedad del `style`: de `width: 'clamp(280px, 33vw, 500px)'` a clases de utilidades nativas de Tailwind para mejor adaptabilidad (por ejemplo `w-[80vw] md:w-[33vw] max-w-[500px]`), o mediante un clamp más generoso para mobile.
*   En `next/image`, evaluar y ajustar temporalmente el comportamiento `object-cover` u `object-contain` para el viewport particular si es necesario, aunque lo ideal es manejar la proporción desde el contenedor.

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Ajuste Estructural de Proporciones en Mobile
**Objetivo**: Implementar Tailwind CSS responsive variants para modificar el width del Item del carrusel (`infinite-carousel-row.tsx`) separando el comportamiento entre mobile y desktop, eliminando anchos quemados en estilos inline restrictivos.
**Validación**: Inspeccionar elementos del DOM simulando dispositivo móvil (DevTools) y confirmar que el `div` anfitrión tiene suficiente ancho y las reglas de Tailwind escalan la imagen correctamente.

### Fase 2: Validación Visual y Ajuste de Loop Animation
**Objetivo**: Confirmar que, al ampliar el ancho del contenedor en móvil para mostrar imágenes enteras, el CSS de animación (e.g., `-33.333%`) sigue resultando en un loop totalmente perfecto.
**Validación**:
- [ ] Revisión visual del bucle: si las imágenes son más anchas en móvil, la animación en `max-content` y los % de Keyframe no deben desfasarse.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando end-to-end con alta calidad visual.
**Validación**:
- [ ] Ejecutar comprobación visual en Desktop vs Mobile y garantizar cero parpadeo/corte.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación. El conocimiento persiste para futuros PRPs. El mismo error NUNCA ocurre dos veces.

### [2026-04-20]: Flexbox max-content y Marquee Animations
- **Error**: Se tenía el presentimiento de que alterar dinámicamente el ancho de los hijos del carrusel en proporciones de viewport (`vw`) podría desfasar el cálculo del Loop del keyframe.
- **Fix**: Al estudiar la base, probamos que usar `transform: translate3d(-33.333%, 0, 0)` en un padre flex que obedece a `width: max-content` siempre desplazará exactamente un tercio del componente virtual renderizado en el DOM, equivalente a una rotación simétrica de imágenes repetidas, sin importar cuán anchas o fluidas sean estiradas por Tailwind (e.g. `85vw` en móvil).
- **Aplicar en**: Cualquier otro Infinite Text Ticker o Carousel CSS nativo en el código futuro. El patrón es matemáticamente robusto para vistas fluidas.

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] Si las imágenes ahora ocupan ~80vw en móvil, quizás 3 imágenes duplicadas no sean suficientes si el usuario scrollea, o los porcentajes fijos del keyframe (`-33.333%`) pueden corromperse (ya que asumen una matemática exacta sobre el `max-content`). Debemos revisar la matemática de Marquee.

## Anti-Patrones

- NO añadir dependencias externas de carrusel (seguir con CSS nativo si es posible).
- NO sacrificar la apariencia de Desktop por arreglar Mobile.
- NO dejar anchos "quemados" que no escalen correctamente.
