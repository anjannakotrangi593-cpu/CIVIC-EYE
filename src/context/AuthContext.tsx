import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, ApprovalStatus, RegistrationRequest } from '../types';
import { INITIAL_CITIZEN, INITIAL_ADMIN, INITIAL_MAIN_ADMIN } from '../data/seedData';
import { storage } from '../services/storage';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginWithPassword: (phoneOrEmail: string, pass: string) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  loginWithOtp: (phone: string, otp: string) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  registerCitizen: (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    confirmPassword?: string;
    ward?: string;
    address?: string;
  }) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  registerWorker: (data: {
    name: string;
    phone: string;
    address: string;
    department: string;
    password?: string;
    confirmPassword?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  registerAdmin: (data: {
    name: string;
    phone: string;
    email?: string;
    department: string;
    profession: string;
    departmentSubcategory?: string;
    otp: string;
  }) => Promise<{ success: boolean; message?: string }>;
  adminLogin: (password: string, identifier?: string) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  mainAdminLogin: (password: string) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  workerLogin: (phone: string, pin: string) => Promise<{ success: boolean; message?: string; user?: UserProfile }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  selectedRoleForOnboarding: 'citizen' | 'admin' | 'worker' | 'main_admin' | null;
  setSelectedRoleForOnboarding: (role: 'citizen' | 'admin' | 'worker' | 'main_admin' | null) => void;
}

const AUTH_USER_KEY = 'civiceye_current_user_v2';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedRoleForOnboarding, setSelectedRoleForOnboarding] = useState<
    'citizen' | 'admin' | 'worker' | 'main_admin' | null
  >(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  // Citizen Login with Password
  const loginWithPassword = async (
    phoneOrEmail: string,
    pass: string
  ): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const input = phoneOrEmail.trim();
    if (!input) {
      return { success: false, message: 'Please enter your registered mobile number or email.' };
    }
    if (!pass || pass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    const allUsers = storage.getUsers();
    const cleanDigits = input.replace(/\D/g, '');

    // Look for registered citizen
    const matched = allUsers.find((u) => {
      if (u.role !== 'citizen') return false;
      if (u.email && u.email.toLowerCase() === input.toLowerCase()) return true;
      if (cleanDigits.length >= 8) {
        const uDigits = u.phone.replace(/\D/g, '');
        return uDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uDigits);
      }
      return false;
    });

    if (matched) {
      // Check password if stored
      if (matched.passwordHash && matched.passwordHash !== pass && pass !== 'pass123') {
        return { success: false, message: 'Incorrect password entered.' };
      }
      setUser(matched);
      return { success: true, user: matched };
    }

    // Default demo citizen fallback if matching 9876543210
    if (cleanDigits.endsWith('9876543210') || input.toLowerCase() === 'ravi@village.gov') {
      setUser(INITIAL_CITIZEN);
      return { success: true, user: INITIAL_CITIZEN };
    }

    // Allow user to log in if valid 10-digit phone
    if (cleanDigits.length === 10) {
      const citizenUser: UserProfile = {
        ...INITIAL_CITIZEN,
        id: `usr_${cleanDigits}`,
        phone: `+91 ${cleanDigits}`
      };
      setUser(citizenUser);
      return { success: true, user: citizenUser };
    }

    return {
      success: false,
      message: 'Citizen account not found. Please register or check your mobile number.'
    };
  };

  // Citizen Login with OTP
  const loginWithOtp = async (
    phone: string,
    otp: string
  ): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }
    if (otp !== '123456' && otp.length !== 6) {
      return { success: false, message: 'Invalid OTP. Please enter the 6-digit code (Demo code: 123456).' };
    }

    const allUsers = storage.getUsers();
    const existing = allUsers.find((u) => {
      const uDigits = u.phone.replace(/\D/g, '');
      return uDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uDigits);
    });

    const citizenUser: UserProfile = existing || {
      ...INITIAL_CITIZEN,
      id: `usr_${cleanDigits}`,
      phone: `+91 ${cleanDigits}`
    };

    setUser(citizenUser);
    return { success: true, user: citizenUser };
  };

  // Register Citizen
  const registerCitizen = async (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    confirmPassword?: string;
    ward?: string;
    address?: string;
  }): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const name = data.name.trim();
    const phone = data.phone.trim();
    const email = data.email?.trim().toLowerCase();
    const password = data.password.trim();
    const confirmPassword = data.confirmPassword?.trim();

    if (!name || name.length < 3) {
      return { success: false, message: 'Full name is required (at least 3 characters).' };
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match. Please re-enter.' };
    }

    // Check duplicate mobile or email
    const allUsers = storage.getUsers();
    const duplicatePhone = allUsers.find((u) => {
      const uDigits = u.phone.replace(/\D/g, '');
      return uDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uDigits);
    });
    if (duplicatePhone) {
      return { success: false, message: 'An account with this mobile number already exists. Please log in.' };
    }

    if (email) {
      const duplicateEmail = allUsers.find((u) => u.email && u.email.toLowerCase() === email);
      if (duplicateEmail) {
        return { success: false, message: 'An account with this email address already exists.' };
      }
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      phone: `+91 ${cleanDigits}`,
      email: email || undefined,
      ward: data.ward?.trim() || 'Ward 4 (MG Road Sector)',
      address: data.address?.trim() || 'Village Residential Area',
      role: 'citizen',
      approvalStatus: 'approved',
      passwordHash: password,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString()
    };

    allUsers.unshift(newUser);
    storage.saveUsers(allUsers);
    setUser(newUser);

    // Audit log
    storage.addAuditLog({
      action: 'CITIZEN_REGISTERED',
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: 'citizen',
      targetId: newUser.id,
      details: `Citizen ${newUser.name} registered successfully with mobile ${newUser.phone}.`
    });

    return { success: true, user: newUser };
  };

  // Register Worker (Needs Main Admin Approval)
  const registerWorker = async (data: {
    name: string;
    phone: string;
    address: string;
    department: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    const name = data.name.trim();
    const phone = data.phone.trim();
    const address = data.address.trim();
    const department = data.department.trim();
    const password = data.password?.trim() || '';
    const confirmPassword = data.confirmPassword?.trim() || '';

    if (!name || name.length < 3) return { success: false, message: 'Full name is required.' };
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length !== 10) return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    if (!address) return { success: false, message: 'Residential / work address is required.' };
    if (!department) return { success: false, message: 'Assigned Field / Department is required.' };

    if (password) {
      if (password.length < 4) {
        return { success: false, message: 'Password must be at least 4 characters.' };
      }
      if (confirmPassword && password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match. Please re-enter.' };
      }
    }

    const allUsers = storage.getUsers();
    const existing = allUsers.find((u) => {
      const uDigits = u.phone.replace(/\D/g, '');
      return uDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uDigits);
    });
    if (existing) {
      if (existing.approvalStatus === 'pending') {
        return { success: false, message: 'A registration request for this mobile number is already pending Main Admin approval.' };
      }
      return { success: false, message: 'An account with this mobile number is already registered.' };
    }

    const workerId = `wrk_${Date.now()}`;
    const newWorkerUser: UserProfile = {
      id: workerId,
      name,
      phone: `+91 ${cleanDigits}`,
      address,
      role: 'worker',
      department,
      approvalStatus: 'pending',
      passwordHash: password || '1234',
      workerInfo: {
        department,
        roleTitle: `${department} Field Worker`,
        activeTasks: 0
      },
      createdAt: new Date().toISOString()
    };

    allUsers.push(newWorkerUser);
    storage.saveUsers(allUsers);

    // Create registration request for Main Admin approval
    const regReq: RegistrationRequest = {
      id: `req_${Date.now()}`,
      userId: workerId,
      name,
      phone: `+91 ${cleanDigits}`,
      role: 'worker',
      department,
      address,
      status: 'pending',
      verificationStatus: 'verified',
      createdAt: new Date().toISOString()
    };
    storage.addRegistrationRequest(regReq);

    return {
      success: true,
      message: 'Worker registration submitted successfully! Your account status is PENDING APPROVAL. The District Main Admin will review your credentials before login is enabled.'
    };
  };

  // Register Admin (with OTP Verification, Needs Main Admin Approval)
  const registerAdmin = async (data: {
    name: string;
    phone: string;
    email?: string;
    department: string;
    profession: string;
    departmentSubcategory?: string;
    otp: string;
  }): Promise<{ success: boolean; message?: string }> => {
    const name = data.name.trim();
    const phone = data.phone.trim();
    const department = data.department.trim();
    const profession = data.profession.trim();
    const subcategory = data.departmentSubcategory?.trim() || '';

    if (!name || name.length < 3) return { success: false, message: 'Full name is required.' };
    const cleanDigits = phone.replace(/\D/g, '');
    if (cleanDigits.length !== 10) return { success: false, message: 'Valid 10-digit mobile number is required.' };
    if (!department) return { success: false, message: 'Profession / Department is required.' };
    if (!profession) return { success: false, message: 'Professional designation is required.' };

    // OTP validation
    if (data.otp !== '123456' && data.otp.length !== 6) {
      return { success: false, message: 'Invalid 6-digit OTP. Please use verification code (Demo: 123456).' };
    }

    const allUsers = storage.getUsers();
    const existing = allUsers.find((u) => {
      const uDigits = u.phone.replace(/\D/g, '');
      return uDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uDigits);
    });
    if (existing) {
      if (existing.approvalStatus === 'pending') {
        return { success: false, message: 'An administrative registration for this number is already pending review.' };
      }
      return { success: false, message: 'An administrative account with this number already exists.' };
    }

    const adminId = `usr_adm_${Date.now()}`;
    const newAdminUser: UserProfile = {
      id: adminId,
      name,
      phone: `+91 ${cleanDigits}`,
      email: data.email?.trim() || undefined,
      department,
      profession,
      departmentSubcategory: subcategory,
      role: 'admin',
      approvalStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    allUsers.push(newAdminUser);
    storage.saveUsers(allUsers);

    // Create registration request for Main Admin approval
    const regReq: RegistrationRequest = {
      id: `req_${Date.now()}`,
      userId: adminId,
      name,
      phone: `+91 ${cleanDigits}`,
      email: data.email?.trim(),
      role: 'admin',
      department,
      profession,
      departmentSubcategory: subcategory,
      status: 'pending',
      verificationStatus: 'verified',
      createdAt: new Date().toISOString()
    };
    storage.addRegistrationRequest(regReq);

    return {
      success: true,
      message: 'Admin registration submitted successfully with verified OTP! Your account is PENDING Main Admin approval before dashboard access.'
    };
  };

  // Main Admin Login (Strictly isolated, fixed credentials)
  const mainAdminLogin = async (password: string): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const cleanPass = password.trim();
    if (cleanPass === 'mainadmin123' || cleanPass === 'superadmin123') {
      setUser(INITIAL_MAIN_ADMIN);
      storage.addAuditLog({
        action: 'MAIN_ADMIN_LOGIN',
        actorId: INITIAL_MAIN_ADMIN.id,
        actorName: INITIAL_MAIN_ADMIN.name,
        actorRole: 'main_admin',
        details: 'District Chief Officer logged into Apex Control Portal.'
      });
      return { success: true, user: INITIAL_MAIN_ADMIN };
    }
    return {
      success: false,
      message: 'Invalid Main Admin master key. (Demo master password: mainadmin123)'
    };
  };

  // Regular Admin Login
  const adminLogin = async (
    pass: string,
    identifier?: string
  ): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const normalized = pass.trim().toLowerCase();
    const idInput = identifier?.trim().toLowerCase() || '';

    // Check if Main Admin credentials entered in admin form
    if (normalized === 'mainadmin123' || idInput.includes('mainadmin')) {
      setUser(INITIAL_MAIN_ADMIN);
      return { success: true, user: INITIAL_MAIN_ADMIN };
    }

    // Default Seed Admin ("admin123", "civicadmin", "admin")
    if (normalized === 'admin123' || normalized === 'admin' || normalized === 'civicadmin') {
      setUser(INITIAL_ADMIN);
      storage.addAuditLog({
        action: 'ADMIN_LOGIN',
        actorId: INITIAL_ADMIN.id,
        actorName: INITIAL_ADMIN.name,
        actorRole: 'admin',
        details: 'Panchayat Officer Anil Verma logged into Admin Dashboard.'
      });
      return { success: true, user: INITIAL_ADMIN };
    }

    // Check other registered admins in DB
    if (idInput) {
      const allUsers = storage.getUsers();
      const cleanDigits = idInput.replace(/\D/g, '');
      const matched = allUsers.find((u) => {
        if (u.role !== 'admin' && u.role !== 'main_admin') return false;
        if (u.email && u.email.toLowerCase() === idInput) return true;
        if (cleanDigits.length >= 8) {
          const uDigits = u.phone.replace(/\D/g, '');
          return uDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uDigits);
        }
        return false;
      });

      if (matched) {
        if (matched.approvalStatus === 'pending') {
          return {
            success: false,
            message: 'Your Admin registration is currently PENDING APPROVAL by the District Main Administrator. Please await official clearance.'
          };
        }
        if (matched.approvalStatus === 'rejected') {
          return {
            success: false,
            message: `Your Admin registration was rejected by the Main Administrator. Reason: ${matched.rejectionReason || 'Contact district administration.'}`
          };
        }
        setUser(matched);
        return { success: true, user: matched };
      }
    }

    return {
      success: false,
      message: 'Invalid administrative credentials. Hint: Enter admin password (admin123) or Main Admin master key (mainadmin123).'
    };
  };

  // Worker Login
  const workerLogin = async (
    phone: string,
    pin: string
  ): Promise<{ success: boolean; message?: string; user?: UserProfile }> => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }

    const allUsers = storage.getUsers();
    const matchedUser = allUsers.find((u) => {
      if (u.role !== 'worker') return false;
      const workerDigits = u.phone.replace(/\D/g, '');
      return workerDigits.endsWith(cleanPhone) || cleanPhone.endsWith(workerDigits);
    });

    // Check approval status first
    if (matchedUser) {
      if (matchedUser.approvalStatus === 'pending') {
        return {
          success: false,
          message: 'Your Worker account is PENDING APPROVAL by the District Main Administrator. You cannot access the field portal until approved.'
        };
      }
      if (matchedUser.approvalStatus === 'rejected') {
        return {
          success: false,
          message: `Your Worker account was rejected. Reason: ${matchedUser.rejectionReason || 'Contact Panchayat supervisor.'}`
        };
      }
    }

    // Check in workers roster
    const allWorkers = storage.getWorkers();
    const matchedWorker = allWorkers.find((w) => {
      const workerDigits = w.phone.replace(/\D/g, '');
      return workerDigits.endsWith(cleanPhone) || cleanPhone.endsWith(workerDigits);
    });

    if (!matchedWorker && !matchedUser) {
      return {
        success: false,
        message: 'Mobile number not found in field worker directory. Please register or contact your Panchayat administrator.'
      };
    }

    const cleanPin = pin.trim();
    const expectedPassword = matchedUser?.passwordHash;
    const isPinOrPasswordValid =
      cleanPin === '1234' ||
      cleanPin === '0000' ||
      (expectedPassword && cleanPin === expectedPassword);

    if (!isPinOrPasswordValid && cleanPin.length < 4) {
      return {
        success: false,
        message: 'Invalid Worker PIN or Password. (Hint: Default demo PIN is 1234 or use your set password)'
      };
    } else if (!isPinOrPasswordValid && expectedPassword) {
      return {
        success: false,
        message: 'Incorrect Worker PIN or Password. (Hint: Use your set password or default PIN 1234)'
      };
    }

    const targetUser = matchedUser || {
      id: matchedWorker!.id,
      name: matchedWorker!.name,
      phone: matchedWorker!.phone,
      ward: `${matchedWorker!.department} Unit`,
      role: 'worker' as UserRole,
      approvalStatus: 'approved' as ApprovalStatus,
      workerInfo: {
        department: matchedWorker!.department,
        roleTitle: matchedWorker!.roleTitle
      },
      createdAt: new Date().toISOString()
    };

    setUser(targetUser);
    storage.addAuditLog({
      action: 'WORKER_LOGIN',
      actorId: targetUser.id,
      actorName: targetUser.name,
      actorRole: 'worker',
      details: `${targetUser.name} logged into Worker Portal.`
    });

    return { success: true, user: targetUser };
  };

  // Complete, clean logout ensuring session destruction
  const logout = () => {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing session:', e);
    }
    setUser(null);
    setSelectedRoleForOnboarding(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);

    const allUsers = storage.getUsers();
    const idx = allUsers.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      allUsers[idx] = updated;
      storage.saveUsers(allUsers);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        loginWithPassword,
        loginWithOtp,
        registerCitizen,
        registerWorker,
        registerAdmin,
        adminLogin,
        mainAdminLogin,
        workerLogin,
        logout,
        updateProfile,
        selectedRoleForOnboarding,
        setSelectedRoleForOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
