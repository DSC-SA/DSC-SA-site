import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { heroesAPI, buildsAPI, commentsAPI, itemsAPI, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HeroDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hero, setHero] = useState(null);
  const [allHeroes, setAllHeroes] = useState([]);
  const [selectedGalleryRole, setSelectedGalleryRole] = useState('All');
  const [builds, setBuilds] = useState({ recommendedBuilds: [], userBuilds: [] });
  const [comments, setComments] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuildForm, setShowBuildForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newBuild, setNewBuild] = useState({ buildName: '', description: '', selectedItems: [] });
  const [itemsGalleryOpen, setItemsGalleryOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, allHeroesRes, buildsRes, commentsRes, itemsRes] = await Promise.all([
          heroesAPI.getById(id),
          heroesAPI.getAll(),
          buildsAPI.getForHero(id),
          commentsAPI.getForHero(id),
          itemsAPI.getAll()
        ]);
        setHero(heroRes.data);
        setAllHeroes(allHeroesRes.data);
        setBuilds(buildsRes.data);
        setComments(commentsRes.data);
        setItems(itemsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await commentsAPI.add({
        heroId: parseInt(id),
        content: newComment
      });
      setNewComment('');
      // Refresh comments
      const res = await commentsAPI.getForHero(id);
      setComments(res.data);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleCreateBuild = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const itemIds = newBuild.selectedItems.map(item => item.id);
      const stages = newBuild.selectedItems.map((_, i) => i < 2 ? 'early' : i < 5 ? 'core' : 'late');

      await buildsAPI.create({
        heroId: parseInt(id),
        buildName: newBuild.buildName,
        description: newBuild.description,
        itemIds,
        stages
      });

      setNewBuild({ buildName: '', description: '', selectedItems: [] });
      setShowBuildForm(false);
      // Refresh builds
      const res = await buildsAPI.getForHero(id);
      setBuilds(res.data);
    } catch (err) {
      console.error('Error creating build:', err);
    }
  };

  if (loading) return <Layout><div className="text-center py-12">⏳ Loading hero details...</div></Layout>;
  if (!hero) return <Layout><div className="text-center py-12 text-red-400">❌ Hero not found</div></Layout>;

  const roles = ['All', 'Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
  
  const getRoleColor = (role) => {
    const colors = {
      'Tank': 'from-red-600 to-red-400',
      'Mage': 'from-blue-600 to-blue-400',
      'Marksman': 'from-yellow-600 to-yellow-400',
      'Assassin': 'from-purple-600 to-purple-400',
      'Support': 'from-green-600 to-green-400',
      'Fighter': 'from-orange-600 to-orange-400'
    };
    return colors[role] || 'from-purple-600 to-cyan-600';
  };

  const filteredGalleryHeroes = selectedGalleryRole === 'All' 
    ? allHeroes 
    : allHeroes.filter(h => h.role === selectedGalleryRole);

  return (
    <Layout>
      {/* Hero Header */}
      <div className="card-gaming mb-8 gradient-border overflow-hidden" style={{
        backgroundImage: hero.icon_url ? `linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%), url('${getImageUrl(hero.icon_url)}')` : 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundAttachment: 'fixed'
      }}>
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{hero.name}</h1>
              <p className="text-gray-300 text-lg">Master this incredible hero</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-3 rounded-lg text-center">
              <p className="text-xs text-gray-300 mb-1">CLASS</p>
              <p className="text-2xl font-bold text-white">{hero.role}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 md:p-12 pt-0">
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg col-span-2 md:col-span-4">
            <span className="text-purple-400 text-sm">DIFFICULTY</span>
            <p className="text-3xl font-bold text-cyan-400 mt-2">
              {'★'.repeat(hero.difficulty)}{'☆'.repeat(5 - hero.difficulty)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {hero.difficulty === 1 && 'Very Easy - Great for beginners'}
              {hero.difficulty === 2 && 'Easy - Recommended for new players'}
              {hero.difficulty === 3 && 'Medium - Requires practice'}
              {hero.difficulty === 4 && 'Hard - Advanced mechanics'}
              {hero.difficulty === 5 && 'Very Hard - Expert level only'}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Builds */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded"></div>
          <h2 className="text-3xl md:text-4xl font-bold">Recommended Builds</h2>
        </div>
        {builds.recommendedBuilds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {builds.recommendedBuilds.map((build, idx) => (
              <div key={build.id} className="card-gaming p-6 hover:border-cyan-400 transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-cyan-400">Build #{idx + 1}</h3>
                  <span className="bg-purple-600 px-3 py-1 rounded text-xs font-semibold">Pro</span>
                </div>
                <p className="text-white font-semibold mb-2">{build.build_name}</p>
                <p className="text-gray-400 text-sm mb-4">{build.synergy_notes}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-400 text-sm">📦 ITEMS:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {build.items && build.items.filter(i => i.id).map(item => (
                      <div key={item.id} className="text-xs bg-gray-900 p-2 rounded border border-purple-500 border-opacity-20 hover:border-opacity-50 transition">
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-gaming p-8 text-center text-gray-400">
            📖 No recommended builds yet. Check back soon!
          </div>
        )}
      </section>

      {/* Community Builds */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded"></div>
            <h2 className="text-3xl md:text-4xl font-bold">Community Builds</h2>
          </div>
          {user && (
            <button
              onClick={() => setShowBuildForm(!showBuildForm)}
              className="btn-primary w-full md:w-auto"
            >
              {showBuildForm ? '❌ Cancel' : '⚡ Share Build'}
            </button>
          )}
          {!user && (
            <p className="text-gray-400 w-full md:w-auto text-center">
              <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign in</a> to contribute builds
            </p>
          )}
        </div>

        {/* Build Form */}
        {showBuildForm && (
          <form onSubmit={handleCreateBuild} className="card-gaming p-6 md:p-8 mb-6 gradient-border">
            <h3 className="text-xl font-bold mb-6 text-cyan-400">Create Your Build</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Give your build a name (e.g., Burst Damage Build)"
                value={newBuild.buildName}
                onChange={(e) => setNewBuild({ ...newBuild, buildName: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(236, 72, 153, 0.6)',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(236, 72, 153, 1)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(236, 72, 153, 0.6)';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
              <textarea
                placeholder="Explain your build strategy and when to use it..."
                value={newBuild.description}
                onChange={(e) => setNewBuild({ ...newBuild, description: e.target.value })}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(236, 72, 153, 0.6)',
                  outline: 'none',
                  height: '96px',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(236, 72, 153, 1)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(236, 72, 153, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(236, 72, 153, 0.6)';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
              
              <div>
                <button
                  type="button"
                  onClick={() => setItemsGalleryOpen(!itemsGalleryOpen)}
                  className="w-full flex items-center justify-between mb-3 p-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded font-bold text-white text-sm transition"
                >
                  <span className="flex items-center gap-2">
                    📦 Items ({newBuild.selectedItems.length}/6)
                  </span>
                  <span className={`transform transition-transform text-lg ${itemsGalleryOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {itemsGalleryOpen && (
                  <div className="bg-gray-900 bg-opacity-70 rounded p-3 border border-yellow-400 border-opacity-30 mb-4">
                    {/* Items Grid - 5 columns circular */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', maxHeight: '240px', overflowY: 'auto', autoRows: '1fr', backgroundColor: 'rgba(168, 85, 247, 0.2)' }} className="mb-3 p-2 rounded-lg">
                      {items.map(item => {
                        const isSelected = newBuild.selectedItems.find(i => i.id === item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setNewBuild({ ...newBuild, selectedItems: newBuild.selectedItems.filter(i => i.id !== item.id) });
                              } else if (newBuild.selectedItems.length < 6) {
                                setNewBuild({ ...newBuild, selectedItems: [...newBuild.selectedItems, item] });
                              }
                            }}
                            style={{ aspectRatio: '1/1', borderRadius: '50%', minHeight: '50px', minWidth: '50px', padding: 0 }}
                            className={`relative overflow-hidden transition transform hover:scale-110 group ${isSelected ? 'ring-2 ring-cyan-400 scale-110' : 'hover:ring-1 hover:ring-purple-400'}`}
                            title={item.name}
                          >
                            {item.image ? (
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                className=""
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              style={{ display: !item.image ? 'flex' : 'none', borderRadius: '50%' }}
                              className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"
                            >
                              <span className="text-xs font-bold text-white text-center px-1 line-clamp-1">{item.name}</span>
                            </div>
                            {isSelected && (
                              <div style={{ borderRadius: '50%' }} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-lg font-bold text-cyan-400">✓</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Items Badges */}
                    {newBuild.selectedItems.length > 0 && (
                      <div className="border-t border-yellow-400 border-opacity-30 pt-2 mt-2">
                        <p className="text-xs text-yellow-400 font-semibold mb-2">Selected:</p>
                        <div className="flex flex-wrap gap-1">
                          {newBuild.selectedItems.map(item => (
                            <div key={item.id} className="text-xs bg-gradient-to-r from-cyan-600 to-purple-600 px-2 py-1 rounded text-white flex items-center gap-1 hover:from-cyan-700 hover:to-purple-700 transition">
                              <span className="truncate">{item.name}</span>
                              <button
                                type="button"
                                onClick={() => setNewBuild({ ...newBuild, selectedItems: newBuild.selectedItems.filter(i => i.id !== item.id) })}
                                className="font-bold hover:text-red-300 ml-0.5"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">🚀 Publish Build</button>
                <button type="button" onClick={() => setShowBuildForm(false)} className="card-gaming px-6 py-3 rounded font-semibold border border-gray-600">Cancel</button>
              </div>
            </div>
          </form>
        )}

        {/* User Builds List */}
        {builds.userBuilds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {builds.userBuilds.map(build => (
              <div key={build.id} className="card-gaming p-6 hover:border-cyan-400 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-cyan-400 flex-1">{build.build_name}</h3>
                  <span className="text-purple-400 text-xs font-semibold">Community</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">👤 by <span className="text-cyan-300">{build.username}</span></p>
                <p className="text-gray-300 mb-4 text-sm">{build.description}</p>
                <div className="mb-4 space-y-2">
                  <p className="text-purple-400 text-xs font-semibold">ITEMS:</p>
                  <div className="flex flex-wrap gap-2">
                    {build.items && build.items.filter(i => i.id).map(item => (
                      <span key={item.id} className="text-xs bg-gray-800 px-3 py-1 rounded border border-purple-500 border-opacity-20">
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-700 pt-3 mt-4">
                  <span className="text-gray-400">❤️ {build.likes} likes</span>
                  <span className="text-gray-400">👁️ {build.views} views</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-gaming p-8 text-center text-gray-400">
            🤔 No community builds yet. Be the first to share one!
          </div>
        )}
      </section>

      {/* Comments Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded"></div>
          <h2 className="text-3xl md:text-4xl font-bold">💬 Discussion</h2>
        </div>
        
        {/* Add Comment */}
        {user ? (
          <form onSubmit={handleAddComment} className="card-gaming p-6 md:p-8 mb-6 gradient-border">
            <label className="block text-sm font-semibold text-cyan-400 mb-3">Share Your Thoughts</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What do you think about this hero? Tips, strategies, or experiences?"
              className="w-full bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-purple-500 border-opacity-30 focus:outline-none focus:border-cyan-400 focus:bg-opacity-100 transition h-24 mb-4"
              required
            />
            <button type="submit" className="btn-primary">✈️ Post Comment</button>
          </form>
        ) : (
          <div className="card-gaming p-8 text-center mb-6">
            <p className="text-gray-400 mb-4">Join the discussion about {hero.name}</p>
            <a href="/login" className="btn-primary inline-block">🔐 Sign In to Comment</a>
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="card-gaming p-5 hover:border-purple-400 transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0" style={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #d4af37 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'shimmer 3s ease-in-out infinite',
                      borderRadius: '50%',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <style>{`
                        @keyframes shimmer {
                          0%, 100% { backgroundPosition: 0% 50%; }
                          50% { backgroundPosition: 100% 50%; }
                        }
                      `}</style>
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                        {comment.avatar ? (
                          <img 
                            src={getImageUrl(comment.avatar)} 
                            alt={comment.username} 
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              display: 'block'
                            }}
                          />
                        ) : (
                          <span className="text-xs font-bold text-cyan-400">{comment.username?.charAt(0)?.toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-cyan-400">{comment.username}</h4>
                      <span className="text-gray-500 text-xs">📅 {new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="bg-purple-600 bg-opacity-30 px-2 py-1 rounded text-xs text-purple-300">Member</span>
                </div>
                <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                <div className="mt-3 flex gap-4 text-sm text-gray-500">
                  <button className="hover:text-pink-400 transition">❤️ {comment.likes}</button>
                  <button className="hover:text-cyan-400 transition">💬 Reply</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-gaming p-8 text-center text-gray-400">
            🤐 No comments yet. Be the first to start the discussion!
          </div>
        )}
      </section>
    </Layout>
  );
}
