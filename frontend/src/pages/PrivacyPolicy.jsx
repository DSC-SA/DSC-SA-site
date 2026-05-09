import React from 'react';
import Layout from '../components/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-5xl font-black mb-2 text-white gradient-gaming">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Effective Date: May 8, 2026</p>
        
        <div className="space-y-8 text-gray-300">
          <p className="text-lg leading-relaxed">
            Welcome to DawnSphere Community. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you interact with our community, website, bots, services, and related platforms.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Community & Messaging Data</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your phone number</li>
                  <li>Display name or username</li>
                  <li>Profile picture</li>
                  <li>Messages or content shared within the community</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Contact & Account Information</h3>
                <p className="mb-2">If you contact us, sign up on our website, or use our services, we may collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your name</li>
                  <li>Email address</li>
                  <li>The content of your message or inquiry</li>
                  <li>Account or signup information submitted through our website</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Gaming & Account Information</h3>
                <p className="mb-2">To provide certain gaming-related features, events, verification systems, or services, we may collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Your in-game ID</li>
                  <li>Game server information</li>
                  <li>In-game username or profile details where applicable</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Bot & Economy Data</h3>
                <p className="mb-2">When using our bots or economy systems, we may store:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>WhatsApp ID or user ID</li>
                  <li>Economy statistics and progress</li>
                  <li>Command usage data</li>
                  <li>Registration information related to bot features</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Website & Usage Data</h3>
                <p className="mb-2">We may collect limited non-personal information such as:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Access times</li>
                  <li>Pages visited</li>
                  <li>Basic analytics or diagnostic data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">Your information may be used to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Manage and moderate the community</li>
              <li>Provide bot and economy features</li>
              <li>Verify gaming accounts or event participation</li>
              <li>Respond to support requests or inquiries</li>
              <li>Improve services, features, and user experience</li>
              <li>Communicate announcements, updates, or policy changes</li>
              <li>Maintain safety, security, and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Sharing</h2>
            <p className="mb-4">We do not sell, rent, or trade your personal information.</p>
            <p className="mb-4">We may only share information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>When required by law or legal process</li>
              <li>To protect the rights, safety, or property of the community and its users</li>
              <li>To prevent fraud, abuse, or security threats</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p>We take reasonable measures to protect your information from unauthorized access, misuse, loss, or disclosure. However, no online platform or communication system can guarantee complete security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Request access to the information we may hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p className="mt-4">To exercise these rights, please contact us through our official support channels.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. External Links</h2>
            <p>Our platforms may contain links to third-party websites or services, including social media platforms, forms, or external tools. We are not responsible for the privacy practices or content of those third-party services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Bot Registration & Economy Features</h2>
            <p className="mb-4">By registering or using any commands on our bots, you automatically agree to this Privacy Policy and the related terms below.</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Data Usage</h3>
                <p>The bot stores limited user data required for functionality, including economy progress, user identification data, and linked gaming information where applicable. This information is used solely to provide community and bot-related features.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Consent</h3>
                <p>Continued use of our bots, systems, or services indicates acceptance of this Privacy Policy and any future updates.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Experimental Features Disclaimer</h3>
                <p>Features released during testing or experimental phases are provided without guarantees. Data, progress, rewards, or economy balances gained or lost during these periods may be reset, modified, or removed without compensation.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Data Removal</h3>
                <p>Users may request deletion of their stored data. Please note that deleting your data may permanently reset your economy profile and related progress.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Policy Updates</h2>
            <p>This Privacy Policy may be updated or modified at any time. Updated versions will include a revised effective date. Continued use of the community and its services after updates means you accept the revised policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact the support team of DawnSphere Community through our official communication channels.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
