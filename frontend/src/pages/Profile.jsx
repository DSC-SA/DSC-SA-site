import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { api, getImageUrl } from '../services/api';

const MLBB_RANKS = [
  'Warrior', 'Elite', 'Master', 'Grand Master',
  'Epic', 'Legend', 'Mythic', 'Mythic Honor'
];

export default function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    avatar: user?.avatar || '',
    rank: user?.rank || '',
    bio: user?.bio || ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Initialize preview URL from user avatar
  useEffect(() => {
    if (user?.avatar) {
      setPreviewUrl(getImageUrl(user.avatar));
    }
  }, [user]);

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
      let avatarUrl = formData.avatar;

      // Upload image if changed
      if (profileImage) {
        const imgFormData = new FormData();
        imgFormData.append('file', profileImage);
        imgFormData.append('folder', 'profiles');

        const uploadRes = await api.post('/upload', imgFormData);
        avatarUrl = uploadRes.data.filePath;
        console.log('Upload response:', uploadRes.data);
        console.log('Avatar URL set to:', avatarUrl);
      }

      // Update profile
      const res = await api.put(`/users/${user.id}`, {
        avatar: avatarUrl,
        rank: formData.rank,
        bio: formData.bio
      });

      console.log('Profile update response:', res.data);

      // Update auth context
      const updatedUser = { ...user, ...res.data.user };
      console.log('Profile updated, new user data:', updatedUser);
      login(updatedUser, localStorage.getItem('token'));

      setMessage('✓ Profile updated successfully!');
      setProfileImage(null);
      // Update preview URL to show the new image
      if (avatarUrl) {
        setPreviewUrl(getImageUrl(avatarUrl));
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              My Profile
            </h1>
          </div>
          <p className="text-gray-400 text-lg ml-4">Update your profile and gaming info</p>
        </div>

        {/* Main Card */}
        <div className="card-gaming p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Messages */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 text-red-300 p-4 rounded-lg flex gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-50 text-green-300 p-4 rounded-lg flex gap-2">
                <span>✓</span>
                <span>{message}</span>
              </div>
            )}

            {/* Profile Picture Section */}
            <div>
              <label className="block text-sm font-semibold mb-4 text-gray-300">Profile Picture</label>
              
              {/* Preview */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 p-1">
                  <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">📸</span>
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
                className="block w-full p-4 border-2 border-dashed border-cyan-400 border-opacity-40 rounded-lg hover:border-opacity-80 hover:bg-cyan-400 hover:bg-opacity-5 transition cursor-pointer text-center"
              >
                <p className="text-gray-300 font-semibold">📤 Click to upload</p>
                <p className="text-gray-500 text-xs mt-1">PNG, JPG or GIF (max 5MB)</p>
              </label>
            </div>

            {/* Divider */}
            <div className="border-t border-cyan-400 border-opacity-20"></div>

            {/* MLBB Rank */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-300">MLBB Rank</label>
              <select
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-cyan-400 border-opacity-30 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-opacity-100 focus:ring-1 focus:ring-cyan-400 transition"
              >
                <option value="">Select your rank...</option>
                {MLBB_RANKS.map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
              <p className="text-gray-500 text-xs mt-2">What's your current MLBB rank?</p>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-300">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself... your favorite heroes, playstyle, etc."
                maxLength={500}
                rows={5}
                className="w-full bg-gray-800 border border-cyan-400 border-opacity-30 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-opacity-100 focus:ring-1 focus:ring-cyan-400 transition resize-none"
              />
              <p className="text-gray-500 text-xs mt-2">{formData.bio.length}/500 characters</p>
            </div>

            {/* Divider */}
            <div className="border-t border-cyan-400 border-opacity-20"></div>

            {/* User Info Display */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Username</p>
                <p className="text-lg font-bold text-cyan-400">{user.username}</p>
              </div>
              {formData.rank && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Rank</p>
                  <p className="text-lg font-bold text-purple-400">{formData.rank}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
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
