'use client';
import { useState, useEffect } from 'react';
import { plansService } from '@/features/plans/services/plansService';
import { Plan } from '@/features/plans/types/plan';

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    // Track unsaved changes: key is planId
    const [unsavedChanges, setUnsavedChanges] = useState<Record<string, Partial<Plan>>>({});

    const loadPlans = async () => {
        setLoading(true);
        try {
            const data = await plansService.getAllPlansAdmin();
            setPlans(data);
            setUnsavedChanges({});
        } catch (e) {
            console.error(e);
            alert('Error loading plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlans();
    }, []);

    const handleChange = (id: string, field: keyof Plan, value: any) => {
        setUnsavedChanges(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleFeaturesChange = (id: string, newFeatures: string[]) => {
        setUnsavedChanges(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                features: newFeatures
            }
        }));
    };

    const handleSave = async (id: string) => {
        const changes = unsavedChanges[id];
        if (!changes) return;

        setSavingId(id);
        try {
            await plansService.updatePlan(id, changes);

            // Update local state to reflect saved changes
            setPlans(plans.map(p => p.id === id ? { ...p, ...changes } : p));

            // Clear unsaved changes for this item
            const newUnsaved = { ...unsavedChanges };
            delete newUnsaved[id];
            setUnsavedChanges(newUnsaved);

            alert('Plan actualizado correctamente');
        } catch (e) {
            console.error(e);
            alert('Error al guardar');
        } finally {
            setSavingId(null);
        }
    };

    // Helper to get current value (unsaved or saved)
    const getValue = (plan: Plan, field: keyof Plan) => {
        if (unsavedChanges[plan.id] && field in unsavedChanges[plan.id]) {
            return unsavedChanges[plan.id]![field];
        }
        return plan[field];
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-black/5 dark:border-white/10" />
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-between items-end border-b border-black/5 dark:border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-cyan-700 dark:text-white tracking-tight mb-2 transition-colors">
                        Planes & Membresías
                    </h1>
                    <p className="text-blue-950/80 dark:text-white/50 text-lg transition-colors">
                        Gestiona la oferta comercial y estructura de precios.
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* Actions could go here */}
                </div>
            </div>

            <div className="grid gap-8">
                {plans.map((plan, index) => {
                    const currentFeatures = (getValue(plan, 'features') as string[]) || [];
                    const hasChanges = !!unsavedChanges[plan.id];

                    return (
                        <div
                            key={plan.id}
                            className="bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-blue-500/20 dark:hover:border-indigo-500/20 shadow-cyan-500/5"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Popular/Highlight Gradients */}
                            {Boolean(getValue(plan, 'isPopular')) && (
                                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none transition-opacity duration-500" />
                            )}

                            {/* Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b border-black/5 dark:border-white/5 pb-6 relative z-10 transition-colors gap-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-2xl font-bold text-blue-950 dark:text-white transition-colors">
                                            {plan.name}
                                        </h3>
                                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-900/70 dark:text-white/40 px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 border border-white/20 dark:border-white/5 transition-colors">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-900/30 dark:text-white/30 font-mono flex items-center gap-2 transition-colors">
                                        <span className={`w-2 h-2 rounded-full ${getValue(plan, 'isActive') ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-indigo-500'}`} />
                                        ID: {plan.key}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 bg-white/60 dark:bg-black/20 px-4 py-2 rounded-xl border border-white/40 dark:border-white/5 transition-colors">
                                        <label className="text-xs text-blue-900/70 dark:text-white/40 uppercase tracking-wider font-bold transition-colors">Orden</label>
                                        <input
                                            type="number"
                                            value={Number(getValue(plan, 'displayOrder'))}
                                            onChange={(e) => handleChange(plan.id, 'displayOrder', Number(e.target.value))}
                                            className="bg-transparent w-12 text-center text-sm font-bold text-blue-900 dark:text-white focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSave(plan.id)}
                                        disabled={!hasChanges || savingId === plan.id}
                                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${hasChanges
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/20 hover:scale-[1.02]'
                                            : 'bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 border border-black/5 dark:border-white/5 cursor-not-allowed'
                                            }`}
                                    >
                                        {savingId === plan.id ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                Guardando...
                                            </>
                                        ) : hasChanges ? 'Guardar Cambios' : 'Sin Cambios'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Column: Core Info */}
                                <div className="lg:col-span-4 space-y-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-blue-900/70 dark:text-white/40 ml-1">Nombre Público</label>
                                        <input
                                            type="text"
                                            value={String(getValue(plan, 'name'))}
                                            onChange={(e) => handleChange(plan.id, 'name', e.target.value)}
                                            className="w-full bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl px-4 py-3 text-blue-900 dark:text-white focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all placeholder-blue-900/20 dark:placeholder-white/20 focus:shadow-lg focus:shadow-blue-500/5 dark:focus:shadow-cyan-500/5"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-blue-900/70 dark:text-white/40 ml-1">Precio Mensual</label>
                                        <div className="relative group/price">
                                            <span className="absolute left-4 top-3.5 text-blue-900/60 dark:text-white/40 font-serif italic transition-colors">$</span>
                                            <input
                                                type="number"
                                                value={Number(getValue(plan, 'price'))}
                                                onChange={(e) => handleChange(plan.id, 'price', Number(e.target.value))}
                                                className="w-full bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl pl-8 pr-16 py-3 text-blue-900 dark:text-white text-xl font-bold focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all focus:shadow-lg focus:shadow-blue-500/5 dark:focus:shadow-cyan-500/5"
                                            />
                                            <div className="absolute right-4 top-4 text-xs font-bold text-blue-900/20 dark:text-white/20 transition-colors">MXN</div>
                                        </div>
                                    </div>

                                    {/* Highlight Text */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-blue-900/70 dark:text-white/40 ml-1">Badge de Ahorro</label>
                                        <input
                                            type="text"
                                            value={String(getValue(plan, 'savings') || '')}
                                            onChange={(e) => handleChange(plan.id, 'savings', e.target.value)}
                                            placeholder="Ej: Ahorra $200"
                                            className="w-full bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl px-4 py-3 text-blue-900 dark:text-white focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all placeholder-blue-900/20 dark:placeholder-white/20"
                                        />
                                    </div>

                                    {/* Flags */}
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <label className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${getValue(plan, 'isActive')
                                            ? 'bg-emerald-500/5 border-emerald-500/30'
                                            : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10'
                                            }`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${getValue(plan, 'isActive') ? 'bg-emerald-500 text-white' : 'bg-blue-900/10 dark:bg-white/10 text-blue-900/40 dark:text-white/20'}`}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${getValue(plan, 'isActive') ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-900/60 dark:text-white/40'}`}>Activo</span>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(getValue(plan, 'isActive'))}
                                                onChange={(e) => handleChange(plan.id, 'isActive', e.target.checked)}
                                                className="hidden"
                                            />
                                        </label>

                                        <label className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${getValue(plan, 'isPopular')
                                            ? 'bg-blue-500/5 border-blue-500/30'
                                            : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10'
                                            }`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${getValue(plan, 'isPopular') ? 'bg-blue-500 text-white' : 'bg-blue-900/10 dark:bg-white/10 text-blue-900/20 dark:text-white/20'}`}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${getValue(plan, 'isPopular') ? 'text-blue-600 dark:text-blue-400' : 'text-blue-900/40 dark:text-white/40'}`}>Popular</span>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(getValue(plan, 'isPopular'))}
                                                onChange={(e) => handleChange(plan.id, 'isPopular', e.target.checked)}
                                                className="hidden"
                                            />
                                        </label>

                                        <label className={`col-span-2 flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 ${getValue(plan, 'highlight')
                                            ? 'bg-indigo-500/5 border-indigo-500/30'
                                            : 'bg-white/40 dark:bg-white/5 border-transparent hover:bg-white/60 dark:hover:bg-white/10'
                                            }`}>
                                            <span className={`text-sm font-bold ${getValue(plan, 'highlight') ? 'text-indigo-700 dark:text-indigo-400' : 'text-blue-900/60 dark:text-white/40'}`}>Highlight Effect</span>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${getValue(plan, 'highlight') ? 'bg-indigo-500 text-white' : 'bg-blue-900/10 dark:bg-white/10 text-blue-900/40 dark:text-white/20'}`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(getValue(plan, 'highlight'))}
                                                onChange={(e) => handleChange(plan.id, 'highlight', e.target.checked)}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Right Column: Description & Features */}
                                <div className="lg:col-span-8 space-y-6">
                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-blue-900/70 dark:text-white/40 ml-1">Descripción Interna</label>
                                        <textarea
                                            value={String(getValue(plan, 'description'))}
                                            onChange={(e) => handleChange(plan.id, 'description', e.target.value)}
                                            rows={2}
                                            className="w-full bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 rounded-xl px-4 py-3 text-blue-900 dark:text-white focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all resize-none placeholder-blue-900/20 dark:placeholder-white/20"
                                        />
                                    </div>

                                    {/* Features Editor */}
                                    <div className="space-y-3">
                                        <label className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-blue-900/70 dark:text-white/40 ml-1">
                                            <span>Features & Beneficios</span>
                                            <span className="bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded text-[10px]">{currentFeatures.length} items</span>
                                        </label>
                                        <div className="bg-white/60 dark:bg-black/20 border border-white/40 dark:border-white/5 rounded-2xl p-6 space-y-4 shadow-inner">
                                            {currentFeatures.map((feature, idx) => (
                                                <div key={idx} className="flex gap-4 group/feature items-center">
                                                    <div className="flex-1 relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 dark:bg-indigo-500/50" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={feature}
                                                            onChange={(e) => {
                                                                const newFeatures = [...currentFeatures];
                                                                newFeatures[idx] = e.target.value;
                                                                handleFeaturesChange(plan.id, newFeatures);
                                                            }}
                                                            className="w-full bg-white dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-blue-900 dark:text-white placeholder-blue-900/20 dark:placeholder-white/20 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-indigo-500/10 focus:outline-none transition-all"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const newFeatures = currentFeatures.filter((_, i) => i !== idx);
                                                            handleFeaturesChange(plan.id, newFeatures);
                                                        }}
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-black/20 dark:text-white/20 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-500/10 transition-all opacity-0 group-hover/feature:opacity-100"
                                                        title="Eliminar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => handleFeaturesChange(plan.id, [...currentFeatures, "Nuevo beneficio"])}
                                                className="w-full py-4 border-2 border-dashed border-blue-900/10 dark:border-white/10 rounded-xl text-xs font-bold text-blue-900/30 dark:text-white/30 hover:text-blue-600 dark:hover:text-indigo-400 hover:border-blue-500/30 dark:hover:border-indigo-500/30 hover:bg-blue-500/5 dark:hover:bg-indigo-500/5 transition-all uppercase tracking-wider flex items-center justify-center gap-2 group/add"
                                            >
                                                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-sm mb-0.5">+</span>
                                                Agregar Nuevo Beneficio
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
