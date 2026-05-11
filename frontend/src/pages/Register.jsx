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
        if (response.data) {
          localStorage.setItem('user', JSON.stringify({
            id: response.data.userId,
            username: response.data.username,
            email: response.data.email
          }));
        }
        
        // Update auth context
        login({ 
          id: response.data.userId,
          username: response.data.username, 
          email: response.data.email 
        }, response.data.token);
        
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4 py-12">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Step 1: Choice between Google and Email */}
          {step === 1 && (
            <div className="bg-gray-800 bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-500 border-opacity-30">
              <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Join DSC
              </h1>
              <p className="text-gray-300 text-center text-sm mb-8">
                Create your account to access the community
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full mb-6 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">or register with email</span>
                </div>
              </div>

              {/* Email Registration Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Choose your username"
                    className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg border transition-all duration-300 placeholder-gray-500 focus:outline-none ${
                      focusedField === 'username'
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/50'
                        : 'border-gray-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg border transition-all duration-300 placeholder-gray-500 focus:outline-none ${
                      focusedField === 'email'
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/50'
                        : 'border-gray-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="At least 6 characters"
                    className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg border transition-all duration-300 placeholder-gray-500 focus:outline-none ${
                      focusedField === 'password'
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/50'
                        : 'border-gray-600'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-cyan-500/50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  Login here
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && authMethod === 'email' && (
            <div className="bg-gray-800 bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-500 border-opacity-30">
              <button
                onClick={handleBack}
                className="mb-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                ← Back
              </button>

              <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Verify Your Email
              </h1>
              <p className="text-gray-300 text-center text-sm mb-8">
                We sent a 6-digit code to<br />
                <span className="text-cyan-400 font-semibold">{formData.email}</span>
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleEmailChange}
                    onFocus={() => setFocusedField('verificationCode')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="000000"
                    maxLength="6"
                    className={`w-full px-4 py-3 bg-gray-700 text-white text-center text-2xl tracking-widest rounded-lg border transition-all duration-300 placeholder-gray-500 focus:outline-none font-mono ${
                      focusedField === 'verificationCode'
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/50'
                        : 'border-gray-600'
                    }`}
                  />
                  <p className="text-xs text-gray-400 mt-2">Code expires in 10 minutes</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-cyan-500/50"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                Didn't receive the code?{' '}
                <button
                  onClick={() => setFormData(prev => ({ ...prev, verificationCode: '' }))}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold"
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
