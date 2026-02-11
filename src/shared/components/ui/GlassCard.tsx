import React from "react";
import { cn, glass } from "@/shared/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "basic" | "premium" | "holographic";
    hoverEffect?: boolean;
}

export function GlassCard({
    children,
    className,
    variant = "basic",
    hoverEffect = false,
    ...props
}: GlassCardProps) {

    const variants = {
        basic: glass.card,
        premium: cn(
            glass.card,
            "bg-gradient-to-br from-white/10 to-white/5 text-white overflow-hidden relative"
        ),
        holographic: cn(
            glass.card,
            "bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
            "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000",
            "overflow-hidden relative"
        )
    };

    return (
        <div
            className={cn(
                variants[variant],
                hoverEffect && "hover:shadow-2xl hover:scale-[1.01] transition-all duration-300",
                "p-6",
                className
            )}
            {...props}
        >
            {variant === "premium" && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
