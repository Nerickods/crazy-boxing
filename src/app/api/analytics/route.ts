import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { syncSessions } from '@/features/analytics/lib/syncSessions'

export const dynamic = 'force-dynamic'

export async function GET() {
    const supabase = await createClient()

    // Sync sessions to ensure freshness
    await syncSessions(supabase)

    // Get all conversation sessions
    const { data: allSessions, error } = await supabase
        .from('conversation_sessions')
        .select('*')
        .order('first_message_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Filter out sessions that have been marked as read in the dashboard
    // We assume 'read' flag in classification.flags means admin processed it enough to hide the alert
    const sessions = allSessions?.filter(s => !s.classification?.flags?.read) || []

    if (!sessions || sessions.length === 0) {
        return NextResponse.json({
            overview: {
                totalSessions: 0,
                totalMessages: 0,
                classifiedCount: 0,
                unclassifiedCount: 0,
                resolutionRate: 0,
            },
            alerts: {
                frustrationCount: 0,
                escalationNeeded: 0,
                bugsReported: 0,
            },
            qualityDistribution: {
                high: 0,
                medium: 0,
                low: 0,
                spam: 0,
            },
            topTopics: [],
            painPoints: [],
            contentGaps: [],
            interventionQueue: [],
        })
    }

    // Calculate metrics
    const totalSessions = sessions.length
    const totalMessages = sessions.reduce((acc, s) => acc + (s.message_count || 0), 0)

    const classifiedSessions = sessions.filter(s => s.classification !== null)
    const classifiedCount = classifiedSessions.length
    const unclassifiedCount = totalSessions - classifiedCount

    // Resolution Rate
    const resolvedCount = classifiedSessions.filter(s => s.classification?.flags?.resolved).length
    const resolutionRate = classifiedCount > 0
        ? Math.round((resolvedCount / classifiedCount) * 100)
        : 0

    // Alerts logic
    const frustrationCount = classifiedSessions.filter(s => s.classification?.flags?.frustration_detected).length
    const escalationNeeded = classifiedSessions.filter(s => s.classification?.flags?.escalation_needed).length
    const bugsReported = classifiedSessions.filter(s => s.classification?.flags?.bug_reported).length

    // Topic aggregation
    const topicCounts: Record<string, number> = {}
    classifiedSessions.forEach(s => {
        const topics = s.classification?.topics || []
        topics.forEach((t: string) => {
            topicCounts[t] = (topicCounts[t] || 0) + 1
        })
    })

    const topTopics = Object.entries(topicCounts)
        .map(([topic, count]) => ({
            topic,
            count,
            percentage: Math.round((count / classifiedCount) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    // Quality distribution
    const qualityDistribution = {
        high: classifiedSessions.filter(s => s.classification?.quality === 'high').length,
        medium: classifiedSessions.filter(s => s.classification?.quality === 'medium').length,
        low: classifiedSessions.filter(s => s.classification?.quality === 'low').length,
        spam: classifiedSessions.filter(s => s.classification?.quality === 'spam').length,
    }

    // Pain points calculation
    const painPoints = topTopics.map(({ topic }) => {
        const topicSessions = classifiedSessions.filter(
            s => s.classification?.topics?.includes(topic)
        )
        const frustrationRate = Math.round(
            (topicSessions.filter(s => s.classification?.flags?.frustration_detected).length /
                topicSessions.length) * 100
        ) || 0
        const unresolvedRate = Math.round(
            (topicSessions.filter(s => !s.classification?.flags?.resolved).length /
                topicSessions.length) * 100
        ) || 0
        const highQualityRate = Math.round(
            (topicSessions.filter(s => s.classification?.quality === 'high').length /
                topicSessions.length) * 100
        ) || 0
        const avgMessagesPerSession = Math.round(
            topicSessions.reduce((acc, s) => acc + (s.message_count || 0), 0) /
            (topicSessions.length || 1)
        )

        return {
            topic,
            sessionCount: topicSessions.length,
            frustrationRate,
            unresolvedRate,
            highQualityRate,
            avgMessagesPerSession,
        }
    })

    // Content Gaps calculation
    const contentGaps = painPoints.map(pp => {
        const resolutionRate = 100 - pp.unresolvedRate
        // Gap score: High frustration + Low resolution = High Gap
        const gapScore = Math.round((pp.sessionCount * pp.frustrationRate) / (resolutionRate || 1))

        let recommendation: 'urgent' | 'recommended' | 'monitor' | 'ok'
        if (gapScore >= 50) recommendation = 'urgent'
        else if (gapScore >= 20) recommendation = 'recommended'
        else if (gapScore >= 10) recommendation = 'monitor'
        else recommendation = 'ok'

        return {
            topic: pp.topic,
            sessionCount: pp.sessionCount,
            frustrationRate: pp.frustrationRate,
            resolutionRate,
            gapScore,
            recommendation,
        }
    }).sort((a, b) => b.gapScore - a.gapScore)

    // Intervention Queue (Priority items)
    const interventionQueue = classifiedSessions
        .filter(s =>
            s.classification?.flags?.escalation_needed ||
            s.classification?.flags?.frustration_detected ||
            s.classification?.quality === 'low'
        )
        .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
        .slice(0, 5)
        .map(s => {
            let severity: 'critical' | 'high' | 'medium' = 'medium'
            if (s.classification?.flags?.escalation_needed) severity = 'critical'
            else if (s.classification?.flags?.frustration_detected) severity = 'high'

            const hoursAgo = Math.round(
                (Date.now() - new Date(s.last_message_at).getTime()) / (1000 * 60 * 60)
            )

            return {
                id: s.id,
                summary: s.classification?.summary || 'Sin resumen',
                severity,
                flags: {
                    frustration: s.classification?.flags?.frustration_detected,
                    escalation: s.classification?.flags?.escalation_needed,
                    bug: s.classification?.flags?.bug_reported
                },
                hoursAgo
            }
        })

    // Get new enrollments count
    const { count: newEnrollments } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

    return NextResponse.json({
        overview: {
            totalSessions,
            totalMessages,
            classifiedCount,
            unclassifiedCount,
            resolutionRate,
            newEnrollments: newEnrollments || 0,
        },
        alerts: {
            frustrationCount,
            escalationNeeded,
            bugsReported,
        },
        qualityDistribution,
        topTopics,
        painPoints,
        contentGaps,
        interventionQueue,
    })
}
