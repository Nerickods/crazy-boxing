---
description: Genera una Propuesta de Requerimientos de Producto (PRP) comprehensiva. Analiza el codebase para detectar patrones, estructura de archivos y puntos de integración antes de escribir el documento.
---

1. **Analiza el Input**:
   - Identifica la feature solicitada en los argumentos del usuario.

2. **Crea el directorio de salida** (si no existe):
   - `mkdir -p PRPs`

3. **Investigación del Codebase (Deep Dive)**:
   - **Estructura**: Usa `list_dir` en `src/features` y `src/app` para entender el mapa actual.
   - **Patrones**: Si la feature se parece a una existente (ej. "auth"), usa `list_dir` dentro de `src/features/auth` para ver sus componentes, services y stores.
   - **Búsqueda**: Usa `grep_search` para encontrar referencias clave relacionadas con la nueva feature (ej. si es "pagos", busca "stripe" o "payment").

4. **Generación del Documento PRP**:
   - Crea un nuevo archivo en `PRPs/[nombre-feature]-[fecha].md`.
   - **IMPORTANTE**: El contenido debe seguir estrictamente la estructura "Feature-First" del proyecto.
   - Incluye secciones:
     - **Goal**: Qué vamos a construir.
     - **Current State**: Qué archivos existen ya.
     - **Proposed Changes**: Árbol de archivos nuevos (`[NEW]`) y modificados (`[MODIFY]`).
     - **Implementation Plan**: Lista de tareas paso a paso.
     - **Validation**: Comandos para probar (tests, lint, etc).

5. **Notifica al Usuario**:
   - Confirma que el PRP ha sido generado y solicita revisión antes de pasar a la implementación.
