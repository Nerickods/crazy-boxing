'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCopy, FaCheck, FaUserCheck, FaEnvelope, FaRobot, FaGlobe } from 'react-icons/fa';
import { SavedEnrollment } from '../../services/enrollmentServerService';
import { generateEmailForEnrollment, getFullEmailText } from '../../utils/emailTemplates';
import { Portal } from '@/shared/components/Portal';

interface EmailRecommendationModalProps {
    isOpen: boolean;
    onClose: () => void;
    enrollment: SavedEnrollment | null;
    onContactedSuccess: (updatedEnrollment: SavedEnrollment) => void;
}

export default function EmailRecommendationModal({
    isOpen,
    onClose,
    enrollment,
    onContactedSuccess
}: EmailRecommendationModalProps) {
    const [emailContent, setEmailContent] = useState('');
    const [contactedBy, setContactedBy] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate email when enrollment changes
    useEffect(() => {
        if (enrollment) {
            const template = generateEmailForEnrollment(enrollment);
            setEmailContent(getFullEmailText(template));
            setContactedBy('');
            setError(null);
        }
    }, [enrollment]);

    // Handle copy to clipboard
    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(emailContent);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [emailContent]);

    // Handle mark as contacted
    const handleMarkContacted = useCallback(async () => {
        if (!enrollment || !contactedBy.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/enrollments/${enrollment.id}/mark-contacted`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contacted_by: contactedBy.trim() }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al marcar como contactado');
            }

            const updatedEnrollment = await response.json();
            onContactedSuccess(updatedEnrollment);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSubmitting(false);
        }
    }, [enrollment, contactedBy, onContactedSuccess, onClose]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!enrollment) return null;

    const isChatAgent = enrollment.source === 'chat_agent';
    const canMarkContacted = contactedBy.trim().length > 0;

    return (
        <Portal>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        {/* Backdrop - Same style as DisciplinesTab */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-md"
                            onClick={onClose}
                        />

                        {/* Modal - Centered with scale animation */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl transition-colors flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/10 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-xl shadow-sm ${isChatAgent ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 'bg-blue-500'}`}>
                                        {isChatAgent ? (
                                            <FaRobot className="text-white text-lg" />
                                        ) : (
                                            <FaGlobe className="text-white text-lg" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-900 dark:text-white">
                                            Recomendación de Email
                                        </h3>
                                        <p className="text-xs text-blue-900/60 dark:text-white/50">
                                            {isChatAgent ? 'Lead del Asistente IA' : 'Lead del Formulario Web'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                >
                                    <FaTimes className="text-blue-900/60 dark:text-white/60" />
                                </button>
                            </div>

                            {/* Lead Info */}
                            <div className="p-4 bg-blue-50/50 dark:bg-white/5 border-b border-black/5 dark:border-white/10 shrink-0">
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-2 text-blue-900 dark:text-white font-medium">
                                        <FaEnvelope className="text-blue-500" />
                                        {enrollment.name}
                                    </span>
                                    <span className="text-blue-900/50 dark:text-white/50">
                                        {enrollment.email}
                                    </span>
                                </div>
                            </div>

                            {/* Email Content - Scrollable */}
                            <div className="flex-1 p-5 overflow-auto">
                                <label className="block text-xs font-bold text-blue-900/60 dark:text-white/40 uppercase tracking-wider mb-2">
                                    Copy del Email (editable)
                                </label>
                                <textarea
                                    value={emailContent}
                                    onChange={(e) => setEmailContent(e.target.value)}
                                    className="w-full h-56 p-4 bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl text-sm text-blue-900 dark:text-white/90 resize-none focus:outline-none focus:border-blue-500 font-mono transition-colors"
                                    placeholder="El contenido del email aparecerá aquí..."
                                />

                                {/* Copy Button */}
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isCopied
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30'
                                            }`}
                                    >
                                        {isCopied ? (
                                            <>
                                                <FaCheck /> ¡Copiado!
                                            </>
                                        ) : (
                                            <>
                                                <FaCopy /> Copiar Todo
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Footer - Mark as Contacted */}
                            <div className="p-5 border-t border-black/5 dark:border-white/10 bg-zinc-50 dark:bg-black/20 shrink-0">
                                {error && (
                                    <div className="mb-3 p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-blue-900/60 dark:text-white/40 uppercase tracking-wider mb-1">
                                            Contactado por
                                        </label>
                                        <input
                                            type="text"
                                            value={contactedBy}
                                            onChange={(e) => setContactedBy(e.target.value)}
                                            placeholder="Ingresa tu nombre..."
                                            className="w-full px-3 py-2.5 bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg text-sm text-blue-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div className="flex items-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2.5 rounded-lg text-blue-900/40 dark:text-gray-400 hover:text-blue-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-sm"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleMarkContacted}
                                            disabled={!canMarkContacted || isSubmitting}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${canMarkContacted && !isSubmitting
                                                ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40'
                                                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <FaUserCheck />
                                            {isSubmitting ? 'Guardando...' : 'Marcar Contactado'}
                                        </button>
                                    </div>
                                </div>

                                {!canMarkContacted && (
                                    <p className="mt-2 text-xs text-blue-900/40 dark:text-white/30">
                                        Ingresa tu nombre para habilitar el botón
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Portal>
    );
}

