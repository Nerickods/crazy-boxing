import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'
import { syncSessions } from '@/features/analytics/lib/syncSessions'

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
})

// Auto-classify sessions
export async function POST() {
    const supabase = await createClient()

    // 1. Auto-Sync sessions before classifying
    // This ensures we are working with the latest data
    await syncSessions(supabase)

    // 2. Get unclassified sessions (limit 10 for batch processing)
    const { data: sessions, error } = await supabase
        .from('conversation_sessions')
        .select('*')
        .is('classification', null)
        .order('last_message_at', { ascending: false }) // Prioritize recent active sessions
        .limit(5)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!sessions || sessions.length === 0) {
        return NextResponse.json({
            message: 'No pending sessions to classify',
            sessionsClassified: 0
        })
    }

    // 3. Get agent configuration regarding topics
    const { data: agent } = await supabase
        .from('agents')
        .select('classification_topics, model_id')
        .eq('is_active', true)
        .single()

    const topics = agent?.classification_topics || ['MMA', 'Entrenamiento', 'Precios', 'Ubicación', 'Horarios']
    const modelId = agent?.model_id || 'google/gemini-2.0-flash-001'

    let classifiedCount = 0

    // 4. Process each session
    for (const session of sessions) {
        if (!session.transcript) continue

        try {
            const { text } = await generateText({
                model: openrouter(modelId),
                prompt: `Analiza la siguiente transcripción de chat entre un usuario y un asistente de gym MMA.
Responde SOLAMENTE con un objeto JSON válido (sin markdown, sin explicaciones).

JSON Schema:
{
  "topics": string[], // Array de temas detectados (de la lista permitida)
  "intent": "info" | "pricing" | "schedule" | "booking" | "other",
  "quality": "high" | "medium" | "low" | "spam",
  "summary": string, // Resumen de 1 linea
  "flags": {
    "frustration_detected": boolean, // Si el usuario parece enojado
    "escalation_needed": boolean, // Si pide hablar con humano
    "bug_reported": boolean, // Si reporta error técnico
    "resolved": boolean // Si la duda parece resuelta
  }
}

Lista de Topics Permitidos: ${JSON.stringify(topics)}

TRANSCRIPCIÓN:
${session.transcript}`,
            })

            // Parse result
            const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
            const classification = JSON.parse(cleanedText)

            // Update database
            await supabase
                .from('conversation_sessions')
                .update({
                    classification,
                    classified_at: new Date().toISOString(),
                    classified_by_model: modelId,
                })
                .eq('id', session.id)

            classifiedCount++

        } catch (err) {
            console.error(`Failed to classify session ${session.conversation_id}:`, err)
            // Optionally mark error in DB to avoid retry loop
        }
    }

    return NextResponse.json({
        message: 'Classification complete',
        sessionsClassified: classifiedCount,
        totalPending: sessions.length // Helps frontend know if it should call again
    })
}
