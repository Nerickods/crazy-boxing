'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { enrollmentService } from '../services/enrollmentService';
import { EnrollmentData } from '../types';
import UiverseButton from '@/shared/components/UiverseButton';
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
        <div className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-[15px] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-3xl -z-10 transition-all duration-700 group-hover:bg-[var(--accent)]/20"></div>

            {/* Header Content Removed - Moved to Parent Section */}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-medium text-white/70 ml-1">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                        placeholder="Tu Nombre"
                    />
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-medium text-white/70 ml-1">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all"
                        placeholder="Tu mejor email"
                    />
                </div>

                {/* Visit Date Input */}
                <div className="space-y-1">
                    <label htmlFor="visit_date" className="text-xs font-medium text-white/70 ml-1">Día de tu Visita</label>
                    <div className="relative">
                        <input
                            type="date"
                            id="visit_date"
                            name="visit_date"
                            required
                            min={today}
                            value={formData.visit_date}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all [color-scheme:dark]"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                    <UiverseButton
                        text={status === 'loading' ? "Enviando..." : status === 'success' ? "¡Registro Confirmado!" : "Confirmar Visita Gratuita"}
                        type="submit"
                        isSuccess={status === 'success'}
                        className="w-full"
                    />
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
