import React from 'react';
import Layout from '../components/Layout';

export default function NSFW() {
  return (
    <Layout>
      <div className="min-h-[70vh] pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-4 bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text font-display text-4xl font-bold text-transparent">Age Verification Required</h1>
            <p className="mb-8 text-brand-mut">This section contains restricted content for community members. Please verify your age to access the restricted NSFW content.</p>

            <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-lift">
              <p className="mb-6 text-brand-mut">You must be 18 years or older to access this content. By confirming, you acknowledge that you meet the age requirement and understand the community guidelines.</p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="rounded-xl bg-gradient-to-r from-brand-blue to-brand-bluedd px-6 py-2 font-bold text-white shadow-soft transition hover:opacity-90">
                  I Confirm - Continue
                </button>
                <button className="rounded-xl border border-brand-line bg-brand-mist px-6 py-2 font-bold text-brand-ink transition hover:bg-brand-cloud">
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
