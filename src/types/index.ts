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
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'duplicate';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

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
  assignedWorkerName?: string;
  statusReason?: string; // Reason when rejected or duplicate
  adminNotes?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryItem {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  previousStatus?: ComplaintStatus;
  actorName: string;
  actorRole: 'citizen' | 'admin' | 'worker';
  note?: string;
  timestamp: string;
}

export interface ComplaintComment {
  id: string;
  complaintId: string;
  authorId: string;
  authorName: string;
  authorRole: 'citizen' | 'admin' | 'worker';
  message: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  complaintId?: string;
  title: string;
  message: string;
  type: 'status_change' | 'announcement' | 'urgent_hazard' | 'assignment' | 'welcome';
  read: boolean;
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
  ward: string;
  role: 'citizen' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface AssignedWorker {
  id: string;
  name: string;
  phone: string;
  department: string;
  roleTitle: string;
  activeTasks: number;
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
