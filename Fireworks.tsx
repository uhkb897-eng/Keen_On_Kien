import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export const Fireworks = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      "hsl(45, 100%, 51%)",
      "hsl(38, 100%, 60%)",
      "hsl(142, 76%, 36%)",
      "hsl(168, 76%, 42%)",
    ];

    const createFirework = () => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.5;
      const newParticles: Particle[] = [];

      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const velocity = 2 + Math.random() * 3;
        newParticles.push({
          id: Date.now() + i,
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);
    };

    // Create multiple fireworks
    const intervals = [0, 300, 600, 900, 1200].map((delay) =>
      setTimeout(createFirework, delay)
    );

    // Animate particles
    const animationInterval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // gravity
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);

    return () => {
      intervals.forEach(clearTimeout);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            opacity: particle.life,
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
};
