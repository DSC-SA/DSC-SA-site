import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gray-950">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
