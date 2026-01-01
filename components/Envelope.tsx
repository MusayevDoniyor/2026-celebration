
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { audioSystem } from './AudioSystem';

const Envelope: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, 
      { scale: 0.5, y: 100, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.75)' }
    );
  }, []);

  const handleOpen = () => {
    if (isOpen || isClosing) return;
    setIsOpen(true);
    audioSystem.resume();
    audioSystem.playClick();

    const tl = gsap.timeline();
    tl.to(flapRef.current, {
      rotationX: 180,
      duration: 0.8,
      ease: 'power2.inOut',
      transformOrigin: 'top'
    });

    tl.to(letterRef.current, {
      y: -180,
      duration: 0.9,
      ease: 'power3.out'
    }, "-=0.2");

    tl.to(letterRef.current, {
      zIndex: 50,
      scale: 1.25,
      y: -120,
      duration: 0.6,
      ease: 'back.out(1.4)'
    });
    
    gsap.to('.neon-title-container', { opacity: 0.1, duration: 1 });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isClosing) return;
    setIsClosing(true);
    audioSystem.playClick();

    const tl = gsap.timeline({
      onComplete: () => {
        // Fly away animation
        audioSystem.playWhoosh();
        gsap.to(containerRef.current, {
          y: -window.innerHeight - 500,
          rotation: 45,
          scale: 0.2,
          opacity: 0,
          duration: 1.2,
          ease: 'power2.in',
          onComplete: onExit
        });
        gsap.to('.neon-title-container', { opacity: 1, duration: 1.5 });
      }
    });

    // Reverse letter animation
    tl.to(letterRef.current, {
      scale: 1,
      y: -180,
      duration: 0.4,
      ease: 'power2.in'
    });
    tl.to(letterRef.current, {
      y: 0,
      zIndex: 10,
      duration: 0.5,
      ease: 'power2.in'
    });
    // Close flap
    tl.to(flapRef.current, {
      rotationX: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      transformOrigin: 'top'
    }, "-=0.2");
  };

  return (
    <div ref={containerRef} className="relative w-72 h-48 md:w-96 md:h-64 perspective-1000 group select-none">
      <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full scale-150 transition-colors duration-1000" />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/60 blur-2xl rounded-full opacity-40" />

      {/* Main Body */}
      <div 
        className="absolute inset-0 bg-[#f3f4f6] rounded-xl shadow-2xl z-20 overflow-hidden preserve-3d cursor-pointer"
        onClick={handleOpen}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-white" />
        <div className="absolute inset-0 border-b-[32px] md:border-b-[48px] border-gray-300/40 pointer-events-none" />
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)' }}>
          <div className="w-full h-full bg-gray-100 shadow-inner" />
        </div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)' }}>
          <div className="w-full h-full bg-gray-100 shadow-inner" />
        </div>
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0% 100%, 50% 40%, 100% 100%)' }}>
          <div className="w-full h-full bg-gray-50 shadow-2xl border-t border-gray-200" />
        </div>
      </div>

      {/* Flap */}
      <div 
        ref={flapRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#e5e7eb] rounded-t-xl z-40 origin-top shadow-md preserve-3d"
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-red-700 rounded-full shadow-lg border-2 border-red-800 flex items-center justify-center">
          <span className="text-white font-bold text-[10px] italic">2026</span>
        </div>
      </div>

      {/* Letter Content */}
      <div 
        ref={letterRef}
        className="absolute top-2 left-2 right-2 h-full bg-[#fffcf5] shadow-2xl rounded-md p-6 md:p-10 z-10 origin-bottom"
      >
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors z-[60]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-40" />
        <div className="relative h-full border border-orange-100/50 flex flex-col items-center justify-center text-center">
          <h3 className="font-handwriting text-2xl md:text-3xl text-blue-900 mb-2 font-bold">A Wish for You</h3>
          <p className="font-handwriting text-sm md:text-lg text-gray-800 leading-relaxed max-w-xs md:max-w-md">
            May 2026 be your masterpiece of joy and health. 
            May every dream you chase lead to a victory worth celebrating.
          </p>
          <div className="mt-4 flex flex-col items-center gap-1">
            <span className="h-px w-12 bg-blue-900/20" />
            <span className="font-handwriting text-blue-900/60 text-sm">Yours, Sparkle</span>
          </div>
        </div>
      </div>

      {!isOpen && !isClosing && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-pulse">
           <div className="text-white/90 text-sm font-light tracking-widest flex items-center gap-2">
             CLICK TO OPEN <span className="text-blue-400">✧</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default Envelope;
