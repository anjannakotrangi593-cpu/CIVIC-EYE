import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Sparkles,
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  initialTab?: 'citizen' | 'worker' | 'admin';
  onClose: () => void;
  onCitizenRegistered?: () => void;
}

export const RegistrationModal: React.FC<Props> = ({
  initialTab = 'citizen',
  onClose,
  onCitizenRegistered
}) => {
  const { registerCitizen, registerWorker, registerAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'citizen' | 'worker' | 'admin'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState<{
    title: string;
    message: string;
    status: 'approved' | 'pending';
  } | null>(null);

  // Citizen Form State
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [citizenPassword, setCitizenPassword] = useState('');
  const [citizenConfirmPassword, setCitizenConfirmPassword] = useState('');
  const [citizenWard, setCitizenWard] = useState('Ward 4 (MG Road Sector)');

  // Worker Form State
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [workerAddress, setWorkerAddress] = useState('');
  const [workerDepartment, setWorkerDepartment] = useState('Sanitation');

  // Admin Form State
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminDepartment, setAdminDepartment] = useState('Municipal');
  const [adminProfession, setAdminProfession] = useState('Assistant Executive Officer');
  const [adminSubcategory, setAdminSubcategory] = useState('Public Works & Infrastructure');
  const [otpSent, setOtpSent] = useState(false);
  const [adminOtp, setAdminOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);

  // Password strength calculator
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

  const strength = getPasswordStrength(citizenPassword);

  const handleSendAdminOtp = () => {
    if (adminPhone.replace(/\D/g, '').length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number before requesting OTP.');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setAdminOtp('123456'); // Default demo code filled for convenience
  };

  // Submit Citizen
  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await registerCitizen({
        name: citizenName,
        phone: citizenPhone,
        email: citizenEmail,
        password: citizenPassword,
        confirmPassword: citizenConfirmPassword,
        ward: citizenWard
      });

      if (res.success) {
        setSuccessInfo({
          title: 'Citizen Registration Successful!',
          message: 'Your account is created and active. You are now logged in and can submit and track complaints.',
          status: 'approved'
        });
        setTimeout(() => {
          if (onCitizenRegistered) onCitizenRegistered();
        }, 1500);
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during citizen registration.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Worker
  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await registerWorker({
        name: workerName,
        phone: workerPhone,
        address: workerAddress,
        department: workerDepartment
      });

      if (res.success) {
        setSuccessInfo({
          title: 'Worker Registration Submitted!',
          message: res.message || 'Your account is currently PENDING APPROVAL by the District Main Administrator. You will be notified once verified.',
          status: 'pending'
        });
      } else {
        setErrorMsg(res.message || 'Worker registration failed.');
      }
    } catch {
      setErrorMsg('An error occurred during worker registration.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Admin
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpSent) {
      setErrorMsg('Please click "Send OTP" and verify your mobile number first.');
      return;
    }

    if (!adminOtp || adminOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP sent to your phone (Demo: 123456).');
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
        setSuccessInfo({
          title: 'Admin Registration Submitted!',
          message: res.message || 'Your account is currently PENDING APPROVAL by the District Main Administrator. Admins cannot access the dashboard until cleared.',
          status: 'pending'
        });
      } else {
        setErrorMsg(res.message || 'Admin registration failed.');
      }
    } catch {
      setErrorMsg('An error occurred during admin registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base tracking-tight">CIVICEYE Registration</h3>
            <p className="text-[11px] text-blue-100">Create your official village account</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 bg-slate-100 p-1 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('citizen');
              setErrorMsg('');
              setSuccessInfo(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'citizen'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Citizen</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('worker');
              setErrorMsg('');
              setSuccessInfo(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'worker'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Worker</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMsg('');
              setSuccessInfo(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {successInfo ? (
            <div className="text-center py-6">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                  successInfo.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                {successInfo.status === 'approved' ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  <Clock className="w-10 h-10 animate-pulse" />
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{successInfo.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed px-4 mb-6">
                {successInfo.message}
              </p>
              {successInfo.status === 'pending' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-left mb-6 text-xs text-amber-800">
                  <p className="font-bold mb-1">Status: Pending Main Admin Approval</p>
                  <p className="text-[11px] text-amber-700">
                    Your request has been routed to the District Chief Officer (Main Admin). You cannot access the dashboard until the request is reviewed and approved.
                  </p>
                </div>
              )}
              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <div>
              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* TAB 1: CITIZEN REGISTRATION */}
              {activeTab === 'citizen' && (
                <form onSubmit={handleCitizenSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={citizenPhone}
                        onChange={(e) => setCitizenPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={citizenEmail}
                        onChange={(e) => setCitizenEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Village Locality / Ward *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={citizenWard}
                        onChange={(e) => setCitizenWard(e.target.value)}
                        placeholder="e.g. Ward 4 (MG Road Sector)"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  {/* Password & Strength */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Password *
                      </label>
                      {citizenPassword && (
                        <span className="text-[10px] font-bold text-slate-500">
                          Strength: <span className="font-extrabold">{strength.label}</span>
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={citizenPassword}
                        onChange={(e) => setCitizenPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {citizenPassword && (
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

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={citizenConfirmPassword}
                        onChange={(e) => setCitizenConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
                  >
                    {loading ? 'Creating Citizen Account...' : 'Register Citizen Account'}
                  </button>
                </form>
              )}

              {/* TAB 2: WORKER REGISTRATION */}
              {activeTab === 'worker' && (
                <form onSubmit={handleWorkerSubmit} className="space-y-3">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <p className="font-bold flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                      Field Worker Registration
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      New worker accounts require Main Admin verification and approval prior to login.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={workerName}
                        onChange={(e) => setWorkerName(e.target.value)}
                        placeholder="Field technician full name"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={workerPhone}
                        onChange={(e) => setWorkerPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Assigned Field / Department *
                    </label>
                    <select
                      value={workerDepartment}
                      onChange={(e) => setWorkerDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-none"
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

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Address / Feeder Station *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={workerAddress}
                        onChange={(e) => setWorkerAddress(e.target.value)}
                        placeholder="e.g. Feeder Substation Ward 5, Rampur"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Submitting Application...' : 'Submit Worker Registration'}
                  </button>
                </form>
              )}

              {/* TAB 3: ADMIN REGISTRATION (WITH OTP) */}
              {activeTab === 'admin' && (
                <form onSubmit={handleAdminSubmit} className="space-y-3">
                  <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                      Admin / Municipal Officer Registration
                    </p>
                    <p className="text-[11px] text-indigo-700 mt-0.5">
                      Mobile verification via OTP required. Final activation requires Main Admin approval.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Officer full name"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Mobile Number *
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={adminPhone}
                          onChange={(e) => setAdminPhone(e.target.value)}
                          placeholder="10-digit number"
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendAdminOtp}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>{otpSent ? 'Resend' : 'Send OTP'}</span>
                      </button>
                    </div>
                  </div>

                  {/* OTP Input Section */}
                  {otpSent && (
                    <div className="p-3 bg-slate-50 border border-indigo-200 rounded-xl space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-900">Enter 6-Digit OTP:</span>
                        <span className="text-[10px] text-slate-500">Hint: 123456</span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={adminOtp}
                        onChange={(e) => setAdminOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full py-2 px-3 text-center tracking-widest font-mono text-base font-bold bg-white border border-indigo-300 rounded-xl outline-none text-indigo-900 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Profession / Department *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={adminDepartment}
                        onChange={(e) => setAdminDepartment(e.target.value)}
                        placeholder="e.g. Municipal Governance, Electricity Board"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Designation / Role Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminProfession}
                      onChange={(e) => setAdminProfession(e.target.value)}
                      placeholder="e.g. Sanitary Inspector, Executive Officer"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Department Subcategory (Optional)
                    </label>
                    <input
                      type="text"
                      value={adminSubcategory}
                      onChange={(e) => setAdminSubcategory(e.target.value)}
                      placeholder="e.g. Rural Water Works & Drainage Oversight"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Verifying & Submitting...' : 'Submit Admin Application'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
