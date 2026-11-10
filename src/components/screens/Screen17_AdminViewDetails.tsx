import React from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Phone,
  Shield,
  Wrench,
  AlertTriangle,
  CheckCircle,
  FileEdit,
  CheckCheck
} from 'lucide-react';
import { Complaint } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { CATEGORIES } from '../../data/categories';

interface Props {
  complaint: Complaint;
  onBack: () => void;
  onOpenAssignModal: () => void;
  onOpenCompleteModal: () => void;
}

export const Screen17_AdminViewDetails: React.FC<Props> = ({
  complaint,
  onBack,
  onOpenAssignModal,
  onOpenCompleteModal
}) => {
  const catInfo = CATEGORIES[complaint.category];
  const isResolved = complaint.status === 'resolved';

  return (
    <div className="flex flex-col h-full bg-slate-50/70 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-slate-800">Complaint Details</h2>
        </div>
        <StatusBadge status={complaint.status} size="sm" />
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Photo Preview */}
        <div className="relative w-full h-52 bg-slate-900">
          <img
            src={
              complaint.imageUrls[0] ||
              'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
            }
            alt="Complaint"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <span className="font-mono text-xs font-bold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                {complaint.id}
              </span>
              <h3 className="text-base font-extrabold mt-1 text-white drop-shadow-sm">
                {complaint.customCategoryTitle || complaint.subcategory || catInfo?.name}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-white bg-blue-600/90 px-2 py-0.5 rounded-full">
              {complaint.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Electrical Hazard Banner */}
          {complaint.category === 'electricity' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-800">
                <strong className="font-bold block">Urgent Electrical Problem:</strong>
                Verify power disconnect status before dispatching repair staff.
              </div>
            </div>
          )}

          {/* Details Card (Screen 17) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Problem Type
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {catInfo?.name} {complaint.subcategory ? `• ${complaint.subcategory}` : ''}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Location
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  {complaint.address} ({complaint.ward})
                </span>
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Description
              </span>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {complaint.description}
              </p>
            </div>

            {/* Submitter Info Card (Admin visible) */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                Submitted By (Resident Verification)
              </span>
              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  {complaint.citizenName}
                </span>
                <a
                  href={`tel:${complaint.citizenPhone}`}
                  className="font-bold text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Phone className="w-3 h-3" />
                  {complaint.citizenPhone}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Department</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                  {complaint.assignedDepartment || catInfo?.department}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Assigned Worker
                </span>
                <p className="text-xs font-semibold text-blue-700 mt-0.5 truncate flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-blue-500 shrink-0" />
                  {complaint.assignedWorkerName || 'Unassigned'}
                </p>
              </div>
            </div>

            {complaint.adminNotes && (
              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900">
                <strong className="font-bold block text-[10px] uppercase">Officer Internal Note:</strong>
                <span>{complaint.adminNotes}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons at Bottom (Screen 17) */}
      <div className="p-4 bg-white border-t border-slate-100 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20 flex gap-2">
        <button
          onClick={onOpenAssignModal}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
        >
          <FileEdit className="w-4 h-4" />
          <span>Assign / Update Status</span>
        </button>

        {!isResolved && (
          <button
            onClick={onOpenCompleteModal}
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark Resolved</span>
          </button>
        )}
      </div>
    </div>
  );
};
