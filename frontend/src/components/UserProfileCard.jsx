import React from 'react';
import { getImageUrl } from '../services/api';

export default function UserProfileCard({ user, onClose }) {
  if (!user) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="card-gaming p-8 max-w-sm w-full transform transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.2), inset 0 0 20px rgba(212, 175, 55, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400 transition"
          style={{ fontSize: '24px' }}
        >
          ✕
        </button>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #d4af37, #ffd700, #d4af37)',
            padding: '2px',
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
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#22d3ee'
                }}>{user.username?.charAt(0)?.toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>

        {/* Username */}
        <h2 className="text-2xl font-bold text-cyan-400 text-center mb-2">
          {user.username}
        </h2>

        {/* Rank */}
        {user.rank && (
          <p className="text-center text-purple-400 font-semibold mb-4">
            Rank: <span className="text-yellow-400">{user.rank}</span>
          </p>
        )}

        {/* Points */}
        {user.points !== undefined && (
          <div className="bg-gray-900 bg-opacity-50 rounded-lg p-3 mb-4 text-center border border-cyan-400 border-opacity-20">
            <p className="text-gray-400 text-sm mb-1">Community Points</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              {user.points}
            </p>
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 mb-6 border border-purple-400 border-opacity-20">
            <p className="text-gray-400 text-sm mb-2 font-semibold">About</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {user.bio}
            </p>
          </div>
        )}

        {/* Status */}
        <div className="text-center text-sm">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-gray-400">Active Member</span>
          </div>
        </div>

        {/* Close hint */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Click anywhere to close
        </p>
      </div>
    </div>
  );
}
