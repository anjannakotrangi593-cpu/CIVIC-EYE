import React, { useState } from 'react';
import { ArrowLeft, Eye, Shield, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export const Screen14_AdminLogin: React.FC<Props> = ({ onBack, onLoginSuccess }) => {
  const { adminLogin } = useAuth();
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await adminLogin(password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message || 'Invalid administrative credentials.');
      }
    } catch {
      setErrorMsg('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between bg-white px-5 py-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
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

        {/* Shield Graphic (Screen 14) */}
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/25 ring-8 ring-blue-50 mb-6">
            <Lock className="w-11 h-11 stroke-[2.2]" />
          </div>

          <h2 className="text-xl font-bold text-slate-900">Admin Login</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
            Enter authorized admin credentials to access village administration controls
          </p>
        </div>

        {errorMsg && (
          <div className="mt-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-sm font-medium text-slate-900 outline-none transition-all shadow-xs"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 text-center">
              Hint: Default admin password is <span className="font-bold text-blue-600 font-mono">admin123</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>

      <div className="pb-4 text-center">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          Return to Citizen Portal
        </button>
      </div>
    </div>
  );
};
