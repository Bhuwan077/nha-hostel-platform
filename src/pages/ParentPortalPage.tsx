import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { Users, CreditCard, ShieldCheck, Phone, CheckCircle2, MessageSquare, Send, Calendar, Clock } from 'lucide-react';
import { ReceiptModal } from '../components/common/ReceiptModal';
import { FeeRecord } from '../types';

export const ParentPortalPage: React.FC = () => {
  const { students, activeStudentId, fees, branches, leaves, sendChatMessage, chatThreads, startOrGetChatThread } = usePlatform();

  const student = students.find((s) => s.id === activeStudentId) || students[0];
  const branch = branches.find((b) => b.id === student.branchId) || branches[0];
  const studentFees = fees.filter((f) => f.studentId === student.id);
  const studentLeaves = leaves.filter((l) => l.studentId === student.id);

  const [selectedReceipt, setSelectedReceipt] = useState<FeeRecord | null>(null);
  const [parentMessage, setParentMessage] = useState('');

  const parentThreadId = startOrGetChatThread(branch.id, `${student.guardianName} (Parent of ${student.fullName})`, 'parent');
  const chatThread = chatThreads.find((t) => t.id === parentThreadId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMessage.trim() || !chatThread) return;
    sendChatMessage(
      chatThread.id,
      parentMessage.trim(),
      'parent',
      `${student.guardianName} (Parent)`
    );
    setParentMessage('');
  };

  const pendingDues = studentFees
    .filter((f) => f.status === 'due' || f.status === 'partial')
    .reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg w-max mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Parent & Guardian Oversight Portal (Read-Only)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Ward: {student.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enrolled at <strong>{branch.name}</strong> • Student ID: <code>{student.studentId}</code>
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right min-w-[200px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Ward Fee Dues</span>
          <span className={`text-2xl font-black ${pendingDues > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            Rs. {pendingDues.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block">Rule FR-B3.5 Enforced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Fees & Attendance (Read-Only) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fee Invoices (Read-Only) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Ward Fee Invoices & Payment History (FR-B3.5)</h3>
              <span className="text-xs text-slate-400 font-semibold">Strictly Read-Only Access</span>
            </div>

            <div className="space-y-3">
              {studentFees.map((fee) => (
                <div
                  key={fee.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-800">{fee.invoiceNumber}</span>
                    <span className="font-bold text-slate-900 ml-2">{fee.month}</span>
                    <div className="text-slate-500 mt-1">
                      Rent: Rs. {fee.roomRent.toLocaleString()} • Mess: Rs. {fee.messFee.toLocaleString()} • Status: <strong className="uppercase">{fee.status}</strong>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-base font-extrabold text-slate-900 block">
                      Rs. {fee.totalAmount.toLocaleString()}
                    </span>
                    {fee.status === 'paid' && (
                      <button
                        onClick={() => setSelectedReceipt(fee)}
                        className="text-[11px] font-bold text-blue-900 hover:underline"
                      >
                        Inspect Official Receipt
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outing & Attendance Verification */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Outing / Leave Logs & Parent Consent</h3>
            <div className="space-y-3 text-xs">
              {studentLeaves.map((l) => (
                <div key={l.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{l.leaveType}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${l.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {l.status}
                    </span>
                  </div>
                  <div>Period: {l.fromDateTime} to {l.toDateTime}</div>
                  <div>Destination: {l.destination}</div>
                  <div>Reason: {l.reason}</div>
                  <div className="text-emerald-700 font-semibold pt-1">
                    Parent Consent: {l.parentConsentConfirmed ? '✓ Confirmed by Warden Call' : 'Pending Verification Call'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Direct Messaging with Warden (FR-B9.2) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between h-[560px]">
          <div>
            <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-base mb-1">
              <MessageSquare className="w-5 h-5 text-blue-800" />
              <h3>Message Warden {branch.wardenName}</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Direct line between guardian and hostel warden (FR-B9.2).
            </p>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 h-[340px] overflow-y-auto space-y-2 text-xs">
              {chatThread?.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl max-w-[85%] ${
                    m.senderRole === 'parent'
                      ? 'ml-auto bg-indigo-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="text-[9px] block opacity-75 font-semibold">{m.senderName}</span>
                  <p>{m.text}</p>
                  <span className="text-[9px] block text-right font-mono mt-0.5 opacity-70">{m.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSend} className="flex gap-2 pt-3">
            <input
              type="text"
              value={parentMessage}
              onChange={(e) => setParentMessage(e.target.value)}
              placeholder="Inquire about ward's health, studies, curfew..."
              className="flex-1 p-2 rounded-xl border border-slate-300 text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-900 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        fee={selectedReceipt}
      />
    </div>
  );
};
