import React, { useState } from 'react';
import {
  Users,
  Bed,
  CreditCard,
  CheckSquare,
  AlertTriangle,
  Calendar,
  Coffee,
  Bell,
  MessageSquare,
  ArrowRightLeft,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  ShieldAlert,
  Clock,
  UserCheck,
  Building,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { RoomType, RoomRecord, FeeRecord } from '../types';
import { ReceiptModal } from '../components/common/ReceiptModal';

export const BranchAdminPage: React.FC = () => {
  const {
    branches,
    activeBranchId,
    setActiveBranchId,
    rooms,
    students,
    fees,
    complaints,
    leaves,
    visitors,
    notices,
    bookings,
    transfers,
    addStudent,
    archiveStudent,
    allocateRoom,
    payFee,
    addFeeInvoice,
    updateComplaintStatus,
    escalateComplaintToNha,
    updateLeaveStatus,
    addVisitor,
    checkoutVisitor,
    postNotice,
    updateBookingStatus,
    updateTransferStatus,
    chatThreads,
    sendChatMessage,
  } = usePlatform();

  const branch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const branchRooms = rooms.filter((r) => r.branchId === branch.id);
  const branchStudents = students.filter((s) => s.branchId === branch.id && s.status !== 'archived');
  const branchFees = fees.filter((f) => f.branchId === branch.id);
  const branchComplaints = complaints.filter((c) => c.branchId === branch.id);
  const branchLeaves = leaves.filter((l) => l.branchId === branch.id);
  const branchVisitors = visitors.filter((v) => v.branchId === branch.id);
  const branchBookings = bookings.filter((b) => b.branchId === branch.id);
  const branchChats = chatThreads.filter((t) => t.branchId === branch.id);

  const [activeTab, setActiveTab] = useState<
    'students' | 'rooms' | 'fees' | 'attendance' | 'complaints' | 'leaves' | 'visitors' | 'bookings' | 'notices' | 'chat'
  >('students');

  // Receipt Modal
  const [selectedReceiptFee, setSelectedReceiptFee] = useState<FeeRecord | null>(null);

  // New Student Modal Form
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentRoomNumber, setNewStudentRoomNumber] = useState('101');
  const [newStudentRoomType, setNewStudentRoomType] = useState<RoomType>('double');
  const [newStudentBed, setNewStudentBed] = useState('B');
  const [newStudentCollege, setNewStudentCollege] = useState('');
  const [newStudentGuardian, setNewStudentGuardian] = useState('');
  const [newStudentGuardianPhone, setNewStudentGuardianPhone] = useState('');
  const [newStudentAddress, setNewStudentAddress] = useState('');

  // Reallocate Room State
  const [reallocStudentId, setReallocStudentId] = useState<string | null>(null);
  const [targetRoomId, setTargetRoomId] = useState(branchRooms[0]?.id || '');
  const [targetBed, setTargetBed] = useState('A');

  // Attendance Simulation
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().substring(0, 10));
  const [attendanceSheet, setAttendanceSheet] = useState<{ [studentId: string]: 'present' | 'absent' | 'leave' }>({
    'student-1': 'present',
    'student-2': 'present',
    'student-3': 'present',
    'student-4': 'present',
  });
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // New Notice State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePriority, setNoticePriority] = useState<'normal' | 'important' | 'urgent'>('normal');

  // New Visitor State
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorStudentName, setVisitorStudentName] = useState('Aarav Shrestha');
  const [visitorPurpose, setVisitorPurpose] = useState('');
  const [visitorIdProof, setVisitorIdProof] = useState('Nepali Citizenship');

  // Chat reply state
  const [replyText, setReplyText] = useState<{ [threadId: string]: string }>({});

  // Summary Metrics
  const totalBeds = branch.totalBeds;
  const occupiedBeds = branchStudents.length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);
  const pendingDuesTotal = branchFees
    .filter((f) => f.status === 'due' || f.status === 'partial')
    .reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);
  const openComplaintsCount = branchComplaints.filter((c) => c.status !== 'Resolved').length;

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentPhone) return;

    // Check capacity first
    const chosenRoom = branchRooms.find((r) => r.roomNumber === newStudentRoomNumber);
    if (chosenRoom && chosenRoom.occupied >= chosenRoom.capacity) {
      alert(`Cannot allocate: Room ${newStudentRoomNumber} is already at full capacity (${chosenRoom.capacity}/${chosenRoom.capacity}).`);
      return;
    }

    addStudent({
      branchId: branch.id,
      branchName: branch.name,
      fullName: newStudentName,
      email: newStudentEmail || `${newStudentName.toLowerCase().replace(/\s+/g, '')}@student.np`,
      phone: newStudentPhone,
      roomNumber: newStudentRoomNumber,
      roomType: newStudentRoomType,
      bedNumber: newStudentBed,
      collegeOrWork: newStudentCollege || 'Tribhuvan University',
      guardianName: newStudentGuardian || 'Parent / Guardian',
      guardianPhone: newStudentGuardianPhone || '+977-9841000000',
      guardianRelation: 'Parent',
      homeAddress: newStudentAddress || 'Kathmandu, Nepal',
      enrollmentDate: new Date().toISOString().substring(0, 10),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });

    setShowAddStudentModal(false);
    setNewStudentName('');
    setNewStudentPhone('');
  };

  const handleReallocate = (studentId: string) => {
    const success = allocateRoom(studentId, targetRoomId, targetBed);
    if (!success) {
      alert('Allocation failed: The target room has no vacant beds (capacity exceeded per FR-B2.4).');
    } else {
      setReallocStudentId(null);
    }
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;
    postNotice({
      scope: 'branch',
      branchId: branch.id,
      branchName: branch.name,
      author: branch.wardenName,
      authorRole: 'Branch Warden',
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      priority: noticePriority,
      targetAudience: 'students',
    });
    setNoticeTitle('');
    setNoticeContent('');
  };

  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;
    addVisitor({
      branchId: branch.id,
      visitorName: visitorName.trim(),
      visitorPhone: visitorPhone.trim(),
      studentId: 'student-1',
      studentName: visitorStudentName,
      roomNumber: '101',
      relationship: 'Relative / Friend',
      purpose: visitorPurpose.trim() || 'General Visit',
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      idProofType: visitorIdProof,
    });
    setVisitorName('');
    setVisitorPhone('');
    setVisitorPurpose('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Branch Header & Branch Selector */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg w-max mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Branch Operations Console (Warden View)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {branch.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Warden: <strong>{branch.wardenName}</strong> ({branch.wardenPhone}) • NHA Reg: {branch.nhaRegNumber}
          </p>
        </div>

        {/* Switch Branch dropdown for multi-branch demonstration */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 pl-2">Select Branch:</span>
          <select
            value={activeBranchId}
            onChange={(e) => setActiveBranchId(e.target.value)}
            className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Operational Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Live Occupancy</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{occupancyRate}%</span>
            <span className="text-xs text-slate-500 font-medium">({occupiedBeds}/{totalBeds} beds)</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-600 h-full" style={{ width: `${occupancyRate}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Fee Dues</span>
          <div className="text-2xl font-black text-amber-700">
            Rs. {pendingDuesTotal.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">Ashwin 2083 Billing Cycle</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Open Complaints</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-rose-700">{openComplaintsCount}</span>
            <span className="text-xs text-slate-500">Unresolved tickets</span>
          </div>
          <span className="text-[11px] text-rose-600 font-medium">1 Escalated to NHA</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Online Booking Inquiries</span>
          <div className="text-2xl font-black text-blue-900">
            {branchBookings.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Deposits Verified</span>
        </div>
      </div>

      {/* Operations Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-1 text-xs font-bold">
        {[
          { id: 'students', label: 'Resident Students', icon: Users },
          { id: 'rooms', label: 'Rooms & Bed Capacity', icon: Bed },
          { id: 'fees', label: 'Fees & Dues Collection', icon: CreditCard },
          { id: 'attendance', label: 'Attendance Sheet', icon: CheckSquare },
          { id: 'complaints', label: 'Complaints & NHA Escalation', icon: AlertTriangle },
          { id: 'leaves', label: 'Leave Requests', icon: Calendar },
          { id: 'visitors', label: 'Visitor Logbook', icon: Clock },
          { id: 'bookings', label: 'Online Bookings', icon: FileText },
          { id: 'notices', label: 'Notice Board', icon: Bell },
          { id: 'chat', label: 'Resident & Public Chat', icon: MessageSquare },
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

      {/* TAB 1: Resident Students (FR-B1.1, FR-B1.2, FR-B1.3, FR-B1.4) */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Enrolled Resident Students</h3>
              <p className="text-xs text-slate-500">
                Auto-assigned unique Student ID under NHA platform. Scoped strictly to {branch.name}.
              </p>
            </div>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Student (FR-B1.1)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">Full Name & Contact</th>
                  <th className="py-3 px-3">Room / Bed</th>
                  <th className="py-3 px-3">College / Institute</th>
                  <th className="py-3 px-3">Guardian Contact</th>
                  <th className="py-3 px-3">Enrollment Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branchStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        {s.studentId}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{s.fullName}</div>
                      <div className="text-[11px] text-slate-500">{s.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">
                        Room {s.roomNumber} (Bed {s.bedNumber})
                      </span>
                      <span className="text-[10px] text-slate-400 block capitalize">{s.roomType}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{s.collegeOrWork}</td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{s.guardianName} ({s.guardianRelation})</div>
                      <div className="text-[11px] text-slate-500">{s.guardianPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{s.enrollmentDate}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setReallocStudentId(s.id);
                        }}
                        className="text-blue-700 hover:text-blue-900 font-bold text-[11px]"
                      >
                        Reallocate Room
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Archive and checkout ${s.fullName}? This will free up bed ${s.bedNumber} in Room ${s.roomNumber}.`)) {
                            archiveStudent(s.id);
                          }
                        }}
                        className="text-rose-600 hover:text-rose-800 font-bold text-[11px]"
                        title="Checkout & Archive (FR-B1.4)"
                      >
                        Checkout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Room Allocation & Capacity Enforcement (FR-B2.1, FR-B2.2, FR-B2.3, FR-B2.4) */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Room Inventory & Capacity Enforcement</h3>
              <p className="text-xs text-slate-500">
                Rule FR-B2.4: System strictly prevents allocation beyond stated room capacity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchRooms.map((room) => {
              const vacancies = room.capacity - room.occupied;
              const isFull = vacancies <= 0;
              const roomResidents = branchStudents.filter((s) => s.roomNumber === room.roomNumber);

              return (
                <div
                  key={room.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Floor {room.floor}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">
                        Room {room.roomNumber} ({room.type})
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFull
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isFull ? 'At Full Capacity' : `${vacancies} Bed(s) Available`}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <strong>Rs. {room.monthlyRent.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Capacity:</span>
                      <span>{room.occupied} of {room.capacity} beds filled</span>
                    </div>
                  </div>

                  {/* Residents currently inside */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Current Residents:
                    </span>
                    {roomResidents.length > 0 ? (
                      <ul className="space-y-1 text-xs">
                        {roomResidents.map((r) => (
                          <li key={r.id} className="flex justify-between text-slate-800 font-medium">
                            <span>• {r.fullName}</span>
                            <span className="text-slate-400 text-[10px]">Bed {r.bedNumber}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No students allocated yet.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Fee Management & Dues (FR-B3.1, FR-B3.2, FR-B3.3, FR-B3.4) */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Fee Management & Digital Invoices</h3>
              <p className="text-xs text-slate-500">
                Track pending dues, reconcile eSewa/Khalti transactions, and generate official NHA digital receipts.
              </p>
            </div>
            <button
              onClick={() => {
                const student = branchStudents[0];
                if (!student) return;
                addFeeInvoice({
                  studentId: student.id,
                  studentName: student.fullName,
                  branchId: branch.id,
                  branchName: branch.name,
                  month: 'Kartik 2083 (Nov 2026)',
                  roomRent: 12000,
                  messFee: 6000,
                  utilitiesFee: 1000,
                  laundryFee: 500,
                  fineAmount: 0,
                  totalAmount: 19500,
                  dueDate: '2026-11-10',
                });
                alert('Generated new Kartik 2083 billing invoice for student!');
              }}
              className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold"
            >
              + Generate Next Month Invoice
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">Resident</th>
                  <th className="py-3 px-3">Billing Period</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Paid Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branchFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{fee.invoiceNumber}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{fee.studentName}</td>
                    <td className="py-3 px-3 text-slate-600">{fee.month}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">Rs. {fee.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-700">Rs. {fee.paidAmount.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          fee.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fee.status === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {fee.status !== 'paid' ? (
                        <button
                          onClick={() => payFee(fee.id, 'Cash', 'CASH-COUNTER-MANUAL')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
                        >
                          Mark Paid (Cash)
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedReceiptFee(fee)}
                          className="px-2.5 py-1 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg text-[11px] font-bold flex items-center space-x-1 inline-flex"
                        >
                          <Printer className="w-3 h-3" />
                          <span>View Receipt</span>
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

      {/* TAB 4: Attendance Tracking (FR-B4.1, FR-B4.2) */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Daily Resident Attendance Roll Call</h3>
              <p className="text-xs text-slate-500">
                Rule FR-B4.1: Supports manual roll call and hardware biometric device sync.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold"
              />
              <button
                onClick={() => {
                  setAttendanceSheet({
                    'student-1': 'present',
                    'student-2': 'present',
                    'student-3': 'present',
                    'student-4': 'present',
                  });
                  alert('Biometric Fingerprint Terminal synced successfully! 4 residents verified present.');
                }}
                className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Sync Biometric Terminal
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {branchStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div>
                  <span className="font-bold text-slate-900 text-xs">{s.fullName}</span>
                  <span className="text-slate-400 text-[11px] ml-2">Room {s.roomNumber}</span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  {(['present', 'absent', 'leave'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setAttendanceSheet({ ...attendanceSheet, [s.id]: status })}
                      className={`px-3 py-1 rounded-lg capitalize font-bold text-xs transition-colors ${
                        (attendanceSheet[s.id] || 'present') === status
                          ? status === 'present'
                            ? 'bg-emerald-600 text-white'
                            : status === 'absent'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setAttendanceSaved(true);
                setTimeout(() => setAttendanceSaved(false), 3000);
              }}
              className="w-full py-2.5 bg-blue-900 text-white font-bold rounded-xl text-xs"
            >
              {attendanceSaved ? '✓ Attendance Saved for Date!' : 'Save Attendance Roll'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Complaints & Escalation to NHA (FR-B5.1, FR-B5.2, FR-B5.3, FR-B5.4, FR-B5.5) */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Complaints & Maintenance Management</h3>
            <p className="text-xs text-slate-500">
              Update resolution notes or escalate unresolved grievances directly to NHA (FR-B5.4).
            </p>
          </div>

          <div className="space-y-4">
            {branchComplaints.map((comp) => (
              <div
                key={comp.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                      {comp.trackingCode}
                    </span>
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {comp.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        comp.priority === 'Emergency' || comp.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {comp.priority}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {comp.isEscalatedToNha && (
                      <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Escalated to NHA</span>
                      </span>
                    )}

                    <select
                      value={comp.status}
                      onChange={(e) => updateComplaintStatus(comp.id, e.target.value as any)}
                      className="text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{comp.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{comp.description}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Reported by {comp.studentName} (Room {comp.roomNumber}) on {comp.createdAt}
                  </span>
                </div>

                {comp.resolutionNotes && (
                  <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 text-slate-700">
                    <strong>Resolution Log:</strong> {comp.resolutionNotes}
                  </div>
                )}

                {/* Escalation Action Button */}
                {!comp.isEscalatedToNha && comp.status !== 'Resolved' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        const reason = prompt('State reason for escalating to Nepal Hostel Association grievance committee:');
                        if (reason) {
                          escalateComplaintToNha(comp.id, reason);
                        }
                      }}
                      className="text-rose-700 hover:text-rose-800 text-xs font-bold flex items-center space-x-1 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Escalate to NHA Oversight Committee (FR-B5.4)</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Leave Requests (FR-B6.1, FR-B6.2) */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Resident Leave & Outing Applications</h3>
            <p className="text-xs text-slate-500">
              Warden approval workflow with parent consent phone verification check.
            </p>
          </div>

          <div className="space-y-4">
            {branchLeaves.map((leave) => (
              <div
                key={leave.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">
                      {leave.studentName} (Room {leave.roomNumber})
                    </span>
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded ml-2">
                      {leave.leaveType}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      leave.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : leave.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Duration:</strong> {leave.fromDateTime} to {leave.toDateTime}</div>
                  <div><strong>Reason:</strong> {leave.reason}</div>
                  <div><strong>Destination:</strong> {leave.destination}</div>
                  <div><strong>Emergency Phone:</strong> {leave.emergencyPhone}</div>
                  <div>
                    <strong>Parental Consent Confirmed:</strong>{' '}
                    <span className={leave.parentConsentConfirmed ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                      {leave.parentConsentConfirmed ? 'Yes (Verified)' : 'Pending Phone Confirmation'}
                    </span>
                  </div>
                </div>

                {leave.status === 'Pending' && (
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => updateLeaveStatus(leave.id, 'Approved', 'Approved by warden')}
                      className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-lg text-xs"
                    >
                      Approve Leave
                    </button>
                    <button
                      onClick={() => updateLeaveStatus(leave.id, 'Rejected', 'Curfew/Exam conflict')}
                      className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg text-xs"
                    >
                      Reject Leave
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Visitors (FR-B7.2, FR-B7.3) */}
      {activeTab === 'visitors' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Visitor Entry & Exit Register</h3>
              <p className="text-xs text-slate-500">Security gate logging as mandated by NHA safety regulations.</p>
            </div>
          </div>

          {/* New Visitor Form */}
          <form onSubmit={handleAddVisitor} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Visitor Name</label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Full Name"
                className="w-full p-2 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Visiting Student</label>
              <input
                type="text"
                value={visitorStudentName}
                onChange={(e) => setVisitorStudentName(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-blue-900 text-white font-bold rounded-lg"
              >
                Log Visitor In
              </button>
            </div>
          </form>

          {/* Visitors Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Visitor Name</th>
                  <th className="py-2.5 px-3">Student Visited</th>
                  <th className="py-2.5 px-3">Purpose & Relation</th>
                  <th className="py-2.5 px-3">Entry Time</th>
                  <th className="py-2.5 px-3">Exit Time</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branchVisitors.map((v) => (
                  <tr key={v.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{v.visitorName} ({v.visitorPhone})</td>
                    <td className="py-2.5 px-3">{v.studentName} (Rm {v.roomNumber})</td>
                    <td className="py-2.5 px-3 text-slate-600">{v.purpose}</td>
                    <td className="py-2.5 px-3 font-mono">{v.entryTime}</td>
                    <td className="py-2.5 px-3 font-mono">{v.exitTime || 'Inside Campus'}</td>
                    <td className="py-2.5 px-3 text-right">
                      {!v.exitTime && (
                        <button
                          onClick={() => checkoutVisitor(v.id)}
                          className="text-xs text-rose-600 font-bold hover:underline"
                        >
                          Mark Exit
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

      {/* TAB 8: Online Bookings (FR-A5.4) */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Online Booking Inquiries & Deposits</h3>
            <p className="text-xs text-slate-500">
              Rule FR-A5.4: Warden can Accept, Reject, or Waitlist prospective student applications.
            </p>
          </div>

          <div className="space-y-4">
            {branchBookings.map((b) => (
              <div
                key={b.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-blue-900 text-xs bg-blue-50 px-2 py-0.5 rounded">
                      {b.bookingCode}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{b.applicantName}</span>
                    <span className="text-xs text-slate-400 capitalize">({b.roomType} room)</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      b.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div><strong>Mobile:</strong> {b.applicantPhone}</div>
                  <div><strong>Target Move-in:</strong> {b.preferredMoveInDate}</div>
                  <div><strong>College:</strong> {b.collegeOrInst}</div>
                  <div>
                    <strong>Deposit:</strong>{' '}
                    <span className="text-emerald-700 font-bold">Rs. {b.depositAmount.toLocaleString()}</span>
                  </div>
                </div>

                {b.notes && (
                  <p className="text-xs text-slate-500 italic bg-white p-2.5 rounded-lg border border-slate-100">
                    "{b.notes}"
                  </p>
                )}

                {b.status === 'pending' && (
                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => updateBookingStatus(b.id, 'accepted')}
                      className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-lg text-xs"
                    >
                      Accept Booking & Hold Bed
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'waitlisted')}
                      className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg text-xs"
                    >
                      Waitlist
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'rejected')}
                      className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg text-xs"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: Notice Board (FR-B8.1) */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Branch Notice Board</h3>
              <p className="text-xs text-slate-500">Post announcements visible to resident students and parents.</p>
            </div>
          </div>

          <form onSubmit={handleAddNotice} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Headline</label>
              <input
                type="text"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                placeholder="e.g. Water Tank Cleaning Schedule on Saturday"
                className="w-full p-2.5 rounded-lg border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Details</label>
              <textarea
                rows={2}
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                placeholder="Details for students..."
                className="w-full p-2.5 rounded-lg border border-slate-300"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 text-white font-bold rounded-lg"
            >
              Broadcast Notice
            </button>
          </form>
        </div>
      )}

      {/* TAB 10: Chat Threads (FR-A4.2 & FR-B9.1) */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Inquiries & Resident Support Chats</h3>
            <p className="text-xs text-slate-500">Pre-enrollment questions and resident support messaging.</p>
          </div>

          <div className="space-y-4">
            {branchChats.map((thread) => (
              <div key={thread.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 text-sm">{thread.participantName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{thread.lastTimestamp}</span>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {thread.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-2 rounded-xl text-xs max-w-[85%] ${
                        m.senderRole === 'warden'
                          ? 'ml-auto bg-blue-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="text-[9px] block font-semibold opacity-75">{m.senderName}</span>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    value={replyText[thread.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [thread.id]: e.target.value })}
                    placeholder="Reply as Branch Warden..."
                    className="flex-1 p-2 rounded-lg border border-slate-300 bg-white"
                  />
                  <button
                    onClick={() => {
                      if (!replyText[thread.id]?.trim()) return;
                      sendChatMessage(
                        thread.id,
                        replyText[thread.id],
                        'warden',
                        `${branch.wardenName} (Warden)`
                      );
                      setReplyText({ ...replyText, [thread.id]: '' });
                    }}
                    className="px-4 py-2 bg-blue-900 text-white font-bold rounded-lg text-xs"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Register Student (FR-B1.1 & FR-B1.2) */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 my-8">
            <h3 className="font-extrabold text-slate-900 text-base">Register New Student Profile</h3>
            <p className="text-xs text-slate-500">
              Auto-generates unique Student ID format: <code>NHA-KTM-2026-XXXX</code>.
            </p>

            <form onSubmit={handleRegisterStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Assignment</label>
                  <select
                    value={newStudentRoomNumber}
                    onChange={(e) => setNewStudentRoomNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    {branchRooms.map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} ({r.occupied}/{r.capacity} filled)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={newStudentGuardian}
                    onChange={(e) => setNewStudentGuardian(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guardian Phone</label>
                  <input
                    type="tel"
                    value={newStudentGuardianPhone}
                    onChange={(e) => setNewStudentGuardianPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white font-bold rounded-xl"
                >
                  Create Profile & Allocate Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reallocate Room (FR-B2.3 & FR-B2.4) */}
      {reallocStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Reallocate Room for Resident</h3>
            <p className="text-xs text-slate-500">
              Select destination room. The system strictly verifies that target room has vacancy before saving.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Room</label>
                <select
                  value={targetRoomId}
                  onChange={(e) => setTargetRoomId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  {branchRooms.map((r) => (
                    <option key={r.id} value={r.id} disabled={r.occupied >= r.capacity}>
                      Room {r.roomNumber} ({r.type}) — {r.capacity - r.occupied} beds available
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Bed Identifier</label>
                <input
                  type="text"
                  value={targetBed}
                  onChange={(e) => setTargetBed(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-bold"
                  placeholder="e.g. Bed B"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setReallocStudentId(null)}
                  className="px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReallocate(reallocStudentId)}
                  className="px-4 py-2 bg-blue-900 text-white font-bold rounded-xl"
                >
                  Confirm Reallocation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedReceiptFee}
        onClose={() => setSelectedReceiptFee(null)}
        fee={selectedReceiptFee}
      />
    </div>
  );
};
