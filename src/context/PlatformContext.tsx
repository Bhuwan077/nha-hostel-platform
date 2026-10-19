import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  HostelBranch,
  HostelOwner,
  RoomRecord,
  ResidentStudent,
  FeeRecord,
  ComplaintRecord,
  LeaveRecord,
  VisitorRecord,
  NoticeRecord,
  Review,
  MessMenu,
  BookingRequest,
  ChatThread,
  ChatMessage,
  BranchTransferRequest,
  RoomType,
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_OWNERS,
  INITIAL_ROOMS,
  INITIAL_STUDENTS,
  INITIAL_FEES,
  INITIAL_COMPLAINTS,
  INITIAL_LEAVES,
  INITIAL_VISITORS,
  INITIAL_NOTICES,
  INITIAL_REVIEWS,
  INITIAL_MESS_MENUS,
  INITIAL_BOOKINGS,
  INITIAL_CHAT_THREADS,
  INITIAL_TRANSFERS,
} from '../data/mockData';

interface PlatformContextType {
  // Current session & role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeOwnerId: string;
  setActiveOwnerId: (id: string) => void;

  // Data collections
  branches: HostelBranch[];
  owners: HostelOwner[];
  rooms: RoomRecord[];
  students: ResidentStudent[];
  fees: FeeRecord[];
  complaints: ComplaintRecord[];
  leaves: LeaveRecord[];
  visitors: VisitorRecord[];
  notices: NoticeRecord[];
  reviews: Review[];
  messMenus: Record<string, MessMenu>;
  bookings: BookingRequest[];
  chatThreads: ChatThread[];
  transfers: BranchTransferRequest[];
  wishlist: string[];

  // Actions
  toggleWishlist: (branchId: string) => void;
  submitBooking: (booking: Omit<BookingRequest, 'id' | 'bookingCode' | 'status' | 'createdAt'>) => string;
  updateBookingStatus: (bookingId: string, status: BookingRequest['status']) => void;
  addStudent: (student: Omit<ResidentStudent, 'id' | 'studentId' | 'status'>) => string;
  archiveStudent: (studentId: string) => void;
  allocateRoom: (studentId: string, roomId: string, bedNumber: string) => boolean;
  payFee: (feeId: string, gateway: FeeRecord['paymentGateway'], ref?: string) => void;
  addFeeInvoice: (fee: Omit<FeeRecord, 'id' | 'invoiceNumber' | 'status' | 'paidAmount'>) => void;
  addComplaint: (complaint: Omit<ComplaintRecord, 'id' | 'trackingCode' | 'status' | 'isEscalatedToNha' | 'createdAt'>) => string;
  updateComplaintStatus: (complaintId: string, status: ComplaintRecord['status'], resolutionNotes?: string) => void;
  escalateComplaintToNha: (complaintId: string, remarks?: string) => void;
  submitLeaveRequest: (leave: Omit<LeaveRecord, 'id' | 'requestCode' | 'status' | 'appliedAt'>) => string;
  updateLeaveStatus: (leaveId: string, status: LeaveRecord['status'], remarks?: string) => void;
  addVisitor: (visitor: Omit<VisitorRecord, 'id'>) => void;
  checkoutVisitor: (visitorId: string) => void;
  postNotice: (notice: Omit<NoticeRecord, 'id' | 'date'>) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'isVerifiedResident'>) => void;
  replyToReview: (reviewId: string, reply: string) => void;
  updateMessMenu: (branchId: string, updatedMenu: MessMenu) => void;
  submitTransfer: (transfer: Omit<BranchTransferRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateTransferStatus: (transferId: string, status: BranchTransferRequest['status']) => void;
  sendChatMessage: (threadId: string, text: string, senderRole: ChatMessage['senderRole'], senderName: string) => void;
  startOrGetChatThread: (branchId: string, participantName: string, participantType: 'prospective' | 'resident' | 'parent', initialMessage?: string) => string;
  verifyBranchByNha: (branchId: string) => void;
  suspendBranchByNha: (branchId: string) => void;
  resetAllData: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

const STORAGE_PREFIX = 'nha_v2_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('public');
  const [activeBranchId, setActiveBranchId] = useState<string>('branch-ktm-1');
  const [activeStudentId, setActiveStudentId] = useState<string>('student-1');
  const [activeOwnerId, setActiveOwnerId] = useState<string>('owner-1');

  // Datasets
  const [branches, setBranches] = useState<HostelBranch[]>(() => loadFromStorage('branches', INITIAL_BRANCHES));
  const [owners] = useState<HostelOwner[]>(INITIAL_OWNERS);
  const [rooms, setRooms] = useState<RoomRecord[]>(() => loadFromStorage('rooms', INITIAL_ROOMS));
  const [students, setStudents] = useState<ResidentStudent[]>(() => loadFromStorage('students', INITIAL_STUDENTS));
  const [fees, setFees] = useState<FeeRecord[]>(() => loadFromStorage('fees', INITIAL_FEES));
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(() => loadFromStorage('complaints', INITIAL_COMPLAINTS));
  const [leaves, setLeaves] = useState<LeaveRecord[]>(() => loadFromStorage('leaves', INITIAL_LEAVES));
  const [visitors, setVisitors] = useState<VisitorRecord[]>(() => loadFromStorage('visitors', INITIAL_VISITORS));
  const [notices, setNotices] = useState<NoticeRecord[]>(() => loadFromStorage('notices', INITIAL_NOTICES));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('reviews', INITIAL_REVIEWS));
  const [messMenus, setMessMenus] = useState<Record<string, MessMenu>>(() => loadFromStorage('mess', INITIAL_MESS_MENUS));
  const [bookings, setBookings] = useState<BookingRequest[]>(() => loadFromStorage('bookings', INITIAL_BOOKINGS));
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => loadFromStorage('chats', INITIAL_CHAT_THREADS));
  const [transfers, setTransfers] = useState<BranchTransferRequest[]>(() => loadFromStorage('transfers', INITIAL_TRANSFERS));
  const [wishlist, setWishlist] = useState<string[]>(() => loadFromStorage('wishlist', ['branch-ktm-1', 'branch-lalitpur-1']));

  // Sync to localStorage
  useEffect(() => saveToStorage('branches', branches), [branches]);
  useEffect(() => saveToStorage('rooms', rooms), [rooms]);
  useEffect(() => saveToStorage('students', students), [students]);
  useEffect(() => saveToStorage('fees', fees), [fees]);
  useEffect(() => saveToStorage('complaints', complaints), [complaints]);
  useEffect(() => saveToStorage('leaves', leaves), [leaves]);
  useEffect(() => saveToStorage('visitors', visitors), [visitors]);
  useEffect(() => saveToStorage('notices', notices), [notices]);
  useEffect(() => saveToStorage('reviews', reviews), [reviews]);
  useEffect(() => saveToStorage('mess', messMenus), [messMenus]);
  useEffect(() => saveToStorage('bookings', bookings), [bookings]);
  useEffect(() => saveToStorage('chats', chatThreads), [chatThreads]);
  useEffect(() => saveToStorage('transfers', transfers), [transfers]);
  useEffect(() => saveToStorage('wishlist', wishlist), [wishlist]);

  // Actions
  const toggleWishlist = (branchId: string) => {
    setWishlist((prev) =>
      prev.includes(branchId) ? prev.filter((id) => id !== branchId) : [...prev, branchId]
    );
  };

  const submitBooking = (bookingData: Omit<BookingRequest, 'id' | 'bookingCode' | 'status' | 'createdAt'>): string => {
    const bookingCode = `BKG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRequest = {
      ...bookingData,
      id: `book-${Date.now()}`,
      bookingCode,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setBookings((prev) => [newBooking, ...prev]);
    return bookingCode;
  };

  const updateBookingStatus = (bookingId: string, status: BookingRequest['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );

    // If accepted and was offline or deposit verified, branch admin can onboard immediately
  };

  const addStudent = (studentData: Omit<ResidentStudent, 'id' | 'studentId' | 'status'>): string => {
    const branchCode = studentData.branchId.toUpperCase().replace('BRANCH-', 'NHA-');
    const studentSeq = String(students.length + 43).padStart(4, '0');
    const studentId = `${branchCode}-${new Date().getFullYear()}-${studentSeq}`;

    const newStudent: ResidentStudent = {
      ...studentData,
      id: `student-${Date.now()}`,
      studentId,
      status: 'active',
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Update room occupancy
    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.branchId === studentData.branchId && r.roomNumber === studentData.roomNumber) {
          return { ...r, occupied: Math.min(r.capacity, r.occupied + 1) };
        }
        return r;
      })
    );

    // Update branch occupied beds count
    setBranches((prevBranches) =>
      prevBranches.map((b) => {
        if (b.id === studentData.branchId) {
          return { ...b, occupiedBeds: Math.min(b.totalBeds, b.occupiedBeds + 1) };
        }
        return b;
      })
    );

    return studentId;
  };

  const archiveStudent = (studentId: string) => {
    const studentToArchive = students.find((s) => s.id === studentId);
    if (!studentToArchive) return;

    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: 'archived' } : s))
    );

    // Free up bed in room
    setRooms((prevRooms) =>
      prevRooms.map((r) => {
        if (r.branchId === studentToArchive.branchId && r.roomNumber === studentToArchive.roomNumber) {
          return { ...r, occupied: Math.max(0, r.occupied - 1) };
        }
        return r;
      })
    );

    // Update branch occupied beds
    setBranches((prevBranches) =>
      prevBranches.map((b) => {
        if (b.id === studentToArchive.branchId) {
          return { ...b, occupiedBeds: Math.max(0, b.occupiedBeds - 1) };
        }
        return b;
      })
    );
  };

  const allocateRoom = (studentId: string, roomId: string, bedNumber: string): boolean => {
    const targetRoom = rooms.find((r) => r.id === roomId);
    if (!targetRoom || targetRoom.occupied >= targetRoom.capacity) {
      return false; // Prevent allocation beyond capacity per FR-B2.4
    }

    const student = students.find((s) => s.id === studentId);
    if (!student) return false;

    const oldRoomNumber = student.roomNumber;

    // Update student
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, roomNumber: targetRoom.roomNumber, roomType: targetRoom.type, bedNumber }
          : s
      )
    );

    // Update rooms
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          return { ...r, occupied: r.occupied + 1 };
        }
        if (r.branchId === student.branchId && r.roomNumber === oldRoomNumber) {
          return { ...r, occupied: Math.max(0, r.occupied - 1) };
        }
        return r;
      })
    );

    return true;
  };

  const payFee = (feeId: string, gateway: FeeRecord['paymentGateway'] = 'eSewa', ref?: string) => {
    const txnRef = ref || `${gateway?.toUpperCase()}-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setFees((prev) =>
      prev.map((f) =>
        f.id === feeId
          ? {
              ...f,
              paidAmount: f.totalAmount,
              status: 'paid',
              paidDate: new Date().toISOString().substring(0, 10),
              paymentGateway: gateway,
              transactionRef: txnRef,
            }
          : f
      )
    );
  };

  const addFeeInvoice = (feeData: Omit<FeeRecord, 'id' | 'invoiceNumber' | 'status' | 'paidAmount'>) => {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: FeeRecord = {
      ...feeData,
      id: `fee-${Date.now()}`,
      invoiceNumber,
      paidAmount: 0,
      status: 'due',
    };
    setFees((prev) => [newInvoice, ...prev]);
  };

  const addComplaint = (complaintData: Omit<ComplaintRecord, 'id' | 'trackingCode' | 'status' | 'isEscalatedToNha' | 'createdAt'>): string => {
    const trackingCode = `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint: ComplaintRecord = {
      ...complaintData,
      id: `comp-${Date.now()}`,
      trackingCode,
      status: 'Open',
      isEscalatedToNha: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    return trackingCode;
  };

  const updateComplaintStatus = (complaintId: string, status: ComplaintRecord['status'], resolutionNotes?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              resolutionNotes: resolutionNotes || c.resolutionNotes,
              resolvedAt: status === 'Resolved' ? new Date().toISOString().substring(0, 16) : c.resolvedAt,
            }
          : c
      )
    );
  };

  const escalateComplaintToNha = (complaintId: string, remarks?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              isEscalatedToNha: true,
              escalatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              nhaRemarks: remarks || 'Escalated by resident/admin. Under NHA association grievance committee review.',
            }
          : c
      )
    );
  };

  const submitLeaveRequest = (leaveData: Omit<LeaveRecord, 'id' | 'requestCode' | 'status' | 'appliedAt'>): string => {
    const requestCode = `LV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newLeave: LeaveRecord = {
      ...leaveData,
      id: `leave-${Date.now()}`,
      requestCode,
      status: 'Pending',
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setLeaves((prev) => [newLeave, ...prev]);
    return requestCode;
  };

  const updateLeaveStatus = (leaveId: string, status: LeaveRecord['status'], remarks?: string) => {
    setLeaves((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, status, wardenRemarks: remarks || l.wardenRemarks } : l))
    );
  };

  const addVisitor = (visitorData: Omit<VisitorRecord, 'id'>) => {
    const newVisitor: VisitorRecord = {
      ...visitorData,
      id: `vis-${Date.now()}`,
    };
    setVisitors((prev) => [newVisitor, ...prev]);
  };

  const checkoutVisitor = (visitorId: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors((prev) =>
      prev.map((v) => (v.id === visitorId ? { ...v, exitTime: timeNow } : v))
    );
  };

  const postNotice = (noticeData: Omit<NoticeRecord, 'id' | 'date'>) => {
    const newNotice: NoticeRecord = {
      ...noticeData,
      id: `notice-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10),
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'isVerifiedResident'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
      isVerifiedResident: true,
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate branch rating
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id === reviewData.branchId) {
          const branchReviews = [...reviews.filter((r) => r.branchId === b.id), newReview];
          const avg = branchReviews.reduce((sum, r) => sum + r.rating, 0) / branchReviews.length;
          return {
            ...b,
            rating: Number(avg.toFixed(2)),
            reviewsCount: branchReviews.length,
          };
        }
        return b;
      })
    );
  };

  const replyToReview = (reviewId: string, reply: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              adminReply: reply,
              adminRepliedAt: new Date().toISOString().substring(0, 10),
            }
          : r
      )
    );
  };

  const updateMessMenu = (branchId: string, updatedMenu: MessMenu) => {
    setMessMenus((prev) => ({
      ...prev,
      [branchId]: { ...updatedMenu, lastUpdated: new Date().toISOString().substring(0, 10) },
    }));
  };

  const submitTransfer = (transferData: Omit<BranchTransferRequest, 'id' | 'status' | 'createdAt'>) => {
    const newTransfer: BranchTransferRequest = {
      ...transferData,
      id: `trf-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setTransfers((prev) => [newTransfer, ...prev]);
  };

  const updateTransferStatus = (transferId: string, status: BranchTransferRequest['status']) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status } : t))
    );
  };

  const sendChatMessage = (threadId: string, text: string, senderRole: ChatMessage['senderRole'], senderName: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      senderRole,
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setChatThreads((prev) =>
      prev.map((th) => {
        if (th.id === threadId) {
          return {
            ...th,
            lastMessage: text,
            lastTimestamp: newMsg.timestamp,
            messages: [...th.messages, newMsg],
          };
        }
        return th;
      })
    );
  };

  const startOrGetChatThread = (
    branchId: string,
    participantName: string,
    participantType: 'prospective' | 'resident' | 'parent',
    initialMessage?: string
  ): string => {
    const branch = branches.find((b) => b.id === branchId);
    const existing = chatThreads.find((th) => th.branchId === branchId && th.participantName.includes(participantName));
    if (existing) {
      if (initialMessage) {
        sendChatMessage(existing.id, initialMessage, participantType, participantName);
      }
      return existing.id;
    }

    const threadId = `chat-thread-${Date.now()}`;
    const firstMsg: ChatMessage[] = initialMessage
      ? [
          {
            id: `msg-${Date.now()}`,
            threadId,
            senderRole: participantType,
            senderName: participantName,
            text: initialMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
          },
        ]
      : [];

    const newThread: ChatThread = {
      id: threadId,
      branchId,
      branchName: branch?.name || 'Hostel Branch',
      participantId: `usr-${Date.now()}`,
      participantName,
      participantType,
      lastMessage: initialMessage || 'Conversation started',
      lastTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: 0,
      messages: firstMsg,
    };

    setChatThreads((prev) => [newThread, ...prev]);
    return threadId;
  };

  const verifyBranchByNha = (branchId: string) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === branchId
          ? {
              ...b,
              verificationStatus: 'verified',
              nhaRegNumber: b.nhaRegNumber.startsWith('PENDING')
                ? `NHA-CERT-2026-${b.city.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
                : b.nhaRegNumber,
              verificationDate: new Date().toISOString().substring(0, 10),
            }
          : b
      )
    );
  };

  const suspendBranchByNha = (branchId: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === branchId ? { ...b, verificationStatus: 'suspended' } : b))
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setBranches(INITIAL_BRANCHES);
    setRooms(INITIAL_ROOMS);
    setStudents(INITIAL_STUDENTS);
    setFees(INITIAL_FEES);
    setComplaints(INITIAL_COMPLAINTS);
    setLeaves(INITIAL_LEAVES);
    setVisitors(INITIAL_VISITORS);
    setNotices(INITIAL_NOTICES);
    setReviews(INITIAL_REVIEWS);
    setMessMenus(INITIAL_MESS_MENUS);
    setBookings(INITIAL_BOOKINGS);
    setChatThreads(INITIAL_CHAT_THREADS);
    setTransfers(INITIAL_TRANSFERS);
    setWishlist(['branch-ktm-1', 'branch-lalitpur-1']);
  };

  return (
    <PlatformContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeBranchId,
        setActiveBranchId,
        activeStudentId,
        setActiveStudentId,
        activeOwnerId,
        setActiveOwnerId,
        branches,
        owners,
        rooms,
        students,
        fees,
        complaints,
        leaves,
        visitors,
        notices,
        reviews,
        messMenus,
        bookings,
        chatThreads,
        transfers,
        wishlist,
        toggleWishlist,
        submitBooking,
        updateBookingStatus,
        addStudent,
        archiveStudent,
        allocateRoom,
        payFee,
        addFeeInvoice,
        addComplaint,
        updateComplaintStatus,
        escalateComplaintToNha,
        submitLeaveRequest,
        updateLeaveStatus,
        addVisitor,
        checkoutVisitor,
        postNotice,
        addReview,
        replyToReview,
        updateMessMenu,
        submitTransfer,
        updateTransferStatus,
        sendChatMessage,
        startOrGetChatThread,
        verifyBranchByNha,
        suspendBranchByNha,
        resetAllData,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
