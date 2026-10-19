import React, { useState } from 'react';
import {
  User,
  CreditCard,
  AlertTriangle,
  Calendar,
  Coffee,
  ArrowRightLeft,
  Star,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Plus,
  Send,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { FeeRecord, RoomType } from '../types';
import { PaymentGatewayModal } from '../components/common/PaymentGatewayModal';
import { ReceiptModal } from '../components/common/ReceiptModal';

export const StudentPortalPage: React.FC = () => {
  const {
    students,
    activeStudentId,
    fees,
    complaints,
    leaves,
    transfers,
    branches,
    messMenus,
    payFee,
    addComplaint,
    escalateComplaintToNha,
    submitLeaveRequest,
    submitTransfer,
    startOrGetChatThread,
    sendChatMessage,
    chatThreads,
  } = usePlatform();

  const student = students.find((s) => s.id === activeStudentId) || students[0];
  const branch = branches.find((b) => b.id === student.branchId) || branches[0];
  const studentFees = fees.filter((f) => f.studentId === student.id);
  const studentComplaints = complaints.filter((c) => c.studentId === student.id);
  const studentLeaves = leaves.filter((l) => l.studentId === student.id);
  const studentTransfers = transfers.filter((t) => t.studentId === student.id);
  const mess = messMenus[student.branchId] || messMenus['branch-ktm-1'];

  const [activeTab, setActiveTab] = useState<
    'overview' | 'fees' | 'complaints' | 'leaves' | 'transfer' | 'mess' | 'chat'
  >('overview');

  // Payment Gateway
  const [payingFee, setPayingFee] = useState<FeeRecord | null>(null);
  const [receiptFee, setReceiptFee] = useState<FeeRecord | null>(null);

  // New Complaint
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState<any>('Internet/Wi-Fi');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintPriority, setComplaintPriority] = useState<any>('Medium');

  // New Leave
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveType, setLeaveType] = useState<any>('Home Visit');
  const [fromDate, setFromDate] = useState('2026-10-23 08:00');
  const [toDate, setToDate] = useState('2026-10-27 18:00');
  const [leaveReason, setLeaveReason] = useState('');
  const [destination, setDestination] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState(student.guardianPhone);

  // Transfer Request (FR-B10.1)
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [targetBranchId, setTargetBranchId] = useState(
    branches.find((b) => b.id !== student.branchId)?.id || branches[1]?.id
  );
  const [transferRoomType, setTransferRoomType] = useState<RoomType>('double');
  const [transferReason, setTransferReason] = useState('');

  // Chat input
  const [chatInput, setChatInput] = useState('');

  const targetThreadId = startOrGetChatThread(student.branchId, `${student.fullName} (Room ${student.roomNumber})`, 'resident');
  const studentChatThread = chatThreads.find((t) => t.id === targetThreadId);

  const pendingDues = studentFees
    .filter((f) => f.status === 'due' || f.status === 'partial')
    .reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);

  const handlePaySuccess = (gateway: 'eSewa' | 'Khalti' | 'ConnectIPS', txnRef: string) => {
    if (payingFee) {
      payFee(payingFee.id, gateway, txnRef);
      const updatedFee: FeeRecord = {
        ...payingFee,
        paidAmount: payingFee.totalAmount,
        status: 'paid',
        paymentGateway: gateway,
        transactionRef: txnRef,
        paidDate: new Date().toISOString().substring(0, 10),
      };
      setPayingFee(null);
      setReceiptFee(updatedFee);
    }
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle.trim()) return;

    addComplaint({
      branchId: student.branchId,
      branchName: student.branchName,
      studentId: student.id,
      studentName: student.fullName,
      roomNumber: student.roomNumber,
      category: complaintCategory,
      title: complaintTitle.trim(),
      description: complaintDesc.trim(),
      priority: complaintPriority,
    });

    setShowComplaintForm(false);
    setComplaintTitle('');
    setComplaintDesc('');
  };

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;

    submitLeaveRequest({
      branchId: student.branchId,
      studentId: student.id,
      studentName: student.fullName,
      roomNumber: student.roomNumber,
      leaveType,
      fromDateTime: fromDate,
      toDateTime: toDate,
      reason: leaveReason.trim(),
      destination: destination.trim() || student.homeAddress,
      emergencyPhone,
      parentConsentConfirmed: false,
    });

    setShowLeaveForm(false);
    setLeaveReason('');
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBranch = branches.find((b) => b.id === targetBranchId);
    if (!targetBranch) return;

    submitTransfer({
      studentId: student.id,
      studentName: student.fullName,
      currentBranchId: student.branchId,
      currentBranchName: student.branchName,
      targetBranchId: targetBranch.id,
      targetBranchName: targetBranch.name,
      roomType: transferRoomType,
      reason: transferReason.trim(),
    });

    setShowTransferForm(false);
    setTransferReason('');
    alert('Branch transfer application submitted to both branch wardens!');
  };

  const handleSendStudentChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !studentChatThread) return;
    sendChatMessage(studentChatThread.id, chatInput.trim(), 'student', `${student.fullName} (Room ${student.roomNumber})`);
    setChatInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Student Profile Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={student.avatarUrl}
            alt={student.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-900 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                ID: {student.studentId}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active Resident</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {student.fullName}
            </h1>
            <p className="text-xs text-slate-500">
              {student.branchName} • <strong>Room {student.roomNumber} (Bed {student.bedNumber})</strong> • {student.collegeOrWork}
            </p>
          </div>
        </div>

        {/* Quick Outstanding Dues Pill */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right min-w-[200px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Fee Balance</span>
          <span className={`text-2xl font-black ${pendingDues > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            Rs. {pendingDues.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block">
            {pendingDues > 0 ? 'Due for Ashwin 2083' : 'All Clear / Paid'}
          </span>
        </div>
      </div>

      {/* Student Portal Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1 text-xs font-bold">
        {[
          { id: 'overview', label: 'My Room & Stay', icon: User },
          { id: 'fees', label: 'Fee Invoices & Payments', icon: CreditCard },
          { id: 'complaints', label: 'Support & Complaints', icon: AlertTriangle },
          { id: 'leaves', label: 'Outing / Leave Passes', icon: Calendar },
          { id: 'transfer', label: 'Branch Transfer Request', icon: ArrowRightLeft },
          { id: 'mess', label: 'Today’s Mess Menu', icon: Coffee },
          { id: 'chat', label: 'Chat with Warden', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: My Room & Stay */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Hostel Allotment Record</h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Hostel Property</span>
                <strong className="text-slate-900 text-sm">{student.branchName}</strong>
                <p className="text-slate-500 mt-1">{branch.area}, {branch.city}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Room Assigned</span>
                <strong className="text-slate-900 text-sm">Room {student.roomNumber} (Bed {student.bedNumber})</strong>
                <p className="text-slate-500 mt-1 capitalize">{student.roomType} Sharing</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Registered Guardian</span>
                <strong className="text-slate-900 text-sm">{student.guardianName} ({student.guardianRelation})</strong>
                <p className="text-slate-500 mt-1">{student.guardianPhone}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Permanent Address</span>
                <strong className="text-slate-900 text-sm">{student.homeAddress}</strong>
                <p className="text-slate-500 mt-1">Enrolled: {student.enrollmentDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Emergency Contacts</h3>
            <div className="text-xs space-y-2 text-slate-700">
              <div className="p-3 bg-blue-50 rounded-xl">
                <span className="font-bold text-blue-900 block">Warden Hotline</span>
                <span>{branch.wardenName}: {branch.wardenPhone}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900 block">Front Desk / Gate</span>
                <span>{branch.contactPhone}</span>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <span className="font-bold text-red-900 block">NHA Central SOS Hotline</span>
                <span>1660-01-HOSTEL (Toll Free)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Fee Invoices & Online Payment (FR-B3.2 & FR-B3.3) */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">My Fee Invoices & Receipts</h3>
            <p className="text-xs text-slate-500">
              Pay hostel dues instantly via eSewa, Khalti, or connectIPS and download official NHA receipts.
            </p>
          </div>

          <div className="space-y-4">
            {studentFees.map((fee) => (
              <div
                key={fee.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                      {fee.invoiceNumber}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{fee.month}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        fee.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {fee.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Rent: Rs. {fee.roomRent.toLocaleString()}</span>
                    <span>Mess: Rs. {fee.messFee.toLocaleString()}</span>
                    <span>Utilities: Rs. {fee.utilitiesFee.toLocaleString()}</span>
                    <span>Due Date: {fee.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Amount</span>
                    <span className="text-lg font-black text-slate-900">
                      Rs. {fee.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  {fee.status !== 'paid' ? (
                    <button
                      onClick={() => setPayingFee(fee)}
                      className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
                    >
                      Pay Online via eSewa / Khalti
                    </button>
                  ) : (
                    <button
                      onClick={() => setReceiptFee(fee)}
                      className="px-4 py-2.5 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Download Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Support & Complaints (FR-B5.1, FR-B5.4) */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Complaints & Maintenance Tickets</h3>
              <p className="text-xs text-slate-500">
                Rule FR-B5.4: Unresolved complaints can be escalated directly to NHA central grievance board.
              </p>
            </div>
            <button
              onClick={() => setShowComplaintForm(true)}
              className="px-4 py-2 bg-blue-900 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log New Complaint (FR-B5.1)</span>
            </button>
          </div>

          <div className="space-y-4">
            {studentComplaints.map((comp) => (
              <div
                key={comp.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                      {comp.trackingCode}
                    </span>
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {comp.category}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Priority: {comp.priority}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      comp.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : comp.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{comp.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{comp.description}</p>
                </div>

                {comp.resolutionNotes && (
                  <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 text-slate-700">
                    <strong>Warden Note:</strong> {comp.resolutionNotes}
                  </div>
                )}

                {comp.isEscalatedToNha ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 font-semibold flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-rose-700" />
                    <span>Escalated to NHA Central Board on {comp.escalatedAt}</span>
                  </div>
                ) : (
                  comp.status !== 'Resolved' && (
                    <button
                      onClick={() => {
                        if (confirm('Escalate this unresolved issue directly to the Nepal Hostel Association?')) {
                          escalateComplaintToNha(comp.id, 'Escalated by resident student Aarav Shrestha due to delay in plumbing repair.');
                        }
                      }}
                      className="text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline"
                    >
                      ⚠️ Still unresolved? Click here to escalate to NHA Central Board (FR-B5.4)
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Leave Applications (FR-B6.1) */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Outing & Leave Applications</h3>
              <p className="text-xs text-slate-500">Apply for day outing, night out, or holiday home visits.</p>
            </div>
            <button
              onClick={() => setShowLeaveForm(true)}
              className="px-4 py-2 bg-blue-900 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for Leave (FR-B6.1)</span>
            </button>
          </div>

          <div className="space-y-4">
            {studentLeaves.map((l) => (
              <div key={l.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{l.leaveType}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      l.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : l.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
                <div><strong>Dates:</strong> {l.fromDateTime} to {l.toDateTime}</div>
                <div><strong>Reason:</strong> {l.reason}</div>
                <div><strong>Destination:</strong> {l.destination}</div>
                {l.wardenRemarks && (
                  <div className="p-2 bg-white rounded-lg border border-slate-200 mt-2">
                    <strong>Warden Remarks:</strong> {l.wardenRemarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Branch Transfer Request (FR-B10.1) */}
      {activeTab === 'transfer' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Inter-Branch Transfer Request (FR-B10.1)</h3>
              <p className="text-xs text-slate-500">
                Seamlessly transfer your deposit and student record to any other NHA member branch.
              </p>
            </div>
            <button
              onClick={() => setShowTransferForm(true)}
              className="px-4 py-2 bg-blue-900 text-white font-bold rounded-xl text-xs"
            >
              + Submit Transfer Request
            </button>
          </div>

          <div className="space-y-4">
            {studentTransfers.map((trf) => (
              <div key={trf.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    From {trf.currentBranchName} ➔ {trf.targetBranchName}
                  </span>
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">
                    {trf.status}
                  </span>
                </div>
                <p className="text-slate-600">Reason: {trf.reason}</p>
                {trf.adminNotes && (
                  <p className="text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                    Admin Note: {trf.adminNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Mess Menu */}
      {activeTab === 'mess' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Weekly Mess Meal Timetable</h3>
          <p className="text-xs text-slate-500">Breakfast: 7:00-8:30 AM | Lunch: 9:30-11:00 AM | Snacks: 4:30-6:00 PM | Dinner: 7:45-9:00 PM</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-2">
            {Object.entries(mess.weeklySchedule).slice(0, 4).map(([day, meals]) => (
              <div key={day} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <strong className="text-blue-900 font-bold text-sm block mb-1">{day}</strong>
                <div><span className="text-slate-400 font-semibold">Lunch:</span> {meals.lunch}</div>
                <div><span className="text-slate-400 font-semibold">Dinner:</span> {meals.dinner}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Chat with Warden (FR-B9.1) */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">Direct Chat with Branch Warden</h3>
          <p className="text-xs text-slate-500">Contact Warden {branch.wardenName} for room questions or assistance.</p>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 h-64 overflow-y-auto space-y-2 text-xs">
            {studentChatThread?.messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl max-w-[80%] ${
                  m.senderRole === 'student'
                    ? 'ml-auto bg-blue-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                <span className="text-[10px] block opacity-75 font-semibold">{m.senderName}</span>
                <p>{m.text}</p>
                <span className="text-[9px] block text-right font-mono mt-1 opacity-70">{m.timestamp}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendStudentChat} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Message your warden..."
              className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Modal: New Complaint */}
      {showComplaintForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Log Maintenance Complaint (FR-B5.1)</h3>

            <form onSubmit={handleCreateComplaint} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  <option value="Plumbing">Plumbing (Hot water, Tap leak, Geyser)</option>
                  <option value="Electrical">Electrical (Power backup, Socket, Light)</option>
                  <option value="Mess/Food">Mess / Food Quality</option>
                  <option value="Internet/Wi-Fi">Internet / Wi-Fi Router</option>
                  <option value="Cleanliness">Room & Toilet Cleanliness</option>
                  <option value="Security/Discipline">Security & Noise</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Title</label>
                <input
                  type="text"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  placeholder="e.g. Bathroom geyser not heating water"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Describe when the issue occurs..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-bold rounded-xl"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Leave */}
      {showLeaveForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Apply for Leave / Outing Pass (FR-B6.1)</h3>

            <form onSubmit={handleCreateLeave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="Home Visit">Home Visit (Festival/Holiday)</option>
                    <option value="Night Out">Night Out (Study)</option>
                    <option value="Day Outing">Day Outing</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Phone</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">From Date/Time</label>
                  <input
                    type="text"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Return Date/Time</label>
                  <input
                    type="text"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Address</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Hetauda-4, Makwanpur"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Leave</label>
                <textarea
                  rows={2}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Specific purpose for leave..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className="px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-bold rounded-xl"
                >
                  Submit Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer Request */}
      {showTransferForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Request Branch Transfer (FR-B10.1)</h3>

            <form onSubmit={handleCreateTransfer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target NHA Branch</label>
                <select
                  value={targetBranchId}
                  onChange={(e) => setTargetBranchId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  {branches.filter((b) => b.id !== student.branchId).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Room Type</label>
                <select
                  value={transferRoomType}
                  onChange={(e) => setTransferRoomType(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  <option value="single">Single Room</option>
                  <option value="double">Double Sharing</option>
                  <option value="triple">Triple Sharing</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Transfer</label>
                <textarea
                  rows={3}
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="e.g. My internship location changed to Pulchowk..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferForm(false)}
                  className="px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white font-bold rounded-xl"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {payingFee && (
        <PaymentGatewayModal
          isOpen={!!payingFee}
          onClose={() => setPayingFee(null)}
          onSuccess={handlePaySuccess}
          title="Hostel Monthly Fee Payment"
          amount={payingFee.totalAmount - payingFee.paidAmount}
          itemDescription={`${student.branchName} - ${payingFee.month} Monthly Fee Invoice`}
        />
      )}

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={!!receiptFee}
        onClose={() => setReceiptFee(null)}
        fee={receiptFee}
      />
    </div>
  );
};
