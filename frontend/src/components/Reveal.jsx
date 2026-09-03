import React, { useEffect, useRef } from 'react';

/**
 * Reveal — fades/slides children into view on scroll.
 * Usage: <Reveal delay="120ms">…</Reveal> or <Reveal as="div" className="…">…</Reveal>
 * Respects prefers-reduced-motion (CSS handles the timing).
 */
export default function Reveal({ as: Tag = 'div', delay, className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { ['--d']: delay } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}