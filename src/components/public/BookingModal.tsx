import React, { useState } from 'react';
import { X, Calendar, User, Phone, Mail, GraduationCap, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { HostelBranch, RoomType } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { PaymentGatewayModal } from '../common/PaymentGatewayModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: HostelBranch;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, branch }) => {
  const { submitBooking } = usePlatform();

  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [roomType, setRoomType] = useState<RoomType>('double');
  const [preferredDate, setPreferredDate] = useState('2026-11-01');
  const [collegeOrInst, setCollegeOrInst] = useState('');
  const [notes, setNotes] = useState('');
  const [payDepositNow, setPayDepositNow] = useState(true);

  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [confirmedBookingCode, setConfirmedBookingCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const depositAmount = payDepositNow ? 5000 : 0;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      alert('Please fill out full name and phone number.');
      return;
    }

    if (payDepositNow) {
      setIsGatewayOpen(true);
    } else {
      // Offline counter payment mode (FR-A5.5 supported)
      const code = submitBooking({
        branchId: branch.id,
        branchName: branch.name,
        applicantName,
        applicantEmail,
        applicantPhone,
        gender,
        roomType,
        preferredMoveInDate: preferredDate,
        collegeOrInst,
        depositAmount: 0,
        paymentGateway: 'Cash',
        paymentStatus: 'counter_payment',
        notes: notes ? `${notes} (Counter pay on arrival)` : 'Counter pay on arrival',
      });
      setConfirmedBookingCode(code);
    }
  };

  const handleGatewaySuccess = (gateway: 'eSewa' | 'Khalti' | 'ConnectIPS', txnRef: string) => {
    setIsGatewayOpen(false);
    const code = submitBooking({
      branchId: branch.id,
      branchName: branch.name,
      applicantName,
      applicantEmail,
      applicantPhone,
      gender,
      roomType,
      preferredMoveInDate: preferredDate,
      collegeOrInst,
      depositAmount: 5000,
      paymentGateway: gateway,
      paymentStatus: 'paid',
      transactionRef: txnRef,
      notes,
    });
    setConfirmedBookingCode(code);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>NHA Verified Booking Process</span>
            </div>
            <h3 className="text-xl font-black">{branch.name}</h3>
            <p className="text-xs text-slate-300">{branch.area}, {branch.city}</p>
          </div>

          {confirmedBookingCode ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Booking Request Submitted!</h4>
              <p className="text-sm text-slate-600">
                Your reservation request has been dispatched to Warden <strong>{branch.wardenName}</strong>.
              </p>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking Reference:</span>
                  <span className="font-mono font-bold text-blue-900 text-sm">{confirmedBookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Room:</span>
                  <span className="font-medium text-slate-800 uppercase">{roomType} Sharing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Move-in Date:</span>
                  <span className="font-medium text-slate-800">{preferredDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deposit Status:</span>
                  <span className={`font-bold ${payDepositNow ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {payDepositNow ? 'Rs. 5,000 Paid (Verified)' : 'Pending Counter Clearance'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Warden hotline: {branch.wardenPhone} | Branch direct: {branch.contactPhone}
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleInitialSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room Sharing Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="single">Single Room (Private)</option>
                    <option value="double">Double Sharing (2 Beds)</option>
                    <option value="triple">Triple Sharing (3 Beds)</option>
                    <option value="quad">Four Sharing (Budget 4 Beds)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Move-in Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name of Student</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Sujan Poudel"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="98XXXXXXXX"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email (for digital receipt)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College / Work Institution</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={collegeOrInst}
                      onChange={(e) => setCollegeOrInst(e.target.value)}
                      placeholder="e.g. Apex College / IOE Pulchowk"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Deposit Option */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="depositToggle"
                      checked={payDepositNow}
                      onChange={(e) => setPayDepositNow(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <label htmlFor="depositToggle" className="font-bold text-slate-900 cursor-pointer">
                      Pay Online Security Advance (Rs. 5,000)
                    </label>
                  </div>
                  <span className="text-emerald-700 font-bold">Guarantees Bed Hold</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Per NHA regulations, deposit is fully credited against your first month's hostel invoice upon physical check-in. You may also opt to pay offline in cash at the counter.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/20"
              >
                <span>{payDepositNow ? 'Proceed to Pay Rs. 5,000 via eSewa/Khalti' : 'Submit Offline Booking Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        onSuccess={handleGatewaySuccess}
        title="Hostel Booking Advance Deposit"
        amount={5000}
        itemDescription={`Advance booking deposit for ${branch.name} (${roomType} room)`}
      />
    </>
  );
};
