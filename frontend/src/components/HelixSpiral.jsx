import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const SPACING = 56; // vertical px per card down the pole
const ANGLE_STEP = 0.17; // radians per card (tight corkscrew phase)
const RADIUS = 180; // helix radius (translateZ)
const PARTICLES = 90;

export default function HelixSpiral({ items }) {
  const els = useRef(new Map());
  const [reduced, setReduced] = useState(false);

  const list = items;
  const n = list.length || 0;
  const totalHeight = n * SPACING; // tall scroll extent (the long pole)

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }, () => ({
        y: Math.random() * (totalHeight + 400),
        r: Math.random() * 140 + 70,
        speed: `${Math.random() * 6 + 3}s`,
      })),
    [totalHeight]
  );

  useEffect(() => {
    const mq = matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const fn = (e) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, []);

  // Gentle continuous auto-spin — the whole helix turns around the pole so,
  // as you scroll the long ladder, the cards visibly corkscrew. Only cards
  // near the viewport get their rotateY updated (culled off-screen).
  useEffect(() => {
    if (reduced || n === 0) return;
    let raf = 0;
    let t = 0;
    let last = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.003; // radians/frame -> slow seamless rotation
      const vh = window.innerHeight || 1;
      const y0 = -220, y1 = vh + 220;
      let best = -1, bestD = Infinity, cy = vh / 2;
      for (let i = 0; i < n; i++) {
        const el = els.current.get(i);
        if (!el) continue;
        const hy = -(i * SPACING);
        // cull far off-screen
        if (hy < y0 || hy > y1) {
          if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
          continue;
        }
        if (el.style.visibility !== 'visible') el.style.visibility = 'visible';
        const angle = i * ANGLE_STEP + t;
        const cos = Math.cos(angle);
        el.style.setProperty('--hx', Math.sin(angle));
        el.style.setProperty('--hz', cos);
        el.style.zIndex = cos < 0 ? Math.round((cos + 1) * 2) : Math.round((cos + 1) * 20) + 10;
        el.style.opacity = cos < 0 ? 0.3 : 1;
        const d = Math.abs(-hy - cy);
        if (d < bestD) { bestD = d; best = i; }
      }
      if (best !== -1 && best !== last) {
        last = best;
        els.current.forEach((el, i) => el.classList.toggle('is-focus', i === best));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, n, SPACING]);

  return (
    <section className="helix-track" style={{ height: totalHeight + 300 }}>
      <div className="helix-spine" aria-hidden />

      <div className="ambient" aria-hidden>
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

      <div className="helix-wall">
        {list.map((hero, i) => (
          <Link
            key={hero.id}
            to={`/heroes/${hero.id}`}
            aria-label={hero.name}
            ref={(node) => (node ? els.current.set(i, node) : els.current.delete(i))}
            className="hero-card"
            style={{
              '--hy': -(i * SPACING),
              '--hx': 0,
              '--hz': 1,
            }}
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
    </section>
  );
}