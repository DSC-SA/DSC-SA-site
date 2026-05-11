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
      'Tank': 'from-red-600 to-red-400',
      'Mage': 'from-blue-600 to-blue-400',
      'Marksman': 'from-yellow-600 to-yellow-400',
      'Assassin': 'from-purple-600 to-purple-400',
      'Support': 'from-green-600 to-green-400',
      'Fighter': 'from-orange-600 to-orange-400'
    };
    return colors[role] || 'from-purple-600 to-cyan-600';
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
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded"></div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Heroes</h1>
            </div>
            <p className="text-gray-300 text-sm ml-4">Browse all {heroes.length} official heroes</p>
          </div>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 font-bold text-sm transition-all duration-200 ${
              selectedRole === role
                ? 'bg-white text-gray-900 border border-white'
                : 'bg-transparent border border-gray-400 text-gray-300 hover:border-gray-300'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 mt-4">Loading heroes...</p>
        </div>
      ) : (
        <div>
          {filteredHeroes.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-1 sm:gap-2 md:gap-3">
              {filteredHeroes.map((hero) => (
                <HeroCard key={hero.id} hero={hero} />
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
