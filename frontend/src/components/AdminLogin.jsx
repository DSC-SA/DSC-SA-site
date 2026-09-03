import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/admin/login', { username, password });
      const adminToken = res.data.token;
      sessionStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminToken', adminToken);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
      setUsername('');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 border-t border-brand-line pt-8">
      <div className="mx-auto max-w-md">
        {!showLoginForm ? (
          <button
            onClick={() => setShowLoginForm(true)}
            className="w-full rounded-full border border-brand-line bg-brand-snow px-4 py-3 text-sm font-semibold text-brand-mut transition hover:border-brand-blue hover:text-brand-bluedd"
          >
            Admin Access
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-line bg-brand-snow p-6 shadow-soft">
            <h3 className="mb-4 font-display text-xl font-bold text-brand-ink">Admin Login</h3>

            {error && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-brand-ink">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-2.5 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-brand-ink">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-2.5 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginForm(false);
                  setUsername('');
                  setPassword('');
                  setError('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
