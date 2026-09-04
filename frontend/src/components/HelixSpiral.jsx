import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const CARD_H = 220;
const STEP = 150; // vertical step per card -> dense packed column
const TURN_CARDS = 12; // cards per full 360° twist
const SETP = (Math.PI * 2) / TURN_CARDS; // rad/card
const RADIUS = 95; // tight around the spine
const REVOLUTIONS = 2.5; // extra full turns over the whole scroll
const PARTICLES = 40;

export default function HelixSpiral({ items }) {
  const trackRef = useRef(null);
  const els = useRef(new Map());
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(active);
  activeRef.current = active;

  const list = items;
  const n = list.length || 0;
  const trackHeight = n * STEP;

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }, () => ({
        y: Math.random() * trackHeight,
        r: Math.random() * 90 + 60,
        speed: `${Math.random() * 6 + 3}s`,
      })),
    [trackHeight]
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
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let lastBest = -1;
    const last = new Map();

    const tick = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const topY = -rect.top;
      const progress = reduced
        ? 0
        : Math.min(Math.max(topY / (rect.height - vh), 0), 1);
      const spin = progress * Math.PI * 2 * REVOLUTIONS;

      let best = -1;
      let bestD = Infinity;

      for (let i = 0; i < n; i++) {
        const y = i * STEP;
        if (y < topY - CARD_H - 80 || y > topY + vh + 80) {
          const el = els.current.get(i);
          if (el && el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
          continue;
        }
        const el = els.current.get(i);
        if (!el) continue;
        if (el.style.visibility !== 'visible') el.style.visibility = 'visible';

        const ang = i * SETP + spin;
        const cos = Math.cos(ang);
        const prev = last.get(i);
        const zi =
          cos < 0
            ? Math.round((cos + 1) * 2)
            : Math.round((cos + 1) * 20) + 10;
        const op = cos < -0.2 ? 0.3 : 1;
        if (!prev || prev.zi !== zi) el.style.zIndex = zi;
        if (!prev || prev.op !== op) el.style.opacity = op;
        if (!prev || prev.a !== ang) {
          el.style.setProperty('--a', ang);
          last.set(i, { zi, op, a: ang });
        }

        if (cos > bestD) {
          bestD = cos;
          best = i;
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
  }, [n, STEP, reduced, trackHeight]);

  if (n === 0) return null;
  const focus = list[active >= 0 ? active : 0];

  return (
    <section
      className="helix-track"
      ref={trackRef}
      style={{ height: trackHeight + 200 }}
    >
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
            onClick={() => setActive(i)}
            ref={(node) =>
              node ? els.current.set(i, node) : els.current.delete(i)
            }
            className="hero-card"
            style={{ '--hy': i * STEP, '--a': i * SETP }}
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
        <div className="pointer-events-none sticky bottom-6 z-[999] flex justify-center">
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