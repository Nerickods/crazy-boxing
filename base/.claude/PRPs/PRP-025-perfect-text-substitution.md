# PRP-025: Sustitución de Texto Pixel-Perfect (Clip-Path Bidireccional)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-27
> **Proyecto**: KIA Intelligence

---

## Objetivo

Corregir el "ghosting" o amontonamiento de texto durante las transiciones en `BenefitsList`. El objetivo es que la Tarjeta N "borre" o sustituya a la Tarjeta N-1 de forma limpia durante el revelado, logrando que el texto entrante se vea al 100% de su color sin la interferencia del texto anterior detrás.

## Por Qué

| Problema | Solución Técnica |
|----------|------------------|
| La Tarjeta N es semi-transparente durante el scroll. Aunque se revela por `clip-path`, la Tarjeta N-1 sigue totalmente presente detrás, lo que causa que los textos se encimen. | Implementar un **Clip-Path Bidireccional**. Mientras la Tarjeta N-1 se desplaza para "abrirse" (revelado de izquierda a derecha), la Tarjeta N-1 debe "cerrarse" o recortarse en la misma proporción y dirección. |
| El texto tarda en alcanzar su color final debido a la opacidad progresiva. | Eliminar el fade gradual de opacidad en el texto (contenido) y confiar únicamente en el recorte físico del `clip-path` para una aparición "sharp" y sólida. |

**Valor de negocio**: Legibilidad impecable y un efecto de "escaneado" o "sustitución" futurista que encaja perfectamente con el branding de IA de alta precisión.

## Qué

### Criterios de Éxito
- [ ] No hay detección visual de dos capas de texto simultáneas en el mismo espacio.
- [ ] El texto entrante aparece con su intensidad de color final desde el primer píxel revelado.
- [ ] La transición se siente como un único componente que cambia de estado, no como dos capas encimadas.

### Comportamiento Esperado
1. Beneficio 1 (B1) está visible.
2. Inicia scroll hacia Beneficio 2 (B2).
3. B2 revela su primer 10% (lado izquierdo).
4. **SINCRO**: B1 oculta su primer 10% (lado izquierdo) mediante un recorte inverso.
5. El "borde" del revelado de B2 actúa como una cuchilla que va borrando a B1 mientras aparece B2.

---

## Contexto Técnico

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx`
- `clip-path: inset(top right bottom left)`

---

## Blueprint (Assembly Line)

### Fase 1: Mapeo de Clip-Path Inverso (The "Eraser" Logic)
**Objetivo**: Crear un `exitMask` para la tarjeta actual basado en el progreso de la siguiente.
**Lógica**: 
- `entryMask(i)` = `inset(0 X% 0 0)` (revelando de izquierda a derecha)
- `exitMask(i)` = `inset(0 0 0 (100-X)%)` (ocultando de izquierda a derecha)

### Fase 2: Implementación de Aparición Directa (Sharp Content)
**Objetivo**: Ajustar `visualProgression` para que el texto sea opaco casi de inmediato.
**Acción**: Cambiar el rango de opacidad del contenido de `[0.1 -> 1]` a un valor mucho más agresivo o eliminarlo en favor del `clip-path`.

### Fase 3: Validación de Pixel-Perfect Substitution
**Objetivo**: Eliminar completamente el amontonamiento.
**Validación**:
- [ ] `npm run typecheck`
- [ ] Verificación de screenshots para asegurar 0% traslape de texto.

---

## 🧠 Aprendizajes (Self-Annealing)

### 2026-03-27: Clipping vs Masking
- **Insight**: La transparencia (glassmorphism) exige que no solo controlemos la entrada de nuevos elementos, sino que modifiquemos la geometría de los elementos salientes para evitar la suma de opacidades indeseadas.

---

*PRP pendiente aprobación.*
