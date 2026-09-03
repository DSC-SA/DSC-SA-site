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
        <h1 className="mb-4 text-4xl font-bold text-brand-ink md:text-5xl">🎮 Events</h1>
        <div className="mb-6 h-1 w-24 rounded bg-gradient-to-r from-brand-blue to-brand-bluedd"></div>
        <p className="text-lg font-semibold text-brand-mut">Join the DSC-SA community for epic matches, competitions, and challenges</p>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <p className="text-brand-mut">⏳ Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {events.map(event => (
            <div
              key={event.id}
              className="group flex max-h-40 flex-row overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft transition-all duration-300 hover:border-brand-blue/40"
            >
              {event.image && (
                <div className="flex w-2/5 flex-shrink-0 overflow-hidden bg-brand-mist sm:w-48">
                  {event.image.startsWith('data:video/') ? (
                    <>
                      <video
                        src={event.image}
                        autoPlay
                        loop
                        muted
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
                    </>
                  ) : (
                    <>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between overflow-hidden p-3">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-sm font-bold text-brand-ink transition group-hover:text-brand-bluedd">{event.title}</h3>
                  <p className="line-clamp-1 text-xs leading-tight text-brand-mut">{event.description}</p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-brand-bluedd">
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
        <div className="rounded-3xl border border-brand-line bg-white p-12 text-center shadow-soft">
          <p className="mb-4 text-6xl">🏟️</p>
          <p className="mb-2 font-display text-2xl font-bold text-brand-ink">No Events Yet</p>
          <p className="text-brand-mut">Check back soon for exciting community events!</p>
        </div>
      )}
    </Layout>
  );
}
