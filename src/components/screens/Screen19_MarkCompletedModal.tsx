import React, { useState, useRef } from 'react';
import { ArrowLeft, Check, Camera, X } from 'lucide-react';
import { Complaint } from '../../types';
import { storage } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface Props {
  complaint: Complaint;
  onBack: () => void;
  onCompleted: () => void;
}

export const Screen19_MarkCompletedModal: React.FC<Props> = ({
  complaint,
  onBack,
  onCompleted
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resolutionNotes, setResolutionNotes] = useState(
    'Work completed, area cleaned and verified by field inspection.'
  );
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAfterPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmCompleted = () => {
    setIsSubmitting(true);
    try {
      storage.markComplaintResolved(
        complaint.id,
        user?.name || 'Panchayat Officer',
        resolutionNotes.trim(),
        afterPhotoUrl || undefined
      );

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 }
        });
      } catch {}

      setIsSubmitting(false);
      onCompleted();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white justify-between px-5 py-4 overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-slate-800">Mark as Completed</h2>
          <span className="text-xs font-mono font-bold text-emerald-600">{complaint.id}</span>
        </div>

        {/* Green Check Icon & Prompt (Screen 19) */}
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25 ring-8 ring-emerald-50 mb-4 animate-in zoom-in-75">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <h3 className="text-lg font-extrabold text-slate-900">
            Mark Complaint as Completed?
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[260px]">
            Are you sure you want to mark this complaint as completed? This will notify the citizen and close the ticket.
          </p>
        </div>

        {/* Resolution Remarks */}
        <div className="mt-6 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Resolution Remarks (Citizen Notification)
            </label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Pipeline leak welded, water supply restored."
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 text-slate-800"
              required
            />
          </div>

          {/* Optional Resolution After-Photo */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Resolution Proof (Optional After Photo)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {!afterPhotoUrl ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50/70 text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Upload work completion photo</span>
              </button>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-emerald-300 h-28 bg-slate-100">
                <img
                  src={afterPhotoUrl}
                  alt="Resolution Proof"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setAfterPhotoUrl('')}
                  className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons (Screen 19) */}
      <div className="flex flex-col gap-2.5 pt-4 pb-2">
        <button
          onClick={handleConfirmCompleted}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Resolving...' : 'Yes, Mark Completed'}
        </button>

        <button
          onClick={onBack}
          type="button"
          className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
