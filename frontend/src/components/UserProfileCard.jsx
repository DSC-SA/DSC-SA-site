import React from 'react';
import { getImageUrl } from '../services/api';

export default function UserProfileCard({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-sm rounded-3xl glass-white p-8 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-brand-faint transition hover:bg-brand-cloud hover:text-brand-ink"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Profile picture */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-brand-blue/50 bg-brand-bluelt text-white shadow-glow">
            {user.avatar ? (
              <img src={getImageUrl(user.avatar)} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-bold">{user.username?.charAt(0)?.toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Username */}
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-brand-ink">{user.username}</h2>

        {/* Rank */}
        {user.rank && (
          <p className="mb-4 text-center font-semibold text-brand-mut">
            Rank: <span className="text-brand-bluedd">{user.rank}</span>
          </p>
        )}

        {/* Points */}
        {user.points !== undefined && (
          <div className="mb-4 rounded-2xl border border-brand-blue/20 bg-brand-mist p-3 text-center">
            <p className="mb-1 text-sm text-brand-mut">Community Points</p>
            <p className="font-display text-2xl font-bold text-brand-bluedd">{user.points}</p>
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <div className="mb-6 rounded-2xl border border-brand-line bg-brand-mist p-4">
            <p className="mb-2 text-sm font-semibold text-brand-ink">About</p>
            <p className="text-sm leading-relaxed text-brand-mut">{user.bio}</p>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
          <span className="text-brand-mut">Active Member</span>
        </div>

        <p className="mt-4 text-center text-xs text-brand-faint">Click anywhere to close</p>
      </div>
    </div>
  );
}