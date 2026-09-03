import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminLogin from '../components/AdminLogin';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import { heroesAPI, eventsAPI } from '../services/api';

const SSR_HEROES = ['Khufra', 'Lancelot', 'Beatrix', 'Kagura', 'Estes', 'Arlott', 'Chou', 'Fanny', 'Gusion', 'Grock'];

function useCountUp(target, active) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const dur = 1200;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return val;
}

function StatsRow() {
  const [ref, setRef] = useState(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setActive(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref]);

  const heroes = useCountUp(133, active);
  const events = useCountUp(24, active);
  const points = useCountUp(9999, active);

  const items = [
    { v: `${heroes}`, label: 'Meta Heroes' },
    { v: `${events}`, label: 'Community Events' },
    { v: `${points}+`, label: 'Points Earned' },
    { v: '24/7', label: 'Community Support' }
  ];

  return (
    <div ref={setRef} className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
      {items.map((it, i) => (
        <Reveal key={it.label} delay={`${i * 80}ms`}>
          <div className="glass-white rounded-2xl border border-brand-line px-4 py-6 text-center shadow-soft">
            <p className="bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text font-display text-3xl font-bold text-transparent sm:text-4xl">
              {it.v}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-mut sm:text-sm">
              {it.label}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function TierMarquee() {
  const roles = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support', 'SSR Meta', 'Ranked Climber', 'DSC-SA'];
  return (
    <div className="relative overflow-hidden py-2">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-8">
        {[...roles, ...roles].map((role, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap text-sm font-bold uppercase tracking-[0.25em] text-brand-mut"
          >
            {role}
            <span className="h-1.5 w-1.5 rounded-full bg-brand-blue/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [heroes, setHeroes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroesRes, eventsRes] = await Promise.all([
          heroesAPI.getAll(),
          eventsAPI.getAll()
        ]);
        setHeroes(heroesRes.data);
        setEvents(eventsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const metaHeroes = SSR_HEROES.map((name) => heroes.find((h) => h.name === name)).filter(Boolean);

  return (
    <Layout>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* animated mesh + aurora blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(900px 560px at 10% -10%, rgba(91,181,232,0.35), transparent 60%), radial-gradient(840px 480px at 98% 0%, rgba(167,200,240,0.4), transparent 55%), radial-gradient(720px 520px at 60% 115%, rgba(196,224,247,0.55), transparent 60%)'
            }}
          />
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-blue/20 blur-3xl" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-brand-bluelt/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-brand-blue/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="slide-down text-center lg:text-left">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-bluedd">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-blue" />
                </span>
                Live Community Hub
              </span>

              <h1 className="mb-5 font-display text-[2.4rem] font-bold leading-[1.05] text-brand-ink sm:text-6xl lg:text-7xl">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text text-transparent">
                  DSC-SA
                </span>
                <br />
                <span className="text-brand-mut dark:text-brand-mut">Community Hub</span>
              </h1>

              <p className="mx-auto mb-8 max-w-md text-base text-brand-mut sm:text-lg lg:mx-0">
                Master the Meta. Track builds, hero tiers, community events, and climb ranked with the sharpest minds in the game.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link to="/heroes" className="btn-primary px-7 py-3.5 text-sm sm:text-base">
                  Explore Heroes
                </Link>
                <Link to="/events" className="btn-secondary px-7 py-3.5 text-sm sm:text-base">
                  View Events
                </Link>
                <Link to="/members" className="hidden items-center gap-1 text-sm font-semibold text-brand-bluedd transition hover:underline sm:inline-flex">
                  See the leaderboard →
                </Link>
              </div>
            </div>

            {/* floating glass meta panel */}
            <div className="scale-in">
              <TiltCard className="glass-white rounded-3xl px-6 py-10 text-center shadow-lift lg:p-12">
                <div className="tilt-translate space-y-4">
                  <p className="inline-flex rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] text-brand-bluedd">
                    The Meta
                  </p>
                  <h3 className="font-display text-3xl font-bold text-brand-ink lg:text-4xl">
                    Master the Meta
                  </h3>
                  <p className="mx-auto max-w-xs text-sm text-brand-mut">
                    Strategic gameplay, community builds, and pro tier lists — all in one place.
                  </p>
                  <div className="mx-auto grid grid-cols-3 gap-3 pt-2">
                    {[['#1', 'SSR Tier'], ['133', 'Heroes'], ['7', 'Item Slots']].map(([v, l]) => (
                      <div key={l} className="rounded-xl border border-brand-line bg-brand-snow/70 px-2 py-3">
                        <p className="bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text font-display text-lg font-bold text-transparent">{v}</p>
                        <p className="text-[0.6rem] font-semibold uppercase tracking-wide text-brand-mut">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>

        <div className="border-y border-brand-line/70 bg-brand-snow/60 backdrop-blur-sm">
          <TierMarquee />
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8">
        <StatsRow />
      </section>

      {/* ============ SSR HEROES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mb-8 sm:mb-12">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            Current Meta
          </span>
          <h2 className="mb-3 font-display text-3xl font-bold text-brand-ink sm:text-4xl">
            SSR Heroes
          </h2>
          <div className="mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand-blue to-brand-bluelt" />
          <p className="max-w-xl font-medium text-brand-mut">
            Dominate ranked with the strongest picks. Updated to current meta trends.
          </p>
        </Reveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
            <p className="text-sm text-brand-mut">Loading heroes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {metaHeroes.map((hero, i) => (
              <Reveal key={hero.id} delay={`${(i % 5) * 80}ms`}>
                <Link to={`/heroes/${hero.id}`} className="group block h-full">
                  <TiltCard className="hero-glow flex h-full flex-col items-center rounded-2xl border border-brand-line bg-brand-snow p-5 text-center transition-colors duration-300 group-hover:border-brand-blue">
                    <div className="tilt-translate flex flex-col items-center">
                      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-bluedd font-display text-sm font-bold text-white shadow-glow">
                        {i + 1}
                      </span>
                      <div className="mb-1 font-display text-base font-bold text-brand-ink transition group-hover:text-brand-bluedd">
                        {hero.name}
                      </div>
                      <p className="mb-3 text-xs font-semibold text-brand-blue">{hero.role}</p>
                      <span className="inline-block rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-brand-bluedd">
                        SSR Tier
                      </span>
                    </div>
                  </TiltCard>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:mt-14">
          <Reveal>
            <Link to="/heroes" className="btn-primary px-10 py-3 text-sm sm:text-base">
              View All Heroes
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ UPCOMING EVENTS ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal className="mb-8 sm:mb-12">
          <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand-blue">
            Mark your calendar
          </span>
          <h2 className="mb-3 font-display text-3xl font-bold text-brand-ink sm:text-4xl">
            Upcoming Events
          </h2>
          <div className="mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand-blue to-brand-bluelt" />
          <p className="font-medium text-brand-mut">Join the community and showcase your skills</p>
        </Reveal>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={`${i * 90}ms`}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-brand-line bg-brand-snow p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-blue/50 hover:shadow-lift">
                  <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-blue/10 blur-2xl transition duration-300 group-hover:bg-brand-blue/20" />
                  {event.image && (
                    <div className="mb-4 h-28 w-full overflow-hidden rounded-xl bg-brand-mist">
                      <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <span className="mb-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-brand-bluedd">
                    📅 {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBA'}
                  </span>
                  <h3 className="mb-2 font-display text-lg font-bold text-brand-ink lg:text-xl">
                    {event.title}
                  </h3>
                  <p className="mb-5 line-clamp-2 text-sm text-brand-mut">{event.description}</p>
                  <Link to="/events" className="btn-primary inline-block px-5 py-2.5 text-xs sm:text-sm">
                    Learn More
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="card py-12 text-center">
            <p className="text-lg text-brand-mut">No events scheduled yet</p>
          </div>
        )}
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl border border-brand-line bg-brand-snow py-16 text-center sm:py-24"
            style={{
              backgroundImage:
                'radial-gradient(600px 300px at 50% 0%, rgba(91,181,232,0.22), transparent 70%), radial-gradient(520px 260px at 82% 110%, rgba(167,200,240,0.5), transparent 72%)'
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-brand-blue/10 blur-3xl" />
            <h2 className="mx-auto mb-3 max-w-2xl font-display text-3xl font-bold text-brand-ink sm:text-5xl">
              Ready to climb the ranks?
            </h2>
            <p className="mx-auto mb-8 max-w-md px-4 text-base text-brand-mut sm:text-lg">
              Join DSC-SA, build the perfect loadout, and dominate the meta alongside the community.
            </p>
            <Link to="/register" className="btn-primary px-12 py-4 text-base sm:text-lg">
              Start Your Journey
            </Link>
          </div>
        </Reveal>
      </section>

      <AdminLogin />
    </Layout>
  );
}