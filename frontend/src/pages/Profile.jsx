import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

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
  const [previewUrl, setPreviewUrl] = useState(user?.avatar ? `http://localhost:5000${user.avatar}` : null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      }

      // Update profile
      const res = await api.put(`/users/${user.id}`, {
        avatar: avatarUrl,
        rank: formData.rank,
        bio: formData.bio
      });

      // Update auth context
      const updatedUser = { ...user, ...res.data.user };
      login(updatedUser, localStorage.getItem('token'));

      setMessage('✓ Profile updated successfully!');
      setProfileImage(null);

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-10 bg-gradient-to-b from-cyan-400 to-purple-500 rounded"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            👤 My Profile
          </h1>
        </div>
        <p className="text-gray-400 text-lg">Edit your profile and show off your gaming stats</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Preview */}
        <div className="md:col-span-1">
          <div className="card-gaming p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4">Profile Preview</h3>
            
            {/* Avatar */}
            <div className="mb-6">
              <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 p-1 mb-4">
                <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl">📸</span>
                  )}
                </div>
              </div>
            </div>

            {/* Info Display */}
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-xs uppercase">Username</p>
                <p className="text-xl font-bold text-cyan-400">{user.username}</p>
              </div>
              
              {formData.rank && (
                <div>
                  <p className="text-gray-500 text-xs uppercase">MLBB Rank</p>
                  <p className="text-lg font-semibold text-purple-400">{formData.rank}</p>
                </div>
              )}

              {formData.bio && (
                <div>
                  <p className="text-gray-500 text-xs uppercase">Bio</p>
                  <p className="text-sm text-gray-300 line-clamp-3">{formData.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <div className="card-gaming p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 text-red-300 p-4 rounded-lg">
                  ⚠️ {error}
                </div>
              )}

              {message && (
                <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-50 text-green-300 p-4 rounded-lg">
                  {message}
                </div>
              )}

              {/* Profile Picture Upload */}
              <div>
                <label className="block text-sm font-semibold mb-3">Profile Picture</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="avatarInput"
                  />
                  <label
                    htmlFor="avatarInput"
                    className="block w-full p-4 border-2 border-dashed border-cyan-400 border-opacity-30 rounded-lg hover:border-opacity-60 transition cursor-pointer text-center"
                  >
                    <p className="text-gray-300">📤 Click to upload or drag & drop</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, JPG or GIF (max 5MB)</p>
                  </label>
                </div>
              </div>

              {/* MLBB Rank */}
              <div>
                <label className="block text-sm font-semibold mb-3">MLBB Rank</label>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-cyan-400 border-opacity-30 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-opacity-100 transition"
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
                <label className="block text-sm font-semibold mb-3">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself... your favorite heroes, playstyle, etc."
                  maxLength={500}
                  rows={6}
                  className="w-full bg-gray-900 border border-cyan-400 border-opacity-30 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-opacity-100 transition resize-none"
                />
                <p className="text-gray-500 text-xs mt-2">{formData.bio.length}/500 characters</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? '⏳ Saving...' : '✓ Save Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
