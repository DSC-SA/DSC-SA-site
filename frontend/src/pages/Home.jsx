import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminLogin from '../components/AdminLogin';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import { heroesAPI, eventsAPI } from '../services/api';

const SSR_HEROES = ['Khufra', 'Lancelot', 'Beatrix', 'Kagura', 'Estes', 'Arlott', 'Chou', 'Fanny', 'Gusion', 'Grock'];

/* A quiet, evenly-spaced stat line — no animation, just strong typography */
function SignalLine({ value, label }) {
  return (
    <div className="border-l border-brand-line pl-4">
      <p className="font-display text-2xl font-bold text-brand-ink sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-brand-mut">{label}</p>
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
      <section className="relative overflow-hidden border-b border-brand-line/70">
        {/* single, calm top wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
          style={{ background: 'radial-gradient(720px 420px at 20% -20%, rgba(91,181,232,0.18), transparent 62%)' }}
        />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-y-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:pb-24">
          <div className="text-center lg:text-left">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-line bg-brand-snow px-3 py-1 text-xs font-semibold text-brand-mut">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Community platform
            </span>

            <h1 className="mb-6 font-display text-4xl font-bold leading-[1.06] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Welcome to{' '}
              <span className="text-brand-bluedd">DSC-SA</span>
              <br />
              <span className="text-brand-mut">Community Hub</span>
            </h1>

            <p className="mx-auto mb-9 max-w-md text-lg leading-relaxed text-brand-mut lg:mx-0">
              Master the meta with hero tiers, community builds, and ranked insights — curated for the sharpest minds in the game.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link to="/heroes" className="btn-primary px-7 py-3.5">
                Explore Heroes
              </Link>
              <Link to="/events" className="btn-secondary px-7 py-3.5">
                View Events
              </Link>
            </div>
          </div>

          {/* refined product card */}
          <div className="scale-in">
            <div className="mx-auto max-w-md rounded-3xl border border-brand-line bg-brand-snow p-7 shadow-lift lg:p-9">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-mut">The Meta</p>
              <h3 className="mb-3 font-display text-2xl font-bold text-brand-ink">Master the Meta</h3>
              <p className="mb-7 border-b border-brand-line pb-7 text-sm leading-relaxed text-brand-mut">
                Strategic gameplay, community builds, and pro tier lists — in one place.
              </p>
              <div className="flex items-center justify-around gap-2">
                {[
                  ['10', 'SSR metas'],
                  ['133', 'Heroes'],
                  ['7', 'Item slots']
                ].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="font-display text-2xl font-bold text-brand-bluedd">{v}</p>
                    <p className="mt-1 text-[0.7rem] font-medium uppercase tracking-wide text-brand-faint">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SIGNAL LINE ============ */}
      <section className="border-b border-brand-line/70 bg-brand-snow/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          <SignalLine value={`${heroes.length}+`} label="Meta heroes" />
          <SignalLine value="-1" label="Days to next event" />
          <SignalLine value="24/7" label="Community support" />
          <SignalLine value="100%" label="Community driven" />
        </div>
      </section>

      {/* ============ SSR HEROES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mb-10 sm:mb-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Current meta</p>
              <h2 className="font-display text-3xl font-bold text-brand-ink sm:text-4xl">SSR Heroes</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-brand-mut sm:text-right">
              Dominate ranked with the strongest picks. Updated to current meta trends.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
            <p className="text-sm text-brand-mut">Loading heroes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {metaHeroes.map((hero, i) => (
              <Reveal key={hero.id} delay={`${(i % 5) * 70}ms`}>
                <Link
                  to={`/heroes/${hero.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-brand-line bg-brand-snow p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/60 hover:shadow-lift"
                >
                  <span className="mb-3 font-display text-xs font-semibold text-brand-faint">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mb-1 font-display text-base font-semibold text-brand-ink">{hero.name}</h3>
                  <p className="mb-4 text-xs font-medium text-brand-mut">{hero.role}</p>
                  <span className="mt-auto inline-flex items-center justify-center gap-1 rounded-full border border-brand-line px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-brand-blue transition-colors group-hover:border-brand-blue group-hover:bg-brand-blue group-hover:text-white">
                    SSR Tier
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Reveal>
            <Link to="/heroes" className="btn-secondary px-8 py-3">
              View all heroes
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ UPCOMING EVENTS ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <Reveal className="mb-10 sm:mb-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Mark your calendar</p>
              <h2 className="font-display text-3xl font-bold text-brand-ink sm:text-4xl">Upcoming Events</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-brand-mut sm:text-right">
              Join the community and showcase your skills.
            </p>
          </div>
        </Reveal>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={`${i * 80}ms`}>
                <div className="group flex h-full flex-col rounded-2xl border border-brand-line bg-brand-snow p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/50 hover:shadow-lift">
                  {event.image && (
                    <div className="mb-5 h-32 w-full overflow-hidden rounded-xl bg-brand-mist">
                      <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-bluedd">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date TBA'}
                  </p>
                  <h3 className="mb-2 font-display text-lg font-semibold text-brand-ink">{event.title}</h3>
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-brand-mut">{event.description}</p>
                  <Link to="/events" className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-bluedd transition hover:underline">
                    Learn more →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-line bg-brand-snow p-12 text-center">
            <p className="text-brand-mut">No events scheduled yet</p>
          </div>
        )}
      </section>

      <AdminLogin />
    </Layout>
  );
}