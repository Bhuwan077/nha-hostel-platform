import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import {
  Crown,
  Building,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Download,
  Filter,
  Users,
  CheckCircle2,
  Calendar,
  Send,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const OwnerConsolePage: React.FC = () => {
  const {
    owners,
    activeOwnerId,
    branches,
    students,
    fees,
    complaints,
    rooms,
    postNotice,
  } = usePlatform();

  const owner = owners.find((o) => o.id === activeOwnerId) || owners[0];

  // Strictly filter only branches owned by this owner (FR-C1.5)
  const myBranches = branches.filter((b) => owner.branchIds.includes(b.id));

  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('current_month');

  // Broadcast notice form (FR-B8.2)
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeSent, setNoticeSent] = useState(false);

  // Active branches in scope
  const scopedBranches =
    selectedBranchFilter === 'all'
      ? myBranches
      : myBranches.filter((b) => b.id === selectedBranchFilter);

  const scopedBranchIds = scopedBranches.map((b) => b.id);
  const scopedStudents = students.filter((s) => scopedBranchIds.includes(s.branchId) && s.status !== 'archived');
  const scopedFees = fees.filter((f) => scopedBranchIds.includes(f.branchId));
  const scopedComplaints = complaints.filter((c) => scopedBranchIds.includes(c.branchId));

  // Cross-branch aggregates (FR-C1.1 & FR-C1.2)
  const totalCapacity = scopedBranches.reduce((sum, b) => sum + b.totalBeds, 0);
  const totalOccupied = scopedStudents.length;
  const overallOccupancyPct = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const totalCollectedRevenue = scopedFees
    .filter((f) => f.status === 'paid' || f.status === 'partial')
    .reduce((sum, f) => sum + f.paidAmount, 0);

  const totalPendingDues = scopedFees
    .filter((f) => f.status === 'due' || f.status === 'partial')
    .reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);

  const totalComplaints = scopedComplaints.length;
  const resolvedComplaints = scopedComplaints.filter((c) => c.status === 'Resolved').length;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    postNotice({
      scope: 'owner',
      ownerId: owner.id,
      author: owner.fullName,
      authorRole: 'Hostel Owner / Director',
      title: noticeTitle.trim(),
      content: noticeBody.trim(),
      priority: 'important',
      targetAudience: 'students',
    });

    setNoticeSent(true);
    setNoticeTitle('');
    setNoticeBody('');
    setTimeout(() => setNoticeSent(false), 3000);
  };

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg w-max mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>Hostel Owner Multi-Branch Console (FR-C1.5 Enforced)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {owner.businessName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Director: <strong>{owner.fullName}</strong> • PAN: {owner.panNumber} • {myBranches.length} Properties Registered
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Executive Report (FR-C3.2)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (FR-C1.4) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">Filter Portfolio:</span>

          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl font-semibold bg-slate-50"
          >
            <option value="all">All My Branches Combined ({myBranches.length})</option>
            {myBranches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-medium">Reporting Cycle:</span>
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="p-2 border border-slate-300 rounded-xl font-semibold bg-slate-50"
          >
            <option value="current_month">Ashwin 2083 (Current Month)</option>
            <option value="last_quarter">Q2 2083 (Past 3 Months)</option>
            <option value="annual">Fiscal Year 2082/83</option>
          </select>
        </div>
      </div>

      {/* Top 4 Cross-Branch Aggregated Metric Cards (FR-C1.1 & FR-C1.2) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Combined Occupancy
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{overallOccupancyPct}%</span>
            <span className="text-xs text-slate-500">
              ({totalOccupied}/{totalCapacity} beds)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full" style={{ width: `${overallOccupancyPct}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Monthly Collected Revenue
          </span>
          <div className="text-3xl font-black text-emerald-700">
            Rs. {totalCollectedRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Reconciled via eSewa & Khalti</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Combined Pending Dues
          </span>
          <div className="text-3xl font-black text-amber-700">
            Rs. {totalPendingDues.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-800 font-semibold">Across active branches</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Complaint Resolution Rate
          </span>
          <div className="text-3xl font-black text-blue-900">
            {totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100}%
          </div>
          <span className="text-[11px] text-slate-500">
            {resolvedComplaints} of {totalComplaints} tickets cleared
          </span>
        </div>
      </div>

      {/* Per-Branch Comparison Table (FR-C1.1, FR-C1.2, FR-C1.3) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">
            Branch-by-Branch Performance Comparison (FR-C1.1 - FR-C1.3)
          </h3>
          <p className="text-xs text-slate-500">
            Compare occupancy, revenue collection, and complaint volume between your physical properties.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-3">Branch Name</th>
                <th className="py-3 px-3">City / Area</th>
                <th className="py-3 px-3">Occupancy Rate</th>
                <th className="py-3 px-3">Revenue Paid</th>
                <th className="py-3 px-3">Outstanding Dues</th>
                <th className="py-3 px-3">Complaints (Open/Total)</th>
                <th className="py-3 px-3">NHA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scopedBranches.map((b) => {
                const bStudents = students.filter((s) => s.branchId === b.id && s.status !== 'archived');
                const bFees = fees.filter((f) => f.branchId === b.id);
                const bComplaints = complaints.filter((c) => c.branchId === b.id);

                const occPct = Math.round((bStudents.length / b.totalBeds) * 100);
                const collected = bFees
                  .filter((f) => f.status === 'paid' || f.status === 'partial')
                  .reduce((sum, f) => sum + f.paidAmount, 0);
                const dues = bFees
                  .filter((f) => f.status === 'due' || f.status === 'partial')
                  .reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);
                const openComp = bComplaints.filter((c) => c.status !== 'Resolved').length;

                return (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <strong className="text-slate-900">{b.name}</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">Warden: {b.wardenName}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{b.area}, {b.city}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{occPct}%</span>
                        <span className="text-[10px] text-slate-400">({bStudents.length}/{b.totalBeds})</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">Rs. {collected.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-amber-700">Rs. {dues.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${openComp > 0 ? 'text-rose-700' : 'text-slate-700'}`}>
                        {openComp} Open
                      </span>
                      <span className="text-slate-400 text-[10px]"> / {bComplaints.length} Total</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {b.verificationStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Notice Across All Branches (FR-B8.2) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">
            Broadcast Notice Across All Branches (FR-B8.2)
          </h3>
          <p className="text-xs text-slate-500">
            Publish organization-level policy announcements to all student resident dashboards simultaneously.
          </p>
        </div>

        {noticeSent && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Notice broadcasted successfully across all {myBranches.length} branch boards!</span>
          </div>
        )}

        <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notice Headline</label>
            <input
              type="text"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="e.g. Annual Student Festival & Cultural Night Announcement"
              className="w-full p-2.5 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notice Content</label>
            <textarea
              rows={3}
              value={noticeBody}
              onChange={(e) => setNoticeBody(e.target.value)}
              placeholder="Full circular for all enrolled scholars..."
              className="w-full p-2.5 rounded-xl border border-slate-300"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Across All Properties</span>
          </button>
        </form>
      </div>
    </div>
  );
};
