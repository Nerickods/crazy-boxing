import { cn } from "@/shared/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/shared/components/ui/testimonial-card"

interface TestimonialsSectionProps {
    title: React.ReactNode
    description: string
    testimonials: Array<{
        author: TestimonialAuthor
        text: string
        href?: string
    }>
    className?: string
}

export function TestimonialsSection({
    title,
    description,
    testimonials,
    className
}: TestimonialsSectionProps) {
    // Triple the testimonials to ensure seamless loop
    const marqueeItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials];

    return (
        <section className={cn(
            "bg-black relative overflow-hidden",
            "py-24 md:py-32",
            className
        )}>
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <picture>
                    <img
                        src="/assets/sections/testimonials-bg.png"
                        alt="Testimonials Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-screen">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black_80%,transparent)]"></div>
            </div>

            <div className="relative z-20 flex flex-col items-center gap-12 sm:gap-16">

                {/* Header */}
                <div className="flex flex-col items-center gap-6 px-4 text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-[0.9] uppercase drop-shadow-2xl">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl font-medium text-gray-400 max-w-2xl leading-relaxed">
                        {description}
                    </p>
                    <div className="h-1 w-24 bg-[var(--accent)] rounded-full mt-2"></div>
                </div>

                {/* Marquee Container */}
                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">

                    <div className="group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] flex-row w-full [--duration:40s]">
                        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused] min-w-full">
                            {marqueeItems.map((testimonial, i) => (
                                <TestimonialCard
                                    key={`t1-${i}`}
                                    {...testimonial}
                                />
                            ))}
                        </div>
                        {/* Duplicate for seamless loop - Absolute positioning strategy might be needed if standard flex gap fails, 
                 but standard CSS marquee usually relies on identical duplicate content. 
                 
                 However, the best way for infinite marquee is:
                 [Content] [Content]
                 Animating translateX from 0 to -50% (if total width is 200%)
                 
                 Here we are using tailwind `animate-marquee` which usually goes 0 to -100%.
                 We need TWO copies of the content in the flex container.
             */}
                        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused] min-w-full" aria-hidden="true">
                            {marqueeItems.map((testimonial, i) => (
                                <TestimonialCard
                                    key={`t2-${i}`}
                                    {...testimonial}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Fade Edges */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent z-20" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent z-20" />
                </div>
            </div>
        </section>
    )
}
