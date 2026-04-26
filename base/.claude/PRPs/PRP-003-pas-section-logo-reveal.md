# PRP-003: PasSection — Logo Fly-Up to CTA Reveal

## Objetivo
Añadir un nuevo fotograma de scroll en el `PasSection` donde el logo + nombre de la agencia aparecen como una pieza de contenido después del último texto, ascienden con el scroll y se convierten en el encabezado visual del CTA final ya existente.

## Por qué
Actualmente el CTA aparece de golpe con `opacity 0→1`. La transición se siente brusca. Con este cambio el usuario ve cómo la marca "materializa" orgánicamente desde abajo, creando continuidad narrativa y aumentando la autoridad percibida antes de presentar el CTA.

---

## Contexto de Código

**Archivo**: `src/features/landing-page/components/PasSection.tsx`

### Estructura actual (225 líneas)
```
Section (height: 800vh, sticky viewport)
  ├── Intro icons            → scroll [0.00 – 0.12]
  ├── ScrollTitleFlow[0]     → item center: 0.15  (Tu tiempo se agota...)
  ├── ScrollTitleFlow[1]     → item center: 0.33  (Pierdes prospectos...)
  ├── ScrollTitleFlow[2]     → item center: 0.51  (Tu negocio es una caja negra...)
  ├── ScrollTitleFlow[3]     → item center: 0.69  (La tecnología ha mutado...)
  └── Final CTA overlay      → opacity in [0.88 – 0.94]
        Logo + "Élite IA digital"  ← ya existe como estático dentro del CTA
        "CONTROL ABSOLUTO"
        Copy + Botón + Micro-copy
```

### Problema
El logo + nombre de la agencia están hoy dentro del bloque CTA como **elemento estático** (sin animación propia). El objetivo es darles **vida de scroll** antes de que el CTA completo aparezca.

### Patrón existente — `ScrollTitleFlow`
El componente ya tiene un patrón cinematic que funciona así:
- `itemCenter` = punto medio del progreso donde el item está en foco
- Rangos de `opacity`, `y`, `scale`, `blur` interpolados con `useTransform`
- Los items aparecen desde abajo, se centran, luego ascienden.

---

## Criterios de Éxito

1. **Narración continua**: El logo + brand aparece en el flujo después del ítem 4, como si fuera "ítem 5".
2. **Transición fluida**: El logo asciende suavemente con el scroll, sin salto abrupto.
3. **Integración con CTA**: Cuando el logo llega al 75% de su "altura de destino", el textblock del CTA empieza a aparecer debajo de él — no encima.
4. **Sin jank**: El logo solo usa `transform` (y, scale, opacity). Nada que cause layout recalc.
5. **Consistente con el branding**: El `Élite` lleva el gradiente cyan-emerald igual que en el Header.

---

## Comportamiento Esperado — Happy Path

```
[scroll 0.69]  Último texto: "La tecnología ha mutado. Toma el control."
                ↓ asciende hacia arriba como los demás ítems
[scroll 0.78]  Logo aparece desde abajo, centrado en pantalla.
               Debajo: "ÉLITE IA DIGITAL" en pequeño tracking.
                ↓ usuario sigue scrolleando
[scroll 0.84]  Logo + brand han subido ~40% de la pantalla desde center.
               El texto "CONTROL ABSOLUTO" aparece debajo.
                ↓ sigue scrolleando
[scroll 0.92]  Todo el CTA visible: Logo arriba (fijo en su posición),
               Copy + botón + micro-copy. Estado final = foto actual del usuario.
```

---

## Blueprint de Fases

### Fase 1 — Agregar `LogoBrandFlow` como ítem de scroll independiente
- Crear componente `LogoBrandFlow({ progress })` con la misma arquitectura de `ScrollTitleFlow`.
- `itemCenter = 0.78` (después del ítem 4 en `0.69`).
- La animación: `y` de `+400px → 0` mientras el progreso pasa `[0.72, 0.83]`.
- Una vez el progreso supera `0.83`, el logo queda en posición `y: -30px` (leve ascenso continuo).

### Fase 2 — Desacoplar el logo del CTA estático
- Quitar el bloque del logo del `motion.div` del Final CTA.
- El logo ya está siendo animado por `LogoBrandFlow` desde la Fase 1.
- El CTA ahora solo contiene: título `Control Absoluto` + copy + botón + micro-copy.
- Ajustar el timing del CTA para aparecer en `[0.82, 0.90]` (ligeramente antes que ahora).

### Fase 3 — Sincronizar posición del logo con el layout del CTA
- En el estado final (`progress > 0.90`) el logo debe descansar visualmente encima del título.
- Usar `position: absolute` en relación al contenedor del `sticky div`.
- Coordinar `y` final del logo con el `y: 0` del CTA para que ambos formen un bloque visual coherente.

---

## Restricciones

- No cambiar la altura total de la sección (`800vh`).
- Solo usar `transform` (y, opacity, scale). Sin `height/width/top/left` animados.
- No usar `requestAnimationFrame` manual — todo via Framer Motion `useTransform`.
- El logo final en pantalla debe quedar en la misma posición visual que en la foto compartida.

---

## Aprendizajes (Post-implementación)

*(Se completan durante la ejecución)*
