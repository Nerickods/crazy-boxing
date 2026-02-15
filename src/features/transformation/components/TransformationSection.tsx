'use client';

import PainToPowerStory from './PainToPowerStory';

export default function TransformationSection() {
    return (
        <section className="relative min-h-[100dvh] bg-black overflow-hidden flex items-center justify-center">
            {/* Background Image - Full Screen */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/sections/transformation_blue.png"
                    alt="Gym Atmosphere"
                    className="w-full h-full object-cover opacity-100 brightness-110 saturate-110"
                />
            </div>

            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none z-0" />

            {/* Radial Gradient for Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40 z-0" />

            {/* --- SMOOTH TRANSITION GRADIENTS --- */}
            {/* Top Gradient (Blends with Essence) */}
            <div className="absolute top-0 left-0 right-0 h-32 md:h-64 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
            {/* Bottom Gradient (Blends with WhyAndTeam) */}
            <div className="absolute bottom-0 left-0 right-0 h-32 md:h-64 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <PainToPowerStory />
            </div>
        </section>
    );
}
