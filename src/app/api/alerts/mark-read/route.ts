import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    try {
        // Fetch sessions that are currently flagging alerts
        // We look for sessions with any of the alert flags set
        // Note: Ideally we filter by those NOT already marked as read, but we will just append the read flag

        // Strategy: We can't easily update JSONB deeply with complex conditions in one go without a stored procedure
        // or fetching and updating. For this sprint, we will fetch relevant sessions and update them.

        const { data: sessions, error: fetchError } = await supabase
            .from('conversation_sessions')
            .select('id, classification')
            .or('classification->flags->>frustration_detected.eq.true,classification->flags->>escalation_needed.eq.true,classification->flags->>bug_reported.eq.true')

        if (fetchError) throw fetchError

        if (!sessions || sessions.length === 0) {
            return NextResponse.json({ success: true, count: 0, message: 'No alerts to mark as read' })
        }

        let updatedCount = 0
        const updates = sessions.map(session => {
            // Check if already read to avoid redundant updates (optional but good)
            if (session.classification?.flags?.read) return null;

            const newClassification = {
                ...session.classification,
                flags: {
                    ...session.classification.flags,
                    read: true
                }
            }
            updatedCount++
            return supabase
                .from('conversation_sessions')
                .update({ classification: newClassification })
                .eq('id', session.id)
        }).filter(Boolean)

        if (updates.length > 0) {
            await Promise.all(updates as any[])
        }

        return NextResponse.json({
            success: true,
            message: 'Alerts marked as read',
            count: updatedCount
        })

    } catch (error: any) {
        console.error('Error marking alerts as read:', error)
        return NextResponse.json(
            { error: 'Failed to update alerts' },
            { status: 500 }
        )
    }
}
