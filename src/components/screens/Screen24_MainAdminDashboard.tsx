import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  FileText,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  LogOut,
  ChevronRight,
  Shield,
  Activity,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import {
  RegistrationRequest,
  Complaint,
  DepartmentInfo,
  AuditLog,
  UserProfile,
  ApprovalStatus
} from '../../types';

interface Props {
  complaints: ComplaintsListProps;
  onSelectComplaint?: (complaint: Complaint) => void;
  onLogout: () => void;
  onRefresh: () => void;
}

type ComplaintsListProps = Complaint[];

export const Screen24_MainAdminDashboard: React.FC<Props> = ({
  complaints,
  onSelectComplaint,
  onLogout,
  onRefresh
}) => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'requests' | 'users' | 'departments' | 'logs'>('requests');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Rejection dialog state
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const requests = storage.getRegistrationRequests();
  const allUsers = storage.getUsers();
  const departments = storage.getDepartments();
  const auditLogs = storage.getAuditLogs();

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedAdminsCount = allUsers.filter((u) => u.role === 'admin' && u.approvalStatus === 'approved').length;
  const approvedWorkersCount = allUsers.filter((u) => u.role === 'worker' && u.approvalStatus === 'approved').length;
  const totalComplaintsCount = complaints.length;

  const handleApprove = (reqId: string) => {
    const adminName = user?.name || 'District Chief Officer Rajeshwar Rao';
    const success = storage.approveRegistration(reqId, adminName);
    if (success) {
      onRefresh();
    }
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequestId) return;
    const adminName = user?.name || 'District Chief Officer Rajeshwar Rao';
    const reason = rejectReason.trim() || 'Credentials verification could not be established.';
    const success = storage.rejectRegistration(rejectingRequestId, adminName, reason);
    if (success) {
      setRejectingRequestId(null);
      setRejectReason('');
      onRefresh();
    }
  };

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    if (requestFilter !== 'all' && r.status !== requestFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white px-5 pt-5 pb-4 shrink-0 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Apex Authority
                </span>
                <span className="text-[10px] text-slate-300">District Office</span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                Main Admin Portal
              </h2>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Secure Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Officer Title */}
        <p className="text-xs text-blue-200 mt-2 font-medium">
          Logged in as: <span className="font-bold text-white">{user?.name || 'Rajeshwar Rao'}</span>
        </p>

        {/* Executive Stat Counters */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-center">
            <span className="text-[9px] uppercase tracking-wider text-amber-300 font-bold block">
              Pending
            </span>
            <span className="text-lg font-black text-amber-400 font-mono">
              {pendingCount}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold block">
              Admins
            </span>
            <span className="text-lg font-black text-white font-mono">
              {approvedAdminsCount}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold block">
              Workers
            </span>
            <span className="text-lg font-black text-emerald-300 font-mono">
              {approvedWorkersCount}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 text-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold block">
              Complaints
            </span>
            <span className="text-lg font-black text-blue-300 font-mono">
              {totalComplaintsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white px-3 py-2 border-b border-slate-200 shrink-0 flex items-center justify-between text-xs font-bold">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Approvals ({pendingCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === 'departments'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Depts</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === 'logs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Audit</span>
        </button>
      </div>

      {/* Main View Area */}
      <div className="p-4 flex-1 overflow-y-auto">
        {/* TAB 1: REGISTRATION REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            {/* Filter and Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search applicant name, phone, dept..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={requestFilter}
                onChange={(e) => setRequestFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="all">All</option>
              </select>
            </div>

            {/* List */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-bold text-slate-800">No {requestFilter} requests</h4>
                <p className="text-xs text-slate-500 mt-1">
                  All applicant credentials in this category have been processed.
                </p>
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            req.role === 'admin'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {req.role}
                        </span>

                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            req.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-1">{req.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{req.phone}</span>
                      </p>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="bg-slate-50 rounded-xl p-2.5 text-xs grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">
                        Department
                      </span>
                      <span className="font-semibold">{req.department}</span>
                    </div>

                    {req.profession && (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">
                          Profession
                        </span>
                        <span className="font-semibold">{req.profession}</span>
                      </div>
                    )}

                    {req.departmentSubcategory && (
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">
                          Subcategory
                        </span>
                        <span className="font-medium text-slate-600">{req.departmentSubcategory}</span>
                      </div>
                    )}

                    {req.address && (
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">
                          Address / Field
                        </span>
                        <span className="font-medium text-slate-600">{req.address}</span>
                      </div>
                    )}

                    {req.rejectionReason && (
                      <div className="col-span-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                        <span className="text-[10px] font-bold uppercase block">Rejection Reason</span>
                        <span className="text-xs">{req.rejectionReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons if Pending */}
                  {req.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setRejectingRequestId(req.id)}
                        className="py-2 px-3 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(req.id)}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve &amp; Activate</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: REGISTERED USERS & STAFF */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Staff &amp; Administrative Directory ({allUsers.length})
            </div>

            {allUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      u.role === 'main_admin'
                        ? 'bg-amber-100 text-amber-800'
                        : u.role === 'admin'
                        ? 'bg-indigo-100 text-indigo-800'
                        : u.role === 'worker'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                      <span
                        className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                          u.approvalStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.approvalStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.approvalStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {u.phone} • {u.department || u.role}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {u.role.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Municipal Departments &amp; Workload
            </div>

            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {dept.code}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{dept.name}</h4>
                      <p className="text-[10px] text-slate-500">Supervisor: {dept.headName}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-blue-600">
                    {dept.contactPhone}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 block font-bold">Active Workers</span>
                    <span className="font-extrabold text-slate-800 text-sm">{dept.activeWorkersCount}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 block font-bold">Open Complaints</span>
                    <span className="font-extrabold text-blue-600 text-sm">{dept.openComplaintsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              System Security &amp; Activity Audit Logs ({auditLogs.length})
            </div>

            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-xl border border-slate-200 p-3 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-800 font-medium">{log.details}</p>
                <p className="text-[10px] text-slate-400">
                  By {log.actorName} ({log.actorRole})
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectingRequestId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-bold text-slate-900 text-center">Reject Registration</h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              Provide an official reason for rejecting this applicant.
            </p>

            <form onSubmit={handleRejectSubmit} className="mt-4 space-y-3">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Incomplete proof of ward posting or unmatched official credentials..."
                rows={3}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-500 resize-none text-slate-800"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingRequestId(null)}
                  className="py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
