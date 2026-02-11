import { Plan } from "../types/plan";

// Update: Removed "Sin costo de inscripción" as now it costs $200 for monthly+
const COMMON_FEATURES = [
    "Acceso a TODAS las disciplinas",
    "Boxeo, BJJ, Muay Thai, MMA",
    "Acondicionamiento Físico",
    "Horarios flexibles e ilimitados",
];

export const PLANS: Plan[] = [
    {
        id: "visita",
        name: "Visita",
        price: 80, // Updated 2026
        period: "día",
        description: "Prueba nuestra intensidad. (Primera visita GRATIS para nuevos usuarios)",
        features: [
            "Acceso por un día",
            "Clases grupales incluidas",
            "Uso de instalaciones",
        ]
    },
    {
        id: "semanal",
        name: "Semanal",
        price: 250,
        period: "semana",
        description: "Perfecto para viajeros o semanas intensivas.",
        features: [
            ...COMMON_FEATURES,
            "Ideal para corto plazo",
            "Sin costo de inscripción"
        ]
    },
    {
        id: "mensual",
        name: "Mensual",
        price: 600,
        period: "mes",
        description: "El plan más popular para comenzar tu transformación.",
        features: [
            ...COMMON_FEATURES,
            "✨ Acceso a sucursal Zapopan",
            "Sin plazos forzosos",
            "Inscripción: $200 MXN"
        ],
        isPopular: true,
        highlight: true,
    },
    {
        id: "semestre",
        name: "Semestral",
        price: 3000,
        period: "semestre",
        description: "Compromiso serio con tu disciplina y ahorro.",
        features: [
            ...COMMON_FEATURES,
            "✨ Acceso a sucursal Zapopan",
            "Inscripción GRATIS (Promo)", // Assuming promo applies here too or standard?
        ],
        savings: "Ahorra $600 anualizado",
    },
    {
        id: "anual",
        name: "Anualidad",
        price: 6000,
        period: "año",
        description: "Para guerreros dedicados al 100%. El mejor valor.",
        features: [
            ...COMMON_FEATURES,
            "✨ Acceso a sucursal Zapopan",
            "Inscripción GRATIS",
        ],
        savings: "Ahorra $1,200 vs mensual",
        highlight: true,
    },
];

export interface Promotion {
    id: string;
    title: string;
    description: string;
    discount: string;
    features: string[];
    gradient: string;
    backgroundImage: string;
}

export const PROMOTIONS_2026: Promotion[] = [
    {
        id: "promo-3-meses",
        title: "EL INICIO",
        description: "3 MESES",
        discount: "Inscripción GRATIS",
        features: [
            "90 Días para romper tu inercia",
            "Ahorra $200 de inscripción",
            "Perfecto para iniciar"
        ],
        gradient: "from-blue-600/20 to-cyan-400/20", // Adjusted to match Blue image
        backgroundImage: "/assets/promos/promo-3.jpg"
    },
    {
        id: "promo-6-meses",
        title: "LA EVOLUCIÓN",
        description: "6 MESES",
        discount: "$2,880",
        features: [
            "Equivale a 1 MES GRATIS (+ $120)",
            "Cuerpo de acero en medio año",
            "la oferta mas popular"
        ],
        gradient: "from-pink-600/20 to-purple-600/20", // Adjusted to match Pink image
        backgroundImage: "/assets/promos/promo-1.jpg"
    },
    {
        id: "promo-12-meses",
        title: "EL LEGADO",
        description: "12 MESES",
        discount: "$5,040",
        features: [
            "¡3.5 MESES DE REGALO!",
            "Ahorro anual masivo: $2,160"
        ],
        gradient: "from-green-600/20 to-emerald-400/20", // Adjusted to match Green image
        backgroundImage: "/assets/promos/promo-2.jpg"
    }
];
