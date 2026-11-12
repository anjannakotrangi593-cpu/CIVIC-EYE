import React, { useState } from 'react';
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
  CheckCheck,
  RotateCcw,
  Eye,
  Check,
  Send,
  XCircle,
  FileText
} from 'lucide-react';
import { Complaint, ProgressUpdate } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { CATEGORIES } from '../../data/categories';
import { INITIAL_COMPLAINTS } from '../../data/seedData';
import { storage } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

interface Props {
  complaint?: Complaint | null;
  onBack: () => void;
  onOpenAssignModal: () => void;
  onOpenCompleteModal: () => void;
}

export const Screen17_AdminViewDetails: React.FC<Props> = ({
  complaint: propComplaint,
  onBack,
  onOpenAssignModal,
  onOpenCompleteModal
}) => {
  const { user } = useAuth();
  const currentComplaint = propComplaint || INITIAL_COMPLAINTS[0];
  const catInfo = CATEGORIES[currentComplaint.category] || CATEGORIES.garbage;
  const isResolved = currentComplaint.status === 'resolved';

  // Completion Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'rework'>('approve');
  const [reviewFeedback, setReviewFeedback] = useState('');

  const adminName = user?.name || 'Panchayat Officer Anil Verma';

  const handleVerifyProgress = (updateId: string) => {
    storage.verifyProgressUpdate(currentComplaint.id, updateId, adminName);
  };

  const handleReviewReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.reviewCompletionReport(
      currentComplaint.id,
      adminName,
      reviewAction,
      reviewFeedback.trim()
    );
    setShowReviewModal(false);
    setReviewFeedback('');
  };

  const report = currentComplaint.completionReport;
  const progressList = currentComplaint.progressUpdates || [];

  return (
    <div className="flex flex-col h-full bg-slate-50/70 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-slate-800">Admin Complaint Details</h2>
        </div>
        <StatusBadge status={currentComplaint.status} size="sm" />
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
        {/* Photo Preview */}
        <div className="relative w-full h-52 bg-slate-900">
          <img
            src={
              currentComplaint.imageUrls[0] ||
              'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
            }
            alt="Complaint"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <span className="font-mono text-xs font-bold bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20">
                {currentComplaint.id}
              </span>
              <h3 className="text-base font-extrabold mt-1 text-white drop-shadow-sm">
                {currentComplaint.customCategoryTitle || currentComplaint.subcategory || catInfo?.name}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-white bg-blue-600/90 px-2 py-0.5 rounded-full">
              {currentComplaint.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Electrical Hazard Banner */}
          {currentComplaint.category === 'electricity' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-800">
                <strong className="font-bold block">Urgent Electrical Problem:</strong>
                Verify power disconnect status before dispatching repair staff.
              </div>
            </div>
          )}

          {/* Completion Report Review Banner (If submitted for review) */}
          {currentComplaint.status === 'submitted_for_review' && report && (
            <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <h4 className="font-bold text-sm">Completion Report Ready for Review</h4>
                </div>
                <span className="text-[10px] text-blue-200 font-mono">
                  {new Date(report.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="bg-white/10 rounded-xl p-3 text-xs space-y-1.5 border border-white/10">
                <p className="font-semibold text-blue-100">
                  Worker: <span className="text-white font-bold">{report.workerName}</span>
                </p>
                <p className="text-slate-200 italic">"{report.summary}"</p>
                {report.afterImages.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-blue-200 block mb-1">
                      After-Work Proof Photo:
                    </span>
                    <img
                      src={report.afterImages[0]}
                      alt="Work after"
                      className="w-full h-32 object-cover rounded-lg border border-white/20"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setReviewAction('rework');
                    setShowReviewModal(true);
                  }}
                  className="py-2.5 px-3 bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Rework</span>
                </button>

                <button
                  onClick={() => {
                    setReviewAction('approve');
                    setShowReviewModal(true);
                  }}
                  className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
                >
                  <CheckCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Approve &amp; Resolve</span>
                </button>
              </div>
            </div>
          )}

          {/* Details Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Problem Type
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {catInfo?.name} {currentComplaint.subcategory ? `• ${currentComplaint.subcategory}` : ''}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Location
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  {currentComplaint.address} ({currentComplaint.ward})
                </span>
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Description
              </span>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {currentComplaint.description}
              </p>
            </div>

            {/* Submitter Info Card */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                Submitted By (Resident Verification)
              </span>
              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  {currentComplaint.citizenName}
                </span>
                <a
                  href={`tel:${currentComplaint.citizenPhone}`}
                  className="font-bold text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Phone className="w-3 h-3" />
                  {currentComplaint.citizenPhone}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Department</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5 truncate">
                  {currentComplaint.assignedDepartment || catInfo?.department}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Assigned Worker
                </span>
                <p className="text-xs font-semibold text-blue-700 mt-0.5 truncate flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-blue-500 shrink-0" />
                  {currentComplaint.assignedWorkerName || 'Unassigned'}
                </p>
              </div>
            </div>

            {currentComplaint.adminNotes && (
              <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900">
                <strong className="font-bold block text-[10px] uppercase">Officer Internal Note:</strong>
                <span>{currentComplaint.adminNotes}</span>
              </div>
            )}
          </div>

          {/* Worker Field Progress & Verification Section */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-600" />
                <span>Field Progress Updates ({progressList.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400">Verify to publish to citizen</span>
            </div>

            {progressList.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">
                No progress updates submitted by worker yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {progressList.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{prog.workerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(prog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-slate-700">{prog.description}</p>

                    {prog.images && prog.images.length > 0 && (
                      <div className="flex gap-1.5 overflow-x-auto py-1">
                        {prog.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Progress photo"
                            className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                          />
                        ))}
                      </div>
                    )}

                    <div className="pt-1 flex items-center justify-between border-t border-slate-200/60">
                      {prog.isVerifiedByAdmin ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Verified &amp; Published to Citizen</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerifyProgress(prog.id)}
                          className="py-1 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Publish Verified Update to Citizen</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons at Bottom */}
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

      {/* Review Modal Dialog */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-sm text-slate-900 mb-1">
              {reviewAction === 'approve' ? 'Approve Completion Report' : 'Request Field Rework'}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {reviewAction === 'approve'
                ? 'Confirm that work is satisfactorily completed. The complaint will be marked resolved and citizen will be notified.'
                : 'Send this complaint back to the assigned field worker with specific rework instructions.'}
            </p>

            <form onSubmit={handleReviewReportSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {reviewAction === 'approve' ? 'Resolution Notes (Optional)' : 'Rework Instructions *'}
                </label>
                <textarea
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder={
                    reviewAction === 'approve'
                      ? 'Work verified on site by Panchayat Officer...'
                      : 'State what needs to be fixed (e.g. debris remains on roadside, street light pole needs tightening)...'
                  }
                  required={reviewAction === 'rework'}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`py-2.5 text-white font-bold text-xs rounded-xl shadow-xs ${
                    reviewAction === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {reviewAction === 'approve' ? 'Confirm Approval' : 'Send Rework'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
