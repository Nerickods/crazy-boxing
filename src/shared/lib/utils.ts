import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Preset de clases glassmorphism para uso rápido
export const glass = {
    base: 'bg-white/10 backdrop-blur-lg border border-white/20',
    panel: 'bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl',
    card: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl',
    button: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl transition-all active:scale-95',
    input: 'bg-white/5 backdrop-blur-md border border-white/10 focus:border-white/30 rounded-xl transition-all outline-none',
    modal: 'bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl',
};
