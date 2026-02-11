# PRP-001: Token Redemption System

> **Estado**: PENDIENTE
> **Fecha**: 2026-02-05
> **Proyecto**: MMA1 / SaaS Factory
> **Rama**: `token`

---

## Objetivo

Implementar un sistema de generación y canje de tokens para citas/inscripciones. El usuario recibe un token al registrarse, y el administrador lo valida en la sucursal para confirmar la asistencia y mostrar los datos del usuario.

## Por Qué

| Problema | Solución |
|----------|----------|
| No hay forma de validar citas presencialmente | Token único generado al inscribirse |
| Proceso manual propenso a errores | Validación automática en panel admin |
| Desconexión entre online y offline | Cierre del ciclo: Web -> Sucursal -> BD |

**Valor de negocio**: Mejora la experiencia de check-in, valida la efectividad de campañas, y digitaliza la asistencia real.

## Qué

### Criterios de Éxito
- [ ] Columna `redemption_token` añadida a tabla `enrollments`.
- [ ] Token de 6 caracteres generado automáticamente al crear enrollment.
- [ ] Token mostrado al usuario en UI (Chatbot o Formulario).
- [ ] Nueva sección "Canje" en `/admin` que permite buscar por token.
- [ ] Al ingresar token válido, muestra nombre y correo.
- [ ] Botón "Canjear" invalida el token y actualiza estado.

### Comportamiento Esperado
1.  **Usuario**: Se inscribe -> Recibe Token "ABC-123".
2.  **Admin**: Va a `/admin/redemption` (o modal) -> Ingresa "ABC-123".
3.  **Sistema**: Busca token -> Muestra "Juan Perez (juan@test.com)".
4.  **Admin**: Confirma -> Token marcado como 'redeemed' -> Feedback "Canjeado con éxito".

---

## Contexto

### Referencias
- `src/features/enrollment/`: Lógica actual de inscripción.
- `src/app/admin/`: Panel de administración existente.

### Arquitectura Propuesta (Feature-First)

Vamos a extender `features/enrollment` y crear `features/redemption` (o integrarlo en admin).

```
src/features/enrollment/
├── services/
│   └── enrollmentService.ts  <-- Modificar para generar token
```

```
src/features/admin/
├── components/
│   └── TokenRedeemer.tsx     <-- Nuevo componente
```

### Modelo de Datos

```sql
ALTER TABLE enrollments 
ADD COLUMN redemption_token TEXT UNIQUE,
ADD COLUMN token_redeemed_at TIMESTAMPTZ,
ADD COLUMN token_status TEXT DEFAULT 'pending'; -- pending, redeemed

-- Index para búsqueda rápida
CREATE INDEX idx_enrollments_token ON enrollments(redemption_token);
```

---

## Blueprint (Assembly Line)

### Fase 1: Database & Backend Logic
**Objetivo**: BD lista para tokens y API capaz de generarlos y validarlos.
**Validación**:
- [ ] Migración aplicada correctamente.
- [ ] Verificar que nuevos inserts en `enrollments` tengan token.
- [ ] Server Action/Endpoint para `redeemToken(token)` funcionando.

### Fase 2: Admin UI (Redemption)
**Objetivo**: Interfaz para buscar y canjear tokens en el dashboard.
**Validación**:
- [ ] Nueva página/sección en Admin visible.
- [ ] Input funciona y busca en BD.
- [ ] Muestra datos correctos tras búsqueda.
- [ ] Botón canjear actualiza la UI y la BD.

### Fase 3: User UI (Feedback)
**Objetivo**: Mostrar el token al usuario tras registro exitoso.
**Validación**:
- [ ] Enrollment Form muestra token al finalizar.
- [ ] Chatbot muestra token al finalizar flujo.

### Fase 4: Validación Final
**Objetivo**: Flujo E2E completo.
**Validación**:
- [ ] Registro usuario real -> Copiar token -> Canjear en Admin -> Verificar estado 'redeemed'.

---

## 🧠 Aprendizajes (Self-Annealing)

> (Espacio reservado para futuros aprendizajes)
