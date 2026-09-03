import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="flex min-h-[70vh] items-center justify-center py-12">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-8">
            <p className="mb-4 text-8xl">🎮</p>
            <p className="mb-4 bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text font-display text-7xl font-bold text-transparent">404</p>
          </div>

          <h1 className="mb-3 font-display text-3xl font-bold text-brand-ink">Page Not Found</h1>
          <p className="mb-8 text-lg text-brand-mut">
            Looks like this hero got banned from the game! The page you're looking for doesn't exist.
          </p>

          <div className="mb-6 rounded-3xl border border-brand-line bg-brand-snow p-8 shadow-lift">
            <p className="mb-6 text-brand-mut">Let&apos;s get you back on track!</p>
            <div className="space-y-3">
              <Link to="/" className="btn-primary block py-3 font-semibold">
                🏠 Back to Home
              </Link>
              <Link to="/heroes" className="block rounded-xl border border-brand-blue/30 bg-brand-bluesoft px-6 py-3 font-semibold text-brand-bluedd transition hover:bg-brand-bluelt hover:text-white">
                🦸 Browse Heroes
              </Link>
            </div>
          </div>

          <p className="text-sm text-brand-faint">
            Need help? <a href="/" className="text-brand-bluedd hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
