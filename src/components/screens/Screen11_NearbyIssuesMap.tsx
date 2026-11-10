import React, { useState } from 'react';
import {
  ArrowLeft,
  Filter,
  MapPin,
  List,
  Map as MapIcon,
  Navigation,
  ChevronRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Complaint, ComplaintCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { CategoryIcon } from '../common/CategoryIcon';
import { CATEGORIES } from '../../data/categories';

interface Props {
  complaints: Complaint[];
  onBack: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const Screen11_NearbyIssuesMap: React.FC<Props> = ({
  complaints,
  onBack,
  onSelectComplaint
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedId, setSelectedId] = useState<string>(
    complaints[0]?.id || ''
  );

  const filtered = complaints.filter((c) => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    return true;
  });

  const activeComplaint = complaints.find((c) => c.id === selectedId) || filtered[0];

  // Visual coordinates for SVG Village Map Canvas
  // Map bounds roughly around village centroid
  const getCoordinatesForPin = (index: number) => {
    // Generate harmonious points spread across a village map grid
    const points = [
      { x: 38, y: 45 },
      { x: 65, y: 32 },
      { x: 28, y: 70 },
      { x: 72, y: 65 },
      { x: 50, y: 22 },
      { x: 82, y: 48 },
      { x: 20, y: 35 }
    ];
    return points[index % points.length];
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Top Header */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-slate-800">Nearby Issues</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            {viewMode === 'map' ? <List className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
            <span>{viewMode === 'map' ? 'List' : 'Map'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Horizontal Pills */}
      <div className="bg-white/95 backdrop-blur-xs px-4 py-2 border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar z-10">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {Object.values(CATEGORIES).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CategoryIcon category={cat.id} size={13} />
            <span>{cat.shortName}</span>
          </button>
        ))}
      </div>

      {/* Privacy Notice Banner */}
      <div className="px-4 py-1.5 bg-blue-50/90 border-b border-blue-100 flex items-center gap-1.5 text-[10px] text-blue-800 font-medium z-10">
        <Info className="w-3 h-3 text-blue-600 shrink-0" />
        <span>Public Village View: Citizen personal phone and email are kept strictly private.</span>
      </div>

      {/* Content Area */}
      {viewMode === 'map' ? (
        <div className="relative flex-1 w-full h-full bg-[#E5ECE9] overflow-hidden">
          {/* Stylized Village Map Canvas */}
          <svg className="w-full h-full absolute inset-0 select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1DDD6" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Map background terrain */}
            <rect width="100%" height="100%" fill="#E8EFEA" />
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* River / Canal */}
            <path
              d="M-20 180 Q 120 140, 240 220 T 450 190"
              fill="none"
              stroke="#A5C9E1"
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Village Green Fields */}
            <rect x="20" y="80" width="80" height="70" rx="16" fill="#D3E5D4" opacity="0.7" />
            <rect x="220" y="50" width="120" height="80" rx="20" fill="#D3E5D4" opacity="0.7" />
            <rect x="40" y="320" width="140" height="90" rx="20" fill="#D3E5D4" opacity="0.7" />
            <rect x="230" y="290" width="100" height="110" rx="20" fill="#D3E5D4" opacity="0.7" />

            {/* Main Roads */}
            {/* North-South MG Road */}
            <path d="M160 -20 L160 520" stroke="#FFFFFF" strokeWidth="16" />
            <path d="M160 -20 L160 520" stroke="#F1D28C" strokeWidth="12" />
            <path d="M160 -20 L160 520" stroke="#C2A45C" strokeWidth="1" strokeDasharray="6,6" />

            {/* East-West Market Road */}
            <path d="M-20 230 L450 230" stroke="#FFFFFF" strokeWidth="14" />
            <path d="M-20 230 L450 230" stroke="#F1D28C" strokeWidth="10" />

            {/* Cross Village Paths */}
            <path d="M40 90 Q 160 140, 320 100" fill="none" stroke="#FFFFFF" strokeWidth="8" />
            <path d="M160 300 Q 260 330, 350 420" fill="none" stroke="#FFFFFF" strokeWidth="8" />

            {/* Road Labels */}
            <text x="166" y="70" fill="#887349" fontSize="9" fontWeight="bold" transform="rotate(90 166,70)">
              MG ROAD
            </text>
            <text x="40" y="222" fill="#887349" fontSize="9" fontWeight="bold">
              VILLAGE MAIN MARKET ROAD
            </text>
            <text x="50" y="125" fill="#4A7550" fontSize="9" fontWeight="600">
              Gram Panchayat Bhavan
            </text>
            <text x="240" y="95" fill="#4A7550" fontSize="9" fontWeight="600">
              Primary Health Centre
            </text>
          </svg>

          {/* Interactive Pins */}
          {filtered.map((item, idx) => {
            const coords = getCoordinatesForPin(idx);
            const isSelected = item.id === activeComplaint?.id;
            const isHazard = item.category === 'electricity';

            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-full cursor-pointer transition-all z-20 group ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg transition-transform ${
                      isHazard
                        ? 'bg-rose-600 ring-4 ring-rose-200'
                        : isSelected
                        ? 'bg-blue-600 ring-4 ring-blue-200'
                        : 'bg-emerald-600 ring-2 ring-white'
                    }`}
                  >
                    <CategoryIcon category={item.category} size={16} />
                  </div>
                  {/* Pin tail */}
                  <div
                    className={`w-2 h-2 rotate-45 -mt-1 ${
                      isHazard ? 'bg-rose-600' : isSelected ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}
                  />

                  {/* Quick label pill */}
                  <div className="mt-1 px-1.5 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold rounded-md shadow-xs whitespace-nowrap opacity-90">
                    {item.id}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Bottom Sliding Preview Card (Matching Screen 11) */}
          {activeComplaint && (
            <div className="absolute bottom-20 left-4 right-4 z-30 animate-in slide-in-from-bottom-3 duration-200">
              <div
                onClick={() => onSelectComplaint(activeComplaint)}
                className="bg-white rounded-2xl p-3.5 shadow-xl border border-slate-200/90 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                    <CategoryIcon category={activeComplaint.category} size={22} />
                  </div>
                  <div className="min-w-0 pr-1">
                    <h4 className="font-bold text-xs text-slate-900 truncate">
                      {activeComplaint.customCategoryTitle ||
                        activeComplaint.subcategory ||
                        activeComplaint.category.toUpperCase()}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {activeComplaint.address}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                        <Navigation className="w-2.5 h-2.5" /> 120m away
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {activeComplaint.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                  <StatusBadge status={activeComplaint.status} size="sm" />
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List View Mode */
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-400 cursor-pointer shadow-xs transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <CategoryIcon category={item.category} size={18} />
                </div>
                <div className="min-w-0 pr-2">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {item.customCategoryTitle || item.subcategory || item.category}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.address}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <StatusBadge status={item.status} size="sm" />
                <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
