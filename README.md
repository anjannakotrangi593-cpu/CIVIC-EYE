# CIVICEYE – Smart Village Complaint Management System

CIVICEYE is a complete, production-ready civic complaint reporting and administrative tracking system designed specifically for village municipal governance, Gram Panchayats, electrical emergency safety, and local public infrastructure maintenance.

---

## 📱 20-Screen Architectural Mapping

The user interface reproduces the 20-screen reference layout:

| # | Screen Name | Functionality & Flow |
|---|---|---|
| **1** | **Splash Screen** | App branding, village illustration, "Get Started", "I'm Admin" shortcuts |
| **2** | **Role Selection** | Choice between Citizen (Resident) and Admin / Officer (Official) |
| **3** | **Citizen Login** | Mobile number + password authentication, sign up toggle, OTP option |
| **4** | **OTP Verification** | 6-digit verification code with resend countdown & demo auto-fill |
| **5** | **Home Dashboard (Citizen)** | Hero banner, 4 quick actions (Report, Complaints, Map, Emergency), recent list |
| **6** | **Select Problem Type** | Strict village categories: Garbage, Road, Street Light, Water, Drainage, Electricity, Others |
| **7** | **Upload & Description** | Camera/photo upload, GPS geolocation, description textarea, confirmation review |
| **8** | **Submission Success** | Animated checkmark, unique Complaint ID (`CIV12345`), copy ID, navigation |
| **9** | **My Complaints (Citizen)** | Status filter tabs (All, Pending, In Progress, Completed), search, grievance cards |
| **10** | **Complaint Details (Citizen)** | Photo, category, location, status lifecycle tracker (`Submitted → Verified → In Progress → Resolved`) |
| **11** | **Nearby Issues (Map)** | Interactive village map canvas, GPS markers, distance calculation, privacy protection |
| **12** | **Notifications** | In-app alerts for status updates, verification notes, announcements, mark all read |
| **13** | **Profile (Citizen)** | Citizen details, stats counter, edit profile, emergency directory, backend config |
| **14** | **Admin Password Login** | Secure official credentials gateway with lock shield graphics (`admin123`) |
| **15** | **Admin Dashboard** | Metric cards (Total, Pending, In Progress, Resolved), triage shortcuts, urgent hazard alerts |
| **16** | **All Complaints (Admin)** | Searchable, filterable complaint registry by category, status, priority, and locality |
| **17** | **Admin View Details** | Submitter contact verification, field notes, department routing, action bar |
| **18** | **Assign Worker & Update Status** | Lineman/worker dropdown, priority (Low/Medium/High/Urgent), mandatory rejection reason |
| **19** | **Mark as Completed** | Confirmation dialog, resolution summary note, optional work completion after-photo |
| **20** | **Completed + Comments Feed**| Citizen & Municipal team discussion thread with interactive comment posting |

---

## ⚡ Strict Project Scope: Problem Categories

1. **Garbage Collection**: Uncollected garbage, overflowing public bins, illegal dumping, dead animal disposal.
2. **Road Damage and Repairs**: Potholes on main roads, washed-out paths, damaged culverts, missing barriers.
3. **Street Light Problems**: Dark streets, flickering bulbs, damaged light poles, timer malfunctions.
4. **Water Supply Problems**: Drinking water supply interruption, pipeline bursts, contaminated water, broken handpumps.
5. **Drainage and Sewage Problems**: Clogged open drains, overflowing sewage on roads, stagnant wastewater.
6. **Electricity Services / Electrical Works**: **High-hazard category** featuring prominent electrical safety warnings for exposed live wires, sparking transformers, fallen poles, and unscheduled power cuts. Direct dial to 24x7 lineman emergency (`1912`).
7. **Other Village Services**: Fully flexible option allowing custom problem title, custom explanation, and optional department selection.

---

## 🔒 Security & Privacy Guarantees

- **Role-Based Access Control (RBAC)**: Citizen registration strictly sets `role: "citizen"`. Admin privileges cannot be self-assigned.
- **Privacy Enforcement**: The public "Nearby Issues" map displays only civic problem details, location, and photos; **citizen personal phone numbers, emails, and profiles are never exposed publicly**.
- **Mandatory Rejection & Duplicate Reasons**: Admins cannot reject or flag duplicate complaints without providing a transparent explanation recorded in the audit trail.
- **Eight Pillars of Hardened Rules**: `firestore.rules` enforces immutable fields (`createdAt`, `citizenId`), schema validation, size limits, and action-based update gates.

---

## 🛠️ Configuration & Credentials

### Environment Variables (`.env`)

```env
# Optional Firebase Live Cloud credentials:
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="civiceye.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="civiceye-village"
VITE_FIREBASE_STORAGE_BUCKET="civiceye-village.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef"

# Optional Google Maps API Key:
VITE_GOOGLE_MAPS_API_KEY="AIzaSy..."
```

*Note: If no Firebase cloud project is configured, CIVICEYE operates seamlessly in offline-first persistent mode using browser local storage, with complete real-time event subscriptions, status transitions, and pre-seeded Gram Panchayat demo data.*

---

## 🚀 Testing & Deployment

- **Dev Server**: `npm run dev` (Runs on port 3000)
- **Compile Check**: `npm run build`
- **Type & Lint Check**: `npm run lint`
- **Default Credentials for Quick Testing**:
  - **Citizen Login**: Mobile `9876543210`, Password `pass123` (or OTP `123456`)
  - **Admin Login**: Password `admin123`
