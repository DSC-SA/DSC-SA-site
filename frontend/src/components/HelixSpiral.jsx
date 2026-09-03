import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

const SPACING = 168; // const vertical step between cards
const CARD_W = 150; // rigid container width (px)
const CARD_H = 220; // rigid container height (px)
const TURNS = 3.5; // revolutions across the roster
const MULT = 1.4; // scroll → revolutions multiplier
const MAX_RADIUS = 200; // hard cap (translateZ must never exceed this)
const PERSPECTIVE = 1200; // exact perspective on the 3D stage

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
  const ch = small ? 168 : CARD_H;
  const radius = small ? Math.min(120, MAX_RADIUS) : MAX_RADIUS;

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

    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const rect = stage.getBoundingClientRect();
      const travel = Math.max(totalTravel, 1);
      // p = 0 when section top enters the viewport, 1 when section bottom exits
      const p = reduced ? 0 : Math.min(Math.max(-rect.top / travel, 0), 1);
      const scrollPx = p * totalTravel;
      const originY = vh / 2; // pole + spiral centered vertically in the viewport
      const rotOffset = p * 360 * MULT;

      let best = -1;
      let bestD = Infinity;
      const nearThreshold = radius * 0.1;

      els.current.forEach((el, i) => {
        if (!el) return;
        const angle = (i / (n || 1)) * 360 * TURNS + rotOffset;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.sin(rad) * radius;
        const tz = Math.cos(rad) * radius; // +z toward camera, -z behind pole
        const ty = i * SPACING - scrollPx - originY; // rel. to vertical center

        // cull off-screen for perf + no bleed
        if (ty < -ch * 2 || ty > vh + ch * 2 || Math.abs(tz) > MAX_RADIUS) {
          el.style.visibility = 'hidden';
          el.classList.remove('is-focus');
          return;
        }
        el.style.visibility = 'visible';

        // depth via pure perspective (translateZ) — no manual scale so cards
        // never stretch. blur+opacity reinforce depth.
        const depthScale = 0.55 + 0.55 * (tz / radius + 1) / 2;

        el.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${angle}deg)`;
        el.style.filter = `blur(${(1 - depthScale) * 3.2}px)`;
        el.style.opacity = reduced ? 1 : String(0.35 + 0.65 * depthScale);
        el.style.zIndex = String(Math.round(tz));

        if (tz > nearThreshold) {
          const d = Math.abs(ty);
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
  }, [n, small, reduced, totalTravel, radius]);

  if (n === 0) return null;
  const focus = list[active >= 0 ? active : Math.floor(n / 2)];

  return (
    <section ref={stageRef} className="relative w-full" style={{ height: totalTravel }}>
      {/* sticky viewport: the ONLY 3D / visual container. overflow hidden keeps
          every card clipped to the viewport — nothing bleeds across the page. */}
      <div className="spiral-viewport">
        {/* the 3D stage: perspective fixed, preserve-3d so pole + cards share depth */}
        <div className="spiral-stage">
          {/* pole at z=0, runs full height of the viewport */}
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
                style={{ width: cw, height: ch, marginLeft: -cw / 2, marginTop: -ch / 2 }}
              >
                <div className="spiral-card__art">
                  {hero.icon_url ? (
                    <img
                      src={`${getImageUrl(hero.icon_url)}${
                        getImageUrl(hero.icon_url).includes('?') ? '&' : '?'
                      }t=${Date.now()}`}
                      alt={hero.name}
                      loading="lazy"
                      className="spiral-card__img"
                    />
                  ) : (
                    <div className="spiral-card__placeholder">{hero.name.charAt(0)}</div>
                  )}
                  <span className="spiral-card__num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="spiral-card__body">
                  <h3 className="spiral-card__name">{hero.name}</h3>
                  {hero.role && <p className="spiral-card__role">{hero.role}</p>}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* pinned readout */}
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