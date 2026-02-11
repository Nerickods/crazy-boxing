'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StatCard } from '../components/StatCard'
import { QualityBadge } from '../components/Badges'

interface Analytics {
    overview: {
        totalSessions: number
        totalMessages: number
        classifiedCount: number
        unclassifiedCount: number
        resolutionRate: number
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
    painPoints: Array<{
        topic: string
        sessionCount: number
        frustrationRate: number
        unresolvedRate: number
        highQualityRate: number
        avgMessagesPerSession: number
    }>
    contentGaps: Array<{
        topic: string
        sessionCount: number
        frustrationRate: number
        resolutionRate: number
        gapScore: number
        recommendation: 'urgent' | 'recommended' | 'monitor' | 'ok'
    }>
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null)
    const [loading, setLoading] = useState(true)
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-black/5 dark:border-white/10" />
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                </div>
            </div>
        )
    }

    if (!analytics) {
        return (
            <div className="p-8 text-black/40 dark:text-white/40 text-center">Error al cargar analíticas</div>
        )
    }

    const totalQuality =
        analytics.qualityDistribution.high +
        analytics.qualityDistribution.medium +
        analytics.qualityDistribution.low +
        analytics.qualityDistribution.spam

    return (
        <div className="p-8 animate-in fade-in zoom-in duration-500">
            <div className="mb-10 border-b border-black/5 dark:border-white/5 pb-8">
                <h1 className="text-4xl font-bold text-blue-900 dark:text-white tracking-tight mb-2">Analíticas Deep Dive</h1>
                <p className="text-blue-900/60 dark:text-white/50 text-lg">Métricas profundas del comportamiento del agente</p>
            </div>

            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                <StatCard label="Sesiones Totales" value={analytics.overview.totalSessions} icon="chat" href="/admin/conversations" />
                <StatCard label="Mensajes Totales" value={analytics.overview.totalMessages} icon="message" href="/admin/conversations" />
                <StatCard label="Clasificados" value={analytics.overview.classifiedCount} icon="check" href="/admin/conversations?status=classified" />

                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 p-6 flex flex-col justify-center relative overflow-hidden group shadow-lg shadow-cyan-500/5">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-12 -mt-12 transition-opacity group-hover:opacity-100 opacity-50" />
                    <p className="text-blue-900/40 dark:text-white/40 text-xs uppercase tracking-wider font-bold mb-2">Tasa Resolución</p>
                    <p className={`text-3xl font-bold ${analytics.overview.resolutionRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                        {analytics.overview.resolutionRate}%
                    </p>
                </div>

                <Link
                    href="/admin/conversations?status=unclassified"
                    className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/10 p-6 flex flex-col justify-center relative overflow-hidden group hover:border-blue-500/30 transition-all cursor-pointer shadow-lg shadow-cyan-500/5"
                >
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-12 -mt-12 transition-opacity group-hover:opacity-100 opacity-50" />
                    <p className="text-blue-900/40 dark:text-white/40 text-xs uppercase tracking-wider font-bold mb-2">Pendientes</p>
                    <p className={`text-3xl font-bold ${analytics.overview.unclassifiedCount > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {analytics.overview.unclassifiedCount}
                    </p>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Visual Chart - Quality Quality */}
                <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 p-8 shadow-lg shadow-cyan-500/5">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                        Distribución de Calidad
                    </h3>

                    {totalQuality === 0 ? (
                        <p className="text-blue-900/40 dark:text-white/40 text-center py-10">No hay datos suficientes</p>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="relative w-48 h-48 shrink-0">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" className="text-black/5 dark:text-white/5" strokeWidth="12" />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="12" className="text-blue-500 dark:text-indigo-500" strokeDasharray={`${(analytics.qualityDistribution.high / totalQuality) * 251} 251`} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-blue-900 dark:text-white">{totalQuality}</span>
                                    <span className="text-xs uppercase tracking-widest text-blue-900/40 dark:text-white/40 font-bold">Sesiones</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <QualityBadge label="Alta" count={analytics.qualityDistribution.high} color="green" />
                                <QualityBadge label="Media" count={analytics.qualityDistribution.medium} color="yellow" />
                                <QualityBadge label="Baja" count={analytics.qualityDistribution.low} color="orange" />
                                <QualityBadge label="Spam" count={analytics.qualityDistribution.spam} color="red" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Topics Progress */}
                <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/10 p-8 shadow-lg shadow-cyan-500/5">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-8 flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                        Trending Topics
                    </h3>

                    {analytics.topTopics.length === 0 ? (
                        <p className="text-blue-900/40 dark:text-white/40 text-center py-10">No hay datos suficientes</p>
                    ) : (
                        <div className="space-y-6">
                            {analytics.topTopics.slice(0, 5).map((topic, i) => (
                                <Link
                                    key={topic.topic}
                                    href={`/admin/conversations?topic=${encodeURIComponent(topic.topic)}`}
                                    className="block group cursor-pointer"
                                >
                                    <div className="flex justify-between text-sm mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                                        <span className="text-blue-900/80 dark:text-white/80">{topic.topic}</span>
                                        <span className="text-blue-900/40 dark:text-white/40 font-mono">{topic.count} ({topic.percentage}%)</span>
                                    </div>
                                    <div className="h-2.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left"
                                            style={{
                                                width: `${topic.percentage}%`,
                                                transitionDelay: `${i * 100}ms`
                                            }}
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Pain Points Table */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-black/5 dark:border-white/10 p-8 shadow-lg overflow-hidden">
                <h3 className="text-xl font-bold text-black dark:text-white mb-8">Puntos de Fricción (Pain Points)</h3>

                {analytics.painPoints.length === 0 ? (
                    <p className="text-black/40 dark:text-white/40 text-center">No hay datos de fricción detectados</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-black/40 dark:text-white/40 text-xs uppercase tracking-wider border-b border-black/5 dark:border-white/5">
                                    <th className="pb-4 pr-6 pl-2 font-bold">Topic</th>
                                    <th className="pb-4 pr-6 font-bold">Volumen</th>
                                    <th className="pb-4 pr-6 font-bold text-indigo-500/80">Frustración</th>
                                    <th className="pb-4 pr-6 font-bold text-blue-500/80">Sin Resolver</th>
                                    <th className="pb-4 font-bold">Avg. Msgs</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                {analytics.painPoints.map((pp) => (
                                    <tr
                                        key={pp.topic}
                                        className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                                        onClick={() => router.push(`/admin/conversations?topic=${encodeURIComponent(pp.topic)}`)}
                                    >
                                        <td className="py-4 pr-6 pl-2 font-medium text-black/80 dark:text-white/80 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{pp.topic}</td>
                                        <td className="py-4 pr-6 text-black/60 dark:text-white/60 font-mono">{pp.sessionCount}</td>
                                        <td className="py-4 pr-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-16 h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden`}>
                                                    <div style={{ width: `${pp.frustrationRate}%` }} className={`h-full rounded-full ${pp.frustrationRate > 25 ? 'bg-indigo-500' : 'bg-green-500'}`} />
                                                </div>
                                                <span className={`text-xs font-bold ${pp.frustrationRate >= 25 ? 'text-indigo-500' : 'text-green-500'}`}>{pp.frustrationRate}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-16 h-1.5 rounded-full bg-black/5 dark:bg-white/5 overflow-hidden`}>
                                                    <div style={{ width: `${pp.unresolvedRate}%` }} className={`h-full rounded-full ${pp.unresolvedRate > 25 ? 'bg-blue-500' : 'bg-green-500'}`} />
                                                </div>
                                                <span className={`text-xs font-bold ${pp.unresolvedRate >= 25 ? 'text-blue-500' : 'text-green-500'}`}>{pp.unresolvedRate}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-black/60 dark:text-white/60 font-mono">{pp.avgMessagesPerSession}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
