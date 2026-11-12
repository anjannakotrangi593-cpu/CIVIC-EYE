import React, { useState } from 'react';
import { ArrowLeft, UserCheck, AlertTriangle, Check, Shield } from 'lucide-react';
import { Complaint, ComplaintPriority, ComplaintStatus, AssignedWorker } from '../../types';
import { storage } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_COMPLAINTS } from '../../data/seedData';

interface Props {
  complaint?: Complaint | null;
  workers: AssignedWorker[];
  onBack: () => void;
  onUpdated: () => void;
}

export const Screen18_AssignWorkerModal: React.FC<Props> = ({
  complaint: propComplaint,
  workers,
  onBack,
  onUpdated
}) => {
  const { user } = useAuth();
  const complaint = propComplaint || INITIAL_COMPLAINTS[0];
  const [selectedWorker, setSelectedWorker] = useState<string>(
    complaint.assignedWorkerName || (workers[0]?.name ?? '')
  );
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [priority, setPriority] = useState<ComplaintPriority>(complaint.priority);
  const [notes, setNotes] = useState(complaint.adminNotes || '');
  const [reason, setReason] = useState(complaint.statusReason || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const isMandatoryReason = status === 'rejected' || status === 'duplicate';

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isMandatoryReason && !reason.trim()) {
      setErrorMsg(`A mandatory reason must be provided when marking a complaint as ${status.toUpperCase()}.`);
      return;
    }

    setIsUpdating(true);
    try {
      const assignedWorkerObj = workers.find((w) => w.name === selectedWorker);

      storage.updateComplaintStatus(
        complaint.id,
        status,
        user?.name || 'Panchayat Officer',
        'admin',
        {
          note: notes.trim() || undefined,
          reason: isMandatoryReason ? reason.trim() : undefined,
          assignedWorkerId: assignedWorkerObj?.id,
          assignedWorkerName: selectedWorker || undefined,
          assignedDepartment: assignedWorkerObj?.department || complaint.assignedDepartment,
          priority,
          adminNotes: notes.trim() || undefined
        }
      );

      setIsUpdating(false);
      onUpdated();
    } catch {
      setErrorMsg('Failed to update complaint status.');
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-base text-slate-800">Assign / Update Status</h2>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600">{complaint.id}</span>
        </div>

        {errorMsg && (
          <div className="m-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body (Screen 18) */}
        <form onSubmit={handleUpdate} className="p-4 space-y-4">
          {/* Assign to Worker */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Assign to Worker
            </label>
            <div className="relative">
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="">-- Select Field Worker --</option>
                {workers.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name} ({w.department})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Field personnel will be notified of ward assignment.
            </p>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Triage Priority
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['low', 'medium', 'high', 'urgent'] as ComplaintPriority[]).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      isSelected
                        ? p === 'urgent'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : p === 'high'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
            >
              <option value="submitted">Submitted (Logged)</option>
              <option value="verified">Verified (Inspection Confirmed)</option>
              <option value="in_progress">In Progress (Action Underway)</option>
              <option value="resolved">Resolved (Completed)</option>
              <option value="rejected">Rejected (Not actionable / invalid)</option>
              <option value="duplicate">Duplicate (Already reported)</option>
            </select>
          </div>

          {/* Mandatory Reason if Rejected or Duplicate */}
          {isMandatoryReason && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 animate-in fade-in">
              <label className="block text-xs font-bold text-rose-900">
                Mandatory Reason for {status.toUpperCase()} *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this complaint is being rejected or marked duplicate (visible to citizen)..."
                rows={2}
                className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs outline-none text-slate-800"
                required
              />
            </div>
          )}

          {/* Notes (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">Notes (Citizen-Visible Update)</label>
              <span className="text-[11px] text-slate-400">{notes.length}/200</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 200))}
              placeholder="e.g. Work in progress. Worker assigned."
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white resize-none"
            />
          </div>
        </form>
      </div>

      {/* Update Button (Screen 18) */}
      <div className="p-4 bg-white border-t border-slate-100">
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  );
};
