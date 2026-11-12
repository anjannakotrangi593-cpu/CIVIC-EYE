import {
  Complaint,
  StatusHistoryItem,
  ComplaintComment,
  AppNotification,
  VillageAnnouncement,
  AssignedWorker,
  EmergencyContact,
  UserProfile,
  RegistrationRequest,
  DepartmentInfo,
  AuditLog
} from '../types';

export const INITIAL_CITIZEN: UserProfile = {
  id: 'usr_ravi_101',
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  email: 'ravi.kumar@village.gov.in',
  ward: 'Ward 4 (MG Road Sector)',
  role: 'citizen',
  approvalStatus: 'approved',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  createdAt: '2025-04-10T09:00:00Z'
};

export const INITIAL_ADMIN: UserProfile = {
  id: 'usr_admin_001',
  name: 'Panchayat Officer Anil Verma',
  phone: '+91 98111 22334',
  email: 'admin@civiceye.gov',
  ward: 'Gram Panchayat Central Office',
  role: 'admin',
  approvalStatus: 'approved',
  department: 'Rural Development & Public Works',
  profession: 'Panchayat Executive Officer',
  departmentSubcategory: 'Municipal Governance & Works',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  createdAt: '2025-01-01T00:00:00Z'
};

export const INITIAL_MAIN_ADMIN: UserProfile = {
  id: 'usr_main_admin_001',
  name: 'District Chief Officer Rajeshwar Rao',
  phone: '+91 99999 00001',
  email: 'mainadmin@civiceye.gov',
  ward: 'District Collectorate / Zilla Parishad',
  role: 'main_admin',
  approvalStatus: 'approved',
  profession: 'Chief Municipal Commissioner',
  department: 'Apex Village Administration',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  createdAt: '2024-12-01T00:00:00Z'
};

export const INITIAL_WORKERS: AssignedWorker[] = [
  {
    id: 'wrk_01',
    name: 'Ramesh Kumar (Worker)',
    phone: '+91 94123 55667',
    department: 'Sanitation',
    roleTitle: 'Sanitation Field Supervisor',
    activeTasks: 3,
    approvalStatus: 'approved'
  },
  {
    id: 'wrk_02',
    name: 'Suresh Patel (Worker)',
    phone: '+91 94123 77889',
    department: 'Roads',
    roleTitle: 'Road Maintenance Lead',
    activeTasks: 2,
    approvalStatus: 'approved'
  },
  {
    id: 'wrk_03',
    name: 'Mahesh Sharma (Lineman)',
    phone: '+91 98222 33445',
    department: 'Electricity',
    roleTitle: 'Senior Village Lineman',
    activeTasks: 1,
    approvalStatus: 'approved'
  },
  {
    id: 'wrk_04',
    name: 'Priya Sundaram (Engineer)',
    phone: '+91 98450 11223',
    department: 'Water Supply',
    roleTitle: 'Water Supply Inspector',
    activeTasks: 2,
    approvalStatus: 'approved'
  }
];

export const INITIAL_REGISTRATION_REQUESTS: RegistrationRequest[] = [
  {
    id: 'req_001',
    userId: 'usr_pending_admin_01',
    name: 'Inspector Meena Devi',
    phone: '+91 98333 44556',
    email: 'meena.devi@panchayat.gov',
    role: 'admin',
    department: 'Sanitation',
    profession: 'Sanitary Inspector',
    departmentSubcategory: 'Public Health & Drainage Oversight',
    status: 'pending',
    verificationStatus: 'verified',
    createdAt: '2025-04-22T08:30:00Z'
  },
  {
    id: 'req_002',
    userId: 'usr_pending_wrk_01',
    name: 'Vikas Yadav',
    phone: '+91 97222 33441',
    role: 'worker',
    department: 'Electricity',
    address: 'Feeder Substation Ward 5, Rampur',
    status: 'pending',
    verificationStatus: 'verified',
    createdAt: '2025-04-22T09:15:00Z'
  }
];

export const INITIAL_DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'dept_sanitation',
    name: 'Sanitation',
    code: 'SAN',
    headName: 'Anil Verma',
    contactPhone: '+91 98111 22334',
    activeWorkersCount: 4,
    openComplaintsCount: 2
  },
  {
    id: 'dept_roads',
    name: 'Roads',
    code: 'RDS',
    headName: 'Suresh Patel',
    contactPhone: '+91 94123 77889',
    activeWorkersCount: 3,
    openComplaintsCount: 1
  },
  {
    id: 'dept_water',
    name: 'Water Supply',
    code: 'WTR',
    headName: 'Priya Sundaram',
    contactPhone: '+91 98450 11223',
    activeWorkersCount: 2,
    openComplaintsCount: 1
  },
  {
    id: 'dept_drainage',
    name: 'Drainage',
    code: 'DRN',
    headName: 'Vikram Joshi',
    contactPhone: '+91 98222 11990',
    activeWorkersCount: 3,
    openComplaintsCount: 1
  },
  {
    id: 'dept_electricity',
    name: 'Electricity',
    code: 'ELE',
    headName: 'Mahesh Sharma',
    contactPhone: '+91 98222 33445',
    activeWorkersCount: 3,
    openComplaintsCount: 1
  },
  {
    id: 'dept_streetlights',
    name: 'Street Lights',
    code: 'STL',
    headName: 'Govind Narain',
    contactPhone: '+91 98333 77665',
    activeWorkersCount: 2,
    openComplaintsCount: 1
  },
  {
    id: 'dept_waste',
    name: 'Waste Management',
    code: 'WST',
    headName: 'Ramesh Kumar',
    contactPhone: '+91 94123 55667',
    activeWorkersCount: 5,
    openComplaintsCount: 2
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_01',
    action: 'SYSTEM_INITIALIZED',
    actorId: 'usr_main_admin_001',
    actorName: 'District Chief Officer Rajeshwar Rao',
    actorRole: 'main_admin',
    details: 'CivicEye core village infrastructure system initialized.',
    timestamp: '2025-04-10T00:00:00Z'
  },
  {
    id: 'audit_02',
    action: 'ADMIN_PROVISIONED',
    actorId: 'usr_main_admin_001',
    actorName: 'District Chief Officer Rajeshwar Rao',
    actorRole: 'main_admin',
    targetId: 'usr_admin_001',
    details: 'Panchayat Officer Anil Verma approved as Ward Administrator.',
    timestamp: '2025-04-11T10:00:00Z'
  }
];

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'emg_01',
    title: 'Electricity Emergency & Lineman',
    department: 'Electricity Board Substation',
    phone: '1912',
    description: 'Call immediately for sparking transformers, fallen electric poles, or exposed live cables. Available 24x7.',
    isHazardEmergency: true
  },
  {
    id: 'emg_02',
    title: 'Village Lineman Direct (Mahesh)',
    department: 'Local Power Maintenance',
    phone: '+91 98222 33445',
    description: 'Duty lineman for Rampur & nearby agricultural feeder lines.',
    isHazardEmergency: true
  },
  {
    id: 'emg_03',
    title: 'Gram Panchayat Emergency Desk',
    department: 'Village Administration',
    phone: '+91 98111 22334',
    description: 'Panchayat office helpline for civic breakdown, water cut, or urgent assistance.'
  },
  {
    id: 'emg_04',
    title: 'Ambulance & Medical Emergency',
    department: 'Health Emergency Service',
    phone: '108',
    description: 'Toll-free emergency medical dispatch for immediate hospitalization.'
  },
  {
    id: 'emg_05',
    title: 'Police Emergency Helpline',
    department: 'Police Department',
    phone: '112',
    description: 'National emergency helpline for law, order, and urgent safety response.'
  },
  {
    id: 'emg_06',
    title: 'Fire & Rescue Service',
    department: 'Disaster & Fire Safety',
    phone: '101',
    description: 'Fire brigade and electrical fire rescue dispatch.'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CIV12345',
    citizenId: 'usr_ravi_101',
    citizenName: 'Ravi Kumar',
    citizenPhone: '+91 98765 43210',
    category: 'garbage',
    subcategory: 'Garbage not collected for days',
    description: 'Garbage not collected for 5 days. Bins are overflowing near the bus stop and stray cattle are scattering plastic waste.',
    imageUrls: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'MG Road, Near Bus Stand',
    ward: 'Ward 4',
    latitude: 26.8467,
    longitude: 80.9462,
    status: 'in_progress',
    priority: 'high',
    assignedDepartment: 'Sanitation Department',
    assignedWorkerName: 'Ramesh (Worker)',
    adminNotes: 'Work in progress. Worker assigned for special clearance truck.',
    createdAt: '2025-04-21T10:30:00Z',
    updatedAt: '2025-04-21T11:15:00Z'
  },
  {
    id: 'CIV12346',
    citizenId: 'usr_ravi_101',
    citizenName: 'Ravi Kumar',
    citizenPhone: '+91 98765 43210',
    category: 'streetlight',
    subcategory: 'Street light not working / dark street',
    description: 'Street light not working at Pole #14 on the crossway leading to primary school. It gets completely dark after 7 PM.',
    imageUrls: [
      'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Park Road, Near Primary School, Ward 2',
    ward: 'Ward 2',
    latitude: 26.8512,
    longitude: 80.9495,
    status: 'submitted',
    priority: 'medium',
    assignedDepartment: 'Panchayat Electrical Maintenance',
    createdAt: '2025-04-20T09:15:00Z',
    updatedAt: '2025-04-20T09:15:00Z'
  },
  {
    id: 'CIV12347',
    citizenId: 'usr_ravi_101',
    citizenName: 'Ravi Kumar',
    citizenPhone: '+91 98765 43210',
    category: 'water',
    subcategory: 'Underground pipeline burst / leak',
    description: 'Water leakage in primary underground supply pipe near the green park junction. Clean drinking water was getting wasted on the road.',
    imageUrls: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
    ],
    afterImageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    address: 'Green Park Road, Ward 1',
    ward: 'Ward 1',
    latitude: 26.8421,
    longitude: 80.9415,
    status: 'resolved',
    priority: 'high',
    assignedDepartment: 'Rural Water Supply Board',
    assignedWorkerName: 'Priya Sundaram (Engineer)',
    resolutionNotes: 'Pipe joint replaced with new pressure valve. Water supply restored normally.',
    createdAt: '2025-04-19T08:00:00Z',
    updatedAt: '2025-04-19T14:30:00Z'
  },
  {
    id: 'CIV12348',
    citizenId: 'usr_anita_102',
    citizenName: 'Anita Sharma',
    citizenPhone: '+91 97112 33445',
    category: 'drainage',
    subcategory: 'Blocked open drain / gutter clogged',
    description: 'Drainage blockage causing filthy wastewater to back up in front of market shops.',
    imageUrls: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Main Market Road, Ward 3',
    ward: 'Ward 3',
    latitude: 26.8488,
    longitude: 80.9441,
    status: 'submitted',
    priority: 'high',
    assignedDepartment: 'Drainage & Public Health',
    createdAt: '2025-04-18T16:20:00Z',
    updatedAt: '2025-04-18T16:20:00Z'
  },
  {
    id: 'CIV12349',
    citizenId: 'usr_mohan_103',
    citizenName: 'Mohan Lal',
    citizenPhone: '+91 96554 44332',
    category: 'electricity',
    subcategory: 'Exposed high-voltage live wire',
    description: 'High voltage wire hanging low and touching neem tree branch right after sudden storm. Hazardous to pedestrians and cattle!',
    imageUrls: [
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Near Ram Mandir Chauraha, Ward 5',
    ward: 'Ward 5',
    latitude: 26.8499,
    longitude: 80.9525,
    status: 'verified',
    priority: 'urgent',
    assignedDepartment: 'State Electricity Distribution Co.',
    assignedWorkerName: 'Mahesh Sharma (Lineman)',
    adminNotes: 'Urgent priority flagged. Lineman dispatched with safety bucket truck.',
    createdAt: '2025-04-21T12:00:00Z',
    updatedAt: '2025-04-21T12:30:00Z'
  },
  {
    id: 'CIV12350',
    citizenId: 'usr_ravi_101',
    citizenName: 'Ravi Kumar',
    citizenPhone: '+91 98765 43210',
    category: 'road',
    subcategory: 'Potholes on main road',
    description: 'Deep potholes on the village entrance road damaged two tractors yesterday.',
    imageUrls: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    address: 'Village Entrance Gate, Main Road',
    ward: 'Ward 4',
    latitude: 26.8451,
    longitude: 80.9388,
    status: 'verified',
    priority: 'medium',
    assignedDepartment: 'Public Works / Gram Panchayat Works',
    assignedWorkerName: 'Suresh Patel (Worker)',
    adminNotes: 'Inspection done. Material sanction requested for patchwork.',
    createdAt: '2025-04-17T11:00:00Z',
    updatedAt: '2025-04-18T10:00:00Z'
  }
];

export const INITIAL_STATUS_HISTORY: StatusHistoryItem[] = [
  {
    id: 'hist_01',
    complaintId: 'CIV12345',
    status: 'submitted',
    actorName: 'Ravi Kumar',
    actorRole: 'citizen',
    note: 'Complaint registered by citizen with photograph and GPS location.',
    timestamp: '2025-04-21T10:30:00Z'
  },
  {
    id: 'hist_02',
    complaintId: 'CIV12345',
    status: 'verified',
    previousStatus: 'submitted',
    actorName: 'Anil Verma (Officer)',
    actorRole: 'admin',
    note: 'Verified with Ward 4 sanitation coordinator. Sanitation team alerted.',
    timestamp: '2025-04-21T10:45:00Z'
  },
  {
    id: 'hist_03',
    complaintId: 'CIV12345',
    status: 'in_progress',
    previousStatus: 'verified',
    actorName: 'Anil Verma (Officer)',
    actorRole: 'admin',
    note: 'Assigned to worker Ramesh Kumar (Worker). Vehicle #4 dispatched for waste clearance.',
    timestamp: '2025-04-21T11:15:00Z'
  },
  {
    id: 'hist_04',
    complaintId: 'CIV12347',
    status: 'submitted',
    actorName: 'Ravi Kumar',
    actorRole: 'citizen',
    note: 'Complaint submitted with photo.',
    timestamp: '2025-04-19T08:00:00Z'
  },
  {
    id: 'hist_05',
    complaintId: 'CIV12347',
    status: 'verified',
    previousStatus: 'submitted',
    actorName: 'Anil Verma (Officer)',
    actorRole: 'admin',
    note: 'Verified leakage on 4-inch supply line.',
    timestamp: '2025-04-19T09:00:00Z'
  },
  {
    id: 'hist_06',
    complaintId: 'CIV12347',
    status: 'in_progress',
    previousStatus: 'verified',
    actorName: 'Anil Verma (Officer)',
    actorRole: 'admin',
    note: 'Plumbing crew excavated joint and replacing pipe sleeve.',
    timestamp: '2025-04-19T10:30:00Z'
  },
  {
    id: 'hist_07',
    complaintId: 'CIV12347',
    status: 'resolved',
    previousStatus: 'in_progress',
    actorName: 'Anil Verma (Officer)',
    actorRole: 'admin',
    note: 'Pipe repaired, tested at full pressure. Road surface backfilled.',
    timestamp: '2025-04-19T14:30:00Z'
  }
];

export const INITIAL_COMMENTS: ComplaintComment[] = [
  {
    id: 'comm_01',
    complaintId: 'CIV12345',
    authorId: 'usr_ravi_101',
    authorName: 'Ravi Kumar',
    authorRole: 'citizen',
    message: 'Thank you for resolving the issue! 🙌',
    timestamp: '2025-04-22T12:00:00Z'
  },
  {
    id: 'comm_02',
    complaintId: 'CIV12345',
    authorId: 'usr_admin_001',
    authorName: 'Municipal Team',
    authorRole: 'admin',
    message: "You're welcome! 😊 Our team completed the clearance and disinfected the area.",
    timestamp: '2025-04-22T12:05:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    userId: 'usr_ravi_101',
    complaintId: 'CIV12345',
    title: 'Complaint CIV12345 marked as In Progress',
    message: 'Worker Ramesh Kumar has been assigned to clear the garbage at MG Road.',
    type: 'status_change',
    read: false,
    createdAt: '2025-04-21T10:35:00Z'
  },
  {
    id: 'notif_02',
    userId: 'usr_ravi_101',
    complaintId: 'CIV12346',
    title: 'Complaint CIV12346 is Pending',
    message: 'Your report regarding Street Light at Park Road is logged under verification.',
    type: 'status_change',
    read: false,
    createdAt: '2025-04-20T09:15:00Z'
  },
  {
    id: 'notif_03',
    userId: 'usr_ravi_101',
    complaintId: 'CIV12347',
    title: 'Complaint CIV12347 Marked as Completed',
    message: 'Water supply leakage at Green Park Road has been resolved successfully.',
    type: 'status_change',
    read: true,
    createdAt: '2025-04-19T14:30:00Z'
  },
  {
    id: 'notif_04',
    userId: 'usr_ravi_101',
    title: 'Welcome to CIVICEYE!',
    message: 'Thank you for joining our smart village community. Together for a cleaner & safer village!',
    type: 'welcome',
    read: true,
    createdAt: '2025-04-18T18:00:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: VillageAnnouncement[] = [
  {
    id: 'ann_01',
    title: '⚡ Scheduled Power Shutdown for Transformer Upgradation',
    message: 'State Electricity Board has notified a power shutdown on Thursday, 24th April from 10:00 AM to 2:00 PM for feeder line maintenance in Wards 3, 4 and 5.',
    category: 'Power Outage',
    severity: 'warning',
    publishDate: '2025-04-21T08:00:00Z',
    expiryDate: '2025-04-25T00:00:00Z',
    publishedBy: 'Panchayat Officer Anil Verma'
  },
  {
    id: 'ann_02',
    title: '💧 Drinking Water Supply Pipeline Testing',
    message: 'Water supply will run with extra chlorination tomorrow morning. Residents are advised to boil drinking water as a health precaution.',
    category: 'Water Supply',
    severity: 'info',
    publishDate: '2025-04-20T17:00:00Z',
    expiryDate: '2025-04-23T00:00:00Z',
    publishedBy: 'Gram Panchayat Health Desk'
  }
];
