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
      <div className="mx-auto max-w-4xl rounded-2xl glass-white p-5 sm:p-6 shadow-lift">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h3 className="mb-1 font-display text-lg font-bold text-brand-ink sm:text-xl">
              We use cookies
            </h3>
            <p className="text-sm leading-relaxed text-brand-mut">
              We use cookies to improve your experience, analyze traffic, and
              remember your preferences. By continuing to use this site, you
              agree to our{' '}
              <Link to="/privacy" className="font-semibold text-brand-bluedd hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link to="/terms" className="font-semibold text-brand-bluedd hover:underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={() => handleChoice(false)}
              className="btn-secondary px-4 py-2.5 text-center text-xs"
            >
              Decline
            </button>
            <button
              onClick={() => handleChoice(true)}
              className="btn-primary px-4 py-2.5 text-center text-xs"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
