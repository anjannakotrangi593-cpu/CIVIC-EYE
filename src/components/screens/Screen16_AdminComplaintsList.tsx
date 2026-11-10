import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, ChevronRight, X, Sparkles } from 'lucide-react';
import { Complaint, ComplaintCategory } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { StatusBadge } from '../common/StatusBadge';
import { CATEGORIES } from '../../data/categories';

interface Props {
  complaints: Complaint[];
  onBack: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const Screen16_AdminComplaintsList: React.FC<Props> = ({
  complaints,
  onBack,
  onSelectComplaint
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = complaints.filter((item) => {
    // Status tab filter
    if (activeTab === 'pending') {
      if (item.status !== 'submitted' && item.status !== 'verified') return false;
    } else if (activeTab === 'in_progress') {
      if (item.status !== 'in_progress') return false;
    } else if (activeTab === 'completed') {
      if (item.status !== 'resolved') return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchCitizen = item.citizenName.toLowerCase().includes(q);
      const matchPhone = item.citizenPhone.includes(q);
      const matchAddress = item.address.toLowerCase().includes(q);
      const matchTitle = (item.customCategoryTitle || item.subcategory || item.category).toLowerCase().includes(q);
      return matchId || matchCitizen || matchPhone || matchAddress || matchTitle;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50/70 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-slate-800">All Complaints</h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-full transition-colors ${
              showFilters ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Filter by category"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-3 bg-white border-b border-slate-100">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, citizen name, phone, locality..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-medium text-slate-800 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs (Screen 16) */}
      <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Dropdown if filter opened */}
      {showFilters && (
        <div className="p-3 bg-blue-50/50 border-b border-blue-100 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
          <span className="font-bold text-slate-700">Category Filter:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 outline-none"
          >
            <option value="all">All Categories</option>
            {Object.values(CATEGORIES).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Complaints List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 pb-24">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <p className="text-xs font-semibold">No complaints found</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-400 cursor-pointer shadow-xs transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-xs">
                  <CategoryIcon category={item.category} size={20} />
                </div>
                <div className="min-w-0 pr-1">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {item.customCategoryTitle || item.subcategory || item.category}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-bold text-blue-600 font-mono">
                      {item.id}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
                      {item.address}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    By: <strong className="text-slate-600 font-semibold">{item.citizenName}</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <StatusBadge status={item.status} size="sm" />
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(item.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
