
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import FireworkCanvas, { FireworkHandle } from './components/FireworkCanvas';
import Envelope from './components/Envelope';
import NeonTitle from './components/NeonTitle';
import { audioSystem } from './components/AudioSystem';

const App: React.FC = () => {
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envelopeExited, setEnvelopeExited] = useState(false);
  const [isSpawningPaused, setIsSpawningPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fireworkRef = useRef<FireworkHandle>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.neon-title-container', {
        opacity: 0,
        scale: 0.95,
        duration: 2,
        ease: 'power2.out'
      });

      const timer = setTimeout(() => {
        setShowEnvelope(true);
      }, 3500);

      return () => clearTimeout(timer);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleEnvelopeExit = () => {
    setIsSpawningPaused(true);
    setEnvelopeExited(true);

    // Wait for the whoosh, then trigger the Big Bang visual
    setTimeout(() => {
      fireworkRef.current?.triggerBig();
      
      // Resume regular fireworks after the climax
      setTimeout(() => {
        setIsSpawningPaused(false);
      }, 2500);
    }, 1000);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioSystem.setMute(!isMuted);
    audioSystem.resume();
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
      <FireworkCanvas ref={fireworkRef} isPaused={isSpawningPaused} />

      <div className="absolute inset-0 pointer-events-none bg-vignette z-10" />

      {/* Audio Toggle */}
      <button 
        onClick={toggleMute}
        className="absolute top-6 left-6 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-white/40 hover:text-white backdrop-blur-sm"
      >
        {isMuted ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
        )}
      </button>

      {/* Author Credit */}
      <div className="absolute bottom-6 right-8 z-50 pointer-events-none flex flex-col items-end opacity-40 hover:opacity-100 transition-opacity duration-700">
        <span className="text-[10px] uppercase tracking-[0.3em] text-blue-300/60 mb-1">Created By</span>
        <span className="font-handwriting text-xl text-white">Doniyor | Kaizo coder</span>
      </div>

      <div className="relative z-20 w-full flex flex-col items-center px-4">
        <div className="neon-title-container mb-16 pointer-events-none">
          <NeonTitle />
        </div>
        
        <div className="h-64 flex items-center justify-center">
          {showEnvelope && !envelopeExited && <Envelope onExit={handleEnvelopeExit} />}
        </div>
      </div>

      {/* Background stars */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
