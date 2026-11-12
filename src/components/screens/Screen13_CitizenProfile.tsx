import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit2,
  Lock,
  Activity,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Database,
  PhoneCall,
  ShieldCheck,
  User,
  Check,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Complaint } from '../../types';

interface Props {
  complaints: Complaint[];
  onBack: () => void;
  onOpenEmergency: () => void;
  onOpenConfig: () => void;
  onSwitchToAdmin: () => void;
  onSwitchToWorker?: () => void;
  onLogout?: () => void;
}

export const Screen13_CitizenProfile: React.FC<Props> = ({
  complaints,
  onBack,
  onOpenEmergency,
  onOpenConfig,
  onSwitchToAdmin,
  onSwitchToWorker,
  onLogout
}) => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Ravi Kumar');
  const [ward, setWard] = useState(user?.ward || 'Ward 4 (MG Road Sector)');
  const [savedMsg, setSavedMsg] = useState(false);

  const totalSubmitted = complaints.length;
  const totalResolved = complaints.filter((c) => c.status === 'resolved').length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, ward });
    setIsEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/70 overflow-y-auto pb-24">
      {/* Top Header */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-slate-800">Profile</h2>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          title="Edit Profile"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {savedMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-blue-600 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 stroke-[1.5]" />
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <h3 className="text-base font-extrabold text-slate-900 mt-3">{user?.name || 'Ravi Kumar'}</h3>
          <p className="text-xs font-semibold text-slate-500">{user?.phone || '+91 98765 43210'}</p>
          <span className="mt-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
            {user?.ward || 'Ward 4, Rampur Village'}
          </span>

          {/* Quick Metrics */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 w-full text-center">
            <div>
              <span className="text-base font-extrabold text-slate-900">{totalSubmitted}</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Reported</p>
            </div>
            <div>
              <span className="text-base font-extrabold text-blue-600">{inProgress}</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Active</p>
            </div>
            <div>
              <span className="text-base font-extrabold text-emerald-600">{totalResolved}</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Resolved</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Form if open */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm space-y-3"
          >
            <h4 className="text-xs font-bold text-slate-800">Edit Profile Details</h4>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Village / Ward</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 mt-1"
                required
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Menu Navigation Items (Screen 13) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          <button
            onClick={onOpenEmergency}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">Emergency Helplines</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </button>

          <button
            onClick={onOpenConfig}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800">Firebase &amp; Maps Status</span>
                <p className="text-[10px] text-slate-400">View database connection &amp; credentials</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </button>

          <button
            onClick={onSwitchToAdmin}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800">Admin / Officer Portal</span>
                <p className="text-[10px] text-slate-400">Panchayat verification &amp; assignments</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </button>

          {onSwitchToWorker && (
            <button
              onClick={onSwitchToWorker}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">Field Worker Portal</span>
                  <p className="text-[10px] text-slate-400">Lineman &amp; maintenance staff tasks</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </button>
          )}

          <button
            onClick={() =>
              alert(
                'CIVICEYE – Smart Village Complaint Management System v1.0\nDeveloped for village municipal grievance reporting, electrical hazard dispatch, and civic maintenance.'
              )
            }
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">About CIVICEYE</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </button>

          <button
            onClick={() => {
              logout();
              if (onLogout) onLogout();
            }}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-rose-50/60 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-rose-600">Logout</span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
