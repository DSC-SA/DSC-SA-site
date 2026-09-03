import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';

export default function HeroCard({ hero }) {
  // Add cache-busting parameter to image URL to ensure fresh images
  const getCardImageUrl = (url) => {
    const fullUrl = getImageUrl(url);
    if (!fullUrl) return null;
    const separator = fullUrl.includes('?') ? '&' : '?';
    return `${fullUrl}${separator}t=${Date.now()}`;
  };

  return (
    <Link to={`/heroes/${hero.id}`} className="group block h-full w-full">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-brand-gold/40 bg-surface2 transition-transform duration-200 group-hover:scale-105 group-hover:border-brand-gold">
        {/* Hero portrait — absolute fill so card size/shape never shifts */}
        {hero.icon_url ? (
          <img
            src={getCardImageUrl(hero.icon_url)}
            alt={hero.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface3">
            <span className="text-xs text-slate-500">No Image</span>
          </div>
        )}

        {/* Hero name + role overlay (hidden on mobile so it doesn't cover art) */}
        <div className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-brand-gold/30 bg-gradient-to-t from-black/95 to-black/50 px-1 py-2 md:block">
          <p className="text-center text-[0.7rem] font-bold leading-tight tracking-wide text-white">
            {hero.name}
          </p>
          {hero.role && (
            <p className="mt-1 rounded bg-brand-gold px-2 py-1 text-center text-[0.65rem] font-bold leading-tight text-black">
              {hero.role}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}