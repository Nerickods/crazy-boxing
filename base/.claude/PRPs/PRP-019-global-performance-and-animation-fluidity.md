# PRP-019: Global Performance and Animation Fluidity Optimization

This PRP addresses critical performance bottlenecks in the `/services` subpage, specifically focusing on animation lag in the CTA and sluggish tab switching experienced in production environments (Vercel).

## User Review Required

> [!IMPORTANT]
> This optimization involves reducing some visual fidelity (like blur radius and number of animating layers) to ensure a fluid 60FPS experience. The "Invisible Stack" philosophy remains, but with smarter resource management.

> [!WARNING]
> We will be modifying the global `GlassRefractionBackground`. While this benefits the whole app, we must verify it doesn't negatively impact other pages' "signature" look.

## Proposed Changes

The optimization strategy follows a "High-Impact, Low-Cost" approach to rendering:

### 1. [MODIFY] [GlassRefractionBackground](file:///home/nerick_ods/solutions/landing-linkedin/src/components/ui/glass-refraction-background.tsx)
- **Problem**: 5 large blobs with 150px blur animating infinitely. This saturates the GPU's composition buffer.
- **Solution**: 
    - Reduce blob count from 5 to 3 on desktop, 2 on mobile.
    - Lower blur radius from 150px to 100px.
    - Use `opacity` pulses instead of continuous `scale/translate` for secondary blobs.
    - Enforce `will-change: transform` on the parent container.

### 2. [MODIFY] [ModulesTabs](file:///home/nerick_ods/solutions/landing-linkedin/src/features/services/components/ModulesTabs.tsx)
- **Problem**: `mode="wait"` in `AnimatePresence` and `backdrop-blur` overhead.
- **Solution**:
    - Change `mode="wait"` to `mode="popLayout"` or removal.
    - Move `backdrop-blur` to a separate layer.
    - Memoize the center graphic.

### 3. [MODIFY] [ServicesCta](file:///home/nerick_ods/solutions/landing-linkedin/src/features/services/components/ServicesCta.tsx)
- **Problem**: Heavy sticky transforms and excessive blur.
- **Solution**:
    - Reduce spring stiffness.
    - Reduce `backdrop-blur-2xl`.
    - Range-limit calculations.

## Open Questions

- Performance vs. Fidelity priority for mobile?

## Verification Plan

- [ ] Build verification: `npm run build`
- [ ] Performance trace on Vercel Preview.
- [ ] Manual check on low-tier mobile.
