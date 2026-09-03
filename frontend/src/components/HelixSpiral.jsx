import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const SPACING = 132; // px between cards along the pole
const TURNS = 2.5; // helix twist across the full vertical
const SPIN_TURNS = 2.5; // full revolutions driven by scrolling the whole section
const TILT = -14; // helix lean (deg)
const PARTICLE_COUNT = 14;

export default function HelixSpiral({ items }) {
  const stageRef = useRef(null);
  const els = useRef(new Map());
  const [reduced, setReduced] = useState(false);
  const [small, setSmall] = useState(false);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(active);
  activeRef.current = active;

  const list = items.slice(0, 220);
  const n = list.length;

  const radius = small ? 118 : 236;
  const cardH = small ? 78 : 120;
  const totalTravel = Math.max(n * SPACING, 1);
  const sectionH = totalTravel + (typeof window !== 'undefined' ? window.innerHeight : 800);

  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: `${8 + ((i * 31) % 84)}%`,
      bottom: `${2 + ((i * 53) % 70)}%`,
      size: `${5 + ((i * 13) % 9)}px`,
      delay: `${(i * 0.47) % 7}s`,
      duration: `${5 + ((i * 0.6) % 4.5)}s`
    }))
  ).current;

  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    const updateSize = () => setSmall(window.innerWidth < 640);
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Scroll-driven helix: each card stays at a fixed world-Y and angle, and the
  // whole spiral rotates as you scroll down the tall section. DOM is written
  // directly per-frame so 100+ cards stay smooth.
  useEffect(() => {
    if (n === 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const rect = stage.getBoundingClientRect();
      const travel = Math.max(n * SPACING - vh * 0.2, 1);
      const p = reduced ? 0 : Math.min(Math.max(-rect.top / travel, 0), 1);
      const rot = p * 360 * SPIN_TURNS;
      const scrollPx = p * travel;
      const centerY = vh / 2;

      let best = -1;
      let bestDist = Infinity;

      els.current.forEach((el, i) => {
        if (!el) return;
        const y = i * SPACING - scrollPx + cardH / 2;
        const ang = (i / (n || 1)) * 360 * TURNS + rot;
        el.style.transform = `translate(-50%, -50%) rotateX(${TILT}deg) rotateY(${ang}deg) translateZ(${radius}px)`;
        el.style.top = `${y}px`;

        if (y < -cardH * 2 || y > vh + cardH * 2) {
          el.style.visibility = 'hidden';
          el.classList.remove('is-front');
          return;
        }
        el.style.visibility = 'visible';
        const dist = Math.abs(y - centerY);
        const dimPx = 0.45 + 0.55 * (1 - Math.min(dist / (vh * 0.5), 1));
        el.style.opacity = reduced ? 1 : dimPx;
        el.style.zIndex = `${Math.round(100 - dist)}`;
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });

      if (best !== -1) {
        els.current.forEach((el, i) => el.classList.toggle('is-front', i === best));
        if (best !== activeRef.current) setActive(best);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n, small, reduced, radius, cardH]);

  if (n === 0) return null;
  const focus = list[active >= 0 ? active : Math.floor(n / 2)];

  return (
    <section ref={stageRef} className="relative mx-auto w-full" style={{ height: sectionH }}>
      {/* static central pole — the axis cards wrap around */}
      <div className="hero-pole" aria-hidden />

      {/* stray particles tracking the spiral */}
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

      {/* the helix */}
      <div className="helix-stage" style={{ perspective: '1400px' }}>
        {list.map((hero, i) => (
          <div
            key={hero.id}
            ref={(node) => (node ? els.current.set(i, node) : els.current.delete(i))}
            className="helix-card"
          >
            <button
              onClick={() => setActive(i)}
              aria-label={hero.name}
              className="helix-card__inner"
              style={{
                width: small ? 92 : 168,
                height: cardH
              }}
            >
              <span className="helix-card__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="helix-card__body">
                <h3 className="helix-card__name">{hero.name}</h3>
                {!small && <p className="helix-card__role">{hero.role}</p>}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* pinned readout at the bottom of the viewport */}
      {focus && (
        <div className="pointer-events-none fixed inset-x-0 z-30 flex flex-col items-center gap-2" style={{ bottom: 28 }}>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-brand-faint">
            {reduced ? 'Scroll through the roster' : 'The list spirals around the pole — keep scrolling'}
          </p>
          <Link
            to={`/heroes/${focus.id}`}
            className="btn-primary pointer-events-auto whitespace-nowrap px-6 py-2.5 text-sm shadow-lift"
          >
            View {focus.name} →
          </Link>
        </div>
      )}
    </section>
  );
}