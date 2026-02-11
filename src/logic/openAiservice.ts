import OpenAI from 'openai';
import { enrollmentService } from '../features/enrollment/services/enrollmentServerService';
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
// System Prompt is now injected from Database (Admin Panel Control)
// See: src/app/api/chat/route.ts


const TOOLS: ChatCompletionTool[] = [
    {
        type: 'function',
        function: {
            name: 'register_enrollment',
            description: 'Registers a user for a visit. Requires Name, Email, and EXACT DATE calculated from user input.',
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
    async processChat(messages: any[], systemPrompt: string): Promise<any[]> {
        try {
            const allMessagesToPersist: any[] = [];

            // Use the injected system prompt (controlled by Admin)
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