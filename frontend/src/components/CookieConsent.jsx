import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'dscsa_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (accepted) => {
    localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'declined');
    setLeaving(true);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-[100] p-4 transition-opacity duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ pointerEvents: leaving ? 'none' : 'auto' }}
    >
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gaming-dark to-gray-900 border border-cyan-500 border-opacity-40 rounded-2xl shadow-2xl p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              🍪 We use cookies
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              We use cookies to improve your experience, analyze traffic, and
              remember your preferences. By continuing to use this site, you
              agree to our{' '}
              <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link to="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => handleChoice(false)}
              className="btn-secondary text-xs px-4 py-2.5 text-center"
            >
              Decline
            </button>
            <button
              onClick={() => handleChoice(true)}
              className="btn-primary text-xs px-4 py-2.5 text-center"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
