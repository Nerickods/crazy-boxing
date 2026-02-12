'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { signout } from '@/actions/auth'
import { Menu, X, Ticket } from 'lucide-react'

interface AdminSidebarProps {
    user: {
        email?: string
        full_name?: string
    } | any
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <>
            {/* Mobile Toggle Button - Always visible on mobile when sidebar closed */}
            <button
                onClick={() => setIsOpen(true)}
                className={`md:hidden fixed top-4 left-4 z-40 p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all duration-200 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                aria-label="Abrir menú"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Container - Hidden off-screen on mobile by default */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex flex-col
                    w-72 max-w-[85vw]
                    bg-white/95 dark:bg-black/95 md:bg-white/70 md:dark:bg-black/40
                    backdrop-blur-2xl border-r md:border border-white/40 dark:border-white/10
                    md:rounded-3xl shadow-2xl shadow-cyan-500/20 dark:shadow-black/50
                    transform transition-transform duration-300 ease-out
                    md:top-4 md:bottom-4 md:left-4
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="md:hidden absolute top-4 right-4 p-2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                            <span className="font-bold text-white text-xs">CB</span>
                        </div>
                        <h1 className="text-lg font-bold text-blue-950 dark:text-white tracking-wide transition-colors truncate">Crazy Boxing</h1>
                    </div>
                    <p className="text-xs text-blue-900/70 dark:text-white/40 font-medium pl-11 transition-colors truncate">{user.full_name || user.email || 'Admin User'}</p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/10 dark:via-white/10 to-transparent mx-8 mb-6 transition-colors shrink-0" />

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar overscroll-contain">
                    <NavLink href="/admin" icon="home">
                        Dashboard
                    </NavLink>
                    <NavLink href="/admin/hours" icon="clock">
                        Horarios
                    </NavLink>
                    <NavLink href="/admin/enrollments" icon="users">
                        Inscripciones
                    </NavLink>
                    <NavLink href="/admin/plans" icon="list">
                        Planes M.
                    </NavLink>

                    <NavLink href="/admin/conversations" icon="chat">
                        Conversaciones
                    </NavLink>
                    <NavLink href="/admin/analytics" icon="chart">
                        Analíticas
                    </NavLink>
                    <NavLink href="/admin/redemption" icon="ticket">
                        Validar Citas
                    </NavLink>
                    <NavLink href="/admin/settings" icon="settings">
                        Configuración
                    </NavLink>
                </nav>

                <div className="px-8 pb-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-black/40 dark:text-white/40 font-medium uppercase tracking-wider">Modo</span>
                        <ThemeToggle />
                    </div>
                </div>

                <div className="p-4 mx-4 mb-4 mt-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3 relative overflow-hidden group transition-colors shrink-0">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <Link
                        href="/"
                        className="flex items-center gap-3 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white text-xs font-medium transition-colors relative z-10"
                    >
                        <div className="p-1.5 rounded-md bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </div>
                        Volver al Sitio
                    </Link>

                    <form action={signout} className="relative z-10">
                        <button
                            type="submit"
                            className="flex items-center gap-3 text-indigo-500/70 hover:text-indigo-500 dark:text-indigo-400/70 dark:hover:text-indigo-300 text-xs font-medium transition-colors w-full"
                        >
                            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-500/60 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>
        </>
    )
}

function NavLink({
    href,
    icon,
    children,
}: {
    href: string
    icon: 'home' | 'chat' | 'chart' | 'settings' | 'list' | 'tag' | 'dumbbell' | 'users' | 'ticket' | 'clock'
    children: React.ReactNode
}) {
    const icons = {
        home: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        ),
        chat: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        ),
        chart: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        ),
        settings: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        ),
        list: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        ),
        tag: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        ),
        dumbbell: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        ),
        users: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        ),
        ticket: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2zm0 14v-2a2 2 0 01-2-2H5a2 2 0 01-2 2v2a2 2 0 012 2h8a2 2 0 012-2zm-2-8a2 2 0 00-2 2v2a2 2 0 002 2 2 2 0 002-2v-2a2 2 0 00-2-2zm7-7v20M20 7v2a2 2 0 100 4v2a2 2 0 100 4v2" />
        ),
        clock: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        ),
    }

    // NavLink Component with new branding colors
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-900/80 dark:text-white/60 hover:text-blue-950 dark:hover:text-white hover:bg-cyan-100/50 dark:hover:bg-white/10 transition-all group relative overflow-hidden"
        >
            {/* Active/Hover Indicator - New Gradient (Amber to Red) */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full" />

            <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:text-cyan-600 dark:group-hover:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                {icons[icon]}
            </svg>
            <span className="font-medium tracking-wide text-sm">{children}</span>
        </Link>
    )
}
