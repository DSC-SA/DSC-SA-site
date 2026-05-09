import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <p className="text-8xl mb-4">🎮</p>
            <p className="text-7xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">404</p>
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
          <p className="text-gray-400 text-lg mb-8">
            Looks like this hero got banned from the game! The page you're looking for doesn't exist.
          </p>

          <div className="card-gaming p-8 mb-6 gradient-border">
            <p className="text-gray-300 mb-6">Let's get you back on track!</p>
            <div className="space-y-3">
              <Link to="/" className="block btn-primary py-3 font-semibold">
                🏠 Back to Home
              </Link>
              <Link to="/heroes" className="block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition">
                🦸 Browse Heroes
              </Link>
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            Need help? <a href="/" className="text-cyan-400 hover:text-cyan-300">Contact support</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
