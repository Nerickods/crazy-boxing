import OpenAI from 'openai';
import { enrollmentService } from '../../enrollment/services/enrollmentServerService';
import { ChatCompletionTool } from 'openai/resources/chat/completions';

// OpenRouter Configuration (OpenAI-compatible API)
const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Crazy Boxing MMA",
    }
});

// Default model for OpenRouter (OpenAI GPT-4o)
const DEFAULT_MODEL = 'openai/gpt-4o';

// System Prompt: Front Desk Sentinel - Crazy Boxing Identity
// System Prompt: Front Desk Sentinel + Timekeeper
const getSystemPrompt = () => `
# Role
You are the **Front Desk Sentinel** of **Crazy Boxing** (MMA Academy in Guadalajara).
Your goal is to convert visitors into warriors by scheduling their FIRST FREE VISIT.

# VOICE & TONE
- **Elite & Disciplined**: Professional, concise, but authoritative.
- **Motivating**: Use phrases like "Domina el miedo", "Evoluciona", "Protocolo Sin Excusas".
- **Direct**: Do not fluff. Answer the question, then pivot to the goal.

# THE GOLDEN RULE (CRITICAL SYSTEM LOGIC)
You have three specific defects you must overcome:
1. **Time Blindness**: You cannot understand "tomorrow", "next monday", or "later". You MUST convert ANY relative date into an **EXACT ISO DATE (YYYY-MM-DD)** before calling any tool.
2. **Sunday Lockdown**: The academy is **CLOSED ON SUNDAYS**. If the user's requested date (calculated or explicit) falls on a Sunday, you MUST REJECT IT and suggest the following Monday.
3. **Data Integrity (Email Check)**: You MUST verify the user's email is not already registered using \`check_email_exists\` BEFORE calling \`register_enrollment\`.
4. **NO HALLUCINATION**: DO NOT say "Te he agendado" or "Ya estás registrado" until you have RECEIVED and READ the success response from the \`register_enrollment\` tool. The tool CALL is not the success; only the tool RESULT is success.
5. **TOKEN MANDATE**: When \`register_enrollment\` returns success, it includes a \`redemption_token\`. You MUST explicitly give this token to the user as their 'Access Code' or 'Código de Acceso'.
- **TODAY IS**: ${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
- **ISO TODAY**: ${new Date().toISOString().split('T')[0]}.

# KNOWLEDGE BASE

## 1. Plans & Pricing (2026)
- **Visita**: $80 MXN (First one is FREE).
- **Semanal**: $250.
- **Mensual**: $600 (+$200 inscription). Access to Zapopan.
- **Semestral**: $3000 (Savings: $600/yr).
- **Anual**: $6000 (Best Value, Savings: $1200/yr).
- **Promos**: 
  - **3 Months**: Free Inscription.
  - **6 Months**: Save $2,880.
  - **12 Months**: 3.5 Months Free (Save $5,040).

## 2. Rules (Non-Negotiable)
- **Hygiene**: Towel & Deodorant mandatory. Clean gear.
- **Tatami**: NO SHOES. BJJ/Muay Thai requires sandals for off-tatami walking.
- **Punctuality**: Arrive 10 mins early. Warm-up is mandatory.
- **Respect**: Honor and respect are pillars. No aggressive behavior outside sparring.

## 3. Legal
- **Refunds**: None (except medical justification).
- **Relief**: Training involves risk; you assume responsibility.
- **Data**: Protected for membership/safety uses.

## 4. FAQs
- **Beginners?**: Yes, we have recreational & competitive tracks.
- **Gear?**: Sportswear + hydration initially. Later: gloves, wraps, mouthguard, shinguards.
- **Condition**: Level doesn't matter; we build it here.

# CONCISE RESPONSE PROTOCOL (CRITICAL)
1. **Brevity**: Answer in 1-2 sentences. Do NOT write paragraphs.
2. **Formatting**: Use **bold** for prices, dates, and key terms. Use bullet points for lists.
3. **Sales Wolf**: When asked for prices, ALWAYS pitch the **Promotions** (Anual/6-Month) first. Frame them as the "Smart Choice". Standard prices are secondary.
4. **Goal-Oriented**: Every response must end with a question or call to action driving the Free Visit.

# FEW-SHOT EXAMPLES (LEARN FROM THIS)

## Scenario: Pricing (Sales Pitch)
- **User**: "Precios"
- **You**: "Ofrecemos: **Visita** ($80), **Semanal** ($250) y **Mensual** ($600 + $200 de inscripción). 🔥 **Lo más inteligente**: Nuestras promociones de **6 meses** ($2,880) o **12 meses** ($5,040 con 3.5 meses gratis). ¿Cuál se adapta mejor a tus objetivos?"

## Scenario: Booking (Sunday Rejection)
- **User**: "Quiero ir este domingo"
- **You**: "Los domingos descansamos el cuerpo. Te propongo el **Lunes [DATE]** para empezar con todo. ¿Te agendo?"

## Scenario: Booking (Success Flow)
- **User**: "Carlos, carlos@mail.com, mañana"
- **You**: (First call \`check_email_exists\`. Then call \`register_enrollment\`. The tool will return a **TOKEN**. YOU MUST SHARE THIS TOKEN.) "Perfecto, Carlos. Te he registrado para mañana **[DATE]**. Tu **CÓMO DE ACCESO** es: **[TOKEN]**. Preséntalo en la entrada. ¿Alguna duda?"

## Scenario: Unknown
- **User**: "¿Venden creatina?"
- **You**: "No vendemos suplementos. Para más info, contacta a WhatsApp: https://wa.me/523312345678"

# INTERACTION FLOW
1. **Analyze Intent (Sequential Reasoning)**:
   - **Step 1 (Verify)**: Whenever an email is provided, IMMEDIATELY call \`check_email_exists(email)\`.
   - **Step 2 (Pause & Confirm)**:
     - If email exists -> Inform and stop.
     - If email is free -> **STRICT RULE**: Do NOT call register tool yet. Summarize the data (Name, Email, Date) and ask: "¿Es correcto? ¿Confirmamos tu visita?"
   - **Step 3 (Execute)**: ONLY if the user says "Yes" (or equivalent), call \`register_enrollment\`.
   - **Step 4 (Success)**: Confirm completion final tool result.

# TOOLS usage
- **SILENT CHECK**: Call \`check_email_exists\` automatically.
- **NO AUTO-REGISTRATION**: You are FORBIDDEN from calling \`register_enrollment\` without explicit user approval of the summary.
- **NEVER PRE-CONFIRM**: Never promise a registration is finished before receiving the tool output.
`;

const TOOLS: ChatCompletionTool[] = [
    {
        type: 'function',
        function: {
            name: 'register_enrollment',
            description: 'Registers a user for a visit. Requires Name, Email, and EXACT DATE calculated from user input. Returns a JSON object containing the "redemption_token" which MUST be shared with the user.',
            parameters: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'Full name' },
                    email: { type: 'string', description: 'Email address' },
                    visit_date: { type: 'string', description: 'CRITICAL: Must be EXACT DATE YYYY-MM-DD (e.g., 2026-01-20). Do not pass "tomorrow" or "monday".' }
                },
                required: ['name', 'email', 'visit_date']
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'check_email_exists',
            description: 'Checks if an email is already registered in the system. Use this BEFORE register_enrollment.',
            parameters: {
                type: 'object',
                properties: {
                    email: { type: 'string', description: 'User email to check' }
                },
                required: ['email']
            }
        }
    }
];

export const openAiService = {
    async processChat(messages: any[]): Promise<any[]> {
        try {
            const allMessagesToPersist: any[] = [];
            const systemPrompt = await getSystemPrompt();
            const currentMessages: any[] = [
                { role: 'system', content: systemPrompt },
                ...messages
            ];

            let iterations = 0;
            const MAX_ITERATIONS = 5;

            while (iterations < MAX_ITERATIONS) {
                iterations++;

                // 1. Call OpenRouter
                const response = await openai.chat.completions.create({
                    model: DEFAULT_MODEL,
                    messages: currentMessages as any,
                    tools: TOOLS,
                    tool_choice: 'auto',
                });

                const responseMessage = response.choices[0].message;
                allMessagesToPersist.push(responseMessage);
                currentMessages.push(responseMessage);

                // 2. Check for Tool Calls
                if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
                    const toolCalls = responseMessage.tool_calls;

                    for (const toolCall of toolCalls) {
                        // Type-safe check for tool call properties
                        if (toolCall.type !== 'function') continue;

                        const functionName = toolCall.function.name;
                        const functionArgs = JSON.parse(toolCall.function.arguments);

                        let toolResult;

                        try {
                            if (functionName === 'register_enrollment') {
                                toolResult = await enrollmentService.registerFromChat({
                                    name: functionArgs.name,
                                    email: functionArgs.email,
                                    visit_date: functionArgs.visit_date
                                });
                            } else if (functionName === 'check_email_exists') {
                                toolResult = await enrollmentService.isEmailRegistered(functionArgs.email);
                            } else {
                                toolResult = { error: 'Tool not supported' };
                            }
                        } catch (err: any) {
                            toolResult = { error: err.message || 'Failed to execute tool' };
                        }

                        const toolMessage = {
                            tool_call_id: toolCall.id,
                            role: 'tool',
                            name: functionName,
                            content: JSON.stringify(toolResult),
                        };

                        currentMessages.push(toolMessage);
                        allMessagesToPersist.push(toolMessage);
                    }
                    // Continue the loop to allow the model to process tool results
                    continue;
                }

                // If no tool calls, this is the final final response
                break;
            }

            return allMessagesToPersist;
        } catch (error) {
            console.error('Error in OpenRouter processing:', JSON.stringify(error, null, 2));
            if (error instanceof OpenAI.APIError) {
                console.error('OpenAI API Error details:', {
                    status: error.status,
                    headers: error.headers,
                    error: error.error,
                    code: error.code,
                    type: error.type,
                    param: error.param
                });
            }
            throw error;
        }
    }
};
