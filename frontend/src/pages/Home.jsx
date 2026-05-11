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
        setHeroes(heroesRes.data.slice(0, 9));
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
      <section className="mb-12 sm:mb-24 py-12 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div className="slide-down">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 leading-tight">
              Welcome to <span className="gradient-gaming logo-animated">DSC-SA</span>
              <br />
              <span className="text-white">Community Hub</span>
            </h1>
            <div className="text-4xl sm:text-6xl mb-6 sm:mb-8 wave-emoji" style={{display: 'inline-block'}}>
              👋
            </div>
            <div className="flex gap-3 sm:gap-6 flex-wrap">
              <Link to="/heroes" className="btn-primary">
                Explore Heroes
              </Link>
              <Link to="/events" className="btn-secondary">
                View Events
              </Link>
            </div>
          </div>
          <div className="hidden md:block scale-in">
            <div className="gradient-bg rounded-3xl p-1 opacity-100 group hover:opacity-100 transition">
              <div className="bg-gaming-dark rounded-3xl p-12 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10"></div>
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mx-auto mb-6 relative z-1 group-hover:scale-110 transition duration-300"></div>
                <p className="text-gray-300 text-lg font-semibold relative z-1">Master the Meta</p>
                <p className="text-gray-400 text-sm mt-2 relative z-1">Strategic gameplay starts here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Heroes Section */}
      <section className="mb-12 sm:mb-24">
        <div className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-4 text-white">Featured Heroes</h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg font-semibold">Explore the heroes that shape the meta</p>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-cyan-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 mt-4">Loading heroes...</p>
          </div>
        ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-1 sm:gap-2 md:gap-3">
            {heroes.map(hero => (
              <Link 
                key={hero.id} 
                to={`/heroes/${hero.id}`}
                className="group"
                style={{ textDecoration: 'none' }}
              >
                <div className="flex flex-col items-center gap-0.5 h-full">
                  <div 
                    className="w-full aspect-square rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm text-white hover:scale-110 transition duration-300 shadow-lg hover:shadow-cyan-500/50"
                    style={{
                      background: hero.role === 'Tank' ? 'linear-gradient(to bottom, #4f46e5, #3730a3)' :
                                  hero.role === 'Fighter' ? 'linear-gradient(to bottom, #dc2626, #991b1b)' :
                                  hero.role === 'Assassin' ? 'linear-gradient(to bottom, #7c3aed, #5b21b6)' :
                                  hero.role === 'Mage' ? 'linear-gradient(to bottom, #0284c7, #0c4a6e)' :
                                  hero.role === 'Marksman' ? 'linear-gradient(to bottom, #ea580c, #c2410c)' :
                                  hero.role === 'Support' ? 'linear-gradient(to bottom, #059669, #065f46)' :
                                  'linear-gradient(to bottom, #6366f1, #4f46e5)'
                    }}
                  >
                    {hero.role?.[0]?.toUpperCase() || '?'}
                  </div>
                  <p className="text-center text-xs font-semibold text-gray-300 group-hover:text-cyan-400 transition line-clamp-2 text-xs max-w-10">
                    {hero.name}
                  </p>
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
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-4 text-white">Upcoming Events</h2>
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
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 text-white">Ready to Dominate?</h2>
        <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-10 font-semibold max-w-2xl mx-auto px-4">
          Join our thriving community of MLBB players and elevate your gameplay to the next level
        </p>
        <Link to="/register" className="btn-primary text-sm sm:text-lg px-6 sm:px-10 py-2 sm:py-4 inline-block">
          Start Your Journey
        </Link>
      </section>

      <AdminLogin />
    </Layout>
  );
}
