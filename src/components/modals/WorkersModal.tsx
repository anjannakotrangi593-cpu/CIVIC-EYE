import React from 'react';
import { X, Users, Phone, Wrench, Shield, CheckCircle } from 'lucide-react';
import { AssignedWorker } from '../../types';

interface Props {
  workers: AssignedWorker[];
  onClose: () => void;
}

export const WorkersModal: React.FC<Props> = ({ workers, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Village Field Workers</h3>
              <p className="text-[10px] text-slate-400">Department Rosters &amp; Assignments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workers List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{worker.name}</h4>
                  <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full">
                    {worker.activeTasks} Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{worker.roleTitle}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{worker.department}</p>
              </div>

              <a
                href={`tel:${worker.phone}`}
                className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 shadow-xs flex items-center gap-1 shrink-0"
                title="Call worker"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
