import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-gaming-dark to-gray-900 border-t border-purple-500 border-opacity-20 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold gradient-gaming mb-4">DSC-SA</h3>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition">Heroes</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Events</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Community</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Guides</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://discord.gg/5UJZcg6EuT" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">Discord</a></li>
              <li><a href="https://chat.whatsapp.com/DSTUcZnc5IIFJpq2w8oCqN" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">WhatsApp</a></li>
              <li><a href="https://x.com/DawnSphereC" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">X (Twitter)</a></li>
              <li><a href="https://www.instagram.com/dawnspherecommunity?igsh=cnZibmtocDRyaDh4" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">Instagram</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://www.tiktok.com/@dsc.sa?_r=1&_t=ZS-96DbA7k8WJt" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">TikTok</a></li>
              <li><a href="https://www.facebook.com/share/1Lf9eZfQZD/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">Facebook</a></li>
              <li><Link to="/privacy" className="hover:text-cyan-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-500 border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2026 DSC-SA Community. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-4 md:mt-0">Made with ❤️ for MLBB players</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
