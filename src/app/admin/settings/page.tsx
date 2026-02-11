'use client'

import { useEffect, useState } from 'react'

interface Agent {
    id: string
    name: string
    description: string | null
    system_prompt: string
    model_id: string
    temperature: number
    max_tokens: number
    classification_topics: string[]
    is_active: boolean
}

const AVAILABLE_MODELS = [
    { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash (Recomendado)' },
    { id: 'google/gemini-2.0-flash-thinking-exp-01-21', name: 'Gemini 2.0 Flash Thinking' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
]

export default function SettingsPage() {
    const [agent, setAgent] = useState<Agent | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [newTopic, setNewTopic] = useState('')

    useEffect(() => {
        fetchAgent()
    }, [])

    async function fetchAgent() {
        try {
            const res = await fetch('/api/agent')
            if (res.ok) {
                const data = await res.json()
                setAgent(data)
            }
        } catch (error) {
            console.error('Failed to fetch agent:', error)
        } finally {
            setLoading(false)
        }
    }

    async function saveAgent() {
        if (!agent) return

        setSaving(true)
        setMessage(null)

        try {
            const res = await fetch('/api/agent', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: agent.name,
                    description: agent.description,
                    system_prompt: agent.system_prompt,
                    model_id: agent.model_id,
                    temperature: agent.temperature,
                    max_tokens: agent.max_tokens,
                    classification_topics: agent.classification_topics,
                }),
            })

            if (res.ok) {
                setMessage({ type: 'success', text: 'Configuración guardada correctamente' })
                setTimeout(() => setMessage(null), 3000)
            } else {
                setMessage({ type: 'error', text: 'Error al guardar la configuración' })
            }
        } catch {
            setMessage({ type: 'error', text: 'Error de conexión' })
        } finally {
            setSaving(false)
        }
    }

    function addTopic() {
        if (!agent || !newTopic.trim()) return
        if (agent.classification_topics.includes(newTopic.trim())) return

        setAgent({
            ...agent,
            classification_topics: [...agent.classification_topics, newTopic.trim()],
        })
        setNewTopic('')
    }

    function removeTopic(topic: string) {
        if (!agent) return
        setAgent({
            ...agent,
            classification_topics: agent.classification_topics.filter((t) => t !== topic),
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-black/5 dark:border-white/10" />
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-black/40 dark:text-white/40 animate-pulse">Cargando Configuración...</p>
                </div>
            </div>
        )
    }

    if (!agent) {
        return (
            <div className="p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Agente no Encontrado</h3>
                <p className="text-black/50 dark:text-white/50 text-sm max-w-sm mx-auto">No se ha podido inicializar el agente. Contacta con soporte técnico o intenta recargar la página.</p>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-blue-900 dark:text-white tracking-tight mb-2 flex items-center gap-3">
                        <span className="w-2 h-10 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-full" />
                        Configuración del Agente
                    </h1>
                    <p className="text-blue-900/60 dark:text-white/50 font-light ml-5">
                        Define el núcleo, personalidad y comportamiento neuronal del asistente
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {message && (
                        <div
                            className={`px-6 py-3 rounded-2xl border text-sm font-medium animate-in fade-in slide-in-from-right-4 duration-300 ${message.type === 'success'
                                ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300 shadow-lg shadow-green-500/5'
                                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300 shadow-lg shadow-cyan-500/5'
                                }`}
                        >
                            {message.type === 'success' ? '✓ ' : '✕ '}{message.text}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Identity & Personality */}
                <div className="lg:col-span-12 space-y-8">
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group shadow-cyan-500/5">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
                            <svg className="w-48 h-48 text-blue-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-blue-900/40 dark:text-white/40 mb-2 ml-1">Nombre de la Identidad</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={agent.name}
                                            onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/5 rounded-2xl text-blue-900 dark:text-white placeholder-blue-900/20 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all font-medium text-lg"
                                            placeholder="Ej: BB Neural v3"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Description Input */}
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40 mb-2 ml-1">Propósito & Bio</label>
                                    <input
                                        type="text"
                                        value={agent.description || ''}
                                        onChange={(e) => setAgent({ ...agent, description: e.target.value })}
                                        className="w-full px-6 py-4 bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                                        placeholder="Breve descripción del propósito de este agente"
                                    />
                                </div>
                            </div>

                            {/* Classification Topics */}
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40 mb-2 ml-1">Conocimientos Core (Classification Topics)</label>
                                <div className="bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl p-6 min-h-[140px] flex flex-col justify-between">
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {agent.classification_topics.map((topic) => (
                                            <span
                                                key={topic}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/5 dark:bg-white/10 text-black/80 dark:text-white/80 rounded-xl text-xs font-bold border border-black/5 dark:border-white/5 hover:border-blue-500/30 transition-all group/topic"
                                            >
                                                {topic}
                                                <button
                                                    onClick={() => removeTopic(topic)}
                                                    className="opacity-40 hover:opacity-100 hover:text-indigo-500 transition-all"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="relative group/add">
                                        <input
                                            type="text"
                                            value={newTopic}
                                            onChange={(e) => setNewTopic(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                                            placeholder="Agregar nuevo conocimiento y presiona Enter..."
                                            className="w-full px-5 py-3 bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-xl text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                                        />
                                        <button
                                            onClick={addTopic}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* System Prompt (Left Pane) */}
                        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40">Instrucciones del Sistema (Cerebro Core)</label>
                                <div className="p-1 px-3 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">MODO AUTORIDAD</div>
                            </div>
                            <textarea
                                value={agent.system_prompt}
                                onChange={(e) => setAgent({ ...agent, system_prompt: e.target.value })}
                                rows={14}
                                className="flex-1 w-full px-6 py-5 bg-white/40 dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-2xl text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm leading-relaxed resize-none custom-scrollbar"
                                placeholder="Escribe aquí las directrices fundamentales del agente..."
                            />
                            <p className="text-[10px] font-medium text-black/30 dark:text-white/20 mt-4 italic">
                                * Nota: El prompt del sistema define la moral, tono y límites del agente.
                            </p>
                        </div>

                        {/* IA Model & Parameters (Right Pane) */}
                        <div className="space-y-8">
                            {/* Model Selection */}
                            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl -mr-16 -mt-16 pointer-events-none transition-all group-hover:scale-150 duration-700" />
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40 mb-4 ml-1">Modelo de Procesamiento Neural</label>
                                <div className="space-y-4">
                                    <div className="relative group/select">
                                        <select
                                            value={agent.model_id}
                                            onChange={(e) => setAgent({ ...agent, model_id: e.target.value })}
                                            className="w-full appearance-none px-6 py-4 bg-white/40 dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-2xl text-black dark:text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer shadow-sm pr-12 group-hover/select:border-blue-500/30"
                                        >
                                            {AVAILABLE_MODELS.map((model) => (
                                                <option key={model.id} value={model.id} className="bg-neutral-900 text-white font-medium py-2">
                                                    {model.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover/select:opacity-100 transition-opacity">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-black/40 dark:text-white/30 px-2 flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                                        Se recomienda usar Gemini 2.0 Flash para mejor relación costo/latencia.
                                    </p>
                                </div>
                            </div>

                            {/* Sliders & Numbers */}
                            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-xl">
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-black/40 dark:text-white/40 mb-8 ml-1">Parámetros de Creatividad & Respuesta</label>

                                <div className="space-y-10">
                                    {/* Temperature Slider */}
                                    <div className="relative pt-2">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h4 className="text-sm font-bold text-black dark:text-white">Temperatura</h4>
                                                <p className="text-[10px] text-black/40 dark:text-white/40 font-medium">Control de aleatoriedad neuronal</p>
                                            </div>
                                            <div className="px-4 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-600 dark:text-blue-400 font-bold font-mono text-sm shadow-inner transition-all hover:scale-110">
                                                {agent.temperature.toFixed(1)}
                                            </div>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={agent.temperature}
                                            onChange={(e) => setAgent({ ...agent, temperature: parseFloat(e.target.value) })}
                                            className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500 hover:accent-red-500 transition-all"
                                        />
                                        <div className="flex justify-between text-[9px] uppercase font-bold tracking-tighter opacity-30 mt-3 px-1">
                                            <span>Riguroso / Determinista</span>
                                            <span>Creativo / Alucinógeno</span>
                                        </div>
                                    </div>

                                    {/* Max Tokens */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-sm font-bold text-black dark:text-white ml-1">Contención de Respuesta (Max Tokens)</h4>
                                            <span className="text-[10px] font-mono opacity-30">Límite: 4000</span>
                                        </div>
                                        <div className="relative group/tokens">
                                            <input
                                                type="number"
                                                value={agent.max_tokens}
                                                onChange={(e) => setAgent({ ...agent, max_tokens: parseInt(e.target.value) || 500 })}
                                                min="100"
                                                max="4000"
                                                className="w-full px-6 py-4 bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl text-black dark:text-white font-bold focus:outline-none focus:border-blue-500/50 transition-all font-mono group-hover/tokens:border-blue-500/20"
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-1 opacity-20 group-hover/tokens:opacity-100 transition-opacity">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button (Sticky Footer Style) */}
                <div className="lg:col-span-12 pt-8">
                    <button
                        onClick={saveAgent}
                        disabled={saving}
                        className="
                            relative w-full overflow-hidden group
                            px-12 py-5 rounded-[2rem]
                            bg-black text-white dark:bg-white dark:text-black
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                            shadow-2xl shadow-black/20 dark:shadow-white/20
                        "
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-500 to-indigo-600 opacity-0 group-hover:opacity-20 animate-pulse-slow transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                        <span className="relative z-10 flex items-center justify-center gap-4 font-bold tracking-widest uppercase text-sm">
                            {saving ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Actualizando Core...
                                </>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 text-blue-500 dark:text-indigo-500 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Guardar Configuración de Autoridad
                                </>
                            )}
                        </span>
                    </button>
                    <p className="text-center text-[10px] font-bold text-black/20 dark:text-white/20 uppercase tracking-[0.3em] mt-6 animate-pulse">
                        Neural Core Synchronization System v3.0 // Authority Protocol
                    </p>
                </div>
            </div>
        </div>
    )
}