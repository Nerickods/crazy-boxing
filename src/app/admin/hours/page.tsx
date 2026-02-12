'use client';

import { useState, useEffect } from 'react';
import { hoursService, GymHour } from '@/features/facilities/services/hoursService';
import { Loader2, Plus, Trash2, Save, Clock, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminHoursPage() {
    const [hours, setHours] = useState<GymHour[]>([]);
    const [originalHours, setOriginalHours] = useState<GymHour[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadHours();
    }, []);

    const loadHours = async () => {
        try {
            const data = await hoursService.getGymHours();
            // Sort by display_order
            const sortedData = data.sort((a, b) => a.display_order - b.display_order);
            setHours(sortedData);
            // Deep copy for comparison
            setOriginalHours(JSON.parse(JSON.stringify(sortedData)));
            setHasChanges(false);
        } catch (error) {
            alert('Error al cargar horarios');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            // Update all modified records
            const promises = hours.map(async (hour) => {
                const original = originalHours.find(oh => oh.id === hour.id);
                // Simple comparison to check if update is needed
                if (JSON.stringify(hour) !== JSON.stringify(original)) {
                    return hoursService.updateGymHour(hour.id, {
                        title: hour.title,
                        schedule: hour.schedule,
                        display_order: hour.display_order
                    });
                }
                return Promise.resolve();
            });

            await Promise.all(promises);

            // Reload to sync state
            await loadHours();
            alert('Cambios guardados exitosamente');
        } catch (error) {
            console.error(error);
            alert('Error al guardar cambios');
        } finally {
            setSaving(false);
        }
    };

    const handleDiscardChanges = () => {
        if (confirm('¿Estás seguro de descartar los cambios no guardados?')) {
            setHours(JSON.parse(JSON.stringify(originalHours)));
            setHasChanges(false);
        }
    };

    // Update local state handler
    const updateLocalHour = (id: string, updates: Partial<GymHour>) => {
        setHours(prev => {
            const newHours = prev.map(h => h.id === id ? { ...h, ...updates } : h);
            setHasChanges(true); // Mark as changed
            return newHours;
        });
    };

    const handleScheduleChange = (id: string, index: number, value: string) => {
        const hour = hours.find(h => h.id === id);
        if (!hour) return;

        const newSchedule = [...hour.schedule];
        newSchedule[index] = value;
        updateLocalHour(id, { schedule: newSchedule });
    };

    const handleAddSlot = (id: string) => {
        const hour = hours.find(h => h.id === id);
        if (!hour) return;

        const newSchedule = [...hour.schedule, ""];
        updateLocalHour(id, { schedule: newSchedule });
    };

    const handleRemoveSlot = (id: string, index: number) => {
        const hour = hours.find(h => h.id === id);
        if (!hour) return;

        const newSchedule = hour.schedule.filter((_, i) => i !== index);
        updateLocalHour(id, { schedule: newSchedule });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-30 py-4 -my-4 border-b border-gray-100 dark:border-white/5">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Gestión de Horarios
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Configura los horarios de apertura del gimnasio visibles en la web.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <button
                            onClick={handleDiscardChanges}
                            disabled={saving}
                            className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        >
                            Descartar
                        </button>
                    )}
                    <button
                        onClick={handleSaveChanges}
                        disabled={!hasChanges || saving}
                        className={`
                            flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all transform active:scale-95
                            ${hasChanges
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}
                        `}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {hours.map((hour) => (
                    <motion.div
                        layout
                        key={hour.id}
                        className="group bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-colors"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Left Column: Label & Title */}
                            <div className="md:w-1/3 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 shrink-0">
                                        {hour.label}
                                    </div>
                                    <div className="w-full">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1 block">
                                            Título del Bloque
                                        </label>
                                        <input
                                            type="text"
                                            value={hour.title}
                                            onChange={(e) => updateLocalHour(hour.id, { title: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-black/20 px-3 py-2 rounded-lg font-bold text-slate-800 dark:text-white border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-black transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 px-1">
                                    Este bloque controla los días: <span className="font-medium text-slate-600 dark:text-slate-300">{hour.title}</span>.
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px bg-slate-100 dark:bg-white/5" />

                            {/* Right Column: Time Slots */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                        Franjas Horarias
                                    </label>
                                </div>

                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {hour.schedule.map((slot, index) => (
                                            <motion.div
                                                key={`${hour.id}-slot-${index}`}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="relative flex-1">
                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={slot}
                                                        placeholder="Ej: 08:00 AM - 12:00 PM"
                                                        onChange={(e) => handleScheduleChange(hour.id, index, e.target.value)}
                                                        className="w-full bg-slate-50 dark:bg-black/40 pl-10 pr-4 py-3 rounded-xl font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveSlot(hour.id, index)}
                                                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                                                    title="Eliminar franja"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={() => handleAddSlot(hour.id)}
                                    className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors mt-2"
                                >
                                    <Plus size={14} className="stroke-[3px]" />
                                    Añadir Horario
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
