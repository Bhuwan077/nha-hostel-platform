export type UserRole = 
  | 'public' 
  | 'student' 
  | 'parent' 
  | 'warden' 
  | 'owner' 
  | 'nha';

export type GenderPolicy = 'boys' | 'girls' | 'co-ed';
export type VerificationStatus = 'verified' | 'pending' | 'suspended' | 'unverified';
export type RoomType = 'single' | 'double' | 'triple' | 'quad';
export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';
export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type PaymentStatus = 'paid' | 'partial' | 'due' | 'overdue';
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'waitlisted';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: 'room' | 'utility' | 'food' | 'security' | 'study';
}

export interface WashroomDetails {
  type: 'attached' | 'shared' | 'hybrid';
  ratio: string; // e.g., "1 washroom per 3 students"
  attachedCount: number;
  sharedCount: number;
  westernToilets: boolean;
  squatToilets: boolean;
  geyserHotWater24x7: boolean;
}

export interface MessDaySchedule {
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
  specialMeal?: string;
}

export interface MessMenu {
  id: string;
  branchId: string;
  lastUpdated: string;
  notes: string;
  weeklySchedule: {
    Sunday: MessDaySchedule;
    Monday: MessDaySchedule;
    Tuesday: MessDaySchedule;
    Wednesday: MessDaySchedule;
    Thursday: MessDaySchedule;
    Friday: MessDaySchedule;
    Saturday: MessDaySchedule;
  };
}

export interface Review {
  id: string;
  branchId: string;
  studentId: string;
  studentName: string;
  stayPeriod: string;
  roomType: string;
  rating: number; // 1-5
  cleanlinessRating: number;
  foodRating: number;
  wardenRating: number;
  amenitiesRating: number;
  comment: string;
  createdAt: string;
  isVerifiedResident: boolean;
  adminReply?: string;
  adminRepliedAt?: string;
}

export interface RoomRecord {
  id: string;
  branchId: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  capacity: number;
  occupied: number;
  monthlyRent: number;
  depositAmount: number;
  attachedWashroom: boolean;
  balcony: boolean;
  amenities: string[];
}

export interface HostelBranch {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  code: string;
  city: string;
  area: string;
  address: string;
  landmark: string;
  latitude: number;
  longitude: number;
  genderPolicy: GenderPolicy;
  verificationStatus: VerificationStatus;
  nhaRegNumber: string;
  verificationDate?: string;
  rating: number;
  reviewsCount: number;
  photos: string[];
  coverImage: string;
  description: string;
  contactPhone: string;
  contactEmail: string;
  wardenName: string;
  wardenPhone: string;
  establishedYear: number;
  amenities: string[];
  houseRules: string[];
  washroomDetails: WashroomDetails;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  minPrice: number;
  maxPrice: number;
}

export interface ResidentStudent {
  id: string;
  studentId: string; // e.g. "NHA-KTM-001-2026-0042"
  branchId: string;
  branchName: string;
  fullName: string;
  email: string;
  phone: string;
  roomNumber: string;
  roomType: RoomType;
  bedNumber: string;
  collegeOrWork: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  homeAddress: string;
  enrollmentDate: string;
  status: 'active' | 'leave' | 'archived';
  avatarUrl: string;
}

export interface FeeRecord {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  branchId: string;
  branchName: string;
  month: string; // e.g., "Ashwin 2083 (Oct 2026)"
  roomRent: number;
  messFee: number;
  utilitiesFee: number;
  laundryFee: number;
  fineAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  paymentGateway?: 'eSewa' | 'Khalti' | 'ConnectIPS' | 'Cash';
  transactionRef?: string;
}

export interface AttendanceRecord {
  id: string;
  branchId: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'leave';
  markedBy: string;
  time: string;
  method: 'biometric' | 'manual';
  remarks?: string;
}

export interface ComplaintRecord {
  id: string;
  trackingCode: string;
  branchId: string;
  branchName: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: 'Plumbing' | 'Electrical' | 'Mess/Food' | 'Internet/Wi-Fi' | 'Cleanliness' | 'Security/Discipline' | 'Other';
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  isEscalatedToNha: boolean;
  escalatedAt?: string;
  nhaRemarks?: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface LeaveRecord {
  id: string;
  requestCode: string;
  branchId: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  leaveType: 'Day Outing' | 'Night Out' | 'Home Visit' | 'Emergency';
  fromDateTime: string;
  toDateTime: string;
  reason: string;
  destination: string;
  emergencyPhone: string;
  status: LeaveStatus;
  parentConsentConfirmed: boolean;
  wardenRemarks?: string;
  appliedAt: string;
}

export interface VisitorRecord {
  id: string;
  branchId: string;
  visitorName: string;
  visitorPhone: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  relationship: string;
  purpose: string;
  entryTime: string;
  exitTime?: string;
  idProofType: string;
}

export interface NoticeRecord {
  id: string;
  scope: 'branch' | 'owner' | 'association';
  branchId?: string;
  branchName?: string;
  ownerId?: string;
  author: string;
  authorRole: string;
  title: string;
  content: string;
  date: string;
  priority: 'normal' | 'important' | 'urgent';
  targetAudience: 'all' | 'students' | 'parents' | 'staff' | 'public';
}

export interface BookingRequest {
  id: string;
  bookingCode: string;
  branchId: string;
  branchName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  gender: 'male' | 'female';
  roomType: RoomType;
  preferredMoveInDate: string;
  collegeOrInst: string;
  depositAmount: number;
  paymentGateway?: 'eSewa' | 'Khalti' | 'ConnectIPS' | 'Cash';
  paymentStatus: 'paid' | 'pending' | 'counter_payment';
  transactionRef?: string;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderRole: 'student' | 'resident' | 'prospective' | 'parent' | 'warden' | 'nha';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  branchId: string;
  branchName: string;
  participantId: string;
  participantName: string;
  participantType: 'prospective' | 'resident' | 'parent';
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface BranchTransferRequest {
  id: string;
  studentId: string;
  studentName: string;
  currentBranchId: string;
  currentBranchName: string;
  targetBranchId: string;
  targetBranchName: string;
  roomType: RoomType;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  adminNotes?: string;
}

export interface HostelOwner {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  panNumber: string;
  branchIds: string[];
}
