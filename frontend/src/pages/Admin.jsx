import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { heroesAPI, matchesAPI, getImageUrl } from '../services/api';

export default function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [heroes, setHeroes] = useState([]);
  const [selectedHeroId, setSelectedHeroId] = useState('');
  const [selectedHero, setSelectedHero] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  
  // Event scheduler state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStatus, setEventStatus] = useState('upcoming');
  const [eventImage, setEventImage] = useState(null);
  const [eventImagePreview, setEventImagePreview] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);

  // Match scheduler state
  const [matches, setMatches] = useState([]);
  const [matchTitle, setMatchTitle] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchDescription, setMatchDescription] = useState('');
  const [matchStatus, setMatchStatus] = useState('upcoming');
  const [matchImage, setMatchImage] = useState(null);
  const [matchImagePreview, setMatchImagePreview] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchesLoading, setMatchesLoading] = useState(false);

  // Items state
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemImageFile, setItemImageFile] = useState(null);
  const [itemImagePreview, setItemImagePreview] = useState(null);
  const [itemLoading, setItemLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in via session storage
    const adminSession = sessionStorage.getItem('adminLoggedIn');
    if (!adminSession) {
      navigate('/');
    } else {
      setIsLoggedIn(true);
      loadHeroes();
      loadEvents();
      loadMatches();
      loadItems();
    }
  }, [navigate]);

  const loadHeroes = async () => {
    try {
      const res = await heroesAPI.getAll();
      console.log('Heroes loaded:', res.data);
      setHeroes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error loading heroes:', err);
      showMessage('Error loading heroes: ' + err.message, 'error');
      setHeroes([]);
    }
  };

  const loadEvents = async () => {
    try {
      setEventsLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
      const res = await fetch(`${API_BASE_URL}/api/events`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log('Events loaded:', data);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading events:', err);
      showMessage('Error loading events: ' + err.message, 'error');
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const loadMatches = async () => {
    try {
      setMatchesLoading(true);
      const res = await matchesAPI.getAll();
      setMatches(res.data);
    } catch (err) {
      showMessage('Error loading matches: ' + err.message, 'error');
    } finally {
      setMatchesLoading(false);
    }
  };

  const loadItems = async () => {
    try {
      setItemsLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
      const res = await fetch(`${API_BASE_URL}/api/items`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Items loaded:', data);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading items:', err);
      showMessage('Error loading items: ' + err.message, 'error');
      setItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleItemSelect = (e) => {
    const itemId = e.target.value;
    console.log('Item selected:', itemId);
    setSelectedItemId(itemId);
    
    if (itemId) {
      const item = items.find(i => String(i.id) === String(itemId));
      console.log('Found item:', item);
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
  };

  const handleItemImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItemImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemImageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemId || !itemImageFile) {
      showMessage('Please select an item and image', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', itemImageFile);

    try {
      setItemLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
      const itemIdNum = parseInt(selectedItemId);
      
      console.log('Uploading item image:', { itemIdNum, fileName: itemImageFile.name, size: itemImageFile.size });
      
      const res = await fetch(`${API_BASE_URL}/api/items/${itemIdNum}/image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      const responseData = await res.json();
      console.log('Upload response:', { status: res.status, data: responseData });

      if (res.ok) {
        showMessage('✓ Item image uploaded successfully!', 'success');
        setItemImageFile(null);
        setItemImagePreview(null);
        setSelectedItemId('');
        setSelectedItem(null);
        loadItems();
      } else {
        showMessage('Error uploading item image: ' + (responseData.error || responseData.message || 'Unknown error'), 'error');
      }
    } catch (err) {
      showMessage('Error: ' + err.message, 'error');
      console.error('Item upload error:', err);
    } finally {
      setItemLoading(false);
    }
  };

  const handleHeroSelect = (e) => {
    const heroId = e.target.value;
    console.log('Hero selected:', heroId, 'from heroes:', heroes);
    setSelectedHeroId(heroId);
    
    if (heroId) {
      const hero = heroes.find(h => h.id === parseInt(heroId));
      console.log('Found hero:', hero);
      setSelectedHero(hero);
    } else {
      setSelectedHero(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedHeroId || !imageFile) {
      showMessage('Please select a hero and image', 'error');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('heroId', selectedHeroId);
      formData.append('image', imageFile);

      const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/upload-hero-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('✅ Image uploaded successfully! Refresh to see changes.', 'success');
        setSelectedHeroId('');
        setSelectedHero(null);
        setImageFile(null);
        setPreview(null);
        if (e.target && e.target.reset) {
          e.target.reset();
        }
        loadHeroes();
        
        setTimeout(() => {
          setMessage('');
        }, 5000);
      } else {
        showMessage('Error: ' + (result.message || 'Upload failed'), 'error');
        console.error('Upload error:', result);
      }
    } catch (error) {
      showMessage('Upload failed: ' + error.message, 'error');
      console.error('Upload exception:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    // Auto-clear message after 4 seconds
    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!eventTitle || !eventDate || !eventDescription) {
      showMessage('Please fill in all event fields', 'error');
      return;
    }

    setEventLoading(true);

    try {
      // If there's an image, upload it first
      let imageBase64 = null;
      if (eventImage) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(eventImage);
        });
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: eventTitle,
          description: eventDescription,
          eventDate: new Date(eventDate).toISOString(),
          status: eventStatus,
          image: imageBase64
        })
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('✅ Event created successfully!', 'success');
        setEventTitle('');
        setEventDate('');
        setEventDescription('');
        setEventStatus('upcoming');
        setEventImage(null);
        setEventImagePreview(null);
        loadEvents(); // Reload events list
      } else {
        showMessage('Error: ' + (result.message || result.error || 'Failed to create event'), 'error');
      }
    } catch (error) {
      showMessage('Error creating event: ' + error.message, 'error');
    } finally {
      setEventLoading(false);
    }
  };

  const handleEventImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setEventImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMatchImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMatchImage(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setMatchImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          showMessage('✅ Event deleted successfully!', 'success');
          loadEvents();
        } else {
          const result = await response.json();
          showMessage('Error: ' + (result.message || 'Failed to delete event'), 'error');
        }
      } catch (error) {
        showMessage('Error deleting event: ' + error.message, 'error');
      }
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();

    if (!matchTitle || !matchDate || !matchDescription) {
      showMessage('Please fill in all match fields', 'error');
      return;
    }

    setMatchLoading(true);

    try {
      // If there's an image, upload it first
      let imageBase64 = null;
      if (matchImage) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(matchImage);
        });
      }

      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: matchTitle,
          description: matchDescription,
          matchDate: new Date(matchDate).toISOString(),
          image: imageBase64
        })
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('✅ Match created successfully!', 'success');
        setMatchTitle('');
        setMatchDate('');
        setMatchDescription('');
        setMatchStatus('upcoming');
        setMatchImage(null);
        setMatchImagePreview(null);
        loadMatches(); // Reload matches list
      } else {
        showMessage('Error: ' + (result.message || result.error || 'Failed to create match'), 'error');
      }
    } catch (error) {
      showMessage('Error creating match: ' + error.message, 'error');
    } finally {
      setMatchLoading(false);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        const response = await matchesAPI.delete(matchId);

        if (response.ok || response.status === 200) {
          showMessage('✅ Match deleted successfully!', 'success');
          loadMatches();
        } else {
          showMessage('Error: Failed to delete match', 'error');
        }
      } catch (error) {
        showMessage('Error deleting match: ' + error.message, 'error');
      }
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text font-display text-4xl font-black text-transparent md:text-5xl">🎮 Hero Image Upload</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-brand-line bg-white p-8 shadow-lift">
          {/* Hero Select */}
          <div>
            <label className="mb-3 block font-bold text-brand-bluedd">Select Hero:</label>
            <select
              value={selectedHeroId}
              onChange={handleHeroSelect}
              required
              className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            >
              <option value="">-- Choose a Hero --</option>
              {heroes.map(hero => (
                <option key={hero.id} value={hero.id}>
                  {hero.name} ({hero.role})
                </option>
              ))}
            </select>

            {selectedHero && (
              <div className="mt-4 rounded-xl border-l-4 border-brand-blue bg-brand-bluesoft p-4">
                <p><strong className="text-brand-bluedd">Role:</strong> {selectedHero.role}</p>
                <p><strong className="text-brand-bluedd">Difficulty:</strong> {'⭐'.repeat(selectedHero.difficulty || 0)}</p>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-3 block font-bold text-brand-bluedd">Upload Hero Image:</label>
            <p className="mb-2 text-sm text-brand-mut">Supported: JPG, PNG, WebP, GIF, SVG, BMP, ICO</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            />

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-80 max-w-full rounded-xl border-2 border-brand-blue/40"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-bluedd py-3 font-bold uppercase tracking-wider text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '⏳ Uploading...' : '📤 Upload Image'}
          </button>
        </form>

        {/* Event Scheduler */}
        <div className="mt-12 border-t border-brand-line pt-12">
          <h2 className="mb-6 font-display text-3xl font-black text-brand-ink">📅 Event Scheduler</h2>

          <form onSubmit={handleCreateEvent} className="space-y-6 rounded-2xl border border-brand-line bg-white p-8 shadow-lift">
            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Event Title:</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event name"
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />
            </div>

            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Event Date & Time:</label>
              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />
            </div>

            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Description:</label>
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Enter event description"
                rows="4"
                className="w-full resize-none rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />
            </div>

            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Status:</label>
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value)}
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              >
                <option value="upcoming">🔜 Upcoming</option>
                <option value="live">🟢 Live</option>
              </select>
            </div>

            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Event Cover Media:</label>
              <p className="mb-2 text-sm text-brand-mut">Upload image, GIF, or video (MP4, WebM, OGG, JPG, PNG, GIF, WebP)</p>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/ogg"
                onChange={handleEventImageChange}
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />

              {eventImagePreview && eventImage && (
                <div className="mt-4">
                  {eventImage.type.startsWith('video/') ? (
                    <video
                      src={eventImagePreview}
                      autoPlay
                      loop
                      muted
                      className="max-h-60 max-w-full rounded-xl border-2 border-brand-blue/40"
                    />
                  ) : (
                    <img
                      src={eventImagePreview}
                      alt="Event Cover Preview"
                      className="max-h-60 max-w-full rounded-xl border-2 border-brand-blue/40"
                    />
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={eventLoading}
              className="w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-bluedd py-3 font-bold uppercase tracking-wider text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {eventLoading ? '⏳ Creating...' : '📌 Create Event'}
            </button>
          </form>
        </div>

        {/* Active Events List */}
        <div className="mt-12 border-t border-brand-line pt-12">
          <h2 className="mb-6 font-display text-3xl font-black text-brand-ink">📋 Active Events</h2>

          {eventsLoading ? (
            <p className="text-brand-mut">Loading events...</p>
          ) : events.length > 0 ? (
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="flex items-center justify-between rounded-xl border border-brand-line bg-white p-4 shadow-soft">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-ink">{event.title}</h3>
                    <p className="text-sm text-brand-mut">{event.description?.substring(0, 60)}...</p>
                    <p className="mt-1 text-xs text-brand-bluedd">
                      📅 {new Date(event.event_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="ml-4 whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-brand-mut">No events yet. Create one above!</p>
          )}
        </div>

        {/* Match History */}
        <div className="mt-12 border-t border-brand-line pt-12">
          <h2 className="mb-6 font-display text-3xl font-black text-brand-ink">⚔️ Match History</h2>

          <form onSubmit={handleCreateMatch} className="space-y-6 rounded-2xl border border-brand-line bg-white p-8 shadow-lift">
            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Match Title:</label>
              <input
                type="text"
                value={matchTitle}
                onChange={(e) => setMatchTitle(e.target.value)}
                placeholder="Enter match name"
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />
            </div>

            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Match Date & Time:</label>
              <input
                type="datetime-local"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />
            </div>

            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Description:</label>
              <textarea
                value={matchDescription}
                onChange={(e) => setMatchDescription(e.target.value)}
                placeholder="Enter match description"
                rows="4"
                className="w-full resize-none rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />
            </div>

            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Match Cover Media:</label>
              <p className="mb-2 text-sm text-brand-mut">Upload image, GIF, or video (MP4, WebM, OGG, JPG, PNG, GIF, WebP)</p>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/ogg"
                onChange={handleMatchImageChange}
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />

              {matchImagePreview && matchImage && (
                <div className="mt-4">
                  {matchImage.type.startsWith('video/') ? (
                    <video
                      src={matchImagePreview}
                      autoPlay
                      loop
                      muted
                      className="max-h-60 max-w-full rounded-xl border-2 border-brand-blue/40"
                    />
                  ) : (
                    <img
                      src={matchImagePreview}
                      alt="Match Cover Preview"
                      className="max-h-60 max-w-full rounded-xl border-2 border-brand-blue/40"
                    />
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={matchLoading}
              className="w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-bluedd py-3 font-bold uppercase tracking-wider text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {matchLoading ? '⏳ Creating...' : '⚔️ Create Match'}
            </button>
          </form>
        </div>

        {/* Active Matches List */}
        <div className="mt-12 border-t border-brand-line pt-12">
          <h2 className="mb-6 font-display text-3xl font-black text-brand-ink">📋 Active Matches</h2>

          {matchesLoading ? (
            <p className="text-brand-mut">Loading matches...</p>
          ) : matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map(match => (
                <div key={match.id} className="flex items-center justify-between rounded-xl border border-brand-line bg-white p-4 shadow-soft">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-ink">{match.title}</h3>
                    <p className="text-sm text-brand-mut">{match.description?.substring(0, 60)}...</p>
                    <p className="mt-1 text-xs text-brand-bluedd">
                      📅 {new Date(match.match_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMatch(match.id)}
                    className="ml-4 whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-brand-mut">No matches yet. Create one above!</p>
          )}
        </div>

        {/* Item Image Upload Section */}
        <div className="mt-12 rounded-2xl border border-brand-line bg-white p-8 shadow-lift">
          <h2 className="mb-6 bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text font-display text-3xl font-black text-transparent">📦 Item Image Upload</h2>

          <form onSubmit={handleItemImageSubmit} className="space-y-6">
            {/* Item Select */}
            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Select Item:</label>
              <select
                value={selectedItemId}
                onChange={handleItemSelect}
                required
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              >
                <option value="">-- Choose an Item --</option>
                {Array.isArray(items) && items.map(item => (
                  <option key={item.id} value={String(item.id)}>
                    {item.name}
                  </option>
                ))}
              </select>

              {selectedItem && (
                <div className="mt-4 rounded-xl border-l-4 border-brand-blue bg-brand-bluesoft p-4">
                  <p><strong className="text-brand-bluedd">Item:</strong> {selectedItem.name}</p>
                  {selectedItem && (
                    <div className="mt-3">
                      <p className="mb-2 text-sm font-semibold text-brand-bluedd">Current Image:</p>
                      <img
                        src={`${import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin)}/api/items/${selectedItem.id}/image?t=${Date.now()}`}
                        alt={selectedItem.name}
                        className="h-20 w-20 rounded-lg border border-brand-line"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-3 block font-bold text-brand-bluedd">Upload Item Image:</label>
              <p className="mb-2 text-sm text-brand-mut">Supported: JPG, PNG, WebP, GIF, SVG, BMP, ICO</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleItemImageChange}
                required
                className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
              />

              {itemImagePreview && (
                <div className="mt-4">
                  <img
                    src={itemImagePreview}
                    alt="Preview"
                    className="max-w-xs rounded-xl border-2 border-brand-blue/40"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={itemLoading}
              className="w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-bluedd px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {itemLoading ? '⏳ Uploading...' : '📤 Upload Item Image'}
            </button>
          </form>

          {/* Items Gallery */}
          {itemsLoading ? (
            <p className="mt-6 text-brand-mut">Loading items...</p>
          ) : items.length > 0 ? (
            <div className="mt-8">
              <h3 className="mb-4 font-display text-xl font-bold text-brand-ink">All Items</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
                {items.map(item => {
                  const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
                  return (
                    <div key={item.id} className="rounded-xl border border-brand-line bg-brand-mist p-3 text-center">
                      <img
                        src={`${API_BASE_URL}/api/items/${item.id}/image?t=${Date.now()}`}
                        alt={item.name}
                        className="mb-2 h-20 w-full rounded object-cover"
                        onError={(e) => {
                          e.target.src = '';
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-20 bg-brand-cloud rounded mb-2 flex items-center justify-center"><span class="text-xs text-brand-faint">No Image</span></div>';
                        }}
                      />
                      <p className="truncate text-xs font-semibold text-brand-bluedd">{item.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-6 text-brand-mut">No items available.</p>
          )}
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mt-6 rounded-xl border-2 p-4 text-center font-bold ${
              messageType === 'success'
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-red-300 bg-red-50 text-red-600'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </Layout>
  );
}
