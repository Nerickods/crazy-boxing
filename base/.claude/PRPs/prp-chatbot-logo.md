# PRP-002: Logo Chatbot Widget

> **Estado**: COMPLETADO
> **Fecha**: 2026-04-09
> **Proyecto**: landing-linkedin

---

## Objetivo

Agregar el logo corporativo (`logo-removebg-preview.png`) en el centro del widget del chatbot (`PulsingOrb`), asegurando que se integre perfectamente con la estética neón/glassmorphism tanto en la versión WebGL (Desktop) como en el fallback SVG (Mobile iOS).

## Por Qué

| Problema | Solución |
|----------|----------|
| El botón del chatbot actual es un anillo hueco que carece de la identidad gráfica de la marca. | Insertar el logotipo en el hueco del anillo para darle identidad corporativa y anclar la atención del usuario. |

**Valor de negocio**: Reforzar el branding de KIA Intelligence en cada interacción del usuario con el asistente y hacer el widget visualmente completo y profesional.

## Qué

### Criterios de Éxito
- [ ] El logo se renderiza perfectamente centrado dentro del anillo web/SVG.
- [ ] El tamaño es proporcional y nítido (manteniéndose responsive al prop `size` de `PulsingOrb`).
- [ ] Se ajustan filtros y drop-shadows al logo para mantener la estética premium.
- [ ] NO interfiere con eventos de clic del componente padre (`pointer-events-none`).
- [ ] Reproducibilidad visual sin artefactos en entorno Desktop y Mobile.

### Comportamiento Esperado
El anillo azul rota y pulsa, bordeado por el texto giratorio. En el centro exacto, el logotipo KIA se muestra con sombra y/o filtro estético (como drop shadow neón), flotando armónicamente sin superponerse negativamente a las animaciones de fondo.

---

## Contexto

### Referencias
- `src/features/landing-page/components/PulsingOrb.tsx`
- Componente fallback: `OrbSvgFallback`
- Activo público: `/logo-removebg-preview.png`

### Arquitectura Propuesta (Feature-First)
En `src/features/landing-page/components/PulsingOrb.tsx`:
- Acoplaremos una imagen optimizada sobre el core render ({`webGLSupported ? PulsingBorder : OrbSvgFallback`}), anidada pero utilizando absolutismo y `pointer-events-none`.

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase siguiendo el bucle agéntico.

### Fase 1: Inserción del Asset
**Objetivo**: Colocar la tag HTML/Next de imagen en el componente, asegurando su centraje asoluto mediante CSS flexbox en un wrapper o top/left positionings para no romper el flex paterno.
**Validación**: El PNG se aprecia bien en el centro tanto en mobile view como desktop view de localhost.

### Fase 2: Afinación Premium & Responsividad
**Objetivo**: Otorgar filtro drop-shadow para igualar contraste al glow del widget, adecuar la saturación del logo e indagar en escalas paramétricas dinámicas para tamaño general (`svgScale` equivalente estético).
**Validación**: Calidad gráfica superior al contrastarse el png negro-blanco-azul con los neon cyan de fondo. Evitar desproporciones en distintas partes de la interfaz web.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando end-to-end.
**Validación**:
- [ ] `npm run typecheck` pasa
- [ ] `npm run build` exitoso
- [ ] Visulmente chequeado.
- [ ] Criterios de éxito cumplidos

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [2026-04-09]:
- **Error**: N/A
- **Fix**: N/A
- **Aplicar en**: N/A

---

## Gotchas

- [ ] Si usamos `next/image` en vez de nativo `<img>`, recordar importarlo y proveer atributos fijos si no queremos layout shifts ni bugs visuales.

## Anti-Patrones

- NO añadir configuraciones de z-index pesadas — tratarlo como un overlayer simple al nivel de la `motion.svg` circular es lo ideal.

---

*PRP pendiente aprobación. No se ha modificado código.*
