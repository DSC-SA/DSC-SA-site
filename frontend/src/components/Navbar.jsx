import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Single nav link — hover is handled by CSS (no inline handlers).
 */
function NavItem({ to, label, onClick, onMouseEnter, onMouseLeave }) {
  const common = {
    className:
      'px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 ' +
      'hover:text-white hover:bg-white/5 transition whitespace-nowrap'
  };
  return (
    <Link to={to} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...common}>
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

  // Reset image error when user changes (e.g., after profile update)
  useEffect(() => {
    setImageError(false);
  }, [user?.id]);

  const getAvatarUrl = () => {
    if (!user.hasAvatar && user.avatar && /^https?:\/\//.test(user.avatar)) {
      return user.avatar;
    }
    return `${window.location.origin}/api/users/${user.id}/avatar?t=${Date.now()}`;
  };

  const handleImageError = () => setImageError(true);

  const handleLogout = () => {
    logout();
    navigate('/');
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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0c0d10]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-gold">
              DSC-SA
            </span>
          </Link>

          {/* Desktop Navigation — center */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to} label={l.label} />
            ))}
          </div>

          {/* Right controls: auth + mobile toggle */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfilePopupOpen((v) => !v)}
                  title={user.username}
                  className="flex items-center justify-center rounded-full transition hover:opacity-85"
                  style={{
                    width: 32,
                    height: 32,
                    border: '1px solid rgba(212, 175, 55, 0.5)',
                    overflow: 'hidden'
                  }}
                >
                  {!imageError ? (
                    <img
                      src={getAvatarUrl()}
                      alt={user.username}
                      onError={handleImageError}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="bg-surface2 text-brand-gold text-sm font-bold">
                      {user.username?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </button>

                {profilePopupOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfilePopupOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-white/10 bg-surface2 p-4 shadow-md">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                        <div className="h-9 w-9 overflow-hidden rounded-full border border-brand-gold/50 bg-surface3">
                          {!imageError ? (
                            <img src={getAvatarUrl()} alt={user.username} className="h-full w-full object-cover" onError={handleImageError} />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-surface3 text-brand-gold text-sm font-bold">
                              {user.username?.charAt(0)?.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">{user.username}</p>
                          <p className="truncate text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <button
                          onClick={handleProfileClick}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
                        >
                          Edit Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary px-3 py-1.5 text-xs">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-3 py-1.5 text-xs">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 transition hover:bg-white/5 md:hidden"
              aria-label="Toggle navigation menu"
            >
              <div className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded bg-current text-white"></span>
                <span className="block h-0.5 w-5 rounded bg-current text-white"></span>
                <span className="block h-0.5 w-5 rounded bg-current text-white"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 pb-2 md:hidden">
            <div className="flex flex-col pt-1">
              {links.map((l) => (
                <NavItem
                  key={l.to}
                  to={l.to}
                  label={l.label}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
              <div className="mt-2 border-t border-white/10 px-3 pt-3">
                {user ? (
                  <div className="space-y-2">
                    <button onClick={handleProfileClick} className="btn-secondary w-full text-sm py-2">
                      Edit Profile
                    </button>
                    <button onClick={handleLogout} className="btn-primary w-full text-sm py-2">
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary block w-full text-center py-2 text-xs">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary block w-full text-center py-2 text-xs">
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