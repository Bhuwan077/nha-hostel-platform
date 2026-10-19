import React from 'react';
import { Building, ShieldCheck, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Building className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base">Nepal Hostel Association</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The apex representative and accreditation body protecting student welfare, maintaining hygiene standards, and streamlining hostel management across Nepal.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Standard Operating Guidelines (SOP 2083)</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Public Portals</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Kathmandu Valley Hostels</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lalitpur / Pulchowk Hubs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pokhara Academic Residences</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NHA Verified Badge Criteria</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Code of Conduct & Curfew Rules</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Member Operations</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Hostel Owner Registration</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Warden Biometric Attendance SOP</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Food Hygiene & Mess Inspection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Grievance Escalation Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Digital Fee Collection API</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Headquarters & Helplines</h4>
            <div className="space-y-2 text-slate-400 text-[11px]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>NHA Central Secretariat, Babar Mahal, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Emergency Student Hotline: 1660-01-HOSTEL (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>compliance@nepalhostelassociation.org.np</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>© 2026 Nepal Hostel Association (NHA). All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built according to IEEE Std 830-1998 SRS v2.0 Specifications</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
