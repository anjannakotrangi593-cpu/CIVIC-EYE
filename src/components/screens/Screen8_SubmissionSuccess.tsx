import React, { useEffect, useState } from 'react';
import { Check, Copy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  complaintId: string;
  onViewComplaints: () => void;
  onGoHome: () => void;
}

export const Screen8_SubmissionSuccess: React.FC<Props> = ({
  complaintId,
  onViewComplaints,
  onGoHome
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch {}
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full justify-between bg-white px-6 py-8 text-center">
      <div className="my-auto flex flex-col items-center">
        {/* Animated Green Checkmark Circle */}
        <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25 mb-6 ring-8 ring-emerald-50 animate-in zoom-in-75 duration-300">
          <Check className="w-10 h-10 stroke-[3]" />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl font-bold text-slate-900">Complaint Submitted</h2>
        <p className="text-sm font-semibold text-emerald-600 mt-1">Thank You!</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[260px] leading-relaxed">
          Your complaint has been submitted successfully to the village administration.
        </p>

        {/* Complaint ID Card */}
        <div className="mt-7 w-full max-w-[280px] p-4 bg-slate-50/90 border border-slate-200/90 rounded-2xl flex flex-col items-center relative shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Complaint ID
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-extrabold tracking-wide text-slate-900 font-mono">
              {complaintId}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              title="Copy ID"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          {copied && (
            <span className="text-[10px] text-emerald-600 font-semibold mt-1">
              Copied to clipboard!
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pb-2 w-full">
        <button
          onClick={onViewComplaints}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
        >
          View My Complaints
        </button>

        <button
          onClick={onGoHome}
          className="w-full py-2.5 text-slate-500 hover:text-slate-800 font-semibold text-xs transition-colors"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};
