import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

export default function HeroCard({ hero }) {
  const getRoleColor = (role) => {
    const roleColors = {
      'Tank': 'from-amber-700 to-amber-500',
      'Fighter': 'from-orange-700 to-orange-500',
      'Assassin': 'from-purple-700 to-purple-500',
      'Mage': 'from-blue-700 to-blue-500',
      'Marksman': 'from-yellow-600 to-yellow-400',
      'Support': 'from-green-700 to-green-500',
    };
    return roleColors[role] || 'from-amber-600 to-amber-400';
  };

  // Add cache-busting parameter to image URL to ensure fresh images
  const getCardImageUrl = (url) => {
    const fullUrl = getImageUrl(url);
    if (!fullUrl) return null;
    const separator = fullUrl.includes('?') ? '&' : '?';
    return `${fullUrl}${separator}t=${Date.now()}`;
  };

  return (
    <Link to={`/heroes/${hero.id}`} className="group">
      <div 
        className="group relative rounded-lg transition-all duration-200 hover:scale-110 hover:z-20 cursor-pointer"
        style={{ 
          width: '100%',
          height: '100%',
          border: '2px solid #d4af37',
          boxShadow: 'inset 0 0 0 1px rgba(212, 175, 55, 0.3)',
          backgroundColor: '#1a1a1a',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        
        {/* Hero Portrait Image - Display Area */}
        {hero.icon_url ? (
          <img 
            src={getCardImageUrl(hero.icon_url)} 
            alt={hero.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center absolute inset-0">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}

        {/* Hero Name - Bottom Display */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-black/50 px-1 py-2 z-10 border-t border-amber-600/30">
          <p className="text-white font-bold text-xs text-center leading-tight line-clamp-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{hero.name}</p>
          {hero.role && <p className="bg-amber-500 text-black font-bold text-xs text-center leading-tight line-clamp-1 rounded px-2 py-1" style={{ fontSize: '0.65rem' }}>{hero.role}</p>}
        </div>
      </div>
    </Link>
  );
}

