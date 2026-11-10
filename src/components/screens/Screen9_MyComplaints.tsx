import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Plus, FileText, ChevronRight } from 'lucide-react';
import { Complaint } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { StatusBadge } from '../common/StatusBadge';

interface Props {
  complaints: Complaint[];
  onBack: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onNewComplaint: () => void;
}

export const Screen9_MyComplaints: React.FC<Props> = ({
  complaints,
  onBack,
  onSelectComplaint,
  onNewComplaint
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'submitted' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filtered = complaints.filter((item) => {
    // Filter tab
    if (activeTab === 'submitted') {
      if (item.status !== 'submitted' && item.status !== 'verified') return false;
    } else if (activeTab === 'in_progress') {
      if (item.status !== 'in_progress') return false;
    } else if (activeTab === 'resolved') {
      if (item.status !== 'resolved') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = item.id.toLowerCase().includes(q);
      const matchTitle = (item.customCategoryTitle || item.subcategory || item.category).toLowerCase().includes(q);
      const matchAddr = item.address.toLowerCase().includes(q);
      return matchId || matchTitle || matchAddr;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50/70 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-slate-800">My Complaints</h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full transition-colors ${
              showSearch ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar (Collapsible) */}
      {showSearch && (
        <div className="p-3 bg-white border-b border-slate-100 animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Complaint ID or keyword..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white px-4 py-2 border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All' },
          { id: 'submitted', label: 'Pending' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'resolved', label: 'Completed' }
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

      {/* Complaints List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <FileText className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-sm text-slate-700">No complaints found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              No complaints match the selected filter.
            </p>
            <button
              onClick={onNewComplaint}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Report an Issue
            </button>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectComplaint(item)}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-xs">
                  <CategoryIcon category={item.category} size={20} />
                </div>
                <div className="min-w-0 pr-2">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {item.customCategoryTitle || item.subcategory || item.category.toUpperCase()}
                  </h4>
                  <p className="text-[11px] font-bold text-blue-600 font-mono mt-0.5">{item.id}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.address}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <StatusBadge status={item.status} size="sm" />
                <span className="text-[10px] text-slate-400 font-medium">
                  {new Date(item.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button to Report */}
      <button
        onClick={onNewComplaint}
        className="fixed bottom-20 right-6 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center transition-all z-20"
        title="Report New Complaint"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
};
