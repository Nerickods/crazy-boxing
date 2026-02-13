'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { enrollmentService } from '../services/enrollmentService';
import { EnrollmentData } from '../types';
import { useEnrollmentStore } from '../store/useEnrollmentStore';

export default function EnrollForm() {
    const [formData, setFormData] = useState<EnrollmentData>({
        name: '',
        email: '',
        visit_date: '',
        source: 'landing_hero_form'
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [token, setToken] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const { setEnrolled } = useEnrollmentStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await enrollmentService.submitEnrollment(formData);

            if (response.success) {
                setStatus('success');
                setToken(response.token || '');
                setEnrolled(true);
                setFormData({
                    name: '',
                    email: '',
                    visit_date: '',
                    source: 'landing_hero_form'
                });
            } else {
                throw new Error(response.error || 'Error al enviar el formulario');
            }
        } catch (error: any) {
            setStatus('error');
            setErrorMessage(error.message || 'Ocurrió un error inesperado. Por favor intenta de nuevo.');
        }
    };

    // Get today's date for min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full max-w-md mx-auto bg-black border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-3xl -z-10 transition-all duration-700 group-hover:bg-[var(--accent)]/20"></div>

            {/* Header Content Removed - Moved to Parent Section */}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2 group">
                    <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-[var(--accent)] transition-colors">
                        Nombre del Guerrero/a
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-zinc-900/50 border-b-2 border-white/10 px-4 py-4 text-white text-lg font-bold placeholder-white/10 focus:outline-none focus:border-[var(--accent)] focus:bg-zinc-800/50 transition-all rounded-t-lg"
                            placeholder="TU NOMBRE"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--accent)] transition-all duration-300 group-focus-within:w-full" />
                    </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2 group">
                    <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-[var(--accent)] transition-colors">
                        Email (Identificación)
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-zinc-900/50 border-b-2 border-white/10 px-4 py-4 text-white text-lg font-bold placeholder-white/10 focus:outline-none focus:border-[var(--accent)] focus:bg-zinc-800/50 transition-all rounded-t-lg"
                            placeholder="TU EMAIL"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--accent)] transition-all duration-300 group-focus-within:w-full" />
                    </div>
                </div>

                {/* Visit Date Input */}
                <div className="space-y-2 group">
                    <label htmlFor="visit_date" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1 group-focus-within:text-[var(--accent)] transition-colors">
                        ¿Cuándo vienes?
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id="visit_date"
                            name="visit_date"
                            required
                            min={today}
                            value={formData.visit_date}
                            onChange={handleChange}
                            className="w-full bg-zinc-900/50 border-b-2 border-white/10 px-4 py-4 text-white text-lg font-bold placeholder-white/10 focus:outline-none focus:border-[var(--accent)] focus:bg-zinc-800/50 transition-all rounded-t-lg uppercase [color-scheme:dark]"
                        />
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--accent)] transition-all duration-300 group-focus-within:w-full" />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] pointer-events-none opacity-50" />
                    </div>
                </div>

                {/* Submit Button (Hybrid: Native Functionality + Uiverse Design) */}
                <div className="pt-4 flex flex-col items-center">
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`
                            relative w-full h-[65px] rounded-[24px] border-none bg-blue-500/10
                            flex items-center justify-center p-2 cursor-pointer transition-all duration-300
                            shadow-[1px_1px_2px_0_rgba(255,255,255,0.2),_2px_2px_2px_rgba(0,0,0,0.1)_inset,_2px_2px_4px_rgba(0,0,0,0.1)_inset]
                            hover:shadow-[0_0_20px_rgba(0,123,255,0.6)] hover:-translate-y-[2px] active:translate-y-0 active:translate-z-[-4px]
                            group
                        `}
                    >
                        {/* Inner Button Shape */}
                        <div className={`
                            w-full h-full rounded-[16px] border-none
                            bg-gradient-to-br from-[#007BFF] to-[#00C6FF]
                            flex items-center justify-center gap-2 relative z-20
                            shadow-[1px_1px_2px_-1px_#fff_inset,_0_2px_1px_rgba(0,0,0,0.1),_0_4px_2px_rgba(0,0,0,0.1),_0_8px_4px_rgba(0,0,0,0.1)]
                            overflow-hidden
                        `}>
                            {/* Loading Spinner or Text */}
                            {status === 'loading' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="font-black text-white uppercase tracking-[0.05em] text-[16px] drop-shadow-sm">
                                    {status === 'success' ? '¡PASE GENERADO!' : '⚡ OBTENER ACCESO GRATIS'}
                                </span>
                            )}
                        </div>

                        {/* Pulse Dot Effect (Absolute to the main button wrapper) */}
                        <div className="absolute top-1/2 right-6 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400/50 border border-cyan-400/60 shadow-[0_0_10px_2px_rgba(0,255,255,0.3)] pointer-events-none z-30 group-hover:bg-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-all duration-300">
                            <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
                        </div>
                    </button>

                    <p className="text-[10px] text-center text-blue-200/40 uppercase tracking-widest mt-4 animate-pulse">
                        (Haz clic y recibe tu pase al instante)
                    </p>
                </div>
            </form>

            {/* Status Messages */}
            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <div className="text-sm text-green-200">
                                <p className="font-semibold text-green-400">¡Te esperamos!</p>
                                <p>Tu registro ha sido confirmado.</p>
                            </div>
                        </div>

                        {token && (
                            <div className="bg-black/30 p-3 rounded border border-white/10 text-center">
                                <p className="text-xs text-white/60 mb-1 uppercase tracking-wider">Tu Código de Acceso</p>
                                <p className="text-2xl font-mono font-bold text-[var(--accent)] tracking-widest bg-white/5 py-2 rounded select-all">{token}</p>
                                <p className="text-[10px] text-white/40 mt-1">Presenta este código en recepción</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-indigo-200">
                            <p className="font-semibold text-indigo-400">Error</p>
                            <p>{errorMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
