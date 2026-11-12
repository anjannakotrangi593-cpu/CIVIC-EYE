export type ComplaintCategory =
  | 'garbage'
  | 'road'
  | 'streetlight'
  | 'water'
  | 'drainage'
  | 'electricity'
  | 'other';

export type ComplaintStatus =
  | 'submitted'
  | 'verified'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'submitted_for_review'
  | 'resolved'
  | 'rejected'
  | 'rework_required'
  | 'duplicate';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export type UserRole = 'citizen' | 'worker' | 'admin' | 'main_admin';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ProgressUpdate {
  id: string;
  complaintId: string;
  workerId: string;
  workerName: string;
  description: string;
  images: string[];
  timestamp: string;
  isVerifiedByAdmin: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface CompletionReport {
  id: string;
  complaintId: string;
  workerId: string;
  workerName: string;
  summary: string;
  afterImages: string[];
  submittedAt: string;
  status: 'pending_review' | 'approved' | 'rework_requested';
  adminFeedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Complaint {
  id: string; // e.g., CIV12345
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  category: ComplaintCategory;
  customCategoryTitle?: string;
  subcategory?: string;
  description: string;
  imageUrls: string[];
  afterImageUrl?: string;
  address: string;
  ward: string;
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedDepartment?: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  statusReason?: string; // Reason when rejected or duplicate
  adminNotes?: string;
  resolutionNotes?: string;
  progressUpdates?: ProgressUpdate[];
  completionReport?: CompletionReport;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryItem {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  previousStatus?: ComplaintStatus;
  actorName: string;
  actorRole: UserRole;
  note?: string;
  timestamp: string;
}

export interface ComplaintComment {
  id: string;
  complaintId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  message: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  complaintId?: string;
  title: string;
  message: string;
  type: 'status_change' | 'announcement' | 'urgent_hazard' | 'assignment' | 'welcome' | 'registration_request' | 'approval_decision' | 'progress_update' | 'completion_review';
  read: boolean;
  targetRole?: UserRole;
  createdAt: string;
}

export interface VillageAnnouncement {
  id: string;
  title: string;
  message: string;
  category: 'General' | 'Power Outage' | 'Water Supply' | 'Road Work' | 'Health Alert';
  severity: 'info' | 'warning' | 'urgent';
  publishDate: string;
  expiryDate?: string;
  publishedBy: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  ward?: string;
  address?: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
  avatar?: string;
  passwordHash?: string;
  department?: string;
  profession?: string;
  departmentSubcategory?: string;
  rejectionReason?: string;
  workerInfo?: {
    department: string;
    roleTitle: string;
    activeTasks?: number;
  };
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface RegistrationRequest {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  role: 'worker' | 'admin';
  department: string;
  profession?: string;
  departmentSubcategory?: string;
  address?: string;
  status: ApprovalStatus;
  verificationStatus: 'verified' | 'unverified';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AssignedWorker {
  id: string;
  name: string;
  phone: string;
  department: string;
  roleTitle: string;
  activeTasks: number;
  approvalStatus?: ApprovalStatus;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  headName: string;
  contactPhone: string;
  activeWorkersCount: number;
  openComplaintsCount: number;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  department: string;
  phone: string;
  description: string;
  isHazardEmergency?: boolean;
}

export interface FirebaseConnectionConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
  googleMapsApiKey?: string;
  useLiveFirebase: boolean;
}
