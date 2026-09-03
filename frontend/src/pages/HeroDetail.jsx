import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { heroesAPI, buildsAPI, commentsAPI, itemsAPI, getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UserProfileCard from '../components/UserProfileCard';
import Reveal from '../components/Reveal';

const MAX_ITEMS = 7; // boots + 6 gear

const STAGE_LABEL = ['Boots', 'Core', 'Core', 'Core', 'Late', 'Late', 'Late'];

export default function HeroDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

  const [hero, setHero] = useState(null);
  const [builds, setBuilds] = useState({ recommendedBuilds: [], userBuilds: [] });
  const [comments, setComments] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showBuildForm, setShowBuildForm] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newBuild, setNewBuild] = useState({ buildName: '', description: '', selectedItems: [] });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, buildsRes, commentsRes, itemsRes] = await Promise.all([
          heroesAPI.getById(id),
          buildsAPI.getForHero(id),
          commentsAPI.getForHero(id),
          itemsAPI.getAll()
        ]);
        setHero(heroRes.data);
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
    if (!user) return navigate('/login');
    try {
      await commentsAPI.add({ heroId: parseInt(id), content: newComment });
      setNewComment('');
      const res = await commentsAPI.getForHero(id);
      setComments(res.data);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleLikeComment = async (commentId, currentLikes) => {
    try {
      await commentsAPI.like(commentId);
      setComments((cs) => cs.map((c) => (c.id === commentId ? { ...c, likes: currentLikes + 1 } : c)));
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleReply = async (commentId) => {
    if (!user) return navigate('/login');
    if (!replyText.trim()) return;
    try {
      await commentsAPI.reply(commentId, { heroId: parseInt(id), content: replyText });
      setReplyText('');
      setReplyingTo(null);
      const res = await commentsAPI.getForHero(id);
      setComments(res.data);
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  const toggleItem = (item) => {
    setNewBuild((prev) => {
      const exists = prev.selectedItems.find((i) => i.id === item.id);
      if (exists) return { ...prev, selectedItems: prev.selectedItems.filter((i) => i.id !== item.id) };
      if (prev.selectedItems.length >= MAX_ITEMS) return prev;
      return { ...prev, selectedItems: [...prev.selectedItems, item] };
    });
  };

  const handleCreateBuild = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (newBuild.selectedItems.length < 1) return;
    try {
      const itemIds = newBuild.selectedItems.map((i) => i.id);
      const stages = newBuild.selectedItems.map((_, i) => (i < 1 ? 'early' : i < 4 ? 'core' : 'late'));
      await buildsAPI.create({
        heroId: parseInt(id),
        buildName: newBuild.buildName,
        description: newBuild.description,
        itemIds,
        stages
      });
      setNewBuild({ buildName: '', description: '', selectedItems: [] });
      setPickerOpen(false);
      setShowBuildForm(false);
      const res = await buildsAPI.getForHero(id);
      setBuilds(res.data);
    } catch (err) {
      console.error('Error creating build:', err);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="py-20 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
          <p className="mt-4 text-sm text-brand-mut">Loading hero details...</p>
        </div>
      </Layout>
    );

  if (!hero)
    return (
      <Layout>
        <div className="py-20 text-center text-brand-mut">Hero not found</div>
      </Layout>
    );

  const difficultyLabel =
    hero.difficulty === 1 ? 'Very Easy – Great for beginners'
    : hero.difficulty === 2 ? 'Easy – Recommended for new players'
    : hero.difficulty === 3 ? 'Medium – Requires practice'
    : hero.difficulty === 4 ? 'Hard – Advanced mechanics'
    : hero.difficulty === 5 ? 'Very Hard – Expert level only'
    : '';

  const filteredItems = pickerQuery
    ? items.filter((it) => it.name.toLowerCase().includes(pickerQuery.toLowerCase()))
    : items;

  const ItemIcon = ({ item, size = 40 }) => {
    const sel = newBuild.selectedItems.findIndex((s) => s.id === item.id);
    return (
      <button
        type="button"
        onClick={() => toggleItem(item)}
        title={item.name}
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 transition ${
          sel > -1
            ? 'border-brand-blue bg-brand-bluelt shadow-[0_6px_16px_-6px_rgba(91,181,232,0.7)]'
            : 'border-brand-line bg-brand-cloud hover:border-brand-blue'
        }`}
        style={{ width: size, height: size }}
      >
        <img
          src={`${API_BASE_URL}/api/items/${item.id}/image?t=${Date.now()}`}
          alt={item.name}
          onError={(e) => {
            e.target.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'flex';
          }}
          className="h-full w-full object-cover"
        />
        <span
          className="hidden h-full w-full items-center justify-center bg-gradient-to-br from-brand-bluelt to-brand-bluelt/40 text-sm font-bold text-white"
        >
          {item.name.charAt(0)}
        </span>
        {sel > -1 && (
          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-[10px] font-bold text-white">
            {sel + 1}
          </span>
        )}
      </button>
    );
  };

  const BuildItemCircle = ({ item, index }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft"
        title={item.name}
      >
        <img
          src={`${API_BASE_URL}/api/items/${item.id}/image?t=${Date.now()}`}
          alt={item.name}
          onError={(e) => {
            e.target.style.display = 'none';
            e.currentTarget.nextElementSibling.style.display = 'flex';
          }}
          className="h-full w-full object-cover"
        />
        <span className="hidden h-full w-full items-center justify-center bg-gradient-to-br from-brand-bluelt to-brand-cloud text-xs font-bold text-brand-bluedd">
          {item.name.charAt(0)}
        </span>
        <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-blue text-[9px] font-bold text-white">
          {index + 1}
        </span>
      </div>
      <span className="text-[0.6rem] font-medium text-brand-faint">{STAGE_LABEL[index]}</span>
    </div>
  );

  return (
    <Layout>
      {/* HERO HEADER */}
      <section className="mb-8 overflow-hidden rounded-3xl border border-brand-line bg-white"
        style={{
          backgroundImage:
            'radial-gradient(700px 320px at 90% -10%, rgba(91,181,232,0.25), transparent 60%), radial-gradient(600px 300px at -10% 120%, rgba(196,224,247,0.5), transparent 60%)'
        }}
      >
        <div className="p-7 md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 font-display text-5xl font-bold text-brand-ink md:text-6xl">{hero.name}</h1>
              <p className="text-lg text-brand-mut">Master this incredible hero</p>
            </div>
            <div className="inline-flex flex-col rounded-2xl border border-brand-blue/30 bg-white/70 px-7 py-4 text-center shadow-soft w-fit">
              <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-widest text-brand-faint">Class</p>
              <p className="font-display text-2xl font-bold text-brand-bluedd">{hero.role}</p>
            </div>
          </div>
          <div className="mt-7 rounded-2xl border border-brand-line bg-white/70 p-5">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-faint">Difficulty</span>
            <p className="mt-1 text-3xl font-bold text-brand-bluedd">
              {'★'.repeat(hero.difficulty || 0)}
              <span className="text-brand-line">{'☆'.repeat(5 - (hero.difficulty || 0))}</span>
            </p>
            <p className="mt-1 text-sm text-brand-mut">{difficultyLabel}</p>
          </div>
        </div>
      </section>

      {/* RECOMMENDED BUILDS */}
      <section className="mb-12">
        <Reveal>
          <div className="mb-6 flex items-center gap-3">
            <div className="mb-1 h-8 w-1 rounded-full bg-gradient-to-b from-brand-blue to-brand-bluelt"></div>
            <h2 className="font-display text-2xl font-bold text-brand-ink md:text-4xl">Recommended Builds</h2>
          </div>
        </Reveal>
        {builds.recommendedBuilds.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {builds.recommendedBuilds.map((build, idx) => (
              <Reveal key={build.id} delay={`${idx * 80}ms`}>
                <div className="card h-full">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-brand-bluedd">Build #{idx + 1}</h3>
                    <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold text-brand-bluedd">Pro</span>
                  </div>
                  <p className="mb-2 font-semibold text-brand-ink">{build.build_name}</p>
                  {build.synergy_notes && <p className="mb-4 text-sm text-brand-mut">{build.synergy_notes}</p>}
                  <div className="mb-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-faint">Items build</p>
                    {build.items && build.items.filter((i) => i.id).length > 0 ? (
                      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                        {build.items.filter((i) => i.id).map((item, i) => (
                          <BuildItemCircle key={item.id} item={item} index={i} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-brand-faint">No items listed</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="card py-10 text-center text-brand-mut">No recommended builds yet. Check back soon!</div>
        )}
      </section>

      {/* COMMUNITY BUILDS */}
      <section className="mb-12">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <div className="flex items-center gap-3">
              <div className="mb-1 h-8 w-1 rounded-full bg-gradient-to-b from-brand-blue to-brand-bluelt"></div>
              <h2 className="font-display text-2xl font-bold text-brand-ink md:text-4xl">Community Builds</h2>
            </div>
          </Reveal>
          {user ? (
            <button onClick={() => { setShowBuildForm((v) => !v); setPickerOpen(false); }} className="btn-primary w-full md:w-auto">
              {showBuildForm ? 'Cancel' : 'Share Build'}
            </button>
          ) : (
            <p className="text-sm text-brand-mut md:text-right">
              <a href="/login" className="font-semibold text-brand-bluedd hover:underline">Sign in</a> to contribute builds
            </p>
          )}
        </div>

        {/* CREATE BUILD FORM */}
        {showBuildForm && (
          <form onSubmit={handleCreateBuild} className="card mb-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-brand-ink">Create Your Build</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${newBuild.selectedItems.length === MAX_ITEMS ? 'bg-brand-blue text-white' : 'bg-brand-cloud text-brand-mut'}`}>
                {newBuild.selectedItems.length}/{MAX_ITEMS} items
              </span>
            </div>

            <div className="mb-5 space-y-4">
              <input
                type="text"
                placeholder="Give your build a name (e.g., Burst Damage Build)"
                value={newBuild.buildName}
                onChange={(e) => setNewBuild({ ...newBuild, buildName: e.target.value })}
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                required
              />
              <textarea
                placeholder="Explain your build strategy and when to use it..."
                value={newBuild.description}
                onChange={(e) => setNewBuild({ ...newBuild, description: e.target.value })}
                className="h-24 w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                required
              />
            </div>

            {/* 7 SLOTS */}
            <div className="mb-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-faint">Build your loadout (Boots + 6)</p>
              <div className="flex flex-wrap gap-2.5">
                {Array.from({ length: MAX_ITEMS }).map((_, i) => {
                  const item = newBuild.selectedItems[i];
                  return item ? (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewBuild((prev) => ({ ...prev, selectedItems: prev.selectedItems.filter((_, j) => j !== i) }))}
                      title={`Remove ${item.name}`}
                      className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-brand-blue bg-white shadow-soft transition hover:border-red-400"
                    >
                      <img
                        src={`${API_BASE_URL}/api/items/${item.id}/image?t=${Date.now()}`}
                        alt={item.name}
                        onError={(e) => { e.target.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}
                        className="h-full w-full object-cover"
                      />
                      <span className="hidden h-full w-full items-center justify-center bg-gradient-to-br from-brand-bluelt to-brand-cloud text-xs font-bold text-brand-bluedd">
                        {item.name.charAt(0)}
                      </span>
                      <span className="absolute inset-0 hidden items-center justify-center bg-red-500/80 text-2xl font-bold text-white group-hover:flex">
                        ×
                      </span>
                      <span className="absolute left-1 top-1 rounded-full bg-brand-blue px-1.5 text-[9px] font-bold text-white">
                        {STAGE_LABEL[i]}
                      </span>
                    </button>
                  ) : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPickerOpen(true)}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-brand-line text-brand-faint transition hover:border-brand-blue hover:text-brand-bluedd"
                      title={i === 0 ? 'Pick a boot' : 'Pick an item'}
                    >
                      <span className="text-2xl">+</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ITEM PICKER */}
            <div className="mb-5">
              <button
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-brand-line bg-brand-cloud px-4 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-blue"
              >
                <span>Pick items ({newBuild.selectedItems.length}/{MAX_ITEMS})</span>
                <span className="text-brand-bluedd">{pickerOpen ? '−' : '+'}</span>
              </button>

              {pickerOpen && (
                <div className="mt-3 rounded-2xl border border-brand-line bg-white p-4">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={pickerQuery}
                    onChange={(e) => setPickerQuery(e.target.value)}
                    className="mb-3 w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-2.5 text-sm text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                  />
                  {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6 md:grid-cols-7">
                      {filteredItems.map((item) => (
                        <ItemIcon key={item.id} item={item} size={52} />
                      ))}
                    </div>
                  ) : (
                    <p className="py-6 text-center text-sm text-brand-faint">No items match “{pickerQuery}”.</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button type="submit" className="btn-primary flex-1">Publish Build</button>
              <button type="button" onClick={() => setShowBuildForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* USER BUILDS */}
        {builds.userBuilds.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {builds.userBuilds.map((build, bi) => (
              <Reveal key={build.id} delay={`${(bi % 2) * 80}ms`}>
                <div className="card h-full">
                  <div className="mb-1 flex items-start justify-between">
                    <h3 className="flex-1 pr-3 font-display text-lg font-bold text-brand-ink">{build.build_name}</h3>
                    <span className="rounded-full bg-brand-cloud px-3 py-1 text-xs font-bold text-brand-mut">Community</span>
                  </div>
                  <p className="mb-1 text-sm text-brand-mut">
                    by <span className="font-semibold text-brand-bluedd">{build.username}</span>
                  </p>
                  {build.description && <p className="mb-4 text-sm text-brand-mut">{build.description}</p>}
                  <div className="mb-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-faint">Items build</p>
                    {build.items && build.items.filter((i) => i.id).length > 0 ? (
                      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                        {build.items.filter((i) => i.id).map((item, i) => (
                          <BuildItemCircle key={item.id} item={item} index={i} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-brand-faint">No items listed</p>
                    )}
                  </div>
                  <div className="mt-3 flex gap-4 border-t border-brand-line pt-3 text-sm text-brand-mut">
                    <span>❤️ {build.likes} likes</span>
                    <span>👁️ {build.views} views</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="card py-10 text-center text-brand-mut">No community builds yet. Be the first to share one!</div>
        )}
      </section>

      {/* COMMENTS */}
      <section>
        <Reveal>
          <div className="mb-6 flex items-center gap-3">
            <div className="mb-1 h-8 w-1 rounded-full bg-gradient-to-b from-brand-blue to-brand-bluelt"></div>
            <h2 className="font-display text-2xl font-bold text-brand-ink md:text-4xl">Discussion</h2>
          </div>
        </Reveal>

        {user ? (
          <form onSubmit={handleAddComment} className="card mb-6">
            <label className="mb-3 block text-sm font-semibold text-brand-ink">Share Your Thoughts</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What do you think about this hero? Tips, strategies, or experiences?"
              className="mb-4 h-24 w-full rounded-xl border border-brand-line bg-brand-mist p-4 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              required
            />
            <button type="submit" className="btn-primary">Post Comment</button>
          </form>
        ) : (
          <div className="card mb-6 py-8 text-center">
            <p className="mb-4 text-brand-mut">Join the discussion about {hero.name}</p>
            <a href="/login" className="btn-primary inline-block">Sign In to Comment</a>
          </div>
        )}

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments
              .filter((c) => !c.parent_id)
              .map((comment) => {
                const replies = comments.filter((c) => c.parent_id === comment.id);
                return (
                  <div key={comment.id} className="card">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedUserProfile(comment)}
                          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-bluelt text-white transition hover:ring-4 hover:ring-brand-blue/20"
                        >
                          {comment.avatar ? (
                            <img src={getImageUrl(comment.avatar)} alt={comment.username} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-bold">{comment.username?.charAt(0)?.toUpperCase()}</span>
                          )}
                        </button>
                        <div>
                          <button
                            type="button"
                            onClick={() => setSelectedUserProfile(comment)}
                            className="block text-left font-bold text-brand-ink hover:text-brand-bluedd"
                          >
                            {comment.username}
                          </button>
                          <span className="text-xs text-brand-faint">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-brand-cloud px-3 py-1 text-xs font-semibold text-brand-mut">Member</span>
                    </div>
                    <p className="leading-relaxed text-brand-mut">{comment.content}</p>
                    <div className="mt-3 flex gap-5 text-sm text-brand-mut">
                      <button type="button" onClick={() => handleLikeComment(comment.id, comment.likes)} className="transition hover:text-brand-bluedd">
                        ❤️ {comment.likes}
                      </button>
                      <button type="button" onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="transition hover:text-brand-bluedd">
                        💬 Reply
                      </button>
                    </div>

                    {replyingTo === comment.id && (
                      <div className="mt-4 border-t border-brand-line pt-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="mb-3 h-20 w-full rounded-xl border border-brand-line bg-brand-mist p-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                        />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleReply(comment.id)} className="btn-primary px-4 py-2 text-sm">
                            Reply
                          </button>
                          <button type="button" onClick={() => { setReplyingTo(null); setReplyText(''); }} className="btn-secondary px-4 py-2 text-sm">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {replies.length > 0 && (
                      <div className="mt-4 space-y-3 border-t border-brand-line pt-4">
                        {replies.map((reply) => (
                          <div key={reply.id} className="ml-3 border-l-2 border-brand-blue/30 pl-4">
                            <div className="mb-1 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedUserProfile(reply)}
                                className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-brand-bluelt text-white"
                              >
                                {reply.avatar ? (
                                  <img src={getImageUrl(reply.avatar)} alt={reply.username} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-xs font-bold">{reply.username?.charAt(0)?.toUpperCase()}</span>
                                )}
                              </button>
                              <button type="button" onClick={() => setSelectedUserProfile(reply)} className="text-sm font-bold text-brand-ink hover:text-brand-bluedd">
                                {reply.username}
                              </button>
                            </div>
                            <p className="text-sm leading-relaxed text-brand-mut">{reply.content}</p>
                            <div className="mt-1.5 flex gap-3 text-xs text-brand-faint">
                              <button type="button" onClick={() => handleLikeComment(reply.id, reply.likes)} className="transition hover:text-brand-bluedd">
                                ❤️ {reply.likes}
                              </button>
                              <span>{new Date(reply.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="card py-10 text-center text-brand-mut">No comments yet. Be the first to start the discussion!</div>
        )}
      </section>

      <UserProfileCard user={selectedUserProfile} onClose={() => setSelectedUserProfile(null)} />
    </Layout>
  );
}