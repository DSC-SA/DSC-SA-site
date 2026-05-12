import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/api';
import '../styles/index.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);

  // Reset image error when user changes (e.g., after profile update)
  useEffect(() => {
    setImageError(false);
  }, [user?.avatar]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfilePopupOpen(false);
  };

  const handleImageError = (e) => {
    const imgUrl = getImageUrl(user?.avatar);
    console.warn('Failed to load avatar image', {
      username: user?.username,
      avatar: user?.avatar,
      fullUrl: imgUrl,
      error: e.type
    });
    setImageError(true);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setProfilePopupOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gaming-dark via-gaming-dark to-gray-900 border-b border-cyan-500 border-opacity-30 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="text-xl sm:text-3xl font-black tracking-tighter logo-animated">
              <span className="gradient-gaming">DSC-SA</span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex" style={{ gap: '4px', alignItems: 'center' }}>
            <Link to="/" style={{ 
              textDecoration: 'none',
              padding: '3px 8px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '9999px',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }} 
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(34, 211, 238, 0.15)';
              e.target.style.color = '#ffffff';
              e.target.style.borderColor = 'rgba(34, 211, 238, 1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#d1d5db';
              e.target.style.borderColor = 'rgba(34, 211, 238, 0.4)';
            }}>
              Home
            </Link>
            <Link to="/heroes" style={{ 
              textDecoration: 'none',
              padding: '3px 8px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '9999px',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(34, 211, 238, 0.15)';
              e.target.style.color = '#ffffff';
              e.target.style.borderColor = 'rgba(34, 211, 238, 1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#d1d5db';
              e.target.style.borderColor = 'rgba(34, 211, 238, 0.4)';
            }}>
              Heroes
            </Link>
            <Link to="/events" style={{ 
              textDecoration: 'none',
              padding: '3px 8px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '9999px',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(34, 211, 238, 0.15)';
              e.target.style.color = '#ffffff';
              e.target.style.borderColor = 'rgba(34, 211, 238, 1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#d1d5db';
              e.target.style.borderColor = 'rgba(34, 211, 238, 0.4)';
            }}>
              Events
            </Link>
            <Link to="/matches" style={{ 
              textDecoration: 'none',
              padding: '3px 8px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '9999px',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(34, 211, 238, 0.15)';
              e.target.style.color = '#ffffff';
              e.target.style.borderColor = 'rgba(34, 211, 238, 1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#d1d5db';
              e.target.style.borderColor = 'rgba(34, 211, 238, 0.4)';
            }}>
              Matches
            </Link>
            <Link to="/members" style={{ 
              textDecoration: 'none',
              padding: '3px 8px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderRadius: '9999px',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(34, 211, 238, 0.15)';
              e.target.style.color = '#ffffff';
              e.target.style.borderColor = 'rgba(34, 211, 238, 1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#d1d5db';
              e.target.style.borderColor = 'rgba(34, 211, 238, 0.4)';
            }}>
              Members
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex gap-2 lg:gap-3 items-center">
            {user ? (
              <div className="flex items-center gap-2 lg:gap-3 relative">
                <button onClick={() => setProfilePopupOpen(!profilePopupOpen)} title={user.username} className="flex items-center justify-center hover:opacity-80 transition relative">
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #d4af37, #ffd700, #d4af37)',
                    padding: '1.5px',
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
                      {user.avatar && !imageError ? (
                        <img 
                          src={getImageUrl(user.avatar)} 
                          alt={user.username}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            display: 'block'
                          }}
                          onError={handleImageError}
                        />
                      ) : (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: '#22d3ee'
                        }}>{user.username?.charAt(0)?.toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Profile Popup */}
                {profilePopupOpen && (
                  <>
                    {/* Backdrop to close popup */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfilePopupOpen(false)}
                    />
                    
                    {/* Popup Menu */}
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-gray-900 border border-cyan-500 border-opacity-50 rounded-lg shadow-2xl p-4 z-50"
                      style={{
                        top: '100%',
                        backgroundColor: 'rgba(17, 24, 39, 0.98)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3 pb-3 border-b border-cyan-500 border-opacity-30">
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'conic-gradient(from 0deg, #d4af37, #ffd700, #d4af37)',
                          padding: '2px',
                          flexShrink: 0
                        }}>
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
                            {user.avatar && !imageError ? (
                              <img 
                                src={getImageUrl(user.avatar)} 
                                alt={user.username}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  objectPosition: 'center',
                                  display: 'block'
                                }}
                              />
                            ) : (
                              <span style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#22d3ee'
                              }}>{user.username?.charAt(0)?.toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-cyan-400">{user.username}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="pt-3 space-y-2">
                        <button 
                          onClick={handleProfileClick}
                          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-cyan-500 hover:bg-opacity-20 hover:text-cyan-400 rounded transition"
                        >
                          👤 Edit Profile
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-400 rounded transition"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button onClick={handleLogout} className="text-gray-400 hover:text-cyan-400 text-xs lg:text-sm font-semibold transition">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2 lg:gap-3">
                <Link to="/login" className="btn-primary text-xs px-3 py-1.5 lg:px-4 lg:py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-xs px-3 py-1.5 lg:px-4 lg:py-2">
                  Register
                </Link>
              </div>
            )}
          </div>


        </div>

        {/* Mobile Navigation */}
        {false && (
          <div className="md:hidden pb-2 border-t border-cyan-500 border-opacity-30">
            <div className="flex flex-col gap-0 pt-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-2 px-3 font-bold text-xs sm:text-sm transition">Home</Link>
              <Link to="/heroes" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-2 px-3 font-bold text-xs sm:text-sm transition">Heroes</Link>
              <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-2 px-3 font-bold text-xs sm:text-sm transition">Events</Link>
              <Link to="/matches" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-2 px-3 font-bold text-xs sm:text-sm transition">Matches</Link>
              <Link to="/members" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-2 px-3 font-bold text-xs sm:text-sm transition">Members</Link>
              
              <div className="border-t border-cyan-500 border-opacity-30 pt-2 mt-2 px-3">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xs">
                        {user.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <p className="text-cyan-400 font-bold text-sm">{user.username}</p>
                    </div>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full block text-center text-sm py-2">
                      👤 Edit Profile
                    </Link>
                    <button onClick={handleLogout} className="btn-primary w-full text-sm py-2">Logout</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full block text-center py-2 text-xs">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full block text-center py-2 text-xs">
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
