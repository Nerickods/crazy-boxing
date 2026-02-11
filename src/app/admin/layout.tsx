import { redirect } from 'next/navigation'
import { cache } from 'react'
import { createClient } from '@/shared/lib/supabase/server'
import { AdminSidebar } from './components/AdminSidebar'

// Memoize getAdminUser for the entire request tree
// This prevents duplicate auth checks within the same navigation
// Memoize getAdminUser for the entire request tree
// This prevents duplicate auth checks within the same navigation
const getAdminUser = cache(async () => {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) return null

        const { data: profile } = await supabase
            .from('profiles')
            .select('role, email, full_name')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') return null

        return { ...user, ...profile }
    } catch (e) {
        console.error('Admin Layout Auth Error:', e)
        return null
    }
})

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getAdminUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="relative min-h-screen bg-white dark:bg-black overflow-hidden selection:bg-blue-400/30 dark:selection:bg-indigo-500/30 transition-colors duration-300">
            {/* Base Aurora Background - Dark (New Branding: Red/Amber dominant with deep accents) */}
            <div className="fixed inset-0 z-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[128px] animate-float-bg" />
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-900/20 rounded-full blur-[128px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-950/30 rounded-full blur-[128px] animate-float-bg" style={{ animationDelay: '2s' }} />
            </div>

            {/* Base Aurora Background - Light (Vibrant Orange Upgrade) */}
            <div className="fixed inset-0 z-0 opacity-100 dark:opacity-0 transition-opacity duration-500">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/20 rounded-full blur-[140px] animate-float-bg" />
                <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[140px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full blur-[140px] animate-float-bg" style={{ animationDelay: '2s' }} />
            </div>

            {/* Sidebar */}
            <AdminSidebar user={user} />

            {/* Main content Area - Full width on mobile, with left margin on desktop */}
            <main className="min-h-screen relative z-10 px-4 pt-20 pb-4 md:pt-4 md:pl-80 transition-all duration-300">
                <div className="min-h-[calc(100vh-2rem)] bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/5 overflow-hidden shadow-2xl transition-all duration-300">
                    {children}
                </div>
            </main>
        </div>
    )
}
