import React, { useState } from 'react';
import { Building, ShieldCheck, Heart, Bell, MessageSquare, ChevronDown, Check, Sparkles, User } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface NavbarProps {
  onOpenWishlist: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWishlist, onOpenChat }) => {
  const { wishlist, notices, currentRole, chatThreads, students, activeStudentId } = usePlatform();
  const [showNoticesDropdown, setShowNoticesDropdown] = useState(false);

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const urgentNoticeCount = notices.filter((n) => n.priority === 'urgent').length;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-[41px] z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-950 via-blue-900 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-950/20 ring-1 ring-white/20">
            <Building className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-slate-950 tracking-tight text-lg">
                NHA
              </span>
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md tracking-wider uppercase shadow-xs">
                NEPAL
              </span>
              <span className="text-xs text-slate-400 font-semibold hidden md:inline">
                | नेपाल होस्टेल संघ
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
              Hostel Management & Discovery Platform
            </p>
          </div>
        </div>

        {/* Center: Current Persona Indicator Pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-500 font-medium">Viewing Mode:</span>
          <strong className="text-slate-900 capitalize">
            {currentRole === 'public'
              ? 'Public Discovery & Booking'
              : currentRole === 'student'
              ? `Resident Portal (${currentStudent.fullName})`
              : currentRole === 'parent'
              ? 'Parent / Guardian Portal'
              : currentRole === 'warden'
              ? 'Branch Operations Console'
              : currentRole === 'owner'
              ? 'Hostel Owner Portfolio'
              : 'NHA Central Regulatory Board'}
          </strong>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-2.5">
          {/* Wishlist Pill */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-all hover:border-slate-300"
            title="Saved Hostels"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Notices Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNoticesDropdown(!showNoticesDropdown)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-all hover:border-slate-300 relative"
              title="Official NHA Circulars & Notices"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {notices.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 absolute top-1 right-1 ring-2 ring-white animate-pulse"></span>
              )}
            </button>

            {showNoticesDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-blue-900" />
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                      Official NHA Notices & Circulars
                    </h4>
                  </div>
                  {urgentNoticeCount > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                      {urgentNoticeCount} Urgent
                    </span>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2 text-xs">
                  {notices.map((n) => (
                    <div key={n.id} className="py-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md ${
                            n.priority === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {n.scope} Notice
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs leading-snug">{n.title}</h5>
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
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold transition-all shadow-md shadow-blue-950/20"
          >
            <MessageSquare className="w-4 h-4 text-blue-300" />
            <span className="hidden sm:inline">Support Chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
