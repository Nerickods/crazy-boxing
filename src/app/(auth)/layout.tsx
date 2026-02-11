export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden selection:bg-blue-500/30">
            {/* Aurora Background Effect */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[120px] animate-float-bg" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-cyan-600/5 rounded-full blur-[100px] animate-float-bg" style={{ animationDelay: '2s' }} />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700 slide-in-from-bottom-10">
                {children}
            </div>
        </div>
    )
}
