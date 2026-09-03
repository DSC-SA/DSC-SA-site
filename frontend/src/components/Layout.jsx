import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsent from './CookieConsent';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0c0d10]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:py-12">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}