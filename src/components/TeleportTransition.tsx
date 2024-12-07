import React, { useEffect, useState } from 'react';

interface TeleportTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

const TeleportTransition: React.FC<TeleportTransitionProps> = ({ isActive, onComplete }) => {
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    angle: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      // Create particles with varying properties
      const newParticles = Array.from({ length: 150 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
      }));
      setParticles(newParticles);

      // Delay the completion to allow for full animation
      const timer = setTimeout(() => {
        onComplete();
      }, 500); // Reduced from 1500ms to 500ms

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 animate-pulse" />
      <div className="absolute inset-0 backdrop-blur-md transition-all duration-500" />
      
      {/* Energy field effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 animate-grid-flow" />
      
      {/* Central portal effect */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[200px] h-[200px] rounded-full bg-blue-500/20 animate-portal-pulse" />
        <div className="absolute inset-0 w-[200px] h-[200px] rounded-full bg-blue-400/10 animate-portal-pulse delay-100" />
        <div className="absolute inset-0 w-[200px] h-[200px] rounded-full bg-blue-300/5 animate-portal-pulse delay-200" />
      </div>

      {/* Particles */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute w-1 h-1 bg-blue-500 rounded-full animate-particle-float"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            '--particle-speed': `${particle.speed}s`,
            '--particle-angle': `${particle.angle}rad`,
          } as React.CSSProperties}
        >
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-particle-glow" />
        </div>
      ))}
    </div>
  );
};

export default TeleportTransition;