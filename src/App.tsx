import React, { useState, useEffect } from 'react';
import {
  Home,
  FileText,
  Plus,
  Bell,
  User,
  LayoutDashboard,
  Users,
  Megaphone,
  Smartphone,
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  ChevronDown,
  Wifi,
  Signal,
  Battery
} from 'lucide-react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { storage } from './services/storage';
import { Complaint, AppNotification, VillageAnnouncement, AssignedWorker, EmergencyContact, ComplaintCategory } from './types';

// Screens
import { Screen1_Splash } from './components/screens/Screen1_Splash';
import { Screen2_RoleSelection } from './components/screens/Screen2_RoleSelection';
import { Screen3_CitizenLogin } from './components/screens/Screen3_CitizenLogin';
import { Screen4_OtpVerification } from './components/screens/Screen4_OtpVerification';
import { Screen5_CitizenDashboard } from './components/screens/Screen5_CitizenDashboard';
import { Screen6_ReportProblemType } from './components/screens/Screen6_ReportProblemType';
import { Screen7_ReportUploadDetails } from './components/screens/Screen7_ReportUploadDetails';
import { Screen8_SubmissionSuccess } from './components/screens/Screen8_SubmissionSuccess';
import { Screen9_MyComplaints } from './components/screens/Screen9_MyComplaints';
import { Screen10_ComplaintDetails } from './components/screens/Screen10_ComplaintDetails';
import { Screen11_NearbyIssuesMap } from './components/screens/Screen11_NearbyIssuesMap';
import { Screen12_Notifications } from './components/screens/Screen12_Notifications';
import { Screen13_CitizenProfile } from './components/screens/Screen13_CitizenProfile';
import { Screen14_AdminLogin } from './components/screens/Screen14_AdminLogin';
import { Screen15_AdminDashboard } from './components/screens/Screen15_AdminDashboard';
import { Screen16_AdminComplaintsList } from './components/screens/Screen16_AdminComplaintsList';
import { Screen17_AdminViewDetails } from './components/screens/Screen17_AdminViewDetails';
import { Screen18_AssignWorkerModal } from './components/screens/Screen18_AssignWorkerModal';
import { Screen19_MarkCompletedModal } from './components/screens/Screen19_MarkCompletedModal';

// Modals
import { EmergencyModal } from './components/modals/EmergencyModal';
import { AnnouncementsModal } from './components/modals/AnnouncementsModal';
import { BackendConfigModal } from './components/modals/BackendConfigModal';
import { WorkersModal } from './components/modals/WorkersModal';

export type ScreenId =
  | '1_splash'
  | '2_role_selection'
  | '3_citizen_login'
  | '4_otp_verification'
  | '5_citizen_dashboard'
  | '6_select_problem_type'
  | '7_upload_description'
  | '8_submission_success'
  | '9_my_complaints'
  | '10_complaint_details'
  | '11_nearby_issues'
  | '12_notifications'
  | '13_profile'
  | '14_admin_login'
  | '15_admin_dashboard'
  | '16_admin_complaints'
  | '17_admin_view_details'
  | '18_assign_worker'
  | '19_mark_completed'
  | '20_comments_view';

const SCREEN_TITLES: Record<ScreenId, string> = {
  '1_splash': '1. Splash Screen',
  '2_role_selection': '2. Role Selection',
  '3_citizen_login': '3. Citizen Login',
  '4_otp_verification': '4. OTP Verification',
  '5_citizen_dashboard': '5. Home Dashboard (Citizen)',
  '6_select_problem_type': '6. Select Problem Type',
  '7_upload_description': '7. Upload & Description',
  '8_submission_success': '8. Submission Success',
  '9_my_complaints': '9. My Complaints (Citizen)',
  '10_complaint_details': '10. Complaint Details (Citizen)',
  '11_nearby_issues': '11. Nearby Issues (Map)',
  '12_notifications': '12. Notifications',
  '13_profile': '13. Profile (Citizen)',
  '14_admin_login': '14. Admin Password Login',
  '15_admin_dashboard': '15. Admin Dashboard',
  '16_admin_complaints': '16. All Complaints (Admin)',
  '17_admin_view_details': '17. Admin View Details',
  '18_assign_worker': '18. Assign Worker / Update Status',
  '19_mark_completed': '19. Mark as Completed',
  '20_comments_view': '20. Completed + Comments'
};

function MainAppContent() {
  const { user, role, isAuthenticated, logout } = useAuth();

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('1_splash');
  const [previousScreen, setPreviousScreen] = useState<ScreenId>('1_splash');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [showScreenSelector, setShowScreenSelector] = useState(false);

  // Data State
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [announcements, setAnnouncements] = useState<VillageAnnouncement[]>([]);
  const [workers, setWorkers] = useState<AssignedWorker[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // Workflow states
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [pendingOtpPhone, setPendingOtpPhone] = useState('9876543210');
  const [selectedReportCategory, setSelectedReportCategory] = useState<ComplaintCategory>('garbage');
  const [selectedReportSubcategory, setSelectedReportSubcategory] = useState<string>('');
  const [lastSubmittedId, setLastSubmittedId] = useState('CIV12345');

  // Modals
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showWorkersModal, setShowWorkersModal] = useState(false);

  // Subscribe to storage updates
  useEffect(() => {
    refreshAllData();
    const unsub = storage.subscribe(() => {
      refreshAllData();
    });
    return unsub;
  }, []);

  const refreshAllData = () => {
    const allC = storage.getComplaints();
    setComplaints(allC);
    setNotifications(storage.getNotifications(user?.id || 'all'));
    setAnnouncements(storage.getAnnouncements());
    setWorkers(storage.getWorkers());
    setEmergencyContacts(storage.getEmergencyContacts());

    if (selectedComplaint) {
      const refreshed = allC.find((c) => c.id === selectedComplaint.id);
      if (refreshed) setSelectedComplaint(refreshed);
    }
  };

  const navigateTo = (screen: ScreenId) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Determine if Bottom Navigation should be shown
  const isCitizenApp =
    currentScreen === '5_citizen_dashboard' ||
    currentScreen === '9_my_complaints' ||
    currentScreen === '11_nearby_issues' ||
    currentScreen === '12_notifications' ||
    currentScreen === '13_profile';

  const isAdminApp =
    currentScreen === '15_admin_dashboard' ||
    currentScreen === '16_admin_complaints';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center font-sans antialiased sm:p-4 text-slate-800">
      {/* Top Floating Utility Bar for easy review & testing */}
      <header className="w-full max-w-xl mx-auto mb-3 flex items-center justify-between px-3 py-1.5 bg-slate-800/90 text-white rounded-2xl border border-slate-700/80 backdrop-blur-md shadow-lg z-50 text-xs">
        {/* Quick Screen Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowScreenSelector(!showScreenSelector)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all text-white shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-blue-200" />
            <span className="font-semibold truncate max-w-[170px] sm:max-w-[240px]">
              {SCREEN_TITLES[currentScreen]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {showScreenSelector && (
            <div className="absolute left-0 mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 max-h-80 overflow-y-auto divide-y divide-slate-100">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Jump to any of 20 screens:
              </div>
              {Object.entries(SCREEN_TITLES).map(([id, title]) => (
                <button
                  key={id}
                  onClick={() => {
                    if (id === '10_complaint_details' || id === '17_admin_view_details' || id === '18_assign_worker' || id === '19_mark_completed' || id === '20_comments_view') {
                      setSelectedComplaint(complaints[0] || null);
                    }
                    navigateTo(id as ScreenId);
                    setShowScreenSelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    currentScreen === id
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{title}</span>
                  {currentScreen === id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Viewport Frame Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium text-[11px] transition-colors"
            title="Firebase & Maps Credentials"
          >
            Config
          </button>

          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors text-slate-200"
            title={isMobileFrame ? 'Expand to Desktop View' : 'Switch to Mobile Frame'}
          >
            {isMobileFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Smartphone Shell / Viewport Container */}
      <div
        className={`w-full bg-white transition-all overflow-hidden relative shadow-2xl flex flex-col ${
          isMobileFrame
            ? 'max-w-[420px] h-[852px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 ring-1 ring-slate-900/50'
            : 'max-w-2xl min-h-[85vh] rounded-2xl'
        }`}
      >
        {/* Authentic Smartphone Status Bar (Matching Screen 1-20: Time 9:41, wifi, battery) */}
        <div className="w-full bg-white px-7 pt-3 pb-1 flex items-center justify-between select-none z-30 shrink-0">
          <span className="text-xs font-bold text-slate-900 font-mono tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5 text-slate-900">
            <Signal className="w-3.5 h-3.5 fill-current" />
            <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
            <Battery className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>

        {/* Dynamic Screen Renderer */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {/* Screen 1: Splash */}
          {currentScreen === '1_splash' && (
            <Screen1_Splash
              onGetStarted={() => navigateTo('2_role_selection')}
              onAdminClick={() => navigateTo('14_admin_login')}
            />
          )}

          {/* Screen 2: Role Selection */}
          {currentScreen === '2_role_selection' && (
            <Screen2_RoleSelection
              onBack={() => navigateTo('1_splash')}
              onSelectCitizen={() => navigateTo('3_citizen_login')}
              onSelectAdmin={() => navigateTo('14_admin_login')}
              onLoginClick={() => navigateTo('3_citizen_login')}
            />
          )}

          {/* Screen 3: Citizen Login */}
          {currentScreen === '3_citizen_login' && (
            <Screen3_CitizenLogin
              onBack={() => navigateTo('2_role_selection')}
              onGoToOtp={(phone) => {
                setPendingOtpPhone(phone);
                navigateTo('4_otp_verification');
              }}
              onLoginSuccess={() => navigateTo('5_citizen_dashboard')}
            />
          )}

          {/* Screen 4: OTP Verification */}
          {currentScreen === '4_otp_verification' && (
            <Screen4_OtpVerification
              phone={pendingOtpPhone}
              onBack={() => navigateTo('3_citizen_login')}
              onVerifySuccess={() => navigateTo('5_citizen_dashboard')}
            />
          )}

          {/* Screen 5: Citizen Dashboard */}
          {currentScreen === '5_citizen_dashboard' && (
            <Screen5_CitizenDashboard
              complaints={complaints}
              unreadNotifsCount={unreadNotifsCount}
              announcements={announcements}
              onReportIssue={() => navigateTo('6_select_problem_type')}
              onViewMyComplaints={() => navigateTo('9_my_complaints')}
              onViewNearbyIssues={() => navigateTo('11_nearby_issues')}
              onOpenEmergency={() => setShowEmergencyModal(true)}
              onOpenNotifications={() => navigateTo('12_notifications')}
              onSelectComplaint={(c) => {
                setSelectedComplaint(c);
                navigateTo('10_complaint_details');
              }}
            />
          )}

          {/* Screen 6: Report Problem Type */}
          {currentScreen === '6_select_problem_type' && (
            <Screen6_ReportProblemType
              initialCategory={selectedReportCategory}
              onBack={() => navigateTo('5_citizen_dashboard')}
              onSelectCategory={(cat, sub) => {
                setSelectedReportCategory(cat);
                setSelectedReportSubcategory(sub || '');
                navigateTo('7_upload_description');
              }}
            />
          )}

          {/* Screen 7: Upload & Description */}
          {currentScreen === '7_upload_description' && (
            <Screen7_ReportUploadDetails
              category={selectedReportCategory}
              subcategory={selectedReportSubcategory}
              onBack={() => navigateTo('6_select_problem_type')}
              onSubmitSuccess={(id) => {
                setLastSubmittedId(id);
                navigateTo('8_submission_success');
              }}
            />
          )}

          {/* Screen 8: Submission Success */}
          {currentScreen === '8_submission_success' && (
            <Screen8_SubmissionSuccess
              complaintId={lastSubmittedId}
              onViewComplaints={() => navigateTo('9_my_complaints')}
              onGoHome={() => navigateTo('5_citizen_dashboard')}
            />
          )}

          {/* Screen 9: My Complaints */}
          {currentScreen === '9_my_complaints' && (
            <Screen9_MyComplaints
              complaints={complaints}
              onBack={() => navigateTo('5_citizen_dashboard')}
              onNewComplaint={() => navigateTo('6_select_problem_type')}
              onSelectComplaint={(c) => {
                setSelectedComplaint(c);
                navigateTo('10_complaint_details');
              }}
            />
          )}

          {/* Screen 10 & Screen 20: Complaint Details & Comments */}
          {(currentScreen === '10_complaint_details' || currentScreen === '20_comments_view') && (
            <Screen10_ComplaintDetails
              complaint={selectedComplaint || complaints[0]}
              onBack={() => navigateTo('9_my_complaints')}
              onRefreshComplaint={refreshAllData}
            />
          )}

          {/* Screen 11: Nearby Issues Map */}
          {currentScreen === '11_nearby_issues' && (
            <Screen11_NearbyIssuesMap
              complaints={complaints}
              onBack={() => navigateTo('5_citizen_dashboard')}
              onSelectComplaint={(c) => {
                setSelectedComplaint(c);
                navigateTo('10_complaint_details');
              }}
            />
          )}

          {/* Screen 12: Notifications */}
          {currentScreen === '12_notifications' && (
            <Screen12_Notifications
              notifications={notifications}
              onBack={() => navigateTo('5_citizen_dashboard')}
              onMarkAllRead={() => {
                storage.markAllNotificationsAsRead(user?.id || 'all');
                refreshAllData();
              }}
              onSelectNotification={(notif) => {
                storage.markNotificationAsRead(notif.id);
                if (notif.complaintId) {
                  const target = complaints.find((c) => c.id === notif.complaintId);
                  if (target) {
                    setSelectedComplaint(target);
                    navigateTo('10_complaint_details');
                    return;
                  }
                }
                refreshAllData();
              }}
            />
          )}

          {/* Screen 13: Profile */}
          {currentScreen === '13_profile' && (
            <Screen13_CitizenProfile
              complaints={complaints}
              onBack={() => navigateTo('5_citizen_dashboard')}
              onOpenEmergency={() => setShowEmergencyModal(true)}
              onOpenConfig={() => setShowConfigModal(true)}
              onSwitchToAdmin={() => navigateTo('14_admin_login')}
            />
          )}

          {/* Screen 14: Admin Login */}
          {currentScreen === '14_admin_login' && (
            <Screen14_AdminLogin
              onBack={() => navigateTo('1_splash')}
              onLoginSuccess={() => navigateTo('15_admin_dashboard')}
            />
          )}

          {/* Screen 15: Admin Dashboard */}
          {currentScreen === '15_admin_dashboard' && (
            <Screen15_AdminDashboard
              complaints={complaints}
              announcements={announcements}
              onViewAllComplaints={() => navigateTo('16_admin_complaints')}
              onSelectComplaint={(c) => {
                setSelectedComplaint(c);
                navigateTo('17_admin_view_details');
              }}
              onOpenAnnouncements={() => setShowAnnouncementsModal(true)}
              onOpenWorkers={() => setShowWorkersModal(true)}
              onOpenReports={() =>
                alert(
                  `Panchayat Summary Report:\n• Total Complaints: ${complaints.length}\n• Pending Triage: ${
                    complaints.filter((c) => c.status === 'submitted' || c.status === 'verified').length
                  }\n• In Progress: ${
                    complaints.filter((c) => c.status === 'in_progress').length
                  }\n• Resolved: ${
                    complaints.filter((c) => c.status === 'resolved').length
                  }\n• Average Resolution Time: 28 Hours`
                )
              }
              onLogout={() => {
                logout();
                navigateTo('1_splash');
              }}
            />
          )}

          {/* Screen 16: Admin All Complaints List */}
          {currentScreen === '16_admin_complaints' && (
            <Screen16_AdminComplaintsList
              complaints={complaints}
              onBack={() => navigateTo('15_admin_dashboard')}
              onSelectComplaint={(c) => {
                setSelectedComplaint(c);
                navigateTo('17_admin_view_details');
              }}
            />
          )}

          {/* Screen 17: Admin View Details */}
          {currentScreen === '17_admin_view_details' && (
            <Screen17_AdminViewDetails
              complaint={selectedComplaint || complaints[0]}
              onBack={() => navigateTo('16_admin_complaints')}
              onOpenAssignModal={() => navigateTo('18_assign_worker')}
              onOpenCompleteModal={() => navigateTo('19_mark_completed')}
            />
          )}

          {/* Screen 18: Assign Worker / Update Status */}
          {currentScreen === '18_assign_worker' && (
            <Screen18_AssignWorkerModal
              complaint={selectedComplaint || complaints[0]}
              workers={workers}
              onBack={() => navigateTo('17_admin_view_details')}
              onUpdated={() => {
                refreshAllData();
                navigateTo('17_admin_view_details');
              }}
            />
          )}

          {/* Screen 19: Mark as Completed */}
          {currentScreen === '19_mark_completed' && (
            <Screen19_MarkCompletedModal
              complaint={selectedComplaint || complaints[0]}
              onBack={() => navigateTo('17_admin_view_details')}
              onCompleted={() => {
                refreshAllData();
                navigateTo('17_admin_view_details');
              }}
            />
          )}
        </main>

        {/* Citizen Bottom Navigation Bar (Screens 5, 9, 11, 12, 13) */}
        {isCitizenApp && (
          <nav className="h-16 bg-white border-t border-slate-100 flex items-center justify-around px-3 z-30 select-none shrink-0 shadow-lg">
            {/* Home */}
            <button
              onClick={() => navigateTo('5_citizen_dashboard')}
              className={`flex flex-col items-center gap-1 py-1 transition-colors ${
                currentScreen === '5_citizen_dashboard' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px]">Home</span>
            </button>

            {/* My Complaints */}
            <button
              onClick={() => navigateTo('9_my_complaints')}
              className={`flex flex-col items-center gap-1 py-1 transition-colors ${
                currentScreen === '9_my_complaints' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px]">Complaints</span>
            </button>

            {/* Floating Action Report (+) in Center */}
            <button
              onClick={() => navigateTo('6_select_problem_type')}
              className="w-12 h-12 -mt-6 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all border-4 border-white"
              title="Report an Issue"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigateTo('12_notifications')}
              className={`relative flex flex-col items-center gap-1 py-1 transition-colors ${
                currentScreen === '12_notifications' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Bell className="w-5 h-5 stroke-[2.2]" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
              <span className="text-[10px]">Alerts</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => navigateTo('13_profile')}
              className={`flex flex-col items-center gap-1 py-1 transition-colors ${
                currentScreen === '13_profile' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <User className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px]">Profile</span>
            </button>
          </nav>
        )}

        {/* Admin Bottom Navigation Bar (Screens 15, 16) */}
        {isAdminApp && (
          <nav className="h-16 bg-white border-t border-slate-100 flex items-center justify-around px-3 z-30 select-none shrink-0 shadow-lg">
            <button
              onClick={() => navigateTo('15_admin_dashboard')}
              className={`flex flex-col items-center gap-1 py-1 transition-colors ${
                currentScreen === '15_admin_dashboard' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px]">Dashboard</span>
            </button>

            <button
              onClick={() => navigateTo('16_admin_complaints')}
              className={`flex flex-col items-center gap-1 py-1 transition-colors ${
                currentScreen === '16_admin_complaints' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px]">Complaints</span>
            </button>

            <button
              onClick={() => setShowWorkersModal(true)}
              className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="text-[10px]">Workers</span>
            </button>

            <button
              onClick={() => setShowAnnouncementsModal(true)}
              className="flex flex-col items-center gap-1 py-1 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <Megaphone className="w-5 h-5" />
              <span className="text-[10px]">Notices</span>
            </button>
          </nav>
        )}
      </div>

      {/* Global Modals */}
      {showEmergencyModal && (
        <EmergencyModal
          contacts={emergencyContacts}
          onClose={() => setShowEmergencyModal(false)}
        />
      )}

      {showAnnouncementsModal && (
        <AnnouncementsModal
          announcements={announcements}
          onClose={() => setShowAnnouncementsModal(false)}
        />
      )}

      {showConfigModal && (
        <BackendConfigModal onClose={() => setShowConfigModal(false)} />
      )}

      {showWorkersModal && (
        <WorkersModal workers={workers} onClose={() => setShowWorkersModal(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
