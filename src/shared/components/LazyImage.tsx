/**
 * LazyImage Component
 * Feature-First Architecture - Performance optimized image loading
 */

'use client';

import React, { useState, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations';
import { colors } from '../constants/visual';

interface LazyImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty' | 'spinner';
  blurDataURL?: string;
}

const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  fallback = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80',
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (!priority && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry?.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );

      observer.observe(imgRef.current);

      return () => observer.disconnect();
    }
    return undefined;
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  const renderPlaceholder = () => {
    switch (placeholder) {
      case 'spinner':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div
              className="w-8 h-8 border-2 border-gray-300 border-t-brand-blue rounded-full animate-spin"
              style={{ borderTopColor: colors.accent.primary }}
            />
          </div>
        );
      case 'empty':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-400 text-center">
              <div className="text-2xl mb-1">📷</div>
              <div className="text-xs">Cargando...</div>
            </div>
          </div>
        );
      case 'blur':
      default:
        return (
          <img
            src={blurDataURL}
            alt=""
            className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
            aria-hidden="true"
          />
        );
    }
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder */}
      {isLoading && renderPlaceholder()}

      {/* Main Image */}
      {isInView && (
        <motion.img
          src={hasError ? fallback : src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          onLoad={handleLoad}
          onError={handleError}
          variants={fadeInUp}
          initial="initial"
          animate={isLoading ? 'initial' : 'animate'}
          style={{
            filter: hasError ? 'grayscale(100%)' : 'grayscale(0%)',
          }}
        />
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-white/80 text-center">
            <div className="text-sm mb-1">Error al cargar imagen</div>
            <div className="text-xs">Mostrando alternativa</div>
          </div>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;