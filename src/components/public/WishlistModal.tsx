import React from 'react';
import { X, Heart, ShieldCheck, Bed, ArrowRight, Trash2 } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { HostelBranch } from '../../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBranch: (branchId: string) => void;
  onBookBranch: (branch: HostelBranch) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSelectBranch,
  onBookBranch,
}) => {
  const { wishlist, toggleWishlist, branches } = usePlatform();

  if (!isOpen) return null;

  const wishlistedBranches = branches.filter((b) => wishlist.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-base">Saved Hostels Wishlist ({wishlist.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {wishlistedBranches.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Heart className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p>No hostels saved in your wishlist yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Click the heart icon on any hostel card to save it for quick comparison.
              </p>
            </div>
          ) : (
            wishlistedBranches.map((b) => {
              const vacancies = b.totalBeds - b.occupiedBeds;
              return (
                <div
                  key={b.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <img
                      src={b.coverImage}
                      alt={b.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <strong className="text-slate-900 text-sm font-bold">{b.name}</strong>
                        {b.verificationStatus === 'verified' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-slate-500">{b.area}, {b.city}</p>
                      <span className="text-[11px] text-blue-900 font-bold block mt-0.5">
                        Rs. {b.minPrice.toLocaleString()} - {b.maxPrice.toLocaleString()} /mo
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectBranch(b.id);
                      }}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-bold text-slate-800 transition-colors"
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onBookBranch(b);
                      }}
                      className="px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold transition-colors"
                    >
                      Book
                    </button>
                    <button
                      onClick={() => toggleWishlist(b.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
