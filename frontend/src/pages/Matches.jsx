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
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-1 rounded bg-gradient-to-b from-brand-blue to-brand-bluedd"></div>
          <h1 className="bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text text-4xl font-bold text-transparent md:text-5xl">⚔️ Match History</h1>
        </div>
        <p className="text-lg text-brand-mut">Track your legendary battles and epic victories</p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <p className="text-brand-mut">⏳ Loading matches...</p>
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {matches.map(match => (
            <div
              key={match.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-brand-snow shadow-soft transition-all duration-300 hover:border-brand-blue/40 lg:flex-row"
            >
              {match.image && (
                <div className="relative h-48 w-full flex-shrink-0 overflow-hidden bg-brand-mist lg:h-auto lg:w-1/2">
                  {match.image.startsWith('data:video/') ? (
                    <video
                      src={match.image}
                      autoPlay
                      loop
                      muted
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <img
                      src={match.image}
                      alt={match.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                      ✓ Ended
                    </span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 font-display text-2xl font-bold text-brand-ink transition group-hover:text-brand-bluedd">{match.title}</h3>
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-brand-mut">{match.description}</p>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold text-brand-bluedd">
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
        <div className="rounded-3xl border border-brand-line bg-brand-snow p-12 text-center shadow-lift">
          <p className="mb-4 text-6xl">🎬</p>
          <p className="mb-2 font-display text-2xl font-bold text-brand-ink">No Matches Yet</p>
          <p className="mb-6 text-brand-mut">Matches will appear here when they're scheduled!</p>
          <div className="inline-block rounded-lg bg-gradient-to-r from-brand-blue to-brand-bluedd px-8 py-3 font-semibold text-white shadow-soft">
            ⚡ Stay Tuned
          </div>
        </div>
      )}
    </Layout>
  );
}
