'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StatCard } from './components/StatCard'
import { QualityBadge, SeverityBadge } from './components/Badges'
import NewRegistrations from '@/features/dashboard/components/NewRegistrations'

interface Analytics {
    overview: {
        totalSessions: number
        totalMessages: number
        classifiedCount: number
        unclassifiedCount: number
        resolutionRate: number
        newEnrollments?: number
    }
    alerts: {
        frustrationCount: number
        escalationNeeded: number
        bugsReported: number
    }
    qualityDistribution: {
        high: number
        medium: number
        low: number
        spam: number
    }
    topTopics: Array<{ topic: string; count: number; percentage: number }>
    interventionQueue: Array<{
        id: string
        summary: string
        severity: 'critical' | 'high' | 'medium'
        flags: { frustration: boolean; escalation: boolean; bug: boolean }
        hoursAgo: number
    }>
}

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    const [loading, setLoading] = useState(true)
    const [classifying, setClassifying] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchAnalytics()
    }, [])

    async function fetchAnalytics() {
        try {
            const res = await fetch('/api/analytics')
            if (res.ok) {
                const data = await res.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    async function runClassification() {
        setClassifying(true)
        try {
            const res = await fetch('/api/classify', { method: 'POST' })
            const data = await res.json()
            alert(`Clasificación completada: ${data.sessionsClassified} sesiones clasificadas`)
            fetchAnalytics()
        } catch (error) {
            console.error('Classification failed:', error)
            alert('Error al clasificar')
        } finally {
            setClassifying(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-black/5 dark:border-white/10" />
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-black/40 dark:text-white/40 animate-pulse">Cargando Crazy Assistant...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-500">
            {/* Header - Compact on mobile */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-cyan-700 dark:text-white tracking-tight mb-1 md:mb-2">
                        Panel de Control
                    </h1>
                    <p className="text-sm md:text-base text-blue-950/80 dark:text-white/50 font-medium">
                        Visión global del rendimiento del agente
                    </p>
                </div>

                <div className="flex gap-2 md:gap-4">
                    <button
                        onClick={runClassification}
                        disabled={classifying}
                        className="
                            relative overflow-hidden group flex-1 md:flex-none
                            px-4 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl
                            bg-black text-white dark:bg-white dark:text-black
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-300 hover:scale-105 active:scale-95
                            shadow-xl shadow-black/10 dark:shadow-white/10
                        "
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity" />
                        <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3 font-semibold text-xs md:text-sm">
                            {classifying ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span className="hidden md:inline">Procesando Neural...</span>
                                    <span className="md:hidden">Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500 dark:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                    <span className="hidden md:inline">Analizar Conversaciones</span>
                                    <span className="md:hidden">Analizar</span>
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Smart Alerts: New Registrations */}
            {analytics?.overview.newEnrollments ? (
                <NewRegistrations count={analytics.overview.newEnrollments} />
            ) : null}

            {/* KPI Grid - 2 columns on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <StatCard
                    label="Sesiones Totales"
                    value={analytics?.overview.totalSessions || 0}
                    icon="chat"
                    href="/admin/conversations"
                />
                <StatCard
                    label="Mensajes Procesados"
                    value={analytics?.overview.totalMessages || 0}
                    icon="message"
                    href="/admin/conversations"
                />
                <StatCard
                    label="Tasa de Resolución"
                    value={`${analytics?.overview.resolutionRate || 0}%`}
                    icon="check"
                    color={
                        (analytics?.overview.resolutionRate || 0) >= 80 ? 'green' :
                            (analytics?.overview.resolutionRate || 0) >= 50 ? 'yellow' : 'red'
                    }
                    href="#"
                />
                <StatCard
                    label="Pendientes"
                    value={analytics?.overview.unclassifiedCount || 0}
                    icon="pending"
                    color={(analytics?.overview.unclassifiedCount || 0) > 0 ? 'yellow' : 'green'}
                    href="/admin/conversations?status=unclassified"
                />
            </div>

            {/* Smart Alerts */}
            {((analytics?.alerts.escalationNeeded || 0) > 0 || (analytics?.alerts.frustrationCount || 0) > 0 || (analytics?.alerts.bugsReported || 0) > 0) && (
                <div className="p-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-blue-500/20 animate-pulse-slow">
                    <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-xl p-4 flex items-center justify-between border border-indigo-500/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-indigo-600 dark:text-indigo-400">Atención Requerida</h3>
                                <p className="text-xs text-black/60 dark:text-white/60">Se han detectado eventos críticos en las últimas 24 horas</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            {(analytics?.alerts.escalationNeeded || 0) > 0 && (
                                <Link href="/admin/conversations?urgency=critical" className="px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors">
                                    {analytics?.alerts.escalationNeeded} Escalaciones
                                </Link>
                            )}
                            {(analytics?.alerts.frustrationCount || 0) > 0 && (
                                <Link href="/admin/conversations?urgency=high" className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors">
                                    {analytics?.alerts.frustrationCount} Frustraciones
                                </Link>
                            )}
                            <button
                                onClick={async () => {
                                    if (confirm('¿Marcar todas las alertas actuales como leídas?')) {
                                        try {
                                            await fetch('/api/alerts/mark-read', { method: 'POST' });
                                            fetchAnalytics();
                                        } catch (e) { console.error(e); }
                                    }
                                }}
                                className="ml-2 p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-black/40 dark:text-white/40 hover:text-indigo-500"
                                title="Marcar todo como leído"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                {/* Intervention Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-cyan-800 dark:text-white flex items-center gap-3">
                        <span className="w-1 h-6 bg-indigo-600 rounded-full" />
                        Cola de Intervención
                    </h3>

                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 overflow-hidden shadow-lg shadow-cyan-500/5">
                        {analytics?.interventionQueue.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h4 className="text-lg font-bold text-blue-900 dark:text-white">Todo despejado</h4>
                                <p className="text-blue-950/70 dark:text-white/50 text-sm">No hay intervenciones pendientes en este momento.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/20 dark:divide-white/5">
                                {analytics?.interventionQueue.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/admin/conversations?id=${item.id}`}
                                        className="flex items-center justify-between p-6 hover:bg-white/60 dark:hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <SeverityBadge severity={item.severity} />
                                            <div>
                                                <p className="font-medium text-blue-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {item.summary}
                                                </p>
                                                <p className="text-xs text-blue-900/50 dark:text-white/50 mt-1">
                                                    Hace {item.hoursAgo} horas
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.flags.frustration && <span className="w-2 h-2 rounded-full bg-cyan-500" title="Frustration" />}
                                            {item.flags.escalation && <span className="w-2 h-2 rounded-full bg-indigo-500" title="Escalation" />}
                                            {item.flags.bug && <span className="w-2 h-2 rounded-full bg-sky-500" title="Bug" />}
                                            <svg className="w-5 h-5 text-blue-900/20 dark:text-white/20 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Topics & Quality */}
                <div className="space-y-8">
                    {/* Quality */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-lg">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-black/40 dark:text-white/40 mb-4 bg-gradient-to-r from-transparent to-transparent">Calidad de Conversación</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <QualityBadge label="Alta" count={analytics?.qualityDistribution.high || 0} color="green" />
                            <QualityBadge label="Media" count={analytics?.qualityDistribution.medium || 0} color="yellow" />
                            <QualityBadge label="Baja" count={analytics?.qualityDistribution.low || 0} color="orange" />
                            <QualityBadge label="Spam" count={analytics?.qualityDistribution.spam || 0} color="red" />
                        </div>
                    </div>

                    {/* Topics */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-black/5 dark:border-white/10 p-6 shadow-lg">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900/70 dark:text-white/40 mb-4">Top Topics</h3>
                        <div className="space-y-4">
                            {analytics?.topTopics.length === 0 ? (
                                <p className="text-sm text-black/40 dark:text-white/40 italic">No hay datos suficientes</p>
                            ) : (
                                analytics?.topTopics.map((topic, i) => (
                                    <div key={topic.topic} className="group cursor-default">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-blue-950/90 dark:text-white/70 group-hover:text-cyan-700 dark:group-hover:text-blue-400 transition-colors">
                                                {topic.topic}
                                            </span>
                                            <span className="font-mono text-blue-900/50 dark:text-white/30">{topic.count}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${topic.percentage}%`, transitionDelay: `${i * 100}ms` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
