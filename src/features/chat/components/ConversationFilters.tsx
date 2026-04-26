'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageSquare, Clock, CheckCircle2, Eye, EyeOff } from 'lucide-react'

export function ConversationFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const currentStatus = searchParams.get('status') || 'all'
    const currentSeen = searchParams.get('seen') || 'all'

    const statusFilters = [
        { id: 'all', label: 'Todos', icon: MessageSquare, color: 'text-slate-400' },
        { id: 'pending', label: 'Pendientes', icon: Clock, color: 'text-amber-400' },
        { id: 'processed', label: 'Procesados', icon: CheckCircle2, color: 'text-accent-cyan' },
    ]

    const seenFilters = [
        { id: 'all', label: 'Cualquiera', icon: Eye, color: 'text-slate-400' },
        { id: 'unseen', label: 'No Procesados (Nuevos)', icon: EyeOff, color: 'text-amber-400' },
        { id: 'seen', label: 'Vistos', icon: CheckCircle2, color: 'text-accent-cyan' },
    ]

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === 'all') {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="space-y-6 mb-10">
            {/* Status Filters */}
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Análisis Neuronal</p>
                <div className="flex flex-wrap gap-2">
                    {statusFilters.map((filter) => {
                        const Icon = filter.icon
                        const isActive = currentStatus === filter.id
                        
                        return (
                            <button
                                key={filter.id}
                                onClick={() => updateParams('status', filter.id)}
                                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                    isActive 
                                    ? 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                                    : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/[0.08] hover:border-white/10'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? filter.color : 'text-slate-600'}`} />
                                {filter.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Seen Filters */}
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Estado de Lectura</p>
                <div className="flex flex-wrap gap-2">
                    {seenFilters.map((filter) => {
                        const Icon = filter.icon
                        const isActive = currentSeen === filter.id
                        
                        return (
                            <button
                                key={filter.id}
                                onClick={() => updateParams('seen', filter.id)}
                                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                    isActive 
                                    ? 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                                    : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/[0.08] hover:border-white/10'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? filter.color : 'text-slate-600'}`} />
                                {filter.label}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
