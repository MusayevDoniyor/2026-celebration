
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { audioSystem } from './AudioSystem';

const NeonTitle: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Subtle neon flicker effect
    const flicker = () => {
      const isFlicker = Math.random() > 0.9;
      if (isFlicker) {
        audioSystem.playNeonFlicker();
      }
      gsap.to(titleRef.current, {
        opacity: isFlicker ? 0.7 : 1,
        filter: `drop-shadow(0 0 ${Math.random() * 10 + 5}px rgba(139, 92, 246, 0.5))`,
        duration: 0.1 + Math.random() * 0.2,
        onComplete: flicker
      });
    };
    flicker();
  }, []);

  return (
    <div className="text-center select-none neon-title-container">
      <h2 className="text-lg md:text-xl text-blue-300 font-extralight tracking-[0.5em] uppercase mb-4 opacity-70">
        The Dawn of a New Era
      </h2>
      <h1 
        ref={titleRef}
        className="relative text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-none transition-all duration-300"
      >
        {/* Layered Glows */}
        <span className="absolute inset-0 text-fuchsia-600 blur-3xl opacity-30 translate-y-2">
          Happy New Year 2026
        </span>
        <span className="absolute inset-0 text-blue-400 blur-xl opacity-40">
          Happy New Year 2026
        </span>
        {/* Main Text Gradient */}
        <span className="relative bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-blue-100 drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]">
          Happy New Year 2026
        </span>
      </h1>
      <div className="mt-8 flex justify-center items-center gap-6">
        <span className="h-px w-10 md:w-32 bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
        <p className="text-fuchsia-400 font-cursive text-2xl md:text-5xl drop-shadow-lg rotate-[-2deg]">
          Sparkling Moments
        </p>
        <span className="h-px w-10 md:w-32 bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
      </div>
    </div>
  );
};

export default NeonTitle;
