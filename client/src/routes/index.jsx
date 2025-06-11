import { createBrowserRouter } from 'react-router';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../components/auth/LoginPage';
import Dashboard from '../components/dashboard/Dashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';
import NurseLayout from '../components/layouts/NurseLayout';
import NurseDashboard from '../pages/NurseDashboard';
import StudentsPage from '../pages/StudentsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/nurse',
    element: (
      <RoleProtectedRoute allowedRoles={['nurse', 'admin']}>
        <NurseLayout />
      </RoleProtectedRoute>
    ), children: [
      {
        index: true,
        element: <NurseDashboard />,
      },
      {
        path: 'dashboard',
        element: <NurseDashboard />,
      }, {
        path: 'students',
        element: <StudentsPage />,
      },
      {
        path: 'health-profiles',
        element: <div>Health Profiles Page - Coming Soon</div>, // Placeholder
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
    ],
  },
]);

export default router;