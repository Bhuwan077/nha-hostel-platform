import React, { useState } from 'react';
import { Building, ShieldCheck, Heart, Bell, MessageSquare, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface NavbarProps {
  onOpenWishlist: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWishlist, onOpenChat }) => {
  const { wishlist, notices, currentRole, chatThreads } = usePlatform();
  const [showNoticesDropdown, setShowNoticesDropdown] = useState(false);

  const unreadChats = chatThreads.reduce((sum, th) => sum + th.unreadCount, 0);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-10 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-700 text-white flex items-center justify-center shadow-md">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-slate-900 tracking-tight text-lg">
                NHA
              </span>
              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                NEPAL
              </span>
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                | नेपाल होस्टेल संघ
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-none">
              Central Hostel Management & Discovery Platform
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-3">
          {/* Wishlist Pill */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors"
            title="Saved Hostels"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Notices Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNoticesDropdown(!showNoticesDropdown)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors relative"
              title="Official NHA Circulars & Notices"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {notices.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-600 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
              )}
            </button>

            {showNoticesDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Official Announcements & Notices
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">NHA Broadcast</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2 text-xs">
                  {notices.map((n) => (
                    <div key={n.id} className="py-2.5 space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            n.priority === 'urgent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {n.scope}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.date}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs leading-snug">{n.title}</h5>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Drawer Toggle */}
          <button
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Support Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
