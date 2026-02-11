/**
 * Centralized Animation System
 * Feature-First Architecture - Consistent animations across components
 */

import { Variants, Transition } from 'framer-motion';

// ========================================
// PRESET ANIMATIONS
// ========================================

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 30 }
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 }
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

export const slideInUp: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 }
};

// ========================================
// STAGGERED ANIMATIONS
// ========================================

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export const staggerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const staggerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

// ========================================
// HERO SECTION ANIMATIONS
// ========================================

export const heroTitle: Variants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, type: 'spring', damping: 15 }
  }
};

export const heroSubtitle: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.3 }
  }
};

export const heroCta: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: 0.5 }
  }
};

// ========================================
// CARD ANIMATIONS
// ========================================

export const cardHover = {
  whileHover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, type: 'spring', damping: 15 }
  },
  whileTap: { scale: 0.98 }
};

export const cardEntrance: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, type: 'spring', damping: 20 }
  }
};

// ========================================
// MODAL ANIMATIONS
// ========================================

export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.8, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 400 }
  },
  exit: { opacity: 0, scale: 0.8, y: 20 }
};

// ========================================
// NAVIGATION ANIMATIONS
// ========================================

export const navItem: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.95 }
};

export const mobileMenu: Variants = {
  initial: { opacity: 0, x: '100%' },
  animate: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', damping: 25, stiffness: 200 }
  },
  exit: { opacity: 0, x: '100%' }
};

// ========================================
// BUTTON ANIMATIONS
// ========================================

export const buttonHover = {
  whileHover: {
    scale: 1.05,
    // Blue/Cyan Glow
    boxShadow: '0 20px 60px rgba(0, 123, 255, 0.6), 0 0 80px rgba(0, 255, 255, 0.4)',
    transition: { duration: 0.3 }
  },
  whileTap: { scale: 0.95 }
};

export const goldenPulse: Variants = {
  initial: { scale: 1, opacity: 0.8 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

// ========================================
// TEXT ANIMATIONS
// ========================================

export const typewriter = {
  initial: { width: 0 },
  animate: {
    width: 'auto',
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const glitchText: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0.8, 1, 0.9, 1],
    transition: { duration: 0.3, times: [0, 0.2, 0.4, 0.6, 1] }
  }
};

// ========================================
// LOADING ANIMATIONS
// ========================================

export const loadingSpinner: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: 'linear' }
  }
};

export const shimmer: Variants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
  }
};

// ========================================
// PRESET TRANSITIONS
// ========================================

export const smoothTransition: Transition = {
  duration: 0.6,
  ease: 'easeInOut'
};

export const springTransition: Transition = {
  type: 'spring',
  damping: 20,
  stiffness: 300
};

export const fastTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut'
};

// ========================================
// RESPONSIVE ANIMATION HELPERS
// ========================================

export const responsiveAnimation = {
  mobile: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  },
  desktop: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

export const createStaggerDelay = (index: number, baseDelay: number = 0.1) => ({
  transition: { delay: index * baseDelay }
});

export const createEntranceAnimation = (
  direction: 'up' | 'down' | 'left' | 'right' | 'scale' = 'up',
  distance: number = 30
): Variants => {
  const transforms = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    scale: { scale: 0.8 }
  };

  return {
    initial: { opacity: 0, ...transforms[direction] },
    animate: { opacity: 1, y: 0, x: 0, scale: 1 },
    exit: { opacity: 0, ...transforms[direction] }
  };
};

// ========================================
// THEME SPECIFIC ANIMATIONS
// ========================================

export const goldGlow: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: [0.3, 0.8, 0.3],
    scale: [1, 1.1, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

export const goldShimmer: Variants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  }
};

// ========================================
// PAGE TRANSITIONS
// ========================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const layoutTransition = {
  type: 'spring',
  damping: 20,
  stiffness: 100
};