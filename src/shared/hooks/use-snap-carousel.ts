
import { useState, useEffect, useRef, useCallback } from 'react';

export const useSnapCarousel = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const totalScroll = scrollWidth - clientWidth;

        // Update progress (0 to 1)
        const progress = totalScroll > 0 ? scrollLeft / totalScroll : 0;
        setScrollProgress(progress);

        // Update active index based on scroll position assuming items are roughly same width
        // This is a simplified approach that works reasonably well for snap carousels
        const itemWidth = clientWidth * 0.85; // approximates the 85vw width
        const newIndex = Math.round(scrollLeft / itemWidth);
        setActiveIndex(newIndex);
    }, []);

    useEffect(() => {
        const element = scrollRef.current;
        if (element) {
            element.addEventListener('scroll', handleScroll, { passive: true });
            // Initial check
            handleScroll();

            return () => element.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const scrollTo = (index: number) => {
        if (!scrollRef.current) return;
        const itemWidth = scrollRef.current.clientWidth * 0.85; // 85vw approximation
        scrollRef.current.scrollTo({
            left: index * itemWidth,
            behavior: 'smooth'
        });
    };

    return { scrollRef, activeIndex, scrollProgress, scrollTo };
};
