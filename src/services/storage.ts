import {
  Complaint,
  StatusHistoryItem,
  ComplaintComment,
  AppNotification,
  VillageAnnouncement,
  AssignedWorker,
  EmergencyContact,
  ComplaintStatus,
  ComplaintPriority,
  FirebaseConnectionConfig,
  UserProfile,
  RegistrationRequest,
  DepartmentInfo,
  AuditLog,
  ProgressUpdate,
  CompletionReport,
  UserRole,
  ApprovalStatus
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_STATUS_HISTORY,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_WORKERS,
  INITIAL_EMERGENCY_CONTACTS,
  INITIAL_CITIZEN,
  INITIAL_ADMIN,
  INITIAL_MAIN_ADMIN,
  INITIAL_REGISTRATION_REQUESTS,
  INITIAL_DEPARTMENTS,
  INITIAL_AUDIT_LOGS
} from '../data/seedData';

const STORAGE_KEYS = {
  COMPLAINTS: 'civiceye_complaints_v1',
  HISTORY: 'civiceye_history_v1',
  COMMENTS: 'civiceye_comments_v1',
  NOTIFICATIONS: 'civiceye_notifications_v1',
  ANNOUNCEMENTS: 'civiceye_announcements_v1',
  WORKERS: 'civiceye_workers_v1',
  EMERGENCY: 'civiceye_emergency_v1',
  CONFIG: 'civiceye_firebase_config_v1',
  USERS: 'civiceye_users_v2',
  REG_REQUESTS: 'civiceye_registration_requests_v1',
  DEPARTMENTS: 'civiceye_departments_v1',
  AUDIT_LOGS: 'civiceye_audit_logs_v1'
};

type Listener = () => void;

class CivicEyeStorage {
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.initDefaults();
  }

  private initDefaults() {
    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_STATUS_HISTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WORKERS)) {
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(INITIAL_WORKERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMERGENCY)) {
      localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(INITIAL_EMERGENCY_CONTACTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REG_REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REG_REQUESTS, JSON.stringify(INITIAL_REGISTRATION_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const defaultUsers: UserProfile[] = [
        INITIAL_CITIZEN,
        INITIAL_ADMIN,
        INITIAL_MAIN_ADMIN,
        ...INITIAL_WORKERS.map((w) => ({
          id: w.id,
          name: w.name,
          phone: w.phone,
          role: 'worker' as UserRole,
          approvalStatus: 'approved' as ApprovalStatus,
          department: w.department,
          workerInfo: {
            department: w.department,
            roleTitle: w.roleTitle,
            activeTasks: w.activeTasks
          },
          createdAt: '2025-01-01T00:00:00Z'
        })),
        {
          id: 'usr_pending_admin_01',
          name: 'Inspector Meena Devi',
          phone: '+91 98333 44556',
          email: 'meena.devi@panchayat.gov',
          role: 'admin',
          department: 'Sanitation',
          profession: 'Sanitary Inspector',
          departmentSubcategory: 'Public Health & Drainage Oversight',
          approvalStatus: 'pending',
          createdAt: '2025-04-22T08:30:00Z'
        },
        {
          id: 'usr_pending_wrk_01',
          name: 'Vikas Yadav',
          phone: '+91 97222 33441',
          role: 'worker',
          department: 'Electricity',
          address: 'Feeder Substation Ward 5, Rampur',
          approvalStatus: 'pending',
          createdAt: '2025-04-22T09:15:00Z'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Storage listener error:', err);
      }
    });
  }

  // ==================== USER MANAGEMENT ====================
  public getUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [INITIAL_CITIZEN, INITIAL_ADMIN, INITIAL_MAIN_ADMIN];
    }
  }

  public saveUsers(users: UserProfile[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notify();
  }

  public findUserByPhone(phone: string): UserProfile | undefined {
    const clean = phone.replace(/\D/g, '');
    return this.getUsers().find((u) => {
      const uClean = u.phone.replace(/\D/g, '');
      return uClean.endsWith(clean) || clean.endsWith(uClean);
    });
  }

  public findUserByEmail(email: string): UserProfile | undefined {
    const clean = email.trim().toLowerCase();
    return this.getUsers().find((u) => u.email && u.email.trim().toLowerCase() === clean);
  }

  // ==================== REGISTRATION REQUESTS ====================
  public getRegistrationRequests(): RegistrationRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REG_REQUESTS);
      return data ? JSON.parse(data) : INITIAL_REGISTRATION_REQUESTS;
    } catch {
      return INITIAL_REGISTRATION_REQUESTS;
    }
  }

  public addRegistrationRequest(req: RegistrationRequest) {
    const requests = this.getRegistrationRequests();
    requests.unshift(req);
    localStorage.setItem(STORAGE_KEYS.REG_REQUESTS, JSON.stringify(requests));

    // Also notify Main Admin
    this.addNotification({
      userId: INITIAL_MAIN_ADMIN.id,
      title: `New ${req.role.toUpperCase()} Registration Request`,
      message: `${req.name} (${req.phone}) has submitted a registration request for ${req.department}. Review in Main Admin portal.`,
      type: 'registration_request',
      read: false,
      targetRole: 'main_admin'
    });

    this.addAuditLog({
      action: 'REGISTRATION_SUBMITTED',
      actorId: req.userId,
      actorName: req.name,
      actorRole: req.role,
      targetId: req.id,
      details: `New registration request created by ${req.name} for ${req.department} as ${req.role}.`
    });

    this.notify();
  }

  public approveRegistration(requestId: string, adminName: string): boolean {
    const requests = this.getRegistrationRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return false;

    const req = requests[reqIndex];
    req.status = 'approved';
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = adminName;
    requests[reqIndex] = req;
    localStorage.setItem(STORAGE_KEYS.REG_REQUESTS, JSON.stringify(requests));

    // Update user profile
    const users = this.getUsers();
    const uIndex = users.findIndex((u) => u.id === req.userId || u.phone === req.phone);
    if (uIndex !== -1) {
      users[uIndex].approvalStatus = 'approved';
      users[uIndex].approvedAt = req.reviewedAt;
      users[uIndex].approvedBy = adminName;
      this.saveUsers(users);
    }

    // If Worker, ensure presence in Workers roster
    if (req.role === 'worker') {
      const workers = this.getWorkers();
      const existingWorker = workers.find((w) => w.id === req.userId || w.phone === req.phone);
      if (existingWorker) {
        existingWorker.approvalStatus = 'approved';
      } else {
        workers.push({
          id: req.userId,
          name: `${req.name} (Worker)`,
          phone: req.phone,
          department: req.department,
          roleTitle: `${req.department} Field Worker`,
          activeTasks: 0,
          approvalStatus: 'approved'
        });
      }
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
    }

    // Notify applicant
    this.addNotification({
      userId: req.userId,
      title: 'Registration Approved!',
      message: `Congratulations ${req.name}! Your ${req.role.toUpperCase()} account has been verified and approved by ${adminName}. You can now log in.`,
      type: 'approval_decision',
      read: false,
      targetRole: req.role
    });

    this.addAuditLog({
      action: 'REGISTRATION_APPROVED',
      actorId: 'usr_main_admin_001',
      actorName: adminName,
      actorRole: 'main_admin',
      targetId: req.userId,
      details: `Approved registration request ${req.id} for ${req.name} (${req.role} in ${req.department}).`
    });

    this.notify();
    return true;
  }

  public rejectRegistration(requestId: string, adminName: string, reason: string): boolean {
    const requests = this.getRegistrationRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return false;

    const req = requests[reqIndex];
    req.status = 'rejected';
    req.rejectionReason = reason;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = adminName;
    requests[reqIndex] = req;
    localStorage.setItem(STORAGE_KEYS.REG_REQUESTS, JSON.stringify(requests));

    // Update user profile
    const users = this.getUsers();
    const uIndex = users.findIndex((u) => u.id === req.userId || u.phone === req.phone);
    if (uIndex !== -1) {
      users[uIndex].approvalStatus = 'rejected';
      users[uIndex].rejectionReason = reason;
      this.saveUsers(users);
    }

    // Notify applicant
    this.addNotification({
      userId: req.userId,
      title: 'Registration Update',
      message: `Your registration request was not approved. Reason: ${reason}. Please contact the District Panchayat Office.`,
      type: 'approval_decision',
      read: false,
      targetRole: req.role
    });

    this.addAuditLog({
      action: 'REGISTRATION_REJECTED',
      actorId: 'usr_main_admin_001',
      actorName: adminName,
      actorRole: 'main_admin',
      targetId: req.userId,
      details: `Rejected registration ${req.id} for ${req.name}. Reason: ${reason}`
    });

    this.notify();
    return true;
  }

  // ==================== AUDIT LOGS ====================
  public getAuditLogs(): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      const logs: AuditLog[] = data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    try {
      const logs = this.getAuditLogs();
      const newLog: AuditLog = {
        ...log,
        id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString()
      };
      logs.unshift(newLog);
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.error('Failed to write audit log', e);
    }
  }

  // ==================== DEPARTMENTS ====================
  public getDepartments(): DepartmentInfo[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      return data ? JSON.parse(data) : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  }

  public updateDepartment(id: string, updates: Partial<DepartmentInfo>) {
    const depts = this.getDepartments();
    const index = depts.findIndex((d) => d.id === id);
    if (index !== -1) {
      depts[index] = { ...depts[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(depts));
      this.notify();
    }
  }

  // ==================== COMPLAINTS ====================
  public getComplaints(): Complaint[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return INITIAL_COMPLAINTS;
    }
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.getComplaints().find((c) => c.id.toLowerCase() === id.toLowerCase());
  }

  public addComplaint(
    data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Complaint {
    const complaints = this.getComplaints();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `CIV${randomSuffix}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      ...data,
      id: newId,
      status: 'submitted',
      progressUpdates: [],
      createdAt: now,
      updatedAt: now
    };

    complaints.unshift(newComplaint);
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    // Status history
    this.addStatusHistoryItem({
      complaintId: newId,
      status: 'submitted',
      actorName: data.citizenName,
      actorRole: 'citizen',
      note: 'Complaint registered by citizen with location and photograph.',
      timestamp: now
    });

    // Notify Citizen
    this.addNotification({
      userId: data.citizenId,
      complaintId: newId,
      title: `Complaint ${newId} Submitted`,
      message: `Your report for ${data.category.toUpperCase()} has been submitted successfully. Track updates here.`,
      type: 'status_change',
      read: false
    });

    // Notify Admins
    this.addNotification({
      userId: 'admin_all',
      complaintId: newId,
      title: `New ${data.category.toUpperCase()} Complaint: ${newId}`,
      message: `${data.citizenName} reported an issue at ${data.address} (${data.ward}).`,
      type: 'status_change',
      read: false,
      targetRole: 'admin'
    });

    this.addAuditLog({
      action: 'COMPLAINT_CREATED',
      actorId: data.citizenId,
      actorName: data.citizenName,
      actorRole: 'citizen',
      targetId: newId,
      details: `New complaint filed for ${data.category} at ${data.address}.`
    });

    this.notify();
    return newComplaint;
  }

  public updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    actorName: string,
    actorRole: 'admin' | 'citizen' | 'worker' | 'main_admin',
    options?: {
      note?: string;
      reason?: string;
      assignedWorkerId?: string;
      assignedWorkerName?: string;
      assignedDepartment?: string;
      priority?: ComplaintPriority;
      adminNotes?: string;
    }
  ): Complaint | null {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    const current = complaints[index];
    const prevStatus = current.status;
    const now = new Date().toISOString();

    const updated: Complaint = {
      ...current,
      status: newStatus,
      updatedAt: now,
      statusReason: options?.reason || current.statusReason,
      assignedWorkerId: options?.assignedWorkerId ?? current.assignedWorkerId,
      assignedWorkerName: options?.assignedWorkerName ?? current.assignedWorkerName,
      assignedDepartment: options?.assignedDepartment ?? current.assignedDepartment,
      priority: options?.priority ?? current.priority,
      adminNotes: options?.adminNotes ?? current.adminNotes
    };

    complaints[index] = updated;
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    // Record history
    this.addStatusHistoryItem({
      complaintId: id,
      status: newStatus,
      previousStatus: prevStatus,
      actorName,
      actorRole: actorRole as UserRole,
      note: options?.note || options?.reason || `Status updated from ${prevStatus} to ${newStatus}`,
      timestamp: now
    });

    // Notify worker if assigned
    if (options?.assignedWorkerId && options.assignedWorkerName) {
      this.addNotification({
        userId: options.assignedWorkerId,
        complaintId: id,
        title: `New Task Assigned: ${id}`,
        message: `Admin ${actorName} assigned you complaint ${id} (${updated.category.toUpperCase()}) at ${updated.address}.`,
        type: 'assignment',
        read: false,
        targetRole: 'worker'
      });
    }

    // Notify citizen
    const readableStatus =
      newStatus === 'in_progress'
        ? 'In Progress'
        : newStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    this.addNotification({
      userId: current.citizenId,
      complaintId: id,
      title: `Complaint ${id} marked as ${readableStatus}`,
      message:
        options?.note ||
        (newStatus === 'resolved'
          ? 'Your complaint has been marked as resolved by the municipal administration.'
          : `Status changed to ${readableStatus}.`),
      type: 'status_change',
      read: false
    });

    this.addAuditLog({
      action: 'STATUS_UPDATED',
      actorId: 'usr_admin',
      actorName,
      actorRole: actorRole as UserRole,
      targetId: id,
      details: `Status transitioned from ${prevStatus} to ${newStatus}. Note: ${options?.note || 'None'}`
    });

    this.notify();
    return updated;
  }

  // ==================== WORKER TASK LIFECYCLE ====================
  public acceptTask(complaintId: string, workerId: string, workerName: string): boolean {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id.toLowerCase() === complaintId.toLowerCase());
    if (index === -1) return false;

    const complaint = complaints[index];
    const now = new Date().toISOString();
    complaint.status = 'accepted';
    complaint.updatedAt = now;
    complaints[index] = complaint;
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    this.addStatusHistoryItem({
      complaintId,
      status: 'accepted',
      previousStatus: 'assigned',
      actorName: workerName,
      actorRole: 'worker',
      note: `${workerName} has accepted the assignment and scheduled field action.`,
      timestamp: now
    });

    this.addNotification({
      userId: 'admin_all',
      complaintId,
      title: `Task Accepted: ${complaintId}`,
      message: `${workerName} accepted complaint ${complaintId} and is preparing work.`,
      type: 'status_change',
      read: false,
      targetRole: 'admin'
    });

    this.addAuditLog({
      action: 'TASK_ACCEPTED',
      actorId: workerId,
      actorName: workerName,
      actorRole: 'worker',
      targetId: complaintId,
      details: `Worker ${workerName} accepted task ${complaintId}.`
    });

    this.notify();
    return true;
  }

  public startTask(complaintId: string, workerId: string, workerName: string): boolean {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id.toLowerCase() === complaintId.toLowerCase());
    if (index === -1) return false;

    const complaint = complaints[index];
    const now = new Date().toISOString();
    complaint.status = 'in_progress';
    complaint.updatedAt = now;
    complaints[index] = complaint;
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    this.addStatusHistoryItem({
      complaintId,
      status: 'in_progress',
      previousStatus: 'accepted',
      actorName: workerName,
      actorRole: 'worker',
      note: `Field work actively begun by ${workerName}.`,
      timestamp: now
    });

    this.addNotification({
      userId: complaint.citizenId,
      complaintId,
      title: `Work In Progress on ${complaintId}`,
      message: `Field technician ${workerName} has begun work on site.`,
      type: 'status_change',
      read: false
    });

    this.addAuditLog({
      action: 'WORK_STARTED',
      actorId: workerId,
      actorName: workerName,
      actorRole: 'worker',
      targetId: complaintId,
      details: `Field work started by ${workerName}.`
    });

    this.notify();
    return true;
  }

  public addProgressUpdate(
    complaintId: string,
    workerId: string,
    workerName: string,
    description: string,
    images: string[]
  ): ProgressUpdate | null {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id.toLowerCase() === complaintId.toLowerCase());
    if (index === -1) return null;

    const now = new Date().toISOString();
    const newUpdate: ProgressUpdate = {
      id: `prog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      complaintId,
      workerId,
      workerName,
      description,
      images,
      timestamp: now,
      isVerifiedByAdmin: false
    };

    if (!complaints[index].progressUpdates) {
      complaints[index].progressUpdates = [];
    }
    complaints[index].progressUpdates!.unshift(newUpdate);
    complaints[index].updatedAt = now;
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    // Notify Admin to review and verify progress
    this.addNotification({
      userId: 'admin_all',
      complaintId,
      title: `Worker Update on ${complaintId}`,
      message: `${workerName} uploaded field progress (${images.length} photos). Verify to publish to citizen.`,
      type: 'progress_update',
      read: false,
      targetRole: 'admin'
    });

    this.addAuditLog({
      action: 'PROGRESS_UPDATE_POSTED',
      actorId: workerId,
      actorName: workerName,
      actorRole: 'worker',
      targetId: complaintId,
      details: `${workerName} uploaded progress update: "${description.slice(0, 60)}"`
    });

    this.notify();
    return newUpdate;
  }

  public verifyProgressUpdate(
    complaintId: string,
    updateId: string,
    adminName: string
  ): boolean {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id.toLowerCase() === complaintId.toLowerCase());
    if (index === -1) return false;

    const updates = complaints[index].progressUpdates || [];
    const uIdx = updates.findIndex((u) => u.id === updateId);
    if (uIdx === -1) return false;

    const now = new Date().toISOString();
    updates[uIdx].isVerifiedByAdmin = true;
    updates[uIdx].verifiedAt = now;
    updates[uIdx].verifiedBy = adminName;
    complaints[index].progressUpdates = updates;
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    // Now notify citizen
    this.addNotification({
      userId: complaints[index].citizenId,
      complaintId,
      title: `Verified Work Update for ${complaintId}`,
      message: `Admin verified field progress: "${updates[uIdx].description}"`,
      type: 'progress_update',
      read: false
    });

    this.addAuditLog({
      action: 'PROGRESS_VERIFIED',
      actorId: 'usr_admin',
      actorName: adminName,
      actorRole: 'admin',
      targetId: complaintId,
      details: `Admin ${adminName} verified worker progress update ${updateId}.`
    });

    this.notify();
    return true;
  }

  public submitCompletionReport(
    complaintId: string,
    workerId: string,
    workerName: string,
    summary: string,
    afterImages: string[]
  ): CompletionReport | null {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id.toLowerCase() === complaintId.toLowerCase());
    if (index === -1) return null;

    const now = new Date().toISOString();
    const report: CompletionReport = {
      id: `rep_${Date.now()}`,
      complaintId,
      workerId,
      workerName,
      summary,
      afterImages,
      submittedAt: now,
      status: 'pending_review'
    };

    complaints[index].completionReport = report;
    complaints[index].status = 'submitted_for_review';
    complaints[index].updatedAt = now;
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    this.addStatusHistoryItem({
      complaintId,
      status: 'submitted_for_review',
      previousStatus: 'in_progress',
      actorName: workerName,
      actorRole: 'worker',
      note: `${workerName} submitted completion report with proof images. Pending Admin review.`,
      timestamp: now
    });

    this.addNotification({
      userId: 'admin_all',
      complaintId,
      title: `Completion Report Submitted: ${complaintId}`,
      message: `${workerName} completed work on ${complaintId}. Review summary & photos to approve resolution or request rework.`,
      type: 'completion_review',
      read: false,
      targetRole: 'admin'
    });

    this.addAuditLog({
      action: 'COMPLETION_REPORTED',
      actorId: workerId,
      actorName: workerName,
      actorRole: 'worker',
      targetId: complaintId,
      details: `${workerName} submitted completion report with ${afterImages.length} proof photos.`
    });

    this.notify();
    return report;
  }

  public reviewCompletionReport(
    complaintId: string,
    adminName: string,
    action: 'approve' | 'rework',
    feedback?: string
  ): boolean {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id.toLowerCase() === complaintId.toLowerCase());
    if (index === -1) return false;

    const complaint = complaints[index];
    const report = complaint.completionReport;
    const now = new Date().toISOString();

    if (action === 'approve') {
      complaint.status = 'resolved';
      complaint.resolutionNotes = feedback || report?.summary || 'Work inspected, verified and resolved.';
      if (report && report.afterImages.length > 0) {
        complaint.afterImageUrl = report.afterImages[0];
      }
      if (report) {
        report.status = 'approved';
        report.reviewedAt = now;
        report.reviewedBy = adminName;
        report.adminFeedback = feedback;
      }
      // Also verify all progress updates automatically
      if (complaint.progressUpdates) {
        complaint.progressUpdates.forEach((pu) => {
          pu.isVerifiedByAdmin = true;
          pu.verifiedBy = adminName;
          pu.verifiedAt = now;
        });
      }

      complaint.updatedAt = now;
      complaints[index] = complaint;
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

      this.addStatusHistoryItem({
        complaintId,
        status: 'resolved',
        previousStatus: 'submitted_for_review',
        actorName: adminName,
        actorRole: 'admin',
        note: feedback || 'Completion report approved and verified on site.',
        timestamp: now
      });

      // Notify citizen
      this.addNotification({
        userId: complaint.citizenId,
        complaintId,
        title: `Complaint ${complaintId} Resolved!`,
        message: feedback || 'Your complaint has been successfully resolved and verified by the administration.',
        type: 'status_change',
        read: false
      });

      // Notify worker
      if (report?.workerId) {
        this.addNotification({
          userId: report.workerId,
          complaintId,
          title: `Task Approved: ${complaintId}`,
          message: `Great job! Admin ${adminName} approved your completion report for ${complaintId}.`,
          type: 'approval_decision',
          read: false,
          targetRole: 'worker'
        });
      }

      this.addAuditLog({
        action: 'COMPLETION_APPROVED',
        actorId: 'usr_admin',
        actorName: adminName,
        actorRole: 'admin',
        targetId: complaintId,
        details: `Approved completion report for ${complaintId}. Complaint marked resolved.`
      });
    } else {
      // Rework requested
      complaint.status = 'rework_required';
      complaint.adminNotes = feedback;
      if (report) {
        report.status = 'rework_requested';
        report.reviewedAt = now;
        report.reviewedBy = adminName;
        report.adminFeedback = feedback;
      }
      complaint.updatedAt = now;
      complaints[index] = complaint;
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

      this.addStatusHistoryItem({
        complaintId,
        status: 'rework_required',
        previousStatus: 'submitted_for_review',
        actorName: adminName,
        actorRole: 'admin',
        note: `Rework requested: ${feedback || 'Please fix identified issues.'}`,
        timestamp: now
      });

      // Notify worker
      if (report?.workerId) {
        this.addNotification({
          userId: report.workerId,
          complaintId,
          title: `Rework Required on ${complaintId}`,
          message: `Admin ${adminName} requested rework: "${feedback || 'Please check and address deficiencies.'}"`,
          type: 'completion_review',
          read: false,
          targetRole: 'worker'
        });
      }

      this.addAuditLog({
        action: 'REWORK_REQUESTED',
        actorId: 'usr_admin',
        actorName: adminName,
        actorRole: 'admin',
        targetId: complaintId,
        details: `Requested rework on ${complaintId}. Feedback: ${feedback}`
      });
    }

    this.notify();
    return true;
  }

  public markComplaintResolved(
    id: string,
    actorName: string,
    resolutionNotes: string,
    afterImageUrl?: string
  ): Complaint | null {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    const current = complaints[index];
    const prevStatus = current.status;
    const now = new Date().toISOString();

    const updated: Complaint = {
      ...current,
      status: 'resolved',
      updatedAt: now,
      resolutionNotes,
      afterImageUrl: afterImageUrl || current.afterImageUrl
    };

    complaints[index] = updated;
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    this.addStatusHistoryItem({
      complaintId: id,
      status: 'resolved',
      previousStatus: prevStatus,
      actorName,
      actorRole: 'admin',
      note: resolutionNotes || 'Work completed and verified by administration.',
      timestamp: now
    });

    this.addNotification({
      userId: current.citizenId,
      complaintId: id,
      title: `Complaint ${id} Resolved!`,
      message: resolutionNotes || 'Your complaint has been successfully resolved.',
      type: 'status_change',
      read: false
    });

    this.addAuditLog({
      action: 'COMPLAINT_RESOLVED',
      actorId: 'usr_admin',
      actorName,
      actorRole: 'admin',
      targetId: id,
      details: `Directly resolved complaint ${id}. Notes: ${resolutionNotes}`
    });

    this.notify();
    return updated;
  }

  // ==================== STATUS HISTORY ====================
  public getStatusHistory(complaintId: string): StatusHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const all: StatusHistoryItem[] = data ? JSON.parse(data) : [];
      return all
        .filter((h) => h.complaintId.toLowerCase() === complaintId.toLowerCase())
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch {
      return [];
    }
  }

  private addStatusHistoryItem(item: Omit<StatusHistoryItem, 'id'>) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const all: StatusHistoryItem[] = data ? JSON.parse(data) : [];
      const newItem: StatusHistoryItem = {
        ...item,
        id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      };
      all.push(newItem);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to add status history', e);
    }
  }

  // ==================== COMMENTS ====================
  public getComments(complaintId: string): ComplaintComment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      const all: ComplaintComment[] = data ? JSON.parse(data) : [];
      return all
        .filter((c) => c.complaintId.toLowerCase() === complaintId.toLowerCase())
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch {
      return [];
    }
  }

  public addComment(
    complaintId: string,
    authorId: string,
    authorName: string,
    authorRole: UserRole,
    message: string
  ): ComplaintComment {
    const data = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const all: ComplaintComment[] = data ? JSON.parse(data) : [];
    const now = new Date().toISOString();

    const newComment: ComplaintComment = {
      id: `comm_${Date.now()}`,
      complaintId,
      authorId,
      authorName,
      authorRole,
      message,
      timestamp: now
    };

    all.push(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(all));

    const complaint = this.getComplaintById(complaintId);
    if (complaint && (authorRole === 'admin' || authorRole === 'main_admin')) {
      this.addNotification({
        userId: complaint.citizenId,
        complaintId,
        title: `Official response on Complaint ${complaintId}`,
        message: `${authorName}: "${message.slice(0, 80)}"`,
        type: 'status_change',
        read: false
      });
    }

    this.notify();
    return newComment;
  }

  // ==================== NOTIFICATIONS ====================
  public getNotifications(userId: string): AppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: AppNotification[] = data ? JSON.parse(data) : [];
      return all
        .filter((n) => n.userId === userId || n.userId === 'all' || (userId.startsWith('usr_admin') && (n.userId === 'admin_all' || n.targetRole === 'admin')))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  }

  public addNotification(item: Omit<AppNotification, 'id' | 'createdAt'>) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: AppNotification[] = data ? JSON.parse(data) : [];
      const newNotif: AppNotification = {
        ...item,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString()
      };
      all.unshift(newNotif);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      this.notify();
    } catch (e) {
      console.error('Failed to save notification', e);
    }
  }

  public markNotificationAsRead(id: string) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: AppNotification[] = data ? JSON.parse(data) : [];
      const target = all.find((n) => n.id === id);
      if (target) {
        target.read = true;
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
        this.notify();
      }
    } catch (e) {
      console.error(e);
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: AppNotification[] = data ? JSON.parse(data) : [];
      all.forEach((n) => {
        if (n.userId === userId || n.userId === 'all' || (userId.startsWith('usr_admin') && n.userId === 'admin_all')) {
          n.read = true;
        }
      });
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  // ==================== ANNOUNCEMENTS ====================
  public getAnnouncements(): VillageAnnouncement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      const all: VillageAnnouncement[] = data ? JSON.parse(data) : [];
      return all.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    } catch {
      return [];
    }
  }

  public addAnnouncement(data: Omit<VillageAnnouncement, 'id' | 'publishDate'>): VillageAnnouncement {
    const all = this.getAnnouncements();
    const now = new Date().toISOString();
    const newAnn: VillageAnnouncement = {
      ...data,
      id: `ann_${Date.now()}`,
      publishDate: now
    };
    all.unshift(newAnn);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(all));

    this.addNotification({
      userId: 'all',
      title: `Notice: ${data.title}`,
      message: data.message.slice(0, 100),
      type: 'announcement',
      read: false
    });

    this.notify();
    return newAnn;
  }

  // ==================== WORKERS ====================
  public getWorkers(): AssignedWorker[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKERS);
      return data ? JSON.parse(data) : INITIAL_WORKERS;
    } catch {
      return INITIAL_WORKERS;
    }
  }

  // ==================== EMERGENCY CONTACTS ====================
  public getEmergencyContacts(): EmergencyContact[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
      return data ? JSON.parse(data) : INITIAL_EMERGENCY_CONTACTS;
    } catch {
      return INITIAL_EMERGENCY_CONTACTS;
    }
  }

  // ==================== FIREBASE CONFIG ====================
  public getFirebaseConfig(): FirebaseConnectionConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
      useLiveFirebase: false
    };
  }

  public saveFirebaseConfig(config: FirebaseConnectionConfig) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    this.notify();
  }

  public resetToDemoData() {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_STATUS_HISTORY));
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(INITIAL_WORKERS));
    localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(INITIAL_EMERGENCY_CONTACTS));
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
    localStorage.setItem(STORAGE_KEYS.REG_REQUESTS, JSON.stringify(INITIAL_REGISTRATION_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    this.initDefaults();
    this.notify();
  }
}

export const storage = new CivicEyeStorage();
