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
    const idParam = searchParams.get('id');
    const usernameParam = searchParams.get('username');
    const emailParam = searchParams.get('email');
    const avatarParam = searchParams.get('avatar');
    const hasAvatarParam = searchParams.get('hasAvatar') === 'true';
    const rankParam = searchParams.get('rank');
    const bioParam = searchParams.get('bio');
    const pointsParam = searchParams.get('points');
    const newUserParam = searchParams.get('newUser');

    if (tokenParam && usernameParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      setTempUsername(usernameParam);

      if (newUserParam === 'true') {
        setIsNewUser(true);
      } else {
        // Existing user, log in directly
        login({ 
          id: idParam, 
          username: usernameParam, 
          email: emailParam,
          avatar: avatarParam || null,
          hasAvatar: hasAvatarParam,
          rank: rankParam || null,
          bio: bioParam || null,
          points: parseInt(pointsParam) || 0
        }, tokenParam);
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

      // Login with updated username (extract id from token)
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      login({ 
        id: decodedToken.id, 
        username: data.user.username, 
        email: data.user.email,
        avatar: data.user.avatar,
        hasAvatar: data.user.hasAvatar || false,
        rank: data.user.rank,
        bio: data.user.bio,
        points: data.user.points
      }, token);
      
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
        <div className="flex min-h-[70vh] items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-brand-line bg-brand-snow p-8 shadow-lift">
              <h1 className="mb-2 text-center font-display text-3xl font-bold text-brand-ink">Welcome!</h1>
              <p className="mb-6 text-center text-brand-mut">Create your username to get started</p>

              {error && (
                <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleUsernameSubmit}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-brand-bluedd">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    disabled={loading}
                    className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-2 text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                    minLength={3}
                    maxLength={50}
                    required
                  />
                  <p className="mt-1 text-xs text-brand-faint">3-50 characters</p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-brand-mut">
                    Email: <span className="font-semibold text-brand-bluedd">{email}</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !username.trim()}
                  className="w-full btn-primary rounded-xl py-2 font-bold disabled:cursor-not-allowed disabled:opacity-50"
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
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-display text-3xl font-bold text-brand-ink">Signing you in...</h1>
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-brand-blue"></div>
        </div>
      </div>
    </Layout>
  );
}
