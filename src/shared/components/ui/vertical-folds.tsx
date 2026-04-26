"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface VerticalFoldsProps {
  className?: string;
  opacityRange?: [number, number, number];
  duration?: number;
  mobileCount?: number;
  desktopCount?: number;
}

/**
 * VerticalFolds Component
 * Renders the signature "Glass Refraction" vertical strips/folds
 * used to maintain visual consistency across themed sections.
 *
 * Performance: Uses CSS @keyframes instead of Framer Motion to avoid
 * competing with click handlers and scroll animations on the main thread.
 */
export function VerticalFolds({
  className,
  opacityRange = [0.15, 0.3, 0.15],
  duration = 4,
  mobileCount = 6,
  desktopCount = 12,
}: VerticalFoldsProps) {
  // Use desktopCount for rendering — CSS media query controls visibility
  // of extra strips on mobile. This avoids SSR mismatch from window.innerWidth.
  const count = desktopCount;

  const [o0, o1, o2] = opacityRange;

  return (
    <>
      <style>{`
        @keyframes vfold-pulse-${duration.toString().replace('.', '_')} {
          0%   { opacity: ${o0}; }
          50%  { opacity: ${o1}; }
          100% { opacity: ${o0}; }
        }

        .vfold-strip {
          height: 100%;
          flex-shrink: 0;
          will-change: opacity;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0) 10%,
            rgba(255, 255, 255, 0) 90%,
            rgba(255, 255, 255, 0.15) 100%
          );
          border-right: 1px solid rgba(255, 255, 255, 0.03);
          animation-name: vfold-pulse-${duration.toString().replace('.', '_')};
          animation-duration: ${duration}s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-delay: calc(var(--vf-i, 0) * ${(duration / count).toFixed(3)}s);
          /* Mobile: hide extra strips beyond mobileCount */
          display: none;
        }

        @media (max-width: 767px) {
          .vfold-strip:nth-child(-n+${mobileCount}) {
            display: block;
            width: calc(100vw / ${mobileCount});
            animation-duration: ${(duration * 1.2).toFixed(1)}s;
          }
        }

        @media (min-width: 768px) {
          .vfold-strip {
            display: block;
            width: calc(100vw / ${count});
          }
        }
      `}</style>

      <div
        className={cn(
          "absolute inset-0 flex flex-row items-center pointer-events-none z-0 overflow-hidden",
          className
        )}
        aria-hidden="true"
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="vfold-strip"
            style={{ "--vf-i": index } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
