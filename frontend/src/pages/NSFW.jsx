import React from 'react';
import Layout from '../components/Layout';

export default function NSFW() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gaming-dark to-gray-900 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold gradient-gaming mb-4">NSFW Content</h1>
          <p className="text-gray-400">This page will contain NSFW content.</p>
        </div>
      </div>
    </Layout>
  );
}
