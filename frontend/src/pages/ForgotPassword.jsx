import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email.trim()) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      // Note: This is a placeholder - you'll need to implement password reset in the backend
      // For now, we'll show a message
      setSuccess('If an account exists with this email, you will receive a password reset link shortly.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="card-gaming p-8 md:p-10">
            <h1 className="text-3xl font-bold mb-2 text-center">Reset Password</h1>
            <p className="text-gray-400 text-center mb-8">
              Enter your email address and we'll send you a link to reset your password
            </p>

            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 text-red-300 p-4 rounded-lg mb-6">
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-50 text-green-300 p-4 rounded-lg mb-6">
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 bg-opacity-50 p-3 rounded-lg border border-purple-500 border-opacity-30 focus:outline-none focus:border-cyan-400 focus:bg-opacity-100 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 font-semibold mt-6 disabled:opacity-50"
              >
                {loading ? '🔄 Sending...' : '📧 Send Reset Link'}
              </button>
            </form>

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
