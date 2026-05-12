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
            <div key={event.id} className="card-gaming overflow-hidden hover:border-cyan-400 transition-all duration-300 group inline-block !w-32 !h-32">
              {event.image && (
                <div className="relative !w-32 !h-32 overflow-hidden bg-gray-800">
                  {event.image.startsWith('data:video/') ? (
                    <>
                      <video
                        src={event.image}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </>
                  )}
                </div>
              )}
              {!event.image && (
                <div className="!w-32 !h-32 bg-gray-800 flex items-center justify-center">
                  <span className="text-3xl">🎮</span>
                </div>
              )}
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
