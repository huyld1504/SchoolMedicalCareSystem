import { createBrowserRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../components/auth/LoginPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';
import NurseLayout from '../components/layouts/NurseLayout';
import NurseDashboard from '../pages/NurseDashboard';
import StudentsPage from '../pages/StudentsPage';
import HealthProfilesPage from '../pages/HealthProfilesPage';
import MedicationHistoryPage from '../pages/MedicationHistoryPage';
import AppLayout from '../components/layouts/AppLayout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "welcome",
        element: <LandingPage />,
      }, {
        path: 'login',
        element: <LoginPage />,
      }, {
        path: 'nurse',
        element: (
          <RoleProtectedRoute allowedRoles={["nurse"]}>
            <NurseLayout />
          </RoleProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <NurseDashboard />,
          },
          {
            path: 'dashboard',
            element: <NurseDashboard />,
          },
          {
            path: 'students',
            element: <StudentsPage />,
          }, {
            path: 'health-profiles',
            element: <HealthProfilesPage />,
          },
          {
            path: 'health-profiles/:studentId',
            element: <HealthProfilesPage />,
          },
          {
            path: 'medication-history/:studentId',
            element: <MedicationHistoryPage />,
          },
          {
            path: 'medical-orders',
            element: <div>Medical Orders Page - Coming Soon</div>, // Placeholder
          },
          {
            path: 'reports',
            element: <div>Reports Page - Coming Soon</div>, // Placeholder
          },
          {
            path: 'settings',
            element: <div>Settings Page - Coming Soon</div>, // Placeholder
          },
        ]
      },
    ]
  }
]
);

export default router;