import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminLogin from '../components/AdminLogin';
import Reveal from '../components/Reveal';
import TiltCard from '../components/TiltCard';
import { heroesAPI, eventsAPI } from '../services/api';

const SSR_HEROES = ['Khufra', 'Lancelot', 'Beatrix', 'Kagura', 'Estes', 'Arlott', 'Chou', 'Fanny', 'Gusion', 'Grock'];

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
      {/* HERO — mesh gradient backdrop */}
      <section className="relative overflow-hidden rounded-3xl px-4 py-14 sm:py-20 md:py-24 lg:px-10">
        {/* animated mesh gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(900px 520px at 12% -8%, rgba(91,181,232,0.30), transparent 60%), radial-gradient(820px 460px at 98% 0%, rgba(167,200,240,0.35), transparent 55%), radial-gradient(700px 500px at 60% 110%, rgba(196,224,247,0.5), transparent 60%)'
          }}
        />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="slide-down text-center lg:text-left">
            <h1 className="mb-5 font-display text-[2.1rem] font-bold leading-[1.08] text-brand-ink sm:text-5xl md:text-6xl">
              Welcome to <span className="text-brand-bluedd">DSC-SA</span>
              <br />
              <span className="text-brand-mut">Community Hub</span>
            </h1>
            <div className="mx-auto mb-7 h-1 w-16 rounded-full bg-gradient-to-r from-brand-blue to-brand-bluelt lg:mx-0"></div>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link to="/heroes" className="btn-primary px-6 py-3 text-sm">
                Explore Heroes
              </Link>
              <Link to="/events" className="btn-secondary px-6 py-3 text-sm">
                View Events
              </Link>
            </div>
          </div>

          {/* floating glass panel */}
          <div className="scale-in">
            <TiltCard className="glass-white rounded-3xl px-6 py-8 text-center lg:p-12">
              <div className="tilt-translate">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-brand-bluedd">
                  The Meta
                </p>
                <h3 className="mb-2 font-display text-2xl font-bold text-brand-ink lg:text-3xl">
                  Master the Meta
                </h3>
                <p className="text-sm text-brand-mut">Strategic gameplay starts here</p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* SSR HEROES */}
      <section className="mb-16 sm:mb-24">
        <Reveal className="mb-8 sm:mb-12">
          <h2 className="mb-3 font-display text-2xl font-bold text-brand-ink sm:text-4xl">
            SSR Heroes – Current Meta
          </h2>
          <div className="mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand-blue to-brand-bluelt"></div>
          <p className="font-medium text-brand-mut">
            Dominate ranked with the strongest picks. Updated to current meta trends.
          </p>
        </Reveal>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
            <p className="mt-4 text-sm text-brand-mut">Loading heroes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {metaHeroes.map((hero, i) => (
              <Reveal key={hero.id} delay={`${(i % 5) * 70}ms`}>
                <Link to={`/heroes/${hero.id}`} className="group block">
                  <TiltCard className="hero-glow rounded-2xl border border-brand-line bg-white p-4 transition-colors duration-300 group-hover:border-brand-blue">
                    <div className="tilt-translate">
                      <div className="mb-2 text-center text-sm font-bold text-brand-ink group-hover:text-brand-bluedd">
                        {hero.name}
                      </div>
                      <p className="text-center text-xs font-semibold text-brand-blue">{hero.role}</p>
                      <div className="mt-3 text-center">
                        <span className="inline-block rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-1 text-[0.65rem] font-bold text-brand-bluedd">
                          SSR Tier
                        </span>
                      </div>
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

      {/* UPCOMING EVENTS */}
      <section className="mb-16 sm:mb-24">
        <Reveal className="mb-8 sm:mb-12">
          <h2 className="mb-3 font-display text-2xl font-bold text-brand-ink sm:text-4xl">
            Upcoming Events
          </h2>
          <div className="mb-4 h-1 w-16 rounded-full bg-gradient-to-r from-brand-blue to-brand-bluelt"></div>
          <p className="font-medium text-brand-mut">Join the community and showcase your skills</p>
        </Reveal>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={`${i * 90}ms`}>
                <div className="card h-full transition-transform duration-300 hover:-translate-y-1">
                  <h3 className="mb-2 font-display text-lg font-bold text-brand-ink sm:text-xl">
                    {event.name}
                  </h3>
                  <p className="mb-4 text-xs font-semibold text-brand-bluedd sm:text-sm">
                    {event.date || 'TBA'}
                  </p>
                  <p className="mb-6 text-sm text-brand-mut sm:text-base">{event.description}</p>
                  <Link to="/events" className="btn-primary inline-block px-5 py-2 text-xs sm:text-sm">
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

      {/* CTA */}
      <section className="mb-16 overflow-hidden rounded-3xl border border-brand-line bg-white py-12 text-center sm:py-20"
        style={{
          backgroundImage:
            'radial-gradient(600px 300px at 50% 0%, rgba(91,181,232,0.18), transparent 70%), radial-gradient(500px 260px at 80% 110%, rgba(196,224,247,0.5), transparent 70%)'
        }}
      >
        <Reveal>
          <Link to="/register" className="btn-primary px-12 py-4 text-base sm:text-lg">
            Start Your Journey
          </Link>
        </Reveal>
      </section>

      <AdminLogin />
    </Layout>
  );
}