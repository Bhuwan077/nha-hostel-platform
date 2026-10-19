import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { HostelBranch } from '../../types';
import { ShieldCheck, MapPin, Bed, Star } from 'lucide-react';

interface InteractiveMapProps {
  branches: HostelBranch[];
  selectedBranchId: string | null;
  onSelectBranch: (branchId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
}) => {
  // Center roughly in Kathmandu Valley
  const centerLat = 27.695;
  const centerLng = 85.325;

  const createCustomIcon = (isVerified: boolean, isSelected: boolean) => {
    const bgColor = isVerified ? '#059669' : '#D97706';
    const ring = isSelected ? 'box-shadow: 0 0 0 4px #1E3A8A, 0 8px 16px rgba(0,0,0,0.3);' : 'box-shadow: 0 4px 6px rgba(0,0,0,0.2);';

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          background-color: ${bgColor};
          width: 34px;
          height: 34px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          ${ring}
          transition: transform 0.2s ease;
        ">
          <div style="transform: rotate(45deg); color: white; font-size: 14px; font-weight: bold;">
            ${isVerified ? '✓' : '!'}
          </div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -34],
    });
  };

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      {/* Map Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-200/80 text-xs space-y-1.5">
        <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">NHA Accreditation</span>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white flex items-center justify-center text-[9px] text-white font-bold">✓</div>
          <span className="text-slate-700 font-medium">NHA Verified Member</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white flex items-center justify-center text-[9px] text-white font-bold">!</div>
          <span className="text-slate-700 font-medium">Certification Pending</span>
        </div>
      </div>

      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {branches.map((branch) => {
          const isVerified = branch.verificationStatus === 'verified';
          const isSelected = selectedBranchId === branch.id;
          const vacancies = branch.totalBeds - branch.occupiedBeds;

          return (
            <Marker
              key={branch.id}
              position={[branch.latitude, branch.longitude]}
              icon={createCustomIcon(isVerified, isSelected)}
              eventHandlers={{
                click: () => onSelectBranch(branch.id),
              }}
            >
              <Popup>
                <div className="p-1 max-w-[220px]">
                  <div className="flex items-center space-x-1.5 mb-1">
                    {isVerified ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>NHA Verified</span>
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Pending NHA Audit
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {branch.genderPolicy}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">
                    {branch.name}
                  </h4>
                  <p className="text-xs text-slate-600 mb-2">{branch.area}, {branch.city}</p>

                  <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100">
                    <span className="flex items-center space-x-1 text-slate-700">
                      <Bed className="w-3.5 h-3.5 text-blue-600" />
                      <span>{vacancies} Vacant Beds</span>
                    </span>
                    <span className="font-bold text-blue-900">
                      Rs. {branch.minPrice.toLocaleString()}/mo
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectBranch(branch.id)}
                    className="w-full mt-2 py-1 text-center bg-blue-900 hover:bg-blue-800 text-white rounded-md text-xs font-semibold transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
