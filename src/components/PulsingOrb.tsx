"use client";

import { motion } from "framer-motion";
import { PulsingBorder } from "@paper-design/shaders-react";

interface PulsingOrbProps {
  isOpen?: boolean;
  size?: number;
  showText?: boolean;
  className?: string;
}

export function PulsingOrb({
  isOpen = false,
  size = 60,
  showText = true,
  className = ""
}: PulsingOrbProps) {
  // Scaling factors: for the header (small sizes), we want the text to be 
  // relatively larger than for the floating version.
  const borderSize = size;
  const svgScale = size < 50 ? (size / 60) * 1.8 : (size / 60) * 1.6;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size * 1.4, height: size * 1.4 }}>
      <PulsingBorder
        {...({
          colors: ["#1e40af", "#2563eb", "#3b82f6", "#172554", "#1e3a8a", "#ffffff"],
          colorBack: "#00000000",
          speed: 1.5,
          roundness: 1,
          thickness: 0.1,
          softness: 0.2,
          intensity: isOpen ? 8 : 5,
          spotSize: 0.1,
        } as any)}
        style={{
          width: `${borderSize}px`,
          height: `${borderSize}px`,
          borderRadius: "50%",
        }}
      />

      {/* Rotating Text Around the Pulsing Border */}
      {showText && (
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transform: `scale(${svgScale})` }}
        >
          <defs>
            <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="text-[11px] fill-white/90 font-black uppercase tracking-[0.2em]">
            <textPath href="#circle" startOffset="0%">
              CRAZY BOXING • MMA ACADEMY • ELITE TRAINING •
            </textPath>
          </text>
        </motion.svg>
      )}
    </div>
  );
}