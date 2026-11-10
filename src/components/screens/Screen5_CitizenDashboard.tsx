import React from 'react';
import {
  Eye,
  Bell,
  FilePlus,
  FileText,
  MapPin,
  PhoneCall,
  ChevronRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { Complaint, VillageAnnouncement } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { StatusBadge } from '../common/StatusBadge';

interface Props {
  complaints: Complaint[];
  unreadNotifsCount: number;
  announcements: VillageAnnouncement[];
  onReportIssue: () => void;
  onViewMyComplaints: () => void;
  onViewNearbyIssues: () => void;
  onOpenEmergency: () => void;
  onOpenNotifications: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

export const Screen5_CitizenDashboard: React.FC<Props> = ({
  complaints,
  unreadNotifsCount,
  announcements,
  onReportIssue,
  onViewMyComplaints,
  onViewNearbyIssues,
  onOpenEmergency,
  onOpenNotifications,
  onSelectComplaint
}) => {
  const recentComplaints = complaints.slice(0, 3);
  const activeNotice = announcements.length > 0 ? announcements[0] : null;

  return (
    <div className="flex flex-col h-full bg-slate-50/60 overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="bg-white px-5 pt-3 pb-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Eye className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-blue-900">CIVICEYE</span>
        </div>

        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Village Notice Banner if active */}
        {activeNotice && (
          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded-md">
                Panchayat Notice
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{activeNotice.title}</h4>
              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{activeNotice.message}</p>
            </div>
          </div>
        )}

        {/* Hero Greeting Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-md shadow-blue-600/20">
          <div className="relative z-10 max-w-[65%]">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/15 rounded-full text-[10px] font-semibold text-blue-100 mb-2">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Smart Village Portal</span>
            </div>
            <h2 className="text-base font-extrabold leading-snug">
              Help us keep our village clean &amp; safe
            </h2>
            <p className="text-xs text-blue-100/90 mt-1">
              Report civic issues in your ward with GPS and instant tracking.
            </p>
          </div>

          {/* Hero Illustration / Icon */}
          <div className="absolute -right-2 -bottom-2 w-28 h-28 opacity-90 pointer-events-none flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
              <div className="w-18 h-18 rounded-full bg-white/20 flex items-center justify-center text-white">
                <FilePlus className="w-10 h-10 stroke-[1.75]" />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quick Action Cards (2x2 Grid) */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Report an Issue */}
            <button
              onClick={onReportIssue}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Report an Issue</h3>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 mt-0.5">
                  Report Now <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>

            {/* 2. My Complaints */}
            <button
              onClick={onViewMyComplaints}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">My Complaints</h3>
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 mt-0.5">
                  View Status <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>

            {/* 3. Nearby Issues */}
            <button
              onClick={onViewNearbyIssues}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-sky-500 hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Nearby Issues</h3>
                <span className="text-xs font-semibold text-sky-600 flex items-center gap-1 mt-0.5">
                  See Around <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>

            {/* 4. Emergency */}
            <button
              onClick={onOpenEmergency}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-red-500 hover:shadow-md transition-all text-left flex flex-col justify-between group active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:bg-red-500 group-hover:text-white transition-colors shadow-xs">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Emergency</h3>
                <span className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-0.5">
                  Call Now <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Complaints Section */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-bold text-sm text-slate-800">Recent Complaints</h3>
            <button
              onClick={onViewMyComplaints}
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
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <CategoryIcon category={item.category} size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 truncate">
                      {item.customCategoryTitle || item.subcategory || item.category.toUpperCase()}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{item.id}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                  <StatusBadge status={item.status} size="sm" />
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
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
