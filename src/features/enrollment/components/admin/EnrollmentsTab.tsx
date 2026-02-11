'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    FaSearch, FaFilter, FaCommentDots, FaUser, FaEnvelope,
    FaCalendarCheck, FaGlobe, FaRobot, FaMailBulk
} from 'react-icons/fa';
import Link from 'next/link';
import { SavedEnrollment } from '../../services/enrollmentServerService';
import EmailRecommendationModal from './EmailRecommendationModal';

interface EnrollmentsTabProps {
    initialData: SavedEnrollment[];
}

export default function EnrollmentsTab({ initialData }: EnrollmentsTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSource, setFilterSource] = useState<'all' | 'landing_form' | 'chat_agent'>('all');
    const [enrollments, setEnrollments] = useState<SavedEnrollment[]>(initialData);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState<SavedEnrollment | null>(null);

    const filteredData = enrollments.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email.toLowerCase().includes(searchTerm.toLowerCase());

        // Match web sources (anything that's not chat_agent)
        const isWebSource = item.source !== 'chat_agent';
        const matchesSource = filterSource === 'all' ||
            (filterSource === 'chat_agent' && item.source === 'chat_agent') ||
            (filterSource === 'landing_form' && isWebSource);

        return matchesSearch && matchesSource;
    });

    const getSourceIcon = (source: string) => {
        if (source === 'chat_agent') return <FaRobot className="text-[var(--accent)]" />;
        return <FaGlobe className="text-blue-400" />;
    };

    const getConversationId = (metadata: unknown) => {
        if (!metadata) return null;
        // Handle both string JSON or object (Supabase returns object usually)
        const meta = typeof metadata === 'string' ? JSON.parse(metadata) : metadata as Record<string, unknown>;
        return meta?.conversation_id as string | undefined;
    };

    // Handle opening email recommendation modal
    const handleOpenEmailModal = useCallback((enrollment: SavedEnrollment) => {
        setSelectedEnrollment(enrollment);
        setIsModalOpen(true);
    }, []);

    // Handle successful contact update
    const handleContactedSuccess = useCallback((updatedEnrollment: SavedEnrollment) => {
        setEnrollments(prev =>
            prev.map(e => e.id === updatedEnrollment.id ? updatedEnrollment : e)
        );
    }, []);

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-blue-900 dark:text-white uppercase tracking-tighter transition-colors">
                        Solicitudes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Ingreso</span>
                    </h2>
                    <p className="text-blue-900/60 dark:text-white/50 text-sm mt-1 transition-colors">
                        Gestión de leads provenientes de Landing y Chatbot.
                    </p>
                </div>

                <div className="bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-xl px-4 py-2 backdrop-blur-xl shadow-lg shadow-cyan-500/5 transition-colors">
                    <span className="text-xs text-blue-900/40 dark:text-white/40 uppercase tracking-widest block font-bold transition-colors">Total </span>
                    <span className="text-xl font-bold text-blue-900 dark:text-white transition-colors">{enrollments.length}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white/60 dark:bg-black/20 p-4 rounded-2xl border border-white/40 dark:border-white/5 backdrop-blur-xl shadow-lg shadow-cyan-500/5 transition-colors">
                {/* Search */}
                <div className="relative flex-grow max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900/30 dark:text-white/30 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/40 dark:bg-black/40 border border-white/40 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-blue-900 dark:text-white placeholder-blue-900/30 dark:placeholder-white/30 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-blue-500/50 transition-all shadow-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterSource('all')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${filterSource === 'all'
                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'bg-white/40 dark:bg-white/5 text-blue-900/40 dark:text-white/40 border-transparent hover:bg-white/60 dark:hover:bg-white/10'
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilterSource('landing_form')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${filterSource === 'landing_form'
                            ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'bg-white/40 dark:bg-white/5 text-blue-900/40 dark:text-white/40 border-transparent hover:bg-white/60 dark:hover:bg-white/10'
                            }`}
                    >
                        <FaGlobe /> Web
                    </button>
                    <button
                        onClick={() => setFilterSource('chat_agent')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${filterSource === 'chat_agent'
                            ? 'bg-gradient-to-r from-blue-400 to-indigo-600 text-white border-transparent shadow-lg shadow-cyan-500/20'
                            : 'bg-white/40 dark:bg-white/5 text-blue-900/40 dark:text-white/40 border-transparent hover:bg-white/60 dark:hover:bg-white/10'
                            }`}
                    >
                        <FaRobot /> IA
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-lg shadow-cyan-500/5 transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/40 dark:bg-white/5 text-blue-900/40 dark:text-white/40 text-xs uppercase tracking-wider border-b border-black/5 dark:border-white/10 transition-colors">
                                <th className="p-4 font-bold">Fecha</th>
                                <th className="p-4 font-bold">Usuario</th>
                                <th className="p-4 font-bold">Horario Pref.</th>
                                <th className="p-4 font-bold text-center">Origen</th>
                                <th className="p-4 font-bold text-center">Estado</th>
                                <th className="p-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {filteredData.map((item, index) => {
                                const conversationId = getConversationId(item.metadata);
                                return (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="text-sm text-blue-900/80 dark:text-white/80 hover:bg-white/60 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4 text-xs font-medium">
                                            {format(new Date(item.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-blue-900 dark:text-white flex items-center gap-2 transition-colors">
                                                    <FaUser className="text-blue-900/30 dark:text-white/30 text-[10px]" /> {item.name}
                                                </span>
                                                <span className="text-xs text-blue-900/50 dark:text-white/50 flex items-center gap-2 transition-colors">
                                                    <FaEnvelope className="text-[10px]" /> {item.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {item.preferred_schedule ? (
                                                <span className="flex items-center gap-2 bg-blue-500/10 dark:bg-white/5 px-2 py-1 rounded-md w-fit text-blue-900/80 dark:text-white/80 transition-colors">
                                                    <FaCalendarCheck className="text-blue-500 dark:text-indigo-500" />
                                                    {item.preferred_schedule}
                                                </span>
                                            ) : (
                                                <span className="text-blue-900/30 dark:text-white/30 italic transition-colors">No especificado</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2 text-blue-900/80 dark:text-white/80" title={item.source}>
                                                {getSourceIcon(item.source)}
                                                <span className="capitalize text-xs">{item.source === 'chat_agent' ? 'Assistant' : 'Web'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${item.status === 'new' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' :
                                                item.status === 'contacted' ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' :
                                                    'bg-blue-900/5 dark:bg-white/5 border-blue-900/10 dark:border-white/10 text-blue-900/40 dark:text-white/40'
                                                }`}>
                                                {item.status === 'new' ? 'Nuevo' : item.status === 'contacted' ? 'Contactado' : item.status || 'Nuevo'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Email Recommendation Button */}
                                                <button
                                                    onClick={() => handleOpenEmailModal(item)}
                                                    className="inline-flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-lg transition-colors border border-purple-500/20"
                                                    title="Ver recomendación de email"
                                                >
                                                    <FaMailBulk /> <span className="text-xs font-bold">Email</span>
                                                </button>

                                                {/* Chat Button */}
                                                {conversationId && (
                                                    <Link
                                                        href={`/admin/conversations/${conversationId}`}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg transition-colors border border-blue-500/20"
                                                        title="Ver conversación completa"
                                                    >
                                                        <FaCommentDots /> <span className="text-xs font-bold">Chat</span>
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredData.length === 0 && (
                <div className="text-center py-20 text-blue-900/40 dark:text-white/40 transition-colors">
                    <p>No se encontraron registros.</p>
                </div>
            )}

            {/* Email Recommendation Modal */}
            <EmailRecommendationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                enrollment={selectedEnrollment}
                onContactedSuccess={handleContactedSuccess}
            />
        </div>
    );
}

