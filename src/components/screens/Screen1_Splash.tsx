import React from 'react';
import { Eye, Shield, Users, ArrowRight } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  onAdminClick: () => void;
}

export const Screen1_Splash: React.FC<Props> = ({ onGetStarted, onAdminClick }) => {
  return (
    <div className="flex flex-col h-full justify-between bg-white px-6 py-6 select-none">
      {/* Top Branding */}
      <div className="text-center pt-6">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Eye className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-blue-900">CIVICEYE</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mt-4 leading-tight">
          See it. Report it.
        </h1>
        <p className="text-blue-600 font-semibold text-lg mt-0.5">
          It'll get fixed.
        </p>
        <p className="text-slate-500 text-xs mt-2">
          Together for a better and cleaner village
        </p>
      </div>

      {/* Visual Skyline & Community Graphic */}
      <div className="my-auto py-4 flex flex-col items-center">
        <div className="relative w-full max-w-[280px] h-48 bg-gradient-to-b from-blue-50 to-indigo-50/40 rounded-3xl p-4 flex flex-col justify-end items-center border border-blue-100/60 overflow-hidden shadow-inner">
          {/* Clouds & Sun */}
          <div className="absolute top-4 right-6 w-8 h-8 rounded-full bg-amber-300/80 blur-[1px]" />
          <div className="absolute top-6 left-6 w-12 h-4 rounded-full bg-white/80" />
          <div className="absolute top-10 right-14 w-16 h-5 rounded-full bg-white/70" />

          {/* Village Skyline Silhouette */}
          <div className="w-full flex items-end justify-center gap-1.5 opacity-40 mb-2">
            <div className="w-6 h-16 bg-blue-400 rounded-t-sm" />
            <div className="w-8 h-24 bg-blue-500 rounded-t-md" />
            <div className="w-5 h-20 bg-blue-300 rounded-t-sm" />
            <div className="w-10 h-28 bg-blue-600 rounded-t-md" />
            <div className="w-7 h-14 bg-blue-400 rounded-t-sm" />
            <div className="w-9 h-22 bg-blue-500 rounded-t-md" />
            <div className="w-6 h-12 bg-blue-300 rounded-t-sm" />
          </div>

          {/* Road and Trees */}
          <div className="w-full h-8 bg-slate-700 rounded-xl relative flex items-center justify-center">
            <div className="w-full border-t border-dashed border-amber-300/70" />
            <div className="absolute -top-3 left-4 w-5 h-5 rounded-full bg-emerald-500 shadow-sm" />
            <div className="absolute -top-4 right-6 w-6 h-6 rounded-full bg-emerald-600 shadow-sm" />
            <div className="absolute -top-2 left-14 w-4 h-4 rounded-full bg-emerald-400 shadow-sm" />
          </div>

          {/* People icons */}
          <div className="absolute bottom-10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Users className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 pb-2">
        <button
          onClick={onGetStarted}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onAdminClick}
          className="w-full py-3 border border-blue-200 hover:border-blue-300 bg-white hover:bg-blue-50/50 text-blue-700 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
        >
          I'm Admin / Officer
        </button>

        <p className="text-center text-[11px] font-medium text-slate-400 mt-2">
          Your village. Your voice. Our action.
        </p>
      </div>
    </div>
  );
};
