---
description: "Actualiza SaaS Factory a la ultima version."
---

# Update SaaS Factory

Este comando actualiza las herramientas de desarrollo (carpeta `.agent/` y `.claude/`) a la ultima version disponible.

## Proceso

### Paso 1: Confirmar ubicación del repo fuente

Pregunta al usuario por la ruta del repo `saas-factory-setup` si no la conoces.

```
Por favor, confirma la ruta donde tienes el repositorio principal de saas-factory (donde haces git pull originalmente).
Ejemplo: /home/user/saas-factory-setup
```

### Paso 2: Actualizar el repositorio fuente

Una vez tengas la ruta del repo (digamos `REPO_PATH`), actualiza con git:

```bash
cd [REPO_PATH]
git pull origin main
```

### Paso 3: Reemplazar carpetas

Elimina las carpetas actuales y copia las nuevas:

```bash
# En el directorio del proyecto actual
rm -rf .claude/
rm -rf .agent/
cp -r [REPO_PATH]/saas-factory/.claude/ .claude/
cp -r [REPO_PATH]/saas-factory/.agent/ .agent/
```

### Paso 4: Confirmar actualizacion

Informa al usuario:

```
SaaS Factory actualizado correctamente.

Cambios aplicados:
- .agent/workflows/    (workflows actualizados)
- .agent/skills/       (skills actualizados)
- .claude/             (legacy tools actualizadas)

Archivos NO modificados:
- CLAUDE.md (tu configuracion de proyecto)
- .mcp.json (tus tokens y credenciales)
- src/ (tu codigo)
```

## Notas

- Este comando NO modifica `CLAUDE.md`, `.mcp.json` ni el codigo fuente
- Solo actualiza la "toolbox" de desarrollo
