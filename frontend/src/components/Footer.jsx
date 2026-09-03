import React from 'react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/heroes', label: 'Heroes' },
  { to: '/events', label: 'Events' },
  { to: '/members', label: 'Community' },
  { to: '/matches', label: 'Guides' }
];

const communityLinks = [
  { href: 'https://discord.gg/5UJZcg6EuT', label: 'Discord' },
  { href: 'https://chat.whatsapp.com/DSTUcZnc5IIFJpq2w8oCqN', label: 'WhatsApp' },
  { href: 'https://x.com/DawnSphereC', label: 'X (Twitter)' },
  { href: 'https://www.instagram.com/dawnspherecommunity?igsh=cnZibmtocDRyaDh4', label: 'Instagram' }
];

const followLinks = [
  { href: 'https://www.tiktok.com/@dsc.sa?_r=1&_t=ZS-96DbA7k8WJt', label: 'TikTok' },
  { href: 'https://www.facebook.com/share/1Lf9eZfQZD/', label: 'Facebook' }
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-surface1">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-2xl font-extrabold tracking-tight text-brand-gold">DSC-SA</h3>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="transition hover:text-brand-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold">Community</h4>
            <ul className="space-y-2 text-slate-400">
              {communityLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-brand-gold">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-bold">Follow Us</h4>
            <ul className="space-y-2 text-slate-400">
              {followLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition hover:text-brand-gold">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/privacy" className="transition hover:text-brand-gold">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="transition hover:text-brand-gold">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-slate-500">© 2026 DSC-SA Community. All rights reserved.</p>
            <p className="text-sm text-slate-500">Made with love for MLBB players</p>
          </div>
        </div>
      </div>
    </footer>
  );
}