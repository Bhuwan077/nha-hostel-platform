import React, { useState } from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { HostelDetailPage } from './pages/HostelDetailPage';
import { BranchAdminPage } from './pages/BranchAdminPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { ParentPortalPage } from './pages/ParentPortalPage';
import { OwnerConsolePage } from './pages/OwnerConsolePage';
import { NhaConsolePage } from './pages/NhaConsolePage';
import { ChatDrawer } from './components/common/ChatDrawer';
import { WishlistModal } from './components/public/WishlistModal';
import { BookingModal } from './components/public/BookingModal';
import { HostelBranch } from './types';

const PlatformApp: React.FC = () => {
  const { currentRole, branches } = usePlatform();

  const [selectedHostelId, setSelectedHostelId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatBranchId, setChatBranchId] = useState<string | undefined>(undefined);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeBookingBranch, setActiveBookingBranch] = useState<HostelBranch | null>(null);

  const handleOpenChat = (branch?: HostelBranch) => {
    if (branch) {
      setChatBranchId(branch.id);
    }
    setIsChatOpen(true);
  };

  const handleSelectHostel = (branchId: string) => {
    setSelectedHostelId(branchId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* SRS Role Switcher */}
      <RoleSwitcherBar />

      {/* Main Header */}
      <Navbar
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenChat={() => handleOpenChat()}
        onNavigateHome={() => setSelectedHostelId(null)}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {currentRole === 'public' && (
          selectedHostelId ? (
            <HostelDetailPage
              branchId={selectedHostelId}
              onBack={() => setSelectedHostelId(null)}
              onOpenChat={handleOpenChat}
            />
          ) : (
            <DiscoveryPage
              onSelectHostel={handleSelectHostel}
              onOpenChat={handleOpenChat}
            />
          )
        )}

        {currentRole === 'student' && <StudentPortalPage />}
        {currentRole === 'parent' && <ParentPortalPage />}
        {currentRole === 'warden' && <BranchAdminPage />}
        {currentRole === 'owner' && <OwnerConsolePage />}
        {currentRole === 'nha' && <NhaConsolePage />}
      </main>

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        branchId={chatBranchId}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onSelectBranch={(id) => {
          setSelectedHostelId(id);
          setIsWishlistOpen(false);
        }}
        onBookBranch={(b) => {
          setIsWishlistOpen(false);
          setActiveBookingBranch(b);
        }}
      />

      {/* Direct Booking Modal if triggered from wishlist */}
      {activeBookingBranch && (
        <BookingModal
          isOpen={!!activeBookingBranch}
          onClose={() => setActiveBookingBranch(null)}
          branch={activeBookingBranch}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <PlatformApp />
    </PlatformProvider>
  );
}
