import React from 'react';
import {
  Eye,
  Bell,
  Menu,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Megaphone,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Complaint, VillageAnnouncement } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { CategoryIcon } from '../common/CategoryIcon';

interface Props {
  complaints: Complaint[];
  announcements: VillageAnnouncement[];
  onViewAllComplaints: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenAnnouncements: () => void;
  onOpenWorkers: () => void;
  onOpenReports: () => void;
  onLogout: () => void;
}

export const Screen15_AdminDashboard: React.FC<Props> = ({
  complaints,
  announcements,
  onViewAllComplaints,
  onSelectComplaint,
  onOpenAnnouncements,
  onOpenWorkers,
  onOpenReports,
  onLogout
}) => {
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'submitted' || c.status === 'verified'
  ).length;
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress').length;
  const completedCount = complaints.filter((c) => c.status === 'resolved').length;

  const urgentHazards = complaints.filter(
    (c) => c.category === 'electricity' && c.status !== 'resolved'
  );

  const recentComplaints = complaints.slice(0, 4);

  return (
    <div className="flex flex-col h-full bg-slate-50/70 overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onViewAllComplaints}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-blue-900">CIVICEYE</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
            Officer
          </span>
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
            title="Sign out of Admin"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Welcome Greeting */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Welcome, Admin!</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gram Panchayat Grievance &amp; Public Infrastructure Desk
          </p>
        </div>

        {/* Urgent Electrical Hazard Warning if any */}
        {urgentHazards.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 text-xs text-red-800">
              <strong className="font-bold block">
                {urgentHazards.length} High-Risk Electrical Hazard Pending!
              </strong>
              <span>Dispatch Lineman emergency service immediately for loose cables / poles.</span>
            </div>
          </div>
        )}

        {/* 4 Stat Metric Cards (Screen 15) */}
        <div className="grid grid-cols-4 gap-2">
          {/* Total */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total</span>
            <span className="text-lg font-extrabold text-slate-900 mt-1">{totalCount}</span>
            <span className="text-[9px] text-slate-400 font-medium">Logged</span>
          </div>

          {/* Pending */}
          <div className="bg-white p-3 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-xs flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase text-amber-600">Pending</span>
            <span className="text-lg font-extrabold text-amber-600 mt-1">{pendingCount}</span>
            <span className="text-[9px] text-amber-600 font-medium">Triage</span>
          </div>

          {/* In Progress */}
          <div className="bg-white p-3 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-xs flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase text-blue-600">In Prog</span>
            <span className="text-lg font-extrabold text-blue-600 mt-1">{inProgressCount}</span>
            <span className="text-[9px] text-blue-600 font-medium">Active</span>
          </div>

          {/* Completed */}
          <div className="bg-white p-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs flex flex-col items-center text-center">
            <span className="text-[10px] font-bold uppercase text-emerald-600">Resolved</span>
            <span className="text-lg font-extrabold text-emerald-600 mt-1">{completedCount}</span>
            <span className="text-[9px] text-emerald-600 font-medium">Closed</span>
          </div>
        </div>

        {/* Admin Quick Action Shortcuts */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={onViewAllComplaints}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">Complaints</span>
            <span className="text-[10px] text-slate-400">All wards</span>
          </button>

          <button
            onClick={onOpenWorkers}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-left hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">Workers</span>
            <span className="text-[10px] text-slate-400">Lineman, crew</span>
          </button>

          <button
            onClick={onOpenAnnouncements}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-left hover:border-purple-400 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <Megaphone className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">Notices</span>
            <span className="text-[10px] text-slate-400">Broadcasts</span>
          </button>
        </div>

        {/* Recent Complaints Section (Screen 15) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-bold text-sm text-slate-900">Recent Complaints</h3>
            <button
              onClick={onViewAllComplaints}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {recentComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-400 cursor-pointer shadow-xs transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <CategoryIcon category={item.category} size={18} />
                  </div>
                  <div className="min-w-0 pr-1">
                    <h4 className="font-bold text-xs text-slate-900 truncate">
                      {item.customCategoryTitle || item.subcategory || item.category}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-bold text-blue-600 font-mono">
                        {item.id}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                        {item.address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <StatusBadge status={item.status} size="sm" />
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
