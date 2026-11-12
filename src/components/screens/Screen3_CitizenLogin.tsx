import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Phone,
  User,
  MapPin,
  Sparkles,
  Users,
  UserPlus,
  LogIn,
  AlertTriangle,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onBack: () => void;
  onGoToOtp: (phone: string) => void;
  onLoginSuccess: () => void;
  initialMode?: 'options' | 'register' | 'login';
}

export const Screen3_CitizenLogin: React.FC<Props> = ({
  onBack,
  onGoToOtp,
  onLoginSuccess,
  initialMode = 'options'
}) => {
  const { loginWithPassword, registerCitizen } = useAuth();

  const [authView, setAuthView] = useState<'options' | 'register' | 'login'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('pass123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [ward, setWard] = useState('Ward 4 (MG Road Sector)');
  const [email, setEmail] = useState('');

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

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
      const res = await registerCitizen({
        name,
        phone,
        ward,
        email,
        password,
        confirmPassword
      });
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

  const handleTopBack = () => {
    if (authView === 'options') {
      onBack();
    } else {
      setErrorMsg('');
      setAuthView('options');
    }
  };

  return (
    <div className="flex flex-col h-full justify-between bg-white px-5 py-4 overflow-y-auto">
      <div>
        {/* Header with Back & Logo */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleTopBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1"
            title={authView === 'options' ? 'Back to Role Selection' : 'Back to Options'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-blue-900">CIVICEYE</span>
          </div>
          <div className="w-5" />
        </div>

        {/* VIEW 1: ROLE AUTHENTICATION OPTIONS (Requirement 2 & 6) */}
        {authView === 'options' && (
          <div className="mt-8 flex flex-col items-center text-center">
            {/* Visual Role Graphic */}
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/25 ring-8 ring-blue-50 mb-3">
              <Users className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Citizen Portal
            </span>

            <h2 className="text-xl font-extrabold text-slate-900 mt-2">Welcome to CivicEye</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-[270px] leading-relaxed">
              Report civic problems, track municipal resolution, and collaborate for a cleaner village.
            </p>

            {/* Authentication Choices Container */}
            <div className="w-full mt-8 space-y-4">
              {/* FIRST OPTION: Create Account / Register (Requirement 6) */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  New Resident?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setAuthView('register');
                  }}
                  className="w-full p-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-white leading-tight">
                        Create Account / Register as Citizen
                      </span>
                      <span className="text-[11px] text-blue-100 font-normal">
                        Quick sign up with name and mobile
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              {/* SECOND OPTION: Already have an account? Login (Requirement 6: DIRECTLY BELOW) */}
              <div className="space-y-1.5 text-left pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Already have an account?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setAuthView('login');
                  }}
                  className="w-full p-3.5 bg-slate-50 hover:bg-blue-50/50 border-2 border-slate-200 hover:border-blue-400 active:scale-[0.98] text-slate-800 hover:text-blue-700 rounded-2xl font-bold text-sm transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 group-hover:bg-blue-100 flex items-center justify-center text-slate-700 group-hover:text-blue-700 transition-colors">
                      <LogIn className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold leading-tight">
                        Login
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Sign in with mobile number &amp; password
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CITIZEN REGISTRATION FORM */}
        {authView === 'register' && (
          <div>
            <div className="mt-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Citizen Sign Up
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Create Citizen Account</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Join your village grievance management portal
              </p>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-4 space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@village.gov"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Password *
                  </label>
                  {password && (
                    <span className="text-[10px] font-bold text-slate-500">
                      Strength: <span className="font-extrabold">{strength.label}</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="mt-1.5 flex gap-1">
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        strength.score >= 1 ? strength.color : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        strength.score >= 2 ? strength.color : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        strength.score >= 3 ? strength.color : 'bg-slate-200'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 3: CITIZEN LOGIN FORM */}
        {authView === 'login' && (
          <div>
            <div className="mt-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Citizen Sign In
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Welcome Back!</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Login to continue reporting and tracking complaints
              </p>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="mt-5 space-y-3.5">
              {/* Registered Mobile Number */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all"
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
                    onClick={() => alert('Demo Citizen Account Details:\nMobile: 9876543210\nPassword: pass123')}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
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

              {/* OTP Login */}
              <button
                type="button"
                onClick={() => onGoToOtp(phone)}
                className="w-full py-2.5 border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 text-slate-700 hover:text-blue-700 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Login with OTP</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* FOOTER SWITCHER (Switch between Register and Login, or Return to Role Selection) */}
      <div className="pt-4 text-center border-t border-slate-100 mt-4">
        {authView === 'options' ? (
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            ← Return to Role Selection
          </button>
        ) : authView === 'register' ? (
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setAuthView('login');
              }}
              className="font-bold text-blue-600 hover:underline"
            >
              Login
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setAuthView('register');
              }}
              className="font-bold text-blue-600 hover:underline"
            >
              Create Account
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
