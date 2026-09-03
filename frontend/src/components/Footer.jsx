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

function FooterCol({ title, children }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-faint">{title}</h4>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-line bg-brand-snow md:mt-24">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl font-bold tracking-tight text-brand-bluedd">DSC-SA</span>
            <p className="mt-3 max-w-xs text-sm text-brand-mut">
              The Dawn Sphere Community — mobile legends made better.
            </p>
          </div>

          <FooterCol title="Quick Links">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-brand-mut transition hover:text-brand-bluedd">{l.label}</Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Community">
            {communityLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-brand-mut transition hover:text-brand-bluedd">{l.label}</a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Follow Us">
            {followLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-brand-mut transition hover:text-brand-bluedd">{l.label}</a>
              </li>
            ))}
            <li><Link to="/privacy" className="text-brand-mut transition hover:text-brand-bluedd">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-brand-mut transition hover:text-brand-bluedd">Terms of Service</Link></li>
          </FooterCol>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-brand-line pt-6 md:flex-row">
          <p className="text-sm text-brand-faint">© 2026 DSC-SA Community. All rights reserved.</p>
          <p className="text-sm text-brand-faint">Made with love for MLBB players</p>
        </div>
      </div>
    </footer>
  );
}