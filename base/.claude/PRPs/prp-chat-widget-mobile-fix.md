# PRP-001: Corrección del Chat Widget (PulsingOrb) en iPhone/Mobile

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-09
> **Proyecto**: KIA Intelligence

---

## Objetivo

Solucionar el error de renderizado del `PulsingOrb` (el botón flotante del chatbot) en dispositivos móviles, específicamente en iPhone, para que el círculo giratorio vuelva a ser visible.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las implementaciones de WebGL (Shaders) pueden fallar silenciosamente, ser limitadas por memoria o no compilar correctamente en iOS Safari, provocando que el widget principal desaparezca. | Implementar detección robusta en cliente para forzar el _fallback_ CSS (`orb-css-fallback`) en dispositivos móviles, previniendo la ruptura visual de la UI. |

**Valor de negocio**: La Landing Page debe proyectar una imagen "Apple-style" e "invisible-stack" impecable. Un widget roto en mobile (porcentaje mayoritario del tráfico) destruye la confianza y rompe la conversión.

## Qué

### Criterios de Éxito
- [ ] iOS/iPhone detecta correctamente el entorno móvil (o touch).
- [ ] El widget del chat (`PulsingOrb`) desactiva el render de WebGL en móviles e inyecta la variante CSS fallback.
- [ ] El fallback CSS se ve visualmente atractivo (con la paleta oficial cyan/emerald) sin penalizar el performance de la batería.
- [ ] Se mantienen las animaciones SVG del texto rotatorio.

### Comportamiento Esperado
En escritorio, el widget mantendrá el `PulsingBorder` de WebGL (mesh animado). Al ingresar desde un iPhone o iPad, en lugar de intentar montar el canvas WebGL (el cual falla silenciosamente), el sistema inyectará automáticamente un CSS de conic-gradient rotatorio, brindando la misma experiencia de llamado a la acción. 

---

## Contexto

### Referencias
- Archivo actual con error: `src/features/landing-page/components/PulsingOrb.tsx`
- Condición actual: Se basa en `useWebGLSupport.ts`, pero Safari/iOS **sí** retorna *true* al consultar el contexto WebGL, aunque luego falle el render de React Shaders por limitaciones del GPU interno o precisión.
- Estilos CSS: `.orb-css-fallback` en `src/app/globals.css`.

### Arquitectura Propuesta (Feature-First)
Modificaremos la lógica actual compartida o crearemos un Hook adicional para ser más restrictivos:

```
src/shared/hooks/
├── useWebGLSupport.ts   // (Se mejorará la validación para discriminar iOS/Mobile)
└── useDeviceDetect.ts   // (Opcional, hook para chequear touchpoints/navigatorAgent)
```

Modificar Componentes:
- `PulsingOrb.tsx`: Utilizar una validación más estricta (`isMobile || !hasWebGL`).

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Detección Confiable de Entorno Móvil (iOS)
**Objetivo**: Implementar una lógica sólida (hook) que defina de manera determinista si estamos corriendo en un dispositivo móvil e iOS.
**Validación**: Hook arroja `true` en emulación móvil (DevTools) y dispositivo físico.

### Fase 2: Actualización de Lógica de Renderizado en `PulsingOrb`
**Objetivo**: Bloquear la inyección del `<PulsingBorder />` y obligar al uso de `.orb-css-fallback` si es mobile.
**Validación**: En modo mobile, el inspector DOM muestra un `<div className="orb-css-fallback">` en vez del canvas.

### Fase 3: Pulido del Fallback CSS
**Objetivo**: Mejorar las clases de `.orb-css-fallback` y animaciones del `globals.css` para que la réplica "falsa" se parezca lo máximo posible al Shader originario (glow exterior y gradiente en abanico). Revisar la superposición del SVG.
**Validación**: El círculo tiene `box-shadow` glow de acentos Cyan (`#00f2ff`) y rota suavemente.

### Fase N: Validación Final
**Objetivo**: Sistema funcionando end-to-end responsivamente.
**Validación**:
- [ ] Renderiza en desktop como WebGL.
- [ ] Renderiza en mobile emulado como CSS.
- [ ] SVG de texto rotativo NO se traslapa con el gradiente (el viewBox escala bien).
- [ ] Build exitoso.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-09]: Falla silenciosa de Shaders en iOS
- **Error**: El componente `<PulsingBorder />` usa un canvas WebGL2. iOS soporta WebGL, por tanto `useWebGLSupport()` retorna `true`, sin embargo el contexto puede crashear internamente o no tener la misma tolerancia a operaciones pesadas por pixel. Como no hay capturador de WebGL-loss, la pantalla queda transparente.
- **Fix**: Asumir que WebGL custom-shaders es inestable en iOS Mobile Safari. Fallback CSS obligatorio en Mobile.
- **Aplicar en**: Futuros componentes de partículas o gráficos 3D (Backgrounds, Hero Sections).

---

## Gotchas

- [ ] SSR & Hydration: El chequeo de "userAgent" o "matchMedia" debe ejecutarse en `useEffect` para evitar el "React Hydration Mismatch" (el servidor no sabe si el cliente es iPhone). 
- [ ] El contenedor actual de fallback tiene hardcodeado un width/height que debe respetarse.

## Anti-Patrones

- NO añadir librerías masivas completas de "device detect" para una sencilla validación. Usar nativo (navigator o matchMedia).
- NO duplicar código base del widget. Usar el ternario exacto de Render ya existente. 

---

*PRP pendiente aprobación. No se ha modificado código.*
