# PRP-055: Total Modules Integration — Benefits Section

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence — Landing Page

---

## Objetivo

Extender la sección de beneficios en el Landing Page (`BenefitsList.tsx`) para renderizar el **100% de los módulos de producto** disponibles en el sistema de datos base (`modulos-data.ts`). Actualmente, la sección omite el módulo de "Conectividad Total". Se debe inyectar este cuarto estadio sin sacrificar el diseño Premium Glassmorphism ni la mecánica de tarjetas desplegables recién introducidas.

## Por Qué

| Problema | Solución |
|----------|----------|
| El Landing Page omite la "Conectividad" (Slack, WhatsApp, Calendars), por lo que el cliente solo ve esa capacidad si entra a páginas secundarias. | Integrar el cuarto módulo directamente al scroll cinemático de la landing, brindando exposición Full-Stack. |
| Elementos estáticos en el DOM (como el "03" final de la barra de progreso) no estarían preparados para un 4to módulo. | Refactorizar la barra de progreso lateral para que lea la longitud total del array dinámicamente en lugar de estar hardcodeada. |

**Valor de negocio**: Evitar fugas de retención de prospectos B2B que buscan automatización multicanal y descartarían la herramienta al no ver integraciones (WhatsApp, CRMs) en la página frontal principal.

## Qué

### Criterios de Éxito
- [ ] La constante `cinematicSections` en `BenefitsList.tsx` contiene 4 objetos (`Lander`, `Agente IA`, `Dashboard CRM`, `Conectividad Total`).
- [ ] El módulo de conectividad provee una imagen de fondo en alta calidad desde Unsplash.
- [ ] Las 6 tarjetas (`differentiators`) del módulo de conectividad operan como acordeón desplegable perfecto, con las mismas specs de `PRP-054` (border cyan, chevron).
- [ ] La barra medidora de progreso vertical ya no muestra "03" al fondo, sino "04" de forma dinámica `String(cinematicSections.length).padStart(2, '0')`.
- [ ] El ScrollTrigger de GSAP no se rompe con una cuarta sección.

### Comportamiento Esperado
1. El usuario hace scroll y navega por Landing -> Vendedor IA -> Dashboard CRM.
2. Al seguir haciendo scroll down, entra en un nuevo paisaje inmersivo: **Conectividad Total**.
3. Puede expandir cada una de las 6 interacciones (WhatsApp Nativo, Slack Sync, etc.) dando click en ellas.
4. La barra de progreso lateral cian marca `04` al fondo y finaliza su carga en 100% solo al llegar a este último panel.

---

## Contexto

### Referencias
- `src/shared/lib/modulos-data.ts` - Data map (Contiene `conectividad`).
- `src/features/landing-page/components/BenefitsList.tsx` - Controlador cinemático principal.

### Arquitectura Propuesta (Feature-First)

Modificación de lógica central en `BenefitsList`:
```tsx
  // 1. Extraer módulo restante
  const conectividadModule = modulos.find(m => m.slug === "conectividad")!;

  // 2. Extender Array
  const cinematicSections = [
    // ...lander, ia, dashboard
    {
      id: "conectividad-total",
      title: conectividadModule.title,
      content: <FeatureGrid modulo={conectividadModule} limit={limit} />,
      background: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2668&auto=format&fit=crop", 
    },
  ]
```

Modificación en Barra de Progreso:
```tsx
{/* Antes */}
<div className="text-[11px] font-bold text-white/20 mt-3">03</div>

{/* Ahora */}
<div className="text-[11px] font-bold text-white/20 mt-3">
   {String(cinematicSections.length).padStart(2, '0')}
</div>
```

---

## Blueprint (Assembly Line)

### Fase 1: Enlace de Data y Configuración
**Objetivo**: Exportar el 4º módulo (`conectividad`) desde los utils, construir su nodo dentro de `cinematicSections` en `BenefitsList.tsx` y asignar un background premium coherente.
**Validación**: Al scrollear, la Landing página atraviesa 4 estadios en lugar de 3. `conectividad` aparece al fondo.

### Fase 2: Robustez Dinámica de Componentes Periféricos
**Objetivo**: Alterar elementos visuales hardcodeados. Actualizar el límite máximo inferior de la barra de progreso (`03` a variable estática `cinematicSections.length`).
**Validación**: La barra marca "04" y su llenado matemático (`height = %`) respeta los 4 pasos proporcionados por `FullScreenScrollFX`.

### Fase 3: Validación Cross-Device (End to End)
**Objetivo**: Cerciorarse que el Performance no sufre tirones (Jank) ahora que se cargan más DOM Nodes (Componentes de animaciones) en dispositivos móviles.
**Validación**:
- [ ] Las 6 tarjetas nuevas se expanden de a una sin problemas.
- [ ] TypeScript `typecheck` limpia de errores.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)
*(Espacio en blanco, se actualizará tras la fase de desarrollo)*

---

## Gotchas

- [ ] **Data Array Boundaries**: Verificar si `limit` estado responsive (`3` en mobile, `6` en desktop) funciona bien para este nuevo módulo, ya que tiene excatamente 6 diferenciadores. Renderizará la mitad en mobile y completo en desktop. (Comportamiento deseado según lógica actual).
- [ ] **Backgrounds de Unsplash**: Como el componente precarga estas imágenes pesadas, asegurarse de que la imagen provista para "Conectividad" (id de Unsplash) tenga los parámetros óptimos `&q=80&w=2668&auto=format&fit=crop`.

## Anti-Patrones
- NO hardcodear `"04"` en el markup JSX. Usar `.length` del array siempre permitirá abstraer secciones en un futuro sin dejar "deuda visual" atrasada.

---

*PRP pendiente aprobación. No se ha modificado código.*
