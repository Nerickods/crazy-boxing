'use client'

interface QualityBadgeProps {
    label: string
    count: number
    color: 'green' | 'yellow' | 'orange' | 'red'
}

export function QualityBadge({
    label,
    count,
    color,
}: QualityBadgeProps) {
    const colorClasses = {
        green: 'bg-green-500/5 dark:bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20 hover:bg-green-500/10',
        yellow: 'bg-blue-500/5 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 hover:bg-blue-500/10',
        orange: 'bg-cyan-500/5 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/10',
        red: 'bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/10',
    }

    return (
        <div className={`p-4 rounded-xl border backdrop-blur-sm transition-colors duration-300 ${colorClasses[color]}`}>
            <p className="text-3xl font-bold mb-1 tracking-tight">{count}</p>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{label}</p>
        </div>
    )
}

export function SeverityBadge({ severity }: { severity: 'critical' | 'high' | 'medium' }) {
    const classes = {
        critical: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
        high: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30',
        medium: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
    }

    return (
        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${classes[severity]}`}>
            {severity}
        </span>
    )
}
