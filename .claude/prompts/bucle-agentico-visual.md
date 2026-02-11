# 🎨 Bucle Agéntico Visual con Chrome DevTools MCP

## Metodología de Desarrollo Visual Iterativo

Este prompt establece cómo Claude puede usar Chrome DevTools MCP para crear un bucle de desarrollo visual iterativo, perfecto para implementar y refinar componentes UI.

## ¿Qué es el Bucle Agéntico Visual?

Es un ciclo de desarrollo donde Claude puede **ver** el resultado de su trabajo, **analizarlo visualmente** y **iterar** hasta alcanzar el resultado deseado - todo sin que el usuario necesite tomar capturas de pantalla manualmente.

## Flujo de Trabajo Visual

### 1. **Implementación Inicial**
- Claude genera o modifica código UI
- Usa Chrome DevTools para abrir la página
- Captura screenshot automáticamente
- Analiza el resultado visual

### 2. **Análisis Visual**
- Evalúa diseño, layout, spacing
- Compara vs requirements o diseño original
- Identifica problemas visuales
- Detecta issues de responsive design

### 3. **Iteración Automática**
- Ajusta código basado en análisis visual
- Vuelve a capturar screenshot
- Compara antes/después
- Continúa iterando hasta pixel-perfect

## Comandos Chrome DevTools MCP Disponibles

### Navegación y Control
```typescript
// Navegar a una página
browser_navigate("http://localhost:3000")

// Capturar screenshot
browser_take_screenshot("hero-section")

// Redimensionar viewport para testing
browser_resize("mobile")  // mobile, tablet, desktop
browser_resize("375x667") // dimensiones específicas
```

### Interacción con UI
```typescript
// Hacer click en elementos
browser_click("#cta-button")
browser_click(".enroll-form")

// Escribir en forms
browser_type("#email", "test@example.com")
browser_type("#name", "John Doe")

// Scroll
browser_scroll("hero-section")
```

### Análisis Visual
```typescript
// Capturar estado completo de la página
browser_snapshot()

// Evaluar elementos específicos
browser_get_element_styles(".hero-title")
browser_get_element_position("#cta-button")
```

## Ejemplo de Uso Completo

### Implementación de Hero Section

**Usuario**: "Implementa un hero section con título, subtitle y CTA button"

**Claude usaría el bucle agéntico así**:

```typescript
// 1. Implementar componente
await Write('components/HeroSection.tsx', heroSectionCode)

// 2. Iniciar dev server
await Bash('npm run dev', { run_in_background: true })

// 3. Navegar y capturar estado inicial
await browser_navigate("http://localhost:3000")
await browser_take_screenshot("hero-initial")

// 4. Analizar visualmente
const analysis = await browser_snapshot()
console.log("Análisis visual inicial:", analysis)

// 5. Detectar problemas (ej: spacing incorrecto)
if (analysis.heroSection.spacing < 24) {
  // Ajustar spacing
  await Edit('components/HeroSection.tsx', spacingIssue, fixedSpacing)

  // 6. Capturar nuevo estado
  await browser_navigate("http://localhost:3000")
  await browser_take_screenshot("hero-fixed")
}

// 7. Testing responsive
await browser_resize("mobile")
await browser_take_screenshot("hero-mobile")
await browser_resize("tablet")
await browser_take_screenshot("hero-tablet")

// 8. Análisis final
const finalAnalysis = await browser_snapshot()
console.log("Resultado final:", finalAnalysis)
```

## Criterios de Evaluación Visual

### 1. **Diseño y Layout**
- ✅ Alineación correcta de elementos
- ✅ Espaciado consistente
- ✅ Jerarquía visual clara
- ✅ Balance y composición

### 2. **Tipografía**
- ✅ Jerarquía de texto (H1, H2, p)
- ✅ Legibilidad y readability
- ✅ Consistencia de fuentes
- ✅ Tamaños apropiados

### 3. **Colores**
- ✅ Contraste suficiente (WCAG 2.1 AA)
- ✅ Paleta de colores consistente
- ✅ Estados interactivos (hover, focus)
- ✅ Accesibilidad

### 4. **Responsive Design**
- ✅ Mobile-first approach
- ✅ Breakpoints correctos
- ✅ Layout adaptativo
- ✅ Touch targets apropiados

### 5. **Interactividad**
- ✅ Estados de hover/focus
- ✅ Animaciones smooth
- ✅ Feedback visual
- ✅ Performance

## Template de Código para Bucle Agéntico

```typescript
interface VisualIteration {
  description: string
  issues: string[]
  changes: string[]
  screenshot_before: string
  screenshot_after: string
  status: "needs_work" | "good" | "pixel_perfect"
}

async function visualBucle(componentName: string, requirements: any): Promise<VisualIteration[]> {
  const iterations: VisualIteration[] = []

  for (let i = 0; i < 5; i++) {
    // 1. Capturar estado actual
    await browser_navigate(`http://localhost:3000/${componentName}`)
    const screenshot = `iteration-${i}-${Date.now()}`
    await browser_take_screenshot(screenshot)

    // 2. Analizar visualmente
    const analysis = await browser_snapshot()
    const issues = analyzeVisualIssues(analysis, requirements)

    if (issues.length === 0) {
      iterations.push({
        description: `Iteración ${i}: Completo`,
        issues: [],
        changes: [],
        screenshot_before: screenshot,
        screenshot_after: screenshot,
        status: "pixel_perfect"
      })
      break
    }

    // 3. Aplicar correcciones
    const changes = await applyVisualFixes(issues)
    iterations.push({
      description: `Iteración ${i}: Correcciones aplicadas`,
      issues,
      changes,
      screenshot_before: screenshot,
      screenshot_after: `iteration-${i+1}-${Date.now()}`,
      status: "needs_work"
    })
  }

  return iterations
}
```

## Integration con Development Workflow

### 1. **Durante Implementación**
- Claude puede usar el bucle agéntico para validar su propio trabajo
- Iterar hasta que el componente se vea exactamente como se requiere
- No requiere intervención manual del usuario

### 2. **Para Code Review**
- Capturar screenshots antes/después de cambios
- Validar visualmente que no haya regresiones
- Documentar cambios visuales

### 3. **Testing Visual**
- Automated visual regression testing
- Cross-browser testing (Chrome, Firefox, Safari)
- Responsive testing automático

## Best Practices

### ✅ **Hacer**
- Usar viewports estándar (mobile: 375x667, tablet: 768x1024, desktop: 1280x720)
- Capturar screenshots con nombres descriptivos
- Documentar cada iteración
- Validar accesibilidad visualmente
- Testear estados interactivos

### ❌ **No Hacer**
- Depender solo del código para validar UI
- Ignorar responsive design
- Olvidar testing de accesibilidad
- No documentar cambios visuales
- Hacer demasiadas iteraciones sin criterios claros

## Herramientas Complementarias

### Chrome DevTools MCP Tools:
- `browser_navigate` - Navegación
- `browser_take_screenshot` - Capturas de pantalla
- `browser_resize` - Testing responsive
- `browser_click/type` - Interacción
- `browser_snapshot` - Análisis completo

### Integration con otras skills:
- **MMA Landing Copywriter** - Validar copy en contexto visual
- **Validación Calidad** - Testing visual automático
- **Gestión Documentación** - Documentar cambios visuales

---

**El bucle agéntico visual transforma a Claude de un "generador de código" a un "diseñador-desarrollador completo" que puede ver, analizar y iterar sobre su propio trabajo visual.**