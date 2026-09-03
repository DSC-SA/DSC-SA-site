import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const CARD_W = 158;
const SCROLL_DIST = 2400; // how much scroll travel maps to one full revolution
const STAGE_H = SCROLL_DIST * 3; // tall scroll section => "travel down the pole"

export default function ScrollRing({ items }) {
  const stageRef = useRef(null);
  const [reduced, setReduced] = useState(false);
  const [small, setSmall] = useState(false);
  const [deg, setDeg] = useState(0);
  const [active, setActive] = useState(0);

  const list = items.slice(0, 12);
  const count = list.length;
  const step = count ? 360 / count : 0;
  const radius = small ? 150 : 300;
  const cardDim = small ? 90 : 208;

  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Responsive size: shrink the ring so it never clips on phones.
  useEffect(() => {
    const update = () => setSmall(window.innerWidth < 640);
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // Scroll-driven rotation: the sticky viewport is pinned while the tall stage
  // travels upward, so the pole extends down the page and cards rotate past.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const update = () => {
      const rect = stage.getBoundingClientRect();
      // how far the stage has scrolled past the top of the viewport
      const scrolled = Math.min(Math.max(-rect.top, 0), STAGE_H);
      const angle = (scrolled / STAGE_H) * 360;
      setDeg(angle);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Resolve which card currently faces the camera from the angle.
  useEffect(() => {
    if (count === 0) return;
    if (reduced) {
      setActive(Math.floor(count / 2));
      return;
    }
    const normalized = ((Math.round(deg / step) % count) + count) % count;
    setActive(normalized);
  }, [deg, count, step, reduced]);

  const goto = useCallback(
    (i) => {
      const target = ((i % count) + count) % count;
      // move to the closest equivalent rotation so we don't spin 360°
      if (reduced) {
        setActive(target);
        return;
      }
      const toAngle = target * step;
      setDeg(toAngle);
    },
    [count, step, reduced]
  );

  if (count < 2) return null;

  const effDegree = reduced ? Math.floor(count / 2) * -step : -deg;

  return (
    <section ref={stageRef} className="relative mx-auto w-full" style={{ height: STAGE_H }}>
      {/* invisible vertical pole — stretches the full height of the stage,
          so it reads as a single axis running down the page */}
      <div className="hero-pole" aria-hidden />

      {/* sticky viewport keeps the ring centered while the pole scrolls by */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden" style={{ perspective: '1400px' }}>
        <div className="mx-auto w-full max-w-4xl px-2">
          {/* hairline guide */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-line/50"
            style={{ width: radius * 2 + 100, height: radius * 2 + 100 }}
          />

          <div className="hero-ring" style={{ transform: `rotateY(${effDegree}deg)` }}>
            {list.map((hero, i) => {
              const delta = Math.min(Math.abs(i - active), count - Math.abs(i - active));
              const facing = i === active;
              const dim = facing ? 1 : Math.max(0.45, 1 - delta * 0.18);

              return (
                <div
                  key={hero.id}
                  className="hero-ring__card"
                  style={{
                    width: small ? 96 : CARD_W,
                    height: cardDim,
                    transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                    marginLeft: small ? -48 : -CARD_W / 2,
                    marginTop: -cardDim / 2,
                    opacity: dim
                  }}
                >
                  <button
                    onClick={() => goto(i)}
                    aria-label={hero.name}
                    className={`h-full w-full overflow-hidden rounded-2xl border bg-brand-snow text-left transition-colors duration-300 ${
                      facing
                        ? 'border-brand-blue shadow-[0_18px_50px_-18px_rgba(91,181,232,0.6)]'
                        : 'border-brand-line/70 shadow-soft'
                    }`}
                  >
                    <div className="relative flex h-full flex-col justify-end p-4">
                      <div
                        aria-hidden
                        className={`absolute inset-x-0 top-0 h-1/3 transition-opacity duration-300 ${
                          facing ? 'opacity-100' : 'opacity-25'
                        }`}
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(91,181,232,0.4), rgba(91,181,232,0) 100%)'
                        }}
                      />
                      {!small && (
                        <span
                          className={`mb-auto font-display text-[0.7rem] font-semibold uppercase tracking-[0.25em] ${
                            facing ? 'text-brand-bluedd' : 'text-brand-faint'
                          }`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      )}
                      <div>
                        <h3 className={`truncate font-bold text-brand-ink ${small ? 'text-sm' : 'font-display text-lg'}`}>
                          {hero.name}
                        </h3>
                        {!small && <p className="text-xs font-medium text-brand-mut">{hero.role}</p>}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* center readout + CTA */}
          <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 text-center">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-brand-faint">
              {reduced ? 'Tap a card or use the arrows' : 'Keep scrolling — the pole travels with you'}
            </p>
            {list[active] && (
              <Link
                to={`/heroes/${list[active].id}`}
                className="btn-primary pointer-events-auto whitespace-nowrap px-5 py-2.5 text-xs"
              >
                View {list[active].name} →
              </Link>
            )}
          </div>
        </div>

        {/* side controls */}
        <button
          onClick={() => goto(active - 1)}
          aria-label="Previous hero"
          className="absolute left-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-brand-line bg-brand-snow text-xl text-brand-ink transition hover:border-brand-blue hover:text-brand-bluedd sm:left-6"
        >
          ‹
        </button>
        <button
          onClick={() => goto(active + 1)}
          aria-label="Next hero"
          className="absolute right-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-brand-line bg-brand-snow text-xl text-brand-ink transition hover:border-brand-blue hover:text-brand-bluedd sm:right-6"
        >
          ›
        </button>
      </div>
    </section>
  );
}