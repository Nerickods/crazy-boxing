export interface PlanFeature {
    text: string;
    included: boolean;
}

export interface Plan {
    id: string; // UUID from DB
    key?: string;
    name: string;
    price: number;
    period: string; // 'semana' | 'mes' | 'semestre' | 'año' | 'visita'
    description: string;
    features: string[]; // JSONB in DB -> string[] here
    isPopular?: boolean; // DB: is_popular
    savings?: string;
    highlight?: boolean;
    backgroundImage?: string;
    displayOrder?: number; // DB: display_order
    isActive?: boolean;
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    discount: string;
    features: string[];
    gradient?: string;
    backgroundImage?: string; // DB: background_image
    displayOrder?: number;
    isActive?: boolean;
    validUntil?: string;
}

export interface SectionConfig {
    key: string;
    title: string; // "OFERTA POR TIEMPO LIMITADO"
    subtitle: string; // "2026: Tu Año. Tu Legado"
    description?: string;
    isActive: boolean;
}
