import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar"
import { Star } from "lucide-react"

export interface TestimonialAuthor {
    name: string
    handle: string
    avatar?: string
    color?: string // Tailwind bg class
}

export interface TestimonialCardProps {
    author: TestimonialAuthor
    text: React.ReactNode
    href?: string
    className?: string
}

export function TestimonialCard({
    author,
    text,
    href,
    className
}: TestimonialCardProps) {
    const Card = href ? 'a' : 'div'

    return (
        <Card
            {...(href ? { href } : {})}
            className={cn(
                "flex flex-col rounded-xl border",
                "bg-black/20 backdrop-blur-sm border-white/5",
                "p-6 text-start sm:p-8",
                "hover:border-[var(--accent)]/50 hover:bg-black/60 hover:shadow-[0_0_30px_-10px_rgba(0,255,255,0.15)]",
                "w-[350px] sm:w-[400px] shrink-0", // Fixed width for marquee consistency
                "transition-all duration-500 group/card",
                className
            )}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-white/10 group-hover/card:border-[var(--accent)] transition-colors duration-500">
                        {author.avatar && <AvatarImage src={author.avatar} alt={author.name} className="object-cover" />}
                        <AvatarFallback
                            className={cn(
                                "text-white font-bold text-xl",
                                (!author.color || !author.color.startsWith('#')) ? (author.color || "bg-zinc-900") : ""
                            )}
                            style={author.color?.startsWith('#') ? { backgroundColor: author.color } : undefined}
                        >
                            {author.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    {/* Active Status Dot */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--accent)] rounded-full border-2 border-black shadow-[0_0_10px_var(--accent)]"></div>
                </div>

                <div className="flex flex-col items-start">
                    <h3 className="text-lg font-bold leading-none text-white uppercase tracking-wide group-hover/card:text-[var(--accent)] transition-colors duration-300">
                        {author.name}
                    </h3>
                    <div className="flex gap-0.5 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="relative z-10 text-base text-gray-300 leading-relaxed font-light group-hover/card:text-white transition-colors duration-300">
                    {text}
                </div>
            </div>
        </Card>
    )
}
