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


            {/* Sidebar */}
            <AdminSidebar user={user} />

            {/* Main content Area - Full width on mobile, with left margin on desktop */}
            <main className="min-h-screen relative z-10 px-4 pt-20 pb-4 md:pt-4 md:pl-80 transition-all duration-300">
                <div className="min-h-[calc(100vh-2rem)] bg-white/60 dark:bg-black/20 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-white/5 overflow-hidden shadow-2xl transition-all duration-300 relative group/main">
                    {/* Background Image - Light Mode */}
                    <div className="absolute inset-0 z-0 opacity-100 dark:opacity-0 transition-opacity duration-500 pointer-events-none">
                        <img
                            src="/assets/sections/admin-light-bg.png"
                            alt="Main Content Background Light"
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>

                    {/* Background Image - Dark Mode */}
                    <div className="absolute inset-0 z-0 opacity-0 dark:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <img
                            src="/assets/sections/testimonials-bg.png"
                            alt="Main Content Background"
                            className="w-full h-full object-cover opacity-50"
                        />
                    </div>

                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
