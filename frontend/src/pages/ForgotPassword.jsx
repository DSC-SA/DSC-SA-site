import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Use current domain (auto-detects localhost or production)
    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <Layout>
      <div className="flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-brand-line bg-white p-8 shadow-lift md:p-10">
            <h1 className="mb-2 text-center font-display text-3xl font-bold text-brand-ink">Password Reset</h1>
            <p className="mb-8 text-center text-brand-mut">
              Don&apos;t worry! You can regain access to your account easily.
            </p>

            <div className="mb-6 rounded-lg border border-brand-blue/30 bg-brand-bluesoft p-4 text-sm text-brand-bluedd">
              Sign in with Google to regain access to your account instantly
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-line bg-white px-6 py-3 font-semibold text-brand-ink shadow-soft transition hover:bg-brand-mist"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-line"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-brand-faint">or</span>
              </div>
            </div>

            <div className="text-center">
              <p className="mb-4 text-brand-mut">
                If you registered with email and would like to reset your password, please contact support.
              </p>
              <p className="mb-6 text-brand-mut">
                For now, the easiest way is to sign in with your Google account.
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-brand-mut">
                Remember your password?{' '}
                <Link to="/login" className="font-semibold text-brand-bluedd hover:underline">
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
