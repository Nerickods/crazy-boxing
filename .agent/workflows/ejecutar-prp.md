---
description: Implementa una característica definida en un PRP. Lee el plan, crea un plan de implementación y comienza la ejecución.
---

1. **Lee el PRP**:
   - Lee el archivo especificado en los argumentos (ej. `PRPs/nombre-feature.md`).
   - Si no se especifica, lista los archivos en `PRPs/` y pide elegir uno.

2. **Inicializa el Task Boundary**:
   - Usa `task_boundary` para definir la tarea actual.
   - **Nombre**: "Implementing [Feature Name]"
   - **Mode**: PLANNING (inicialmente para validar el plan).

3. **Crea el Artifact `implementation_plan.md`**:
   - Traslada la sección "Implementation Blueprint" del PRP al artifact `implementation_plan.md`.
   - Asegúrate de incluir la sección de verificación.

4. **Revisa Tests y Validaciones**:
   - Identifica los comandos de validación en el PRP.
   - Verifica si los tests ya existen o si hay que crearlos (TDD).

5. **Notifica al Usuario**:
   - Presenta el plan extraído y pide confirmación para cambiar a modo EXECUTION.
