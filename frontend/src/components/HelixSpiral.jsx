import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const SPACING = 168; // const vertical step between cards
const RADIUS = 220; // spiral radius around the pole (desktop)
const TURNS = 3.5; // how many revolutions the spiral makes across the roster
const CARD_W = 140;
const CARD_H = 200;
const MULT = 1.4; // how fast a full 360° of the spiral is driven by scrolling

export default function HelixSpiral({ items }) {
  const stageRef = useRef(null);
  const els = useRef(new Map());
  const [reduced, setReduced] = useState(false);
  const [small, setSmall] = useState(false);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(active);
  activeRef.current = active;

  const list = items.slice(0, 160);
  const n = list.length;
  const totalTravel = Math.max(n * SPACING, 1);

  const cw = small ? 116 : CARD_W;
  const ch = small ? 164 : CARD_H;

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

  useEffect(() => {
    if (n === 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    // Base angle of a card at index i. The spiral winds clockwise down the pole,
    // so index maps to both a rotation (θ) and a descent (Y).
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1;
      const rect = stage.getBoundingClientRect();
      const travel = Math.max(totalTravel - vh, 1);
      const p = reduced ? 0 : Math.min(Math.max(-rect.top / travel, 0), 1);
      const scrollPx = p * totalTravel;
      const centerY = vh / 2;

      const radius = small ? 120 : RADIUS;
      const cw = small ? 116 : CARD_W;
      const ch = small ? 164 : CARD_H;
      const rotOffset = p * 360 * MULT; // scroll drives a 360°·MULT turn

      let best = -1;
      let bestD = Infinity;
      // focus = the front card (tz in the near hemisphere) nearest the vertical
      // center of the viewport — it reads as the hero singled out by the spiral
      const nearThreshold = radius * 0.1;

      els.current.forEach((el, i) => {
        if (!el) return;
        const angle = (i / (n || 1)) * 360 * TURNS + rotOffset; // degrees
        const rad = (angle * Math.PI) / 180;
        const tx = Math.sin(rad) * radius;
        const tz = Math.cos(rad) * radius; // +z = toward camera = in front of pole
        const ty = i * SPACING - scrollPx; // +y = down the pole; minus scroll moves up

        // off the vertical track → hide for perf
        if (ty < -ch * 1.4 || ty > vh + ch * 1.4) {
          el.style.visibility = 'hidden';
          el.classList.remove('is-focus');
          return;
        }
        el.style.visibility = 'visible';

        // real depth: translateZ recedes/fronts the pole under the shared
        // perspective; perspective sizes it, blur+opacity sell the depth.
        const depthScale = 0.55 + 0.55 * (tz / radius + 1) / 2;
        const activeBoost = tz > radius * 0.92 ? 1.08 : 1;

        el.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${angle}deg) scale(${depthScale * activeBoost})`;
        el.style.filter = `blur(${(1 - depthScale) * 3.2}px)`;
        el.style.opacity = reduced ? 1 : String(0.35 + 0.65 * depthScale);
        // z-index: higher when tz is larger (in front); lower behind the pole
        el.style.zIndex = String(Math.round(tz));

        // pick the front-facing card closest to the vertical center
        if (tz > nearThreshold) {
          const d = Math.abs(ty - centerY);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
      });

      if (best !== -1) {
        els.current.forEach((el, i) => el.classList.toggle('is-focus', i === best));
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
  }, [n, small, reduced, totalTravel]);

  if (n === 0) return null;
  const focus = list[active >= 0 ? active : Math.floor(n / 2)];

  return (
    <section ref={stageRef} className="relative mx-auto w-full" style={{ height: totalTravel + 140 }}>
      {/* the 3D spiral — pole is a 3D child at z=0 so cards pass in/behind it */}
      <div className="spiral-stage">
        <div className="spiral-pole" aria-hidden />
        {list.map((hero, i) => (
          <div
            key={hero.id}
            ref={(node) => (node ? els.current.set(i, node) : els.current.delete(i))}
            className="spiral-card"
          >
            <Link
              to={`/heroes/${hero.id}`}
              onClick={() => setActive(i)}
              aria-label={hero.name}
              className="spiral-card__inner"
              style={{ width: cw, height: ch, marginLeft: -cw / 2 }}
            >
              {/* hero art */}
              <div className="spiral-card__art">
                {hero.icon_url ? (
                  <img
                    src={`${getImageUrl(hero.icon_url)}${
                      getImageUrl(hero.icon_url).includes('?') ? '&' : '?'
                    }t=${Date.now()}`}
                    alt={hero.name}
                    className="spiral-card__img"
                  />
                ) : (
                  <div className="spiral-card__placeholder">
                    {hero.name.charAt(0)}
                  </div>
                )}
                <span className="spiral-card__num">{String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* name / role bar */}
              <div className="spiral-card__body">
                <h3 className="spiral-card__name">{hero.name}</h3>
                {hero.role && <p className="spiral-card__role">{hero.role}</p>}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {focus && (
        <div className="pointer-events-none fixed inset-x-0 z-[999] flex flex-col items-center gap-2" style={{ bottom: 24 }}>
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
    </section>
  );
}