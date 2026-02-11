import { motion } from 'framer-motion';
import Image from 'next/image';
import { HeroCarouselImage } from '../types/hero';
import { handleImageError } from '../services/heroData';

interface InfiniteCarouselRowProps {
    images: HeroCarouselImage[];
    direction: 'left' | 'right';
    duration: number;
}

export default function InfiniteCarouselRow({ images, direction, duration }: InfiniteCarouselRowProps) {
    // Duplication strategy:
    // Mobile: 2 sets is usually enough if the row width > viewport
    // Desktop: 3-4 sets for safety.
    // We'll use 3 sets as a balance.
    const duplicatedImages = [...images, ...images, ...images];

    return (
        <div className="relative w-full h-full overflow-hidden bg-black select-none">
            <motion.div
                className="flex h-full"
                style={{
                    width: "max-content",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden" // Safari fix
                }}
                animate={{
                    x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%']
                }}
                transition={{
                    duration: duration,
                    ease: 'linear',
                    repeat: Infinity,
                }}
            >
                {duplicatedImages.map((image, index) => (
                    <div
                        key={`${image.src}-${index}`}
                        className="relative h-full flex-shrink-0 border-r border-white/5 last:border-r-0"
                        style={{
                            width: 'clamp(280px, 33vw, 500px)', // Better responsive width
                            height: '100%'
                        }}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                            onError={(e) => handleImageError(e, image.fallback)}
                            priority={index < 4}
                            sizes="(max-width: 768px) 80vw, 33vw"
                            quality={75} // Slight reduction for performance
                            draggable={false}
                        />
                        {/* Subtle overlay for better text contrast if needed later */}
                        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
