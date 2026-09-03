import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { api, getImageUrl } from '../services/api';

const MLBB_RANKS = [
  'Warrior', 'Elite', 'Master', 'Grand Master',
  'Epic', 'Legend', 'Mythic', 'Mythic Honor',
  'Mythical Glory', 'Mythical Immortal'
];

export default function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    avatar: user?.avatar || '',
    rank: user?.rank || '',
    bio: user?.bio || ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        avatar: user.avatar || '',
        rank: user.rank || '',
        bio: user.bio || ''
      });
      if (user.hasAvatar || user.avatar) {
        const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
        const externalAvatar = !user.hasAvatar && user.avatar && /^https?:\/\//.test(user.avatar) ? user.avatar : null;
        setPreviewUrl(externalAvatar || `${API_BASE_URL}/api/users/${user.id}/avatar?t=${Date.now()}`);
      }
    }
  }, [user?.id]); // Only update when user ID changes

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Create FormData to send image directly
      const formDataToSend = new FormData();
      if (profileImage) {
        formDataToSend.append('avatar', profileImage);
      }
      formDataToSend.append('username', formData.username);
      formDataToSend.append('rank', formData.rank);
      formDataToSend.append('bio', formData.bio);

      console.log('Updating profile with avatar:', { fileName: profileImage?.name, size: profileImage?.size });
      
      // Update profile with direct image upload
      const res = await api.put(`/users/${user.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Profile update response:', res.data);

      // Update auth context with new user data
      const updatedUser = { 
        ...user, 
        username: res.data.user.username,
        rank: res.data.user.rank,
        bio: res.data.user.bio,
        hasAvatar: res.data.user.hasAvatar
      };
      console.log('Profile updated, new user data:', updatedUser);
      login(updatedUser, localStorage.getItem('token'));

      setMessage('✓ Profile updated successfully!');
      setProfileImage(null);
      // Update preview URL to fetch new avatar from database
      if (profileImage) {
        setPreviewUrl(`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin)}/api/users/${user.id}/avatar?t=${Date.now()}`);
      }

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update profile';
      console.error('Profile update error:', { status: err.response?.status, data: err.response?.data, error: err.message });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-8 w-1 rounded bg-gradient-to-b from-brand-blue to-brand-bluedd"></div>
            <h1 className="bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              My Profile
            </h1>
          </div>
          <p className="ml-4 text-lg text-brand-mut">Update your profile and gaming info</p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-lift md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Messages */}
            {error && (
              <div className="flex gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-red-600">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="flex gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-green-700">
                <span>✓</span>
                <span>{message}</span>
              </div>
            )}

            {/* Profile Picture Section */}
            <div>
              <label className="mb-4 block text-sm font-semibold text-brand-ink">Profile Picture</label>

              {/* Preview */}
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-blue to-brand-bluedd p-1 shadow-soft">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-brand-mist">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-5xl">📸</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="avatarInput"
              />
              <label
                htmlFor="avatarInput"
                className="block w-full cursor-pointer rounded-xl border-2 border-dashed border-brand-blue/40 p-4 text-center transition hover:border-brand-blue hover:bg-brand-mist"
              >
                <p className="font-semibold text-brand-bluedd">📤 Click to upload</p>
                <p className="mt-1 text-xs text-brand-faint">PNG, JPG or GIF (max 5MB)</p>
              </label>
            </div>

            {/* Divider */}
            <div className="border-t border-brand-line"></div>

            {/* MLBB Rank */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-brand-ink">MLBB Rank</label>
              <select
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              >
                <option value="">Select your rank...</option>
                {MLBB_RANKS.map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-brand-faint">What&apos;s your current MLBB rank?</p>
            </div>

            {/* Bio */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-brand-ink">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself... your favorite heroes, playstyle, etc."
                maxLength={500}
                rows={5}
                className="w-full resize-none rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition placeholder:text-brand-faint focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />
              <p className="mt-2 text-xs text-brand-faint">{formData.bio.length}/500 characters</p>
            </div>

            {/* Divider */}
            <div className="border-t border-brand-line"></div>

            {/* Username */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-brand-ink">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                maxLength={30}
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                placeholder="Enter your username"
              />
              <p className="mt-2 text-xs text-brand-faint">Username must be 3-30 characters</p>
            </div>

            {/* Divider */}
            <div className="border-t border-brand-line"></div>

            {/* Rank Display */}
            {formData.rank && (
              <div>
                <p className="text-xs uppercase tracking-wide text-brand-faint">Current Rank</p>
                <p className="text-lg font-bold text-brand-bluedd">{formData.rank}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⏳</span>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>✓</span>
                  Save Profile
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
