import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { UserRole } from '../../types';
import { ShieldCheck, UserCheck, Users, Building2, Crown, Globe, RotateCcw, Sparkles } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setCurrentRole, resetAllData } = usePlatform();

  const roles: { id: UserRole; label: string; roleTag: string; icon: React.ReactNode; desc: string; activeColor: string }[] = [
    {
      id: 'public',
      label: 'Prospective Student',
      roleTag: 'Public Discovery',
      desc: 'Map search, profiles, chat & online booking',
      icon: <Globe className="w-3.5 h-3.5" />,
      activeColor: 'bg-blue-600 text-white shadow-blue-500/25',
    },
    {
      id: 'student',
      label: 'Resident Student',
      roleTag: 'Aarav Shrestha',
      desc: 'Room 101, fee payments, complaints & leave',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      activeColor: 'bg-emerald-600 text-white shadow-emerald-500/25',
    },
    {
      id: 'parent',
      label: 'Parent / Guardian',
      roleTag: 'Rameshwor Shrestha',
      desc: 'Read-only fee dues, status & warden chat',
      icon: <Users className="w-3.5 h-3.5" />,
      activeColor: 'bg-indigo-600 text-white shadow-indigo-500/25',
    },
    {
      id: 'warden',
      label: 'Branch Warden',
      roleTag: 'Keshav Sir (Admin)',
      desc: 'Day-to-day operations, rooms, fees & attendance',
      icon: <Building2 className="w-3.5 h-3.5" />,
      activeColor: 'bg-amber-600 text-white shadow-amber-500/25',
    },
    {
      id: 'owner',
      label: 'Hostel Owner',
      roleTag: 'Rajendra Sharma',
      desc: 'Portfolio dashboard across 3 branches',
      icon: <Crown className="w-3.5 h-3.5" />,
      activeColor: 'bg-purple-600 text-white shadow-purple-500/25',
    },
    {
      id: 'nha',
      label: 'Nepal Hostel Association',
      roleTag: 'Apex Regulatory',
      desc: 'Accreditation, certification & grievance cell',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      activeColor: 'bg-rose-700 text-white shadow-rose-500/25',
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-200 border-b border-slate-800/80 px-4 py-2 sticky top-0 z-50 backdrop-blur-md bg-opacity-95 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center space-x-1">
            <span>SRS v2.0 Actor Persona:</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none">
          {roles.map((r) => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={`group flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 relative whitespace-nowrap ${
                  isActive
                    ? `${r.activeColor} shadow-md scale-[1.02] ring-1 ring-white/20 font-bold`
                    : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800'
                }`}
                title={r.desc}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}>
                  {r.icon}
                </span>
                <span>{r.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono hidden sm:inline ${
                    isActive ? 'bg-black/25 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {r.roleTag}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (confirm('Reset all demo state back to initial Nepal Hostel Association seed records?')) {
                resetAllData();
              }
            }}
            className="flex items-center space-x-1.5 text-[11px] text-slate-400 hover:text-white px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Reset to fresh demo data"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
