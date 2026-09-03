import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

/* ---- Helix configuration (drives the GPU pipeline) ---- */
const ANGLE_SPACING = 0.65; // spiral rotation angle step per card (radians)
const VERTICAL_SPACING = 130; // vertical drop per card (px)
const SCROLL_ANGLE_RATE = 0.004; // scrollTop -> radians of extra rotation
const RADIUS_HINT = 180; // translateZ cylinder radius (kept under the 200px cap)
const PARTICLES = 45; // orbiting ambient particles

export default function HelixSpiral({ items }) {
  const stageRef = useRef(null);
  const els = useRef(new Map());
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(active);
  activeRef.current = active;

  const list = items.slice(0, 160);
  const n = list.length || 0;
  const loopHeight = Math.max(n * VERTICAL_SPACING, 1);

  /* particles are generated once, purely declaratively — the CSS @keyframes
     animates them on the GPU with zero JS per-frame cost */
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }, () => ({
        y: Math.random() * loopHeight,
        r: Math.random() * 120 + 90,
        speed: `${Math.random() * 5 + 3}s`,
      })),
    [loopHeight]
  );

  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  /* Infinite looping layout — cheap CSS var writes per frame, transformed on
     the GPU by the .hero-card transform rule (translateY/rotateY/translateZ) */
  useEffect(() => {
    if (n === 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(layout);
    };

    const layout = () => {
      raf = 0;
      const scrollTop = stage.scrollTop;

      let best = -1;
      let bestD = Infinity;

      for (let i = 0; i < n; i++) {
        const el = els.current.get(i);
        if (!el) continue;

        let angle = i * ANGLE_SPACING + (reduced ? 0 : scrollTop * SCROLL_ANGLE_RATE);
        let height = i * VERTICAL_SPACING - scrollTop;

        // SEAMLESS INFINITE LOOP — recycle cards that leave the visible band
        if (height < -300) {
          const wraps = Math.ceil(Math.abs(height + 300) / loopHeight);
          height += wraps * loopHeight;
          angle += wraps * n * ANGLE_SPACING;
        } else if (height > loopHeight - 300) {
          const wraps = Math.ceil((height - (loopHeight - 300)) / loopHeight);
          height -= wraps * loopHeight;
          angle -= wraps * n * ANGLE_SPACING;
        }

        // ship values to CSS custom properties (composited on GPU)
        el.style.setProperty('--helix-y', height);
        el.style.setProperty('--helix-angle', angle);

        // depth-driven layering + soft backdrop for cards behind the pole
        const cosZ = Math.cos(angle);
        if (cosZ < 0) {
          el.style.zIndex = Math.round((cosZ + 1) * 2);
          el.style.opacity = '0.28';
          el.classList.remove('is-focus');
        } else {
          el.style.zIndex = Math.round((cosZ + 1) * 20) + 10;
          el.style.opacity = '1';
          const center = scrollTop + stage.clientHeight * 0.35 + 110;
          const d = Math.abs(height - center);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
      }

      if (best !== -1) {
        els.current.forEach((el, i) => el.classList.toggle('is-focus', i === best));
        if (best !== activeRef.current) setActive(best);
      }
    };

    layout();
    stage.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      stage.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n, reduced, loopHeight]);

  if (n === 0) return null;
  const focus = list[active >= 0 ? active : Math.floor(n / 2)];

  return (
    <section className="helix-stage" ref={stageRef}>
      {/* central static axis */}
      <div className="blue-pole" aria-hidden />

      {/* ambient orbiting particles — pure CSS animation */}
      <div className="particle-container" aria-hidden>
        {particles.map((p, i) => (
          <div
            key={i}
            className="ambient-particle"
            style={{
              '--p-y': p.y,
              '--p-radius': p.r,
              '--p-speed': p.speed,
            }}
          />
        ))}
      </div>

      {/* the 3D spiral ecosystem — cards recycled infinitely */}
      <div className="hero-cards-wrapper">
        {list.map((hero, i) => (
          <Link
            key={hero.id}
            to={`/heroes/${hero.id}`}
            onClick={() => setActive(i)}
            aria-label={hero.name}
            ref={(node) => (node ? els.current.set(i, node) : els.current.delete(i))}
            className="hero-card"
          >
            {hero.icon_url ? (
              <img
                src={`${getImageUrl(hero.icon_url)}${
                  getImageUrl(hero.icon_url).includes('?') ? '&' : '?'
                }t=${Date.now()}`}
                alt={hero.name}
                loading="lazy"
                className="hero-img"
              />
            ) : (
              <div className="hero-card__placeholder">{hero.name.charAt(0)}</div>
            )}
            <div className="hero-info">
              <h3>{hero.name}</h3>
              {hero.role && <p>{hero.role}</p>}
            </div>
          </Link>
        ))}
      </div>

      {/* pinned readout */}
      {focus && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[999] flex flex-col items-center gap-2">
          <p className="rounded-full bg-brand-snow/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand-faint">
            Scroll inside the tunnel — the roster spirals forever
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