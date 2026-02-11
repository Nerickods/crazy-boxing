/**
 * Visual Design System Constants
 * Feature-First Architecture - Centralized visual configuration
 */

// ========================================
// COLOR PALETTE
// ========================================

export const colors = {
  // Primary Colors
  primary: '#000000',
  secondary: '#FFFFFF',

  // Gold Accent Theme -> Rebranded to Blue/Cyan
  accent: {
    primary: '#007BFF',      // Brand Blue
    secondary: '#0056b3',    // Darker Blue
    light: '#00FFFF',        // Cyan
    metallic: '#4facfe',     // Light Blue Metallic
    gradient: 'linear-gradient(135deg, #007BFF 0%, #00FFFF 100%)'
  },

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Neutral Grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },

  // Background Colors
  background: {
    primary: '#020b14', // Deep Blue
    secondary: '#031e39', // Brand Blue
    tertiary: '#052a50'
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
    tertiary: '#9CA3AF',
    inverse: '#000000'
  }
} as const;

// ========================================
// TYPOGRAPHY
// ========================================

export const typography = {
  // Font Families
  fontFamily: {
    primary: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: '"Bebas Neue", cursive',
    mono: '"JetBrains Mono", "Fira Code", monospace'
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
    '9xl': '8rem'       // 128px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
} as const;

// ========================================
// SPACING SYSTEM
// ========================================

export const spacing = {
  0: '0px',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
  40: '10rem',     // 160px
  48: '12rem',     // 192px
  56: '14rem',     // 224px
  64: '16rem',     // 256px
  80: '20rem',     // 320px
  96: '24rem'      // 384px
} as const;

// ========================================
// BORDER RADIUS
// ========================================

export const borderRadius = {
  none: '0px',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  '4xl': '2rem',     // 32px
  full: '9999px'
} as const;

// ========================================
// SHADOWS
// ========================================

export const shadows = {
  none: 'none',

  // Regular shadows
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Gold themed shadows -> REMAPPED TO BLUE
  gold: {
    subtle: '0 2px 4px rgba(0, 123, 255, 0.1)',
    medium: '0 4px 6px rgba(0, 123, 255, 0.15)',
    strong: '0 10px 15px rgba(0, 123, 255, 0.2)',
    intense: '0 20px 40px rgba(0, 123, 255, 0.3)',
    glow: '0 0 20px rgba(0, 255, 255, 0.4)',
    outerGlow: '0 0 60px rgba(0, 123, 255, 0.3), 0 0 120px rgba(0, 255, 255, 0.1)',
    button: '0 10px 40px rgba(0, 123, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)'
  },

  // Inner shadows
  inner: {
    subtle: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    medium: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    strong: 'inset 0 4px 8px rgba(0, 0, 0, 0.15)'
  }
} as const;

// ========================================
// GRADIENTS
// ========================================

export const gradients = {
  // Gold gradients -> REMAPPED TO BLUE/CYAN
  gold: {
    primary: 'linear-gradient(135deg, #007BFF 0%, #00FFFF 100%)',
    secondary: 'linear-gradient(135deg, #00FFFF 0%, #007BFF 100%)',
    reverse: 'linear-gradient(135deg, #00FFFF 100%, #007BFF 0%)',
    radial: 'radial-gradient(circle, #007BFF 0%, #00FFFF 70%)',
    shimmer: 'linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.5) 50%, transparent 70%)',
    glow: 'radial-gradient(ellipse at center, rgba(0, 123, 255, 0.3) 0%, transparent 70%)'
  },

  // Dark gradients
  dark: {
    primary: 'linear-gradient(135deg, #020b14 0%, #031e39 50%, #052a50 100%)',
    subtle: 'linear-gradient(135deg, #031e39 0%, #052a50 100%)',
    overlay: 'linear-gradient(180deg, rgba(2,11,20,0.8) 0%, rgba(2,11,20,0.4) 50%, rgba(2,11,20,0.8) 100%)',
    card: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
  },

  // Accent gradients
  accent: {
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
  }
} as const;

// ========================================
// BACKDROPS AND BLURS
// ========================================

export const backdrop = {
  none: 'none',
  subtle: 'blur(2px)',
  base: 'blur(4px)',
  medium: 'blur(8px)',
  strong: 'blur(12px)',
  intense: 'blur(16px)',
  extreme: 'blur(24px)'
} as const;

// ========================================
// TRANSITIONS
// ========================================

export const transitions = {
  duration: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms'
  },

  ease: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
} as const;

// ========================================
// LAYOUT BREAKPOINTS
// ========================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// ========================================
// Z-INDEX LAYER SYSTEM
// ========================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  menu: 2000,
  focus: 9999
} as const;

// ========================================
// COMPONENT SPECIFIC CONSTANTS
// ========================================

export const components = {
  // Header
  header: {
    height: {
      mobile: '4rem',
      desktop: '5rem'
    },
    backdropBlur: backdrop.base,
    borderWidth: '1px'
  },

  // Buttons
  button: {
    height: {
      sm: '2.5rem',
      base: '3rem',
      lg: '3.5rem',
      xl: '4rem'
    },
    padding: {
      sm: '0.75rem 1.5rem',
      base: '1rem 2rem',
      lg: '1.25rem 2.5rem',
      xl: '1.5rem 3rem'
    },
    borderRadius: borderRadius.lg,
    fontSize: {
      sm: typography.fontSize.sm,
      base: typography.fontSize.base,
      lg: typography.fontSize.lg,
      xl: typography.fontSize.xl
    }
  },

  // Cards
  card: {
    borderRadius: borderRadius['2xl'],
    padding: spacing[6],
    shadow: shadows.lg,
    hoverShadow: shadows.xl,
    backdropBlur: backdrop.subtle
  },

  // Modals
  modal: {
    borderRadius: borderRadius['2xl'],
    padding: spacing[8],
    maxWidth: '32rem',
    zIndex: zIndex.modal
  },

  // Form inputs
  input: {
    height: '3rem',
    padding: '0.75rem 1rem',
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.base,
    borderWidth: '1px',
    focusRingWidth: '2px'
  }
} as const;

// ========================================
// GOLD THEME SPECIFIC MIXINS
// ========================================

export const goldTheme = {
  // Text styling
  textShadow: {
    subtle: '1px 1px 2px rgba(0,0,0,0.3)',
    medium: '2px 2px 4px rgba(0,0,0,0.4)',
    strong: '4px 4px 8px rgba(0,0,0,0.5)',
    gold: '0 0 20px rgba(0, 255, 255, 0.4)',
    outline: '1px 1px 0 rgba(0, 123, 255, 0.8), -1px -1px 0 rgba(0, 123, 255, 0.8)'
  },

  // Glow effects
  glow: {
    subtle: 'drop-shadow(0 0 10px rgba(0, 123, 255, 0.3))',
    medium: 'drop-shadow(0 0 20px rgba(0, 123, 255, 0.4))',
    strong: 'drop-shadow(0 0 30px rgba(0, 123, 255, 0.5))',
    intense: 'drop-shadow(0 0 40px rgba(0, 123, 255, 0.6))'
  },

  // Border effects
  border: {
    gold: `1px solid ${colors.accent.primary}`,
    goldGlow: `1px solid ${colors.accent.primary}, 0 0 20px rgba(0, 123, 255, 0.3)`,
    gradient: `1px solid transparent, background: ${gradients.gold.primary} border-box`,
    shimmer: `1px solid transparent, background-image: ${gradients.gold.shimmer}, background-origin: border-box, background-clip: border-box`
  }
} as const;

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  gradients,
  backdrop,
  transitions,
  breakpoints,
  zIndex,
  components,
  goldTheme
};