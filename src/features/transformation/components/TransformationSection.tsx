'use client';

import PainToPowerStory from './PainToPowerStory';

export default function TransformationSection() {
    return (
        <section className="relative min-h-[100dvh] bg-black overflow-hidden flex items-center justify-center">
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            {/* Radial Gradient for Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--background)_0%,_black_100%)] opacity-80" />

            <div className="container mx-auto relative z-10">
                <PainToPowerStory />
            </div>
        </section>
    );
}
