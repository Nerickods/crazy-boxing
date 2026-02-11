/**
 * Advanced TypeScript types for Trainers Feature
 * Feature-First Architecture - Complete type definitions
 */

// ========================================
// CORE TRAINER TYPES
// ========================================

export interface Trainer {
  id: string;
  name: string;
  nickname?: string;
  role: string;
  bio: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  experience: ExperienceLevel;
  disciplines: Discipline[];
  certifications: Certification[];
  achievements: Achievement[];
  socialMedia: SocialMedia;
  stats: TrainerStats;
  availability: Availability;
  pricing: Pricing;
  languages: Language[];
  featured: boolean;
}

export interface TrainerStats {
  studentsCount: number;
  championsTrained: number;
  yearsActive: number;
  winRate?: number;
  specialMoves?: string[];
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

// ========================================
// FILTERING AND SEARCH TYPES
// ========================================

export interface TrainerFilters {
  disciplines: Discipline[];
  experienceLevels: ExperienceLevel[];
  rating: number;
  priceRange: [number, number];
  languages: Language[];
  availability: AvailabilitySlot[];
  featuredOnly: boolean;
}

export interface SearchParams {
  query: string;
  filters: TrainerFilters;
  sortBy: SortOption;
  page: number;
  limit: number;
}

export interface SortOption {
  field: SortField;
  direction: 'asc' | 'desc';
}

export type SortField =
  | 'name'
  | 'rating'
  | 'experience'
  | 'price'
  | 'students'
  | 'champions'
  | 'yearsActive';

// ========================================
// ENUMS AND CONSTS
// ========================================

export enum Discipline {
  BOXING = 'boxing',
  KICKBOXING = 'kickboxing',
  MUAY_THAI = 'muay_thai',
  BJJ = 'bjj',
  JUDO = 'judo',
  WRESTLING = 'wrestling',
  MMA = 'mma',
  KARATE = 'karate',
  TAEKWONDO = 'taekwondo',
  KRAV_MAGA = 'krav_maga',
  SELF_DEFENSE = 'self_defense',
  STRENGTH = 'strength',
  CONDITIONING = 'conditioning'
}

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional',
  ELITE = 'elite'
}

export enum Language {
  SPANISH = 'spanish',
  ENGLISH = 'english',
  PORTUGUESE = 'portuguese',
  FRENCH = 'french',
  ITALIAN = 'italian',
  GERMAN = 'german'
}

export enum Certification {
  BLACK_BELT = 'black_belt',
  BROWN_BELT = 'brown_belt',
  PURPLE_BELT = 'purple_belt',
  BLUE_BELT = 'blue_belt',
  PROFESSIONAL_LICENSE = 'professional_license',
  COACHING_CERTIFICATE = 'coaching_certificate',
  FIRST_AID = 'first_aid',
  NUTRITION_CERT = 'nutrition_cert'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number;
  category: 'championship' | 'title' | 'record' | 'award';
  level: 'local' | 'national' | 'international' | 'world';
}

// ========================================
// AVAILABILITY AND PRICING
// ========================================

export interface Availability {
  schedule: WeeklySchedule;
  timezone: string;
  nextAvailable?: Date;
  bookingLeadTime: number; // days in advance
}

export interface WeeklySchedule {
  monday: AvailabilitySlot[];
  tuesday: AvailabilitySlot[];
  wednesday: AvailabilitySlot[];
  thursday: AvailabilitySlot[];
  friday: AvailabilitySlot[];
  saturday: AvailabilitySlot[];
  sunday: AvailabilitySlot[];
}

export interface AvailabilitySlot {
  start: string; // "09:00"
  end: string;   // "10:30"
  type: 'private' | 'group' | 'both';
}

export interface Pricing {
  privateSession: PriceOption[];
  groupSession: PriceOption[];
  monthlyPackage?: PriceOption;
  trialSession?: PriceOption;
}

export interface PriceOption {
  duration: number; // minutes
  price: number;    // in local currency
  currency: string;
  includes?: string[];
  discounted?: boolean;
}

// ========================================
// UI STATE TYPES
// ========================================

export interface TrainersUIState {
  selectedTrainer: Trainer | null;
  favoriteTrainers: string[];
  viewedTrainers: string[];
  compareMode: boolean;
  compareList: string[];
  filtersVisible: boolean;
  searchVisible: boolean;
  listView: 'grid' | 'list';
  loading: boolean;
  error: string | null;
}

export interface ModalState {
  isOpen: boolean;
  trainer: Trainer | null;
  type: 'details' | 'booking' | 'compare' | 'contact';
}

// ========================================
// API AND DATA TYPES
// ========================================

export interface TrainersResponse {
  trainers: Trainer[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: TrainerFilters;
}

export interface TrainerDetailsResponse extends Trainer {
  similarTrainers: Trainer[];
  reviews: Review[];
  gallery: GalleryImage[];
  schedule: AvailabilitySlot[];
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
  helpful: number;
  response?: TrainerResponse;
}

export interface TrainerResponse {
  text: string;
  date: Date;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  category: 'training' | 'competition' | 'lifestyle' | 'achievement';
}

// ========================================
// LOCAL STORAGE TYPES
// ========================================

export interface TrainersLocalStorage {
  favoriteTrainers: string[];
  viewedTrainers: string[];
  recentSearches: string[];
  filterPreferences: Partial<TrainerFilters>;
  uiPreferences: {
    listView: 'grid' | 'list';
    compareMode: boolean;
    notificationsEnabled: boolean;
  };
}

// ========================================
// EVENT HANDLERS
// ========================================

export interface TrainerEventHandlers {
  onSelectTrainer: (trainer: Trainer) => void;
  onToggleFavorite: (trainerId: string) => void;
  onOpenModal: (trainer: Trainer, type: ModalState['type']) => void;
  onCloseModal: () => void;
  onFilterChange: (filters: Partial<TrainerFilters>) => void;
  onSearch: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  onCompareToggle: (trainerId: string) => void;
  onBookSession: (trainer: Trainer, slot: AvailabilitySlot) => void;
  onContactTrainer: (trainer: Trainer) => void;
}

// ========================================
// UTILITY TYPES
// ========================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type TrainerFormData = DeepPartial<Omit<Trainer, 'id'>>;

export type FilterUpdatePayload = {
  discipline?: Discipline;
  experienceLevel?: ExperienceLevel;
  rating?: number;
  priceRange?: [number, number];
};

export type SearchSuggestion = {
  text: string;
  type: 'trainer' | 'discipline' | 'achievement';
  count?: number;
};

// ========================================
// ERROR TYPES
// ========================================

export interface TrainersError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export type TrainersAsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: TrainersError | null;
  lastUpdated: Date | null;
};

