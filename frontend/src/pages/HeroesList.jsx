import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import HelixSpiral from '../components/HelixSpiral';
import { heroesAPI } from '../services/api';

const ROLES = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

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
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-3">
          <div className="mb-1 h-8 w-1 rounded-full bg-gradient-to-b from-brand-blue to-brand-bluelt"></div>
          <h1 className="font-display text-3xl font-bold text-brand-ink md:text-4xl">Heroes</h1>
        </div>
        <p className="ml-4 text-sm text-brand-mut">
          The full roster wraps around the pole — scroll to spin it past
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="mx-auto inline-block h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent"></div>
          <p className="mt-4 text-sm text-brand-mut">Loading heroes...</p>
        </div>
      ) : filteredHeroes.length > 0 ? (
        <>
          {/* Role filter — wraps the helix below */}
          <div className="mb-4">
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

          <div className="-mx-4 sm:mx-0">
            <HelixSpiral items={filteredHeroes} />
          </div>
        </>
      ) : (
        <p className="py-24 text-center text-brand-mut">No heroes found in this category</p>
      )}
    </Layout>
  );
}