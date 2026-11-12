import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Lock,
  KeyRound,
  Phone,
  User,
  Building2,
  Send,
  AlertTriangle,
  Clock,
  LogIn,
  UserPlus,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onBack: () => void;
  onLoginSuccess: (role?: 'admin' | 'main_admin') => void;
  initialMode?: 'options' | 'register' | 'login';
}

export const Screen14_AdminLogin: React.FC<Props> = ({
  onBack,
  onLoginSuccess,
  initialMode = 'options'
}) => {
  const { adminLogin, registerAdmin } = useAuth();

  const [authView, setAuthView] = useState<'options' | 'register' | 'login'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingSuccessMsg, setPendingSuccessMsg] = useState('');

  // Login Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('admin123');

  // Register Form States
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminDepartment, setAdminDepartment] = useState('Municipal');
  const [adminProfession, setAdminProfession] = useState('Assistant Executive Officer');
  const [adminSubcategory, setAdminSubcategory] = useState('Public Works & Infrastructure');
  const [otpSent, setOtpSent] = useState(false);
  const [adminOtp, setAdminOtp] = useState('');

  // Handle Admin Login
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await adminLogin(password, identifier);
      if (res.success && res.user) {
        onLoginSuccess(res.user.role === 'main_admin' ? 'main_admin' : 'admin');
      } else {
        setErrorMsg(res.message || 'Invalid administrative credentials.');
      }
    } catch {
      setErrorMsg('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin OTP Request
  const handleSendAdminOtp = () => {
    if (adminPhone.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number before requesting OTP.');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setAdminOtp('123456'); // Pre-fill demo OTP for developer/user convenience
  };

  // Handle Admin Registration
  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpSent) {
      setErrorMsg('Please click "Send OTP" and verify your mobile number first.');
      return;
    }

    if (!adminOtp || adminOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP sent to your phone (Demo code: 123456).');
      return;
    }

    setLoading(true);
    try {
      const res = await registerAdmin({
        name: adminName,
        phone: adminPhone,
        email: adminEmail,
        department: adminDepartment,
        profession: adminProfession,
        departmentSubcategory: adminSubcategory,
        otp: adminOtp
      });

      if (res.success) {
        setPendingSuccessMsg(
          res.message ||
            'Admin registration submitted successfully! Your account is PENDING Main Admin approval before dashboard access.'
        );
      } else {
        setErrorMsg(res.message || 'Admin registration failed.');
      }
    } catch {
      setErrorMsg('An error occurred during admin registration.');
    } finally {
      setLoading(false);
    }
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleTopBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            title={authView === 'options' ? 'Back to Role Selection' : 'Back to Options'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-blue-900">CIVICEYE</span>
          </div>
          <div className="w-5" />
        </div>

        {/* VIEW 1: ROLE AUTHENTICATION OPTIONS (Requirement 3 & 6) */}
        {authView === 'options' && (
          <div className="mt-8 flex flex-col items-center text-center">
            {/* Officer Graphic */}
            <div className="w-20 h-20 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-xl shadow-slate-800/25 ring-8 ring-slate-100 mb-3">
              <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full">
              Panchayat &amp; Officer Desk
            </span>

            <h2 className="text-xl font-extrabold text-slate-900 mt-2">Welcome, Officer</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-[270px] leading-relaxed">
              Verify village grievances, assign technical field crew, and coordinate infrastructure works.
            </p>

            {/* Authentication Choices Container */}
            <div className="w-full mt-8 space-y-4">
              {/* FIRST OPTION: Create Account / Register as Admin (Requirement 6) */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  New Department Officer?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setPendingSuccessMsg('');
                    setAuthView('register');
                  }}
                  className="w-full p-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-md shadow-slate-900/25 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold text-white leading-tight">
                        Create Account / Register as Admin
                      </span>
                      <span className="text-[11px] text-slate-300 font-normal">
                        Submit departmental registration with OTP
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
                    setPendingSuccessMsg('');
                    setAuthView('login');
                  }}
                  className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-slate-400 active:scale-[0.98] text-slate-800 rounded-2xl font-bold text-sm transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 group-hover:bg-slate-300 flex items-center justify-center text-slate-800 transition-colors">
                      <LogIn className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-bold leading-tight">
                        Login
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Sign in with registered mobile &amp; password
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ADMIN REGISTRATION FORM */}
        {authView === 'register' && (
          <div>
            {pendingSuccessMsg ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-9 h-9 animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Registration Submitted</h3>
                <p className="text-xs text-slate-600 mt-2 px-3 leading-relaxed">
                  {pendingSuccessMsg}
                </p>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-left text-xs text-amber-900">
                  <span className="font-bold block">Status: Pending Main Admin Approval</span>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    The District Chief Officer (Main Admin) must verify and approve your credentials before you can log in.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthView('options')}
                  className="w-full mt-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Return to Portal Options
                </button>
              </div>
            ) : (
              <div>
                <div className="mt-4 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                    Officer Sign Up
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 mt-1">Register as Admin</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Panchayat &amp; departmental officer registration
                  </p>
                </div>

                {errorMsg && (
                  <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAdminRegister} className="mt-4 space-y-3">
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
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Officer full name"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Registered Mobile Number with Send OTP */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Registered Mobile Number *
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
                          placeholder="10-digit number"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendAdminOtp}
                        className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>{otpSent ? 'Resend' : 'Send OTP'}</span>
                      </button>
                    </div>
                  </div>

                  {/* OTP Verification Input */}
                  {otpSent && (
                    <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800">
                          OTP Verification Code:
                        </span>
                        <span className="text-[10px] text-slate-400">Hint: 123456</span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={adminOtp}
                        onChange={(e) => setAdminOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full py-2 px-3 text-center tracking-widest font-mono text-base font-bold bg-white border border-slate-300 rounded-xl outline-none text-slate-900 focus:ring-2 focus:ring-slate-800"
                      />
                    </div>
                  )}

                  {/* Profession / Department */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Profession / Department *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={adminDepartment}
                        onChange={(e) => setAdminDepartment(e.target.value)}
                        placeholder="e.g. Municipal Governance, Electricity Board"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Designation / Role Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminProfession}
                      onChange={(e) => setAdminProfession(e.target.value)}
                      placeholder="e.g. Assistant Executive Officer, Sanitation Lead"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>

                  {/* Department Subcategory */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Department Subcategory (Optional)
                    </label>
                    <input
                      type="text"
                      value={adminSubcategory}
                      onChange={(e) => setAdminSubcategory(e.target.value)}
                      placeholder="e.g. Public Health & Drainage Oversight"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-3 py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Submitting Application...' : 'Register'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: ADMIN LOGIN FORM */}
        {authView === 'login' && (
          <div>
            <div className="mt-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                Officer Sign In
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-1">Admin Login</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your administrative credentials to continue
              </p>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Demo Credentials Toggle */}
            <div className="mt-4 flex gap-1.5 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('');
                  setPassword('admin123');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  password === 'admin123'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Panchayat Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('mainadmin@civiceye.gov');
                  setPassword('mainadmin123');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  password === 'mainadmin123'
                    ? 'bg-slate-900 text-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ★ Main Admin
              </button>
            </div>

            <form onSubmit={handleAdminSubmit} className="mt-4 space-y-3.5">
              {/* Registered Mobile Number */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Registered Mobile Number / Identifier
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter registered mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white rounded-xl text-xs font-semibold text-slate-900 outline-none transition-all shadow-xs"
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
                    onClick={() =>
                      alert(
                        'Administrative Access Notice:\n• Regular Admin demo password: admin123\n• District Main Admin master password: mainadmin123'
                      )
                    }
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-slate-800 focus:bg-white rounded-xl text-xs font-semibold text-slate-900 outline-none transition-all shadow-xs"
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
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-slate-900/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying Credentials...' : 'Login'}
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
              className="font-bold text-slate-900 hover:underline"
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
              className="font-bold text-slate-900 hover:underline"
            >
              Register as Admin
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
