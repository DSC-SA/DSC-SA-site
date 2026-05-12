import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'fluffy' && password === '258025') {
      // Create a temporary admin token (valid for this session)
      const adminToken = btoa(`admin:${Date.now()}`); // Simple base64 encoding
      // Set admin session and token
      sessionStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminToken', adminToken);
      localStorage.setItem('token', adminToken);
      // Navigate to admin page
      navigate('/admin');
    } else {
      setError('Invalid credentials');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-purple-500 border-opacity-20">
      <div className="max-w-md mx-auto">
        {!showLoginForm ? (
          <button
            onClick={() => setShowLoginForm(true)}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:opacity-90 transition text-sm"
          >
            🔐 Admin Access
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gaming-dark rounded-lg p-6 border border-purple-500 border-opacity-30">
            <h3 className="text-xl font-bold text-white mb-4">Admin Login</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-600 bg-opacity-20 border border-red-500 rounded text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-cyan-400 focus:outline-none transition"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded hover:opacity-90 transition"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginForm(false);
                  setUsername('');
                  setPassword('');
                  setError('');
                }}
                className="flex-1 py-2 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition"
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
