import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { matchesAPI } from '../services/api';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await matchesAPI.getAll();
        setMatches(res.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <Layout>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-10 bg-gradient-to-b from-cyan-400 to-purple-500 rounded"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">⚔️ Match History</h1>
        </div>
        <p className="text-gray-400 text-lg">Track your legendary battles and epic victories</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">⏳ Loading matches...</p>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {matches.map(match => (
            <div key={match.id} className="card-gaming overflow-hidden hover:border-cyan-400 transition-all duration-300 group flex flex-col lg:flex-row">
              {match.image && (
                <div className="relative w-full lg:w-1/2 h-48 lg:h-auto overflow-hidden bg-gray-800 flex-shrink-0">
                  {match.image.startsWith('data:video/') ? (
                    <video
                      src={match.image}
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={match.image}
                      alt={match.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-30"></div>
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-600 text-gray-100">
                      ✓ Ended
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-400 transition line-clamp-2">{match.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">{match.description}</p>
                </div>
                
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <span>📅</span>
                  <span>{new Date(match.match_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-gaming p-12 text-center gradient-border">
          <p className="text-6xl mb-4">🎬</p>
          <p className="text-2xl font-bold mb-2">No Matches Yet</p>
          <p className="text-gray-400 mb-6">Matches will appear here when they're scheduled!</p>
          <div className="inline-block bg-gradient-to-r from-cyan-600 to-purple-600 px-8 py-3 rounded-lg font-semibold">
            ⚡ Stay Tuned
          </div>
        </div>
      )}
    </Layout>
  );
}
