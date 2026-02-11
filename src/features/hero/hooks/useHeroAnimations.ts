import { useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { HeroAnimationConfig } from '../types/hero';

export const heroAnimations = {
  // Main content animation
  fadeInUp: (delay: number = 0) => ({
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay }
  }),

  // Title animation
  titleAnimation: (delay: number = 0.2) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay }
  }),

  // Subtitle animation
  subtitleAnimation: (delay: number = 0.4) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay }
  }),

  // CTA button animation
  ctaAnimation: (delay: number = 0.6) => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, delay }
  }),

  // Carousel row animations
  carouselLeft: (duration: number = 30) => ({
    animate: { x: [0, -2000] },
    transition: {
      duration,
      repeat: Infinity,
      ease: "linear" as const
    }
  }),

  carouselRight: (duration: number = 25) => ({
    animate: { x: [-2000, 0] },
    transition: {
      duration,
      repeat: Infinity,
      ease: "linear" as const
    }
  }),

  // Pulse animations
  pulseGlow: (duration: number = 2) => ({
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration, repeat: Infinity }
  }),

  pulseButtonGlow: (duration: number = 2) => ({
    animate: { opacity: [0.3, 0.8, 0.3] },
    transition: { duration, repeat: Infinity }
  }),

  // Hover animations for CTA button
  buttonHover: {
    whileHover: {
      scale: 1.05,
      boxShadow: "0 20px 60px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.4)"
    },
    whileTap: { scale: 0.95 }
  }
};

export const useHeroAnimations = (config?: Partial<HeroAnimationConfig>) => {
  const controls = useAnimation();

  useEffect(() => {
    // Start animations when component mounts
    controls.start('animate');
  }, [controls]);

  return {
    controls,
    animations: heroAnimations,
    config: {
      duration: 1,
      ...config
    }
  };
};

// Custom hook for carousel animation
export const useCarouselAnimation = (direction: 'left' | 'right', duration: number) => {
  const animationProps = direction === 'left'
    ? heroAnimations.carouselLeft(duration)
    : heroAnimations.carouselRight(duration);

  return animationProps;
};

// Custom hook for staggered animations
export const useStaggeredAnimation = (itemCount: number, baseDelay: number = 0.1) => {
  return Array.from({ length: itemCount }, (_, index) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.6,
      delay: baseDelay * index,
      ease: "easeOut"
    }
  }));
};