'use client'

import { useThemeStore } from '@/shared/stores/themeStore'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return <div className="w-8 h-8" /> // Avoid hydration mismatch

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl transition-all duration-300 group overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Toggle Theme"
        >
            <div className={`relative z-10 transform transition-transform duration-500 ${theme === 'dark' ? 'rotate-0' : 'rotate-180'}`}>
                {theme === 'dark' ? (
                    // Moon Icon (Dark Mode)
                    <svg className="w-5 h-5 text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                ) : (
                    // Sun Icon (Light Mode) - Yellow/Red accents as requested
                    <svg className="w-5 h-5 text-sky-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )}
            </div>

            {/* Glow Effects */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-sky-500/10'}`} />
        </button>
    )
}
