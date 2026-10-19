import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  Bed,
  Star,
  Calendar,
  Coffee,
  CheckCircle2,
  Clock,
  Heart,
  MessageSquare,
  ArrowLeft,
  Bath,
  Check,
  Send,
  Building,
  AlertCircle
} from 'lucide-react';
import { HostelBranch, RoomRecord, Review } from '../types';
import { usePlatform } from '../context/PlatformContext';
import { BookingModal } from '../components/public/BookingModal';

interface HostelDetailPageProps {
  branchId: string;
  onBack: () => void;
  onOpenChat: (branch: HostelBranch) => void;
}

export const HostelDetailPage: React.FC<HostelDetailPageProps> = ({
  branchId,
  onBack,
  onOpenChat,
}) => {
  const {
    branches,
    rooms,
    reviews,
    messMenus,
    addReview,
    wishlist,
    toggleWishlist,
    currentRole,
    replyToReview,
  } = usePlatform();

  const branch = branches.find((b) => b.id === branchId) || branches[0];
  const branchRooms = rooms.filter((r) => r.branchId === branch.id);
  const branchReviews = reviews.filter((r) => r.branchId === branch.id);
  const messMenu = messMenus[branch.id] || messMenus['branch-ktm-1'];

  const isWishlisted = wishlist.includes(branch.id);
  const isVerified = branch.verificationStatus === 'verified';
  const vacancies = branch.totalBeds - branch.occupiedBeds;

  const [activeTab, setActiveTab] = useState<'rooms' | 'mess' | 'facilities' | 'reviews'>('rooms');
  const [selectedDay, setSelectedDay] = useState<keyof typeof messMenu.weeklySchedule>('Sunday');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('Pooja Karki');
  const [stayPeriod, setStayPeriod] = useState('Current Resident (2025/2026)');
  const [roomStayed, setRoomStayed] = useState('Double Sharing');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Admin reply state
  const [replyInput, setReplyInput] = useState<{ [reviewId: string]: string }>({});

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      branchId: branch.id,
      studentId: `student-${Date.now()}`,
      studentName: reviewerName,
      stayPeriod,
      roomType: roomStayed,
      rating: reviewRating,
      cleanlinessRating: reviewRating,
      foodRating: reviewRating,
      wardenRating: reviewRating,
      amenitiesRating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSubmitted(true);
    setReviewComment('');
  };

  const handleAdminReplySubmit = (reviewId: string) => {
    const reply = replyInput[reviewId];
    if (!reply || !reply.trim()) return;
    replyToReview(reviewId, reply.trim());
    setReplyInput({ ...replyInput, [reviewId]: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-blue-900 hover:text-blue-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hostels List</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleWishlist(branch.id)}
            className={`p-2.5 rounded-xl border flex items-center space-x-1.5 text-xs font-bold transition-all ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-500' : ''}`} />
            <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
          </button>

          <button
            onClick={() => onOpenChat(branch)}
            className="p-2.5 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Warden</span>
          </button>

          <button
            onClick={() => setIsBookingOpen(true)}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold shadow-md transition-colors"
          >
            Book Room Now
          </button>
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-slate-100">
          <div className="md:col-span-2 h-72 md:h-96 rounded-2xl overflow-hidden relative">
            <img
              src={branch.photos[0] || branch.coverImage}
              alt={branch.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              {isVerified ? (
                <span className="bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                  <span>NHA Verified & Certified</span>
                </span>
              ) : (
                <span className="bg-amber-500/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Certification In Progress
                </span>
              )}
              <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs uppercase font-bold px-3 py-1.5 rounded-full shadow-lg">
                {branch.genderPolicy} Hostel
              </span>
            </div>
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2 h-96">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={branch.photos[1] || branch.coverImage}
                alt="Hostel interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={branch.photos[2] || branch.coverImage}
                alt="Hostel room"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Title, Address, Meta */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  Reg #: {branch.nhaRegNumber}
                </span>
                <span className="text-xs text-slate-400">• Estd. {branch.establishedYear}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {branch.name}
              </h1>
              <p className="flex items-center text-xs text-slate-600 mt-2">
                <MapPin className="w-4 h-4 text-slate-400 mr-1.5 flex-shrink-0" />
                <span>{branch.address}</span>
              </p>
              <p className="text-xs text-blue-800 font-semibold mt-1">
                📍 Landmark: {branch.landmark}
              </p>
            </div>

            {/* Price & Rating Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex md:flex-col items-center md:items-end justify-between min-w-[200px]">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Monthly Packages</span>
                <span className="text-xl font-black text-slate-900">
                  Rs. {branch.minPrice.toLocaleString()} - {branch.maxPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">Includes 4 meals & utilities</span>
              </div>

              <div className="flex items-center space-x-1.5 mt-2 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-extrabold text-amber-900 text-sm">{branch.rating}</span>
                <span className="text-xs text-slate-400">({branch.reviewsCount} verified reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-5 text-xs text-slate-700 leading-relaxed max-w-4xl">
            {branch.description}
          </div>

          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Beds</span>
              <span className="text-lg font-black text-slate-800">{branch.totalBeds} Beds</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Current Vacancies</span>
              <span className="text-lg font-black text-emerald-800">{vacancies} Available</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Branch Warden</span>
              <span className="text-xs font-bold text-slate-800 block truncate">{branch.wardenName}</span>
              <span className="text-[10px] text-slate-500">{branch.wardenPhone}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Curfew / Gate</span>
              <span className="text-xs font-bold text-slate-800 block">8:30 PM (Biometric)</span>
              <span className="text-[10px] text-emerald-600 font-semibold">24/7 Security Desk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'rooms'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Room Types & Live Vacancy</span>
        </button>

        <button
          onClick={() => setActiveTab('mess')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'mess'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Weekly Mess Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('facilities')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'facilities'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bath className="w-4 h-4" />
          <span>Washroom & Amenities Specs</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center space-x-2 ${
            activeTab === 'reviews'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Verified Student Reviews ({branchReviews.length})</span>
        </button>
      </div>

      {/* Tab 1: Room Types & Live Vacancies (FR-A2.2 & FR-A2.3) */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Live Room Occupancy & Pricing</h3>
              <p className="text-xs text-slate-500">Real-time room availability synchronized with branch operations.</p>
            </div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
            >
              Request Room Reservation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branchRooms.map((room) => {
              const availableBeds = room.capacity - room.occupied;
              const isFull = availableBeds <= 0;

              return (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Floor {room.floor} • Room {room.roomNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base capitalize">
                        {room.type} Room
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isFull
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isFull ? 'Occupied (Full)' : `${availableBeds} Bed(s) Vacant`}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <strong className="text-slate-900 font-bold">Rs. {room.monthlyRent.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Advance:</span>
                      <span className="text-slate-700">Rs. {room.depositAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Washroom:</span>
                      <span className={room.attachedWashroom ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                        {room.attachedWashroom ? 'Attached Private' : 'Common Floor'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balcony:</span>
                      <span>{room.balcony ? 'Yes (Sunny View)' : 'Standard Window'}</span>
                    </div>
                  </div>

                  {/* Bed Capacity Indicator */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Bed Status:</span>
                      <span>{room.occupied} / {room.capacity} filled</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${isFull ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBookingOpen(true)}
                    disabled={isFull}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                      isFull
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-900 hover:bg-blue-800 text-white shadow-xs'
                    }`}
                  >
                    {isFull ? 'Join Waitlist' : 'Select & Book'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Weekly Mess Menu (FR-A2.4) */}
      {activeTab === 'mess' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Published Weekly Mess Schedule</h3>
              <p className="text-xs text-slate-500">
                4-tier hygienic meals served daily. Last revised on {messMenu.lastUpdated}.
              </p>
            </div>
            <div className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>NHA Hygiene Standard Certified</span>
            </div>
          </div>

          {/* Day Selector Buttons */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {(Object.keys(messMenu.weeklySchedule) as Array<keyof typeof messMenu.weeklySchedule>).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  selectedDay === day
                    ? 'bg-blue-900 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Meal Details for Selected Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs">
                <Coffee className="w-4 h-4 text-amber-700" />
                <span>Morning Breakfast (7:00 - 8:30 AM)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {messMenu.weeklySchedule[selectedDay].breakfast}
              </p>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Dal-Bhat Lunch (9:30 - 11:00 AM)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {messMenu.weeklySchedule[selectedDay].lunch}
              </p>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 space-y-2">
              <div className="flex items-center space-x-1.5 text-blue-900 font-bold text-xs">
                <Coffee className="w-4 h-4 text-blue-700" />
                <span>Afternoon Khaja/Tea (4:30 - 6:00 PM)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {messMenu.weeklySchedule[selectedDay].snacks}
              </p>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200/80 space-y-2">
              <div className="flex items-center space-x-1.5 text-indigo-900 font-bold text-xs">
                <Star className="w-4 h-4 text-indigo-700" />
                <span>Evening Dinner (7:45 - 9:00 PM)</span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {messMenu.weeklySchedule[selectedDay].dinner}
              </p>
              {messMenu.weeklySchedule[selectedDay].specialMeal && (
                <span className="inline-block mt-2 text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                  ★ {messMenu.weeklySchedule[selectedDay].specialMeal}
                </span>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
            <strong>Mess Incharge Notes:</strong> {messMenu.notes}
          </div>
        </div>
      )}

      {/* Tab 3: Facilities & Washroom Details (FR-A2.1 & FR-A2.5) */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Washroom Specifications */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
            <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-base">
              <Bath className="w-5 h-5 text-blue-800" />
              <h3>Washroom & Sanitation Specifications</h3>
            </div>
            <p className="text-xs text-slate-500">
              Verified physical inspection data recorded under NHA Member Registry.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Washroom Configuration:</span>
                <strong className="text-slate-900 capitalize">{branch.washroomDetails.type}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Student-to-Washroom Ratio:</span>
                <strong className="text-emerald-700">{branch.washroomDetails.ratio}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Attached Bathrooms Count:</span>
                <span className="font-bold text-slate-800">{branch.washroomDetails.attachedCount} units</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Common Floor Bathrooms:</span>
                <span className="font-bold text-slate-800">{branch.washroomDetails.sharedCount} units</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">24/7 Geyser & Solar Hot Water:</span>
                <span className="text-emerald-600 font-bold flex items-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>Available (Solar + Backup Geyser)</span>
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Toilet Types Available:</span>
                <span className="text-slate-800 font-medium">Western Commode & Squat Washrooms</span>
              </div>
            </div>
          </div>

          {/* House Rules & Amenities */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
            <h3 className="font-extrabold text-base text-slate-900">Amenities & House Guidelines</h3>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Features</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {branch.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">House Code of Conduct</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {branch.houseRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Verified Student Reviews (FR-A3.1, FR-A3.2, FR-A3.3) */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="text-center bg-amber-50 p-5 rounded-2xl border border-amber-200">
                <span className="text-4xl font-black text-amber-900">{branch.rating}</span>
                <div className="flex justify-center mt-1 text-amber-500">
                  {'★'.repeat(5)}
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1 block">Out of 5.0</span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Verified Resident Ratings</h3>
                <p className="text-xs text-slate-500">
                  Only enrolled residents verified by NHA student records can post reviews.
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-700">
                  <span>Cleanliness: <strong>4.9/5</strong></span>
                  <span>Food Quality: <strong>4.8/5</strong></span>
                  <span>Warden Support: <strong>4.9/5</strong></span>
                  <span>Wi-Fi/Power: <strong>4.7/5</strong></span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block mb-1">Stayed here as a resident?</span>
              <a
                href="#write-review"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs inline-block transition-colors"
              >
                Submit Resident Review
              </a>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {branchReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs flex items-center justify-center">
                      {rev.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{rev.studentName}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center space-x-0.5">
                          <Check className="w-2.5 h-2.5" />
                          <span>Verified Resident</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Stay: {rev.stayPeriod} • {rev.roomType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-amber-500">
                    {'★'.repeat(rev.rating)}
                    <span className="font-bold text-slate-700 ml-1 text-[11px]">{rev.rating}.0</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl">
                  "{rev.comment}"
                </p>

                {/* Branch Admin Response (FR-A3.3) */}
                {rev.adminReply ? (
                  <div className="ml-6 pl-4 border-l-2 border-blue-600 bg-blue-50/50 p-3 rounded-r-xl space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-blue-900">
                      <span>Warden Response ({branch.wardenName})</span>
                      <span className="text-slate-400 font-normal">{rev.adminRepliedAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic">"{rev.adminReply}"</p>
                  </div>
                ) : (
                  currentRole === 'warden' && (
                    <div className="pt-2 flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Public response as Branch Warden..."
                        value={replyInput[rev.id] || ''}
                        onChange={(e) => setReplyInput({ ...replyInput, [rev.id]: e.target.value })}
                        className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                      <button
                        onClick={() => handleAdminReplySubmit(rev.id)}
                        className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold"
                      >
                        Reply
                      </button>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Review Submission Form (FR-A3.2) */}
          <div id="write-review" className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Write a Verified Review</h3>
            <p className="text-xs text-slate-500">
              Only verified residents of {branch.name} can submit feedback. Reviews are public to prospective scholars.
            </p>

            {reviewSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your verified resident review has been published.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stay Duration</label>
                    <input
                      type="text"
                      value={stayPeriod}
                      onChange={(e) => setStayPeriod(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Overall Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-bold"
                    >
                      <option value="5">★★★★★ (5.0 - Excellent)</option>
                      <option value="4">★★★★☆ (4.0 - Good)</option>
                      <option value="3">★★★☆☆ (3.0 - Average)</option>
                      <option value="2">★★☆☆☆ (2.0 - Poor)</option>
                      <option value="1">★☆☆☆☆ (1.0 - Very Poor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Experience & Feedback</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share honest insights about cleanliness, meals, Wi-Fi speed, and warden support..."
                    className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Post Resident Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        branch={branch}
      />
    </div>
  );
};
