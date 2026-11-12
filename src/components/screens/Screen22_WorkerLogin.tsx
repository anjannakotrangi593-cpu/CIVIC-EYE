import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Wrench,
  Phone,
  Lock,
  User,
  MapPin,
  Building2,
  AlertTriangle,
  Clock,
  LogIn,
  UserPlus,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';

interface Props {
  onBack: () => void;
  onLoginSuccess: () => void;
  initialMode?: 'options' | 'register' | 'login';
}

export const Screen22_WorkerLogin: React.FC<Props> = ({
  onBack,
  onLoginSuccess,
  initialMode = 'options'
}) => {
  const { workerLogin, registerWorker } = useAuth();

  const [authView, setAuthView] = useState<'options' | 'register' | 'login'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingSuccessMsg, setPendingSuccessMsg] = useState('');

  // Login Form States
  const [phone, setPhone] = useState('9412355667');
  const [pin, setPin] = useState('1234');

  // Register Form States
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerAddress, setWorkerAddress] = useState('');
  const [workerDepartment, setWorkerDepartment] = useState('Sanitation');
  const [workerPassword, setWorkerPassword] = useState('');
  const [workerConfirmPassword, setWorkerConfirmPassword] = useState('');

  const workers = storage.getWorkers();

  // Handle Worker Login
  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!pin || pin.length < 4) {
      setErrorMsg('Please enter your 4-digit worker security PIN or password.');
      return;
    }

    setLoading(true);
    try {
      const res = await workerLogin(phone, pin);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.message || 'Worker authentication failed.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during worker login.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Worker Registration
  const handleWorkerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await registerWorker({
        name: workerName,
        phone: workerPhone,
        address: workerAddress,
        department: workerDepartment,
        password: workerPassword,
        confirmPassword: workerConfirmPassword
      });

      if (res.success) {
        setPendingSuccessMsg(
          res.message ||
            'Worker registration submitted successfully! Your account status is PENDING APPROVAL by the District Main Administrator.'
        );
      } else {
        setErrorMsg(res.message || 'Worker registration failed.');
      }
    } catch {
      setErrorMsg('An error occurred during worker registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStaff = (staffPhone: string) => {
    setPhone(staffPhone.replace(/\D/g, '').slice(-10));
    setPin('1234');
    setErrorMsg('');
  };

  const handleTopBack = () => {
    if (authView === 'options') {
      onBack();
    } else {
      setErrorMsg('');
      setPendingSuccessMsg('');
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
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            title={authView === 'options' ? 'Back to Role Selection' : 'Back to Options'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-blue-900">CIVICEYE</span>
          </div>
          <div className="w-5" />
        </div>

        {/* VIEW 1: ROLE AUTHENTICATION OPTIONS (Requirement 4 & 6) */}
        {authView === 'options' && (
          <div className="mt-8 flex flex-col items-center text-center">
            {/* Worker Visual Graphic */}
            <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25 ring-8 ring-emerald-50 mb-3">
              <Wrench className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Field Personnel Portal
            </span>

            <h2 className="text-xl font-extrabold text-slate-900 mt-2">Field Worker Access</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-[270px] leading-relaxed">
              Accept ward work orders, submit live progress updates, and upload resolution proof photos.
            </p>

            {/* Authentication Choices Container */}
            <div className="w-full mt-8 space-y-4">
              {/* FIRST OPTION: Create Account / Register as Worker (Requirement 6) */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  New Village Technician?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setPendingSuccessMsg('');
                    setAuthView('register');
                  }}
                  className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-white leading-tight">
                        Create Account / Register as Worker
                      </span>
                      <span className="text-[11px] text-emerald-100 font-normal">
                        Register with address &amp; assigned department
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              {/* SECOND OPTION: Already have an account? Login (Requirement 6: DIRECTLY BELOW) */}
              <div className="space-y-1.5 text-left pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Already registered staff?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setPendingSuccessMsg('');
                    setAuthView('login');
                  }}
                  className="w-full p-3.5 bg-slate-50 hover:bg-emerald-50/50 border-2 border-slate-200 hover:border-emerald-400 active:scale-[0.98] text-slate-800 hover:text-emerald-800 rounded-2xl font-bold text-sm transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 group-hover:bg-emerald-100 flex items-center justify-center text-slate-700 group-hover:text-emerald-700 transition-colors">
                      <LogIn className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold leading-tight">
                        Login
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Sign in with mobile number &amp; PIN
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: WORKER REGISTRATION FORM */}
        {authView === 'register' && (
          <div>
            {pendingSuccessMsg ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-9 h-9 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Application Submitted</h3>
                <p className="text-xs text-slate-600 mt-2 px-3 leading-relaxed">
                  {pendingSuccessMsg}
                </p>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-left text-xs text-amber-900">
                  <span className="font-bold block">Status: Pending Main Admin Approval</span>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Your account must be reviewed and activated by the District Chief Officer before accessing field work orders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthView('options')}
                  className="w-full mt-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Return to Portal Options
                </button>
              </div>
            ) : (
              <div>
                <div className="mt-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Field Staff Sign Up
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 mt-1">Register as Worker</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Join village maintenance and technical crew
                  </p>
                </div>

                {errorMsg && (
                  <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleWorkerRegister} className="mt-4 space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={workerName}
                        onChange={(e) => setWorkerName(e.target.value)}
                        placeholder="Field technician full name"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Registered Mobile Number */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={workerPhone}
                        onChange={(e) => setWorkerPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Address / Locality *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={workerAddress}
                        onChange={(e) => setWorkerAddress(e.target.value)}
                        placeholder="e.g. Feeder Substation Ward 5, Rampur"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Assigned Department / Field */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Assigned Department / Field *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <select
                        value={workerDepartment}
                        onChange={(e) => setWorkerDepartment(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none"
                      >
                        <option value="Sanitation">Sanitation</option>
                        <option value="Roads">Roads</option>
                        <option value="Water Supply">Water Supply</option>
                        <option value="Drainage">Drainage</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Street Lights">Street Lights</option>
                        <option value="Waste Management">Waste Management</option>
                        <option value="Other Municipal">Other Municipal Services</option>
                      </select>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Password (or 4-digit PIN) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={workerPassword}
                        onChange={(e) => setWorkerPassword(e.target.value)}
                        placeholder="Create worker password or PIN"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
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

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={workerConfirmPassword}
                        onChange={(e) => setWorkerConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Submitting Application...' : 'Register as Worker'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: WORKER LOGIN FORM */}
        {authView === 'login' && (
          <div>
            <div className="mt-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Staff Sign In
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Worker Login</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter registered mobile number and security PIN / password
              </p>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleWorkerSubmit} className="mt-4 space-y-3.5">
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
                    placeholder="10-digit registered number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Worker PIN or Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Worker PIN / Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        'Worker Security Notice:\n• Registered staff default PIN is 1234.\n• Or enter the password you created during worker registration.'
                      )
                    }
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Forgot PIN / Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN (1234) or password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all shadow-xs"
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

              {/* Quick Select Registered Staff for Demo */}
              <div className="pt-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Quick Select Registered Staff (Demo Testing):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {workers.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleSelectStaff(w.phone)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        phone.includes(w.phone.slice(-6))
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <p className="text-[11px] font-bold truncate">{w.name.split(' ')[0]}</p>
                      <p className="text-[9px] text-slate-500 truncate">{w.roleTitle}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying Credentials...' : 'Login to Worker Portal'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* FOOTER SWITCHER */}
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
                setPendingSuccessMsg('');
                setAuthView('login');
              }}
              className="font-bold text-emerald-700 hover:underline"
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
                setPendingSuccessMsg('');
                setAuthView('register');
              }}
              className="font-bold text-emerald-700 hover:underline"
            >
              Register as Worker
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
