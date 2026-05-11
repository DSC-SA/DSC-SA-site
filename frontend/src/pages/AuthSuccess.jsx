import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const email = searchParams.get('email');

    if (token && username && email) {
      // Store token and user data via AuthContext
      login(
        { username, email },
        token
      );

      // Redirect to home
      setTimeout(() => navigate('/'), 500);
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate, login]);

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
