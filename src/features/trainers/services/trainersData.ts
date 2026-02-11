/**
 * Trainers Data Services
 * Feature-First Architecture - Data layer with API simulation
 */

import {
  Trainer,
  Discipline,
  ExperienceLevel,
  Language,
  Certification,
  Achievement,
  TrainerStats,
  SocialMedia,
  Availability,
  WeeklySchedule,
  AvailabilitySlot,
  Pricing,
  PriceOption,
  TrainersResponse,
  TrainerDetailsResponse,
  Review,
  GalleryImage,
  TrainersError
} from '../types/trainers';

// ========================================
// REALISTIC TRAINER DATA
// ========================================

export const trainersDatabase: Trainer[] = [
  {
    id: 'trainer-001',
    name: 'CARLOS MENDEZ',
    nickname: 'EL TORNADO',
    role: 'CAMPEÓN MUNDIAL KICKBOXING',
    bio: 'Leyenda del kickboxing con récord imbatible de 42-0. Especialista en acabados en el primer round y estratega de combate de clase mundial.',
    specialty: '42-0 como profesional. Especialista en acabar peleas en el primer round.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=face&q=80&auto=format&sat=-100',
    rating: 4.9,
    reviewCount: 127,
    experience: ExperienceLevel.ELITE,
    disciplines: [Discipline.KICKBOXING, Discipline.MUAY_THAI, Discipline.MMA],
    certifications: [Certification.BLACK_BELT, Certification.PROFESSIONAL_LICENSE, Certification.COACHING_CERTIFICATE],
    achievements: [
      {
        id: 'ach-001',
        title: 'Campeón Mundial WKA',
        description: 'Título mundial obtenido en 2019',
        year: 2019,
        category: 'championship',
        level: 'world'
      },
      {
        id: 'ach-002',
        title: '42-0 Profesional',
        description: 'Récord imbatible como profesional',
        year: 2024,
        category: 'record',
        level: 'international'
      }
    ],
    socialMedia: {
      instagram: 'https://instagram.com/carlostornado',
      facebook: 'https://facebook.com/carlosmendez',
      youtube: 'https://youtube.com/carlostornado'
    },
    stats: {
      studentsCount: 342,
      championsTrained: 18,
      yearsActive: 15,
      specialMoves: ['Tornado Kick', 'Lightning Hook', 'Dragon Sweep']
    },
    availability: {
      schedule: {
        monday: [{ start: '06:00', end: '21:00', type: 'both' }],
        tuesday: [{ start: '06:00', end: '21:00', type: 'both' }],
        wednesday: [{ start: '06:00', end: '21:00', type: 'both' }],
        thursday: [{ start: '06:00', end: '21:00', type: 'both' }],
        friday: [{ start: '06:00', end: '21:00', type: 'both' }],
        saturday: [{ start: '08:00', end: '14:00', type: 'group' }],
        sunday: []
      },
      timezone: 'America/Mexico_City',
      bookingLeadTime: 24
    },
    pricing: {
      privateSession: [
        { duration: 60, price: 150, currency: 'USD', includes: ['Personalized plan', 'Gear included'], discounted: false },
        { duration: 30, price: 85, currency: 'USD', includes: ['Quick technique review'], discounted: false }
      ],
      groupSession: [
        { duration: 60, price: 45, currency: 'USD', includes: ['Group dynamics', 'Sparring partners'], discounted: true },
        { duration: 90, price: 65, currency: 'USD', includes: ['Extended training', 'Nutrition tips'], discounted: false }
      ],
      trialSession: { duration: 30, price: 0, currency: 'USD', includes: ['Free consultation', 'Technique assessment'] }
    },
    languages: [Language.SPANISH, Language.ENGLISH],
    featured: true
  },
  {
    id: 'trainer-002',
    name: 'ANA RODRIGUEZ',
    nickname: 'LA ARMADURA',
    role: '4TO DAN BJJ BLACK BELT',
    bio: 'Reconocida por su invencibilidad en ground fighting. Más de 200 sumisiones registradas y especialista en reverser cualquier situación adversa.',
    specialty: 'Más de 200 sumisiones registradas. Especialista en reverter cualquier situación.',
    image: 'https://images.unsplash.com/photo-1594736797933-d0dcc4ba7423?w=400&h=600&fit=crop&crop=face&q=80&auto=format&sat=-100',
    rating: 4.8,
    reviewCount: 98,
    experience: ExperienceLevel.PROFESSIONAL,
    disciplines: [Discipline.BJJ, Discipline.JUDO, Discipline.WRESTLING, Discipline.SELF_DEFENSE],
    certifications: [Certification.BLACK_BELT, Certification.BROWN_BELT, Certification.COACHING_CERTIFICATE, Certification.NUTRITION_CERT],
    achievements: [
      {
        id: 'ach-003',
        title: 'ADCC Champion',
        description: 'Campeona absoluta ADCC 2022',
        year: 2022,
        category: 'championship',
        level: 'world'
      },
      {
        id: 'ach-004',
        title: '200 Sumisiones',
        description: 'Milestone de 200 sumisiones en competencia',
        year: 2023,
        category: 'record',
        level: 'international'
      }
    ],
    socialMedia: {
      instagram: 'https://instagram.com/anaarmadura',
      facebook: 'https://facebook.com/anarodriguezbjj'
    },
    stats: {
      studentsCount: 267,
      championsTrained: 12,
      yearsActive: 12,
      specialMoves: ['Armbar Triangle', 'Guard Recovery', 'Leg Lock Chain']
    },
    availability: {
      schedule: {
        monday: [{ start: '07:00', end: '12:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        tuesday: [{ start: '07:00', end: '12:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        wednesday: [{ start: '07:00', end: '12:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        thursday: [{ start: '07:00', end: '12:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        friday: [{ start: '07:00', end: '12:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        saturday: [{ start: '09:00', end: '13:00', type: 'both' }],
        sunday: []
      },
      timezone: 'America/Mexico_City',
      bookingLeadTime: 48
    },
    pricing: {
      privateSession: [
        { duration: 60, price: 120, currency: 'USD', includes: ['Gi required', 'Technique breakdown'], discounted: false },
        { duration: 90, price: 170, currency: 'USD', includes: ['Extended rolling', 'Video analysis'], discounted: false }
      ],
      groupSession: [
        { duration: 60, price: 40, currency: 'USD', includes: ['Gi rental available'], discounted: true }
      ],
      trialSession: { duration: 45, price: 0, currency: 'USD', includes: ['Free trial class', 'Equipment provided'] }
    },
    languages: [Language.SPANISH, Language.ENGLISH, Language.PORTUGUESE],
    featured: true
  },
  {
    id: 'trainer-003',
    name: 'MIGUEL TORRES',
    nickname: 'LA MÁQUINA',
    role: 'EX CAMPEÓN NACIONAL BOXEO',
    bio: '18 años entrenando campeones UFC. Especialista en convertir novatos en profesionales en 12 meses. Maestro del footwork y estrategia.',
    specialty: '18 años entrenando campeones UFC. Convierte novatos en profesionales en 12 meses.',
    image: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=600&fit=crop&crop=face&q=80&auto=format&sat=-100',
    rating: 4.7,
    reviewCount: 156,
    experience: ExperienceLevel.ELITE,
    disciplines: [Discipline.BOXING, Discipline.MMA, Discipline.STRENGTH, Discipline.CONDITIONING],
    certifications: [Certification.PROFESSIONAL_LICENSE, Certification.COACHING_CERTIFICATE, Certification.FIRST_AID],
    achievements: [
      {
        id: 'ach-005',
        title: 'Trainer of the Year',
        description: 'Reconocido como mejor entrenador del año 2021',
        year: 2021,
        category: 'award',
        level: 'national'
      },
      {
        id: 'ach-006',
        title: '25 UFC Champions',
        description: '25 campeones UFC entrenados',
        year: 2024,
        category: 'record',
        level: 'international'
      }
    ],
    socialMedia: {
      instagram: 'https://instagram.com/miguelmachine',
      facebook: 'https://facebook.com/migueltorres',
      twitter: 'https://twitter.com/migueltorres',
      youtube: 'https://youtube.com/migueltorres'
    },
    stats: {
      studentsCount: 489,
      championsTrained: 25,
      yearsActive: 18,
      specialMoves: ['Power Jab', 'Body Shot Combo', 'Counter Punch']
    },
    availability: {
      schedule: {
        monday: [{ start: '05:00', end: '22:00', type: 'both' }],
        tuesday: [{ start: '05:00', end: '22:00', type: 'both' }],
        wednesday: [{ start: '05:00', end: '22:00', type: 'both' }],
        thursday: [{ start: '05:00', end: '22:00', type: 'both' }],
        friday: [{ start: '05:00', end: '22:00', type: 'both' }],
        saturday: [{ start: '07:00', end: '15:00', type: 'private' }],
        sunday: [{ start: '10:00', end: '14:00', type: 'private' }]
      },
      timezone: 'America/Mexico_City',
      bookingLeadTime: 12
    },
    pricing: {
      privateSession: [
        { duration: 60, price: 180, currency: 'USD', includes: ['Gloves included', 'Hand wraps'], discounted: false },
        { duration: 30, price: 100, currency: 'USD', includes: ['Quick technique review'], discounted: true }
      ],
      groupSession: [
        { duration: 60, price: 50, currency: 'USD', includes: ['Bag work', 'Partner drills'], discounted: true },
        { duration: 90, price: 70, currency: 'USD', includes: ['Circuit training', 'Sparring'], discounted: false }
      ],
      trialSession: { duration: 30, price: 0, currency: 'USD', includes: ['Free consultation', 'Fitness assessment'] }
    },
    languages: [Language.SPANISH, Language.ENGLISH],
    featured: true
  },
  {
    id: 'trainer-004',
    name: 'DIELO SANTOS',
    nickname: 'FURIA ASIÁTICA',
    role: 'CAMPEÓN MUNDIAL MUAY THAI',
    bio: '5 años entrenando en Tailandia. Especialista en clinch work, elbows y knee techniques. Combina tradición con técnicas modernas.',
    specialty: '5 años en Tailandia. Especialista en clinch work, elbows y knees.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=face&q=80&auto=format&sat=-100',
    rating: 4.6,
    reviewCount: 89,
    experience: ExperienceLevel.PROFESSIONAL,
    disciplines: [Discipline.MUAY_THAI, Discipline.KICKBOXING, Discipline.MMA],
    certifications: [Certification.BLACK_BELT, Certification.COACHING_CERTIFICATE],
    achievements: [
      {
        id: 'ach-007',
        title: 'Lumpinee Champion',
        description: 'Campeón del estadio Lumpinee',
        year: 2020,
        category: 'championship',
        level: 'world'
      }
    ],
    socialMedia: {
      instagram: 'https://instagram.com/dielofuria',
      youtube: 'https://youtube.com/dielosantos'
    },
    stats: {
      studentsCount: 198,
      championsTrained: 8,
      yearsActive: 10,
      specialMoves: ['Flying Knee', 'Elbow Strike', 'Clinch Control']
    },
    availability: {
      schedule: {
        monday: [{ start: '16:00', end: '21:00', type: 'group' }],
        tuesday: [{ start: '06:00', end: '09:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        wednesday: [{ start: '16:00', end: '21:00', type: 'group' }],
        thursday: [{ start: '06:00', end: '09:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        friday: [{ start: '16:00', end: '21:00', type: 'group' }],
        saturday: [{ start: '10:00', end: '14:00', type: 'both' }],
        sunday: []
      },
      timezone: 'America/Mexico_City',
      bookingLeadTime: 24
    },
    pricing: {
      privateSession: [
        { duration: 60, price: 130, currency: 'USD', includes: ['Pads provided', 'Clinch training'], discounted: false }
      ],
      groupSession: [
        { duration: 90, price: 55, currency: 'USD', includes: ['Pad work', 'Partner drills'], discounted: true }
      ],
      trialSession: { duration: 30, price: 0, currency: 'USD', includes: ['Free technique demo'] }
    },
    languages: [Language.SPANISH, Language.ENGLISH, Language.PORTUGUESE],
    featured: false
  },
  {
    id: 'trainer-005',
    name: 'VALENTINA ROSSI',
    nickname: 'TORBELLINO',
    role: 'EXPERTA EN DEFENSA PERSONAL',
    bio: 'Ex guardaespaldas profesional. Especialista en Krav Maga y defensa personal para mujeres. 100% efectividad en situaciones reales.',
    specialty: 'Krav Maga y defensa personal. Experiencia en protección ejecutiva.',
    image: 'https://images.unsplash.com/photo-1573163187638-b4d2a8e4b4cb?w=400&h=600&fit=crop&crop=face&q=80&auto=format&sat=-100',
    rating: 4.8,
    reviewCount: 203,
    experience: ExperienceLevel.ADVANCED,
    disciplines: [Discipline.KRAV_MAGA, Discipline.SELF_DEFENSE, Discipline.MMA],
    certifications: [Certification.BLACK_BELT, Certification.COACHING_CERTIFICATE, Certification.FIRST_AID],
    achievements: [
      {
        id: 'ach-008',
        title: 'Certificación IDF',
        description: 'Certificación oficial Krav Maga Fuerzas de Defensa Israelí',
        year: 2018,
        category: 'award',
        level: 'international'
      }
    ],
    socialMedia: {
      instagram: 'https://instagram.com/valentinatorbellino',
      facebook: 'https://facebook.com/valentinorossi'
    },
    stats: {
      studentsCount: 445,
      championsTrained: 0,
      yearsActive: 8,
      specialMoves: ['Disarmament', 'Multiple attackers', 'Street defense']
    },
    availability: {
      schedule: {
        monday: [{ start: '18:00', end: '22:00', type: 'group' }],
        tuesday: [{ start: '18:00', end: '22:00', type: 'group' }],
        wednesday: [{ start: '09:00', end: '12:00', type: 'private' }, { start: '18:00', end: '22:00', type: 'group' }],
        thursday: [{ start: '18:00', end: '22:00', type: 'group' }],
        friday: [{ start: '18:00', end: '22:00', type: 'group' }],
        saturday: [{ start: '10:00', end: '16:00', type: 'both' }],
        sunday: [{ start: '10:00', end: '14:00', type: 'private' }]
      },
      timezone: 'America/Mexico_City',
      bookingLeadTime: 24
    },
    pricing: {
      privateSession: [
        { duration: 60, price: 110, currency: 'USD', includes: ['Real scenarios', 'Legal aspects'], discounted: false }
      ],
      groupSession: [
        { duration: 60, price: 35, currency: 'USD', includes: ['Self-defense techniques'], discounted: true }
      ],
      trialSession: { duration: 45, price: 0, currency: 'USD', includes: ['Free self-defense workshop'] }
    },
    languages: [Language.SPANISH, Language.ENGLISH, Language.ITALIAN],
    featured: false
  },
  {
    id: 'trainer-006',
    name: 'JAMES PARKER',
    nickname: 'THE BEAST',
    role: 'EX UFC HEAVYWEIGHT',
    bio: 'Ex UFC Top 10. Especialista en wrestling y strength & conditioning. Transforma physiques y mentes en 6 meses.',
    specialty: 'Wrestling olímpico y powerlifting. Transformación física completa.',
    image: 'https://images.unsplash.com/photo-1506765336936-b21cf6ab99b1?w=400&h=600&fit=crop&crop=face&q=80&auto=format&sat=-100',
    rating: 4.5,
    reviewCount: 167,
    experience: ExperienceLevel.ELITE,
    disciplines: [Discipline.WRESTLING, Discipline.STRENGTH, Discipline.MMA, Discipline.BOXING],
    certifications: [Certification.PROFESSIONAL_LICENSE, Certification.COACHING_CERTIFICATE, Certification.NUTRITION_CERT],
    achievements: [
      {
        id: 'ach-009',
        title: 'UFC Top 10',
        description: 'Alcanzó ranking #7 en UFC Heavyweight',
        year: 2017,
        category: 'championship',
        level: 'international'
      }
    ],
    socialMedia: {
      instagram: 'https://instagram.com/jamesthebeast',
      facebook: 'https://instagram.com/jamesparker',
      youtube: 'https://youtube.com/jamesparker'
    },
    stats: {
      studentsCount: 289,
      championsTrained: 6,
      yearsActive: 12,
      specialMoves: ['Power Double', 'Ground and Pound', 'Suplex']
    },
    availability: {
      schedule: {
        monday: [{ start: '05:00', end: '10:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        tuesday: [{ start: '05:00', end: '10:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        wednesday: [{ start: '05:00', end: '10:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        thursday: [{ start: '05:00', end: '10:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        friday: [{ start: '05:00', end: '10:00', type: 'private' }, { start: '17:00', end: '21:00', type: 'group' }],
        saturday: [{ start: '07:00', end: '12:00', type: 'both' }],
        sunday: []
      },
      timezone: 'America/Mexico_City',
      bookingLeadTime: 24
    },
    pricing: {
      privateSession: [
        { duration: 60, price: 200, currency: 'USD', includes: ['Strength program', 'Nutrition plan'], discounted: false },
        { duration: 90, price: 280, currency: 'USD', includes: ['Complete transformation'], discounted: false }
      ],
      groupSession: [
        { duration: 60, price: 60, currency: 'USD', includes: ['Weight training', 'Conditioning'], discounted: true }
      ],
      trialSession: { duration: 30, price: 0, currency: 'USD', includes: ['Free fitness assessment'] }
    },
    languages: [Language.ENGLISH, Language.SPANISH],
    featured: false
  }
];

// ========================================
// SAMPLE ADDITIONAL DATA
// ========================================

export const sampleReviews: Review[] = [
  {
    id: 'review-001',
    studentName: 'Carlos Mendoza',
    rating: 5,
    comment: 'El mejor entrenador que he tenido. Me transformó completamente en 6 meses.',
    date: new Date('2024-01-15'),
    verified: true,
    helpful: 24
  },
  {
    id: 'review-002',
    studentName: 'Ana Rodríguez',
    rating: 5,
    comment: 'Increíble técnica y paciencia. Aprendí más en 3 meses que en años anteriores.',
    date: new Date('2024-01-10'),
    verified: true,
    helpful: 18,
    response: {
      text: '¡Gracias Ana! Es un placer entrenarte y ver tu progreso.',
      date: new Date('2024-01-11')
    }
  }
];

export const sampleGallery: GalleryImage[] = [
  {
    id: 'gallery-001',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=face&q=80',
    caption: 'Sesión de entrenamiento intensivo',
    category: 'training'
  },
  {
    id: 'gallery-002',
    url: 'https://images.unsplash.com/photo-1594736797933-d0dcc4ba7423?w=800&h=600&fit=crop&crop=face&q=80',
    caption: 'Campeonato Mundial 2019',
    category: 'competition'
  }
];

// ========================================
// API SIMULATION
// ========================================

export interface ApiSimConfig {
  latency: number;
  failureRate: number;
  enableLogs: boolean;
}

const defaultApiConfig: ApiSimConfig = {
  latency: 500,
  failureRate: 0.05,
  enableLogs: process.env.NODE_ENV === 'development'
};

const simulateApiCall = async <T>(data: T, config: Partial<ApiSimConfig> = {}): Promise<T> => {
  const finalConfig = { ...defaultApiConfig, ...config };

  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, finalConfig.latency));

  // Simulate random failures
  if (Math.random() < finalConfig.failureRate) {
    const error: TrainersError = {
      code: 'NETWORK_ERROR',
      message: 'Simulated network failure',
      details: { timestamp: new Date() },
      timestamp: new Date()
    };
    throw error;
  }

  if (finalConfig.enableLogs) {
    console.log('🏋️ API Sim: Returning data:', data);
  }

  return data;
};

// ========================================
// DATA ACCESS FUNCTIONS
// ========================================

export class TrainersDataService {
  private config: ApiSimConfig;

  constructor(config: Partial<ApiSimConfig> = {}) {
    this.config = { ...defaultApiConfig, ...config };
  }

  /**
   * Get all trainers with pagination
   */
  async getTrainers(page = 1, limit = 12): Promise<TrainersResponse> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const trainers = trainersDatabase.slice(startIndex, endIndex);

    const response: TrainersResponse = {
      trainers,
      total: trainersDatabase.length,
      page,
      limit,
      hasMore: endIndex < trainersDatabase.length,
      filters: {
        disciplines: [],
        experienceLevels: [],
        rating: 0,
        priceRange: [0, 500],
        languages: [],
        availability: [],
        featuredOnly: false,
      }
    };

    return simulateApiCall(response, this.config);
  }

  /**
   * Get featured trainers only
   */
  async getFeaturedTrainers(): Promise<Trainer[]> {
    const featured = trainersDatabase.filter(trainer => trainer.featured);
    return simulateApiCall(featured, this.config);
  }

  /**
   * Get trainer by ID with full details
   */
  async getTrainerById(id: string): Promise<TrainerDetailsResponse | null> {
    const trainer = trainersDatabase.find(t => t.id === id);

    if (!trainer) {
      return simulateApiCall(null, this.config);
    }

    // Find similar trainers
    const similarTrainers = trainersDatabase
      .filter(t => t.id !== id && t.disciplines.some(d => trainer.disciplines.includes(d)))
      .slice(0, 3);

    const response: TrainerDetailsResponse = {
      ...trainer,
      similarTrainers,
      reviews: sampleReviews,
      gallery: sampleGallery,
      schedule: Object.values(trainer.availability.schedule).flat()
    };

    return simulateApiCall(response, this.config);
  }

  /**
   * Search trainers by query
   */
  async searchTrainers(query: string): Promise<Trainer[]> {
    if (!query.trim()) {
      return simulateApiCall([], this.config);
    }

    const lowerQuery = query.toLowerCase();
    const filtered = trainersDatabase.filter(trainer =>
      trainer.name.toLowerCase().includes(lowerQuery) ||
      trainer.nickname?.toLowerCase().includes(lowerQuery) ||
      trainer.specialty.toLowerCase().includes(lowerQuery) ||
      trainer.bio.toLowerCase().includes(lowerQuery) ||
      trainer.disciplines.some(d => d.toLowerCase().includes(lowerQuery))
    );

    return simulateApiCall(filtered, this.config);
  }

  /**
   * Get trainers by discipline
   */
  async getTrainersByDiscipline(discipline: Discipline): Promise<Trainer[]> {
    const filtered = trainersDatabase.filter(trainer =>
      trainer.disciplines.includes(discipline)
    );
    return simulateApiCall(filtered, this.config);
  }

  /**
   * Get trainers by experience level
   */
  async getTrainersByExperience(level: ExperienceLevel): Promise<Trainer[]> {
    const filtered = trainersDatabase.filter(trainer => trainer.experience === level);
    return simulateApiCall(filtered, this.config);
  }

  /**
   * Get trainer statistics
   */
  async getTrainerStats(trainerId: string): Promise<TrainerStats | null> {
    const trainer = trainersDatabase.find(t => t.id === trainerId);
    return simulateApiCall(trainer?.stats || null, this.config);
  }

  /**
   * Get all available disciplines
   */
  async getAvailableDisciplines(): Promise<Discipline[]> {
    const disciplines = new Set<Discipline>();
    trainersDatabase.forEach(trainer => {
      trainer.disciplines.forEach(discipline => disciplines.add(discipline));
    });
    return simulateApiCall(Array.from(disciplines), this.config);
  }

  /**
   * Get price range information
   */
  async getPriceRange(): Promise<{ min: number; max: number; average: number }> {
    const allPrices = trainersDatabase.flatMap(trainer =>
      trainer.pricing.privateSession.map(session => session.price)
    );

    const range = {
      min: Math.min(...allPrices),
      max: Math.max(...allPrices),
      average: allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
    };

    return simulateApiCall(range, this.config);
  }

  /**
   * Check trainer availability
   */
  async checkAvailability(trainerId: string, date: Date): Promise<AvailabilitySlot[]> {
    const trainer = trainersDatabase.find(t => t.id === trainerId);

    if (!trainer) {
      return simulateApiCall([], this.config);
    }

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase().substring(0, 3);
    const schedule = trainer.availability.schedule[dayOfWeek as keyof WeeklySchedule] || [];

    return simulateApiCall(schedule, this.config);
  }

  /**
   * Get popular trainers (by rating and review count)
   */
  async getPopularTrainers(limit = 6): Promise<Trainer[]> {
    const sorted = [...trainersDatabase]
      .sort((a, b) => {
        const aScore = a.rating * a.reviewCount;
        const bScore = b.rating * b.reviewCount;
        return bScore - aScore;
      })
      .slice(0, limit);

    return simulateApiCall(sorted, this.config);
  }

  /**
   * Get recently added trainers
   */
  async getRecentlyAdded(limit = 4): Promise<Trainer[]> {
    // For demo purposes, we'll return the last trainers
    const recent = trainersDatabase.slice(-limit);
    return simulateApiCall(recent.reverse(), this.config);
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get discipline display name
 */
export const getDisciplineDisplayName = (discipline: Discipline): string => {
  const names: Record<Discipline, string> = {
    [Discipline.BOXING]: 'Boxeo',
    [Discipline.KICKBOXING]: 'Kickboxing',
    [Discipline.MUAY_THAI]: 'Muay Thai',
    [Discipline.BJJ]: 'BJJ',
    [Discipline.JUDO]: 'Judo',
    [Discipline.WRESTLING]: 'Wrestling',
    [Discipline.MMA]: 'MMA',
    [Discipline.KARATE]: 'Karate',
    [Discipline.TAEKWONDO]: 'Taekwondo',
    [Discipline.KRAV_MAGA]: 'Krav Maga',
    [Discipline.SELF_DEFENSE]: 'Defensa Personal',
    [Discipline.STRENGTH]: 'Entrenamiento de Fuerza',
    [Discipline.CONDITIONING]: 'Acondicionamiento'
  };
  return names[discipline] || discipline;
};

/**
 * Get experience level display name
 */
export const getExperienceDisplayName = (level: ExperienceLevel): string => {
  const names: Record<ExperienceLevel, string> = {
    [ExperienceLevel.BEGINNER]: 'Principiante',
    [ExperienceLevel.INTERMEDIATE]: 'Intermedio',
    [ExperienceLevel.ADVANCED]: 'Avanzado',
    [ExperienceLevel.PROFESSIONAL]: 'Profesional',
    [ExperienceLevel.ELITE]: 'Élite'
  };
  return names[level] || level;
};

/**
 * Format price for display
 */
export const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(price);
};

/**
 * Generate search suggestions
 */
export const generateSearchSuggestions = (query: string): string[] => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const suggestions = new Set<string>();

  trainersDatabase.forEach(trainer => {
    // Name suggestions
    if (trainer.name.toLowerCase().includes(lowerQuery)) {
      suggestions.add(trainer.name);
    }

    // Nickname suggestions
    if (trainer.nickname?.toLowerCase().includes(lowerQuery)) {
      suggestions.add(trainer.nickname);
    }

    // Discipline suggestions
    trainer.disciplines.forEach(discipline => {
      const displayName = getDisciplineDisplayName(discipline);
      if (displayName.toLowerCase().includes(lowerQuery)) {
        suggestions.add(displayName);
      }
    });
  });

  return Array.from(suggestions).slice(0, 5);
};

// ========================================
// EXPORT DEFAULT INSTANCE
// ========================================

export const trainersService = new TrainersDataService();