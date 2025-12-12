"use client";

import Link from "next/link";
import { FaPlusCircle, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-300 mt-20">
      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10 text-center md:text-left">
        
        {/* Left - Brand */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-3">Eventora</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Discover, create, and experience events that bring people together.
            Join the Eventora community today and make your event shine.
          </p>
          <div className="flex justify-center md:justify-start gap-4 mt-5">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter className="text-gray-400 hover:text-white transition" size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="text-gray-400 hover:text-white transition" size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin className="text-gray-400 hover:text-white transition" size={20} />
            </a>
          </div>
        </div>

        {/* Middle - CTA */}
        <div className="flex flex-col justify-center items-center text-center">
          <h3 className="text-2xl font-semibold text-white mb-3">Got an Event to Host?</h3>
          <p className="text-gray-400 mb-6 max-w-xs">
            List your event on Eventora and reach thousands of attendees instantly.
          </p>
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-blue-700/30 transition-all hover:scale-105"
          >
            <FaPlusCircle className="text-white text-xl" />
            List Your Event
          </Link>
        </div>

        {/* Right - Contact */}
        <div className="text-center md:text-right">
          <h4 className="text-white font-semibold mb-3 text-lg">Contact Us</h4>
          <p className="text-gray-400 text-sm">📧 support@eventora.com</p>
          <p className="text-gray-400 text-sm">📞 +91 98765 43210</p>
          <p className="text-gray-400 text-sm">📍 Chennai, India</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        © {currentYear} <span className="font-semibold text-white">Eventora</span> — All rights reserved.
      </div>
    </footer>
  );
}
