import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

export default function HeroCard({ hero }) {
  const getRoleColor = (role) => {
    const roleColors = {
      'Tank': 'from-red-600 to-red-400',
      'Fighter': 'from-orange-600 to-orange-400',
      'Assassin': 'from-purple-600 to-purple-400',
      'Mage': 'from-blue-600 to-blue-400',
      'Marksman': 'from-yellow-600 to-yellow-400',
      'Support': 'from-green-600 to-green-400',
    };
    return roleColors[role] || 'from-purple-600 to-cyan-600';
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
        className="group relative rounded-lg transition-all duration-200 hover:scale-105 hover:z-20 cursor-pointer bg-blue-900"
        style={{ 
          width: '120px',
          height: '144px',
          border: '3px solid #3b82f6',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative'
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
          <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center absolute inset-0">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}

        {/* Hero Name - Bottom Display */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 z-10">
          <p className="text-white font-bold text-xs text-center leading-tight line-clamp-2">{hero.name}</p>
        </div>
      </div>
    </Link>
  );
}

