'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaUserPlus, FaArrowRight } from 'react-icons/fa';

interface NewRegistrationsProps {
    count: number;
}

export default function NewRegistrations({ count }: NewRegistrationsProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(false);

    // If count is 0 or user hid it manually, don't show
    if (count === 0 || !isVisible) return null;

    const callMarkAsReadApi = async () => {
        try {
            await fetch('/api/enrollments/mark-read', {
                method: 'POST',
            });
            // We don't wait for the response to hide the UI for better perceived performance
            // logic is handled optimistically below
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAsRead = async () => {
        setLoading(true);
        // Optimistic UI update: Hide immediately
        setIsVisible(false);

        await callMarkAsReadApi();

        setLoading(false);
    };

    const handleViewRequests = () => {
        // When viewing, we also want to optimistically hide the alert
        // knowing the user is going to address them
        setIsVisible(false);
        // Fire and forget - mark as read in background since they are viewing them
        callMarkAsReadApi();
    };

    return (
        <div className="p-1 rounded-2xl bg-gradient-to-r from-blue-400 via-cyan-500 to-indigo-600 animate-pulse-slow mb-6">
            <div className="bg-white dark:bg-black rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                        <FaUserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-black dark:text-white">
                            {count} Nuevas Solicitudes
                        </h3>
                        <p className="text-sm text-black/60 dark:text-white/60">
                            Usuarios esperando contacto para su clase de prueba.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleMarkAsRead}
                        disabled={loading}
                        className="text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white underline decoration-dotted transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : 'Marcar como leídas'}
                    </button>

                    <Link
                        href="/admin/enrollments"
                        onClick={handleViewRequests}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:scale-105 transition-transform"
                    >
                        Ver Solicitudes <FaArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}
