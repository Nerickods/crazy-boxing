import { openAiService } from '@/logic/openAiservice'
import { createClient } from '@/shared/lib/supabase/server'
import { cookies, headers } from 'next/headers'
import { syncSessions } from '@/features/analytics/lib/syncSessions'
import { rateLimit, CHAT_RATE_LIMIT } from '@/shared/lib/rate-limit'
import { NextResponse } from 'next/server'

// Set maximum duration to 60 seconds for Vercel (Hobby plan limit is 10s usually, but this helps on Pro)
export const maxDuration = 60;

// Generate or get visitor ID from cookie
async function getVisitorId(requestVisitorId?: string): Promise<string> {
    const cookieStore = await cookies()
    let visitorId = requestVisitorId || cookieStore.get('visitor_id')?.value

    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(7)}`
    }

    return visitorId
}

export async function POST(req: Request) {
    // Rate limiting by IP
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous'
    const rateLimitResult = rateLimit(ip, CHAT_RATE_LIMIT)

    if (!rateLimitResult.success) {
        return NextResponse.json(
            { error: 'Too many requests. Please wait a moment before sending another message.' },
            {
                status: 429,
                headers: {
                    'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
                    'X-RateLimit-Remaining': '0',
                },
            }
        )
    }

    const { messages, conversationId: requestConversationId, visitorId: requestVisitorId } = await req.json()
    const visitorId = await getVisitorId(requestVisitorId)

    const supabase = await createClient()

    // 1. Get Agent Configuration (System Prompt)
    const { data: agent } = await supabase
        .from('agents')
        .select('id, system_prompt, model_id, temperature, max_tokens')
        .eq('is_active', true)
        .single()

    // 2. Prepare System Prompt with Dynamic Dates
    let systemPrompt = agent?.system_prompt || 'Eres un asistente útil.'
    const todayFull = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const todayISO = new Date().toISOString().split('T')[0]

    systemPrompt = systemPrompt
        .replace('{{TODAY_FULL}}', todayFull)
        .replace('{{TODAY_ISO}}', todayISO)

    // 3. Manage Conversation ID
    let currentConversationId = requestConversationId

    if (requestConversationId) {
        // Verify conversation exists
        const { data: existingConv } = await supabase
            .from('conversations')
            .select('id')
            .eq('id', requestConversationId)
            .single()

        if (existingConv) {
            currentConversationId = existingConv.id
        } else {
            currentConversationId = null
        }
    }

    // Create new conversation only if we don't have one
    if (!currentConversationId) {
        const { data: newConv, error: convError } = await supabase
            .from('conversations')
            .insert({
                visitor_id: visitorId,
                agent_id: agent?.id,
                visitor_metadata: { userAgent: req.headers.get('user-agent') }
            })
            .select('id')
            .single()

        if (!convError && newConv) {
            currentConversationId = newConv.id
        }
    }

    // 4. Save User Message
    const lastUserMessage = messages[messages.length - 1]
    if (currentConversationId && lastUserMessage?.role === 'user') {
        const contentStr = typeof lastUserMessage.content === 'string'
            ? lastUserMessage.content
            : JSON.stringify(lastUserMessage.content)

        await supabase
            .from('messages')
            .insert({
                conversation_id: currentConversationId,
                role: 'user',
                content: contentStr,
            })
    }

    // 5. Execute Sentinel Logic (Blocking Loop)
    let newMessages: Array<{ role: string; content: string }> = []
    try {
        newMessages = await openAiService.processChat(messages, systemPrompt, agent?.model_id)
    } catch (error) {
        console.error('Sentinel Error (Critical):', error)
        // Return a JSON error that the frontend can parse and display gracefully
        return NextResponse.json(
            { error: 'El asistente está tomando un descanso. Por favor intenta de nuevo en unos segundos.' },
            { status: 500 }
        )
    }

    // 6. Persist Generated Messages (Assistant & Tools)
    if (currentConversationId && newMessages.length > 0) {
        for (const msg of newMessages) {
            // Only save assistant messages for now to keep history clean/readable
            // Tools are internal to the Sentinel Loop
            if (msg.role === 'assistant' && msg.content) {
                await supabase
                    .from('messages')
                    .insert({
                        conversation_id: currentConversationId,
                        role: 'assistant',
                        content: msg.content,
                    })
            }
        }

        // Update conversation time
        await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', currentConversationId)

        // Sync sessions
        await syncSessions(supabase)
    }

    // 7. Extract Final Response
    const finalMessage = newMessages[newMessages.length - 1]
    const responseText = finalMessage?.content || ""

    // 8. Return Response (Not Streaming)
    const response = new Response(responseText, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Set-Cookie': `visitor_id=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax; Secure; HttpOnly`,
            'X-Conversation-Id': currentConversationId || ''
        }
    })

    return response
}
