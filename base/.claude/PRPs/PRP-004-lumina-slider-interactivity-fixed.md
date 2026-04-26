# PRP-004: Lumina Slider Interactivity Fix & Extension

> **Estado**: COMPLETADO
> **Fecha**: 2026-03-21
> **Proyecto**: SaaS Factory V3

---

## Objetivo

Corregir la funcionalidad de navegación de las flechas (prev/next) en `LuminaSlider` y habilitar que el texto principal (título y descripción) de las pestañas redirija a sus respectivas subpáginas de módulo al recibir un clic.

## Por Qué

| Problema | Solución |
|----------|----------|
| Las flechas de navegación UI no responden al click porque el selector DOM estaba apuntando a un scope equivocado (`sliderRef` vs `overlayRef`). | Corregir la referencia DOM (`overlayRef.current.querySelector`) para atar los eventos correctamente. |
| El usuario tiene que buscar la pestaña pequeña para hacer clic y navegar a la página del módulo, reduciendo la conversión térmica y descuidando el copy amplio como *Call to Action*. | Añadir un event listener al copy central (`lumina-title` y `lumina-description`) que redirija basado en la propiedad `href` actual del bucle. |

**Valor de negocio**: Mejor experiencia de usuario (UX) previniendo una interfaz rota (flechas que no hacen nada) y maximizando la retención y clicks (CTR) al convertir el área de texto más grande de la pantalla interactiva en una zona de redirección.

## Qué

### Criterios de Éxito
- [ ] Clic en flecha derecha (`.lumina-arrow-next`) avanza una diapositiva.
- [ ] Clic en flecha izquierda (`.lumina-arrow-prev`) retrocede una diapositiva.
- [ ] Clic en el título o descripción central de los módulos 1, 2, 3 y 4 redirige inmediatamente a la subpágina respectiva (`/modulos/...`).
- [ ] Las diapositivas 5 y 6 (que no son módulos) no tienen cursor apuntador ni redirigen al hacerles clic en su título/descripción.

### Comportamiento Esperado
1. El usuario navega hacia abajo, el Hero se expande y arranca el Lumina Slider.
2. El usuario ve "Vendedor IA 24/7" y hace clic derecho en la flecha; pasa a "Landing de Alta Conversión".
3. El usuario lee "Copywriting diseñado para convertir..." y le da clic al texto mismo.
4. El navegador redirige instántaneamente a `/modulos/landing`.

---

## Contexto

### Referencias
- `src/shared/components/ui/lumina-slider.tsx` - Archivo core.
- Se cuenta actualmente con el array `SLIDES` local con la propiedad `href`.

### Arquitectura Propuesta (Feature-First)
No se requiere agregar nuevos archivos, se modificarán los Side Effects del componente UI central (`LuminaSlider`).

---

## Blueprint (Assembly Line)

### Fase 1: Mapeo de Contexto y PRP
**Objetivo**: Entender el origen del fallo de las flechas y diseñar la inyección de clicks en el texto.
**Validación**: PRP-004 creado.

### Fase 2: Implementación (React & DOM manipulation)
**Objetivo**: Corregir referencias y agregar listener de clics dinámicos.
**Validación**: 
- Modificar `LuminaSlider.tsx`: Cambiar `container.querySelector` por `overlayRef.current?.querySelector` para ubicar flechas.
- Agregar en el update-loop una función para habilitar/deshabilitar la clase `cursor-pointer` según si hay `href`.
- Agregar un listener al `lumina-content`.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando sin errores de Typescript y lógica correcta.
**Validación**:
- [x] `npm run typecheck` pasa.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-03-21: Selectores de DOM Parciales en React Refs
- **Error**: Al usar Vanilla JS events en componentes React manipulados por hooks (Refs), buscar elementos con `querySelector` en el Ref equivocado que no envuelve (wrap) a todo el render devolverá `null` y fallará silenciosamente el Event Listener.
- **Fix**: Usar el `Ref` correcto (en este caso el `overlayRef`) o englobar todos los hijos a manipular en un `wrapperRef` global.
- **Aplicar en**: Futuras integraciones híbridas de react-three-fiber, GSAP y React Refs vanilla.

### 2026-03-21: Pointer-Events y Eventos Vanilla vs React
- **Error**: Implementar interactividad usando `addEventListener` vanilla dentro de `useEffect` falla en Next.js (React 18 Strict Mode) si los re-renderizados desechan los listeners. Además, `.lumina-content` tenía un CSS en `pointer-events: none` por lo que la caja de impacto bloqueaba silenciosamente las interacciones del cursor sin importar su lógica JS subyacente.
- **Fix**: Atar eventos mediante `onClick={}` de React apoyándonos en un `useRef` para funciones, en lugar de usar el DOM directo para `addEventListener`, y asegurar que el CSS permita `pointer-events: auto`.
- **Aplicar en**: Cualquier nueva feature desarrollada en el frontend. Nunca usar Selectores DOM brutos para atar la UX interactiva. Considerar siempre los `pointer-events` antes de diagnosticar que un Click Handler en JS falló.

---

*PRP ejecutado exitosamente con las implementaciones correspondientes.*
