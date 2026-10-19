import React, { useState } from 'react';
import { Building, ShieldCheck, Heart, Bell, MessageSquare, ChevronDown, User, LogIn, Sparkles, Phone, HelpCircle } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface NavbarProps {
  onOpenWishlist: () => void;
  onOpenChat: () => void;
  onNavigateHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWishlist, onOpenChat, onNavigateHome }) => {
  const { wishlist, notices, currentRole, setCurrentRole } = usePlatform();
  const [showPortalMenu, setShowPortalMenu] = useState(false);
  const [showNoticesDropdown, setShowNoticesDropdown] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={onNavigateHome}
          className="flex items-center space-x-3.5 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-950 via-blue-900 to-indigo-800 text-white flex items-center justify-center shadow-lg shadow-blue-950/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <Building className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-slate-950 tracking-tight text-xl">
                NHA
              </span>
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase shadow-xs">
                NEPAL
              </span>
              <span className="text-xs text-slate-400 font-semibold hidden md:inline">
                | नेपाल होस्टेल संघ
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-1">
              Official Student Hostel Discovery & Booking
            </p>
          </div>
        </div>

        {/* Center Nav Links (Public) */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold text-slate-600">
          <a
            href="#hubs"
            className="hover:text-blue-900 transition-colors"
          >
            College Hubs
          </a>
          <a
            href="#hostels-list"
            className="hover:text-blue-900 transition-colors"
          >
            Verified Hostels
          </a>
          <a
            href="#why-nha"
            className="hover:text-blue-900 transition-colors"
          >
            Why NHA Verified?
          </a>
          <a
            href="#faq"
            className="hover:text-blue-900 transition-colors"
          >
            Student Guidelines & FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-all"
            title="Saved Hostels"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Saved</span>
            {wishlist.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Help & Direct Warden Chat */}
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-all border border-blue-200/60"
            title="Ask Questions to Branch Warden"
          >
            <MessageSquare className="w-4 h-4 text-blue-700" />
            <span className="hidden sm:inline">Ask Warden</span>
          </button>

          {/* Portals Login Dropdown (Discreet) */}
          <div className="relative">
            <button
              onClick={() => setShowPortalMenu(!showPortalMenu)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shadow-slate-900/10"
            >
              <User className="w-4 h-4 text-slate-300" />
              <span>Portal Login</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showPortalMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                    Internal Operations Portals
                  </span>
                  <span className="text-slate-700 font-semibold text-[11px]">
                    Switch to Resident or Admin view:
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setCurrentRole('student');
                      setShowPortalMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 font-bold"
                  >
                    <span>🎓 Resident Student Portal</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono">Dues & Pass</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('parent');
                      setShowPortalMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 font-bold"
                  >
                    <span>👨‍👩‍👦 Parent / Guardian Portal</span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">Ward Status</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('warden');
                      setShowPortalMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 font-bold"
                  >
                    <span>🏢 Branch Warden Console</span>
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono">Operations</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('owner');
                      setShowPortalMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 font-bold"
                  >
                    <span>👑 Hostel Owner Dashboard</span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-mono">Cross-Branch</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('nha');
                      setShowPortalMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-800 font-bold"
                  >
                    <span>🏛️ NHA Association Console</span>
                    <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-mono">Accreditation</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 px-3 py-1">
                  <button
                    onClick={() => {
                      setCurrentRole('public');
                      setShowPortalMenu(false);
                    }}
                    className="text-blue-900 font-bold text-[11px] hover:underline"
                  >
                    ← Return to Public Discovery
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
