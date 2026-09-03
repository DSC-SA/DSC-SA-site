import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import HeroCard from '../components/HeroCard';
import ScrollRing from '../components/ScrollRing';
import Reveal from '../components/Reveal';
import { heroesAPI } from '../services/api';

const ROLES = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
const FEATURED = ['Khufra', 'Lancelot', 'Beatrix', 'Kagura', 'Estes', 'Arlott', 'Chou', 'Fanny', 'Gusion'];

export default function HeroesList() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('All');

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await heroesAPI.getAll();
        setHeroes(res.data);
      } catch (err) {
        console.error('Error fetching heroes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroes();
  }, []);

  const filteredHeroes = selectedRole === 'All' ? heroes : heroes.filter((h) => h.role === selectedRole);

  return (
    <Layout>
      <div className="mb-8">
        <Reveal>
          <div className="mb-1 flex items-center gap-3">
            <div className="mb-1 h-8 w-1 rounded-full bg-gradient-to-b from-brand-blue to-brand-bluelt"></div>
            <h1 className="font-display text-3xl font-bold text-brand-ink md:text-5xl">Heroes</h1>
          </div>
          <p className="ml-4 text-sm text-brand-mut">Browse all {heroes.length} official heroes</p>
        </Reveal>
      </div>

      {/* Interactive hero list — scroll-driven 3D pole carousel */}
      {!loading && (
        <div className="mb-14 -mx-4 sm:mx-0">
          <div className="mb-6 px-4 text-center sm:px-0">
            <p className="mb-1 font-display text-xl font-bold text-brand-ink sm:text-2xl">The Meta</p>
            <p className="text-sm text-brand-mut">Scroll to spin the rotation and explore the current meta</p>
          </div>
          {(() => {
            const featured = FEATURED.map((name) => heroes.find((h) => h.name === name)).filter(Boolean);
            return featured.length >= 2 ? <ScrollRing items={featured} /> : null;
          })()}
        </div>
      )}

      {/* Role filter + full roster */}
      <div className="mb-5">
        <h2 className="mb-4 font-display text-lg font-bold text-brand-ink sm:text-xl">All Heroes</h2>
      </div>

      {/* Role filter — horizontal scroll on mobile */}
      <div className="mb-7">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
          {ROLES.map((role) => {
            const active = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-blue text-white shadow-[0_8px_20px_-8px_rgba(91,181,232,0.7)]'
                    : 'border border-brand-line bg-brand-snow text-brand-mut hover:border-brand-blue hover:text-brand-bluedd'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
          <p className="mt-4 text-sm text-brand-mut">Loading heroes...</p>
        </div>
      ) : filteredHeroes.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4">
          {filteredHeroes.map((hero, i) => (
            <Reveal key={hero.id} delay={`${(i % 5) * 50}ms`}>
              <div style={{ aspectRatio: '1 / 1' }}>
                <HeroCard hero={hero} />
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-brand-mut">No heroes found in this category</p>
      )}
    </Layout>
  );
}