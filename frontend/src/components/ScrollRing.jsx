import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';
import { getImageUrl } from '../services/api';

const PARTICLE_COUNT = 14;
const CARD_W = 150;

export default function ScrollRing({ items }) {
  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  // Build particles once
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: `${6 + ((i * 37) % 88)}%`,
      bottom: `${4 + ((i * 53) % 70)}%`,
      size: `${5 + ((i * 13) % 10)}px`,
      delay: `${(i * 0.43) % 6}s`,
      duration: `${4.5 + ((i * 0.7) % 4)}s`
    }))
  ).current;

  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Scroll-linked rotation
  useEffect(() => {
    if (reduced || items.length === 0) return;
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;

    let raf = 0;
    let lastT = 0;
    const ease = 0.09;
    let current = 0;
    let target = 0;

    const compute = () => {
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when section top hits viewport bottom, 1 when section middle is centered
      const progress = Math.min(Math.max((vh * 0.7 - rect.top) / (vh * 0.5), 0), 1);
      // base idle motion + scroll contributor
      const idle = performance.now() * 0.00002;
      target = idle + progress * 360 * 2.2;
      return rect;
    };

    const frame = (t) => {
      // throttle to ~ rAF already is; just run
      if (t - lastT < 8) { raf = requestAnimationFrame(frame); return; }
      lastT = t;
      compute();
      current += (target - current) * ease;
      ring.style.transform = `rotateX(-6deg) rotateY(${current}deg)`;
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener('scroll', compute, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener('scroll', compute);
      cancelAnimationFrame(raf);
    };
  }, [reduced, items.length]);

  // Center cards: same count each side so the ring stays balanced
  const ringItems = items.slice(0, 12);
  if (ringItems.length < 2) return null;
  const step = 360 / ringItems.length;
  const radius = 300;

  return (
    <section
      ref={stageRef}
      className="hero-stage relative mx-auto h-[520px] w-full max-w-5xl overflow-hidden"
      aria-label="Featured meta heroes"
    >
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(91,181,232,0.28), rgba(126,200,239,0.10) 45%, transparent 70%)', filter: 'blur(6px)' }}
      />

      {/* drifting particles */}
      {!reduced &&
        particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration
            }}
          />
        ))}

      {/* invisible pole */}
      <div className="hero-pole" style={{ height: '560px' }} aria-hidden />

      {/* rotating ring */}
      <div ref={ringRef} className="hero-ring" style={{ top: '50%', left: '50%' }}>
        {ringItems.map((hero, i) => (
          <div
            key={hero.id}
            className="hero-ring__card"
            style={{
              width: CARD_W,
              height: 168,
              transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
              marginLeft: -CARD_W / 2,
              marginTop: -84
            }}
          >
            <Link to={`/heroes/${hero.id}`} className="group block">
              <TiltCard className="relative h-full overflow-hidden rounded-2xl border border-brand-line/80 bg-brand-snow shadow-soft transition-colors duration-300 group-hover:border-brand-blue">
                <div style={{ height: 120 }} className="bg-brand-cloud">
                  {hero.icon_url ? (
                    <img src={getImageUrl(hero.icon_url)} alt={hero.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-bluelt/40 to-brand-cloud text-xs font-medium text-brand-faint">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-2 text-center">
                  <p className="truncate text-xs font-bold text-brand-ink group-hover:text-brand-bluedd">{hero.name}</p>
                  {hero.role && <p className="mt-0.5 truncate text-[0.65rem] font-medium text-brand-mut">{hero.role}</p>}
                </div>
              </TiltCard>
            </Link>
          </div>
        ))}
      </div>

      {/* center label overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 select-none text-center">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand-mut">
          Scroll to spin · Featured meta
        </p>
      </div>
    </section>
  );
}