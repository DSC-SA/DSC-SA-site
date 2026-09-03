import React, { useRef } from 'react';

/**
 * TiltCard — light 3D tilt + glow on pointer move (desktop only).
 * On touch devices the CSS disables tilt and falls back to a soft lift.
 *
 * Usage: <TiltCard className="rounded-2xl">…block content…</TiltCard>
 * Children that should pop out in 3D can use className="tilt-translate".
 */
export default function TiltCard({ className = '', children, ...rest }) {
  const ref = useRef(null);
  const frame = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    // small, elegant tilt (±6°)
    const rx = (0.5 - py) * 6;
    const ry = (px - 0.5) * 8;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${rx}deg`);
      el.style.setProperty('--ry', `${ry}deg`);
    });
  };

  const reset = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (el) {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`tilt-3d ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}