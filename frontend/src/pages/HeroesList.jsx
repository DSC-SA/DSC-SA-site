import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import HeroCard from '../components/HeroCard';
import { heroesAPI } from '../services/api';

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

  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

  const getRoleColor = (role) => {
    const colors = {
      'Tank': 'from-amber-700 to-amber-500',
      'Mage': 'from-blue-700 to-blue-500',
      'Marksman': 'from-yellow-600 to-yellow-400',
      'Assassin': 'from-purple-700 to-purple-500',
      'Support': 'from-green-700 to-green-500',
      'Fighter': 'from-orange-700 to-orange-500'
    };
    return colors[role] || 'from-amber-600 to-amber-400';
  };

  const filteredHeroes = selectedRole === 'All' 
    ? heroes 
    : heroes.filter(h => h.role === selectedRole);

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded"></div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Heroes</h1>
            </div>
            <p className="text-gray-400 text-sm ml-4">Browse all {heroes.length} official heroes</p>
          </div>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className="font-bold text-sm transition-all duration-200 rounded"
              style={{
                padding: '8px 16px',
                backgroundColor: '#C0C0C0',
                color: '#000000',
                border: '2px solid #808080',
                cursor: 'pointer'
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-amber-300 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 mt-4">Loading heroes...</p>
        </div>
      ) : (
        <div>
          {filteredHeroes.length > 0 ? (
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {filteredHeroes.map((hero) => (
                <div key={hero.id} style={{ aspectRatio: '1/1' }}>
                  <HeroCard hero={hero} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-12">No heroes found in this category</p>
          )}
        </div>
      )}
    </Layout>
  );
}
