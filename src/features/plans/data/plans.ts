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
        name: "CLASE SUELTA",
        price: 50,
        period: "visita",
        description: "Ideal si estás de paso o tu agenda es imposible.",
        features: [
            "✨ 🥊 1 Sesión de Entrenamiento: Acceso puntual a nuestras instalaciones y equipo.",
            "✅ Material Incluido: Te prestamos guantes y vendas por el día.",
            "❌ Sin seguimiento: Vienes, entrenas y te vas.",
            "⚠️ Coste alto: Si vienes 3 veces por semana, pagarías $600 al mes."
        ],
        ctaText: "Reservar 1 Clase",
        displayOrder: 1
    },
    {
        id: "semanal",
        name: "SEMANA DE CHOQUE",
        price: 150,
        period: "semana",
        description: "Perfecto para visitantes o para liberar una semana de estrés acumulado.",
        features: [
            "✨ 🔥 Acceso Total 7 Días: Entrena todos los días que quieras.",
            "🧠 Desconexión Mental: La dosis justa de adrenalina para reiniciar tu cerebro.",
            "📉 Ahorro inmediato: Te sale mucho más barato que pagar 3 clases sueltas."
        ],
        ctaText: "Comprar Semana",
        displayOrder: 2
    },
    {
        id: "mensual",
        name: 'PLAN "GUERRERO"',
        price: 479,
        period: "mes",
        description: "El único plan diseñado para ver cambios físicos reales en menos de 30 días.",
        features: [
            "✨ 🚀 Acceso Ilimitado: Ven a todas las clases que quieras.",
            "👊 Corrección Técnica Personalizada: Ajustamos tus golpes para que pegues duro.",
            "🛡️ Comunidad de Éxito: Entrena con el mismo grupo y motívate.",
            "💰 Mejor Valor: Te ahorras más de $120 comparado con pagar clases sueltas."
        ],
        isPopular: true,
        highlight: true,
        savings: "⭐ EL MÁS VENDIDO",
        ctaText: "Quiero Transformarme",
        displayOrder: 3
    },
    {
        id: "pareja",
        name: 'PLAN "DÚO DINÁMICO"',
        price: 850,
        period: "pareja",
        description: "La ciencia dice que entrenar acompañado aumenta un 90% tu éxito.",
        features: [
            "✨ 💎 Todo lo del Plan Guerrero: Acceso total y corrección técnica para ambos.",
            "📉 Descuento Masivo: Os sale a $425 cada uno.",
            "🤝 Factor Responsabilidad: Cuando uno tiene pereza, el otro tira del carro.",
            "⏳ OFERTA LIMITADA: Solo aceptamos 10 parejas este mes."
        ],
        savings: "⚡ LA OFERTA IRRESISTIBLE",
        ctaText: "Aprovechar Promo Parejas",
        highlight: true,
        displayOrder: 4
    },
];



