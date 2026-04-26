# PRP-012: Hero Copy Legibility Refinement

Improve the visibility and legibility of secondary copy and call-to-action elements in the Hero section without sacrificing the premium, cinematic aesthetic.

## 🎯 Objetivo
Hacer que las frases clave del Hero sean legibles sobre el fondo dinámico de shaders, utilizando técnicas de contraste modernas (glassmorphism, tipografía refinada y micro-brillos).

## 🏗️ Cambios Propuestos

### 1. Copy Secundario ("Sin agencias lentas...")
- **Problema**: El color `text-slate-400` se funde con las sombras del background.
- **Solución**: 
    - Cambiar a `text-slate-200` o `text-white/80`.
    - Aumentar el grosor a `font-medium`.
    - Añadir un `text-shadow` sutil para separar el texto del fondo.

### 2. Badge de Cupos ("Cupos limitados...")
- **Problema**: `text-slate-500` e `italic` es muy difícil de leer.
- **Solución**:
    - Enmarcar en un pequeño badge con `bg-white/5` y `backdrop-blur-sm`.
    - Cambiar a `text-accent-cyan` o `text-slate-100`.
    - Eliminar `italic` para mejorar la lectura rápida.

### 3. Acción "Explorar Soluciones"
- **Problema**: El color `text-slate-400` carece de jerarquía visual.
- **Solución**:
    - Cambiar a `text-slate-100`.
    - Añadir una pequeña animación de rebote (bounce-v) en el icono `ArrowDown` para atraer la mirada.

## 🧪 Plan de Verificación
- **Visual**: Confirmar que los textos son legibles incluso cuando los "blobs" del background pasan por detrás.
- **Responsive**: Verificar que el espaciado de los badges sea correcto en mobile.

---
*Propuesto por el Agente SaaS Factory para optimización de UX.*
