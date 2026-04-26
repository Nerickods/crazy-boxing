# PRP-009: Corregir error de tipos en BenefitsList (Vercel Build)

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-22
> **Proyecto**: landing-linkedin

---

## Objetivo

Resolver el error de compilación en Vercel corrigiendo la inconsistencia de tipos en el componente `BenefitsList.tsx` y el componente compartido `FullScreenScrollFX.tsx`. El estado final es un build de producción exitoso.

## Por Qué

| Problema | Solución |
|----------|----------|
| El build de Vercel falla porque `cinematicSections` contiene objetos con `background` indefinido, mientras que el tipo `Section` lo requiere obligatoriamente. | Hacer `background` opcional en el tipo `Section` de `FullScreenScrollFX.tsx` (ya que se usa `renderBackground` como alternativa) y asegurar que `BenefitsList.tsx` cumpla con los tipos de forma consistente. |

**Valor de negocio**: Desbloquea los despliegues a producción en Vercel y refuerza la robustez del sistema de tipos en componentes compartidos.

## Qué

### Criterios de Éxito
- [ ] El archivo `src/shared/components/ui/full-screen-scroll-fx.tsx` permite `background` opcional.
- [ ] El archivo `src/features/landing-page/components/BenefitsList.tsx` no presenta errores de asignación en la prop `sections`.
- [ ] `npm run build` finaliza exitosamente en el entorno local.

### Comportamiento Esperado
El sistema debe permitir definir secciones en el scroll cinemático usando ya sea una imagen de fondo estática (`background`) o un componente renderizado dinámicamente (`renderBackground`), sin obligar a proporcionar ambos.

---

## Contexto

### Referencias
- `src/features/landing-page/components/BenefitsList.tsx` - Ubicación del error reportado.
- `src/shared/components/ui/full-screen-scroll-fx.tsx` - Definición del tipo `Section` y lógica de renderizado de fondo.

### Arquitectura Propuesta (Corrección)
```typescript
// src/shared/components/ui/full-screen-scroll-fx.tsx

type Section = {
  id?: string;
  background?: string; // Cambiado de obligatorio a opcional
  leftLabel?: ReactNode;
  title: string | ReactNode;
  rightLabel?: ReactNode;
  content?: ReactNode; 
  renderBackground?: (active: boolean, previous: boolean) => ReactNode;
};
```

---

## Blueprint (Assembly Line)

### Fase 1: Corrección de Tipos en Componente Compartido
**Objetivo**: Modificar `Section` en `full-screen-scroll-fx.tsx` para que `background` sea opcional.
**Validación**: Verificación visual de que el IDE deja de marcar error en `BenefitsList.tsx`.

### Fase 2: Ajuste en BenefitsList (Opcional)
**Objetivo**: Si persisten inconsistencias en la inferencia de tipos de `cinematicSections`, añadir el tipo explícito `Section[]`.
**Validación**: No hay "red lines" en el archivo.

### Fase 3: Validación Final
**Objetivo**: Sistema funcionando y build exitoso.
**Validación**:
- [ ] `npm run build` exitoso localmente.
- [ ] Verificación de que el fondo se sigue renderizando correctamente en la landing.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### 2026-04-22: Inferencia de tipos en arrays de objetos mixtos
- **Error**: Al definir un array de objetos donde algunos tienen una propiedad y otros no, TypeScript infiere un tipo unión que puede no ser asignable a un tipo estricto si la propiedad es obligatoria en el destino.
- **Fix**: Hacer la propiedad opcional en la interfaz base si realmente no es necesaria para todos los casos de uso (como cuando hay un render alternativo).
- **Aplicar en**: Todos los componentes que acepten arrays de configuración/secciones.

---

## Gotchas

- [ ] `FullScreenScrollFX` usa `s.background` en un fallback de renderizado. Debemos asegurar que si ni `renderBackground` ni `background` están presentes, el componente no rompa (aunque el tipo ahora permita ambos opcionales).

## Anti-Patrones

- NO usar `any` para silenciar el error.
- NO usar `@ts-ignore` si se puede corregir la definición del tipo.

---

*PRP pendiente aprobación. No se ha modificado código.*
