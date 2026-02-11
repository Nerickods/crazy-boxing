export interface HeroCarouselImage {
  src: string;
  fallback: string;
  alt: string;
  category: 'training' | 'facilities' | 'discipline' | 'team' | 'conditioning';
}

export interface HeroContent {
  title: {
    main: string;
    highlight: string;
  };
  subtitle: string;
  cta: {
    text: string;
    action: () => void;
  };
}

export interface HeroAnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
  repeat?: number;
}

export interface HeroCarouselRow {
  images: HeroCarouselImage[];
  animation: {
    direction: 'left' | 'right';
    duration: number;
  };
}

export type HeroAnimationType = 'fadeInUp' | 'scaleIn' | 'pulse' | 'slide';

export enum HeroCategory {
  TRAINING = 'training',
  FACILITIES = 'facilities',
  DISCIPLINE = 'discipline',
  TEAM = 'team',
  CONDITIONING = 'conditioning'
}

export interface HeroSectionProps {
  onCtaClick?: () => void;
  animationConfig?: Partial<HeroAnimationConfig>;
}