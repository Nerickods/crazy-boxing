
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PLANS = [
    {
        key: "visita",
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
        display_order: 1,
        is_popular: false,
        highlight: false,
        is_active: true
    },
    {
        key: "semanal",
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
        display_order: 2,
        is_popular: false,
        highlight: false,
        is_active: true
    },
    {
        key: "mensual",
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
        is_popular: true,
        highlight: true,
        savings: "⭐ EL MÁS VENDIDO",
        ctaText: "Quiero Transformarme",
        display_order: 3,
        is_active: true
    },
    {
        key: "pareja",
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
        display_order: 4,
        is_active: true
    },
];

async function updatePlans() {
    console.log('Starting plans update...');

    // 1. Delete all existing plans
    const { error: deleteError } = await supabase
        .from('plans')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (hackish neq used to match all if needed, or just use no filter if allowed)

    // Better to just delete all
    const { error: deleteError2 } = await supabase.from('plans').delete().gte('price', 0);

    if (deleteError2) {
        console.error('Error deleting plans:', deleteError2);
        // Continue anyway?
    } else {
        console.log('Cleared existing plans.');
    }

    // 2. Insert new plans
    for (const plan of PLANS) {
        // Map to DB columns
        const dbPlan = {
            key: plan.key,
            name: plan.name,
            price: plan.price,
            period: plan.period,
            description: plan.description,
            features: plan.features,
            is_popular: plan.is_popular,
            highlight: plan.highlight,
            savings: plan.savings,
            display_order: plan.display_order,
            is_active: plan.is_active,
            // We define this extra field JSONB or text? 
            // plansService says: ctaText isn't mapped explicitly! 
            // Wait, plansService.ts doesn't map ctaText to DB!
            // I need to check if schema has cta_text or similar.
            // If not, maybe put it in features or description? 
            // Or just assume the frontend calculates it from key.
            // But I wanted ctaText.
            // Let's assume schema might NOT have cta_text.
            // I will skip ctaText insert for now and rely on frontend hardcoded map if needed, 
            // OR I will check if I can add it.
            // Actually, PlanCard logic used `plan.ctaText`. 
            // If DB doesn't support it, it will be undefined.
            // I'll try to insert it as a property if "features" allows metadata? 
            // No, features is string[].
            // I'll skip ctaText in DB insert for now to avoid errors, 
            // and I will update PlanCard.tsx to deduce CTA from 'key', 
            // OR rely on plans.ts (static) if DB fails? No DB suppresses static.

            // Re-strategy: Update PlanCard to use key map for CTA.
        };

        const { error } = await supabase.from('plans').insert(dbPlan);
        if (error) {
            console.error(`Error inserting plan ${plan.name}:`, error);
        } else {
            console.log(`Inserted plan: ${plan.name}`);
        }
    }

    console.log('Plans update complete.');
}

updatePlans();
