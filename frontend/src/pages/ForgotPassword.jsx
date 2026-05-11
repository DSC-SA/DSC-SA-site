import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="card-gaming p-8 md:p-10">
            <h1 className="text-3xl font-bold mb-2 text-center">Password Reset</h1>
            <p className="text-gray-400 text-center mb-8">
              Don't worry! You can regain access to your account easily.
            </p>

            <div className="bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-50 text-blue-300 p-4 rounded-lg mb-6">
              ℹ️ Sign in with Google to regain access to your account instantly
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 bg-opacity-50 text-gray-400">or</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-4">
                If you registered with email and would like to reset your password, please contact support.
              </p>
              <p className="text-gray-400 mb-6">
                For now, the easiest way is to sign in with your Google account.
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Remember your password?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
