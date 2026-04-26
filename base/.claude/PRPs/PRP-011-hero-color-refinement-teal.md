# PRP-011: Refinamiento de Color en Hero (Teal-Blue Fusion)

> **Estado**: PENDIENTE
> **Fecha**: 2026-03-23
> **Proyecto**: landing-linkedin

---

## Objetivo

Sustituir el color naranja (`#f97316`) en la sección Hero por el tono "verde azulado" (teal/emerald) utilizado en el fondo general de la landing (`GlassRefractionBackground`), logrando una cohesión visual premium en toda la experiencia.

## Por Qué

| Problema | Solución |
|----------|----------|
| El color naranja en el Hero rompe la paleta de colores fría y tecnológica (teal/blue) del resto de la página. | Unificar la paleta usando tonos esmeralda/cyan que armonicen con los blobs de fondo del `GlassRefractionBackground`. |

**Valor de negocio**: Mejora la percepción de marca "premium" y "tecnológica", eliminando ruido visual cromático y centrando la atención en la propuesta de valor con un diseño más sobrio y elegante.

## Qué

### Criterios de Éxito
- [ ] Shader de fondo (`ShaderBackground.tsx`) sin rastro de naranja.
- [ ] Gradiente del título principal (`HeroSection.tsx`) actualizado a la nueva paleta.
- [ ] SVG Filters en el shader actualizados para mantener el "glow" pero en tonos teal/cyan.
- [ ] Continuidad visual perfecta entre el Hero y las secciones siguientes.

### Comportamiento Esperado (Happy Path)
Al cargar el sitio, el Hero muestra una animación de malla (Mesh Gradient) que fluye entre negros, cyanes profundos y verdes azulados brillantes. El título principal tiene un barrido de gradiente que pasa por blanco, cyan y un verde esmeralda suave, creando un efecto de "joya" tecnológica sin el impacto agresivo del naranja.

---

## Contexto

### Referencias
- `src/features/landing-page/components/HeroSection.tsx`: Define el gradiente del título.
- `src/features/landing-page/components/ShaderBackground.tsx`: Define los colores del shader interactivo y los filtros SVG.
- `src/components/ui/glass-refraction-background.tsx`: Contiene los colores de referencia del fondo general (`#00f5d4`, `#10b981`, `#34d399`).

### Colores Propuestos
- **Principal (Teal Brillante)**: `#10b981` (Emerald 500) o `#00f5d4` (Teal brillante).
- **Secundario (Teal Profundo)**: `#065f46` (Emerald 800) para sombras en el shader.
- **Acento**: `#34d399` (Emerald 400) para el centro de los gradientes.

---

## Blueprint (Assembly Line)

### Fase 1: Mapeo de Identidades Cromáticas
**Objetivo**: Confirmar los códigos de color exactos que mejor contrastan con el negro profundo sin perder legibilidad.
**Validación**: Selección final de 3 códigos hexadecimales.

### Fase 2: Implementación en ShaderBackground
**Objetivo**: Actualizar los arrays de `colors` en `MeshGradient` y los `stopColor` en los filtros SVG del Hero.
**Validación**: El fondo del Hero se visualiza completamente en la gama azul-verde.

### Fase 3: Ajuste de Gradiente de Título
**Objetivo**: Modificar el `title2RightStyle` en `HeroSection.tsx` para reflejar la nueva paleta.
**Validación**: El título "Escala en Piloto Automático" luce el nuevo gradiente sin naranja.

### Fase 4: Validación Visual Final
**Objetivo**: Asegurar que el cambio no afecte la performance ni la legibilidad.
**Validación**:
- [ ] `npm run dev` sin errores.
- [ ] Captura visual confirma armonía con el fondo general.

---

## 🧠 Aprendizajes

### [2026-03-23]: Consistencia Shader vs SVG
- **Nota**: El `HeroSection` usa tanto un shader de malla como filtros SVG para el gradiente del título. Ambos deben estar sincronizados cromáticamente para evitar discrepancias visuales.

---

## Gotchas

- [ ] El gradiente del título usa `background-size: 200% 100%` para la animación; el nuevo gradiente debe tener suficiente contraste en sus puntos medios.
- [ ] La opacidad del shader de wireframe (`0.6`) puede hacer que los colores se vean más lavados si el verde es muy claro.

---

*PRP pendiente aprobación. No se ha modificado código.*
