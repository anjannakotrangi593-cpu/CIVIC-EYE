import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Phone, User, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onBack: () => void;
  onGoToOtp: (phone: string) => void;
  onLoginSuccess: () => void;
}

export const Screen3_CitizenLogin: React.FC<Props> = ({ onBack, onGoToOtp, onLoginSuccess }) => {
  const { loginWithPassword, registerCitizen } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('pass123');
  const [name, setName] = useState('');
  const [ward, setWard] = useState('Ward 4');
  const [email, setEmail] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await loginWithPassword(phone, password);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await registerCitizen({ name, phone, ward, email, password });
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between bg-white px-5 py-4 overflow-y-auto">
      <div>
        {/* Header */}
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

        {/* Title */}
        <div className="mt-5 text-center">
          <h2 className="text-xl font-bold text-slate-800">
            {isRegistering ? 'Create Citizen Account' : 'Welcome Back!'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegistering
              ? 'Join your village complaint management portal'
              : 'Login to continue reporting and tracking complaints'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Form */}
        {!isRegistering ? (
          <form onSubmit={handlePasswordLogin} className="mt-5 space-y-3.5">
            {/* Mobile Number */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-800 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For testing, default password is: pass123')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-800 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* OTP Button */}
            <button
              type="button"
              onClick={() => onGoToOtp(phone)}
              className="w-full py-2.5 border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 text-slate-700 hover:text-blue-700 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Login with OTP</span>
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister} className="mt-4 space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-800 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-800 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Village / Ward / Locality
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. Rampur Ward 4"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-800 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm font-medium text-slate-800 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>
        )}
      </div>

      {/* Switch Form */}
      <div className="pt-4 text-center">
        {!isRegistering ? (
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setIsRegistering(true)}
              className="font-bold text-blue-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className="font-bold text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
