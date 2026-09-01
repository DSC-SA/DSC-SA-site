import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import HeroCard from '../components/HeroCard';
import AdminLogin from '../components/AdminLogin';
import { heroesAPI, eventsAPI } from '../services/api';

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
        // Get all heroes for filtering SSR heroes
        const allHeroes = heroesRes.data;
        // Keep first 9 for preview (used elsewhere if needed)
        setHeroes(allHeroes);
        setEvents(eventsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      {/* Epic Hero Section */}
      <section className="mb-12 sm:mb-24 py-10 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          <div className="slide-down text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight">
              Welcome to <span className="led-animated">DSC-SA</span>
              <br />
              <span className="text-white">Community Hub</span>
            </h1>
            <div className="led-line mb-8 max-w-[10rem] mx-auto lg:mx-0"></div>
            <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-start">
              <Link to="/heroes" className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2.5">
                Explore Heroes
              </Link>
              <Link to="/events" className="btn-secondary text-xs sm:text-sm px-4 sm:px-6 py-2.5">
                View Events
              </Link>
            </div>
          </div>
          <div className="scale-in">
            <div className="relative overflow-hidden rounded-3xl border border-amber-600/40 bg-gradient-to-b from-gray-900 to-gaming-dark px-6 py-6 sm:px-10 sm:py-8 lg:p-10 text-center">
              <div className="rainbow-bar-thin absolute top-0 inset-x-0"></div>
              <p className="text-amber-400 font-black tracking-[0.25em] uppercase text-xs mb-3 sm:mb-4">The Meta</p>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2">Master the Meta</h3>
              <p className="text-gray-400 text-sm">Strategic gameplay starts here</p>
            </div>
          </div>
        </div>
      </section>

      {/* SSR Heroes Section */}
      <section className="mb-12 sm:mb-24">
        <div className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-4 led-animated">🏆 SSR Heroes - Current Meta</h2>
          <div className="led-line mb-4"></div>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg font-semibold">Dominate ranked with the strongest picks. Updated to current meta trends.</p>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-amber-300 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 mt-4">Loading heroes...</p>
          </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {heroes.filter(h => ['Khufra', 'Lancelot', 'Beatrix', 'Kagura', 'Estes', 'Arlott', 'Chou', 'Fanny', 'Gusion', 'Grock'].includes(h.name)).map(hero => (
              <Link 
                key={hero.id} 
                to={`/heroes/${hero.id}`}
                className="group"
                style={{ textDecoration: 'none' }}
              >
                <div className="relative overflow-hidden rounded-lg p-3 sm:p-4 bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-amber-600 hover:border-amber-400 transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 group">
                  <div 
                    className="w-full flex items-center justify-center font-bold text-xs text-white mb-3 rainbow-black-bar"
                    style={{height: '5px', boxShadow: '0 0 6px rgba(255, 0, 0, 0.3)'}}
                  >
                  </div>
                  <div className="text-center">
                    <p className="text-center text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition whitespace-nowrap">
                      {hero.name}
                    </p>
                  </div>
                  <p className="text-center text-xs sm:text-sm text-amber-400 font-semibold mt-2">
                    {hero.role}
                  </p>
                  <div className="mt-3 text-center">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-amber-600/30 text-amber-300 border border-amber-600">
                      SSR Tier
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 sm:mt-12 text-center">
          <Link to="/heroes" className="btn-primary text-sm sm:text-lg px-4 sm:px-8 py-2 sm:py-4">
            View All Heroes
          </Link>
        </div>
      </section>

      {/* Stats Section - REMOVED */}

      {/* Upcoming Events Section */}
      <section className="mb-12 sm:mb-24">
        <div className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-4 led-animated">Upcoming Events</h2>
          <div className="led-line mb-4"></div>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg font-semibold">Join the community and showcase your skills</p>
        </div>
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {events.map(event => (
              <div key={event.id} className="card-gaming">
                <div className="mb-4">
                  <h3 className="text-lg sm:text-2xl font-bold mb-2 text-white">{event.name}</h3>
                  <p className="text-cyan-400 font-semibold text-xs sm:text-sm mb-4">{event.date || 'TBA'}</p>
                </div>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">{event.description}</p>
                <Link to="/events" className="btn-primary text-xs sm:text-sm inline-block py-1.5 sm:py-2 px-3 sm:px-4">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 card-gaming">
            <p className="text-gray-400 text-lg">No events scheduled yet</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mb-12 sm:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          <div className="card-gaming text-center group hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto mb-4"></div>
            <h3 className="text-lg sm:text-2xl font-black mb-2 sm:mb-3 text-white">130+ Heroes</h3>
            <p className="text-gray-400 text-sm sm:text-base">Diverse playstyles and roles</p>
          </div>
          <div className="card-gaming text-center group hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-4"></div>
            <h3 className="text-lg sm:text-2xl font-black mb-2 sm:mb-3 text-white">Smart Builds</h3>
            <p className="text-gray-400 text-sm sm:text-base">Share and discover strategies</p>
          </div>
          <div className="card-gaming text-center group hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl mx-auto mb-4"></div>
            <h3 className="text-lg sm:text-2xl font-black mb-2 sm:mb-3 text-white">Live Events</h3>
            <p className="text-gray-400 text-sm sm:text-base">Compete in matches</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl sm:rounded-3xl border border-cyan-500/30 backdrop-blur text-center">
        <Link to="/register" className="btn-primary text-sm sm:text-lg px-6 sm:px-10 py-2 sm:py-4 inline-block">
          Start Your Journey
        </Link>
      </section>

      <AdminLogin />
    </Layout>
  );
}
