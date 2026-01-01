
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { audioSystem } from './AudioSystem';

interface Particle {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  friction: number;
  gravity: number;
  decay: number;
  sparkle: boolean;
}

export interface FireworkHandle {
  triggerBig: (x?: number, y?: number) => void;
}

interface Props {
  isPaused?: boolean;
}

const FireworkCanvas = forwardRef<FireworkHandle, Props>(({ isPaused }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const colors = [
    '#FF3F8E', '#04C2C9', '#2E5BFF', '#D1FF00', 
    '#FF9F00', '#A100FF', '#00FF9D', '#FFEA00',
    '#FFFFFF', '#FFD700'
  ];

  const createFirework = (x: number, y: number, color: string, isBig: boolean = false) => {
    audioSystem.playLaunch();
    
    setTimeout(() => {
      audioSystem.playFirework(isBig);
    }, 150);

    // If it's the Big Bang, use way more particles and multi-colors
    const count = isBig ? 600 : (100 + Math.random() * 50);
    const force = isBig ? 15 : (4 + Math.random() * 6);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isBig 
        ? (Math.random() * force + 1) // Layered speeds for depth
        : Math.random() * force;
      
      const pColor = isBig 
        ? colors[Math.floor(Math.random() * colors.length)] 
        : color;

      particles.current.push({
        x,
        y,
        lastX: x,
        lastY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: pColor,
        size: isBig ? (Math.random() * 3 + 0.5) : (Math.random() * 1.5 + 0.5),
        friction: isBig ? 0.975 : 0.96,
        gravity: 0.07,
        decay: isBig ? (Math.random() * 0.005 + 0.002) : (Math.random() * 0.012 + 0.005),
        sparkle: Math.random() > 0.3
      });
    }
  };

  useImperativeHandle(ref, () => ({
    triggerBig: (x, y) => {
      const targetX = x ?? window.innerWidth / 2;
      const targetY = y ?? (window.innerHeight * 0.4);
      // Burst multiple colors for the grand finale
      createFirework(targetX, targetY, colors[0], true);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isPaused && Math.random() < 0.04) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.5);
        const color = colors[Math.floor(Math.random() * colors.length)];
        createFirework(x, y, color);
      }

      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.lastX = p.x;
        p.lastY = p.y;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(p.lastX, p.lastY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.globalAlpha = p.alpha;
        ctx.stroke();

        if (p.sparkle && Math.random() > 0.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        }
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isPaused]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />;
});

export default FireworkCanvas;
