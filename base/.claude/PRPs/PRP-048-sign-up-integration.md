# PRP-048: Sign Up Component Integration

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-05
> **Proyecto**: SaaS Factory V3 (landing-linkedin)

---

## Objetivo

Integrar el nuevo componente interactivo `AuthComponent` ("sign-up") dentro de la arquitectura actual utilizando shadcn, Tailwind CSS y TypeScript, conectándolo directamente con **Supabase Auth** para realizar el registro real de usuarios.

## Por Qué

| Problema | Solución |
|----------|----------|
| El proceso de registro estándar puede ser monótono y tener fricción, afectando la conversión. | Implementar un formulario interactivo paso a paso con animaciones suaves y recompensas visuales. |
| El componente actual es solo visual (demo). | Integrar `supabase.auth.signUp` para persistir usuarios en la base de datos de KIA Intelligence. |

**Valor de negocio**: Aumentar la conversión de registros mediante una UX premium y asegurar la integridad de datos persistiendo en Supabase con RLS habilitado.

---

## Contexto

### Supabase Integration
- **Client**: Se utilizará `createClient()` de `@/lib/supabase/client`.
- **Variables**: Ya configuradas en `.env.local`.
- **Auth Flow**: `supabase.auth.signUp({ email, password })`.

### Arquitectura Propuesta (Feature-First)
```
src/
├── components/
│   └── ui/
│       └── sign-up.tsx          # UI del componente
├── features/
│   └── auth/
│       └── services/
│           └── auth-service.ts  # Lógica de Supabase (opcional o dentro del componente)
├── app/
│   └── (auth)/
│       └── sign-up/
│           └── page.tsx         # Ruta de registro
```

---

## Blueprint (Assembly Line)

### Fase 1: Setup y Dependencias
**Objetivo**: Instalar `canvas-confetti` y `class-variance-authority`.
**Validación**: Dependencias en `package.json`.

### Fase 2: Implementación de UI
**Objetivo**: Crear `src/components/ui/sign-up.tsx` con el código visual.
**Validación**: Renderizado estático funcional.

### Fase 3: Integración con Supabase Auth
**Objetivo**: Conectar el `handleFinalSubmit` con `supabase.auth.signUp`.
**Validación**: Intento de registro genera un usuario en la tabla `auth.users` de Supabase (verificable via `mcp_supabase`).

### Fase 4: Validación End-to-End
**Objetivo**: Confirmar flujo registro -> confetti -> error/success.
**Validación**: Registro exitoso dispara confetti; error (ej: email duplicado) muestra modal de error.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

### [YYYY-MM-DD]: [Título del aprendizaje]
- **Error**: 
- **Fix**: 
- **Aplicar en**: 

---

## Gotchas

- [ ] `canvas-confetti` puede tener problemas de resolución sin dynamic imports si Next.js intenta re-hidratarlo prematuramente.
- [ ] Al reemplazar inputs de contraseñas, los managers (1Password, Chrome Autofill) pueden inyectar estilos o bypassar pasos de `framer-motion`. Proteger con CSS específico o atributos neutros.

## Anti-Patrones

- NO omitir agregar las clases necesarias a `tailwind.config.ts` o variables de shadcn si el `glassmorphism` lo requiere (como variables personalizadas `--color-primary`, etc., que ya deben estar en globals.css).
- NO utilizar imágenes externas que ralenticen el FCP. Priorizar renderizado local de SVGs.

---

*PRP pendiente aprobación. No se ha modificado código.*
