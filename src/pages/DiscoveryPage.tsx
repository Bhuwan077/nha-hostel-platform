import React, { useState, useMemo } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { HostelBranch, GenderPolicy } from '../types';
import { HostelCard } from '../components/public/HostelCard';
import { HostelFilterBar } from '../components/public/HostelFilterBar';
import { InteractiveMap } from '../components/public/InteractiveMap';
import { BookingModal } from '../components/public/BookingModal';
import {
  ShieldCheck,
  Search,
  Sparkles,
  Building,
  MapPin,
  CheckCircle2,
  Award,
  Zap,
  Coffee,
  HeartHandshake,
  ArrowRight,
  Compass,
  Star,
  Users,
  Check,
  HelpCircle,
  Clock,
  BookOpen,
} from 'lucide-react';

interface DiscoveryPageProps {
  onSelectHostel: (branchId: string) => void;
  onOpenChat: (branch: HostelBranch) => void;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({
  onSelectHostel,
  onOpenChat,
}) => {
  const { branches } = usePlatform();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedGender, setSelectedGender] = useState<GenderPolicy | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState(22000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'grid'>('split');

  // Interactive Pin
  const [selectedPinBranchId, setSelectedPinBranchId] = useState<string | null>(null);

  // Booking Modal
  const [bookingBranch, setBookingBranch] = useState<HostelBranch | null>(null);

  // College Hubs for 1-Click Exploration
  const collegeHubs = [
    {
      title: 'IOE Pulchowk Campus',
      location: 'Pulchowk / Damkal, Lalitpur',
      colleges: 'Engineering, Architecture, BCA',
      count: '2 Hostels',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
      query: 'pulchowk',
      city: 'Lalitpur',
    },
    {
      title: 'New Baneshwor & Shankhamul',
      location: 'Central Kathmandu',
      colleges: 'Apex, St. Xavier’s, Softwarica',
      count: '2 Hostels',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      query: 'baneshwor',
      city: 'Kathmandu',
    },
    {
      title: 'Tribhuvan University (TU)',
      location: 'Naya Bazaar, Kirtipur',
      colleges: 'TU Central Campus & Research',
      count: '1 Hostel',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      query: 'kirtipur',
      city: 'Kathmandu',
    },
    {
      title: 'Putalisadak & Bagbazar',
      location: 'Kathmandu Educational Hub',
      colleges: 'Shankar Dev, CA Hub, Ratnapark',
      count: '1 Hostel',
      image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=600&q=80',
      query: 'bagbazar',
      city: 'Kathmandu',
    },
    {
      title: 'Pokhara Academic Zone',
      location: 'Lakeside & Lamachaur',
      colleges: 'Paschimanchal WRC & Prithvi Narayan',
      count: '1 Hostel',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      query: 'pokhara',
      city: 'Pokhara',
    },
  ];

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      if (b.verificationStatus === 'suspended') return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(query);
        const matchesArea = b.area.toLowerCase().includes(query);
        const matchesLandmark = b.landmark.toLowerCase().includes(query);
        const matchesCity = b.city.toLowerCase().includes(query);
        const matchesAmenities = b.amenities.some((a) => a.toLowerCase().includes(query));
        if (!matchesName && !matchesArea && !matchesLandmark && !matchesCity && !matchesAmenities) {
          return false;
        }
      }

      if (selectedCity !== 'all' && b.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      if (selectedGender !== 'all' && b.genderPolicy !== selectedGender) {
        return false;
      }

      if (b.minPrice > maxPrice) {
        return false;
      }

      if (verifiedOnly && b.verificationStatus !== 'verified') {
        return false;
      }

      return true;
    });
  }, [branches, searchQuery, selectedCity, selectedGender, maxPrice, verifiedOnly]);

  const scrollToSearch = () => {
    const el = document.getElementById('hostels-list');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION: Moving to a New City? */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white overflow-hidden py-16 sm:py-24">
        {/* Subtle Nepal Mountain Silhouette Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-extrabold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Nepal Hostel Association (NHA) Student Registry</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15]">
              Moving to a new city for college? <br />
              <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                Find your safe home away from home.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Discover accredited student residences across Kathmandu, Lalitpur, and Pokhara. Live bed availability, verified 4-time meal menus, 24/7 solar hot water, and transparent fees with zero broker scams.
            </p>

            {/* Quick Metrics Ticker */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-slate-300">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Inspected by NHA</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>4 Hygienic Daily Meals</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>24/7 Power & High-Speed Wi-Fi</span>
              </span>
            </div>
          </div>

          {/* Integrated Search Widget Box */}
          <div className="mt-10 bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 text-slate-900 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Destination Area */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  1. City / Destination
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="all">All Nepal Cities</option>
                    <option value="Kathmandu">Kathmandu Valley</option>
                    <option value="Lalitpur">Lalitpur (Patan/Pulchowk)</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                  </select>
                </div>
              </div>

              {/* Nearest Campus or Landmark Search */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  2. Near College / Landmark
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Pulchowk, TU, Apex..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
                  3. Hostel Gender
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="all">Any Gender (Boys / Girls / Co-ed)</option>
                  <option value="boys">Boys Hostel Only</option>
                  <option value="girls">Girls Hostel Only</option>
                  <option value="co-ed">Co-ed (Separate Wings)</option>
                </select>
              </div>

              {/* CTA Search Button */}
              <div className="flex items-end">
                <button
                  onClick={scrollToSearch}
                  className="w-full py-3 bg-gradient-to-r from-blue-900 to-indigo-800 hover:from-blue-800 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/25 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Verified Hostels</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR STUDENT HUBS SECTION */}
      <section id="hubs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-900 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Campus Neighborhoods</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Popular Student Hubs in Nepal
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Click any campus hub to instantly view verified hostels within walking distance of your lectures.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {collegeHubs.map((hub, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSearchQuery(hub.query);
                setSelectedCity(hub.city);
                scrollToSearch();
              }}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={hub.image}
                alt={hub.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] bg-blue-600/90 text-white font-bold px-2 py-0.5 rounded-full inline-block backdrop-blur-xs">
                  {hub.count}
                </span>
                <h3 className="font-extrabold text-sm leading-snug group-hover:text-blue-300 transition-colors">
                  {hub.title}
                </h3>
                <p className="text-[11px] text-slate-300 truncate">{hub.location}</p>
                <p className="text-[10px] text-slate-400 truncate italic">🎓 {hub.colleges}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY NHA VERIFIED? (Trust & Protection for Students/Parents) */}
      <section id="why-nha" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-3xl border border-slate-200/80 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-blue-900 uppercase tracking-widest bg-blue-100/60 px-3 py-1 rounded-full">
              Student Welfare Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Book Through the Nepal Hostel Association?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Moving to a new city can be intimidating. NHA enforces strict member guidelines so you get a safe, hygienic, and disciplined study environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Inspected & Certified</h3>
              <p className="text-slate-600 leading-relaxed">
                Regular laboratory testing of RO drinking water, electrical fire safety clearance, and hygienic kitchen standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Nutritious 4-Meal Plan</h3>
              <p className="text-slate-600 leading-relaxed">
                Breakfast, Dal-Bhat lunch, afternoon tea/snacks, and dinner included in your monthly rent. Weekly mess timetable published online.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Zero Broker Commissions</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect and chat directly with branch wardens. No middlemen, no bogus agents, and transparent standard monthly packages.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Official Digital Receipts</h3>
              <p className="text-slate-600 leading-relaxed">
                Instant digital fee invoices with verifiable NHA QR stamps for tax clearance and scholarship fee reimbursement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN DISCOVERY LIST & INTERACTIVE MAP */}
      <section id="hostels-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Available Student Hostels
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing <strong className="text-slate-900">{filteredBranches.length}</strong> accredited properties with real-time vacancies.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'split' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Interactive Map & List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Cards Grid Only
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <HostelFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          selectedGender={selectedGender}
          onGenderChange={setSelectedGender}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          verifiedOnly={verifiedOnly}
          onVerifiedOnlyChange={setVerifiedOnly}
          viewMode={viewMode}
          onViewModeChange={(m) => setViewMode(m === 'grid' ? 'grid' : 'split')}
          resultsCount={filteredBranches.length}
        />

        {/* Content Area */}
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Interactive Leaflet Map */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-2">
              <InteractiveMap
                branches={filteredBranches}
                selectedBranchId={selectedPinBranchId}
                onSelectBranch={(id) => {
                  setSelectedPinBranchId(id);
                  onSelectHostel(id);
                }}
              />
              <p className="text-[11px] text-slate-500 text-center font-medium">
                📍 Click pins to explore verified locations and nearest college gates.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBranches.map((branch) => (
                  <HostelCard
                    key={branch.id}
                    branch={branch}
                    isSelected={selectedPinBranchId === branch.id}
                    onSelect={onSelectHostel}
                    onBook={(b) => setBookingBranch(b)}
                    onChat={onOpenChat}
                  />
                ))}
              </div>

              {filteredBranches.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                  <Building className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="font-extrabold text-slate-800 text-base">No Hostels Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing your keyword or selecting "All Nepal Cities" above.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('all');
                      setSelectedGender('all');
                      setMaxPrice(22000);
                      setVerifiedOnly(false);
                    }}
                    className="px-5 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-xs hover:bg-blue-800 transition-colors"
                  >
                    Reset Search Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBranches.map((branch) => (
              <HostelCard
                key={branch.id}
                branch={branch}
                isSelected={selectedPinBranchId === branch.id}
                onSelect={onSelectHostel}
                onBook={(b) => setBookingBranch(b)}
                onChat={onOpenChat}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. FRESHERS FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-blue-900 uppercase tracking-widest bg-blue-100/60 px-3 py-1 rounded-full">
            Helpful Information
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions by New Students
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">
              What is included in the monthly fee package?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Standard NHA packages include your furnished bed accommodation, 4 hygienic daily meals (morning breakfast, lunch, evening tea/snacks, and dinner), high-speed Wi-Fi internet, hot water, generator electricity backup during power outages, and weekly laundry service.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">
              What are the gate curfew hours for students?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              For student safety, standard gates close at 8:00 PM for girls hostels and 8:30 PM for boys hostels. Students with scheduled college evening lectures, laboratory sessions, or verified jobs can obtain an official curfew extension pass from the branch warden.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">
              Can parents or guardians visit the hostel?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Yes, all member hostels have a designated ground-floor reception visitor lounge open between 4:00 PM and 7:00 PM daily. Visitors must record their entry in the official gate register.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">
              How does the online booking deposit work?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              When booking online, paying an advance deposit (e.g. Rs. 5,000 via eSewa or Khalti) immediately locks your chosen room sharing type and holds your bed. The advance is 100% credited against your first month's invoice upon physical check-in. Offline payment at the hostel counter is also supported.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingBranch && (
        <BookingModal
          isOpen={!!bookingBranch}
          onClose={() => setBookingBranch(null)}
          branch={bookingBranch}
        />
      )}
    </div>
  );
};
