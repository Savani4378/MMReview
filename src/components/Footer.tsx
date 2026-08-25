import React from 'react';
import { Instagram, Facebook, MessageCircle, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070709] text-white pt-14 pb-8 px-4 border-t border-zinc-900 mt-20" role="contentinfo">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
        {/* Brand Title */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Meet <span className="text-[#38bdf8]">Mosaic</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-2 font-normal">
            Many Stories. One Mosaic.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Meet Mosaic on Instagram"
            className="w-10 h-10 rounded-full bg-[#16161a] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all shadow-sm"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Meet Mosaic on Facebook"
            className="w-10 h-10 rounded-full bg-[#16161a] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all shadow-sm"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/919426961627"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Meet Mosaic on WhatsApp"
            className="w-10 h-10 rounded-full bg-[#16161a] border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

        {/* Contact Information */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-1 text-sm sm:text-base">
          <a
            href="tel:+919426961627"
            className="flex items-center gap-2.5 text-zinc-200 hover:text-white transition-colors group font-normal"
          >
            <Phone className="w-4 h-4 text-[#38bdf8] group-hover:scale-110 transition-transform" />
            <span>+91 94269 61627</span>
          </a>
          <a
            href="mailto:help.meetmosaic@gmail.com"
            className="flex items-center gap-2.5 text-zinc-200 hover:text-white transition-colors group font-normal"
          >
            <Mail className="w-4 h-4 text-[#38bdf8] group-hover:scale-110 transition-transform" />
            <span>help.meetmosaic@gmail.com</span>
          </a>
        </div>

        {/* Subtle Divider */}
        <div className="w-full max-w-xl border-t border-zinc-800/80 my-3" />

        {/* Copyright */}
        <p className="text-[11px] sm:text-xs text-zinc-500 tracking-wider uppercase font-medium">
          &copy; 2026 MEET MOSAIC. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};
