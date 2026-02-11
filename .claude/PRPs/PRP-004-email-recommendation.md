# PRP-004: Sistema de Recomendación de Emails para Inscripciones

## Goal
Crear un sistema que genere emails personalizados para contactar leads desde el panel de administración de inscripciones. El owner podrá ver, editar, copiar y usar estos emails según el origen del lead (formulario web o asistente IA).

## Why
- **Valor de Negocio**: Ahorra tiempo al owner al tener copy optimizado listo para copiar
- **Experiencia del Usuario**: Emails personalizados mejoran conversión de leads a clientes
- **Tracking**: Registrar quién contactó y cuándo para seguimiento adecuado
- **Cumplimiento**: Incluir links legales (términos, privacidad, reglamento) en cada email

## What

### Comportamiento del Usuario
1. El owner abre `/admin/enrollments`
2. En cada fila de inscripción, ve un nuevo botón "📧 Ver Recomendación"
3. Al hacer clic, se abre un modal/drawer con:
   - Email personalizado basado en el origen (IA vs Web)
   - Área editable para modificar el texto
   - Botón "Copiar Todo" para copiar al portapapeles
   - Campo para ingresar nombre de quien contacta
   - Botón "Marcar Contactado" (habilitado solo si hay nombre)

### Success Criteria
- [ ] Botón "Ver Recomendación" visible en cada fila
- [ ] Modal muestra email diferenciado por source (chat_agent vs landing_form)
- [ ] Links legales incluidos al final
- [ ] Copy editable en textarea
- [ ] Botón copiar funciona correctamente
- [ ] Campo contacted_by requerido para marcar como contactado
- [ ] Estado actualizado en DB y UI

---

## All Needed Context

### Documentation & References
```yaml
- file: src/features/enrollment/components/admin/EnrollmentsTab.tsx
  why: Componente actual donde se agregará el botón y modal

- file: src/features/enrollment/services/enrollmentServerService.ts
  why: Agregar función markAsContacted()

- file: src/app/(auth)/admin/enrollments/page.tsx
  why: Entry point del panel de inscripciones
```

### Current Codebase Tree (Relevant)
```bash
src/features/enrollment/
├── components/
│   └── admin/
│       └── EnrollmentsTab.tsx    # UI principal de inscripciones
├── services/
│   └── enrollmentServerService.ts  # Backend operations
└── types/                          # (si existe)
```

### Desired Codebase Tree
```bash
src/features/enrollment/
├── components/
│   └── admin/
│       ├── EnrollmentsTab.tsx       # [MODIFY] Agregar botón + estado modal
│       └── EmailRecommendationModal.tsx  # [NEW] Modal con copy editable
├── services/
│   └── enrollmentServerService.ts  # [MODIFY] markAsContacted()
└── utils/
    └── emailTemplates.ts           # [NEW] Templates de email por source

src/app/api/enrollments/
└── [id]/
    └── mark-contacted/
        └── route.ts                # [NEW] API endpoint
```

### Known Gotchas
```typescript
// CRITICAL: El campo source puede tener variantes
// - 'chat_agent' (asistente IA)
// - 'landing_form', 'landing_hero_form', 'verification_script' (web)

// CRITICAL: Usar 'use client' para el modal (client component)

// CRITICAL: Links legales deben ser absolutos para funcionar en email
```

---

## Implementation Blueprint

### Data Models

```typescript
// Tipos para el sistema de email

interface EmailTemplate {
  subject: string;
  body: string;
}

interface ContactedPayload {
  contacted_by: string;
}
```

### Templates de Email

**Para leads del Asistente IA (chat_agent):**
```
Asunto: ¡Hola {nombre}! Confirmación de tu cita en Blackbird House MMA

Hola {nombre},

¡Gracias por agendar tu visita con nuestro asistente! Confirmamos tu cita para el {fecha}.

Te esperamos en nuestras instalaciones. Recuerda traer ropa cómoda para tu primera experiencia.

Antes de tu visita, te recomendamos revisar:
- Términos de uso: {link_terminos}
- Política de privacidad: {link_privacidad}  
- Reglamento del gimnasio: {link_reglamento}

¡Nos vemos pronto!
Equipo Blackbird House MMA
```

**Para leads del Formulario Web:**
```
Asunto: ¡Bienvenido a Blackbird House MMA, {nombre}!

Hola {nombre},

Hemos recibido tu solicitud de visita para el {fecha}. ¡Excelente decisión!

Un miembro de nuestro equipo se comunicará contigo pronto para confirmar los detalles.

Mientras tanto, te invitamos a conocer más sobre nosotros:
- Términos de uso: {link_terminos}
- Política de privacidad: {link_privacidad}
- Reglamento del gimnasio: {link_reglamento}

¡Preparate para comenzar tu transformación!
Equipo Blackbird House MMA
```

### Tasks

```yaml
Task 1: Crear utilidad de templates de email
  CREATE src/features/enrollment/utils/emailTemplates.ts:
    - Función generateEmailForEnrollment(enrollment, baseUrl)
    - Diferencia por source
    - Incluye links legales dinámicos

Task 2: Crear modal de recomendación de email
  CREATE src/features/enrollment/components/admin/EmailRecommendationModal.tsx:
    - Props: isOpen, onClose, enrollment, onContactedSuccess
    - Textarea editable con el copy
    - Botón copiar con feedback visual
    - Input para contacted_by
    - Botón "Marcar Contactado" deshabilitado hasta llenar nombre

Task 3: Actualizar EnrollmentsTab con botón + modal
  MODIFY src/features/enrollment/components/admin/EnrollmentsTab.tsx:
    - Agregar useState para modal y enrollment seleccionado
    - Agregar botón "📧 Ver Recomendación" en columna Acciones
    - Importar y renderizar EmailRecommendationModal
    - Handler para actualizar lista después de marcar contactado

Task 4: Agregar función markAsContacted al servicio
  MODIFY src/features/enrollment/services/enrollmentServerService.ts:
    - Agregar markAsContacted(id, contacted_by)
    - UPDATE status='contacted', contacted_by, contacted_at=now()

Task 5: Crear API endpoint para marcar contactado
  CREATE src/app/api/enrollments/[id]/mark-contacted/route.ts:
    - POST handler
    - Validar input con Zod
    - Llamar enrollmentService.markAsContacted()
    - Retornar enrollment actualizado
```

### Integration Points
```yaml
DATABASE:
  - Columnas existentes: contacted_by (text), contacted_at (timestamp)
  - Status cambia de 'new' a 'contacted'

UI:
  - Nuevo botón en tabla de EnrollmentsTab
  - Modal overlay con glassmorphism (design system actual)

API:
  - POST /api/enrollments/[id]/mark-contacted
  - Body: { contacted_by: string }
```

---

## Verification Plan

### Automated Tests
No hay tests automatizados existentes para este módulo. Se propone verificación manual.

### Manual Verification

**Paso 1: Ejecutar servidor de desarrollo**
```bash
cd /home/nerick_ods/mma1
npm run dev
```

**Paso 2: Navegar al panel de inscripciones**
- Abrir http://localhost:3000/admin/enrollments
- Verificar que existan inscripciones en la tabla

**Paso 3: Probar flujo de email para lead de IA**
1. Filtrar por "IA" en los controles
2. Click en "📧 Ver Recomendación" en cualquier fila
3. Verificar que el modal se abre
4. Confirmar que el copy menciona "nuestro asistente"
5. Confirmar links legales al final

**Paso 4: Probar flujo de email para lead Web**
1. Filtrar por "Web"
2. Click en "📧 Ver Recomendación"
3. Verificar copy diferente (menciona "solicitud de visita")

**Paso 5: Probar edición y copia**
1. Modificar el texto en el textarea
2. Click en "Copiar Todo"
3. Pegar en notepad y verificar contenido

**Paso 6: Probar marcar como contactado**
1. Intentar click en "Marcar Contactado" (debe estar deshabilitado)
2. Escribir un nombre en el campo "Contactado por"
3. Verificar que el botón se habilita
4. Click en "Marcar Contactado"
5. Verificar que el modal se cierra
6. Verificar que la fila ahora muestra estado "Contactado" en azul
7. Verificar en Supabase que contacted_by y contacted_at tienen valores

---

## Final Validation Checklist
- [ ] Botón visible en todas las filas de inscripciones
- [ ] Modal abre correctamente
- [ ] Template diferenciado por source
- [ ] Links legales presentes y correctos
- [ ] Textarea editable
- [ ] Copiar funciona
- [ ] Campo contacted_by requerido
- [ ] Estado actualizado en UI y DB
- [ ] No errores en consola

---

## Anti-Patterns to Avoid
- ❌ No hardcodear URLs de legal (usar base URL dinámico)
- ❌ No permitir marcar contactado sin nombre
- ❌ No usar `any` en TypeScript
- ❌ No olvidar 'use client' en componentes interactivos
