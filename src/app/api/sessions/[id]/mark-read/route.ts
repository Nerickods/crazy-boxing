import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = await createClient()
    const { id } = await params

    // Parse body for resolver name
    let resolvedBy = ''
    try {
        const body = await request.json()
        resolvedBy = body.resolvedBy
    } catch (e) {
        // Body might be empty if called without one, handles fallback
    }

    try {
        // 1. Fetch current classification
        const { data: session, error: fetchError } = await supabase
            .from('conversation_sessions')
            .select('classification')
            .eq('id', id)
            .single()

        if (fetchError) throw fetchError

        // 2. Update flags
        const currentClassification = session?.classification || {}
        const currentFlags = currentClassification.flags || {}

        const newClassification = {
            ...currentClassification,
            flags: {
                ...currentFlags,
                read: true,
                resolved: true, // Assuming mark as read implies resolution for "pending" tracking
                resolved_by: resolvedBy || 'Admin'
            }
        }

        // 3. Save update
        const { error: updateError } = await supabase
            .from('conversation_sessions')
            .update({
                classification: newClassification,
                // Optionally update a specific 'status' column if one existed, but we rely on flags here
            })
            .eq('id', id)

        if (updateError) throw updateError

        return NextResponse.json({ success: true, message: 'Session marked as read' })

    } catch (error: any) {
        console.error('Error marking session as read:', error)
        return NextResponse.json(
            { error: 'Failed to update session' },
            { status: 500 }
        )
    }
}
