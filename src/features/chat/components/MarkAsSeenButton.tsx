'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { toggleSeenAction } from '@/features/chat/actions/analysisActions'

interface MarkAsSeenButtonProps {
    sessionId: string
    isSeen: boolean
}

export function MarkAsSeenButton({ sessionId, isSeen }: MarkAsSeenButtonProps) {
    const [isPending, setIsPending] = useState(false)

    const handleToggle = async () => {
        setIsPending(true)
        try {
            await toggleSeenAction(sessionId, isSeen)
        } catch (error) {
            console.error('Failed to toggle seen status', error)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`
                flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                ${isSeen 
                    ? 'bg-success-green/10 border border-success-green/20 text-success-green hover:bg-success-green/20' 
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }
                ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isSeen ? (
                <EyeOff className="w-3.5 h-3.5" />
            ) : (
                <Eye className="w-3.5 h-3.5" />
            )}
            
            <span>{isSeen ? 'Marcar como No Visto' : 'Marcar como Visto'}</span>
            
            {isSeen && <CheckCircle2 className="w-3 h-3 ml-1" />}
        </button>
    )
}
