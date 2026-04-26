# PRP: Branding & Content Adaptation for Crazy Boxing Chatbot

This document outlines the changes required to unify the chatbot's visual identity and content with the **Crazy Boxing** brand, removing all remaining references to "KIA Intelligence".

## User Review Required

> [!IMPORTANT]
> The chatbot's personality and knowledge are primarily driven by a **System Prompt** stored in the database. While we are updating the UI strings, the actual logic of the coach's responses needs to be updated in the Supabase `agents` table.

## Proposed Changes

### Frontend: UI Branding & FAQ Update

#### [MODIFY] [ChatDrawer.tsx](file:///wsl.localhost/Ubuntu/home/nerick_ods/crazy/src/features/chat/components/ChatDrawer.tsx)
- Replace logo source: `/logo-removebg-preview.png` → `/assets/logo.png`.
- Update Header text: "KIA Assistant" → "CRAZY Coach AI".
- Update Initial Message:
    - Current: "¿Qué tal, caballero? ¿Está interesado en algún servicio de KIA Intelligence..."
    - New: "¡Qué tal, guerrero! Soy el Coach AI de Crazy Boxing. ¿Listo para llevar tu entrenamiento al siguiente nivel o tienes dudas sobre nuestras clases de MMA y Box?"
- Update Suggested Questions (FAQs):
    - "Dime los horarios de las clases de Box."
    - "¿Qué equipo necesito para mi primera clase?"
    - "¿Cómo funciona el pase de visita gratis?"
- Update Footer text: "KIA Intelligence · Canal de Estrategia Operativa" → "CRAZY BOXING · Centro de Entrenamiento de Alto Rendimiento".
- Update Message Labels: "KIA" → "CRAZY".

#### [MODIFY] [useChatStream.ts](file:///wsl.localhost/Ubuntu/home/nerick_ods/crazy/src/features/chat/hooks/useChatStream.ts)
- Update session ID: `kia-intelligence-chat-session` → `crazy-boxing-chat-session`.

### Backend: Database Configuration

#### [UPDATE] Supabase `agents` table
- The active agent's `system_prompt` must be updated to reflect the Crazy Boxing persona. 
- **Proposed Prompt Snippet**:
  > "Eres el Coach AI de Crazy Boxing. Tu tono es motivador, directo y profesional. Eres experto en MMA, Box y acondicionamiento físico. Ayudas a los usuarios a entender los beneficios de entrenar con nosotros, explicas los horarios y puedes registrar visitas gratis usando las herramientas proporcionadas."

---

## Verification Plan

### Automated Tests
- `npm run typecheck` to ensure no breaking changes in imports or types.

### Manual Verification
- Open the chatbot in the browser.
- Verify the logo is `/assets/logo.png`.
- Verify the header says "CRAZY Coach AI".
- Confirm the new suggested questions appear correctly.
- Send a message and verify the "CRAZY processing..." loading state.
- Ensure the footer branding is correct.
