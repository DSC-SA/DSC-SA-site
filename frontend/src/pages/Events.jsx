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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 led-animated">🎮 Events</h1>
        <div className="led-line mb-6"></div>
        <p className="text-gray-300 text-lg font-semibold">Join the DSC-SA community for epic matches, competitions, and challenges</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">⏳ Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {events.map(event => (
            <div key={event.id} className="card-gaming overflow-hidden hover:border-cyan-400 transition-all duration-300 group flex flex-row w-96 h-32">
              {event.image && (
                <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden bg-gray-800">
                  {event.image.startsWith('data:video/') ? (
                    <>
                      <video
                        src={event.image}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-30"></div>
                    </>
                  ) : (
                    <>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-30"></div>
                    </>
                  )}
                </div>
              )}
              
              <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition line-clamp-1">{event.title}</h3>
                  <p className="text-gray-300 line-clamp-1 text-xs leading-tight">{event.description}</p>
                </div>
                
                <div className="flex items-center gap-1 text-purple-400 font-semibold text-xs">
                  <span>📅</span>
                  <span className="line-clamp-1">{new Date(event.event_date).toLocaleDateString('en-US', { 
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
