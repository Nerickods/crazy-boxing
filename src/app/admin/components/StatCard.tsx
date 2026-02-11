'use client'

import Link from 'next/link'

interface StatCardProps {
    label: string
    value: string | number
    icon: string
    color?: 'white' | 'green' | 'yellow' | 'red'
    href: string
}

export function StatCard({
    label,
    value,
    icon,
    color = 'white',
    href
}: StatCardProps) {
    const icons: Record<string, JSX.Element> = {
        chat: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
        message: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />,
        check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
        pending: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    }

    const colorClasses = {
        white: 'from-black via-black/80 to-black/60 dark:from-white dark:via-white/80 dark:to-white/60',
        green: 'from-green-600 to-green-400 dark:from-green-400 dark:to-green-200',
        yellow: 'from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200',
        red: 'from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-200',
    }

    return (
        <Link
            href={href}
            className="relative overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-xl md:rounded-2xl border border-black/5 dark:border-white/10 p-3 md:p-6 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-cyan-500/10 hover:border-blue-500/20 dark:hover:border-indigo-500/20"
        >
            <div className="absolute top-0 right-0 p-2 md:p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <svg className="w-10 h-10 md:w-16 md:h-16 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icons[icon] || icons.chat}
                </svg>
            </div>

            <div className="relative z-10">
                <p className="text-black/50 dark:text-white/40 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1 md:mb-2 flex items-center gap-1.5 md:gap-2 line-clamp-1">
                    <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-current shrink-0 ${color === 'white' ? 'text-black/20 dark:text-white/20' : `text-${color}-500`}`} />
                    <span className="truncate">{label}</span>
                </p>
                <p className={`text-2xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${colorClasses[color]}`}>
                    {value}
                </p>
            </div>

            {/* Bottom highlight line */}
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 w-full ${color === 'white' ? 'text-black/10 dark:text-white/10' : `text-${color}-500`}`} />
        </Link>
    )
}
