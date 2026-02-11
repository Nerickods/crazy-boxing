import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    const { data: agent, error } = await supabase
        .from('agents')
        .select('*')
        .eq('is_active', true)
        .single()

    if (error || !agent) {
        // Return a default agent if none exists
        return NextResponse.json({
            id: null,
            name: 'Crazy Assistant',
            description: 'Asistente de MMA Academy',
            system_prompt: 'Eres Crazy Assistant, el asistente virtual de MMA Academy. Ayuda a los visitantes con información sobre clases, horarios y programas de entrenamiento.',
            model_id: 'google/gemini-2.0-flash-001',
            temperature: 0.7,
            max_tokens: 500,
            classification_topics: ['general', 'clases', 'horarios', 'precios', 'inscripción'],
            is_active: true,
        })
    }

    return NextResponse.json(agent)
}

export async function PUT(request: NextRequest) {
    const supabase = await createClient()
    const body = await request.json()

    // Check if an agent exists
    const { data: existingAgent } = await supabase
        .from('agents')
        .select('id')
        .eq('is_active', true)
        .single()

    if (existingAgent) {
        // Update existing agent
        const { error } = await supabase
            .from('agents')
            .update({
                name: body.name,
                description: body.description,
                system_prompt: body.system_prompt,
                model_id: body.model_id,
                temperature: body.temperature,
                max_tokens: body.max_tokens,
                classification_topics: body.classification_topics,
            })
            .eq('id', existingAgent.id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
    } else {
        // Create new agent
        const { error } = await supabase
            .from('agents')
            .insert({
                name: body.name,
                description: body.description,
                system_prompt: body.system_prompt,
                model_id: body.model_id,
                temperature: body.temperature,
                max_tokens: body.max_tokens,
                classification_topics: body.classification_topics,
                is_active: true,
            })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
    }

    return NextResponse.json({ success: true })
}

export async function POST(request: NextRequest) {
    return PUT(request)
}
