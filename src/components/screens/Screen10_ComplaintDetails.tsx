import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Shield,
  Send,
  CheckCircle,
  AlertTriangle,
  Layers,
  Wrench
} from 'lucide-react';
import { Complaint, StatusHistoryItem, ComplaintComment } from '../../types';
import { storage } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { CATEGORIES } from '../../data/categories';
import { INITIAL_COMPLAINTS } from '../../data/seedData';

interface Props {
  complaint?: Complaint | null;
  onBack: () => void;
  onRefreshComplaint: () => void;
}

export const Screen10_ComplaintDetails: React.FC<Props> = ({
  complaint: propComplaint,
  onBack,
  onRefreshComplaint
}) => {
  const { user } = useAuth();
  const complaint = propComplaint || INITIAL_COMPLAINTS[0];

  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [comments, setComments] = useState<ComplaintComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const catInfo = CATEGORIES[complaint.category] || CATEGORIES.garbage;

  useEffect(() => {
    loadData();
    const unsub = storage.subscribe(() => {
      loadData();
    });
    return unsub;
  }, [complaint.id]);

  const loadData = () => {
    setHistory(storage.getStatusHistory(complaint.id));
    setComments(storage.getComments(complaint.id));
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isPostingComment) return;

    setIsPostingComment(true);
    storage.addComment(
      complaint.id,
      user?.id || 'usr_citizen',
      user?.name || 'Ravi Kumar',
      user?.role || 'citizen',
      newComment.trim()
    );
    setNewComment('');
    setIsPostingComment(false);
    onRefreshComplaint();
  };

  // Status Lifecycle Steps
  const steps: { key: string; label: string }[] = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'verified', label: 'Verified' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'verified':
        return 1;
      case 'in_progress':
        return 2;
      case 'resolved':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(complaint.status);
  const isRejectedOrDuplicate =
    complaint.status === 'rejected' || complaint.status === 'duplicate';

  return (
    <div className="flex flex-col h-full bg-slate-50/70 overflow-hidden">
      {/* Header */}
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

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Main Photo Preview */}
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
            <span className="text-[11px] text-white/90 bg-blue-600/80 px-2 py-0.5 rounded-full font-semibold">
              {complaint.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Electricity Hazard Warning if electrical */}
          {complaint.category === 'electricity' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-800 leading-relaxed">
                <strong className="font-bold block">Electrical Safety Caution:</strong>
                Stay at least 10 meters away from live wires and fallen poles. Lineman helpline: <strong>1912</strong>.
              </div>
            </div>
          )}

          {/* Rejection / Duplicate Notice if applicable */}
          {isRejectedOrDuplicate && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
              <strong className="font-bold uppercase tracking-wider block mb-1">
                Notice: Marked as {complaint.status}
              </strong>
              <p>{complaint.statusReason || 'Administrative review completed.'}</p>
            </div>
          )}

          {/* Details Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Problem Type
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {catInfo?.name || complaint.category}
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

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Submitted On
                </span>
                <p className="text-[11px] font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(complaint.createdAt).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Assigned Worker
                </span>
                <p className="text-[11px] font-semibold text-blue-700 mt-0.5 truncate flex items-center gap-1">
                  <Wrench className="w-3 h-3 text-blue-500 shrink-0" />
                  {complaint.assignedWorkerName || 'Assigning soon...'}
                </p>
              </div>
            </div>

            {/* Resolved After Photo if present */}
            {complaint.afterImageUrl && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  Resolution Proof (After Photo)
                </span>
                <img
                  src={complaint.afterImageUrl}
                  alt="Resolution proof"
                  className="w-full h-36 object-cover rounded-xl border border-emerald-200"
                />
                {complaint.resolutionNotes && (
                  <p className="text-xs text-emerald-900 mt-1.5 italic bg-emerald-50 p-2 rounded-lg">
                    "{complaint.resolutionNotes}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Verified Field Progress Updates (Only Admin-Verified updates are shown to Citizens) */}
          {complaint.progressUpdates &&
            complaint.progressUpdates.filter((p) => p.isVerifiedByAdmin).length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Field Progress</span>
                  </h4>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Official Update
                  </span>
                </div>

                <div className="space-y-2">
                  {complaint.progressUpdates
                    .filter((p) => p.isVerifiedByAdmin)
                    .map((prog) => (
                      <div
                        key={prog.id}
                        className="bg-white p-3 rounded-xl border border-emerald-100 text-xs space-y-1.5 shadow-2xs"
                      >
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-700">By {prog.workerName}</span>
                          <span>{new Date(prog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-700">{prog.description}</p>
                        {prog.images && prog.images.length > 0 && (
                          <div className="flex gap-1.5 overflow-x-auto pt-1">
                            {prog.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt="Field progress"
                                className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                              />
                            ))}
                          </div>
                        )}
                        <span className="text-[9px] font-bold text-emerald-700 block pt-0.5">
                          ✓ Verified by {prog.verifiedBy || 'Administration'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* Status Lifecycle Tracker */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 mb-3">
              Status Timeline
            </h4>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {steps.map((st, idx) => {
                const isPassed = currentStepIdx >= idx && !isRejectedOrDuplicate;
                const isCurrent = currentStepIdx === idx && !isRejectedOrDuplicate;
                const matchingHistory = history.find((h) => h.status === st.key);

                return (
                  <div key={st.key} className="flex items-start gap-3 relative z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        isPassed
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent ? 'text-blue-700' : isPassed ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          {st.label}
                        </span>
                        {matchingHistory && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(matchingHistory.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      {matchingHistory?.note && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{matchingHistory.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comments Feed (Screen 20) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Comments &amp; Updates ({comments.length})
            </h4>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3 italic">
                  No comments yet. Have a question? Leave a note below.
                </p>
              ) : (
                comments.map((comm) => {
                  const isAdminComment = comm.authorRole === 'admin';
                  return (
                    <div
                      key={comm.id}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        isAdminComment
                          ? 'bg-blue-50/70 border border-blue-100 ml-3'
                          : 'bg-slate-50 border border-slate-100 mr-3'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          {isAdminComment ? (
                            <Shield className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          {comm.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(comm.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{comm.message}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handlePostComment} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment or follow-up note..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isPostingComment}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
              >
                <span>Post</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
