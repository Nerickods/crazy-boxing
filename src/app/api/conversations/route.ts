import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { syncSessions } from '@/features/analytics/lib/syncSessions'

export async function GET(request: NextRequest) {
    const supabase = await createClient()

    // Sync sessions before fetching to ensure the admin sees latest data
    await syncSessions(supabase)

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Filters
    const status = searchParams.get('status')
    const topic = searchParams.get('topic')
    const urgency = searchParams.get('urgency')

    // Start query
    let query = supabase
        .from('conversation_sessions')
        .select(`
            *,
            conversation:conversations(visitor_id)
        `, { count: 'exact' })

    // Apply Filters
    if (status === 'classified') {
        query = query.not('classification', 'is', null)
    } else if (status === 'unclassified') {
        query = query.is('classification', null)
    }

    if (topic) {
        // Search inside JSONB array
        query = query.contains('classification', { topics: [topic] })
    }

    if (urgency === 'critical') {
        query = query.contains('classification', { flags: { escalation_needed: true } })
    } else if (urgency === 'high') {
        query = query.contains('classification', { flags: { frustration_detected: true } })
    }

    // Execute query with pagination
    const { data: sessions, count, error } = await query
        .order('last_message_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
        sessions,
        pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
        },
    })
}
