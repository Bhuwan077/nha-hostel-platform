import React, { useState } from 'react';
import { ShieldCheck, Heart, MapPin, Bed, Star, MessageSquare, ArrowRight, Check, Zap, Sparkles } from 'lucide-react';
import { HostelBranch } from '../../types';
import { usePlatform } from '../../context/PlatformContext';

interface HostelCardProps {
  branch: HostelBranch;
  onSelect: (branchId: string) => void;
  onBook: (branch: HostelBranch) => void;
  onChat: (branch: HostelBranch) => void;
  isSelected?: boolean;
}

export const HostelCard: React.FC<HostelCardProps> = ({
  branch,
  onSelect,
  onBook,
  onChat,
  isSelected,
}) => {
  const { wishlist, toggleWishlist } = usePlatform();
  const isWishlisted = wishlist.includes(branch.id);
  const isVerified = branch.verificationStatus === 'verified';
  const vacancies = branch.totalBeds - branch.occupiedBeds;
  const occupancyPct = Math.round((branch.occupiedBeds / branch.totalBeds) * 100);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col group ${
        isSelected
          ? 'border-blue-600 ring-4 ring-blue-500/15 shadow-2xl scale-[1.01]'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-xl'
      }`}
    >
      {/* Image Container with Badges */}
      <div className="relative h-52 overflow-hidden bg-slate-900">
        <img
          src={branch.photos[activePhotoIdx] || branch.coverImage}
          alt={branch.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            {isVerified ? (
              <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                <span>NHA Verified</span>
              </span>
            ) : (
              <span className="bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md border border-amber-300/30">
                Audit Pending
              </span>
            )}

            <span className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-full shadow-md border border-white/10 tracking-wider">
              {branch.genderPolicy}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(branch.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
              isWishlisted
                ? 'bg-rose-500 text-white scale-110 ring-2 ring-white/50'
                : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Photo Switcher Dots */}
        {branch.photos.length > 1 && (
          <div className="absolute top-14 right-3.5 flex flex-col space-y-1 z-10">
            {branch.photos.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  activePhotoIdx === idx ? 'bg-white scale-125 ring-1 ring-black/40' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom Banner on Photo */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <Bed className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-[11px]">
              {vacancies > 0 ? (
                <span className="text-emerald-300">{vacancies} beds available</span>
              ) : (
                <span className="text-amber-300">Waitlist queue</span>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-amber-400/95 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-md">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{branch.rating}</span>
            <span className="text-slate-800 text-[10px] font-normal">({branch.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          <h3
            onClick={() => onSelect(branch.id)}
            className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-blue-900 transition-colors cursor-pointer"
          >
            {branch.name}
          </h3>

          <div className="flex items-center text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
            <span className="truncate">{branch.area}, {branch.city}</span>
          </div>

          <p className="text-[11px] text-blue-900/80 font-medium mt-1 truncate bg-blue-50/70 p-1.5 rounded-lg border border-blue-100/60">
            📍 {branch.landmark}
          </p>

          {/* Key Amenities Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {branch.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200/50"
              >
                {amenity}
              </span>
            ))}
            {branch.amenities.length > 3 && (
              <span className="text-[10px] text-slate-400 font-semibold py-0.5">
                +{branch.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing, Occupancy Gauge & Actions */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Monthly Package (4 Meals)
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-black text-slate-900">
                  Rs. {branch.minPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  - {branch.maxPrice.toLocaleString()}/mo
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-500">
              <span>{occupancyPct}% full</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSelect(branch.id)}
              className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center transition-colors"
            >
              Full Profile
            </button>
            <button
              onClick={() => onChat(branch)}
              className="py-2.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-colors border border-blue-100"
              title="Chat directly with Warden"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => onBook(branch)}
              className="py-2.5 px-2 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold text-center transition-all shadow-md shadow-blue-950/20"
            >
              Book Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
