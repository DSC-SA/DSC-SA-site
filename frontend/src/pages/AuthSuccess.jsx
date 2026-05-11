import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [tempUsername, setTempUsername] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const usernameParam = searchParams.get('username');
    const emailParam = searchParams.get('email');
    const newUserParam = searchParams.get('newUser');

    if (tokenParam && usernameParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      setTempUsername(usernameParam);

      if (newUserParam === 'true') {
        setIsNewUser(true);
      } else {
        // Existing user, log in directly
        login({ username: usernameParam, email: emailParam }, tokenParam);
        setTimeout(() => navigate('/'), 500);
      }
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate, login]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/update-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: username.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update username');
        setLoading(false);
        return;
      }

      // Login with updated username
      login({ username: data.user.username, email: data.user.email }, token);
      
      // Redirect to home
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      setError('Network error: ' + err.message);
      setLoading(false);
    }
  };

  if (isNewUser) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-gray-800 rounded-lg p-8 border border-cyan-500/30">
              <h1 className="text-3xl font-bold text-cyan-400 mb-2 text-center">Welcome!</h1>
              <p className="text-gray-300 text-center mb-6">Create your username to get started</p>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-300 p-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleUsernameSubmit}>
                <div className="mb-4">
                  <label className="block text-cyan-300 text-sm font-semibold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-gray-700 border border-cyan-500/30 rounded text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    minLength={3}
                    maxLength={50}
                    required
                  />
                  <p className="text-gray-400 text-xs mt-1">3-50 characters</p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-400 text-sm">
                    Email: <span className="text-cyan-400">{email}</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !username.trim()}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-2 rounded hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-4">Signing you in...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </div>
    </Layout>
  );
}
