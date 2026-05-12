import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getImageUrl } from '../services/api';

export default function Members() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/users/leaderboard');
      setLeaderboard(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <Layout>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-10 bg-gradient-to-b from-cyan-400 to-purple-500 rounded"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">🏆 Community Leaderboard</h1>
        </div>
        <p className="text-gray-400 text-lg">Earn points by commenting on hero cards and suggesting builds!</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-400">Loading leaderboard...</div>
      ) : leaderboard.length === 0 ? (
        <div className="card-gaming p-8 text-center">
          <p className="text-gray-400 mb-4">No players have earned points yet</p>
          <a href="/heroes" className="btn-primary inline-block">
            Get Started 🚀
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div key={user.id} className="card-gaming p-4 md:p-6 hover:border-cyan-400 transition flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-3xl w-12 text-center">{getRankBadge(user.rank)}</div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, #d4af37, #ffd700, #d4af37)',
                  padding: '1.5px',
                  animation: 'spin 4s linear infinite',
                  flexShrink: 0
                }}>
                  <style>{`
                    @keyframes spin {
                      from { filter: hue-rotate(0deg); }
                      to { filter: hue-rotate(360deg); }
                    }
                  `}</style>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {user.avatar ? (
                      <img 
                        src={getImageUrl(user.avatar)} 
                        alt={user.username} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                      />
                    ) : (
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#22d3ee'
                      }}>{user.username?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-cyan-400">{user.username}</h3>
                  <p className="text-gray-500 text-sm">{user.rank === 1 ? 'Top Contributor' : 'Community Member'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{user.points}</p>
                <p className="text-gray-500 text-xs">Points</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 card-gaming p-8 md:p-12 gradient-border">
        <h2 className="text-2xl font-bold mb-4">How to Earn Points</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
            <p className="text-cyan-400 font-bold mb-2">💬 Comment on Hero Cards</p>
            <p className="text-gray-400 text-sm">+10 points per comment</p>
          </div>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg">
            <p className="text-purple-400 font-bold mb-2">🔨 Suggest Builds</p>
            <p className="text-gray-400 text-sm">+25 points per build suggestion</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-400 mb-4">Start earning points now!</p>
          <a href="/heroes" className="btn-primary inline-block">
            🚀 Explore Heroes
          </a>
        </div>
      </div>
    </Layout>
  );
}
