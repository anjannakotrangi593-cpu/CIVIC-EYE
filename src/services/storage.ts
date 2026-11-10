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
  FirebaseConnectionConfig
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_STATUS_HISTORY,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_WORKERS,
  INITIAL_EMERGENCY_CONTACTS
} from '../data/seedData';

const STORAGE_KEYS = {
  COMPLAINTS: 'civiceye_complaints_v1',
  HISTORY: 'civiceye_history_v1',
  COMMENTS: 'civiceye_comments_v1',
  NOTIFICATIONS: 'civiceye_notifications_v1',
  ANNOUNCEMENTS: 'civiceye_announcements_v1',
  WORKERS: 'civiceye_workers_v1',
  EMERGENCY: 'civiceye_emergency_v1',
  CONFIG: 'civiceye_firebase_config_v1'
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

  // Complaints
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
    // Generate unique readable ID: CIV followed by 5 digits
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `CIV${randomSuffix}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      ...data,
      id: newId,
      status: 'submitted',
      createdAt: now,
      updatedAt: now
    };

    complaints.unshift(newComplaint);
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

    // Add initial status history item
    this.addStatusHistoryItem({
      complaintId: newId,
      status: 'submitted',
      actorName: data.citizenName,
      actorRole: 'citizen',
      note: 'Complaint registered by citizen with location and photograph.',
      timestamp: now
    });

    // Add citizen in-app notification
    this.addNotification({
      userId: data.citizenId,
      complaintId: newId,
      title: `Complaint ${newId} Submitted`,
      message: `Your report for ${data.category.toUpperCase()} has been submitted successfully. Track updates here.`,
      type: 'status_change',
      read: false
    });

    this.notify();
    return newComplaint;
  }

  public updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    actorName: string,
    actorRole: 'admin' | 'citizen',
    options?: {
      note?: string;
      reason?: string;
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
      actorRole,
      note: options?.note || options?.reason || `Status updated from ${prevStatus} to ${newStatus}`,
      timestamp: now
    });

    // Notify citizen
    const readableStatus =
      newStatus === 'in_progress'
        ? 'In Progress'
        : newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

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

    this.notify();
    return updated;
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

    this.notify();
    return updated;
  }

  // Status History
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

  // Comments
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
    authorRole: 'citizen' | 'admin' | 'worker',
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

    // Also notify submitter if admin commented, or admin if citizen commented
    const complaint = this.getComplaintById(complaintId);
    if (complaint && authorRole === 'admin') {
      this.addNotification({
        userId: complaint.citizenId,
        complaintId,
        title: `New response on Complaint ${complaintId}`,
        message: `${authorName}: "${message.slice(0, 80)}"`,
        type: 'status_change',
        read: false
      });
    }

    this.notify();
    return newComment;
  }

  // Notifications
  public getNotifications(userId: string): AppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: AppNotification[] = data ? JSON.parse(data) : [];
      return all
        .filter((n) => n.userId === userId || n.userId === 'all')
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
        if (n.userId === userId || n.userId === 'all') {
          n.read = true;
        }
      });
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  // Announcements
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

    // Also broadcast notification to all citizens
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

  // Workers
  public getWorkers(): AssignedWorker[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKERS);
      return data ? JSON.parse(data) : INITIAL_WORKERS;
    } catch {
      return INITIAL_WORKERS;
    }
  }

  // Emergency Contacts
  public getEmergencyContacts(): EmergencyContact[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
      return data ? JSON.parse(data) : INITIAL_EMERGENCY_CONTACTS;
    } catch {
      return INITIAL_EMERGENCY_CONTACTS;
    }
  }

  // Firebase Config
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
    this.notify();
  }
}

export const storage = new CivicEyeStorage();
