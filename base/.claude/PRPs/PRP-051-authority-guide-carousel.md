# PRP-051: Migración y Refinamiento del Logo Carousel a AuthorityGuide

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-10
> **Proyecto**: KIA Intelligence - Landing LinkedIn

---

## Objetivo

Mover el componente `AnimatedCarousel` (Tech Stack Logos) desde el final de `ProcessSection` hacia el inicio de la sección `AuthorityGuide`. Adicionalmente, corregir y refinar el renderizado del texto descriptivo para solucionar problemas visuales de "word warp" / saltos de línea antiestéticos evidenciados en la imagen de referencia.

## Por Qué

| Problema | Solución |
|----------|----------|
| Desconexión narrativa | Al mover las herramientas "tech stack" al inicio de la guía de autoridad, fortalecemos las credenciales técnicas del fundador (*Authority*) inmediatamente antes de contar su historia. |
| UI/UX: Ruptura de texto | El título "herramientas que usamos..." fuerza quiebres de palabra (ej. *med\nida*) por problemas de max-width y tracking. Se reformateará usando propiedades modernas de text-balance y una jerarquía tipográfica limpia. |

**Valor de negocio**: Aumenta la confianza temprana del usuario (Social/Tech Proof) evitando que una UI desorganizada (roto por salto de línea) perciba baja calidad técnica.

## Qué

### Criterios de Éxito
- [ ] El carrusel de logos ya no renderiza en el final de `ProcessSection.tsx`.
- [ ] El carrusel se visualiza correctamente en la parte superior (inicio) de `AuthorityGuide.tsx` sin romper los fondos ni la estructura curvada que lo rodea.
- [ ] El título del carrusel resuelve el salto de línea roto. Implementaremos `text-balance` en las clases de Tailwind y limpiaremos el copy u optimizaremos la anchura `max-w-2xl mx-auto`.
- [ ] Se mantiene el auto-play fluido y el padding vertical de manera elegante dentro del contenedor oscuro (`bg-black`).

### Comportamiento Esperado
En el render final, al bajar de la sección del Hero y el Proceso, el usuario se topará con un elegante listado infinito de herramientas (React, Next.js, Vercel, Supabase, etc). El texto arriba dirá algo legible como: "Herramientas que usamos para desarrollos a medida", centrado correctamente, balanceado (sin viudas ni saltos horribles de texto). Luego de esto fluirá la tarjeta "Founder Story" natural.

---

## Contexto

### Referencias
- Componente Origen: `src/features/landing-page/components/ProcessSection.tsx` (líneas actuales: 234-251 y array 9-20).
- Componente Destino: `src/features/landing-page/components/AuthorityGuide.tsx`.
- Componente Utility: `src/components/ui/logo-carousel`.

### Cambios a aplicar en Tailwind Clases (UI/UX Text Fix)
En vez de:
`text-slate-400 text-lg md:text-2xl lg:text-3xl font-display font-medium mb-12 text-center w-full max-w-4xl mx-auto tracking-tight italic`

Se usará:
`text-slate-400 text-sm md:text-lg lg:text-xl font-display font-medium mb-10 text-center w-full max-w-2xl mx-auto text-balance` 
Y sugerimos un texto ligeramente capitular:
`"Herramientas de nivel empresarial para nuestros desarrollos a medida"` o mantener el actual con mayúscula inicial: `"Herramientas que usamos para desarrollos personalizados a medida"`.

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Limpieza y Extracción
**Objetivo**: Remover el `AnimatedCarousel` y `stackLogos` de `ProcessSection.tsx`, asegurando que la UI del proceso siga viéndose nítida con su Timeline.
**Validación**: Revisar `ProcessSection.tsx` para descartar dependencias sueltas o importaciones inválidas.

### Fase 2: Implementación en Destino y Corrección Visual
**Objetivo**: Implementar `AnimatedCarousel` orgánicamente en `AuthorityGuide.tsx`.
**Validación**:
- [ ] La variable `stackLogos` se introduce dentro de `AuthorityGuide.tsx`.
- [ ] El componente se inyecta antes del contenedor que posee el `"Founder Story"`.
- [ ] Se aplican las nuevas clases de texto (`text-balance`, size adaptado) para un UX prístino y un reading flow agradable.

### Fase N: Validación Final
**Objetivo**: Sistema de landing page fluyendo correctamente y sin layout shifts inesperados.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] Compilación e interacción sin romper layout global.
- [ ] Playwright preview / revisión interactiva no muestra texto particionado.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-10]: Uso de `text-balance` vs limitaciones espaciales
- **Error**: El título del framework de logos se fracturaba grotescamente en dispositivos intermedios forzando "med\nida" debido a configuraciones de fuente y ancho (vw).
- **Fix**: Usar la propiedad de Tailwind `text-balance` (soportada) en todos los "copys centrados descriptivos" y limitar el contenedor base (`max-w-2xl`).

---

## Gotchas

- [ ] Asegurarse de mantener el componente envuelto o gestionado con su debido import de dependencias como `AnimatedCarousel` en su nuevo hogar.
- [ ] Ojo con el padding superior en `AuthorityGuide`, la transición vertical debe notarse suave entre sección `Background Decor - VerticalFolds` y el nuevo Carrusel.

## Anti-Patrones

- NO añadir saltos de línea explícitos (`<br />`) que arruinen los diseños responsive. Emplear `text-balance` y el framework natural.

---

*PRP pendiente aprobación. No se ha modificado código.*
