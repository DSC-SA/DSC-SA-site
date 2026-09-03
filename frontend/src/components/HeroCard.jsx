import React from 'react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';
import { getImageUrl } from '../services/api';

export default function HeroCard({ hero }) {
  // Cache-busting so fresh images always load
  const getCardImageUrl = (url) => {
    const fullUrl = getImageUrl(url);
    if (!fullUrl) return null;
    const sep = fullUrl.includes('?') ? '&' : '?';
    return `${fullUrl}${sep}t=${Date.now()}`;
  };

  return (
    <Link to={`/heroes/${hero.id}`} className="group block h-full w-full">
      <TiltCard className="hero-glow relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-brand-line bg-white transition-colors duration-300 group-hover:border-brand-blue">
        {/* Portrait fill */}
        <div className="relative w-full flex-1 overflow-hidden bg-brand-cloud">
          {hero.icon_url ? (
            <img
              src={getCardImageUrl(hero.icon_url)}
              alt={hero.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-bluelt/40 to-brand-cloud">
              <span className="text-xs font-medium text-brand-faint">No Image</span>
            </div>
          )}
          {/* hover glow tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Name bar */}
        <div className="p-2.5 text-center">
          <p className="truncate text-xs font-bold text-brand-ink group-hover:text-brand-bluedd sm:text-sm">
            {hero.name}
          </p>
          {hero.role && (
            <p className="mt-0.5 text-[0.65rem] font-medium text-brand-mut">{hero.role}</p>
          )}
        </div>
      </TiltCard>
    </Link>
  );
}