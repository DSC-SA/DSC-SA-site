import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';
import { eventsAPI } from '../services/api';

function guessCategory(title = '') {
  const t = title.toLowerCase();
  if (/tournament|cup|championship|ranked|competition/.test(t)) return 'Tournament';
  if (/scrim|friendly|practice|training/.test(t)) return 'Scrimmage';
  if (/community|fun|chill|casual/.test(t)) return 'Community';
  if (/giveaway|reward|prize|draw/.test(t)) return 'Giveaway';
  return 'Community';
}

const CAT_STYLES = {
  Tournament: 'from-brand-blue to-brand-bluedd',
  Scrimmage: 'from-fuchsia-400 to-brand-blue',
  Community: 'from-brand-bluelt to-brand-blue',
  Giveaway: 'from-amber-400 to-orange-400'
};

function EventCard({ event, index }) {
  const cat = guessCategory(event.title);
  const date = event.event_date ? new Date(event.event_date) : null;
  const day = date ? date.getDate() : '--';
  const mon = date ? date.toLocaleString('en-US', { month: 'short' }) : '';

  const cover = event.image ? (
    event.image.startsWith('data:video/') ? (
      <video src={event.image} autoPlay loop muted className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
    ) : (
      <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
    )
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-blue/15 to-brand-bluelt/25 text-5xl">🎮</div>
  );

  return (
    <Reveal delay={`${(index % 3) * 90}ms`} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-line bg-brand-snow shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-brand-blue/50 hover:shadow-lift">
        {/* soft glow on hover */}
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 z-0 h-48 w-48 rounded-full bg-brand-blue/10 blur-3xl transition duration-300 group-hover:bg-brand-blue/20" />

        {/* cover */}
        <div className="relative h-40 w-full overflow-hidden bg-brand-mist sm:h-44">
          {cover}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          {/* date badge */}
          <div className="absolute left-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-brand-snow/95 shadow-soft backdrop-blur">
            <span className="font-display text-xl font-bold leading-none text-brand-bluedd">{day}</span>
            {mon && <span className="text-[0.6rem] font-bold uppercase tracking-wide text-brand-mut">{mon}</span>}
          </div>

          {/* category chip */}
          <span className={`absolute right-4 top-4 rounded-full bg-gradient-to-r px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-soft ${CAT_STYLES[cat] || CAT_STYLES.Community}`}>
            {cat}
          </span>
        </div>

        {/* body */}
        <div className="relative z-10 flex flex-1 flex-col p-5">
          <h3 className="mb-2 line-clamp-1 font-display text-lg font-bold text-brand-ink transition group-hover:text-brand-bluedd">
            {event.title}
          </h3>
          <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-brand-mut">{event.description}</p>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-mut">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              {date
                ? date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })
                : 'Join'}{' '}
              · Open to all
            </span>
            <span className="rounded-full px-4 py-2 text-xs font-semibold text-brand-bluedd transition hover:underline">
              Details →
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
      {/* header banner */}
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-brand-line bg-brand-snow px-6 py-10 sm:px-10 sm:py-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0"
          style={{
            background:
              'radial-gradient(680px 340px at 10% -10%, rgba(91,181,232,0.28), transparent 62%), radial-gradient(560px 300px at 96% 115%, rgba(167,200,240,0.45), transparent 62%)'
          }}
        />
        <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-bluedd">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-blue" />
              </span>
              Live calendar
            </span>
            <h1 className="font-display text-4xl font-bold text-brand-ink md:text-5xl">🎮 Events</h1>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-brand-blue to-brand-bluedd" />
            <p className="mt-4 max-w-xl text-base font-medium text-brand-mut sm:text-lg">
              Join the DSC-SA community for epic matches, competitions, and challenges
            </p>
          </div>

          <div className="hidden shrink-0 flex-col gap-2 rounded-2xl border border-brand-line bg-brand-snow/70 p-4 shadow-soft sm:flex">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-faint">Up next</span>
            <span className="font-display text-2xl font-bold text-brand-bluedd">
              {events.length} Event{events.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </section>

      {/* grid */}
      {loading ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
          <p className="text-brand-mut">Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-brand-line bg-brand-snow p-14 text-center shadow-soft">
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-brand-blue/10 blur-3xl" />
          <p className="mb-4 text-6xl">🏟️</p>
          <p className="mb-2 font-display text-2xl font-bold text-brand-ink">No Events Yet</p>
          <p className="text-brand-mut">Check back soon for exciting community events!</p>
        </div>
      )}
    </Layout>
  );
}