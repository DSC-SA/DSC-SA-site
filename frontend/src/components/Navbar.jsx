import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavItem({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-full px-3 py-2 text-sm font-semibold text-brand-mut transition hover:bg-brand-blue/10 hover:text-brand-bluedd whitespace-nowrap md:px-4"
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setImageError(false), [user?.id]);

  const getAvatarUrl = () => {
    if (!user.hasAvatar && user.avatar && /^https?:\/\//.test(user.avatar)) return user.avatar;
    return `${window.location.origin}/api/users/${user.id}/avatar?t=${Date.now()}`;
  };

  const handleImageError = () => setImageError(true);

  const handleLogout = () => {
    logout();
    setProfilePopupOpen(false);
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setProfilePopupOpen(false);
    setMobileMenuOpen(false);
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/heroes', label: 'Heroes' },
    { to: '/events', label: 'Events' },
    { to: '/matches', label: 'Matches' },
    { to: '/members', label: 'Members' },
    { to: '/nsfw', label: 'NSFW' }
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-line/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center">
            <span className="font-display text-2xl font-bold tracking-tight text-brand-bluedd">
              DSC-SA
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 md:flex">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to} label={l.label} />
            ))}
          </div>

          {/* Right: auth + mobile toggle */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfilePopupOpen((v) => !v)}
                  title={user.username}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-brand-blue/60 transition hover:ring-4 hover:ring-brand-blue/20"
                >
                  {!imageError ? (
                    <img src={getAvatarUrl()} alt={user.username} onError={handleImageError} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-brand-bluelt text-sm font-bold text-white">
                      {user.username?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </button>

                {profilePopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfilePopupOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] rounded-2xl glass-white p-4">
                      <div className="flex items-center gap-3 border-b border-brand-line pb-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-brand-bluelt">
                          {!imageError ? (
                            <img src={getAvatarUrl()} alt={user.username} className="h-full w-full object-cover" onError={handleImageError} />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                              {user.username?.charAt(0)?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-brand-ink">{user.username}</p>
                          <p className="truncate text-xs text-brand-faint">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <button onClick={handleProfileClick} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-brand-mut transition hover:bg-brand-blue/10 hover:text-brand-bluedd">
                          Edit Profile
                        </button>
                        <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-brand-mut transition hover:bg-brand-blue/10 hover:text-brand-bluedd">
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary px-4 py-2 text-xs">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-4 py-2 text-xs">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-line bg-white text-brand-ink transition hover:bg-brand-cloud md:hidden"
              aria-label="Toggle navigation menu"
            >
              <div className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded bg-current"></span>
                <span className="block h-0.5 w-5 rounded bg-current"></span>
                <span className="block h-0.5 w-5 rounded bg-current"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="border-t border-brand-line/70 pb-3 md:hidden">
            <div className="flex flex-col gap-1 pt-2">
              {links.map((l) => (
                <NavItem key={l.to} to={l.to} label={l.label} onClick={() => setMobileMenuOpen(false)} />
              ))}
              <div className="mt-2 border-t border-brand-line px-1 pt-3">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <button onClick={handleProfileClick} className="btn-secondary w-full py-2.5 text-sm">
                      Edit Profile
                    </button>
                    <button onClick={handleLogout} className="btn-primary w-full py-2.5 text-sm">
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary block w-full py-2.5 text-center text-sm">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary block w-full py-2.5 text-center text-sm">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}