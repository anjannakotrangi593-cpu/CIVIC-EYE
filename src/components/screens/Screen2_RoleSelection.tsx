import React from 'react';
import { ArrowLeft, Eye, Users, ShieldCheck, ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSelectCitizen: () => void;
  onSelectAdmin: () => void;
  onLoginClick: () => void;
}

export const Screen2_RoleSelection: React.FC<Props> = ({
  onBack,
  onSelectCitizen,
  onSelectAdmin,
  onLoginClick
}) => {
  return (
    <div className="flex flex-col h-full justify-between bg-white px-5 py-4">
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

        {/* Illustration */}
        <div className="flex justify-center my-4">
          <div className="flex items-center justify-center gap-2 p-3 bg-blue-50/70 border border-blue-100 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 font-bold text-sm">
              <Users className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-600 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-3 mt-3">
          {/* Citizen Card */}
          <button
            onClick={onSelectCitizen}
            className="w-full text-left p-4 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500 bg-gradient-to-r from-blue-50/50 to-white hover:bg-blue-50/70 transition-all flex items-center justify-between group shadow-sm active:scale-[0.99]"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  Citizen
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Resident
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed pr-2">
                  Report issues, track status and help make our village better
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </button>

          {/* Admin / Officer Card */}
          <button
            onClick={onSelectAdmin}
            className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 bg-gradient-to-r from-emerald-50/30 to-white hover:bg-emerald-50/60 transition-all flex items-center justify-between group shadow-sm active:scale-[0.99]"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  Admin / Officer
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Official
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed pr-2">
                  Manage complaints, assign workers and monitor village progress
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onLoginClick}
            className="font-bold text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};
