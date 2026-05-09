import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/index.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gaming-dark via-gaming-dark to-gray-900 border-b border-cyan-500 border-opacity-30 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="text-3xl font-black tracking-tighter logo-animated">
              <span className="gradient-gaming">DSC-SA</span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/" style={{ 
              textDecoration: 'none',
              padding: '8px 20px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '9999px',
              border: '1.5px solid rgba(34, 211, 238, 0.4)',
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
              padding: '8px 20px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '9999px',
              border: '1.5px solid rgba(34, 211, 238, 0.4)',
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
              padding: '8px 20px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '9999px',
              border: '1.5px solid rgba(34, 211, 238, 0.4)',
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
              padding: '8px 20px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '9999px',
              border: '1.5px solid rgba(34, 211, 238, 0.4)',
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
              padding: '8px 20px',
              color: '#d1d5db',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '9999px',
              border: '1.5px solid rgba(34, 211, 238, 0.4)',
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
          <div className="hidden md:flex gap-3 items-center">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" title={user.username} className="text-2xl hover:scale-110 transition cursor-pointer">
                  👤
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-cyan-400 text-sm font-semibold transition">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-primary text-xs px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-xs px-4 py-2">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cyan-400 text-2xl font-bold hover:text-purple-400 transition"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-cyan-500 border-opacity-30">
            <div className="flex flex-col gap-1 pt-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-3 px-4 font-bold text-sm transition">Home</Link>
              <Link to="/heroes" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-3 px-4 font-bold text-sm transition">Heroes</Link>
              <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-3 px-4 font-bold text-sm transition">Events</Link>
              <Link to="/matches" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-3 px-4 font-bold text-sm transition">Matches</Link>
              <Link to="/members" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500 hover:bg-opacity-10 py-3 px-4 font-bold text-sm transition">Members</Link>
              
              <div className="border-t border-cyan-500 border-opacity-30 pt-4 mt-4 px-4">
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
