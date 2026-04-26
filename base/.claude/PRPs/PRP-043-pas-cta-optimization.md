# PRP-043: Optimización de Transición de CTA en PasSection

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-14
> **Proyecto**: landing-linkedin

---

## Objetivo

Eliminar las animaciones de traslación vertical (eje Y) atadas al scroll físico en el componente `PasSection.tsx`, y reemplazar el efecto de ascenso desde abajo por simples desvanecimientos progresivos (fade-in) logrando un render del CTA final sin latencia ni comportamiento trabado. 

## Por Qué

| Problema | Solución |
|----------|----------|
| El constante recálculo espacial `y` sincronizado al layout engine forzaba ralentizaciones perceptibles en dispositivos durante la llegada al CTA. | Fijar espacialmente en su posición final a `LogoBrandFlow` y el CTA bloque principal, animando exclusivamente vía `opacity` acelerado por GPU. |

**Valor de negocio**: Evitar cualquier caída de "frames" (lag) en el acto definitivo del embudo retiene enormemente el engagement y refuerza una experiencia elitista fluida acorde al nivel C-Level/CEO de nuestros "buyers".

## Qué

### Criterios de Éxito
- [ ] El logotipo y nombre "KIA Intelligence" aparecen renderizados permanentemente en su "top offset" visual (`~-260px` lógico u equivalente estructuralmente) sin transitar verticalmente desde el centro de la pantalla.
- [ ] El contenedor del CTA ("Conecta tu negocio...") se desvanece de manera sutil y directa en su destino definitivo, prescindiendo del desplazamiento "ascensor" de `y: 80` a `0`.
- [ ] La performance general del navegador mejora rotundamente al realizar scroll rápido hacia el final del `PasSection` comparado al estado anterior, sintiendo fluidez nativa.

### Comportamiento Esperado
1. Conforme el scroll supera el hitpoint de `0.88`, el componente `LogoBrandFlow` hace fade in de un `0` a `1` en la posición fija central superior. No sucede ninguna traslación de ascensión y escala a la par.
2. Simultáneamente (cerca del hit point `0.92`), el texto "Conecta tu negocio al mundo artificial" con su bola de activación efectúa un fade-in gradual `0->1` ocupando el centro-inferior de la pantalla debajo del logotipo. Sin movimiento físico en `Y`.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PasSection.tsx`

### Arquitectura Propuesta (Feature-First)
No se requiere nuevos archivos ni un refactor en la arquitectura. Las ediciones se localizan minuciosamente dentro de los componentes funcionales:
```tsx
src/features/landing-page/components/PasSection.tsx
 ├── function LogoBrandFlow()  <-- Remover transformaciones scale & y. Solo opacity. Setear padding/margin absoluto -260.
 └── export function PasSection() <-- Subsección: {/* Final CTA - Premium Center Reveal */} remover Y del transform.
```

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Limpieza de transformaciones Y y Escala
**Objetivo**: Podar los hooks de animaciones dependientes a transformaciones "Y" innecesarias minimizando la sobrecarga DOM.
**Validación**: `<motion.div>` sólo calcula variables para el canal de opacidad.

### Fase 2: Reposicionamiento Estático Correctivo
**Objetivo**: Lograr ubicar los nodos (Logo y CTA Text) en el DOM en los pixeles correctos como si la animación ya hubiera concluido.
**Validación**: Tras recargar el localhost, forzar el final del documento no oculta el contenido ni desalinea el Logo respecto a la caja del CTA.

### Fase 3: Validación Final de Performance
**Objetivo**: Navegar sin tirones gráficos.
**Validación**:
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] Al hacer scroll agresivo móvil y de escritorio se visualiza 0 de lentitud visual en la opacidad.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.
> El conocimiento persiste para futuros PRPs. El mismo error NUNCA ocurre dos veces.

*(Se llenará durante el agente de ejecución de blueprints)*

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] Cuidado con el CSS hardcodeado en `LogoBrandFlow`. Habrá que inyectarle un transform estático de `translateY(-260px)` o manejarlo mediante CSS purista `top/absolute` para no estorbar el flujo del CTA container.
- [ ] Vigilar firmemente la etiqueta `willChange: "transform, opacity"` y quizás quitar *"transform"* de las sentencias si estamos deshaciéndonos por completo del escalado y traslación vertical del CTA.

## Anti-Patrones

- NO sustituir el hook por un evento vanilla JavaScript de scroll; conservar el stack Framer Motion en modo GPU `opacity`.
- NO insertar sub-animaciones complejas a cada letra para suplantar la pérdida de movimiento, ya que arruinaría el objetivo general de performance.

---

*PRP pendiente aprobación. No se ha modificado código.*
