'use client'

import React, { useState } from 'react'
import { Sparkles, Loader2, MessageSquare, CheckCircle2, ChevronRight } from 'lucide-react'
import { analyzeUnprocessedAction } from '../actions/analysisActions'

export function BulkAnalysisButton() {
    const [isPending, setIsPending] = useState(false)
    const [result, setResult] = useState<{ processed?: number, total?: number, error?: string } | null>(null)

    const handleAnalyze = async () => {
        setIsPending(true)
        setResult(null)
        try {
            const res = await analyzeUnprocessedAction()
            if (res.success && res.data) {
                setResult(res.data)
            } else if (res.error) {
                setResult({ error: res.error })
            }
        } catch (error) {
            setResult({ error: 'Fallo crítico en el motor de análisis.' })
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 glass group hover:border-accent-cyan/20 transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="size-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                    <Sparkles className={`w-6 h-6 ${isPending ? 'animate-pulse' : ''}`} />
                </div>
                {result?.processed !== undefined && result.processed > 0 && (
                    <div className="px-3 py-1 rounded-full bg-success-green/10 border border-success-green/20 text-success-green text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="w-3 h-3" />
                        Analizadas: {result.processed}
                    </div>
                )}
            </div>

            <h3 className="text-lg font-bold text-white mb-2 font-display uppercase tracking-tight">Análisis Neuronal</h3>
            <p className="text-slate-400 text-[10px] mb-6 leading-relaxed uppercase tracking-widest font-bold opacity-70">
                Procesa conversaciones pendientes (batch de 10) para extraer insights, sentimientos y calidad de leads automáticamente.
            </p>

            <button 
                onClick={handleAnalyze}
                disabled={isPending}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-black uppercase tracking-[0.2em] text-[10px] relative overflow-hidden group/btn ${
                    isPending 
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-accent-cyan hover:scale-[1.02] active:scale-95'
                }`}
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin text-accent-cyan" />
                        Procesando Nodos...
                    </>
                ) : (
                    <>
                        <span>Analizar Pendientes</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                )}
                
                {/* Visual Glow Effect */}
                {!isPending && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                )}
            </button>

            {result?.error && (
                <p className="mt-4 text-[10px] text-red-400 font-bold uppercase tracking-widest text-center animate-shake">
                    ⚠️ {result.error}
                </p>
            )}

            {result?.processed === 0 && !isPending && (
                <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center italic">
                    Todo bajo control. No hay sesiones nuevas.
                </p>
            )}
        </div>
    )
}
