import {
    FaFistRaised, FaFire, FaShieldAlt, FaBolt, FaDumbbell
} from 'react-icons/fa';

export const disciplines = [
    {
        id: "mma",
        name: "MMA",
        subtitle: "DOMINIO TOTAL",
        description: "No se trata de pelear, se trata de sobrevivir. Aprende a controlar el caos y descubre una versión de ti que no conocías.",
        benefits: ["Confianza Absoluta", "Defensa Real", "Cuerpo Atlético", "Mente Estratégica"],
        image: "/assets/generated/mma_luxury_bw.png",
        mobileImage: "/assets/generated/mma_mobile_recreation_v2.png",
        icon: FaFistRaised,
        accentColor: "text-sky-500",
        gradient: "from-sky-900/20 to-black"
    },
    {
        id: "boxing",
        name: "BOXEO",
        subtitle: "TERAPIA DE IMPACTO",
        description: "Desconecta del estrés diario golpeando el saco. Desarrolla una concentración láser y libera toda la tensión acumulada.",
        benefits: ["Adiós Estrés", "Reflejos Rápidos", "Brazos Tonificados", "Mente Clara"],
        image: "/assets/generated/boxing_luxury_bw.png",
        mobileImage: "/assets/generated/boxing_mobile_recreation.png",
        icon: FaFistRaised,
        accentColor: "text-indigo-500",
        gradient: "from-indigo-900/20 to-black"
    },
    {
        id: "muay-thai",
        name: "MUAY THAI",
        subtitle: "POTENCIA PURA",
        description: "Descubre la fuerza que hay en tus piernas y codos. Una disciplina intensa que forjará un carácter de hierro.",
        benefits: ["Defensa Integral", "Carácter Fuerte", "Piernas de Acero", "Quema Grasa"],
        image: "/assets/generated/muaythai_luxury_bw.png",
        mobileImage: "/assets/generated/muaythai_mobile_recreation.png",
        icon: FaFire,
        accentColor: "text-cyan-500",
        gradient: "from-cyan-900/20 to-black"
    },
    {
        id: "bjj",
        name: "JIU JITSU",
        subtitle: "INTELIGENCIA EN MOVIMIENTO",
        description: "Aprende que la técnica vence a la fuerza. Ideal para ganar seguridad sin necesidad de ser el más grande o fuerte.",
        benefits: ["Seguridad Real", "Control Técnico", "Paciencia", "Resolución Problemas"],
        image: "/assets/generated/bjj_technical_bw.png",
        mobileImage: "/assets/generated/bjj_mobile_recreation.png",
        icon: FaShieldAlt,
        accentColor: "text-blue-500",
        gradient: "from-blue-900/20 to-black"
    },
    {
        id: "kickboxing",
        name: "KICKBOXING",
        subtitle: "PODER Y PRECISIÓN",
        description: "La evolución del combate de pie. Combina el boxeo occidental con patadas devastadoras.",
        benefits: ["Distancia Perfecta", "Cuerpo Blindado", "Combos Letales", "Explosividad"],
        image: "/assets/generated/kickboxing_action_bw.png",
        mobileImage: "/assets/generated/kickboxing_mobile_recreation.png",
        icon: FaBolt,
        accentColor: "text-purple-500",
        gradient: "from-purple-900/20 to-black"
    },
    {
        id: "acondicionamiento",
        name: "ACONDICIONAMIENTO",
        subtitle: "MOTOR INCANSABLE",
        description: "Construye la energía para rendir en tu vida diaria. No es solo ejercicio, es el combustible para tu día a día.",
        benefits: ["Energía Infinita", "Salud Integral", "Mejor Descanso", "Cuerpo Funcional"],
        image: "/assets/generated/conditioning_grit_bw.png",
        mobileImage: "/assets/generated/conditioning_mobile_recreation.png",
        icon: FaDumbbell,
        accentColor: "text-green-500",
        gradient: "from-green-900/20 to-black"
    }
];

export const SCHEDULE_DATA = [
    // LUNES
    { id: 'l1', discipline: 'Boxeo', type: 'boxing', day: 'Lunes', time: '08:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'l2', discipline: 'Kickboxing', type: 'kickboxing', day: 'Lunes', time: '09:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'l3', discipline: 'Acondicionamiento Físico', type: 'acondicionamiento', day: 'Lunes', time: '16:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'l4', discipline: 'Acondicionamiento Físico', type: 'acondicionamiento', day: 'Lunes', time: '17:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'l5', discipline: 'Artes Marciales Mixtas', type: 'mma', day: 'Lunes', time: '18:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'l6', discipline: 'Jiu Jitsu No Gi', type: 'bjj', day: 'Lunes', time: '19:00', duration: '60 min', level: 'No Gi', instructor: 'Jorge', spots: 20 },
    { id: 'l7', discipline: 'Jiu Jitsu Gi', type: 'bjj', day: 'Lunes', time: '20:00', duration: '60 min', level: 'Gi', instructor: 'Jorge', spots: 20 },

    // MARTES
    { id: 'm1', discipline: 'Boxeo', type: 'boxing', day: 'Martes', time: '08:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'm2', discipline: 'Jiu-Jitsu / Grappling', type: 'bjj', day: 'Martes', time: '09:30', duration: '60 min', level: 'Grappling', instructor: 'César', spots: 20 },
    { id: 'm3', discipline: 'Kickboxing', type: 'kickboxing', day: 'Martes', time: '16:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'm4', discipline: 'Artes Marciales Mixtas', type: 'mma', day: 'Martes', time: '17:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'm5', discipline: 'Muay Thai', type: 'muay-thai', day: 'Martes', time: '18:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'm6', discipline: 'Circuito Boxeo', type: 'boxing', day: 'Martes', time: '19:00', duration: '60 min', level: 'Circuito', instructor: 'Héctor', spots: 20 },
    { id: 'm7', discipline: 'Jiu Jitsu Principiantes', type: 'bjj', day: 'Martes', time: '20:00', duration: '60 min', level: 'Básico', instructor: 'Jorge', spots: 20 },

    // MIERCOLES
    { id: 'x1', discipline: 'Acondicionamiento Físico', type: 'acondicionamiento', day: 'Miércoles', time: '08:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'x2', discipline: 'Acondicionamiento Físico', type: 'acondicionamiento', day: 'Miércoles', time: '09:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'x3', discipline: 'Muay Thai', type: 'muay-thai', day: 'Miércoles', time: '16:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'x4', discipline: 'Artes Marciales Mixtas', type: 'mma', day: 'Miércoles', time: '17:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'x5', discipline: 'Kickboxing', type: 'kickboxing', day: 'Miércoles', time: '18:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'x6', discipline: 'Jiu Jitsu No Gi', type: 'bjj', day: 'Miércoles', time: '19:00', duration: '60 min', level: 'No Gi', instructor: 'Jorge', spots: 20 },
    { id: 'x7', discipline: 'Jiu Jitsu Gi', type: 'bjj', day: 'Miércoles', time: '20:00', duration: '60 min', level: 'Gi', instructor: 'Jorge', spots: 20 },

    // JUEVES
    { id: 'j1', discipline: 'Boxeo', type: 'boxing', day: 'Jueves', time: '08:30', duration: '60 min', level: 'General', instructor: 'César', spots: 20 },
    { id: 'j2', discipline: 'Jiu-Jitsu / Grappling', type: 'bjj', day: 'Jueves', time: '09:30', duration: '60 min', level: 'Grappling', instructor: 'César', spots: 20 },
    { id: 'j3', discipline: 'Kickboxing', type: 'kickboxing', day: 'Jueves', time: '16:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'j4', discipline: 'Artes Marciales Mixtas', type: 'mma', day: 'Jueves', time: '17:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'j5', discipline: 'Muay Thai', type: 'muay-thai', day: 'Jueves', time: '18:00', duration: '60 min', level: 'General', instructor: 'Héctor', spots: 20 },
    { id: 'j6', discipline: 'Circuito Boxeo', type: 'boxing', day: 'Jueves', time: '19:00', duration: '60 min', level: 'Circuito', instructor: 'Héctor', spots: 20 },
    { id: 'j7', discipline: 'Jiu Jitsu Principiantes', type: 'bjj', day: 'Jueves', time: '20:00', duration: '60 min', level: 'Básico', instructor: 'Jorge', spots: 20 },

    // VIERNES
    { id: 'v1', discipline: 'Sparring', type: 'boxing', day: 'Viernes', time: '08:30', duration: '60 min', level: 'Sparring', instructor: 'César', spots: 20 },
    { id: 'v2', discipline: 'Sparring', type: 'boxing', day: 'Viernes', time: '09:30', duration: '60 min', level: 'Sparring', instructor: 'César', spots: 20 },
    { id: 'v3', discipline: 'Sparring Muay Thai', type: 'muay-thai', day: 'Viernes', time: '16:00', duration: '60 min', level: 'Sparring', instructor: 'Héctor', spots: 20 },
    { id: 'v4', discipline: 'Sparring MMA', type: 'mma', day: 'Viernes', time: '17:00', duration: '60 min', level: 'Sparring', instructor: 'Héctor', spots: 20 },
    { id: 'v5', discipline: 'Sparring MMA', type: 'mma', day: 'Viernes', time: '18:00', duration: '60 min', level: 'Sparring', instructor: 'Héctor', spots: 20 },
    { id: 'v6', discipline: 'Jiu Jitsu', type: 'bjj', day: 'Viernes', time: '19:00', duration: '60 min', level: 'General', instructor: 'Jorge', spots: 20 },
    { id: 'v7', discipline: 'Open Mat Jiu Jitsu', type: 'bjj', day: 'Viernes', time: '20:00', duration: '60 min', level: 'Open Mat', instructor: 'Jorge', spots: 20 },
];
