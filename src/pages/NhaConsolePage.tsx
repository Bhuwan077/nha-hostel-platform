import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  Send,
  Download,
  Users,
  Search,
  Check,
  Ban,
  FileCheck,
} from 'lucide-react';

export const NhaConsolePage: React.FC = () => {
  const {
    branches,
    students,
    complaints,
    notices,
    verifyBranchByNha,
    suspendBranchByNha,
    updateComplaintStatus,
    postNotice,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'overview' | 'branches' | 'escalations' | 'circulars'>('overview');
  const [selectedBranchForInspection, setSelectedBranchForInspection] = useState<string | null>(null);

  // Circular broadcast state (FR-B8.3)
  const [circularTitle, setCircularTitle] = useState('');
  const [circularContent, setCircularContent] = useState('');
  const [circularPriority, setCircularPriority] = useState<'normal' | 'important' | 'urgent'>('urgent');
  const [circularBroadcasted, setCircularBroadcasted] = useState(false);

  // Association-wide metrics (FR-C2.3)
  const totalBranches = branches.length;
  const verifiedCount = branches.filter((b) => b.verificationStatus === 'verified').length;
  const unverifiedCount = branches.filter((b) => b.verificationStatus === 'unverified' || b.verificationStatus === 'pending').length;
  const suspendedCount = branches.filter((b) => b.verificationStatus === 'suspended').length;

  const totalBedsAcrossNepal = branches.reduce((sum, b) => sum + b.totalBeds, 0);
  const totalOccupiedBeds = students.filter((s) => s.status !== 'archived').length;
  const associationOccupancyPct = totalBedsAcrossNepal > 0 ? Math.round((totalOccupiedBeds / totalBedsAcrossNepal) * 100) : 0;

  // Escalated complaints queue (FR-C2.4 & FR-B5.5)
  const escalatedComplaints = complaints.filter((c) => c.isEscalatedToNha);

  const handleBroadcastCircular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!circularTitle.trim()) return;

    postNotice({
      scope: 'association',
      author: 'Nepal Hostel Association Central Executive Board',
      authorRole: 'NHA General Secretary',
      title: circularTitle.trim(),
      content: circularContent.trim(),
      priority: circularPriority,
      targetAudience: 'all',
    });

    setCircularBroadcasted(true);
    setCircularTitle('');
    setCircularContent('');
    setTimeout(() => setCircularBroadcasted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* NHA Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-rose-900/40">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center shadow-lg font-black text-white text-xl">
            NHA
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Official Regulatory Body
              </span>
              <span className="text-xs text-rose-300 font-semibold">Reg: Babar Mahal, Kathmandu</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
              Nepal Hostel Association — Central Oversight Console
            </h1>
            <p className="text-xs text-slate-300">
              National Accreditation, Branch Certification, Inspection Standards, and Student Grievances
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-white/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Association Audit Report</span>
          </button>
        </div>
      </div>

      {/* Association-wide Aggregated Metrics (FR-C2.3) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Registered Hostels
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{totalBranches}</span>
            <span className="text-xs text-slate-500">Affiliated Properties</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-emerald-700 font-bold">{verifiedCount} Verified</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-700 font-bold">{unverifiedCount} Pending</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            National Bed Inventory
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-blue-900">{totalBedsAcrossNepal}</span>
            <span className="text-xs text-slate-500">Total Capacity</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Kathmandu, Lalitpur, Pokhara, Bhaktapur
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Overall Occupancy Rate
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{associationOccupancyPct}%</span>
            <span className="text-xs text-slate-500 font-medium">
              ({totalOccupiedBeds} enrolled)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full" style={{ width: `${associationOccupancyPct}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            NHA Escalated Grievances
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-rose-700">{escalatedComplaints.length}</span>
            <span className="text-xs text-slate-500">In NHA Queue</span>
          </div>
          <span className="text-[11px] text-rose-600 font-bold">Requires NHA Compliance Notice</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1 text-xs font-bold">
        {[
          { id: 'branches', label: 'Member Hostels & Accreditation (FR-C2.1 & FR-C2.2)', icon: Building },
          { id: 'escalations', label: `Escalated Complaints Queue (${escalatedComplaints.length}) (FR-C2.4)`, icon: ShieldAlert },
          { id: 'circulars', label: 'Broadcast Association Circular (FR-B8.3)', icon: Send },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-rose-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Member Hostels & Verification / Suspension (FR-C2.1, FR-C2.2, FR-C2.5) */}
      {activeTab === 'branches' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Hostel Accreditation & Certification Registry
              </h3>
              <p className="text-xs text-slate-500">
                Rule FR-C2.1 & FR-C2.2: NHA verifies compliant branches or suspends delinquent properties.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Hostel Name & Code</th>
                  <th className="py-3 px-3">City / Area</th>
                  <th className="py-3 px-3">Operating Owner</th>
                  <th className="py-3 px-3">Capacity</th>
                  <th className="py-3 px-3">NHA Certificate #</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Regulatory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900">{b.name}</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">Code: {b.code}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{b.area}, {b.city}</td>
                    <td className="py-3 px-3 text-slate-800 font-medium">{b.ownerName}</td>
                    <td className="py-3 px-3">{b.totalBeds} Beds ({b.totalRooms} Rooms)</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{b.nhaRegNumber}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          b.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.verificationStatus === 'suspended'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {b.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => {
                            verifyBranchByNha(b.id);
                            alert(`NHA Certification Approved! Branch ${b.name} is now certified and badged.`);
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center space-x-1"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Certify / Verify (FR-C2.1)</span>
                        </button>
                      )}

                      {b.verificationStatus !== 'suspended' && (
                        <button
                          onClick={() => {
                            if (confirm(`Suspend / Delist ${b.name} from public discovery for non-compliance with NHA guidelines?`)) {
                              suspendBranchByNha(b.id);
                            }
                          }}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold inline-flex items-center space-x-1"
                          title="Suspend / Delist (FR-C2.2)"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Suspend</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Escalated Complaints Queue (FR-C2.4 & FR-B5.5) */}
      {activeTab === 'escalations' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Escalated Complaints & Grievance Cell (FR-C2.4)
            </h3>
            <p className="text-xs text-slate-500">
              Unresolved maintenance issues and welfare complaints escalated to the NHA National Grievance Committee.
            </p>
          </div>

          <div className="space-y-4">
            {escalatedComplaints.map((comp) => (
              <div
                key={comp.id}
                className="bg-rose-50/50 rounded-2xl border border-rose-200 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs bg-rose-100 text-rose-900 px-2 py-0.5 rounded">
                      {comp.trackingCode}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {comp.branchName}
                    </span>
                    <span className="text-xs text-slate-500">({comp.category})</span>
                  </div>

                  <span className="bg-rose-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase flex items-center space-x-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>NHA Active Investigation</span>
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{comp.title}</h4>
                  <p className="text-xs text-slate-700 mt-1">{comp.description}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Escalated on: {comp.escalatedAt} • Student: {comp.studentName} (Room {comp.roomNumber})
                  </span>
                </div>

                {comp.nhaRemarks && (
                  <div className="text-xs bg-white p-3 rounded-xl border border-rose-200 text-slate-800">
                    <strong className="text-rose-900">NHA Compliance Directive:</strong> {comp.nhaRemarks}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => {
                      const directive = prompt('Issue official NHA directive to branch warden:');
                      if (directive) {
                        updateComplaintStatus(comp.id, 'In Progress', `NHA Official Directive: ${directive}`);
                        alert('Directive dispatched to branch admin.');
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-900 text-white rounded-lg text-xs font-bold"
                  >
                    Issue Formal Warning / Notice
                  </button>

                  <button
                    onClick={() => {
                      updateComplaintStatus(comp.id, 'Resolved', 'Resolved following NHA committee inspection and vendor dispatch.');
                      alert('Complaint marked resolved by NHA.');
                    }}
                    className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
                  >
                    Mark Resolved by NHA
                  </button>
                </div>
              </div>
            ))}

            {escalatedComplaints.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                No active escalated complaints in the NHA queue.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Broadcast Association Circular (FR-B8.3) */}
      {activeTab === 'circulars' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Broadcast Association-Wide Circular (FR-B8.3)
            </h3>
            <p className="text-xs text-slate-500">
              Publish mandatory circulars, compliance standards, and health notices to all member hostels in Nepal.
            </p>
          </div>

          {circularBroadcasted && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>NHA Association circular published to all {branches.length} member hostels and student portals!</span>
            </div>
          )}

          <form onSubmit={handleBroadcastCircular} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Circular Subject</label>
              <input
                type="text"
                value={circularTitle}
                onChange={(e) => setCircularTitle(e.target.value)}
                placeholder="e.g. Standard Operating Procedure (SOP) for Winter Solar Water Heating Systems"
                className="w-full p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority Category</label>
                <select
                  value={circularPriority}
                  onChange={(e) => setCircularPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                >
                  <option value="urgent">Urgent Compliance (Immediate Action)</option>
                  <option value="important">Important Association Circular</option>
                  <option value="normal">General Information Notice</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Scope</label>
                <input
                  type="text"
                  value="All Nepal Member Branches, Wardens & Resident Portals"
                  disabled
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-medium text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Circular Directive Content</label>
              <textarea
                rows={4}
                value={circularContent}
                onChange={(e) => setCircularContent(e.target.value)}
                placeholder="Detailed association directive..."
                className="w-full p-2.5 rounded-xl border border-slate-300"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-950 hover:bg-rose-900 text-white font-bold rounded-xl text-xs flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Issue Nationwide Circular</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
