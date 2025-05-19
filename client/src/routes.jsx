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

// Dashboard Pages
// Only implemented dashboards
import NurseDashboard from "./pages/nurse/Dashboard";
import ParentDashboard from "./pages/parent/Dashboard";
import UsersList from "./pages/admin/UsersList";

// Placeholder components for missing dashboards
const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const ManagerDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const StudentDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
    <p>This feature is coming soon.</p>
  </div>
);

// Health Records
import HealthRecordsList from "./pages/health/HealthRecordsList";
import HealthRecordForm from "./pages/health/HealthRecordForm";
// Placeholder for missing components
const HealthRecordView = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Health Record Details</h1>
    <p>This feature is coming soon.</p>
  </div>
);

// Medication Management
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

// Medical Events
const MedicalEventsList = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Medical Events List</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const MedicalEventForm = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Record Medical Event</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const MedicalEventDetails = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Medical Event Details</h1>
    <p>This feature is coming soon.</p>
  </div>
);

// Vaccinations
import VaccinationCampaigns from "./pages/vaccinations/VaccinationCampaigns";
const VaccinationConsentForm = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Vaccination Consent Form</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const VaccinationSchedule = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Vaccination Schedule</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const VaccinationRecords = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Vaccination Records</h1>
    <p>This feature is coming soon.</p>
  </div>
);

// Health Checks
import HealthCheckCampaigns from "./pages/health/HealthCheckCampaigns";
const HealthCheckConsentForm = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Health Check Consent Form</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const HealthCheckSchedule = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Health Check Schedule</h1>
    <p>This feature is coming soon.</p>
  </div>
);
const HealthCheckResults = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Health Check Results</h1>
    <p>This feature is coming soon.</p>
  </div>
);

// User Management
const UserProfile = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">User Profile</h1>
    <p>This feature is coming soon.</p>
  </div>
);
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
  {
    path: "/manager/reports/*",
    element: (
      <ManagerLayout>
        <ReportsOverview />
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
  },
  // Fixed the route ordering - more specific routes first, then routes with dynamic segments
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
  },
  {
    path: "/parent/health-records/:id",
    element: (
      <ParentLayout>
        <HealthRecordView />
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
  },
  {
    path: "/student/profile",
    element: (
      <StudentLayout>
        <UserProfile />
      </StudentLayout>
    ),
  },
  // More student routes...
];

const publicRoutes = [
  { path: '/', element: <MagnusHealth /> },
  { path: '/home', element: <MagnusHealth /> },
  { path: '/about', element: <PublicLayout><About /></PublicLayout> },
  { path: '/blog', element: <PublicLayout><Blog /></PublicLayout> },
  { path: '/blog/:id', element: <PublicLayout><BlogPost /></PublicLayout> },
  { path: '/contact', element: <PublicLayout><Contact /></PublicLayout> },
  { path: '/resources', element: <PublicLayout><HealthResources /></PublicLayout> },
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
