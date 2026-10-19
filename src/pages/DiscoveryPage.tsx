import React, { useState, useMemo } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { HostelBranch, GenderPolicy } from '../types';
import { HostelCard } from '../components/public/HostelCard';
import { HostelFilterBar } from '../components/public/HostelFilterBar';
import { InteractiveMap } from '../components/public/InteractiveMap';
import { BookingModal } from '../components/public/BookingModal';
import { ShieldCheck, Search, Sparkles, Building, MapPin, CheckCircle2, Award, Zap } from 'lucide-react';

interface DiscoveryPageProps {
  onSelectHostel: (branchId: string) => void;
  onOpenChat: (branch: HostelBranch) => void;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({
  onSelectHostel,
  onOpenChat,
}) => {
  const { branches } = usePlatform();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedGender, setSelectedGender] = useState<GenderPolicy | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState(22000);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'split'>('split');

  // Map selection
  const [selectedPinBranchId, setSelectedPinBranchId] = useState<string | null>(null);

  // Booking Modal
  const [bookingBranch, setBookingBranch] = useState<HostelBranch | null>(null);

  // Quick preset chips
  const quickFilterPresets = [
    { label: '⚙️ Pulchowk Engineering Campus', query: 'pulchowk' },
    { label: '🎓 New Baneshwor (Apex / St. Xaviers)', query: 'baneshwor' },
    { label: '📚 Tribhuvan University (Kirtipur)', query: 'kirtipur' },
    { label: '👩 Girls Hostels Only', gender: 'girls' as const },
    { label: '🏔️ Pokhara Lakeside', city: 'Pokhara' },
    { label: '✓ NHA Certified Only', verified: true },
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

  const totalBeds = branches.reduce((sum, b) => sum + b.totalBeds, 0);
  const totalVacant = branches.reduce((sum, b) => sum + (b.totalBeds - b.occupiedBeds), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Banner with Rich Nepal Theme */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-8 md:p-12 overflow-hidden shadow-2xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Nepal Hostel Association Public Directory & Registry</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Verified, Safe & Certified Student Hostels in Nepal
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Compare accredited hostels near Tribhuvan University, IOE Pulchowk, St. Xavier's, and Pokhara. Verified room vacancies, live mess menus, transparent fee ledgers, and secure eSewa/Khalti booking advance.
          </p>

          {/* Live Stats Pill Row */}
          <div className="pt-2 flex flex-wrap gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2">
              <Building className="w-4 h-4 text-blue-300" />
              <span><strong>{branches.length}</strong> Registered Properties</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span><strong>{totalVacant}</strong> Beds Open for Nov 2026</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>24/7 Solar & Power Backup</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/20 via-indigo-500/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Quick Filter Preset Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
          Quick Filters:
        </span>
        {quickFilterPresets.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (chip.query) setSearchQuery(chip.query);
              if (chip.gender) setSelectedGender(chip.gender);
              if (chip.city) setSelectedCity(chip.city);
              if (chip.verified) setVerifiedOnly(true);
            }}
            className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold text-slate-700 whitespace-nowrap transition-colors shadow-xs"
          >
            {chip.label}
          </button>
        ))}
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
        onViewModeChange={setViewMode}
        resultsCount={filteredBranches.length}
      />

      {/* Main View: Split Map & Cards or Full Grid */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Map */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-3">
            <InteractiveMap
              branches={filteredBranches}
              selectedBranchId={selectedPinBranchId}
              onSelectBranch={(id) => {
                setSelectedPinBranchId(id);
                onSelectHostel(id);
              }}
            />
            <p className="text-[11px] text-slate-400 text-center">
              📍 Click any map pin to view instant vacancy and room rates.
            </p>
          </div>

          {/* Cards Column */}
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
                <h3 className="font-extrabold text-slate-800 text-base">No Hostels Match Your Criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the maximum budget or clearing your keyword filter.
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
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Full Grid View */
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
