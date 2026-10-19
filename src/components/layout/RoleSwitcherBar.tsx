import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { UserRole } from '../../types';
import { ShieldCheck, UserCheck, Users, Building2, Crown, Globe, RotateCcw, ChevronUp, ChevronDown, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setCurrentRole, resetAllData } = usePlatform();
  const [isExpanded, setIsExpanded] = useState(false);

  const roles: { id: UserRole; title: string; subtitle: string; desc: string; icon: React.ReactNode; badge: string; color: string }[] = [
    {
      id: 'public',
      title: 'Public Discovery (New Student)',
      subtitle: 'Searching for a new place to stay',
      desc: 'Explore map, filter verified hostels, view mess menu & book',
      icon: <Globe className="w-4 h-4" />,
      badge: 'Active Landing View',
      color: 'border-blue-500 bg-blue-50/50 text-blue-900',
    },
    {
      id: 'student',
      title: 'Enrolled Resident Student',
      subtitle: 'Aarav Shrestha (Room 101)',
      desc: 'Pay monthly rent via eSewa, view receipts, log complaints, request leave',
      icon: <UserCheck className="w-4 h-4" />,
      badge: 'Resident Portal',
      color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900',
    },
    {
      id: 'parent',
      title: 'Parent / Guardian',
      subtitle: 'Rameshwor Shrestha',
      desc: 'Read-only view of ward fee dues, leave status & direct warden chat',
      icon: <Users className="w-4 h-4" />,
      badge: 'Parent Portal',
      color: 'border-indigo-500 bg-indigo-50/50 text-indigo-900',
    },
    {
      id: 'warden',
      title: 'Branch Warden (Operations)',
      subtitle: 'Keshav Raj Joshi (New Baneshwor)',
      desc: 'Manage rooms, capacity limits, fee ledger, attendance & visitors',
      icon: <Building2 className="w-4 h-4" />,
      badge: 'Operations Console',
      color: 'border-amber-500 bg-amber-50/50 text-amber-900',
    },
    {
      id: 'owner',
      title: 'Multi-Branch Hostel Owner',
      subtitle: 'Rajendra Sharma (3 Branches)',
      desc: 'Portfolio analytics across Kathmandu, Lalitpur & Pokhara',
      icon: <Crown className="w-4 h-4" />,
      badge: 'Owner Console',
      color: 'border-purple-500 bg-purple-50/50 text-purple-900',
    },
    {
      id: 'nha',
      title: 'Nepal Hostel Association (NHA)',
      subtitle: 'Central Regulatory Secretariat',
      desc: 'National accreditation, branch certification, suspension & escalations',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'Regulatory Board',
      color: 'border-rose-500 bg-rose-50/50 text-rose-900',
    },
  ];

  const currentRoleObj = roles.find((r) => r.id === currentRole) || roles[0];

  return (
    <>
      {/* Floating Discreet Control Pill (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-50 print:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 bg-slate-900/95 hover:bg-slate-900 text-white px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700/80 backdrop-blur-md transition-all duration-200 hover:scale-105"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <Layers className="w-3.5 h-3.5 text-blue-300" />
          <span className="text-xs font-bold">
            Demo Persona: <span className="text-blue-300">{currentRoleObj.title.split(' ')[0]}</span>
          </span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Popover Persona Switcher Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-start sm:p-6 bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  SRS v2.0 Actor Persona Switcher
                </h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold px-2 py-1 rounded-lg"
              >
                Close ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select an actor perspective to test specific functional modules outlined in the SRS specification:
            </p>

            <div className="space-y-2">
              {roles.map((r) => {
                const isSelected = currentRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setCurrentRole(r.id);
                      setIsExpanded(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      isSelected
                        ? `${r.color} ring-2 ring-blue-500/30 shadow-sm font-semibold`
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs flex-shrink-0 mt-0.5">
                      {r.icon}
                    </div>

                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 text-xs">{r.title}</strong>
                        {isSelected && (
                          <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">{r.subtitle}</span>
                      <p className="text-[11px] text-slate-600 mt-1">{r.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  if (confirm('Reset all demo state to fresh initial data?')) {
                    resetAllData();
                    setIsExpanded(false);
                  }
                }}
                className="flex items-center space-x-1.5 text-slate-500 hover:text-rose-600 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
