import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { verificationAPI } from '../services/api';

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/FaYoaGoshAu6QrKBsJAJNh?s=cl&p=a&mlu=4&ilr=4';

export default function NSFW() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [view, setView] = useState('loading'); // loading | form | pending | approved | denied
  const [phone, setPhone] = useState('');
  const [confirmed18, setConfirmed18] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    if (!user) {
      setView('form');
      return () => { mounted = false; };
    }
    verificationAPI
      .getStatus()
      .then((res) => {
        if (!mounted) return;
        const status = res.data?.status;
        setView(status === 'pending' ? 'pending' : status === 'approved' ? 'approved' : status === 'denied' ? 'denied' : 'form');
      })
      .catch(() => {
        if (mounted) setView('form');
      });
    return () => { mounted = false; };
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!confirmed18) {
      setError('You must confirm you are 18 years or older.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await verificationAPI.submit({ phone, ageConfirmed: confirmed18 });
      setView(res.data?.status === 'approved' ? 'approved' : 'pending');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-4 bg-gradient-to-r from-brand-bluedd to-brand-blue bg-clip-text font-display text-4xl font-bold text-transparent">
              Age Verification Required
            </h1>
            <p className="mb-8 text-brand-mut">
              This section contains restricted content for community members. Please verify your age to access the restricted NSFW content.
            </p>

            {view === 'loading' && (
              <div className="flex justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
              </div>
            )}

            {view === 'form' && !submitting && (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-brand-line bg-brand-snow p-6 shadow-lift sm:p-8">
                <h2 className="mb-2 font-display text-xl font-bold text-brand-ink">Verify your age</h2>
                <p className="mb-6 text-sm text-brand-mut">
                  Enter the phone number you use on WhatsApp. A moderator will review your request before access is granted.
                </p>

                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-brand-ink" htmlFor="wa-phone">
                    WhatsApp number
                  </label>
                  <input
                    id="wa-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 123 4567"
                    className="w-full rounded-xl border border-brand-line bg-brand-mist px-4 py-3 text-brand-ink outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                  />
                </div>

                <label className="mb-6 flex items-start gap-3 text-sm text-brand-ink">
                  <input
                    type="checkbox"
                    checked={confirmed18}
                    onChange={(e) => setConfirmed18(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-brand-line bg-brand-mist accent-brand-blue"
                  />
                  <span>I confirm that I am 18 years of age or older and agree to the community guidelines.</span>
                </label>

                {error && (
                  <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="btn-primary flex-1 px-6 py-2.5 text-sm"
                  >
                    Submit Verification
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn-secondary flex-1 px-6 py-2.5 text-sm"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            )}

            {view === 'form' && submitting && (
              <div className="flex justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
              </div>
            )}

            {view === 'pending' && (
              <div className="rounded-2xl border border-brand-line bg-brand-snow p-6 shadow-lift sm:p-8">
                <h2 className="mb-2 font-display text-xl font-bold text-brand-ink">Request under review</h2>
                <p className="mb-6 text-brand-mut">
                  Your request has been received. A moderator will review your request and verify your account. You will be able to access this section once approved.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate('/')}
                    className="btn-primary flex-1 px-6 py-2.5 text-sm"
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={() => setView('form')}
                    className="btn-secondary flex-1 px-6 py-2.5 text-sm"
                  >
                    Submit Another Number
                  </button>
                </div>
              </div>
            )}

            {view === 'approved' && (
              <div className="rounded-2xl border border-brand-line bg-brand-snow p-6 shadow-lift sm:p-8">
                <h2 className="mb-2 font-display text-xl font-bold text-brand-ink">You are verified</h2>
                <p className="mb-6 text-brand-mut">
                  Your age verification was approved. You now have access to the community group. Join us on WhatsApp to get started.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={WHATSAPP_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1 px-6 py-2.5 text-center text-sm"
                  >
                    Join WhatsApp Group
                  </a>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-secondary flex-1 px-6 py-2.5 text-sm"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {view === 'denied' && (
              <div className="rounded-2xl border border-brand-line bg-brand-snow p-6 shadow-lift sm:p-8">
                <h2 className="mb-2 font-display text-xl font-bold text-brand-ink">Request not approved</h2>
                <p className="mb-6 text-brand-mut">
                  Your verification request could not be approved. If you believe this is a mistake, please contact a moderator or submit a new request.
                </p>
                <button
                  onClick={() => setView('form')}
                  className="btn-primary px-6 py-2.5 text-sm"
                >
                  Submit a New Request
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}