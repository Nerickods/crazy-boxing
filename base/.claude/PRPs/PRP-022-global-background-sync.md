# PRP-022: Global Background — Pure Black "Elite" Sync

## Objetivo
Unificar la identidad visual de toda la landing page extrayendo el "Tono Verde" exacto de la parte final de la `PasSection` (un degradado profundo Emerald/Teal) y aplicándolo como el fondo general (`body` y `background-dark`) del sitio.

## Por Qué (Valor de Negocio)
- **Identidad de Marca Única**: El uso de un "negro verdoso" (Emerald-Black) es mucho más sofisticado y premium que el negro puro o el slate genérico.
- **Inmersión Total**: El color capturado en la imagen proporcionada por el usuario crea una atmósfera de "Matrix de lujo" que encaja perfecto con la temática de IA Intelligence.
- **Continuidad Atmosférica**: Elimina el salto visual entre la oscuridad total y el fondo de la página.

## Criterios de Éxito
- [ ] **Fondo Global #000000**: El body de la aplicación debe usar negro absoluto.
- [ ] **Sincronización de Tailwind**: Actualizar la variable `background-dark` en la configuración para que todos los componentes reactivos la usen.
- [ ] **Consistencia en Secciones**: Verificar que secciones con transparencias (como `ProcessSection`) sigan viéndose bien sobre el nuevo fondo.

## Comportamiento Esperado (Happy Path)
1. El usuario navega por la landing y no nota ningún cambio de tono de fondo al entrar o salir de la `PasSection`.
2. Los textos `slate-100` y el `accent-cyan` tienen un brillo más pronunciado debido al mayor contraste del fondo.

## Contexto Técnico
- **Origen del color**: `src/features/landing-page/components/PasSection.tsx` -> Clase `bg-black`.
- **Destinos**:
  - `src/app/globals.css`: Cambiar `#0a0a0c` por `#000000`.
  - `tailwind.config.ts`: Cambiar `background-dark` por `#000000`.

## Blueprint de Fases

### Fase 1: Extracción y Mapeo
- Confirmar que `#000000` es el valor óptimo (Pure Black de `PasSection`).

### Fase 2: Aplicación Global
- Modificar `tailwind.config.ts` para redefinir el token de diseño.
- Modificar `globals.css` para el renderizado inicial del navegador.

### Fase 3: Validación Visual
- Comprobar legibilidad y contraste en todas las secciones principales.

---

## Aprendizajes (Auto-Blindaje)
- *A completar tras la implementación*
