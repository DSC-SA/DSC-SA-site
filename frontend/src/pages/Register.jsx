import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Layout from '../components/Layout';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1); // Step 1: choice, Step 2: verification
  const [authMethod, setAuthMethod] = useState(null); // 'google' or 'email'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    verificationCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Handle Google OAuth
  const handleGoogleLogin = () => {
    // Use current domain (auto-detects localhost or production)
    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  // Handle email registration
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.username.trim()) {
        setError('Username is required');
        setLoading(false);
        return;
      }
      if (!formData.email.trim()) {
        setError('Email is required');
        setLoading(false);
        return;
      }
      if (!formData.password) {
        setError('Password is required');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Call backend register endpoint
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        // Store token and user data
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Update auth context
        login(response.data.user, response.data.token);
        
        // Redirect to home
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.verificationCode.trim()) {
        setError('Verification code is required');
        setLoading(false);
        return;
      }

      const response = await authAPI.verifyEmail({
        email: formData.email,
        code: formData.verificationCode
      });

      if (response.data.token) {
        // Store token and user data
        localStorage.setItem('authToken', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        // Update auth context
        login(response.data.user);
        
        // Redirect to home
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setAuthMethod(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      verificationCode: ''
    });
    setError('');
  };

  return (
    <Layout>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Step 1: Choice between Google and Email */}
          {step === 1 && (
            <div className="rounded-3xl border border-brand-line bg-white p-8 shadow-lift">
              <h1 className="mb-2 text-center font-display text-3xl font-bold text-brand-ink">
                Join DSC
              </h1>
              <p className="mb-8 text-center text-sm text-brand-mut">
                Create your account to access the community
              </p>

              {error && (
                <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-line bg-white px-6 py-3 font-semibold text-brand-ink shadow-soft transition hover:bg-brand-mist disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-line"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-brand-faint">or register with email</span>
                </div>
              </div>

              {/* Email Registration Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-ink">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleEmailChange}
                    placeholder="Choose your username"
                    className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-ink">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-ink">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleEmailChange}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary mt-6 px-6 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-brand-mut">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand-bluedd hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && authMethod === 'email' && (
            <div className="rounded-3xl border border-brand-line bg-white p-8 shadow-lift">
              <button
                onClick={handleBack}
                className="mb-4 flex items-center gap-1 text-sm font-medium text-brand-bluedd transition hover:underline"
              >
                ← Back
              </button>

              <h1 className="mb-2 text-center font-display text-3xl font-bold text-brand-ink">
                Verify Your Email
              </h1>
              <p className="mb-8 text-center text-sm text-brand-mut">
                We sent a 6-digit code to<br />
                <span className="font-semibold text-brand-bluedd">{formData.email}</span>
              </p>

              {error && (
                <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-ink">Verification Code</label>
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleEmailChange}
                    placeholder="000000"
                    maxLength="6"
                    className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-center font-mono text-2xl tracking-widest text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                  />
                  <p className="mt-2 text-xs text-brand-faint">Code expires in 10 minutes</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary mt-6 px-6 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-brand-mut">
                Didn&apos;t receive the code?{' '}
                <button
                  onClick={() => setFormData(prev => ({ ...prev, verificationCode: '' }))}
                  className="font-semibold text-brand-bluedd hover:underline"
                >
                  Request new code
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
