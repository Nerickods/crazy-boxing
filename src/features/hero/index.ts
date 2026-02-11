// Components
export { default as HeroSection } from './components/HeroSection';

// Types
export type {
  HeroCarouselImage,
  HeroContent,
  HeroAnimationConfig,
  HeroCarouselRow,
  HeroSectionProps
} from './types/hero';

export type { HeroCategory, HeroAnimationType } from './types/hero';

// Hooks
export {
  useHeroAnimations,
  useCarouselAnimation,
  useStaggeredAnimation,
  heroAnimations
} from './hooks/useHeroAnimations';

// Services
export {
  heroCarouselImages,
  heroCarouselRows,
  heroContent,
  disciplinesBannerText,
  handleImageError,
  getImagesByCategory,
  getRandomFallback
} from './services/heroData';