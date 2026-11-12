import React from 'react';
import { ArrowLeft, Eye, Users, ShieldCheck, ChevronRight, Wrench } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSelectCitizen: () => void;
  onSelectAdmin: () => void;
  onSelectWorker: () => void;
  onLoginClick: () => void;
  onOpenRegisterModal?: (tab?: 'citizen' | 'worker' | 'admin') => void;
}

export const Screen2_RoleSelection: React.FC<Props> = ({
  onBack,
  onSelectCitizen,
  onSelectAdmin,
  onSelectWorker,
  onLoginClick,
  onOpenRegisterModal
}) => {
  return (
    <div className="flex flex-col h-full justify-between bg-white px-5 py-4 overflow-y-auto">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm tracking-tight text-blue-900">CIVICEYE</span>
          </div>
          <div className="w-5" />
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-slate-800">Select Your Role</h2>
          <p className="text-xs text-slate-500 mt-1">Choose how you want to continue</p>
        </div>

        {/* Roles List */}
        <div className="space-y-2.5 mt-4">
          {/* Citizen Card */}
          <button
            onClick={onSelectCitizen}
            className="w-full text-left p-3.5 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500 bg-gradient-to-r from-blue-50/50 to-white hover:bg-blue-50/70 transition-all flex items-center justify-between group shadow-xs active:scale-[0.99]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  Citizen
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                    Resident
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed pr-1">
                  Report issues, track status and help make our village better
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </button>

          {/* Admin / Officer Card */}
          <button
            onClick={onSelectAdmin}
            className="w-full text-left p-3.5 rounded-2xl border-2 border-slate-200 hover:border-blue-500 bg-gradient-to-r from-slate-50/50 to-white hover:bg-blue-50/40 transition-all flex items-center justify-between group shadow-xs active:scale-[0.99]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-slate-800/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  Admin / Officer
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800">
                    Panchayat
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed pr-1">
                  Verify complaints, assign workers and monitor village progress
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </button>

          {/* Field Worker Card */}
          <button
            onClick={onSelectWorker}
            className="w-full text-left p-3.5 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 bg-gradient-to-r from-emerald-50/40 to-white hover:bg-emerald-50/70 transition-all flex items-center justify-between group shadow-xs active:scale-[0.99]"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  Field Worker / Lineman
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    Staff
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed pr-1">
                  Access assigned field tasks, update progress and upload proof
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 pb-2 text-center">
        <p className="text-xs text-slate-500">
          Select your role above to create an account or log in
        </p>
      </div>
    </div>
  );
};
