# Nepal Hostel Association (NHA) — Hostel Management & Discovery Platform

**Software Requirements Specification (SRS v2.0) Implementation**  
Operated under the umbrella of the **Nepal Hostel Association (NHA)**.

---

## 🌟 Overview & Architecture

This platform provides an integrated, multi-tenant solution across **three key organizational layers** as detailed in SRS v2.0:

1. **Layer 1: Public Discovery & Booking Portal**
   - **Interactive Map Search (FR-A1.1 - FR-A1.4)**: Real-time map with verified vs unverified markers across Kathmandu, Lalitpur, Bhaktapur, and Pokhara.
   - **Branch Profiles (FR-A2.1 - FR-A2.5)**: High-resolution galleries, live room vacancy tracking, weekly published mess menus, and washroom/toilet sanitation specifications.
   - **Verified Student Reviews (FR-A3.1 - FR-A3.3)**: Resident reviews, category ratings (cleanliness, food, warden), and branch admin response threads.
   - **Pre-Enrollment Chat (FR-A4.1 - FR-A4.3)**: Live chat between prospective scholars and branch wardens.
   - **Wishlist & Booking (FR-A5.1 - FR-A5.6)**: Save hostels for comparison, online reservations with optional advance deposits via eSewa / Khalti simulation, and counter/offline payment support.

2. **Layer 2: Branch Operations Console**
   - **Student Management (FR-B1.1 - FR-B1.4)**: Auto-generated unique Student IDs (`NHA-KTM-001-2026-XXXX`), profile updates, and checkout/archival.
   - **Room Inventory & Capacity Enforcement (FR-B2.1 - FR-B2.4)**: Visual bed occupancy grids with hard capacity limits (`occupied <= capacity`).
   - **Fee Management & Dues (FR-B3.1 - FR-B3.5)**: Reconcile payments, track pending balances, and generate printable official NHA digital receipts with QR codes.
   - **Daily Attendance (FR-B4.1 - FR-B4.2)**: Daily roll calls and biometric device simulation.
   - **Complaints & Maintenance (FR-B5.1 - FR-B5.5)**: Workflow (`Open` ➔ `In Progress` ➔ `Resolved`) with direct **Escalation to NHA**.
   - **Leave & Outing Passes (FR-B6.1 - FR-B6.2)**: Leave applications with parental phone verification checks.
   - **Mess & Security (FR-B7.1 - FR-B7.3)**: 4-tier weekly meal schedules and visitor gate logbooks.
   - **Notice Board & Resident Chat (FR-B8.1 & FR-B9.1)**: Broadcast branch notices and support enrolled residents.
   - **Branch Transfers (FR-B10.1 - FR-B10.2)**: Inter-branch transfer approvals.

3. **Layer 3: Organizational & Oversight Layer**
   - **Hostel Owner Cross-Branch Dashboard (FR-C1.1 - FR-C1.5)**: Combined and per-branch occupancy, collected revenue, outstanding dues, complaint trends, and owner broadcast notices.
   - **NHA Association Governance Console (FR-C2.1 - FR-C2.5)**: Central accreditation, branch certification approval, delinquent branch suspension/delisting, nationwide metrics, escalated grievance review, and national circulars.

---

## 🚀 Running the Platform

Inside the project directory:

```bash
cd C:\Users\mebhu\.gemini\antigravity\scratch\nha-hostel-platform

# Install dependencies (already completed)
npm install

# Start development server
npm run dev

# Or build for production
npm run build
```

---

## 👥 Role-Based Switcher Toolbar

Use the top role switcher bar to immediately test the platform from any actor's perspective:
- **🌐 Prospective Student**: Browse map, filter hostels, view live vacancies & mess menu, chat with warden, submit booking.
- **🎓 Resident Student**: Aarav Shrestha (Room 101) — pay monthly dues via eSewa/Khalti, view printable receipt, submit complaints, apply for leave, request branch transfer.
- **👨‍👩‍👦 Parent / Guardian**: Rameshwor Shrestha — read-only dues, leave records, and direct message line to warden.
- **🏢 Branch Warden**: Keshav Raj Joshi — full operational control over students, rooms, fees, attendance, complaints, and visitor logs.
- **👑 Hostel Owner**: Rajendra Sharma — aggregated cross-branch metrics across Kathmandu, Lalitpur, and Pokhara.
- **🏛️ Nepal Hostel Association (NHA)**: National board console to certify hostels, review escalated complaints, and issue national circulars.
