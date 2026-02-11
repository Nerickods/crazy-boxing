'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCalendarAlt, FaUser, FaInfoCircle, FaDumbbell, FaSearch, FaPlus, FaEdit, FaTrash, FaTimes, FaSave
} from 'react-icons/fa';
import { disciplines } from '@/shared/constants/training-data';
import { ClassSchedule } from '../../types';
import { createClassAction, updateClassAction, deleteClassAction } from '../../actions/scheduleActions';
import { Portal } from '@/shared/components/Portal';

interface DisciplinesTabProps {
    initialSchedule: ClassSchedule[];
}

export default function DisciplinesTab({ initialSchedule }: DisciplinesTabProps) {
    const [schedule, setSchedule] = useState<ClassSchedule[]>(initialSchedule);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<Partial<ClassSchedule> | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Sync state with props if revalidated (optional, but good for simple cases)
    React.useEffect(() => {
        setSchedule(initialSchedule);
    }, [initialSchedule]);

    // Filter logic
    const filteredSchedule = schedule.filter(item => {
        const matchesTab = activeTab === 'all' || item.type === activeTab;
        const matchesSearch = item.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // CRUD Handlers
    const handleEdit = (item: ClassSchedule) => {
        setEditingClass(item);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setEditingClass({
            day: 'Lunes',
            time: '08:00',
            duration: '60 min',
            spots: 20,
            level: 'General',
            instructor: '',
            discipline: '',
            type: 'boxing' // Default
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta clase?')) return;

        await deleteClassAction(id);
        // Optimistic update
        setSchedule(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClass) return;

        setIsSaving(true);
        try {
            if (editingClass.id) {
                // Update
                await updateClassAction(editingClass.id, editingClass);
            } else {
                // Create
                await createClassAction(editingClass as Omit<ClassSchedule, 'id'>);
            }
            setIsModalOpen(false);
            setEditingClass(null);
        } catch (error) {
            console.error(error);
            alert('Error al guardar');
        } finally {
            setIsSaving(false);
        }
    };

    // Group by Day for better admin view (Client Side)
    const groupedSchedule = filteredSchedule.reduce((acc, item) => {
        if (!acc[item.day]) acc[item.day] = [];
        acc[item.day].push(item);
        return acc;
    }, {} as Record<string, ClassSchedule[]>);

    const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const sortedDays = Object.keys(groupedSchedule).sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

    return (
        <div className="p-6 space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-cyan-700 dark:text-white uppercase tracking-tighter transition-colors">
                        Programación <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Maestra</span>
                    </h2>
                    <p className="text-blue-950/80 dark:text-white/50 text-sm mt-1 transition-colors">
                        Gestión completa del calendario. Los cambios se reflejan en tiempo real.
                    </p>
                </div>

                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 transition-all"
                >
                    <FaPlus /> Nueva Clase
                </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white/60 dark:bg-black/20 p-4 rounded-2xl border border-white/40 dark:border-white/5 backdrop-blur-xl shadow-lg shadow-cyan-500/5 transition-colors">
                <div className="relative flex-grow max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900/30 dark:text-white/30 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar clase o instructor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/40 dark:bg-black/40 border border-white/40 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-blue-900 dark:text-white placeholder-blue-900/30 dark:placeholder-white/30 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 transition-all shadow-sm"
                    />
                </div>

                <div className="flex-grow overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${activeTab === 'all'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-amber-600/20'
                                : 'bg-white/60 dark:bg-white/5 text-blue-900/70 dark:text-white/40 border-transparent hover:bg-white/80 dark:hover:bg-white/10'
                                }`}
                        >
                            Todas
                        </button>
                        {disciplines.map(d => (
                            <button
                                key={d.id}
                                onClick={() => setActiveTab(d.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 border ${activeTab === d.id
                                    ? `bg-gradient-to-r ${d.gradient} text-white border-transparent shadow-lg`
                                    : 'bg-white/40 dark:bg-white/5 text-blue-900/40 dark:text-white/40 border-transparent hover:bg-white/60 dark:hover:bg-white/10'
                                    }`}
                            >
                                <d.icon className={activeTab === d.id ? "text-white" : d.accentColor} />
                                {d.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {sortedDays.map((day) => (
                    <motion.div
                        key={day}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/70 dark:bg-black/40 border border-white/40 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg shadow-cyan-500/5 flex flex-col transition-colors"
                    >
                        <div className="bg-white/60 dark:bg-white/5 px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center transition-colors">
                            <h3 className="text-lg font-black text-cyan-800 dark:text-white uppercase tracking-wider flex items-center gap-2 transition-colors">
                                <FaCalendarAlt className="text-cyan-600 dark:text-indigo-500 transition-colors" /> {day}
                            </h3>
                            <span className="text-xs font-bold bg-blue-100 dark:bg-white/10 text-blue-900 dark:text-gray-300 px-2 py-1 rounded-md transition-colors">
                                {groupedSchedule[day].length} Clases
                            </span>
                        </div>

                        <div className="p-4 space-y-3 flex-grow">
                            {groupedSchedule[day].sort((a, b) => a.time.localeCompare(b.time)).map((item) => {
                                const disciplineInfo = disciplines.find(d => d.id === item.type);
                                const lightModeColors: Record<string, { bg: string, text: string, border: string }> = {
                                    'mma': { bg: 'bg-sky-100', text: 'text-sky-700', border: 'group-hover:border-sky-200' },
                                    'boxing': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'group-hover:border-indigo-200' },
                                    'muay-thai': { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'group-hover:border-cyan-200' },
                                    'bjj': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'group-hover:border-blue-200' },
                                    'kickboxing': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'group-hover:border-purple-200' },
                                    'acondicionamiento': { bg: 'bg-green-100', text: 'text-green-700', border: 'group-hover:border-green-200' },
                                };

                                const style = lightModeColors[item.type] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };

                                return (
                                    <div
                                        key={item.id}
                                        className={`group relative bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${style.border}`}
                                    >
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button onClick={() => handleEdit(item)} className="p-2 bg-white shadow-sm text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-colors">
                                                <FaEdit size={12} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 bg-white shadow-sm text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-colors">
                                                <FaTrash size={12} />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-start mb-3 pr-16">
                                            <div className="flex items-center gap-4">
                                                {/* Adaptive Icon Container */}
                                                <div className={`p-3 rounded-xl shadow-sm dark:shadow-none transition-colors ${style.bg} dark:bg-gradient-to-br dark:${disciplineInfo?.gradient || 'from-gray-800 to-black'}`}>
                                                    {disciplineInfo?.icon ? (
                                                        <disciplineInfo.icon className={`${style.text} dark:${disciplineInfo.accentColor || "text-white"} text-lg`} />
                                                    ) : <FaDumbbell className="text-gray-500" />}
                                                </div>

                                                <div>
                                                    <h4 className={`text-base font-bold transition-colors ${style.text} dark:text-white`}>
                                                        {item.discipline}
                                                    </h4>
                                                    <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500">{item.level}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-black text-slate-800 dark:text-white block leading-none">{item.time}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-gray-500 font-medium">{item.duration}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-white/5 mt-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-white dark:border-transparent shadow-sm">
                                                    <FaUser size={10} className="text-slate-400 dark:text-gray-400" />
                                                </div>
                                                <span className="text-xs text-slate-600 dark:text-gray-300 font-semibold">{item.instructor}</span>
                                            </div>
                                            <div className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-500">
                                                {item.spots} Cupos
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            <Portal>
                <AnimatePresence>
                    {isModalOpen && editingClass && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-md"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 rounded-2xl p-6 w-full max-w-lg relative z-10 shadow-2xl transition-colors"
                            >
                                <h3 className="text-xl font-bold text-blue-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
                                    {editingClass.id ? <FaEdit className="text-blue-500" /> : <FaPlus className="text-blue-500" />}
                                    {editingClass.id ? 'Editar Clase' : 'Nueva Clase'}
                                </h3>

                                <form onSubmit={handleSave} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-blue-900/70 dark:text-gray-400 uppercase font-bold block mb-1">Día</label>
                                            <select
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-3 text-blue-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                                                value={editingClass.day}
                                                onChange={e => setEditingClass({ ...editingClass, day: e.target.value })}
                                            >
                                                {daysOrder.map(d => <option key={d} value={d} className="bg-white dark:bg-black text-black dark:text-white">{d}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-blue-900/70 dark:text-gray-400 uppercase font-bold block mb-1">Hora</label>
                                            <input
                                                type="time"
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-3 text-blue-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                                                value={editingClass.time}
                                                onChange={e => setEditingClass({ ...editingClass, time: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-blue-900/70 dark:text-gray-400 uppercase font-bold block mb-1">Disciplina Principal</label>
                                        <select
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-3 text-blue-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                                            value={editingClass.type}
                                            onChange={e => {
                                                const disc = disciplines.find(d => d.id === e.target.value);
                                                setEditingClass({
                                                    ...editingClass,
                                                    type: e.target.value,
                                                    discipline: disc ? disc.name : editingClass.discipline // Auto-fill name
                                                })
                                            }}
                                        >
                                            {disciplines.map(d => <option key={d.id} value={d.id} className="bg-white dark:bg-black text-black dark:text-white">{d.name}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs text-blue-900/70 dark:text-gray-400 uppercase font-bold block mb-1">Nombre Display (e.g. Sparring MMA)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-3 text-blue-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                                            value={editingClass.discipline}
                                            onChange={e => setEditingClass({ ...editingClass, discipline: e.target.value })}
                                            placeholder="Nombre específico de la clase"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-blue-900/70 dark:text-gray-400 uppercase font-bold block mb-1">Instructor</label>
                                            <input
                                                type="text"
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-3 text-blue-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                                                value={editingClass.instructor}
                                                onChange={e => setEditingClass({ ...editingClass, instructor: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-blue-900/70 dark:text-gray-400 uppercase font-bold block mb-1">Nivel</label>
                                            <input
                                                type="text"
                                                className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-lg p-3 text-blue-900 dark:text-white focus:border-blue-500 outline-none transition-colors"
                                                value={editingClass.level}
                                                onChange={e => setEditingClass({ ...editingClass, level: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-black/5 dark:border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 rounded-lg text-blue-900/40 dark:text-gray-400 hover:text-blue-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-sm"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-600 text-white font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50"
                                        >
                                            {isSaving ? 'Guardando...' : <><FaSave /> Guardar</>}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </Portal>
        </div>
    );
}
