// Tipos para las nuevas secciones críticas de conversión

export interface ScheduleItem {
  id: string;
  discipline: string;
  day: string;
  time: string;
  duration: string;
  level: 'Principiantes' | 'Intermedio' | 'Avanzado' | 'Todos los niveles';
  instructor: string;
  instructorImage: string;
  classImage: string;
  availableSpots: number;
  maxSpots: number;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface TestimonialResult {
  id: string;
  name: string;
  age: number;
  beforeImage: string;
  afterImage: string;
  timeFrame: string;
  discipline: string;
  quote: string;
  metrics: {
    weightLoss?: number;
    strengthGain?: string;
    confidenceLevel?: number;
  };
  currentStatus: string;
}

export interface FacilitySpot {
  id: string;
  image: string;
  title: string;
  description: string;
  features: string[];
  hotspotCoords?: { x: number; y: number };
  areaSize?: string;
  equipment?: string[];
  capacity?: string;
}

export interface InstructorProfile {
  id: string;
  name: string;
  specialties: string[];
  achievements: string[];
  experience: string;
  certification: string[];
  fightingRecord?: {
    wins: number;
    losses: number;
    titles: string[];
  };
  teachingStyle: string;
  personalPhilosophy: string;
  classTypes: string[];
}

export interface CTASection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    text: string;
    action: () => void;
    variant: 'primary' | 'secondary';
  };
  secondaryCTA?: {
    text: string;
    action: () => void;
    variant: 'primary' | 'secondary';
  };
  urgencyIndicator?: {
    text: string;
    type: 'warning' | 'info' | 'success';
  };
}

// Días de la semana para consistencia
export const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
] as const;

// Disciplinas disponibles
export const DISCIPLINES = [
  'MMA',
  'BJJ',
  'Muay Thai',
  'Boxeo',
  'Acondicionamiento'
] as const;

// Niveles de clase
export const CLASS_LEVELS = [
  'Principiantes',
  'Intermedio',
  'Avanzado',
  'Todos los niveles'
] as const;