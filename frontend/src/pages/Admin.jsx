import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { heroesAPI, matchesAPI, buildsAPI, getImageUrl } from '../services/api';

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

  // Builds state
  const [allBuilds, setAllBuilds] = useState([]);
  const [buildsLoading, setBuildsLoading] = useState(false);

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
      loadBuilds();
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

  const loadBuilds = async () => {
    try {
      setBuildsLoading(true);
      // Get all heroes first
      const heroesRes = await heroesAPI.getAll();
      const heroesData = heroesRes.data;
      
      // Collect all builds from all heroes
      const allBuildsData = [];
      for (const hero of heroesData) {
        try {
          const buildsRes = await buildsAPI.getForHero(hero.id);
          if (buildsRes.data.userBuilds) {
            allBuildsData.push(...buildsRes.data.userBuilds.map(build => ({ 
              ...build, 
              heroId: hero.id, 
              heroName: hero.name 
            })));
          }
        } catch (err) {
          console.error(`Error loading builds for hero ${hero.id}:`, err);
        }
      }
      setAllBuilds(allBuildsData);
    } catch (err) {
      console.error('Error loading builds:', err);
      showMessage('Error loading builds: ' + err.message, 'error');
      setAllBuilds([]);
    } finally {
      setBuildsLoading(false);
    }
  };

  const handleDeleteBuild = async (buildId) => {
    if (window.confirm('Are you sure you want to delete this build? This action cannot be undone.')) {
      try {
        await buildsAPI.delete(buildId);
        showMessage('✅ Build deleted successfully!', 'success');
        loadBuilds(); // Reload builds list
      } catch (error) {
        showMessage('Error deleting build: ' + error.message, 'error');
        console.error('Delete error:', error);
      }
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
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
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
    localStorage.removeItem('token');
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
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-black text-white gradient-gaming">🎮 Hero Image Upload</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-gaming-dark rounded-lg p-8 border border-cyan-400 border-opacity-30 space-y-6">
          {/* Hero Select */}
          <div>
            <label className="block text-cyan-400 font-bold mb-3">Select Hero:</label>
            <select
              value={selectedHeroId}
              onChange={handleHeroSelect}
              required
              className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-cyan-400 border-opacity-50 focus:border-cyan-300 focus:outline-none transition"
            >
              <option value="">-- Choose a Hero --</option>
              {heroes.map(hero => (
                <option key={hero.id} value={hero.id}>
                  {hero.name} ({hero.role})
                </option>
              ))}
            </select>

            {selectedHero && (
              <div className="mt-4 p-4 bg-cyan-500 bg-opacity-10 border-l-4 border-cyan-400 rounded">
                <p><strong className="text-cyan-400">Role:</strong> {selectedHero.role}</p>
                <p><strong className="text-cyan-400">Difficulty:</strong> {'⭐'.repeat(selectedHero.difficulty || 0)}</p>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-cyan-400 font-bold mb-3">Upload Hero Image:</label>
            <p className="text-cyan-300 text-sm mb-2">Supported: JPG, PNG, WebP, GIF, SVG, BMP, ICO</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-cyan-400 border-opacity-50 focus:border-cyan-300 focus:outline-none transition"
            />

            {preview && (
              <div className="mt-4">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-w-full max-h-80 rounded-lg border-2 border-cyan-400"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 uppercase tracking-wider"
          >
            {loading ? '⏳ Uploading...' : '📤 Upload Image'}
          </button>
        </form>

        {/* Event Scheduler */}
        <div className="mt-12 pt-12 border-t border-purple-500 border-opacity-20">
          <h2 className="text-3xl font-black text-white mb-6">📅 Event Scheduler</h2>
          
          <form onSubmit={handleCreateEvent} className="bg-gaming-dark rounded-lg p-8 border border-purple-500 border-opacity-30 space-y-6">
            <div>
              <label className="block text-purple-400 font-bold mb-3">Event Title:</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event name"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-purple-400 border-opacity-50 focus:border-purple-300 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-purple-400 font-bold mb-3">Event Date & Time:</label>
              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-purple-400 border-opacity-50 focus:border-purple-300 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-purple-400 font-bold mb-3">Description:</label>
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Enter event description"
                rows="4"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-purple-400 border-opacity-50 focus:border-purple-300 focus:outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-purple-400 font-bold mb-3">Status:</label>
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-purple-400 border-opacity-50 focus:border-purple-300 focus:outline-none transition"
              >
                <option value="upcoming">🔜 Upcoming</option>
                <option value="live">🟢 Live</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-400 font-bold mb-3">Event Cover Media:</label>
              <p className="text-purple-300 text-sm mb-2">Upload image, GIF, or video (MP4, WebM, OGG, JPG, PNG, GIF, WebP)</p>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/ogg"
                onChange={handleEventImageChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-purple-400 border-opacity-50 focus:border-purple-300 focus:outline-none transition"
              />

              {eventImagePreview && eventImage && (
                <div className="mt-4">
                  {eventImage.type.startsWith('video/') ? (
                    <video 
                      src={eventImagePreview} 
                      autoPlay
                      loop
                      muted
                      className="max-w-full max-h-60 rounded-lg border-2 border-purple-400"
                    />
                  ) : (
                    <img 
                      src={eventImagePreview} 
                      alt="Event Cover Preview" 
                      className="max-w-full max-h-60 rounded-lg border-2 border-purple-400"
                    />
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={eventLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 uppercase tracking-wider"
            >
              {eventLoading ? '⏳ Creating...' : '📌 Create Event'}
            </button>
          </form>
        </div>

        {/* Active Events List */}
        <div className="mt-12 pt-12 border-t border-purple-500 border-opacity-20">
          <h2 className="text-3xl font-black text-white mb-6">📋 Active Events</h2>
          
          {eventsLoading ? (
            <p className="text-gray-400">Loading events...</p>
          ) : events.length > 0 ? (
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="flex items-center justify-between bg-gaming-dark rounded-lg p-4 border border-purple-500 border-opacity-20">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                    <p className="text-gray-400 text-sm">{event.description?.substring(0, 60)}...</p>
                    <p className="text-purple-400 text-xs mt-1">
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
                    className="ml-4 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition whitespace-nowrap"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No events yet. Create one above!</p>
          )}
        </div>

        {/* Match History */}
        <div className="mt-12 pt-12 border-t border-pink-500 border-opacity-20">
          <h2 className="text-3xl font-black text-white mb-6">⚔️ Match History</h2>
          
          <form onSubmit={handleCreateMatch} className="bg-gaming-dark rounded-lg p-8 border border-pink-500 border-opacity-30 space-y-6">
            <div>
              <label className="block text-pink-400 font-bold mb-3">Match Title:</label>
              <input
                type="text"
                value={matchTitle}
                onChange={(e) => setMatchTitle(e.target.value)}
                placeholder="Enter match name"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-pink-400 border-opacity-50 focus:border-pink-300 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-pink-400 font-bold mb-3">Match Date & Time:</label>
              <input
                type="datetime-local"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-pink-400 border-opacity-50 focus:border-pink-300 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-pink-400 font-bold mb-3">Description:</label>
              <textarea
                value={matchDescription}
                onChange={(e) => setMatchDescription(e.target.value)}
                placeholder="Enter match description"
                rows="4"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-pink-400 border-opacity-50 focus:border-pink-300 focus:outline-none transition resize-none"
              />
            </div>



            <div>
              <label className="block text-pink-400 font-bold mb-3">Match Cover Media:</label>
              <p className="text-pink-300 text-sm mb-2">Upload image, GIF, or video (MP4, WebM, OGG, JPG, PNG, GIF, WebP)</p>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/ogg"
                onChange={handleMatchImageChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-pink-400 border-opacity-50 focus:border-pink-300 focus:outline-none transition"
              />

              {matchImagePreview && matchImage && (
                <div className="mt-4">
                  {matchImage.type.startsWith('video/') ? (
                    <video 
                      src={matchImagePreview} 
                      autoPlay
                      loop
                      muted
                      className="max-w-full max-h-60 rounded-lg border-2 border-pink-400"
                    />
                  ) : (
                    <img 
                      src={matchImagePreview} 
                      alt="Match Cover Preview" 
                      className="max-w-full max-h-60 rounded-lg border-2 border-pink-400"
                    />
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={matchLoading}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 uppercase tracking-wider"
            >
              {matchLoading ? '⏳ Creating...' : '⚔️ Create Match'}
            </button>
          </form>
        </div>

        {/* Active Matches List */}
        <div className="mt-12 pt-12 border-t border-pink-500 border-opacity-20">
          <h2 className="text-3xl font-black text-white mb-6">📋 Active Matches</h2>
          
          {matchesLoading ? (
            <p className="text-gray-400">Loading matches...</p>
          ) : matches.length > 0 ? (
            <div className="space-y-3">
              {matches.map(match => (
                <div key={match.id} className="flex items-center justify-between bg-gaming-dark rounded-lg p-4 border border-pink-500 border-opacity-20">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{match.title}</h3>
                    <p className="text-gray-400 text-sm">{match.description?.substring(0, 60)}...</p>
                    <p className="text-pink-400 text-xs mt-1">
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
                    className="ml-4 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition whitespace-nowrap"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No matches yet. Create one above!</p>
          )}
        </div>

        {/* Item Image Upload Section */}
        <div className="mt-12 bg-gaming-dark rounded-lg p-8 border border-yellow-400 border-opacity-30">
          <h2 className="text-3xl font-black gradient-gaming mb-6">📦 Item Image Upload</h2>
          
          <form onSubmit={handleItemImageSubmit} className="space-y-6">
            {/* Item Select */}
            <div>
              <label className="block text-yellow-400 font-bold mb-3">Select Item:</label>
              <select
                value={selectedItemId}
                onChange={handleItemSelect}
                required
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-yellow-400 border-opacity-50 focus:border-yellow-300 focus:outline-none transition"
              >
                <option value="">-- Choose an Item --</option>
                {Array.isArray(items) && items.map(item => (
                  <option key={item.id} value={String(item.id)}>
                    {item.name}
                  </option>
                ))}
              </select>

              {selectedItem && (
                <div className="mt-4 p-4 bg-yellow-500 bg-opacity-10 border-l-4 border-yellow-400 rounded">
                  <p><strong className="text-yellow-400">Item:</strong> {selectedItem.name}</p>
                  {selectedItem.image && (
                    <div className="mt-3">
                      <p className="text-yellow-400 text-sm font-semibold mb-2">Current Image:</p>
                      <img src={getImageUrl(selectedItem.image)} alt={selectedItem.name} className="w-20 h-20 rounded" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-yellow-400 font-bold mb-3">Upload Item Image:</label>
              <p className="text-yellow-300 text-sm mb-2">Supported: JPG, PNG, WebP, GIF, SVG, BMP, ICO</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleItemImageChange}
                required
                className="w-full px-4 py-3 bg-gray-800 text-white rounded border-2 border-yellow-400 border-opacity-50 focus:border-yellow-300 focus:outline-none transition"
              />

              {itemImagePreview && (
                <div className="mt-4">
                  <img 
                    src={itemImagePreview} 
                    alt="Preview" 
                    className="max-w-xs h-auto rounded-lg border-2 border-yellow-400"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={itemLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 transition"
            >
              {itemLoading ? '⏳ Uploading...' : '📤 Upload Item Image'}
            </button>
          </form>

          {/* Items Gallery */}
          {itemsLoading ? (
            <p className="text-gray-400 mt-6">Loading items...</p>
          ) : items.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">All Items</h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {items.map(item => (
                  <div key={item.id} className="bg-gray-800 rounded-lg p-3 border border-yellow-400 border-opacity-20 text-center">
                    {item.image ? (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-20 object-cover rounded mb-2" />
                    ) : (
                      <div className="w-full h-20 bg-gray-700 rounded mb-2 flex items-center justify-center">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                    <p className="text-xs text-yellow-300 font-semibold truncate">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 mt-6">No items available.</p>
          )}
        </div>

        {/* Community Builds Management */}
        <div className="bg-gaming-dark rounded-lg p-8 border border-purple-400 border-opacity-30 mb-8">
          <h2 className="text-3xl font-black text-white gradient-gaming mb-6">🎯 Community Builds Management</h2>
          
          {buildsLoading ? (
            <p className="text-gray-400">Loading builds...</p>
          ) : allBuilds.length > 0 ? (
            <div className="space-y-4">
              {allBuilds.map(build => (
                <div key={build.id} className="bg-gray-800 rounded-lg p-4 border border-purple-400 border-opacity-20 hover:border-opacity-50 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-purple-400">{build.build_name}</h3>
                      <p className="text-sm text-gray-400">Hero: <span className="text-cyan-400">{build.heroName}</span></p>
                      <p className="text-sm text-gray-400">Author: <span className="text-cyan-400">{build.username}</span></p>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs bg-pink-600 bg-opacity-30 px-2 py-1 rounded text-pink-300">❤️ {build.likes} likes</span>
                        <span className="text-xs bg-blue-600 bg-opacity-30 px-2 py-1 rounded text-blue-300">👁️ {build.views} views</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{build.description}</p>
                  
                  {build.items && build.items.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-purple-400 font-semibold mb-2">ITEMS:</p>
                      <div className="flex flex-wrap gap-2">
                        {build.items.filter(i => i.id).map(item => (
                          <div
                            key={item.id}
                            className="flex-shrink-0 relative group"
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              border: '1px solid rgba(139, 92, 246, 0.4)',
                              overflow: 'hidden'
                            }}
                            title={item.name}
                          >
                            {item.image ? (
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: '50%',
                                  display: 'block'
                                }}
                              />
                            ) : null}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                              <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-purple-400">
                                {item.name}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-700">
                    <button
                      onClick={() => handleDeleteBuild(build.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition"
                    >
                      🗑️ Delete Build
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No community builds available.</p>
          )}
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mt-6 p-4 rounded-lg font-bold text-center ${
              messageType === 'success'
                ? 'bg-green-600 bg-opacity-20 border-2 border-green-500 text-green-300'
                : 'bg-red-600 bg-opacity-20 border-2 border-red-500 text-red-300'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </Layout>
  );
}
