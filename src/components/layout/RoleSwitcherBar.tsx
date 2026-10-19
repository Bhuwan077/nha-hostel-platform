import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { UserRole } from '../../types';
import { ShieldCheck, UserCheck, Users, Building2, Crown, Globe, RotateCcw } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setCurrentRole, resetAllData } = usePlatform();

  const roles: { id: UserRole; label: string; icon: React.ReactNode; desc: string; badgeColor: string }[] = [
    {
      id: 'public',
      label: 'Prospective Student (Public)',
      desc: 'Map Discovery & Booking',
      icon: <Globe className="w-3.5 h-3.5" />,
      badgeColor: 'bg-blue-600',
    },
    {
      id: 'student',
      label: 'Resident Student',
      desc: 'Aarav (Room 101, Fees, Complaints)',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      badgeColor: 'bg-emerald-600',
    },
    {
      id: 'parent',
      label: 'Parent / Guardian',
      desc: 'Rameshwor (Read-only Dues)',
      icon: <Users className="w-3.5 h-3.5" />,
      badgeColor: 'bg-indigo-600',
    },
    {
      id: 'warden',
      label: 'Branch Warden',
      desc: 'Keshav Sir (Operations Console)',
      icon: <Building2 className="w-3.5 h-3.5" />,
      badgeColor: 'bg-amber-600',
    },
    {
      id: 'owner',
      label: 'Hostel Owner',
      desc: 'Rajendra Sharma (3 Branches Aggregated)',
      icon: <Crown className="w-3.5 h-3.5" />,
      badgeColor: 'bg-purple-600',
    },
    {
      id: 'nha',
      label: 'Nepal Hostel Association (NHA)',
      desc: 'Central Certification & Compliance',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      badgeColor: 'bg-rose-700',
    },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2 text-xs sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-slate-300">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            SRS v2.0 Role View:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5">
          {roles.map((r) => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs ${
                  isActive
                    ? `${r.badgeColor} text-white shadow-sm ring-2 ring-white/30 font-bold scale-[1.02]`
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                title={r.desc}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (confirm('Reset all demo data back to clean initial Nepal Hostel Association seeds?')) {
                resetAllData();
              }
            }}
            className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors"
            title="Reset Seed Data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
