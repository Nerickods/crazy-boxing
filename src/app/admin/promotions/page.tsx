'use client';
import { useState, useEffect } from 'react';
import { plansService } from '@/features/plans/services/plansService';
import { Promotion, SectionConfig } from '@/features/plans/types/plan';

export default function AdminPromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [headerConfig, setHeaderConfig] = useState<SectionConfig | null>(null);
    const [loading, setLoading] = useState(true);

    // Track unsaved changes
    const [unsavedPromos, setUnsavedPromos] = useState<Record<string, Partial<Promotion>>>({});
    const [unsavedHeader, setUnsavedHeader] = useState<Partial<SectionConfig>>({});

    const [savingId, setSavingId] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [promosData, headerData] = await Promise.all([
                plansService.getAllPromotionsAdmin(),
                plansService.getSectionConfig('promotions_header')
            ]);
            setPromotions(promosData);
            setHeaderConfig(headerData);
            setUnsavedPromos({});
            setUnsavedHeader({});
        } catch (e) {
            console.error(e);
            alert('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- PROMO HANDLERS ---
    const handlePromoChange = (id: string, field: keyof Promotion, value: any) => {
        setUnsavedPromos(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleSavePromo = async (id: string) => {
        const changes = unsavedPromos[id];
        if (!changes) return;

        setSavingId(id);
        try {
            await plansService.updatePromotion(id, changes);
            setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
            const newUnsaved = { ...unsavedPromos };
            delete newUnsaved[id];
            setUnsavedPromos(newUnsaved);
            alert('Promoción actualizada');
        } catch (e) {
            alert('Error updating promo');
        } finally {
            setSavingId(null);
        }
    };

    const getPromoValue = (promo: Promotion, field: keyof Promotion) => {
        if (unsavedPromos[promo.id] && field in unsavedPromos[promo.id]) {
            return unsavedPromos[promo.id]![field];
        }
        return promo[field];
    };

    // --- HEADER HANDLERS ---
    const handleHeaderChange = (field: keyof SectionConfig, value: any) => {
        setUnsavedHeader(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveHeader = async () => {
        if (!headerConfig) return;
        setSavingId('header');
        try {
            await plansService.updateSectionConfig('promotions_header', unsavedHeader);
            setHeaderConfig({ ...headerConfig, ...unsavedHeader });
            setUnsavedHeader({});
            alert('Cabecera actualizada');
        } catch (e) {
            alert('Error updating header');
        } finally {
            setSavingId(null);
        }
    };

    const getHeaderValue = (field: keyof SectionConfig) => {
        if (field in unsavedHeader) return unsavedHeader[field];
        return headerConfig ? headerConfig[field] : '';
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
        <div className="p-8 max-w-6xl mx-auto space-y-16 animate-in fade-in zoom-in duration-500">
            <div className="border-b border-black/5 dark:border-white/5 pb-8">
                <h1 className="text-4xl font-bold text-blue-900 dark:text-white tracking-tight mb-2 transition-colors">Promociones Activas</h1>
                <p className="text-blue-900/60 dark:text-white/50 text-lg transition-colors">Configura las ofertas visibles en la landing page.</p>
            </div>

            {/* --- SECTION HEADER CONFIG --- */}
            <section className="bg-white/60 dark:bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-blue-500/20 dark:hover:border-indigo-500/20 shadow-cyan-500/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-600" />

                <div className="flex flex-col md:flex-row justify-between items-start mb-10 relative z-10 gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-2 flex items-center gap-3 transition-colors">
                            Configuración del Header
                        </h2>
                        <p className="text-sm text-blue-900/60 dark:text-white/50 transition-colors max-w-md">Controla el título principal y la visibilidad de toda la sección de promociones en el sitio público.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <label className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all cursor-pointer ${getHeaderValue('isActive') ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/5 dark:bg-white/5 border-transparent hover:bg-black/10 dark:hover:bg-white/10'}`}>
                                <span className={`text-xs font-bold tracking-wider ${getHeaderValue('isActive') ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-900/30 dark:text-white/30'}`}>
                                    {getHeaderValue('isActive') ? 'VISIBLE ONLINE' : 'OCULTO'}
                                </span>
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors flex items-center ${getHeaderValue('isActive') ? 'bg-emerald-500' : 'bg-black/20 dark:bg-white/20'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${getHeaderValue('isActive') ? 'translate-x-4' : 'translate-x-0'}`} />
                                </div>
                                <input
                                    type="checkbox"
                                    checked={Boolean(getHeaderValue('isActive'))}
                                    onChange={(e) => handleHeaderChange('isActive', e.target.checked)}
                                    className="hidden"
                                />
                            </label>
                            <button
                                onClick={handleSaveHeader}
                                disabled={Object.keys(unsavedHeader).length === 0 || savingId === 'header'}
                                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 ${Object.keys(unsavedHeader).length > 0
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/20 hover:scale-[1.02]'
                                    : 'bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 border border-black/5 dark:border-white/5 cursor-not-allowed'
                                    }`}
                            >
                                {savingId === 'header' ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs text-blue-900/40 dark:text-white/40 block ml-1 uppercase tracking-wider font-bold transition-colors">Subtítulo (Eyebrow)</label>
                        <input
                            type="text"
                            value={String(getHeaderValue('title'))}
                            onChange={(e) => handleHeaderChange('title', e.target.value)}
                            placeholder="Ej: OFERTA POR TIEMPO LIMITADO"
                            className="bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/5 rounded-xl px-4 py-3 w-full text-blue-900 dark:text-white placeholder-blue-900/20 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all focus:shadow-lg focus:shadow-blue-500/5 dark:focus:shadow-cyan-500/5"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-blue-900/40 dark:text-white/40 block ml-1 uppercase tracking-wider font-bold transition-colors">Título Principal</label>
                        <input
                            type="text"
                            value={String(getHeaderValue('subtitle'))}
                            onChange={(e) => handleHeaderChange('subtitle', e.target.value)}
                            placeholder="Ej: 2026: Tu Año. Tu Legado."
                            className="bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/5 rounded-xl px-4 py-3 w-full text-blue-900 dark:text-white font-bold text-lg placeholder-blue-900/20 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all focus:shadow-lg focus:shadow-blue-500/5 dark:focus:shadow-cyan-500/5"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs text-blue-900/40 dark:text-white/40 block ml-1 uppercase tracking-wider font-bold transition-colors">Descripción Corta / Footer</label>
                        <input
                            type="text"
                            value={String(getHeaderValue('description'))}
                            onChange={(e) => handleHeaderChange('description', e.target.value)}
                            className="bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/5 rounded-xl px-4 py-3 w-full text-blue-900/80 dark:text-white/80 placeholder-blue-900/20 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all focus:shadow-lg focus:shadow-blue-500/5 dark:focus:shadow-cyan-500/5"
                        />
                    </div>
                </div>
            </section>

            {/* --- INDIVIDUAL PROMOTIONS --- */}
            <div>
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3 text-blue-900 dark:text-white">
                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                    Tarjetas Promocionales
                </h2>
                <div className="grid gap-8">
                    {promotions.map((promo, index) => {
                        const hasChanges = !!unsavedPromos[promo.id];
                        return (
                            <div key={promo.id} className="bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/40 dark:border-white/10 shadow-lg relative overflow-hidden group hover:bg-white/80 dark:hover:bg-white/[0.07] transition-all duration-300 shadow-cyan-500/5" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex flex-col md:flex-row justify-between items-start border-b border-black/5 dark:border-white/5 pb-6 mb-8 transition-colors gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-blue-900 dark:text-white transition-colors">
                                                {promo.title}
                                            </h3>
                                            {getPromoValue(promo, 'isActive') && <span className="flex h-2.5 w-2.5 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </span>}
                                        </div>
                                        <p className="text-xs text-blue-900/30 dark:text-white/30 font-mono mt-1 transition-colors">ID: {promo.id} | Priority: {promo.displayOrder}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${getPromoValue(promo, 'isActive') ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/5 dark:bg-white/5 border-transparent hover:bg-black/10 dark:hover:bg-white/10'}`}>
                                            <span className={`text-xs font-bold tracking-wider ${getPromoValue(promo, 'isActive') ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-900/30 dark:text-white/30'}`}>
                                                {getPromoValue(promo, 'isActive') ? 'ACTIVA' : 'INACTIVA'}
                                            </span>
                                            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${getPromoValue(promo, 'isActive') ? 'bg-emerald-500' : 'bg-black/20 dark:bg-white/20'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${getPromoValue(promo, 'isActive') ? 'translate-x-4' : 'translate-x-0'}`} />
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(getPromoValue(promo, 'isActive'))}
                                                onChange={(e) => handlePromoChange(promo.id, 'isActive', e.target.checked)}
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            onClick={() => handleSavePromo(promo.id)}
                                            disabled={!hasChanges || savingId === promo.id}
                                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg uppercase tracking-wider ${hasChanges
                                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-emerald-500/20 hover:scale-[1.02]'
                                                : 'bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 border border-black/5 dark:border-white/5 cursor-not-allowed'
                                                }`}
                                        >
                                            {savingId === promo.id ? 'Guardando...' : hasChanges ? 'Guardar' : 'Sin Cambios'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs text-blue-900/40 dark:text-white/40 block ml-1 uppercase tracking-wider font-bold transition-colors">Título en Tarjeta</label>
                                        <input
                                            type="text"
                                            value={String(getPromoValue(promo, 'title'))}
                                            onChange={(e) => handlePromoChange(promo.id, 'title', e.target.value)}
                                            className="bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/5 rounded-xl px-4 py-3 w-full text-blue-900 dark:text-white placeholder-blue-900/20 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all focus:shadow-lg focus:shadow-blue-500/5 dark:focus:shadow-cyan-500/5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-blue-900/40 dark:text-white/40 block ml-1 uppercase tracking-wider font-bold transition-colors">Texto Descuento (Grande)</label>
                                        <input
                                            type="text"
                                            value={String(getPromoValue(promo, 'discount'))}
                                            onChange={(e) => handlePromoChange(promo.id, 'discount', e.target.value)}
                                            className="bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/5 rounded-xl px-4 py-3 w-full text-blue-900 dark:text-white font-bold placeholder-blue-900/20 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all focus:shadow-lg focus:shadow-blue-500/5 dark:focus:shadow-cyan-500/5"
                                        />
                                    </div>
                                    <div className="col-span-full space-y-2">
                                        <label className="text-xs text-blue-900/40 dark:text-white/40 block ml-1 uppercase tracking-wider font-bold transition-colors">Subtítulo / Detalles</label>
                                        <input
                                            type="text"
                                            value={String(getPromoValue(promo, 'description'))}
                                            onChange={(e) => handlePromoChange(promo.id, 'description', e.target.value)}
                                            className="bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/5 rounded-xl px-4 py-3 w-full text-blue-900 dark:text-white placeholder-blue-900/20 dark:placeholder-white/20 focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 dark:focus:border-indigo-500/50 focus:outline-none transition-all focus:shadow-lg focus:shadow-blue-500/5 dark:focus:shadow-cyan-500/5"
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
