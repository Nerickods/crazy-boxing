# Hero Feature

## Overview

The Hero feature provides a complete, animated hero section with carousel background and call-to-action functionality for the MMA gym website. This feature follows the Feature-First architecture pattern, containing all related components, hooks, services, and types in a self-contained module.

## Architecture

```
src/features/hero/
├── components/
│   ├── HeroSection.tsx      # Main hero component
│   └── HeroExample.tsx      # Usage example
├── hooks/
│   └── useHeroAnimations.ts # Framer Motion animation hooks
├── services/
│   └── heroData.ts          # Static content and data management
├── types/
│   └── hero.ts              # TypeScript interfaces and enums
├── index.ts                 # Barrel exports
└── README.md               # Documentation
```

## Features

- **Animated Image Carousel**: Two rows of images moving in opposite directions
- **Dynamic Content**: Text content with animated highlights and CTAs
- **Fallback Handling**: Automatic fallback images if primary images fail to load
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Scrolling**: Built-in scroll-to-form functionality
- **Custom Animations**: Framer Motion animations with configurable timing
- **Accessibility**: Proper alt texts and semantic HTML

## Quick Start

### Basic Usage

```tsx
import { HeroSection } from '@/features/hero';

export default function HomePage() {
  return (
    <div className="min-h-screen font-['Poppins'] bg-[var(--background)] text-[var(--foreground)]">
      <HeroSection />
      {/* Other page content */}
    </div>
  );
}
```

### Advanced Usage with Custom Props

```tsx
import { HeroSection } from '@/features/hero';

export default function HomePage() {
  const handleCustomCta = () => {
    // Custom CTA logic
    console.log('CTA clicked');
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-['Poppins'] bg-[var(--background)] text-[var(--foreground)]">
      <HeroSection
        onCtaClick={handleCustomCta}
        animationConfig={{
          duration: 1.2,
          delay: 0.1
        }}
      />
    </div>
  );
}
```

## Props

### HeroSectionProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onCtaClick` | `() => void` | `scrollToForm` | Custom click handler for CTA button |
| `animationConfig` | `Partial<HeroAnimationConfig>` | `{ duration: 1 }` | Override animation timing settings |

## Data Management

### Static Content

All static content is managed in `services/heroData.ts`:

- **Images**: Carousel images with fallback URLs
- **Text**: Hero title, subtitle, and CTA text
- **Categories**: Image categorization for filtering
- **Banner**: Scrolling disciplines banner text

### Fallback Images

Each image includes a fallback URL from Unsplash that automatically loads if the primary image fails:

```typescript
{
  src: '/images/gym-group-training.jpeg',
  fallback: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80',
  alt: 'Entrenamiento grupal octágono Crazy Boxing',
  category: HeroCategory.TRAINING
}
```

## Animation System

### Built-in Animations

The feature includes several pre-configured animations:

- **Carousel**: Continuous horizontal scrolling
- **Fade In**: Content appears with vertical movement
- **Pulse**: Glowing effects on interactive elements
- **Hover**: Interactive button effects

### Custom Animation Hooks

```tsx
import { useHeroAnimations, useCarouselAnimation } from '@/features/hero';

const { animations } = useHeroAnimations();
const carouselProps = useCarouselAnimation('left', 30);
```

## Styling

### CSS Variables

The component uses CSS custom properties defined in `globals.css`:

- `--background`: Black background (`#000000`)
- `--foreground`: White text (`#ffffff`)
- `--accent`: Gold accent color (`#FFD700`)

### Responsive Breakpoints

- Mobile: `text-4xl` (24px)
- Tablet: `md:text-6xl` (36px)
- Desktop: `lg:text-8xl` (48px)

## Performance Optimizations

- **Image Optimization**: Proper sizing and format
- **Animation Performance**: Hardware-accelerated transforms
- **Bundle Optimization**: Tree-shaking enabled
- **Type Safety**: Full TypeScript coverage

## Accessibility

- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- High contrast text
- Descriptive alt texts

## Customization

### Adding New Images

```typescript
const newImage: HeroCarouselImage = {
  src: '/images/new-training.jpg',
  fallback: 'https://images.unsplash.com/...',
  alt: 'Description of new image',
  category: HeroCategory.TRAINING
};
```

### Modifying Content

```typescript
export const heroContent: HeroContent = {
  title: {
    main: 'Custom main text',
    highlight: 'Custom highlight'
  },
  subtitle: 'Custom subtitle text',
  cta: {
    text: 'Custom CTA text',
    action: () => customAction()
  }
};
```

## Integration

### Import Patterns

```tsx
// Individual imports
import HeroSection from '@/features/hero/components/HeroSection';
import { useHeroAnimations } from '@/features/hero/hooks/useHeroAnimations';

// Barrel import (recommended)
import { HeroSection, useHeroAnimations, HeroCategory } from '@/features/hero';
```

### with Next.js App Router

The component is fully compatible with Next.js 16 App Router and includes:

- `'use client'` directive for client-side interactivity
- Optimized bundle splitting
- Static generation support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- `framer-motion`: Animation library
- `react`: Component framework
- `next.js`: Application framework

## Contributing

When modifying this feature:

1. Update types in `types/hero.ts`
2. Add new animations to `hooks/useHeroAnimations.ts`
3. Update static content in `services/heroData.ts`
4. Test responsive behavior
5. Verify accessibility compliance
6. Update documentation

## License

This feature is part of the Crazy Boxing MMA website project.