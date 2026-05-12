import React from 'react';
import Layout from '../components/Layout';

export default function NSFW() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gaming-dark to-gray-900 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold gradient-gaming mb-4">Age Verification Required</h1>
            <p className="text-gray-300 mb-8">This section contains restricted content for community members. Please verify your age to access the restricted NSFW content.</p>
            
            <div className="bg-gray-800 border border-cyan-500 border-opacity-30 rounded-lg p-6">
              <p className="text-gray-400 mb-6">You must be 18 years or older to access this content. By confirming, you acknowledge that you meet the age requirement and understand the community guidelines.</p>
              
              <div className="flex gap-4">
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded transition">
                  I Confirm - Continue
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
