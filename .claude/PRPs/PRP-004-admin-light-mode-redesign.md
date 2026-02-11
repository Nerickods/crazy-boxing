name: "PRP-004-admin-light-mode-redesign"
description: |

## Purpose
Redesign the Admin Panel specifically for Light Mode to address poor legibility and lack of aesthetic appeal. The goal is to implement a "Vibrant Color Life" design with a focus on "Orange within Orange", "Liquid Glass" effects, and a premium "super wow" experience, while ensuring perfect text legibility.

## Core Principles
1.  **Vibrant Aesthetics**: Use deep, rich oranges, gradients, and subtle glows to create depth and energy. Avoid flat, washed-out colors.
2.  **Legibility First**: Text must be readable against the vibrant background. Use high-contrast text colors and appropriate font weights.
3.  **Liquid Glass**: Implement glassmorphism with dynamic reflections and blurs to give a premium feel.
4.  **Agentic Loop**: Follow the methodology of defining phases, mapping context, and then executing.

---

## Goal
Transform the Admin Panel's Light Mode into a visually stunning, vibrant, and highly legible experience that aligns with the "Blackbird House" brand energy (Orange/Red/Black).

## Why
-   **User Experience**: The current light mode is "broken" and hard to read, causing friction for admin users.
-   **Brand Consistency**: The admin panel should reflect the premium, energetic brand identity of the academy.
-   **Aesthetics**: A "wow" factor increases user satisfaction and engagement.

## What
Refactor the UI styling of all Admin Panel sections (`/admin/*`) to correctly support Light Mode with a new vibrant design system.

### Success Criteria
-   [ ] **Legibility**: Text is clearly readable in all sections in Light Mode.
-   [ ] **Aesthetics**: The "Orange within Orange" / "Liquid Glass" effect is implemented and looks premium.
-   [ ] **Consistency**: All admin pages share the new design language.
-   [ ] **Responsiveness**: UI looks good on different screen sizes (though primary focus is desktop admin).

## All Needed Context

### Documentation & References
-   **User Feedback**: "Orange within orange", "super woooooww", "vibrant colors", "liquid glass".
-   **Images**: 5 screenshots provided showing current broken state (Settings, Analytics, Conversations Detail, Conversations List, Promotions).
-   **Current Tech**: Next.js 16, Tailwind CSS, Shadcn UI (conceptual).

### Architecture
-   **Files**: `src/app/admin/**/*.tsx`
-   **Global Styles**: `src/app/globals.css` (for global variables/themes)

## Implementation Blueprint

### Data models and structure
*No data model changes expected. Purely UI/CSS refactor.*

### Agentic Loop Fases

#### Fase 1: Analysis & Design System Setup
*Goal: Define the "Vibrant Orange" palette and global utility classes for the "Liquid Glass" effect.*
-   **Map Context**: Check `globals.css` and `tailwind.config.ts` for existing colors.
-   **Action**: Create/Update CSS variables or Tailwind utility classes for the new light mode theme.
    -   Deep Orange gradients for backgrounds.
    -   Glassmorphism utilities (`backdrop-blur`, `bg-white/xx`, borders).
    -   Text contrast controls.

#### Fase 2: Layout & Navigation Redesign (`layout.tsx`)
*Goal: Fix the main container and sidebar to accommodate the new vibrant background.*
-   **Map Context**: `src/app/admin/layout.tsx`.
-   **Action**:
    -   Apply the global background (Mesh Gradient / Aurora) to the admin layout.
    -   Update Sidebar to be legible and harmonious with the new background.

#### Fase 3: Dashboard Root Redesign (`page.tsx`)
*Goal: Update the main overview dashboard.*
-   **Map Context**: `src/app/admin/page.tsx`.
-   **Action**: Apply card styles, metric aesthetics, and ensuring charts/graphs match the theme.

#### Fase 4: Conversations Module Redesign (`conversations/page.tsx`)
*Goal: Fix the specific page user modified recently.*
-   **Map Context**: `src/app/admin/conversations/page.tsx`.
-   **Action**:
    -   Fix list view legibility.
    -   Enhance detail view (chat bubbles, backgrounds) for light mode.
    -   Ensure "Inbox Neural" empty state looks "wow".

#### Fase 5: Analytics Module Redesign (`analytics/page.tsx`)
*Goal: Make data visualization vibrant and clear.*
-   **Map Context**: `src/app/admin/analytics/page.tsx`.
-   **Action**:
    -   Style metric cards (Deep Dive).
    -   Ensure charts (Recharts/Chart.js) colors match the vibrant theme.

#### Fase 6: Settings Module Redesign (`settings/page.tsx`)
*Goal: Make forms and configuration panels clear.*
-   **Map Context**: `src/app/admin/settings/page.tsx`.
-   **Action**:
    -   Style form inputs, headers, and sections.
    -   "Agent Configuration" specific styling.

#### Fase 7: Promotions Module Redesign (`promotions/page.tsx`)
*Goal: Fix the promotions management UI.*
-   **Map Context**: `src/app/admin/promotions/page.tsx`.
-   **Action**:
    -   Style cards, toggles, and headers.

#### Fase 8: Verification & Polish
-   **Action**:
    -   Walkthrough all pages in Light Mode.
    -   Verify Dark Mode hasn't been broken (regression testing).

## Validation Loop

### Level 1: Visual Inspection (Agentic)
-   Use `playwright_screenshot` after each page refactor to compare with the "Before" images.
-   Analyze screenshot for contrast ratios (heuristically).

### Level 2: Dark Mode Regression
-   Switch to dark mode and verify consistent behavior.

## Final validation Checklist
-   [ ] All 5 key pages updated.
-   [ ] "Orange within Orange" aesthetic achieved.
-   [ ] Text is legible.
-   [ ] Dark mode preserved.
