'use client';

import { HeroSection } from '../index';

// Example usage of the Hero section feature
export default function HeroExample() {
  const handleCustomCtaClick = () => {
    // Custom CTA logic
    console.log('Custom CTA clicked');
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-['Poppins'] bg-[var(--background)] text-[var(--foreground)]">
      <HeroSection
        onCtaClick={handleCustomCtaClick}
        animationConfig={{
          duration: 1.2,
          delay: 0.1
        }}
      />
    </div>
  );
}