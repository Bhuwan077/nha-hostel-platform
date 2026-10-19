import React, { useState } from 'react';
import { ShieldCheck, Heart, MapPin, Bed, Star, MessageSquare, ArrowRight, Check } from 'lucide-react';
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

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col group ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xl'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
      }`}
    >
      {/* Image & Badges */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={branch.coverImage}
          alt={branch.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-1.5 pointer-events-auto">
            {isVerified ? (
              <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NHA Verified</span>
              </span>
            ) : (
              <span className="bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                Pending NHA Audit
              </span>
            )}

            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-md">
              {branch.genderPolicy}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(branch.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all pointer-events-auto shadow-md ${
              isWishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Vacancy tag at bottom of photo */}
        <div className="absolute bottom-2 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] px-2.5 py-0.5 rounded-lg font-medium flex items-center space-x-1">
          <Bed className="w-3 h-3 text-emerald-400" />
          <span>
            {vacancies > 0 ? (
              <strong className="text-emerald-400">{vacancies} beds available</strong>
            ) : (
              <span className="text-amber-400">Waitlist Only</span>
            )}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-900 transition-colors">
              {branch.name}
            </h3>
            <div className="flex items-center space-x-1 text-xs bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-bold text-amber-900">{branch.rating}</span>
              <span className="text-slate-400 text-[10px]">({branch.reviewsCount})</span>
            </div>
          </div>

          <div className="flex items-center text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
            <span className="truncate">{branch.area}, {branch.city}</span>
          </div>

          <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-1 italic">
            📍 {branch.landmark}
          </p>

          {/* Quick Amenities */}
          <div className="flex flex-wrap gap-1 mt-3">
            {branch.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
              >
                {amenity}
              </span>
            ))}
            {branch.amenities.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium py-0.5">
                +{branch.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Footer Actions */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Packages</span>
              <span className="text-base font-extrabold text-slate-900">
                Rs. {branch.minPrice.toLocaleString()} - {branch.maxPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 font-normal"> /month (incl. food)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSelect(branch.id)}
              className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => onChat(branch)}
              className="py-2 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
              title="Chat with Warden"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => onBook(branch)}
              className="py-2 px-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold text-center transition-colors shadow-sm"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
