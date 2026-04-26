# PRP-021: Header Situacional Preciso para Sección Servicios

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-02
> **Proyecto**: KIA Intelligence Landing

---

## Objetivo

Reemplazar el `IntersectionObserver` (que dispara antes de que la sección bloquee la pantalla) por la misma lógica scroll-based que usa el Hero, de modo que `isInServices` sea `true` **exclusivamente** cuando la sección de servicios ocupa el 100% del viewport (el usuario está dentro del bloqueo).

## Por Qué

| Problema | Causa Técnica |
|----------|---------------|
| El efecto del header aparece mucho antes de entrar a la sección | `IntersectionObserver` detecta que cualquier parte del DOM del elemento es visible — pero `FullScreenScrollFX` infla su `offsetHeight` al 3x viewport con `pinSpacing: true` de GSAP |
| El Hero funciona perfectamente | El Hero usa `scrollY > 20` — una comparación directa de posición, sin observers |

**Diagnóstico Real**:
- La sección `#benefits-scroll-fx` en el DOM mide `3 * 100vh` en altura
- Con cualquier `IntersectionObserver`, este elemento empieza a "intersectar" desde 3 secciones antes de que el usuario llegue al bloqueo visual
- La solución: usar el `scroll handler` ya existente para comparar `scrollY` con los límites reales del bloqueo

## Qué

### Criterios de Éxito
- [ ] El header muestra el estado transparente + "· Services" **SOLO** cuando el scroll está dentro de `[sectionTop, sectionTop + sectionScrollHeight - viewportHeight]`
- [ ] No hay parpadeos ni activaciones prematuras
- [ ] Al salir de la sección por abajo, el header vuelve instantáneamente a su estado compact glassmorphic
- [ ] En el Hero: el comportamiento no cambia (sigue igual)

### Comportamiento Esperado

```
scrollY = 0                    → Hero: header transparente
scrollY = 20+                  → Secciones medias: header glassmorphic
scrollY = sectionTop           → Servicios empieza a bloquear → header transparente + "· Services"
scrollY = sectionTop + X       → Mitad del bloqueo → igual
scrollY = sectionEnd           → Fin del bloqueo → header glassmorphic, sin label
```

---

## Contexto

### Cómo Funciona el Hero (Referencia)

```tsx
// Header.tsx actual - lógica del Hero:
const handleScroll = () => {
  setIsScrolled(window.scrollY > 20);
};
```

El header es transparente cuando `scrollY <= 20` — simplicidad total. Para replicar esto en Servicios necesito:

```tsx
const handleScroll = () => {
  const y = window.scrollY;
  setIsScrolled(y > 20);

  // Servicios: verificar si el scroll está dentro del rango de "bloqueo"
  const section = document.getElementById("benefits-scroll-fx");
  if (section) {
    const top = section.offsetTop;
    const scrollHeight = section.offsetHeight - window.innerHeight;
    // El usuario está "dentro" del bloqueo cuando scrollY está entre top y top+scrollHeight
    setIsInServices(y >= top && y < top + scrollHeight);
  }
};
```

### Por Qué Eliminar el IntersectionObserver

- El `offsetHeight` del elemento es 3x el viewport (GSAP `pinSpacing`)
- Con `threshold: 0`, el observer dispara cuando el PRIMER PIXEL entra al viewport
- Eso ocurre cuando el usuario aún está muy por encima de la sección
- `rootMargin` negativo solo introduce latencia, no resuelve el problema de fondo

### Archivos Afectados

| Archivo | Cambio |
|---------|--------|
| `Header.tsx` | Migrar de `IntersectionObserver` a `scrollY` range check |

---

## Blueprint (Assembly Line)

### Fase 1: Migrar Lógica en Header.tsx
**Objetivo**: Eliminar el `IntersectionObserver` y calcular `isInServices` via `scrollY` dentro del handler existente.

**Implementación exacta**:
```tsx
useEffect(() => {
  setIsMounted(true);
  
  const handleScroll = () => {
    const y = window.scrollY;
    setIsScrolled(y > 20);
    
    // Calcular si estamos en el bloqueo de la sección de servicios
    const section = document.getElementById("benefits-scroll-fx");
    if (section) {
      const sectionTop = section.offsetTop;
      // El "bloqueo" dura desde que el top de la sección toca el top del viewport
      // hasta que el bottom de la sección supera el bottom del viewport
      const blockingEnd = sectionTop + section.offsetHeight - window.innerHeight;
      setIsInServices(y >= sectionTop && y <= blockingEnd);
    }
  };
  
  // Ejecutar una vez al montar para estado inicial correcto
  handleScroll();
  
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**Validación**: Al scrollear, el header solo cambia de estado exactamente cuando se entra/sale del bloqueo.

### Fase 2: Validación Final + Push
**Objetivo**: Sistema funcionando end-to-end sin regresiones.
**Validación**:
- [ ] `npm run typecheck` pasa sin errores
- [ ] `git push origin feature/ai-chatbot-admin`

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-04-02: IntersectionObserver NO funciona con GSAP pinSpacing
- **Error**: El `IntersectionObserver` se activa prematuramente porque GSAP `pinSpacing: true` infla el `offsetHeight` del contenedor al 3x viewport.
- **Fix**: Calcular `isInServices` directamente usando `scrollY` vs `[offsetTop, offsetTop + offsetHeight - innerHeight]` dentro del scroll handler.
- **Aplicar en**: CUALQUIER sección que use `FullScreenScrollFX` con `pin: fixed` en GSAP ScrollTrigger. NUNCA usar IntersectionObserver para detectar secciones pinadas.

---

## Gotchas

- [ ] La comparación `y >= sectionTop && y <= blockingEnd` puede tener un frame de delay al montar. Llamar `handleScroll()` inmediatamente en el `useEffect` para el estado inicial
- [ ] No usar `{ threshold: ... }` en observers para secciones sticky/pinadas de GSAP

## Anti-Patrones

- ❌ NO usar `IntersectionObserver` para secciones pinadas con GSAP
- ❌ NO usar `rootMargin` negativo como workaround — no resuelve el problema de fondo
- ✅ SÍ usar scroll handler directo con cálculo de rango `[offsetTop, offsetTop + height - vh]`

---

*PRP-021 pendiente aprobación. No se ha modificado código.*
