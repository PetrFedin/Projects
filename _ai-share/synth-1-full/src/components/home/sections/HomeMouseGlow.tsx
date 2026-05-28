'use client';

import { useEffect, useState } from 'react';

/** Фоновый radial glow за курсором — mount только после HomeMouseGlowGate idle. */
export function HomeMouseGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    let latest = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      latest = { x: e.clientX, y: e.clientY };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setMousePos(latest);
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-10"
      style={{
        background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(148, 163, 184, 0.15), transparent)`,
      }}
    />
  );
}
