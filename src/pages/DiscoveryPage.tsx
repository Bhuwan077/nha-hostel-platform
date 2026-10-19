import React, { useState, useMemo } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { HostelBranch, GenderPolicy } from '../types';
import { HostelCard } from '../components/public/HostelCard';
import { HostelFilterBar } from '../components/public/HostelFilterBar';
import { InteractiveMap } from '../components/public/InteractiveMap';
import { BookingModal } from '../components/public/BookingModal';
import { ShieldCheck, Search, Sparkles, Building, MapPin } from 'lucide-react';

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

  // Interactive Map selection
  const [selectedPinBranchId, setSelectedPinBranchId] = useState<string | null>(null);

  // Booking Modal
  const [bookingBranch, setBookingBranch] = useState<HostelBranch | null>(null);

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      // Exclude suspended listings
      if (b.verificationStatus === 'suspended') return false;

      // Keyword search (FR-A1.3)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(query);
        const matchesArea = b.area.toLowerCase().includes(query);
        const matchesLandmark = b.landmark.toLowerCase().includes(query);
        const matchesCity = b.city.toLowerCase().includes(query);
        if (!matchesName && !matchesArea && !matchesLandmark && !matchesCity) {
          return false;
        }
      }

      // City
      if (selectedCity !== 'all' && b.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Gender (FR-A1.2)
      if (selectedGender !== 'all' && b.genderPolicy !== selectedGender) {
        return false;
      }

      // Price (FR-A1.2)
      if (b.minPrice > maxPrice) {
        return false;
      }

      // NHA Verified filter (FR-A1.4)
      if (verifiedOnly && b.verificationStatus !== 'verified') {
        return false;
      }

      return true;
    });
  }, [branches, searchQuery, selectedCity, selectedGender, maxPrice, verifiedOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Nepal Hostel Association Official Public Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Safe, Verified Student Residences Across Nepal
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Discover verified member hostels near top colleges in Kathmandu, Lalitpur, Bhaktapur, and Pokhara. Compare live room vacancies, authentic mess menus, and verified resident ratings.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">🎓 Near Apex & St. Xavier's</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">⚙️ Opposite Pulchowk Campus</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">📚 Close to Tribhuvan University</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">🏔️ Pokhara Lakeside Hub</span>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
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

      {/* Main View Area: Split or Grid */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Map (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <InteractiveMap
              branches={filteredBranches}
              selectedBranchId={selectedPinBranchId}
              onSelectBranch={(id) => {
                setSelectedPinBranchId(id);
                onSelectHostel(id);
              }}
            />
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
                <Building className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">No Hostels Match Your Filter Criteria</h3>
                <p className="text-xs text-slate-500">
                  Try adjusting the maximum price or selecting "All Cities".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('all');
                    setSelectedGender('all');
                    setMaxPrice(22000);
                    setVerifiedOnly(false);
                  }}
                  className="px-4 py-2 bg-blue-900 text-white font-bold rounded-xl text-xs"
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
