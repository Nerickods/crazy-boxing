import { HeroCarouselImage, HeroCarouselRow, HeroContent, HeroCategory } from '../types/hero';

export const heroCarouselImages: HeroCarouselImage[] = [
  // Fila Superior (Left) - Unused Assets Focus
  {
    src: '/images/muay_thai_knee_strike_bw.png',
    fallback: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    alt: 'Golpe de rodilla Muay Thai',
    category: HeroCategory.DISCIPLINE
  },
  {
    src: '/images/heavy_bag_swinging_bw.png',
    fallback: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed',
    alt: 'Saco de boxeo en movimiento',
    category: HeroCategory.TRAINING
  },
  {
    src: '/images/fighter_taping_wrist_v2_bw.png',
    fallback: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff',
    alt: 'Luchador vendándose',
    category: HeroCategory.TRAINING
  },
  {
    src: '/images/trainer_holding_pads_bw.png',
    fallback: 'https://images.unsplash.com/photo-1594736797933-d0dcc4ba7423',
    alt: 'Entrenador con pads',
    category: HeroCategory.TRAINING
  },

  // Fila Inferior (Right) - Unused Assets Focus
  {
    src: '/images/empty_octagon_bw.png',
    fallback: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff',
    alt: 'Octágono vacío',
    category: HeroCategory.FACILITIES
  },
  {
    src: '/images/fighters_running_bw.png',
    fallback: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    alt: 'Luchadores corriendo',
    category: HeroCategory.CONDITIONING
  },
  // Reusing high impact ones for filler if needed, but prioritizing the new flow
  {
    src: '/images/mma_fighter_wrapping_hands_bw.png',
    fallback: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    alt: 'Luchador preparándose',
    category: HeroCategory.TRAINING
  },
  {
    src: '/images/fighter_shadow_boxing_bw.png',
    fallback: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    alt: 'Sombra de boxeo',
    category: HeroCategory.TRAINING
  }
];

export const heroCarouselRows: HeroCarouselRow[] = [
  {
    images: heroCarouselImages.slice(0, 4), // First 4 for top row
    animation: {
      direction: 'left',
      duration: 50 // Slower, regal
    }
  },
  {
    images: heroCarouselImages.slice(4), // Remaining 4 for bottom row
    animation: {
      direction: 'right',
      duration: 60 // Different pace for depth
    }
  }
];

export const heroContent: HeroContent = {
  title: {
    main: 'No dejes que el miedo',
    highlight: 'DECIDA POR TI'
  },
  subtitle: 'En un mundo impredecible, saber defenderte no es un lujo, es una necesidad vital. Recupera tu seguridad y confianza en Crazy Boxing.',
  cta: {
    text: 'SÍ, QUIERO SENTIRME SEGURO/A',
    action: () => {
      document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

export const disciplinesBannerText = [
  'BOXEO',
  'MUAY THAI',
  'JIU JITSU',
  'GRAPPLING',
  'KICKBOXING',
  'ARTES MARCIALES MIXTAS'
];

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, fallback: string) => {
  const target = event.currentTarget;
  if (target.src !== fallback) {
    target.src = fallback;
  }
};

export const getImagesByCategory = (category: HeroCategory): HeroCarouselImage[] => {
  return heroCarouselImages.filter(image => image.category === category);
};

export const getRandomFallback = (category: HeroCategory): string => {
  const fallbacks = {
    [HeroCategory.TRAINING]: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    [HeroCategory.DISCIPLINE]: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    [HeroCategory.FACILITIES]: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed',
    [HeroCategory.TEAM]: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f',
    [HeroCategory.CONDITIONING]: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115'
  };

  return fallbacks[category] || fallbacks[HeroCategory.TRAINING];
};