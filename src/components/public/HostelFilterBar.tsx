import React from 'react';
import { Search, SlidersHorizontal, Map, Grid, ShieldCheck } from 'lucide-react';
import { GenderPolicy } from '../../types';

interface HostelFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCity: string;
  onCityChange: (c: string) => void;
  selectedGender: GenderPolicy | 'all';
  onGenderChange: (g: GenderPolicy | 'all') => void;
  maxPrice: number;
  onMaxPriceChange: (p: number) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (v: boolean) => void;
  viewMode: 'grid' | 'map' | 'split';
  onViewModeChange: (mode: 'grid' | 'map' | 'split') => void;
  resultsCount: number;
}

export const HostelFilterBar: React.FC<HostelFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedGender,
  onGenderChange,
  maxPrice,
  onMaxPriceChange,
  verifiedOnly,
  onVerifiedOnlyChange,
  viewMode,
  onViewModeChange,
  resultsCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-3.5 mb-6">
      {/* Top Search & Primary Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Keyword Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by college (Apex, Pulchowk, TU), area, or hostel name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>

        {/* City Filter */}
        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">All Cities (Nepal)</option>
          <option value="Kathmandu">Kathmandu</option>
          <option value="Lalitpur">Lalitpur</option>
          <option value="Bhaktapur">Bhaktapur</option>
          <option value="Pokhara">Pokhara</option>
        </select>

        {/* Gender Policy Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {(['all', 'boys', 'girls', 'co-ed'] as const).map((gender) => (
            <button
              key={gender}
              onClick={() => onGenderChange(gender)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                selectedGender === gender
                  ? 'bg-white text-blue-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => onViewModeChange('split')}
            className={`p-1.5 rounded-lg text-xs flex items-center space-x-1 font-semibold ${
              viewMode === 'split' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
            }`}
            title="Split Map & Grid"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Split</span>
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg text-xs flex items-center space-x-1 font-semibold ${
              viewMode === 'grid' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600'
            }`}
            title="Grid Only"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Verified Filter & Price Range */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <span className="font-bold text-slate-800 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NHA Verified Only</span>
            </span>
          </label>

          <span className="text-slate-300">|</span>

          {/* Price Range Slider */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Max Budget:</span>
            <input
              type="range"
              min="11000"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-28 accent-blue-900 cursor-pointer"
            />
            <span className="font-bold text-slate-800">Rs. {maxPrice.toLocaleString()}/mo</span>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{resultsCount}</span> hostel branches
        </div>
      </div>
    </div>
  );
};
