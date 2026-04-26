# PRP-053: Fix del Menú Lateral, CTA Expandible y Animación de Traspaso

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-11
> **Proyecto**: KIA Intelligence Landing

---

## Objetivo

Resolver tres bugs críticos de UX en el menú lateral (`NavigationDrawer`) y el botón CTA expandible (`HeroButtonExpendable`):
1. El botón dentro del `NavigationDrawer` **desaparece** al cerrarse el drawer.
2. El botón `CTA` en el `NavigationDrawer` **se desplaza visualmente** en función de si el menú está abierto o cerrado.
3. La animación `layoutId` que "traspasa" el CTA de `LandingCta` al `NavigationDrawer` colisiona con instancias duplicadas del mismo `layoutId`.

---

## Por Qué

| Problema | Causa Raíz | Impacto |
|----------|------------|---------|
| CTA desaparece al cerrar el drawer | `AnimatePresence` en `HeroButtonExpendable` reacciona al estado global `isOpen` del `EnrollmentStore`. Al cerrar el modal via `closeModal()`, el drawer también experimenta re-renders que causan que el `AnimatePresence` detecte `isOpen=false` en el momento equivocado. Esto hace que el botón entre en la fase `exit` mientras aún está visible dentro del Drawer cerrado. | Pérdida de confianza del usuario, UX rota |
| CTA se desplaza | El botón `HeroButtonExpendable` usa `layoutId="footer-cta"` que Framer Motion rastrea globalmente. Como hay **dos instancias** del botón en el DOM simultáneamente (en `LandingCta` y en `NavigationDrawer`), Framer Motion aplica animaciones de posición inesperadas al detectar que el `layoutId` cambió de posición cuando el drawer se abre/cierra. | Animación rota, sensación de bug |
| Colisión de `layoutId` | El mismo `layoutId="footer-cta"` existe en: (a) `LandingCta.tsx` vía `HeroButtonExpendable`, (b) `NavigationDrawer.tsx` vía `HeroButtonExpendable`, y (c) `EnrollmentModal` que también usa `triggerId || "cta-card"`. Framer Motion no puede resolver cuál de los dos eleméntos es el "origen" de la animación. | Animación de expansión rota |

**Valor de negocio**: El CTA es el elemento de conversión más crítico de la landing. Bugs visuales en él generan fricción y pérdida directa de leads.

---

## Qué

### Criterios de Éxito

- [ ] El botón CTA en el `NavigationDrawer` permanece visible y estable en todo momento mientras el drawer está abierto.
- [ ] Al cerrar el drawer, el botón **no desaparece** antes de que el drawer termine su animación de cierre.
- [ ] Abrir/cerrar el drawer NO provoca movimientos o saltos en el CTA de `LandingCta`.
- [ ] La animación de expansión (click → modal) funciona correctamente tanto desde `LandingCta` como desde `NavigationDrawer`.
- [ ] No existen warnings de Framer Motion en consola sobre `layoutId` duplicados.
- [ ] `npm run typecheck` pasa sin errores.

### Comportamiento Esperado (Happy Path)

1. Usuario llega al final de la página, ve el botón CTA en `LandingCta` → funcional.
2. Usuario abre el menú lateral → el drawer aparece con el CTA abajo.
3. El CTA en el drawer se ve perfectamente, no salta ni se mueve.
4. Usuario cierra el menú → el botón en el drawer desaparece junto con el drawer (animated out), NO antes.
5. El CTA en `LandingCta` permanece intacto durante todo el ciclo del drawer.
6. Usuario hace click en cualquier CTA → el modal se expande con animación suave `layoutId`.
7. Usuario cierra el modal → el CTA reaparece en su posición original sin glitches.

---

## Contexto

### Diagnóstico Técnico Detallado

#### Bug 1: CTA desaparece al cerrar el drawer

**Flujo del error:**
```
Usuario cierra Drawer → `setIsNavDrawerOpen(false)` en Header.tsx
                     → NavigationDrawer sale (x: 100%)
                     → HeroButtonExpendable re-renderiza
                     → Detecta `isOpen=false` en EnrollmentStore (el store está limpio)
                     → AnimatePresence ejecuta `exit` → botón se desvanece DENTRO del drawer
                     → El resultado es que el botón desaparece ANTES de que el drawer cierre
```

**Causa exacta (HeroButtonExpendable.tsx:17):**
```tsx
// PROBLEMA: AnimatePresence responde al estado GLOBAL del EnrollmentModal
// No tiene relación con si el NavigationDrawer está abierto o no
{!isOpen && (
  <motion.div layoutId="footer-cta">
    ...
  </motion.div>
)}
```

Cuando el modal NO está abierto (`isOpen=false`), el botón DEBERÍA mostrarse siempre. El problema es que la lógica `!isOpen` hace que el botón desaparezca cuando el modal abre, pero Framer Motion está animando esto con el mismo `layoutId` que está siendo rastreado en múltiples lugares.

#### Bug 2 & 3: Colisión de `layoutId` entre instancias

**El mismo `layoutId="footer-cta"` existe en:**
1. `LandingCta.tsx` → renderiza `<HeroButtonExpendable />` (con layoutId="footer-cta")
2. `NavigationDrawer.tsx` → renderiza `<HeroButtonExpendable />` (con layoutId="footer-cta")

Cuando Framer Motion tiene dos elementos con el mismo `layoutId` en el DOM simultáneamente, intenta interpolar entre ellos creando un "salto" visual. Cuando uno desaparece (por scroll o por cerrar el drawer), el otro "salta" a la posición donde estaba el anterior.

**Flujo del error de desplazamiento:**
```
Drawer abre → dos instancias de layoutId="footer-cta" en DOM
Drawer cierra → instancia en drawer sale de DOM
Framer Motion detecta que layoutId="footer-cta" "se movió"
Anima el CTA en LandingCta hacia la posición donde estaba el del drawer
→ SALTO VISUAL
```

### Arquitectura de Componentes Relevantes

```
layout.tsx
└── EnrollmentModal (portal → document.body, z-[100])
    └── layoutId={triggerId || "cta-card"}

page.tsx
├── Header.tsx
│   └── NavigationDrawer (isOpen={isNavDrawerOpen})
│       └── HeroButtonExpendable → layoutId="footer-cta"
└── LandingCta.tsx
    └── HeroButtonExpendable → layoutId="footer-cta" ← COLISIÓN
```

### Referencias de Código

- [`HeroButtonExpendable.tsx`](src/features/services/components/ui/HeroButtonExpendable.tsx) — El botón con layoutId problemático
- [`NavigationDrawer.tsx`](src/features/landing-page/components/NavigationDrawer.tsx) — Contiene el CTA que desaparece
- [`LandingCta.tsx`](src/features/landing-page/components/LandingCta.tsx) — Primera instancia del mismo CTA
- [`EnrollmentModal.tsx`](src/features/services/components/ui/EnrollmentModal.tsx) — El modal destino de la animación
- [`useEnrollmentStore.ts`](src/shared/stores/useEnrollmentStore.ts) — Estado global isOpen/triggerId

---

## Blueprint (Assembly Line)

### Fase 1: Desacoplar el `layoutId` por instancia (Root Cause Fix)

**Objetivo**: Eliminar la colisión de `layoutId` haciendo que `HeroButtonExpendable` acepte un `instanceId` como prop opcional, generando su propio `layoutId` único por instancia.

**Cambios en `HeroButtonExpendable.tsx`**:
```tsx
interface Props {
  instanceId?: string; // "landing-cta" | "nav-drawer-cta" | etc.
}

export default function HeroButtonExpendable({ instanceId = 'hero-cta' }: Props) {
  const { isOpen, openModal } = useEnrollmentStore()
  const uniqueId = `hero-btn-${instanceId}` // Genera layoutId único por instancia

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            className="inline-block relative"
            layoutId={uniqueId} // Único por instancia → no más colisiones
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <motion.div style={{ borderRadius: "100px" }} className="absolute inset-0 bg-white" />
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => openModal(uniqueId)} // El triggerId ahora === layoutId
              className="relative flex items-center gap-4 px-10 py-5 text-sm md:text-lg font-black uppercase tracking-widest text-black hover:scale-105 transition-transform"
            >
              Start your deployment today
              <ArrowRight className="w-5 h-5 text-[#10b981]" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

**Actualizar llamadas en:**
- `LandingCta.tsx`: `<HeroButtonExpendable instanceId="landing-cta" />`
- `NavigationDrawer.tsx`: `<HeroButtonExpendable instanceId="nav-drawer" />`

**Validación**: No hay warnings de Framer Motion en consola. Abrir/cerrar drawer no mueve el CTA en LandingCta.

---

### Fase 2: Corregir el "desaparece al cerrar el drawer"

**Objetivo**: El botón CTA dentro del `NavigationDrawer` debe persistir durante toda la animación de cierre del drawer, desapareciendo junto con él y no antes.

**Diagnóstico**: El problema actual es que `AnimatePresence` en `HeroButtonExpendable` reacciona a `isOpen` del `EnrollmentStore`. Cuando `isOpen=false` (el modal está cerrado, que es lo normal), el botón DEBERÍA mostrarse. El bug es que hay un frame en el que el `AnimatePresence` recibe la señal de salida incorrecta.

**Fix**: Dado que en `NavigationDrawer` el botón NO debe nunca desaparecer basado en el estado del `EnrollmentStore` (solo debe desaparecer cuando el modal ESTÁ abierto), necesitamos asegurarnos de que la prop `isOpen` del store NO interfiera.

**Opción A (Recomendada)**: Crear una variante sin `AnimatePresence` para el uso en drawer:
```tsx
// HeroButtonExpendable.tsx — añadir prop `alwaysVisible`
interface Props {
  instanceId?: string;
  alwaysVisible?: boolean; // Cuando true, no usa AnimatePresence — siempre visible
}

export default function HeroButtonExpendable({ instanceId = 'hero-cta', alwaysVisible = false }: Props) {
  const { isOpen, openModal } = useEnrollmentStore()
  const uniqueId = `hero-btn-${instanceId}`
  const shouldHide = !alwaysVisible && isOpen; // Solo ocultar si no está forzado visible

  const button = (
    <motion.div className="inline-block relative" layoutId={uniqueId} transition={...}>
      <motion.div style={{ borderRadius: "100px" }} className="absolute inset-0 bg-white" />
      <motion.button onClick={() => openModal(uniqueId)} ...>
        Start your deployment today
        <ArrowRight className="w-5 h-5 text-[#10b981]" />
      </motion.button>
    </motion.div>
  );

  if (alwaysVisible) return <div className="relative flex flex-col items-center justify-center p-4">{button}</div>;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!shouldHide && button}
      </AnimatePresence>
    </div>
  )
}
```

**En `NavigationDrawer.tsx`**:
```tsx
<HeroButtonExpendable instanceId="nav-drawer" alwaysVisible={true} />
```

Dado que el drawer ya tiene su propio `AnimatePresence` para entrar/salir, el botón simplemente vive y muere con el drawer, sin lógica propia.

**Validación**: Abrir drawer → ver botón → cerrar drawer → botón NO desaparece antes que el drawer.

---

### Fase 3: Auditar y corregir el scroll-lock del `NavigationDrawer`

**Objetivo**: El Drawer gestiona `document.body.style.overflow` de forma directa (líneas 19-25 de `NavigationDrawer.tsx`), lo cual **rompe** el sistema centralizado de `scroll-lock.ts`. Ambos deben coexistir sin conflictos.

**Problema actual**:
```tsx
// NavigationDrawer.tsx — ROMPE el sistema centralizado de scroll-lock
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'; // Escribe directo sin pasar por owners
  } else {
    document.body.style.overflow = 'unset'; // Al cerrar el drawer: LIBERA el scroll aunque el Hero aún lo tenga bloqueado!
  }
}, [isOpen]);
```

**Cuando el drawer se cierra mientras el Hero tiene su propio lock**, el `body.style.overflow = 'unset'` del drawer sobrescribe el lock del Hero → usuario puede scrollear fuera del hero accidentalmente.

**Fix**: Migrar el lock del Drawer al sistema centralizado:
```tsx
import { lockScroll, unlockScroll } from '@/shared/lib/scroll-lock';

useEffect(() => {
  if (isOpen) {
    lockScroll('nav-drawer');
  } else {
    unlockScroll('nav-drawer');
  }
  return () => {
    unlockScroll('nav-drawer');
  };
}, [isOpen]);
```

**Validación**: Abrir drawer mientras Hero está en animación → el Hero sigue bloqueado después de cerrar el drawer.

---

### Fase 4: Validación Final End-to-End

**Objetivo**: Todos los criterios de éxito cumplidos, sin errores en consola, sin regresiones.

**Pruebas manuales**:
1. Scroll al 100% de la página → `LandingCta` CTA visible ✓
2. Click en CTA → modal se expande desde el botón (animación layoutId suave) ✓
3. Cerrar modal → botón reaparece en LandingCta ✓
4. Abrir menú lateral → CTA en drawer visible ✓
5. Cerrar menú lateral → CTA NO desaparece antes que el drawer ✓
6. Abrir menú lateral → cerrar sin hacer click → LandingCta CTA no se mueve ✓
7. Click en CTA del drawer → modal se expande desde el botón del drawer ✓
8. Cerrar modal desde el drawer → botón reaparece en el drawer ✓

**Validación técnica**:
- [ ] `npm run typecheck` → Exit code 0
- [ ] Consola sin warnings de Framer Motion (`layoutId` duplicados)
- [ ] Consola sin errores de `scroll-lock`

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-04-11: Framer Motion layoutId duplicados
- **Error**: Usar el mismo `layoutId` en múltiples instancias del mismo componente causa saltos visuales y comportamiento impredecible.
- **Fix**: Pasar `instanceId` como prop para generar `layoutId` únicos por instancia. El `triggerId` del store debe coincidir con el `layoutId` usado.
- **Aplicar en**: Cualquier componente que use `layoutId` y pueda renderizarse en múltiples lugares.

### 2026-04-11: AnimatePresence en componentes reutilizados en overlays
- **Error**: Un componente con `AnimatePresence` que responde a estado global no sabe cuándo está dentro de un drawer que se está cerrando. Ejecuta su `exit` animation de forma prematura.
- **Fix**: Añadir prop `alwaysVisible` para que componentes dentro de overlays con su propia animación de salida no gestionen su propio ciclo de vida.
- **Aplicar en**: Cualquier componente con AnimatePresence reutilizado dentro de Modals, Drawers, Sheets.

### 2026-04-11: Conflicto entre scroll-lock centralizado y overrides directos
- **Error**: Al gestionar `document.body.style.overflow` directamente en múltiples componentes, se sobrescriben mutuamente, causando que el scroll se libere accidentalmente.
- **Fix**: SIEMPRE usar `lockScroll(owner)` / `unlockScroll(owner)` del utilitario centralizado. Nunca escribir directamente en `document.body.style.overflow`.
- **Aplicar en**: NavigationDrawer, EnrollmentModal, ScrollExpandMedia.

---

## Gotchas

- [ ] **Framer Motion `layoutId` es global**: Dos elementos con el mismo `layoutId` en el DOM al mismo tiempo causan comportamiento impredecible. Siempre usar IDs únicos.
- [ ] **`AnimatePresence` dentro de drawers/modales**: El ciclo de vida del `AnimatePresence` anidado puede ejecutarse antes de que el contenedor padre haya completado su animación de salida.
- [ ] **`EnrollmentModal` usa `layoutId={triggerId}`**: El `triggerId` del store debe ser exactamente el mismo string que el `layoutId` del botón que hizo trigger. Si no coincide, no habrá animación de expansión.
- [ ] **`scroll-lock.ts` usa un sistema de `owners`**: Si un componente llama a `unlockScroll` con un `owner` que no está en el Set, no pasará nada (seguro). Pero si llama a `unlockScroll` con el `owner` de otro componente, lo liberará incorrectamente.

## Anti-Patrones

- NO usar el mismo `layoutId` en más de un elemento del DOM simultáneamente
- NO escribir `document.body.style.overflow` directamente — usar siempre `scroll-lock.ts`
- NO asumir el orden de ejecución de `AnimatePresence` en componentes anidados
- NO hardcodear `"footer-cta"` como `layoutId` — usar la prop `instanceId` para generarlo

---

*PRP pendiente aprobación. No se ha modificado código.*
