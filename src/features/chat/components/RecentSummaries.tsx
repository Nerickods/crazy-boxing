'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, MessageSquare, BadgeCheck } from 'lucide-react'

interface RecentSummariesProps {
    sessions: any[]
}

export function RecentSummaries({ sessions }: RecentSummariesProps) {
    if (!sessions || sessions.length === 0) return null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-display tracking-tight uppercase">Resúmenes IA Recientes</h2>
                <Link 
                    href="/admin/conversations?status=processed" 
                    className="text-[10px] font-black text-accent-cyan uppercase tracking-widest hover:underline transition-all"
                >
                    Ver Todo el Historial
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {sessions.map((session) => (
                    <Link 
                        key={session.id}
                        href={`/admin/conversations/${session.id}`}
                        className="bg-white/5 border border-white/5 rounded-3xl p-4 md:p-6 glass group hover:border-accent-cyan/30 transition-all flex flex-col md:flex-row gap-4 md:gap-6 relative overflow-hidden"
                    >
                        {/* Background subtle indicator */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Sparkles className="w-12 h-12 text-accent-cyan" />
                        </div>

                        <div className="flex-shrink-0 flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-4 md:mb-0">
                                <div className="size-10 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sesión {session.id.slice(0, 8)}</div>
                                    <div className="text-xs font-bold text-white">Interpretación Neuronal</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow">
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-4 group-hover:bg-accent-cyan/[0.02] transition-colors">
                                <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                                    "{session.analysis?.summary || 'Análisis en curso o incompleto.'}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {session.analysis?.sentiment && (
                                    <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                        session.analysis.sentiment === 'POSITIVE' ? 'bg-success-green/10 border-success-green/20 text-success-green' : 'bg-amber-400/10 border-amber-400/20 text-amber-400'
                                    }`}>
                                        {session.analysis.sentiment}
                                    </div>
                                )}
                                {session.analysis?.lead_quality && (
                                    <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                        session.analysis.lead_quality === 'HIGH' ? 'bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan' : 'bg-slate-500/10 border-white/10 text-slate-400'
                                    }`}>
                                        CQ: {session.analysis.lead_quality}
                                    </div>
                                )}
                                <div className="ml-auto flex items-center gap-2 text-[10px] font-black text-slate-600 group-hover:text-accent-cyan uppercase tracking-widest transition-colors">
                                    Revisar Flujo <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
