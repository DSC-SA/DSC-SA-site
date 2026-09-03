import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api, getImageUrl } from '../services/api';
import UserProfileCard from '../components/UserProfileCard';

export default function Members() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);

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
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-1 rounded bg-gradient-to-b from-brand-blue to-brand-bluedd"></div>
          <h1 className="bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text text-4xl font-bold text-transparent md:text-5xl">🏆 Community Leaderboard</h1>
        </div>
        <p className="text-lg text-brand-mut">Earn points by commenting on hero cards and suggesting builds!</p>
      </div>

      {loading ? (
        <div className="text-center text-brand-mut">Loading leaderboard...</div>
      ) : leaderboard.length === 0 ? (
        <div className="rounded-3xl border border-brand-line bg-white p-8 text-center shadow-soft">
          <p className="mb-4 text-brand-mut">No players have earned points yet</p>
          <a href="/heroes" className="btn-primary inline-block">
            Get Started 🚀
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between rounded-2xl border border-brand-line bg-white p-4 shadow-soft transition hover:border-brand-blue/40 md:p-6">
              <div className="flex flex-1 items-center gap-4">
                <div className="w-12 text-center text-3xl">{getRankBadge(user.rank)}</div>
                <button
                  type="button"
                  onClick={() => setSelectedUserProfile(user)}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-brand-blue/50 bg-brand-bluelt text-white shadow-soft transition hover:scale-110"
                  aria-label={`View ${user.username}'s profile`}
                >
                  {user.avatar ? (
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold">{user.username?.charAt(0)?.toUpperCase()}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUserProfile(user)}
                  className="max-w-full flex-1 text-left transition hover:opacity-80"
                >
                  <h3 className="truncate text-xl font-bold text-brand-bluedd">{user.username}</h3>
                  <p className="text-sm text-brand-faint">{user.rank === 1 ? 'Top Contributor' : 'Community Member'}</p>
                </button>
              </div>
              <div className="text-right">
                <p className="bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text text-2xl font-bold text-transparent">{user.points}</p>
                <p className="text-xs text-brand-faint">Points</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-3xl border border-brand-line bg-white p-8 shadow-lift md:p-12">
        <h2 className="mb-4 font-display text-2xl font-bold text-brand-ink">How to Earn Points</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-brand-blue/20 bg-brand-mist p-4">
            <p className="mb-2 font-bold text-brand-bluedd">💬 Comment on Hero Cards</p>
            <p className="text-sm text-brand-mut">+10 points per comment</p>
          </div>
          <div className="rounded-2xl border border-brand-blue/20 bg-brand-mist p-4">
            <p className="mb-2 font-bold text-brand-bluedd">🔨 Suggest Builds</p>
            <p className="text-sm text-brand-mut">+25 points per build suggestion</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="mb-4 text-brand-mut">Start earning points now!</p>
          <a href="/heroes" className="btn-primary inline-block">
            🚀 Explore Heroes
          </a>
        </div>
      </div>

      {/* Profile Card Popup */}
      <UserProfileCard
        user={selectedUserProfile}
        onClose={() => setSelectedUserProfile(null)}
      />
    </Layout>
  );
}
