import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminLogin from '../components/AdminLogin';
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

  const metaHeroes = SSR_HEROES.map(name => heroes.find(h => h.name === name)).filter(Boolean);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 sm:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center slide-down lg:text-left">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              Welcome to <span className="text-brand-gold">DSC-SA</span>
              <br />
              <span className="text-white">Community Hub</span>
            </h1>
            <div className="mx-auto mb-8 h-px max-w-[10rem] bg-gradient-to-r from-brand-gold to-transparent lg:mx-0"></div>
            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link to="/heroes" className="btn-primary px-5 py-2.5 text-sm">
                Explore Heroes
              </Link>
              <Link to="/events" className="btn-secondary px-5 py-2.5 text-sm">
                View Events
              </Link>
            </div>
          </div>
          <div className="scale-in">
            <div className="rounded-2xl border border-brand-gold/30 bg-brand-surface px-6 py-8 text-center lg:p-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">
                The Meta
              </p>
              <h3 className="mb-2 text-2xl font-extrabold text-white lg:text-3xl">
                Master the Meta
              </h3>
              <p className="text-sm text-slate-400">Strategic gameplay starts here</p>
            </div>
          </div>
        </div>
      </section>

      {/* SSR Heroes Section */}
      <section className="mb-16 sm:mb-24">
        <div className="mb-8 sm:mb-12">
          <h2 className="mb-3 text-2xl font-extrabold sm:text-4xl">SSR Heroes – Current Meta</h2>
          <div className="mb-4 h-px w-24 bg-gradient-to-r from-brand-gold to-transparent"></div>
          <p className="font-semibold text-slate-300">
            Dominate ranked with the strongest picks. Updated to current meta trends.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand-gold border-t-transparent"></div>
            <p className="mt-4 text-slate-400">Loading heroes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-4 md:gap-5">
            {metaHeroes.map(hero => (
              <Link key={hero.id} to={`/heroes/${hero.id}`} className="group">
                <div className="rounded-lg border border-brand-gold/40 bg-brand-surface p-4 transition duration-300 group-hover:border-brand-gold group-hover:shadow-md">
                  <div className="mb-3 text-center text-sm font-bold text-white group-hover:text-brand-gold">
                    {hero.name}
                  </div>
                  <p className="text-center text-xs font-semibold text-brand-gold">
                    {hero.role}
                  </p>
                  <div className="mt-3 text-center">
                    <span className="inline-block rounded-full border border-brand-gold/40 bg-brand-gold/10 px-2 py-1 text-xs font-bold text-brand-gold">
                      SSR Tier
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:mt-14">
          <Link to="/heroes" className="btn-primary px-8 py-3 text-sm sm:text-base">
            View All Heroes
          </Link>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="mb-16 sm:mb-24">
        <div className="mb-8 sm:mb-12">
          <h2 className="mb-3 text-2xl font-extrabold sm:text-4xl">Upcoming Events</h2>
          <div className="mb-4 h-px w-24 bg-gradient-to-r from-brand-gold to-transparent"></div>
          <p className="font-semibold text-slate-300">Join the community and showcase your skills</p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-8">
            {events.map(event => (
              <div key={event.id} className="card">
                <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">{event.name}</h3>
                <p className="mb-4 text-xs font-semibold text-brand-gold sm:text-sm">
                  {event.date || 'TBA'}
                </p>
                <p className="mb-6 text-sm text-slate-300 sm:text-base">{event.description}</p>
                <Link to="/events" className="btn-primary inline-block px-4 py-2 text-xs sm:text-sm">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card py-12 text-center">
            <p className="text-lg text-slate-400">No events scheduled yet</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mb-16 rounded-2xl border border-brand-gold/20 bg-gradient-to-b from-surface1 to-surface2 py-12 text-center sm:mb-20 sm:py-20 sm:rounded-3xl">
        <Link to="/register" className="btn-primary inline-block px-10 py-3 text-sm sm:text-lg">
          Start Your Journey
        </Link>
      </section>

      <AdminLogin />
    </Layout>
  );
}