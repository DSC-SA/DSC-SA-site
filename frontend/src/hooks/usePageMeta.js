import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'DawnSphere Community';
const HOME_DESC =
  'DawnSphere Community (DSC-SA) — Mobile Legends: Bang Bang community hub for South Africa. Explore hero guides, builds, events and matches.';

const PAGES = [
  { match: '/', title: 'Home', description: HOME_DESC },
  { match: '/heroes/:id', title: 'Hero', description: 'MLBB hero stats, builds and community guides.' },
  { match: '/heroes', title: 'Heroes', description: 'MLBB heroes database with stats, builds and community guides.' },
  { match: '/events', title: 'Events', description: 'Upcoming DawnSphere Community events.' },
  { match: '/matches', title: 'Matches', description: 'DawnSphere Community match schedules and results.' },
  { match: '/members', title: 'Members', description: 'Meet the DawnSphere Community members.' },
  { match: '/login', title: 'Sign In', description: 'Sign in to DawnSphere Community with your Google account.' },
  { match: '/register', title: 'Sign In', description: 'Create an account by signing in with Google.' },
  { match: '/privacy', title: 'Privacy Policy', description: 'DawnSphere Community privacy policy.' },
  { match: '/terms', title: 'Terms of Service', description: 'DawnSphere Community terms of service.' }
];

function normalize(path) {
  const p = path.replace(/\/+$/, '') || '/';
  const exact = PAGES.find((x) => x.match === p);
  if (exact) return exact;
  const dynamic = PAGES.find((x) => {
    if (!x.match.includes(':')) return false;
    const a = x.match.split('/');
    const b = p.split('/');
    if (a.length !== b.length) return false;
    return a.every((seg, i) => seg.startsWith(':') || seg === b[i]);
  });
  return dynamic || PAGES[0];
}

export default function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = normalize(pathname);
    document.title = `${page.title} | ${SITE_NAME}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', page.description);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', page.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', window.location.origin + pathname);
  }, [pathname]);
}