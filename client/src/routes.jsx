// Application routes configuration
import React from "react";
import { Navigate } from "react-router-dom";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";

// Layout Components
import AdminLayout from "./layouts/AdminLayout";
import ParentLayout from "./layouts/ParentLayout";
import NurseLayout from "./layouts/NurseLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import StudentLayout from "./layouts/StudentLayout";
import PublicLayout from "./layouts/PublicLayout";

// Public Pages
import Home from "./pages/public/Home";
// Temporarily using magnus components for some pages
import About from "./components/magnus/MagnusAbout";
import Blog from "./components/magnus/MagnusFeatures"; // Using Features as Blog
import BlogPost from "./components/magnus/MagnusFeatures"; // Using Features as BlogPost
import Contact from "./components/magnus/MagnusContact";
import HealthResources from "./components/magnus/MagnusDoctors";
import MagnusHealth from './components/magnus/MagnusHealth';// Using Doctors as HealthResources
import MagnusTestimonials from './components/magnus/MagnusTestimonials';

// Dashboard Pages - All dashboards are implemented
import NurseDashboard from "./pages/nurse/Dashboard";
import ParentDashboard from "./pages/parent/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import ManagerDashboard from "./pages/manager/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";

// Health Records
import HealthRecordsList from "./pages/health/HealthRecordsList";
import HealthRecordForm from "./pages/health/HealthRecordForm";
import HealthRecordView from "./pages/health/HealthRecordView";

// Medication Management - All implemented components
import MedicationsList from "./pages/medications/MedicationsList";
import MedicationRequest from "./pages/medications/MedicationRequest";
import MedicationAdministration from "./pages/medications/MedicationAdministration";
import MedicationAdministrationRecord from "./pages/medications/MedicationAdministrationRecord";
import MedicationApproval from "./pages/medications/MedicationApproval";
import MedicationDashboard from "./pages/medications/MedicationDashboard";
import MedicationReports from "./pages/medications/MedicationReports";
import BatchAdministration from "./pages/medications/BatchAdministration";
import ParentMedicationTracking from "./pages/medications/ParentMedicationTracking";
import MedicationInventory from "./pages/medications/MedicationInventory";
// Note: MedicationHistory.jsx exists but appears to be empty/not implemented

// Import HealthDeclaration and MedicationForm components
import HealthDeclaration from "./components/health/HealthDeclaration";
import MedicationForm from "./components/health/MedicationForm";
import StudentInfo from "./components/student/StudentInfo";

// Medical Events - Fully implemented components
import MedicalEventsList from "./pages/medical-events/MedicalEventsList";
import MedicalEventForm from "./pages/medical-events/MedicalEventForm";
import MedicalEventDetails from "./pages/medical-events/MedicalEventDetails";
import MedicalEventsDashboard from "./pages/medical-events/MedicalEventsDashboard";
import MedicalEventReports from "./pages/medical-events/MedicalEventReports";

// Vaccinations - All implemented components
import VaccinationCampaigns from "./pages/vaccinations/VaccinationCampaigns";
import VaccinationConsentForm from "./pages/vaccinations/VaccinationConsentForm";
import VaccinationRecords from "./pages/vaccinations/VaccinationRecords";
import VaccinationScheduler from "./pages/admin/VaccinationScheduler";
const VaccinationSchedule = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Vaccination Schedule</h1>
    <p>This feature is coming soon.</p>
  </div>
);

// Health Checks - Using components from health-checks folder
import HealthCheckCampaigns from "./pages/health-checks/HealthCheckCampaigns";
import HealthCheckConsentForm from "./pages/health-checks/HealthCheckConsentForm";
import HealthCheckResults from "./pages/health-checks/HealthCheckResults";
const HealthCheckSchedule = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Health Check Schedule</h1>
    <p>This feature is coming soon.</p>
  </div>
);

// Admin Management
import PendingApprovals from "./pages/admin/PendingApprovals";
import AdminActivities from "./pages/admin/Activities";

// User Management

import UsersList from "./pages/admin/UsersList";
import UserProfile from "./pages/common/UserProfile";
const UserSettings = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">User Settings</h1>
    <p>This feature is coming soon.</p>
  </div>
);

// Reports
const ReportsOverview = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Reports Overview</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const HealthStatusReport = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Health Status Report</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const MedicationReport = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Medication Report</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const VaccinationReport = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Vaccination Report</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const IncidentReport = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Incident Report</h1>
    <p>This feature is coming soon.</p>
  </div>
);

// System Settings Components (Placeholders)
const SystemSettings = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">System Settings</h1>
    <p>Manage all system configuration and settings.</p>
  </div>
);

const GeneralSettings = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">General Settings</h1>
    <p>Configure general system parameters.</p>
  </div>
);

const SecuritySettings = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Security Settings</h1>
    <p>Configure system security parameters and access controls.</p>
  </div>
);

const BackupSettings = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Backup & Maintenance</h1>
    <p>Configure data backup and system maintenance options.</p>
  </div>
);

const NotificationSettings = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Notification Settings</h1>
    <p>Configure system notifications and alerts.</p>
  </div>
);

// Staff Management Components (for Manager)
import StaffDashboard from "./pages/manager/StaffDashboard";
const StaffDirectory = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Staff Directory</h1>
    <p>View and search the complete staff directory.</p>
  </div>
);

const StaffScheduling = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Staff Scheduling</h1>
    <p>Manage schedules and shifts for medical staff.</p>
  </div>
);

// Resource Management Components (for Manager)
import ResourceManagement from "./pages/manager/ResourceManagement";

const ResourceInventory = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Resource Inventory</h1>
    <p>Track and manage inventory of medical resources.</p>
  </div>
);

const ResourceRequests = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Resource Requests</h1>
    <p>Manage and approve resource requisition requests.</p>
  </div>
);

// Student Records Components (for Nurse)
import StudentRecords from "./pages/nurse/StudentRecords";
const StudentSearch = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Student Search</h1>
    <p>Search for students and access their medical information.</p>
  </div>
);

// Activity Log Components
import ActivityLog from "./pages/common/ActivityLog";

// Calendar Component
import Calendar from "./pages/common/Calendar";

// Parent Resource Center Component
const ParentResources = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Parent Resource Center</h1>
    <p>Access all health resources and educational materials for parents.</p>
  </div>
);

// Reports Components
import AdminMedicationReports from "./pages/admin/reports/MedicationReports";
import VaccinationReports from "./pages/admin/reports/VaccinationReports"; 
import HealthReports from "./pages/admin/reports/HealthReports";

// Define routes accessible by different user roles
const adminRoutes = [
  {
    path: "/admin",
    element: (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminLayout>
        <UsersList />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/users/:id",
    element: (
      <AdminLayout>
        <UserProfile />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/reports/*",
    element: (
      <AdminLayout>
        <ReportsOverview />
      </AdminLayout>
    ),
  },
  // System Settings routes
  {
    path: "/admin/settings",
    element: (
      <AdminLayout>
        <SystemSettings />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/settings/general",
    element: (
      <AdminLayout>
        <GeneralSettings />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/settings/security",
    element: (
      <AdminLayout>
        <SecuritySettings />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/settings/backup",
    element: (
      <AdminLayout>
        <BackupSettings />
      </AdminLayout>
    ),
  }, {
    path: "/admin/settings/notifications",
    element: (
      <AdminLayout>
        <NotificationSettings />
      </AdminLayout>
    ),
  },
  // Management routes
  {
    path: "/admin/pending-approvals",
    element: (
      <AdminLayout>
        <PendingApprovals />
      </AdminLayout>
    ),
  }, {
    path: "/admin/activities",
    element: (
      <AdminLayout>
        <AdminActivities />
      </AdminLayout>
    ),
  },
  {
    path: "/admin/vaccination-scheduler",
    element: (
      <AdminLayout>
        <VaccinationScheduler />
      </AdminLayout>
    ),
  },
  // More admin routes...
];

const managerRoutes = [
  {
    path: "/manager",
    element: (
      <ManagerLayout>
        <ManagerDashboard />
      </ManagerLayout>
    ),
  },
  // Staff Management
  {
    path: "/manager/staff",
    element: (
      <ManagerLayout>
        <StaffDashboard />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/staff/directory",
    element: (
      <ManagerLayout>
        <StaffDirectory />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/staff/scheduling",
    element: (
      <ManagerLayout>
        <StaffScheduling />
      </ManagerLayout>
    ),
  },
  // Resource Management
  {
    path: "/manager/resources",
    element: (
      <ManagerLayout>
        <ResourceManagement />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/resources/inventory",
    element: (
      <ManagerLayout>
        <ResourceInventory />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/resources/requests",
    element: (
      <ManagerLayout>
        <ResourceRequests />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/activities",
    element: (
      <ManagerLayout>
        <ActivityLog />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/calendar",
    element: (
      <ManagerLayout>
        <Calendar />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/reports/*",
    element: (
      <ManagerLayout>
        <ReportsOverview />
        <HealthReports />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/reports/medications",
    element: (
      <ManagerLayout>
        <AdminMedicationReports />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/reports/vaccinations",
    element: (
      <ManagerLayout>
        <VaccinationReports />
      </ManagerLayout>
    ),
  },
  {
    path: "/manager/reports/Incidents",
    element: (
      <ManagerLayout>
        <HealthReports />
      </ManagerLayout>
    ),
  },
  // More manager routes...
];

const nurseRoutes = [
  {
    path: "/nurse",
    element: (
      <NurseLayout>
        <NurseDashboard />
      </NurseLayout>
    ),
  },  // Student Records - Fixed order to avoid conflicts
  {
    path: "/nurse/students/search",
    element: (
      <NurseLayout>
        <StudentSearch />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/students/:id/record",
    element: (
      <NurseLayout>
        <HealthRecordView />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/students",
    element: (
      <NurseLayout>
        <StudentRecords />
      </NurseLayout>
    ),
  },
  // Activities and Calendar
  {
    path: "/nurse/activities",
    element: (
      <NurseLayout>
        <ActivityLog />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/calendar",
    element: (
      <NurseLayout>
        <Calendar />
      </NurseLayout>
    ),
  },
  // Fixed the route ordering - more specific routes first, then routes with dynamic segments
  {
    path: "/nurse/medical-events/new",
    element: (
      <NurseLayout>
        <MedicalEventForm />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medical-events/dashboard",
    element: (
      <NurseLayout>
        <MedicalEventsDashboard />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medical-events/reports",
    element: (
      <NurseLayout>
        <MedicalEventReports />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medical-events/:id/edit",
    element: (
      <NurseLayout>
        <MedicalEventForm />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medical-events/:id",
    element: (
      <NurseLayout>
        <MedicalEventDetails />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medical-events",
    element: (
      <NurseLayout>
        <MedicalEventsList />
      </NurseLayout>
    ),
  },
  // Events routes
  {
    path: "/nurse/events/new",
    element: (
      <NurseLayout>
        <MedicalEventForm />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/events",
    element: (
      <NurseLayout>
        <MedicalEventsList />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/events/:id",
    element: (
      <NurseLayout>
        <MedicalEventDetails />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medications/admin",
    element: (
      <NurseLayout>
        <MedicationAdministration />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medications/administer/:medicationId",
    element: (
      <NurseLayout>
        <MedicationAdministrationRecord />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medications/dashboard",
    element: (
      <NurseLayout>
        <MedicationDashboard />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medications/inventory",
    element: (
      <NurseLayout>
        <MedicationInventory />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medications",
    element: (
      <NurseLayout>
        <MedicationsList />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medications/approval",
    element: (
      <NurseLayout>
        <MedicationApproval />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medications/reports",
    element: (
      <NurseLayout>
        <MedicationReports />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medications/batch",
    element: (
      <NurseLayout>
        <BatchAdministration />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/vaccinations",
    element: (
      <NurseLayout>
        <VaccinationCampaigns />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/vaccinations/:id/schedule",
    element: (
      <NurseLayout>
        <VaccinationSchedule />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/vaccinations/:id/records",
    element: (
      <NurseLayout>
        <VaccinationRecords />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/health-checks",
    element: (
      <NurseLayout>
        <HealthCheckCampaigns />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/health-checks/:id/schedule",
    element: (
      <NurseLayout>
        <HealthCheckSchedule />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/health-checks/:id/results",
    element: (
      <NurseLayout>
        <HealthCheckResults />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/health-declaration",
    element: (
      <NurseLayout>
        <HealthDeclaration />
      </NurseLayout>
    ),
  },
  {
    path: "/nurse/medication-form",
    element: (
      <NurseLayout>
        <MedicationForm />
      </NurseLayout>
    ),
  },
  // More nurse routes...
];

const parentRoutes = [
  {
    path: "/parent",
    element: (
      <ParentLayout>
        <ParentDashboard />
      </ParentLayout>
    ),
  },
  // Fixed the route ordering - more specific routes first, then routes with dynamic segments
  {
    path: "/parent/health-records/new",
    element: (
      <ParentLayout>
        <HealthRecordForm />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/health-records",
    element: (
      <ParentLayout>
        <HealthRecordsList />
      </ParentLayout>
    ),
  },  {
    path: "/parent/health-records/:id",
    element: (
      <ParentLayout>
        <HealthRecordView />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/health-records/:id/edit",
    element: (
      <ParentLayout>
        <HealthRecordForm />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/medications/request",
    element: (
      <ParentLayout>
        <MedicationRequest />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/medications",
    element: (
      <ParentLayout>
        <ParentMedicationTracking />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/vaccinations",
    element: (
      <ParentLayout>
        <VaccinationCampaigns />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/vaccinations/:id/consent",
    element: (
      <ParentLayout>
        <VaccinationConsentForm />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/health-checks",
    element: (
      <ParentLayout>
        <HealthCheckCampaigns />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/health-checks/:id/consent",
    element: (
      <ParentLayout>
        <HealthCheckConsentForm />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/health-checks/:id/results",
    element: (
      <ParentLayout>
        <HealthCheckResults />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/profile",
    element: (
      <ParentLayout>
        <UserProfile />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/settings",
    element: (
      <ParentLayout>
        <UserSettings />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/activities",
    element: (
      <ParentLayout>
        <ActivityLog />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/calendar",
    element: (
      <ParentLayout>
        <Calendar />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/health-declaration",
    element: (
      <ParentLayout>
        <HealthDeclaration />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/medication-form",
    element: (
      <ParentLayout>
        <MedicationForm />
      </ParentLayout>
    ),
  },
  {
    path: "/parent/resources",
    element: (
      <ParentLayout>
        <ParentResources />
      </ParentLayout>
    ),
  },
  // More parent routes...
];

const studentRoutes = [
  {
    path: "/student",
    element: (
      <StudentLayout>
        <StudentDashboard />
      </StudentLayout>
    ),
  },
  {
    path: "/student/health-records",
    element: (
      <StudentLayout>
        <HealthRecordsList />
      </StudentLayout>
    ),
  },
  {
    path: "/student/health-records/:id",
    element: (
      <StudentLayout>
        <HealthRecordView />
      </StudentLayout>
    ),
  },
  {
    path: "/student/medications",
    element: (
      <StudentLayout>
        <MedicationsList />
      </StudentLayout>
    ),
  },
  {
    path: "/student/vaccinations",
    element: (
      <StudentLayout>
        <VaccinationRecords />
      </StudentLayout>
    ),
  },
  {
    path: "/student/health-checks",
    element: (
      <StudentLayout>
        <HealthCheckResults />
      </StudentLayout>
    ),
  }, {
    path: "/student/profile",
    element: (
      <StudentLayout>
        <UserProfile />
      </StudentLayout>
    ),
  },
  {
    path: "/student/info",
    element: (
      <StudentLayout>
        <StudentInfo />
      </StudentLayout>
    ),
  },
  {
    path: "/student/activities",
    element: (
      <StudentLayout>
        <ActivityLog />
      </StudentLayout>
    ),
  },
  {
    path: "/student/calendar",
    element: (
      <StudentLayout>
        <Calendar />
      </StudentLayout>
    ),
  },
  // More student routes...
];

const publicRoutes = [
  { path: '/', element: <PublicLayout><MagnusHealth /></PublicLayout> },
  { path: '/home', element: <PublicLayout><MagnusHealth /></PublicLayout> },
  { path: '/about', element: <PublicLayout><About /></PublicLayout> },
  { path: '/blog', element: <PublicLayout><Blog /></PublicLayout> },
  { path: '/blog/:id', element: <PublicLayout><BlogPost /></PublicLayout> }, { path: '/contact', element: <PublicLayout><Contact /></PublicLayout> },
  { path: '/resources', element: <PublicLayout><HealthResources /></PublicLayout> },
  { path: '/testimonials', element: <PublicLayout><MagnusTestimonials /></PublicLayout> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
];

const routes = [
  ...publicRoutes,
  ...adminRoutes,
  ...managerRoutes,
  ...nurseRoutes,
  ...parentRoutes,
  ...studentRoutes,
];

export default routes;
