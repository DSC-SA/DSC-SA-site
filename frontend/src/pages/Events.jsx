import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventsAPI.getAll();
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Layout>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-10 bg-gradient-to-b from-cyan-400 to-purple-500 rounded"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">🎮 Events</h1>
        </div>
        <p className="text-gray-400 text-lg">Join the DSC-SA community for epic matches, competitions, and challenges</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">⏳ Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map(event => (
            <div key={event.id} className="card-gaming overflow-hidden hover:border-cyan-400 transition-all duration-300 group flex flex-col lg:flex-row">
              {event.image && (
                <div className="relative w-full lg:w-1/2 h-48 lg:h-auto overflow-hidden bg-gray-800 flex-shrink-0">
                  {event.image.startsWith('data:video/') ? (
                    <video
                      src={event.image}
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-30"></div>
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      event.status === 'upcoming' 
                        ? 'bg-blue-600 text-blue-100' 
                        : 'bg-green-600 text-green-100'
                    }`}>
                      {event.status === 'upcoming' ? '🔜 Upcoming' : '🟢 Live'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-cyan-400 transition line-clamp-2">{event.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">{event.description}</p>
                </div>
                
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <span>📅</span>
                  <span>{new Date(event.event_date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-gaming p-12 text-center">
          <p className="text-6xl mb-4">🏟️</p>
          <p className="text-2xl font-bold mb-2">No Events Yet</p>
          <p className="text-gray-400">Check back soon for exciting community events!</p>
        </div>
      )}
    </Layout>
  );
}
