import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const ANGLE_STEP = 0.65; // radians per card (helix twist)
const SPACING = 130; // vertical px per card slot
const RADIUS = 180; // cylinder radius (translateZ, ≤200px cap)
const SCROLL_ROT_MULT = 1.4; // extra full revolutions as you scroll top→bottom
const VH_RATIO = 0.5; // spiral centred at 50% of viewport
const PARTICLES = 45;

export default function HelixSpiral({ items }) {
  const sectionRef = useRef(null);
  const els = useRef(new Map());
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(active);
  activeRef.current = active;

  const list = items;
  const n = list.length || 0;
  const totalTravel = n * SPACING; // page-pixels the helix spans

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }, () => ({
        y: Math.random() * (totalTravel + 600),
        r: Math.random() * 110 + 70,
        speed: `${Math.random() * 5 + 3}s`,
      })),
    [totalTravel]
  );

  useEffect(() => {
    const mq = matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const fn = (e) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, []);

  useEffect(() => {
    if (n === 0) return;
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    let lastBest = -1;

    const tick = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // p = 0 when section top enters viewport, 1 when section bottom exits
      const p = reduced
        ? 0
        : Math.min(Math.max(-rect.top / totalTravel, 0), 1);
      const scrollPx = p * totalTravel;
      const center = vh * VH_RATIO;

      let best = -1;
      let bestD = Infinity;

      for (let i = 0; i < n; i++) {
        const angle =
          i * ANGLE_STEP + p * Math.PI * 2 * SCROLL_ROT_MULT;
        // card vertical position relative to viewport centre
        const ty = i * SPACING - scrollPx - center;

        // cull off-screen
        if (ty < -250 || ty > vh + 250) {
          const el = els.current.get(i);
          if (el) el.style.visibility = 'hidden';
          continue;
        }

        const el = els.current.get(i);
        if (!el) continue;
        el.style.visibility = 'visible';
        el.style.setProperty('--helix-y', ty);
        el.style.setProperty('--helix-angle', angle);

        const cosZ = Math.cos(angle);
        if (cosZ < 0) {
          el.style.zIndex = Math.round((cosZ + 1) * 2);
          el.style.opacity = '0.28';
        } else {
          el.style.zIndex = Math.round((cosZ + 1) * 20) + 10;
          el.style.opacity = '1';
          const d = Math.abs(ty);
          if (d < bestD) { bestD = d; best = i; }
        }
      }

      if (best !== -1 && best !== lastBest) {
        lastBest = best;
        els.current.forEach((el, i) => el.classList.toggle('is-focus', i === best));
        if (best !== activeRef.current) setActive(best);
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };

    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n, totalTravel, reduced]);

  if (n === 0) return null;
  const focus = list[active >= 0 ? active : 0];

  return (
    <section
      ref={sectionRef}
      className="helix-track"
      style={{ height: totalTravel }}
    >
      <div className="helix-viewport">
        <div className="blue-pole" aria-hidden />

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

        <div className="helix-cards">
          {list.map((hero, i) => (
            <Link
              key={hero.id}
              to={`/heroes/${hero.id}`}
              onClick={() => setActive(i)}
              aria-label={hero.name}
              ref={(node) =>
                node ? els.current.set(i, node) : els.current.delete(i)
              }
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
                <div className="hero-card__placeholder">
                  {hero.name.charAt(0)}
                </div>
              )}
              <div className="hero-info">
                <h3>{hero.name}</h3>
                {hero.role && <p>{hero.role}</p>}
              </div>
            </Link>
          ))}
        </div>

        {focus && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[999] flex flex-col items-center gap-2">
            <p className="rounded-full bg-brand-snow/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand-faint">
              Scroll — the roster spirals around the line
            </p>
            <Link
              to={`/heroes/${focus.id}`}
              className="btn-primary pointer-events-auto whitespace-nowrap px-6 py-2.5 text-sm shadow-lift"
            >
              View {focus.name} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}