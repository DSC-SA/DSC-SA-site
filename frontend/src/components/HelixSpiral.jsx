import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const CARD_H = 220;
const STEP = 150;
const TURN_CARDS = 12;
const SETP = (Math.PI * 2) / TURN_CARDS;
const START_TWIST = -0.8;
const REVOLUTIONS = 2.5;
const SMOOTH_MS = 90;
const MARGIN = 600;

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
    const p = { cur: 0 };
    const alpha = 1 - Math.exp(-0.016 / (SMOOTH_MS / 1000));

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const vh = window.innerHeight || 1;
      const rect = track.getBoundingClientRect();
      const topY = -rect.top;
      const total = rect.height - vh;
      const target = reduced ? 0 : Math.min(Math.max(topY / (total || 1), 0), 1);
      p.cur += (target - p.cur) * alpha;
      const spin = p.cur * Math.PI * 2 * REVOLUTIONS;

      const lo = topY - CARD_H * 2;
      const hi = topY + vh + CARD_H * 2;
      let best = -1;
      let bestD = Infinity;

      for (let i = 0; i < n; i++) {
        const y = i * STEP;
        if (y < lo || y > hi) {
          const el = els.current.get(i);
          if (el && el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
          continue;
        }
        const el = els.current.get(i);
        if (!el) continue;
        if (el.style.visibility !== 'visible') el.style.visibility = 'visible';

        const ang = i * SETP + spin + START_TWIST;
        const cos = Math.cos(ang);
        const prev = last.get(i);
        const zi =
          cos < 0
            ? Math.round((cos + 1) * 2)
            : Math.round((cos + 1) * 20) + 10;
        if (!prev || prev.zi !== zi) el.style.zIndex = zi;
        if (!prev || prev.a !== ang) {
          el.style.setProperty('--a', ang);
          last.set(i, { zi, a: ang });
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

    const start = () => {
      if (!raf) {
        p.cur = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start();
          else {
            stop();
            els.current.forEach((el) => el.classList.remove('is-focus'));
          }
        }
      },
      { rootMargin: `${MARGIN}px 0px` }
    );
    io.observe(track);

    return () => {
      stop();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [n, STEP, reduced, trackHeight]);

  if (n === 0) return null;
  const focus = list[active >= 0 ? active : Math.floor(n / 2)];

  return (
    <section
      className="helix-track"
      ref={trackRef}
      style={{ height: trackHeight + 200 }}
    >
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
            style={{ '--hy': i * STEP, '--a': i * SETP + START_TWIST }}
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