import OpenAI from 'openai';
import { createAdminClient } from '@/shared/lib/supabase/admin';

/**
 * OpenRouter Configuration (OpenAI-compatible API)
 * KIA Intelligence - Elite AI Ecosystem
 */
const getOpenAIClient = () => {
    return new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "KIA Intelligence Assistant",
        },
        dangerouslyAllowBrowser: true
    });
};

const DEFAULT_MODEL = 'openai/gpt-4o';

const getSystemPrompt = () => `
# ROLE
You are the **Lead Strategist Assistant** at **KIA Intelligence**. 
Your mission is to identify high-potential businesses and qualify them for our **Elite AI Ecosystems**.

# BRAND IDENTITY: KIA INTELLIGENCE
- **The "Invisible Stack"**: We build software that feels like magic. Fast, minimal, and hyper-efficient. The traditional software era is dead; long live invisible infrastructure.
- **Core Pillars**: Identidad (Knowing who you are under pressure), Resiliencia (Handling data at scale), and Fe (Believing in the automated future).
- **Voice**: Premium, direct, technical but accessible, visionary. We don't sell "chatbots", we sell "Revenue Engines" and "Neural Infrastructure".

# CONVERSION GOAL
Your primary objective is to capture the user's data to schedule a **Private Demo**.
You must collect:
1. **Full Name**
2. **Work Email**
3. **Company Name**
4. **Team Size (1-10, 11-50, 51-200, 200+)**

# VOICE & TONE
- **Elite**: You speak like a partner, not a subordinate.
- **Concise**: 1-3 sentences max.
- **Technical Excellence**: Use terms like "Neural layers", "Automated pipelines", "Predictive revenue", but only to add flavor.
- **Spanish**: Respond ALWAYS in Spanish (Mexico/LatAm).

# KNOWLEDGE BASE
- **Pricing & Maintenance**: Custom projects. High-value investment infrastructure with minimal maintenance (**< $1 USD/month**). 
- **Roadmap de Precios**: Dado que soy una sola persona construyendo estos sistemas enteros, si no entras ahora, es muy probable que suba los precios el próximo mes por la experiencia acumulada.
- **Autoría (Solo Developer)**: El sistema es un proyecto de autor. Cada arquitectura es diseñada y ejecutada íntegramente por **Nerick Segoviano**. No hay agencias ni intermediarios, lo que garantiza calidad de élite pero limita la disponibilidad.
- **Protección de Oferta**: Al agendar tu auditoría técnica **ahora mismo**, se te **respetará y protegerá la oferta actual** del sistema y la modalidad de entrega, independientemente de si la oferta cambia en el futuro.
- **Delivery**: We build the entire ecosystem in a **15-day sprint** (Audit, Mutation, Control).
- **Exclusivity**: We only accept **2 new projects per month**. Es un límite técnico innegociable para asegurar la excelencia que solo Nerick entrega.
- **Guarantee**: "Riesgo Cero". Full refund if they cannot manage the system autonomously after training.

# TOOLS PROTOCOL
1. **Qualify First**: Chat with the user about their business bottlenecks.
2. **Offer the Demo & Price Protection**: Once interest is high, emphasize that registering now protects them from future price increases and locks in the current "No-Agency" offer.
3. **Registration**: Use \`register_lead\` when you have Name, Email, and Company.

# CONCISE RESPONSE EXAMPLES
- **User**: "¿Qué hacen?"
- **You**: "Construimos **Motores de Ingresos** mediante IA. Automatizamos tu operación para que dejes de ser un espectador y tomes el control de tu escalabilidad. ¿Te gustaría ver cómo lo haríamos con tu empresa?"
- **User**: "¿Precios?"
- **You**: "Cada arquitectura es única. El mantenimiento es **< $1 USD al mes**. Nota: Como soy una sola persona construyendo estos sistemas, si no entras ahora es probable que suba los precios el próximo mes por la experiencia acumulada. Si agendamos tu auditoría **ahora mismo**, te respeto y protejo la oferta actual. ¿Agenda una demo?"
- **User**: "¿Quién lo programa?"
- **You**: "Es un proyecto de autor. Mi fundador, **Nerick Segoviano**, lidera y ejecuta cada arquitectura personalmente. Por eso solo aceptamos 2 socios al mes; preferimos la perfección artesanal al volumen. ¿Te gustaría asegurar uno de los últimos cupos con el precio actual?"
`;

const TOOLS = [
    {
        type: 'function',
        function: {
            name: 'register_lead',
            description: 'Registers a qualified lead for a private demo.',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Full name' },
                    email: { type: 'string', description: 'Work email' },
                    company: { type: 'string', description: 'Company name' },
                    employee_size: { type: 'string', enum: ['1-10', '11-50', '51-200', '200+'], description: 'Company size' }
                },
                required: ['name', 'email', 'company']
            }
        }
    }
];

export const openAiService = {
    async processChat(messages: any[]): Promise<any[]> {
        try {
            const allMessagesToPersist: any[] = [];
            const systemPrompt = getSystemPrompt();
            const currentMessages: any[] = [
                { role: 'system', content: systemPrompt },
                ...messages
            ];

            const openai = getOpenAIClient();
            let response = await openai.chat.completions.create({
                model: DEFAULT_MODEL,
                messages: currentMessages as any,
                tools: TOOLS as any,
                tool_choice: 'auto',
            });

            let responseMessage = response.choices[0].message;
            allMessagesToPersist.push(responseMessage);

            // Recursive tool call processing
            while (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
                const toolMessages: any[] = [];
                
                for (const toolCall of responseMessage.tool_calls) {
                    if (toolCall.type !== 'function') continue;
                    
                    const functionArgs = JSON.parse(toolCall.function.arguments);
                    
                    if (toolCall.function.name === 'register_lead') {
                        const admin = await createAdminClient();
                        const { data, error } = await admin
                            .from('enrollments')
                            .insert([{
                                name: functionArgs.name,
                                email: functionArgs.email,
                                company: functionArgs.company,
                                employee_size: functionArgs.employee_size || '1-10',
                                source: 'chat_widget'
                            }])
                            .select();

                        const toolResult = error ? { error: error.message } : { success: true, lead_id: data?.[0]?.id };
                        
                        const toolMsg = {
                            tool_call_id: toolCall.id,
                            role: 'tool',
                            name: toolCall.function.name,
                            content: JSON.stringify(toolResult),
                        } as any;
                        
                        allMessagesToPersist.push(toolMsg);
                        toolMessages.push(toolMsg);
                    }
                }

                // Add assistant + tool messages to history for the NEXT completion
                currentMessages.push(responseMessage);
                currentMessages.push(...toolMessages);

                // Re-call OpenAI with the new context
                response = await openai.chat.completions.create({
                    model: DEFAULT_MODEL,
                    messages: currentMessages as any,
                });

                responseMessage = response.choices[0].message;
                allMessagesToPersist.push(responseMessage);
                
                // Break if the new response also doesn't trigger more tool calls
                if (!responseMessage.tool_calls) break;
            }

            return allMessagesToPersist;
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    }
};
