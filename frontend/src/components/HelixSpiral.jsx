import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

/* ---- Helix tuning (drives the single--var GPU pipeline) ---- */
const CARD_INDEX_CYCLES = 4; // repeat the roster to build a long, seamless corkscrew
const CARD_STEP_Y = 110; // vertical drop per card (px) — matches --card-index * 110px
const PARTICLES = 35; // ambient orbiting particles (pure CSS animation)

export default function HelixSpiral({ items }) {
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  /* Build a long, unbroken helix by repeating the roster. --card-index keeps
     increasing so the corkscrew twists continuously across every repeat. */
  const cards = useMemo(() => {
    const base = items.slice(0, 120);
    if (base.length === 0) return [];
    const out = [];
    for (let c = 0; c < CARD_INDEX_CYCLES; c++) {
      base.forEach((h) => out.push({ ...h, index: out.length }));
    }
    return out;
  }, [items]);

  const trackHeight = Math.max(cards.length * CARD_STEP_Y + 400, 1);

  /* particles are generated once, purely declaratively — CSS animates them on
     the GPU with zero JS per-frame cost */
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES }, () => ({
        y: Math.random() * (trackHeight + 400),
        r: Math.random() * 110 + 60,
        speed: `${Math.random() * 4 + 2.5}s`,
      })),
    [trackHeight]
  );

  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  /* ZERO-LAG: one var write per frame -> the GPU rotates the ENTIRE track.
     No per-card JS loop, no per-card style writes. */
  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    let pos = 0;
    let ticking = false;

    const commit = () => {
      // pass scroll straight to the parent wrapper; GPU handles the rest
      track.style.setProperty('--scroll-offset', String(reduced ? 0 : pos));
      ticking = false;
    };

    const onScroll = () => {
      pos = stage.scrollTop;
      if (!ticking) {
        requestAnimationFrame(commit);
        ticking = true;
      }
    };

    commit();
    stage.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      stage.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  if (cards.length === 0) return null;

  return (
    <section className="spiral-stage" ref={stageRef}>
      {/* fixed central axis */}
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

      {/* the GPU rotation engine — whole track turns via --scroll-offset */}
      <div
        className="hero-spiral-track"
        ref={trackRef}
        style={{ height: trackHeight }}
      >
        {cards.map((hero, i) => (
          <Link
            key={`${hero.id}-${hero.index}`}
            to={`/heroes/${hero.id}`}
            aria-label={hero.name}
            className="hero-card"
            style={{ '--card-index': hero.index }}
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

      {/* pinned hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[999] flex justify-center">
        <p className="rounded-full bg-brand-snow/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand-faint">
          Scroll inside the tunnel — tap a hero to open it
        </p>
      </div>
    </section>
  );
}