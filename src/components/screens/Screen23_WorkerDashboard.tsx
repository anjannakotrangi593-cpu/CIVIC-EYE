import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Camera,
  Play,
  Check,
  AlertTriangle,
  LogOut,
  ChevronRight,
  User,
  X,
  Upload,
  RotateCcw,
  Send,
  Eye,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Complaint, ProgressUpdate } from '../../types';
import { storage } from '../../services/storage';
import { StatusBadge } from '../common/StatusBadge';
import { CategoryIcon } from '../common/CategoryIcon';
import confetti from 'canvas-confetti';

interface Props {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onLogout: () => void;
  onRefresh: () => void;
}

export const Screen23_WorkerDashboard: React.FC<Props> = ({
  complaints,
  onSelectComplaint,
  onLogout,
  onRefresh
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'assigned' | 'in_progress' | 'review' | 'resolved'>('all');

  // Progress Update Modal state
  const [progressModalComplaint, setProgressModalComplaint] = useState<Complaint | null>(null);
  const [progressDesc, setProgressDesc] = useState('');
  const [progressPhotos, setProgressPhotos] = useState<string[]>([]);

  // Completion Report Modal state
  const [completionModalComplaint, setCompletionModalComplaint] = useState<Complaint | null>(null);
  const [completionSummary, setCompletionSummary] = useState('');
  const [completionPhotos, setCompletionPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workerName = user?.name || 'Field Worker';
  const workerDept = user?.workerInfo?.department || user?.department || '';
  const workerId = user?.id || 'wrk_default';

  // Filter tasks assigned to this worker or their department
  const assignedTasks = complaints.filter((c) => {
    if (c.assignedWorkerId && user?.id && c.assignedWorkerId === user.id) return true;
    if (c.assignedWorkerName && workerName) {
      const matchName =
        c.assignedWorkerName.toLowerCase().includes(workerName.toLowerCase().split(' ')[0]) ||
        workerName.toLowerCase().includes(c.assignedWorkerName.toLowerCase().split(' ')[0]);
      if (matchName) return true;
    }
    if (c.assignedDepartment && workerDept) {
      if (c.assignedDepartment.toLowerCase().includes(workerDept.toLowerCase())) return true;
    }
    return false;
  });

  const totalAssigned = assignedTasks.length;
  const inProgressCount = assignedTasks.filter((t) => t.status === 'in_progress' || t.status === 'rework_required').length;
  const pendingReviewCount = assignedTasks.filter((t) => t.status === 'submitted_for_review').length;
  const resolvedCount = assignedTasks.filter((t) => t.status === 'resolved').length;

  const filteredTasks = assignedTasks.filter((t) => {
    if (activeTab === 'assigned') return t.status === 'submitted' || t.status === 'verified' || t.status === 'assigned' || t.status === 'accepted';
    if (activeTab === 'in_progress') return t.status === 'in_progress' || t.status === 'rework_required';
    if (activeTab === 'review') return t.status === 'submitted_for_review';
    if (activeTab === 'resolved') return t.status === 'resolved';
    return true;
  });

  // Action: Accept task
  const handleAcceptTask = (complaintId: string) => {
    storage.acceptTask(complaintId, workerId, workerName);
    onRefresh();
  };

  // Action: Start work
  const handleStartWork = (complaintId: string) => {
    storage.startTask(complaintId, workerId, workerName);
    onRefresh();
  };

  // Action: Post Progress Update
  const handleProgressPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProgressPhotos((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProgressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progressModalComplaint || !progressDesc.trim()) return;

    storage.addProgressUpdate(
      progressModalComplaint.id,
      workerId,
      workerName,
      progressDesc.trim(),
      progressPhotos
    );

    setProgressModalComplaint(null);
    setProgressDesc('');
    setProgressPhotos([]);
    onRefresh();
  };

  // Action: Submit Completion Report for Admin Review
  const handleCompletionPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCompletionPhotos((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitCompletionReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionModalComplaint || !completionSummary.trim()) return;
    setIsSubmitting(true);

    const defaultPhoto = completionPhotos.length > 0
      ? completionPhotos
      : ['https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'];

    storage.submitCompletionReport(
      completionModalComplaint.id,
      workerId,
      workerName,
      completionSummary.trim(),
      defaultPhoto
    );

    try {
      confetti({ particleCount: 40, spread: 50 });
    } catch {}

    setIsSubmitting(false);
    setCompletionModalComplaint(null);
    setCompletionSummary('');
    setCompletionPhotos([]);
    onRefresh();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/80 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 truncate max-w-[170px]">
              {workerName}
            </h2>
            <p className="text-[10px] text-emerald-700 font-semibold truncate max-w-[170px]">
              {user?.workerInfo?.roleTitle || `${workerDept || 'Municipal'} Field Personnel`}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-1.5">
          <div className="bg-white p-2.5 rounded-2xl border border-slate-200 text-center">
            <span className="text-[9px] font-bold uppercase text-slate-400 block">Total</span>
            <span className="text-lg font-extrabold text-slate-900">{totalAssigned}</span>
          </div>

          <div className="bg-white p-2.5 rounded-2xl border border-blue-200 bg-blue-50/20 text-center">
            <span className="text-[9px] font-bold uppercase text-blue-600 block">Active</span>
            <span className="text-lg font-extrabold text-blue-600">{inProgressCount}</span>
          </div>

          <div className="bg-white p-2.5 rounded-2xl border border-amber-200 bg-amber-50/20 text-center">
            <span className="text-[9px] font-bold uppercase text-amber-600 block">Review</span>
            <span className="text-lg font-extrabold text-amber-600">{pendingReviewCount}</span>
          </div>

          <div className="bg-white p-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/20 text-center">
            <span className="text-[9px] font-bold uppercase text-emerald-600 block">Done</span>
            <span className="text-lg font-extrabold text-emerald-600">{resolvedCount}</span>
          </div>
        </div>

        {/* Safety Note if Electrical worker */}
        {workerDept.toLowerCase().includes('electricity') && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800 leading-relaxed">
              <strong className="font-bold block">Lineman Protocol:</strong>
              Substation feeder isolation clearance is mandatory before working on overhead lines.
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
              Field Work Orders
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'assigned', label: 'Assigned' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'review', label: 'In Review' },
              { id: 'resolved', label: 'Resolved' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400">
              <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-slate-600">No tasks in this view</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                New work orders assigned to your ward or department will appear here.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isRework = task.status === 'rework_required';
              const isInReview = task.status === 'submitted_for_review';
              const isInProgress = task.status === 'in_progress';
              const isAccepted = task.status === 'accepted';
              const isAssigned = task.status === 'assigned' || task.status === 'verified' || task.status === 'submitted';
              const isResolved = task.status === 'resolved';

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl p-4 border transition-all space-y-3 ${
                    isRework
                      ? 'border-amber-400 ring-2 ring-amber-100 shadow-md'
                      : 'border-slate-200/90 shadow-xs'
                  }`}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <CategoryIcon category={task.category} size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {task.customCategoryTitle || task.subcategory || task.category}
                        </h4>
                        <span className="font-mono text-[10px] font-bold text-blue-600">
                          {task.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={task.status} size="sm" />
                      <span className="text-[9px] uppercase font-bold text-slate-400">
                        Priority: {task.priority}
                      </span>
                    </div>
                  </div>

                  {/* Rework Banner if Admin rejected completion */}
                  {isRework && (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                      <RotateCcw className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Admin Requested Rework:</span>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          {task.adminNotes || 'Please inspect site again and rectify reported issues.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* In Review Banner */}
                  {isInReview && (
                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
                      <span className="text-[11px]">
                        Completion report submitted. Awaiting Panchayat Admin site verification.
                      </span>
                    </div>
                  )}

                  {/* Location & Citizen Info */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{task.address} ({task.ward})</span>
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                      <span className="text-slate-500 flex items-center gap-1">
                        <User className="w-3 h-3" /> Citizen: {task.citizenName}
                      </span>
                      <a
                        href={`tel:${task.citizenPhone}`}
                        className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Call Citizen
                      </a>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    "{task.description}"
                  </p>

                  {/* Progress Updates Count Badge */}
                  {task.progressUpdates && task.progressUpdates.length > 0 && (
                    <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{task.progressUpdates.length} progress update(s) recorded</span>
                    </div>
                  )}

                  {/* Workflow Action Buttons */}
                  <div className="pt-1 flex items-center gap-2">
                    {/* State 1: Assigned -> Accept */}
                    {isAssigned && (
                      <button
                        onClick={() => handleAcceptTask(task.id)}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Task</span>
                      </button>
                    )}

                    {/* State 2: Accepted -> Start Work */}
                    {isAccepted && (
                      <button
                        onClick={() => handleStartWork(task.id)}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Work</span>
                      </button>
                    )}

                    {/* State 3: In Progress or Rework Required -> Add Update & Submit for Review */}
                    {(isInProgress || isRework) && (
                      <>
                        <button
                          onClick={() => setProgressModalComplaint(task)}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <Camera className="w-3.5 h-3.5 text-blue-600" />
                          <span>Post Progress</span>
                        </button>

                        <button
                          onClick={() => setCompletionModalComplaint(task)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Submit Review</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => onSelectComplaint(task)}
                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Progress Update Modal */}
      {progressModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Post Field Progress</h3>
              <button
                onClick={() => setProgressModalComplaint(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitProgressUpdate} className="mt-3 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Complaint ID
                </label>
                <p className="text-xs font-mono font-bold text-blue-600">
                  {progressModalComplaint.id}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Work Progress Description *
                </label>
                <textarea
                  value={progressDesc}
                  onChange={(e) => setProgressDesc(e.target.value)}
                  placeholder="e.g. Cleared drainage blockage at crossroad, replacement pipe installed..."
                  rows={3}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Add Progress Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleProgressPhotoUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"
                />

                {progressPhotos.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto py-1">
                    {progressPhotos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt="Progress preview"
                        className="w-16 h-16 object-cover rounded-lg border border-blue-300"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setProgressModalComplaint(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Save Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completion Report Modal */}
      {completionModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Submit Completion Report</h3>
              <button
                onClick={() => setCompletionModalComplaint(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitCompletionReport} className="mt-3 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Complaint ID
                </label>
                <p className="text-xs font-mono font-bold text-blue-600">
                  {completionModalComplaint.id}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Completion Summary *
                </label>
                <textarea
                  value={completionSummary}
                  onChange={(e) => setCompletionSummary(e.target.value)}
                  placeholder="Detail work done, materials used, and final condition..."
                  rows={3}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600 mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  After-Work Evidence Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCompletionPhotoUpload}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 mt-1"
                />

                {completionPhotos.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto py-1">
                    {completionPhotos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt="Completion preview"
                        className="w-16 h-16 object-cover rounded-lg border border-emerald-300"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCompletionModalComplaint(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                >
                  {isSubmitting ? 'Submitting...' : 'Send for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
